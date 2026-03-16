import { stringify } from "yaml";
import type { AuthConfig } from "../../utils/utils.js";
import { getProject } from "../../utils/shared.js";
import * as api from "./api-client.js";

// Fields to always strip from any resource
const STRIP_FIELDS = new Set([
  // IDs
  "applicationId", "composeId", "postgresId", "mysqlId", "mariadbId",
  "mongoId", "redisId", "domainId", "portId", "mountId", "redirectId",
  "securityId", "scheduleId", "environmentId", "projectId", "organizationId",
  "serverId", "buildServerId", "buildRegistryId", "rollbackRegistryId",
  "registryId", "githubId", "gitlabId", "giteaId", "bitbucketId",
  "customGitSSHKeyId", "previewDeploymentId", "backupId", "userId",
  // Generated
  "appName", "applicationStatus", "composeStatus", "createdAt",
  "refreshToken", "uniqueConfigKey", "isDefault",
  // Env vars (managed separately)
  "env", "previewEnv",
  // Swarm fields
  "healthCheckSwarm", "restartPolicySwarm", "placementSwarm",
  "updateConfigSwarm", "rollbackConfigSwarm", "modeSwarm",
  "labelsSwarm", "networkSwarm", "stopGracePeriodSwarm",
  "endpointSpecSwarm", "ulimitsSwarm",
  // Preview fields rarely needed in export
  "previewBuildArgs", "previewBuildSecrets", "previewLabels",
  "previewWildcard", "previewRequireCollaboratorPermissions",
  // Other internal fields
  "rollbackActive", "cleanCache", "createEnvFile",
  "enabled", "subtitle", "title", "railpackVersion", "herokuVersion",
  "publishDirectory", "isStaticSpa", "watchPaths",
  "suffix", "randomize", "isolatedDeployment", "isolatedDeploymentsVolume",
  "enableSubmodules", "dropBuildPath", "username", "password",
  "registryUrl",
  // Domain internal
  "domainType", "previewDeploymentId",
  // Mount internal
  "serviceType",
  // Schedule internal
  "scheduleType", "script",
]);

// Fields with default values that should be omitted when at default
const DEFAULTS: Record<string, unknown> = {
  replicas: 1,
  triggerType: "push",
  autoDeploy: true,
  buildPath: "/",
  buildType: "nixpacks",
  sourceType: "github",
  composePath: "./docker-compose.yml",
  composeType: "docker-compose",
  isPreviewDeploymentsActive: false,
  previewPort: 3000,
  previewHttps: false,
  previewPath: "/",
  previewLimit: 3,
};

export function cleanResource(
  resource: Record<string, unknown>,
  serverMap?: Map<string, string>,
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(resource)) {
    if (STRIP_FIELDS.has(key)) continue;
    if (value === null || value === undefined || value === "") continue;
    if (key in DEFAULTS && DEFAULTS[key] === value) continue;
    if (Array.isArray(value) && value.length === 0) continue;

    cleaned[key] = value;
  }

  // Resolve serverId to serverName
  if (resource.serverId && serverMap) {
    const serverName = serverMap.get(resource.serverId as string);
    if (serverName) {
      cleaned.serverName = serverName;
    }
  }

  return cleaned;
}

function cleanChildResources(
  resources: Record<string, unknown>[],
  serverMap?: Map<string, string>,
): Record<string, unknown>[] {
  return resources
    .map((r) => cleanResource(r, serverMap))
    .filter((r) => Object.keys(r).length > 0);
}

async function exportApplication(
  auth: AuthConfig,
  app: any,
  serverMap?: Map<string, string>,
): Promise<Record<string, unknown>> {
  const cleaned = cleanResource(app, serverMap);

  const [domains, ports, mounts, redirects, security, schedules] =
    await Promise.all([
      api.listDomainsByApplicationId(auth, app.applicationId),
      api.listPortsByApplicationId(auth, app.applicationId),
      api.listMountsByServiceId(auth, app.applicationId, "application"),
      api.listRedirectsByApplicationId(auth, app.applicationId),
      api.listSecurityByApplicationId(auth, app.applicationId),
      api.listSchedulesByApplicationId(auth, app.applicationId),
    ]);

  if (domains.length > 0) cleaned.domains = cleanChildResources(domains);
  if (ports.length > 0) cleaned.ports = cleanChildResources(ports);
  if (mounts.length > 0) cleaned.mounts = cleanChildResources(mounts);
  if (redirects.length > 0) cleaned.redirects = cleanChildResources(redirects);
  if (security.length > 0) cleaned.security = cleanChildResources(security);
  if (schedules.length > 0) cleaned.schedules = cleanChildResources(schedules);

  return cleaned;
}

async function exportCompose(
  auth: AuthConfig,
  compose: any,
  serverMap?: Map<string, string>,
): Promise<Record<string, unknown>> {
  const cleaned = cleanResource(compose, serverMap);

  const [domains, mounts, schedules] = await Promise.all([
    api.listDomainsByComposeId(auth, compose.composeId),
    api.listMountsByServiceId(auth, compose.composeId, "compose"),
    api.listSchedulesByComposeId(auth, compose.composeId),
  ]);

  if (domains.length > 0) cleaned.domains = cleanChildResources(domains);
  if (mounts.length > 0) cleaned.mounts = cleanChildResources(mounts);
  if (schedules.length > 0) cleaned.schedules = cleanChildResources(schedules);

  return cleaned;
}

async function exportDatabase(
  auth: AuthConfig,
  db: any,
  serviceType: string,
  serverMap?: Map<string, string>,
): Promise<Record<string, unknown>> {
  const cleaned = cleanResource(db, serverMap);

  const idField = `${serviceType}Id`;
  const serviceId = db[idField];
  if (serviceId) {
    const mounts = await api.listMountsByServiceId(auth, serviceId, serviceType);
    if (mounts.length > 0) cleaned.mounts = cleanChildResources(mounts);
  }

  return cleaned;
}

export async function exportProject(
  auth: AuthConfig,
  projectId: string,
  servers?: any[],
): Promise<string> {
  // Build server ID -> name map
  let serverMap: Map<string, string> | undefined;
  if (servers) {
    serverMap = new Map(servers.map((s: any) => [s.serverId, s.name]));
  } else {
    try {
      const serverList = await api.listServers(auth);
      serverMap = new Map(serverList.map((s: any) => [s.serverId, s.name]));
    } catch {
      // If we can't list servers, skip server name resolution
    }
  }

  // Fetch the full project with environments and nested resources
  // getProject requires a Command instance but we don't have one here,
  // so we use the api-client directly via a simple trpc call
  const project = await fetchProject(auth, projectId);

  const config: Record<string, unknown> = {
    apiVersion: "v1",
    kind: "Project",
    name: project.name,
  };

  if (project.description) {
    config.description = project.description;
  }

  const environments: Record<string, unknown>[] = [];

  for (const env of project.environments || []) {
    const envConfig: Record<string, unknown> = { name: env.name };
    if (env.description) envConfig.description = env.description;

    // Applications
    if (env.applications?.length > 0) {
      envConfig.applications = await Promise.all(
        env.applications.map((app: any) =>
          exportApplication(auth, app, serverMap),
        ),
      );
    }

    // Compose
    if (env.compose?.length > 0) {
      envConfig.compose = await Promise.all(
        env.compose.map((c: any) => exportCompose(auth, c, serverMap)),
      );
    }

    // Databases
    for (const dbType of ["postgres", "mysql", "mariadb", "mongo", "redis"] as const) {
      if (env[dbType]?.length > 0) {
        envConfig[dbType] = await Promise.all(
          env[dbType].map((db: any) =>
            exportDatabase(auth, db, dbType, serverMap),
          ),
        );
      }
    }

    environments.push(envConfig);
  }

  if (environments.length > 0) {
    config.environments = environments;
  }

  return stringify(config, { lineWidth: 0 });
}

async function fetchProject(auth: AuthConfig, projectId: string): Promise<any> {
  const { default: axios } = await import("axios");
  const response = await axios.get(`${auth.url}/api/trpc/project.one`, {
    headers: {
      "x-api-key": auth.token,
      "Content-Type": "application/json",
    },
    params: {
      input: JSON.stringify({ json: { projectId } }),
    },
  });
  return response.data.result.data.json;
}
