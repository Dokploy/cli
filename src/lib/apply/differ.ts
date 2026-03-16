import type { Action, ActionType, ResourceType } from "./types.js";

const IGNORED_FIELDS = new Set([
  "applicationId", "composeId", "postgresId", "mysqlId", "mariadbId",
  "mongoId", "redisId", "domainId", "portId", "mountId", "redirectId",
  "securityId", "scheduleId", "environmentId", "projectId", "organizationId",
  "serverId", "buildServerId", "buildRegistryId", "rollbackRegistryId",
  "registryId", "githubId", "gitlabId", "giteaId", "bitbucketId",
  "customGitSSHKeyId", "previewDeploymentId", "backupId", "userId",
  "appName", "applicationStatus", "composeStatus", "createdAt",
  "refreshToken", "uniqueConfigKey",
  "domains", "ports", "mounts", "redirects", "security", "schedules",
  "serverName", "_resolvedServerId",
]);

export function diffResource(
  resourceType: ResourceType,
  name: string,
  config: Record<string, unknown>,
  remote: Record<string, unknown> | undefined,
): Action {
  if (!remote) {
    return { type: "create", resourceType, name, config };
  }

  const remoteId = findRemoteId(resourceType, remote);

  const changes: Record<string, { from: unknown; to: unknown }> = {};
  for (const [key, value] of Object.entries(config)) {
    if (IGNORED_FIELDS.has(key)) continue;
    if (value === undefined) continue;

    const remoteValue = remote[key];
    if (!deepEqual(value, remoteValue)) {
      changes[key] = { from: remoteValue, to: value };
    }
  }

  if (Object.keys(changes).length === 0) {
    return { type: "unchanged", resourceType, name, remoteId, config };
  }

  return { type: "update", resourceType, name, remoteId, config, changes };
}

export function diffChildren(
  resourceType: ResourceType,
  localItems: Record<string, unknown>[],
  remoteItems: Record<string, unknown>[],
  matchKey: (item: Record<string, unknown>) => string,
): Action[] {
  const actions: Action[] = [];
  const remoteByKey = new Map<string, Record<string, unknown>>();

  for (const remote of remoteItems) {
    const key = matchKey(remote);
    remoteByKey.set(key, remote);
  }

  for (const local of localItems) {
    const key = matchKey(local);
    const name = key;
    const remote = remoteByKey.get(key);
    actions.push(diffResource(resourceType, name, local, remote));
  }

  return actions;
}

function findRemoteId(resourceType: ResourceType, remote: Record<string, unknown>): string | undefined {
  const idField = `${resourceType}Id`;
  return (remote[idField] as string) ?? (remote.id as string);
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a == b;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const keys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
    for (const key of keys) {
      if (!deepEqual(aObj[key], bObj[key])) return false;
    }
    return true;
  }
  return false;
}
