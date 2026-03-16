import { stringify } from "yaml";
import type { AuthConfig } from "../../utils/utils.js";
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
  "subtitle", "title", "railpackVersion", "herokuVersion",
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
  // Relation objects from .one endpoints (not serializable to YAML)
  "environment", "server", "deployments", "registry",
  "github", "gitlab", "gitea", "bitbucket",
  "previewDeployments", "buildRegistry", "rollbackRegistry",
  "backups", "domains", "ports", "mounts", "redirects", "security", "schedules",
  // Runtime/computed fields
  "hasGitProviderAccess", "uniqueConfigKey",
  // Git provider-specific paths (only relevant for that provider)
  "gitlabBuildPath", "gitlabPathNamespace", "gitlabProjectId",
  "gitlabRepository", "gitlabOwner", "gitlabBranch",
  "giteaRepository", "giteaOwner", "giteaBranch", "giteaBuildPath",
  "bitbucketRepository", "bitbucketRepositorySlug",
  "bitbucketOwner", "bitbucketBranch", "bitbucketBuildPath",
  "customGitUrl", "customGitBranch", "customGitBuildPath",
  // Build settings not relevant when using docker source
  "buildSecrets",
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
  previewCertificateType: "none",
  // Schedule defaults
  enabled: true,
  // Domain defaults
  https: false,
  path: "/",
  internalPath: "/",
  stripPath: false,
  certificateType: "none",
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
  // Fetch full application details including child resources
  const fullApp = await api.getApplication(auth, app.applicationId);
  const cleaned = cleanResource(fullApp, serverMap);

  // Strip build-related fields when using docker image source
  if (fullApp.sourceType === "docker") {
    delete cleaned.dockerfile;
    delete cleaned.dockerContextPath;
    delete cleaned.dockerBuildStage;
    delete cleaned.buildType;
    delete cleaned.buildArgs;
  }

  // Extract child resources from the full response
  const childTypes = ["domains", "ports", "mounts", "redirects", "security", "schedules"] as const;
  for (const childType of childTypes) {
    const children = fullApp[childType];
    if (Array.isArray(children) && children.length > 0) {
      cleaned[childType] = cleanChildResources(children);
    }
  }

  return cleaned;
}

async function exportCompose(
  auth: AuthConfig,
  compose: any,
  serverMap?: Map<string, string>,
): Promise<Record<string, unknown>> {
  // Fetch full compose details including child resources
  const fullCompose = await api.getCompose(auth, compose.composeId);
  const cleaned = cleanResource(fullCompose, serverMap);

  for (const childType of ["domains", "mounts", "schedules"] as const) {
    const children = fullCompose[childType];
    if (Array.isArray(children) && children.length > 0) {
      cleaned[childType] = cleanChildResources(children);
    }
  }

  return cleaned;
}

const DB_GETTER: Record<string, (auth: AuthConfig, id: string) => Promise<any>> = {
  postgres: api.getPostgres,
  mysql: api.getMysql,
  mariadb: api.getMariadb,
  mongo: api.getMongo,
  redis: api.getRedis,
};

async function exportDatabase(
  auth: AuthConfig,
  db: any,
  serviceType: string,
  serverMap?: Map<string, string>,
): Promise<Record<string, unknown>> {
  const idField = `${serviceType}Id`;
  const serviceId = db[idField];

  // Fetch full database details including mounts
  const getter = DB_GETTER[serviceType] as ((auth: AuthConfig, id: string) => Promise<any>) | undefined;
  const fullDb = getter && serviceId ? await getter(auth, serviceId) : db;
  const cleaned = cleanResource(fullDb, serverMap);

  // Filter out auto-created default mounts (created by Dokploy when the database is created)
  // Auto-created mounts use volume name pattern: ${appName}-data
  const appName = fullDb.appName as string | undefined;
  const mounts = (fullDb.mounts ?? []).filter((m: any) => {
    if (appName && m.type === "volume" && m.volumeName === `${appName}-data`) {
      return false; // Skip auto-created default mount
    }
    return true;
  });
  if (mounts.length > 0) {
    cleaned.mounts = cleanChildResources(mounts);
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

  const project = await api.getProject(auth, projectId);

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

