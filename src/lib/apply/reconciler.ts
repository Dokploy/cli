import chalk from "chalk";
import type { AuthConfig } from "../../utils/utils.js";
import * as api from "./api-client.js";
import { diffChildren, diffResource } from "./differ.js";
import { executePlan } from "./executor.js";
import { parseConfigFile } from "./parser.js";
import { formatSummary, printPlan } from "./reporter.js";
import type { Action, ApplyPlan, ApplyResult, ResourceType } from "./types.js";

export interface ReconcileOptions {
  filePath: string;
  dryRun: boolean;
  verbose: boolean;
}

export async function reconcile(
  auth: AuthConfig,
  options: ReconcileOptions,
): Promise<ApplyResult> {
  const { filePath, dryRun, verbose } = options;

  const config = await parseConfigFile(filePath);
  console.log(chalk.blue(`\nApplying ${filePath} to ${auth.url}...\n`));

  const serverMap = await resolveServerNames(auth, config);

  const plan = await buildPlan(auth, config, serverMap);

  printPlan(plan, dryRun, verbose);

  if (dryRun) {
    console.log(chalk.cyan("\n(dry-run) No changes applied."));
    return countPlan(plan);
  }

  const result = await executePlan(auth, plan);

  console.log(formatSummary(result));

  if (result.errors.length > 0) {
    console.log(chalk.red("\nErrors:"));
    for (const err of result.errors) {
      console.log(chalk.red(`  ${err.resource}: ${err.error}`));
    }
  }

  return result;
}

async function resolveServerNames(auth: AuthConfig, config: any): Promise<Map<string, string>> {
  const serverNames = new Set<string>();

  for (const env of config.environments) {
    for (const resourceType of ["applications", "compose", "postgres", "mysql", "mariadb", "mongo", "redis"]) {
      for (const resource of env[resourceType] ?? []) {
        if (resource.serverName) {
          serverNames.add(resource.serverName);
        }
      }
    }
  }

  if (serverNames.size === 0) return new Map();

  const servers = await api.listServers(auth);
  const serverMap = new Map<string, string>();

  for (const name of serverNames) {
    const match = servers.find((s: any) => s.name === name);
    if (!match) {
      throw new Error(`Server "${name}" not found. Available servers: ${servers.map((s: any) => s.name).join(", ")}`);
    }
    serverMap.set(name, match.serverId);
  }

  return serverMap;
}

async function buildPlan(auth: AuthConfig, config: any, serverMap: Map<string, string>): Promise<ApplyPlan> {
  const projects = await api.listProjects(auth);
  const matchingProjects = projects.filter((p: any) => p.name === config.name);

  if (matchingProjects.length > 1) {
    throw new Error(
      `Multiple projects named "${config.name}" found. Please resolve the ambiguity in the Dokploy UI.`,
    );
  }

  const remoteProject = matchingProjects[0];
  const projectAction = diffResource(
    "project",
    config.name,
    { name: config.name, description: config.description },
    remoteProject,
  );

  const environmentActions: Action[] = [];
  let remoteEnvironments: any[] = [];

  if (remoteProject) {
    remoteEnvironments = await api.listEnvironments(auth, remoteProject.projectId);
  }

  for (const envConfig of config.environments) {
    const remoteEnv = remoteEnvironments.find((e: any) => e.name === envConfig.name);
    const envAction = diffResource(
      "environment",
      envConfig.name,
      { name: envConfig.name, description: envConfig.description },
      remoteEnv,
    );

    envAction.children = [];

    if (remoteEnv) {
      const resourceActions = await buildResourceActions(auth, envConfig, remoteEnv, serverMap);
      envAction.children = resourceActions;
    } else {
      envAction.children = buildCreateActions(envConfig, serverMap);
    }

    environmentActions.push(envAction);
  }

  return { project: projectAction, environments: environmentActions };
}

async function buildResourceActions(
  auth: AuthConfig,
  envConfig: any,
  remoteEnv: any,
  serverMap: Map<string, string>,
): Promise<Action[]> {
  const actions: Action[] = [];

  for (const appConfig of envConfig.applications ?? []) {
    const remoteApps = remoteEnv.applications ?? [];
    const remoteApp = remoteApps.find((a: any) => a.name === appConfig.name);
    const configWithServer = resolveServer(appConfig, serverMap);
    const { domains, ports, mounts, redirects, security, schedules, ...appFields } = configWithServer;
    const action = diffResource("application", appConfig.name, appFields, remoteApp);

    action.children = [];
    if (remoteApp) {
      // Fetch full app details with all child resources
      const fullApp = await api.getApplication(auth, remoteApp.applicationId);
      if (domains) {
        action.children.push(...diffChildren("domain", domains, fullApp.domains ?? [], (d) => d.host as string));
      }
      if (ports) {
        action.children.push(...diffChildren("port", ports, fullApp.ports ?? [],
          (p) => `${p.publishedPort}:${p.protocol}`));
      }
      if (mounts) {
        action.children.push(...diffChildren("mount", mounts, fullApp.mounts ?? [], (m) => m.mountPath as string));
      }
      if (redirects) {
        action.children.push(...diffChildren("redirect", redirects, fullApp.redirects ?? [], (r) => r.regex as string));
      }
      if (security) {
        action.children.push(...diffChildren("security", security, fullApp.security ?? [], (s) => s.username as string));
      }
      if (schedules) {
        action.children.push(...diffChildren("schedule", schedules, fullApp.schedules ?? [], (s) => s.name as string));
      }
    } else {
      if (domains) action.children.push(...domains.map((d: any) => createAction("domain", d.host, d)));
      if (ports) action.children.push(...ports.map((p: any) => createAction("port", `${p.publishedPort}:${p.protocol}`, p)));
      if (mounts) action.children.push(...mounts.map((m: any) => createAction("mount", m.mountPath, m)));
      if (redirects) action.children.push(...redirects.map((r: any) => createAction("redirect", r.regex, r)));
      if (security) action.children.push(...security.map((s: any) => createAction("security", s.username, s)));
      if (schedules) action.children.push(...schedules.map((s: any) => createAction("schedule", s.name, s)));
    }

    actions.push(action);
  }

  for (const composeConfig of envConfig.compose ?? []) {
    const remoteComposes = remoteEnv.compose ?? [];
    const remoteCompose = remoteComposes.find((c: any) => c.name === composeConfig.name);
    const configWithServer = resolveServer(composeConfig, serverMap);
    const { domains, mounts, schedules, ...composeFields } = configWithServer;
    const action = diffResource("compose", composeConfig.name, composeFields, remoteCompose);

    action.children = [];
    if (remoteCompose) {
      // Fetch full compose details with all child resources
      const fullCompose = await api.getCompose(auth, remoteCompose.composeId);
      if (domains) {
        action.children.push(...diffChildren("domain", domains, fullCompose.domains ?? [],
          (d) => `${d.host}:${d.serviceName ?? ""}`));
      }
      if (mounts) {
        action.children.push(...diffChildren("mount", mounts, fullCompose.mounts ?? [], (m) => m.mountPath as string));
      }
      if (schedules) {
        action.children.push(...diffChildren("schedule", schedules, fullCompose.schedules ?? [], (s) => s.name as string));
      }
    } else {
      if (domains) action.children.push(...domains.map((d: any) => createAction("domain", `${d.host}:${d.serviceName ?? ""}`, d)));
      if (mounts) action.children.push(...mounts.map((m: any) => createAction("mount", m.mountPath, m)));
      if (schedules) action.children.push(...schedules.map((s: any) => createAction("schedule", s.name, s)));
    }

    actions.push(action);
  }

  for (const dbType of ["postgres", "mysql", "mariadb", "mongo", "redis"] as const) {
    for (const dbConfig of envConfig[dbType] ?? []) {
      const remoteDBs = remoteEnv[dbType] ?? [];
      const remoteDB = remoteDBs.find((d: any) => d.name === dbConfig.name);
      const configWithServer = resolveServer(dbConfig, serverMap);
      const { mounts, ...dbFields } = configWithServer;
      const action = diffResource(dbType, dbConfig.name, dbFields, remoteDB);

      action.children = [];
      const idField = `${dbType}Id`;
      if (remoteDB && mounts) {
        // Fetch full DB details with mounts from the .one endpoint
        const dbGetter: Record<string, (auth: AuthConfig, id: string) => Promise<any>> = {
          postgres: api.getPostgres, mysql: api.getMysql, mariadb: api.getMariadb,
          mongo: api.getMongo, redis: api.getRedis,
        };
        const fullDB = await dbGetter[dbType](auth, remoteDB[idField]);
        action.children.push(...diffChildren("mount", mounts, fullDB.mounts ?? [], (m) => m.mountPath as string));
      } else if (mounts) {
        action.children.push(...mounts.map((m: any) => createAction("mount", m.mountPath, m)));
      }

      actions.push(action);
    }
  }

  return actions;
}

function buildCreateActions(envConfig: any, serverMap: Map<string, string>): Action[] {
  const actions: Action[] = [];

  for (const appConfig of envConfig.applications ?? []) {
    const configWithServer = resolveServer(appConfig, serverMap);
    const { domains, ports, mounts, redirects, security, schedules, ...appFields } = configWithServer;
    const action = createAction("application", appConfig.name, appFields);
    action.children = [];
    if (domains) action.children.push(...domains.map((d: any) => createAction("domain", d.host, d)));
    if (ports) action.children.push(...ports.map((p: any) => createAction("port", `${p.publishedPort}:${p.protocol}`, p)));
    if (mounts) action.children.push(...mounts.map((m: any) => createAction("mount", m.mountPath, m)));
    if (redirects) action.children.push(...redirects.map((r: any) => createAction("redirect", r.regex, r)));
    if (security) action.children.push(...security.map((s: any) => createAction("security", s.username, s)));
    if (schedules) action.children.push(...schedules.map((s: any) => createAction("schedule", s.name, s)));
    actions.push(action);
  }

  for (const composeConfig of envConfig.compose ?? []) {
    const configWithServer = resolveServer(composeConfig, serverMap);
    const { domains, mounts, schedules, ...composeFields } = configWithServer;
    const action = createAction("compose", composeConfig.name, composeFields);
    action.children = [];
    if (domains) action.children.push(...domains.map((d: any) => createAction("domain", `${d.host}:${d.serviceName ?? ""}`, d)));
    if (mounts) action.children.push(...mounts.map((m: any) => createAction("mount", m.mountPath, m)));
    if (schedules) action.children.push(...schedules.map((s: any) => createAction("schedule", s.name, s)));
    actions.push(action);
  }

  for (const dbType of ["postgres", "mysql", "mariadb", "mongo", "redis"] as const) {
    for (const dbConfig of envConfig[dbType] ?? []) {
      const configWithServer = resolveServer(dbConfig, serverMap);
      const { mounts, ...dbFields } = configWithServer;
      const action = createAction(dbType, dbConfig.name, dbFields);
      action.children = [];
      if (mounts) action.children.push(...mounts.map((m: any) => createAction("mount", m.mountPath, m)));
      actions.push(action);
    }
  }

  return actions;
}

function createAction(resourceType: ResourceType, name: string, config: Record<string, unknown>): Action {
  return { type: "create", resourceType, name, config };
}

function resolveServer(config: any, serverMap: Map<string, string>): any {
  if (!config.serverName) return config;
  const serverId = serverMap.get(config.serverName);
  if (!serverId) return config;
  return { ...config, _resolvedServerId: serverId };
}

function countPlan(plan: ApplyPlan): ApplyResult {
  const result: ApplyResult = { created: 0, updated: 0, unchanged: 0, failed: 0, errors: [] };

  function count(action: Action) {
    if (action.type === "create") result.created++;
    else if (action.type === "update") result.updated++;
    else result.unchanged++;
    if (action.children) action.children.forEach(count);
  }

  count(plan.project);
  plan.environments.forEach(count);
  return result;
}
