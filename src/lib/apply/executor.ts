import type { AuthConfig } from "../../utils/utils.js";
import * as api from "./api-client.js";
import type { Action, ApplyResult } from "./types.js";

export async function executePlan(
  auth: AuthConfig,
  plan: { project: Action; environments: Action[] },
): Promise<ApplyResult> {
  const result: ApplyResult = { created: 0, updated: 0, unchanged: 0, failed: 0, errors: [] };

  let projectId: string;
  try {
    projectId = await executeProjectAction(auth, plan.project);
    countAction(result, plan.project.type);
  } catch (err: any) {
    result.failed++;
    result.errors.push({ resource: `Project "${plan.project.name}"`, error: err.message });
    return result;
  }

  for (const envAction of plan.environments) {
    let environmentId: string;
    try {
      environmentId = await executeEnvironmentAction(auth, envAction, projectId);
      countAction(result, envAction.type);
    } catch (err: any) {
      result.failed++;
      const detail = err.response?.data ? JSON.stringify(err.response.data).slice(0, 200) : err.message;
      result.errors.push({ resource: `Environment "${envAction.name}"`, error: detail });
      continue;
    }

    if (envAction.children) {
      for (const resourceAction of envAction.children) {
        try {
          const resourceId = await executeResourceAction(auth, resourceAction, environmentId);
          countAction(result, resourceAction.type);

          if (resourceAction.children) {
            for (const childAction of resourceAction.children) {
              try {
                await executeChildAction(auth, childAction, resourceAction.resourceType, resourceId);
                countAction(result, childAction.type);
              } catch (err: any) {
                result.failed++;
                result.errors.push({
                  resource: `${childAction.resourceType} "${childAction.name}" on ${resourceAction.name}`,
                  error: err.message,
                });
              }
            }
          }
        } catch (err: any) {
          result.failed++;
          result.errors.push({
            resource: `${resourceAction.resourceType} "${resourceAction.name}"`,
            error: err.message,
          });
        }
      }
    }
  }

  return result;
}

async function executeProjectAction(auth: AuthConfig, action: Action): Promise<string> {
  if (action.type === "create") {
    const result = await api.createProject(auth, {
      name: action.config.name as string,
      description: action.config.description as string | undefined,
    });
    // createProject returns { project: {...}, environment: {...} }
    const projectId = result.project?.projectId ?? result.projectId;
    if (!projectId) {
      throw new Error("createProject response missing projectId");
    }
    return projectId;
  }
  if (action.type === "update") {
    await api.updateProject(auth, {
      projectId: action.remoteId!,
      name: action.config.name as string,
      description: action.config.description as string | undefined,
    });
  }
  return action.remoteId!;
}

async function executeEnvironmentAction(auth: AuthConfig, action: Action, projectId: string): Promise<string> {
  if (action.type === "create") {
    // Check if environment already exists (e.g., auto-created default "production")
    const existing = await api.listEnvironments(auth, projectId);
    const match = existing.find((e: any) => e.name === action.config.name);
    if (match) {
      return match.environmentId;
    }
    const result = await api.createEnvironment(auth, {
      name: action.config.name as string,
      description: action.config.description as string | undefined,
      projectId,
    });
    return result.environmentId;
  }
  if (action.type === "update") {
    await api.updateEnvironment(auth, {
      environmentId: action.remoteId!,
      name: action.config.name as string,
      description: action.config.description as string | undefined,
    });
  }
  return action.remoteId!;
}

async function executeResourceAction(
  auth: AuthConfig,
  action: Action,
  environmentId: string,
): Promise<string> {
  if (action.type === "unchanged") {
    return action.remoteId!;
  }

  if (action.type === "create") {
    return createResource(auth, action.resourceType, action.config, environmentId);
  }

  await updateResource(auth, action.resourceType, action.remoteId!, action.config);
  return action.remoteId!;
}

async function createResource(
  auth: AuthConfig,
  resourceType: string,
  config: Record<string, unknown>,
  environmentId: string,
): Promise<string> {
  const serverId = config._resolvedServerId as string | undefined;
  const { domains, ports, mounts, redirects, security, schedules, serverName, _resolvedServerId, ...restFields } = config as any;

  switch (resourceType) {
    case "application": {
      const result = await api.createApplication(auth, {
        name: config.name as string,
        description: config.description as string | undefined,
        environmentId,
        serverId,
      });
      const appId = result.applicationId;
      const updateFields = { ...restFields };
      delete updateFields.name;
      delete updateFields.description;
      if (Object.keys(updateFields).length > 0) {
        await api.updateApplication(auth, { applicationId: appId, ...updateFields });
      }
      return appId;
    }
    case "compose": {
      const result = await api.createCompose(auth, {
        name: config.name as string,
        description: config.description as string | undefined,
        environmentId,
        serverId,
        composeType: config.composeType as string | undefined,
      });
      const composeId = result.composeId;
      const updateFields = { ...restFields };
      delete updateFields.name;
      delete updateFields.description;
      delete updateFields.composeType;
      if (Object.keys(updateFields).length > 0) {
        await api.updateCompose(auth, { composeId, ...updateFields });
      }
      return composeId;
    }
    case "postgres": {
      const result = await api.createPostgres(auth, {
        name: config.name as string,
        databaseName: config.databaseName as string,
        databaseUser: config.databaseUser as string,
        databasePassword: config.databasePassword as string,
        dockerImage: config.dockerImage as string,
        description: config.description as string | undefined,
        environmentId,
        serverId,
      });
      const id = result.postgresId;
      const updateFields = { ...restFields };
      for (const key of ["name", "databaseName", "databaseUser", "databasePassword", "dockerImage", "description"]) {
        delete updateFields[key];
      }
      if (Object.keys(updateFields).length > 0) {
        await api.updatePostgres(auth, { postgresId: id, ...updateFields });
      }
      return id;
    }
    case "mysql": {
      const result = await api.createMysql(auth, {
        name: config.name as string,
        databaseName: config.databaseName as string,
        databaseUser: config.databaseUser as string,
        databasePassword: config.databasePassword as string,
        databaseRootPassword: config.databaseRootPassword as string,
        dockerImage: config.dockerImage as string,
        description: config.description as string | undefined,
        environmentId,
        serverId,
      });
      return result.mysqlId;
    }
    case "mariadb": {
      const result = await api.createMariadb(auth, {
        name: config.name as string,
        databaseName: config.databaseName as string,
        databaseUser: config.databaseUser as string,
        databasePassword: config.databasePassword as string,
        databaseRootPassword: config.databaseRootPassword as string,
        dockerImage: config.dockerImage as string,
        description: config.description as string | undefined,
        environmentId,
        serverId,
      });
      return result.mariadbId;
    }
    case "mongo": {
      const result = await api.createMongo(auth, {
        name: config.name as string,
        databaseUser: config.databaseUser as string,
        databasePassword: config.databasePassword as string,
        dockerImage: config.dockerImage as string,
        description: config.description as string | undefined,
        environmentId,
        serverId,
      });
      return result.mongoId;
    }
    case "redis": {
      const result = await api.createRedis(auth, {
        name: config.name as string,
        databasePassword: config.databasePassword as string,
        dockerImage: config.dockerImage as string,
        description: config.description as string | undefined,
        environmentId,
        serverId,
      });
      return result.redisId;
    }
    default:
      throw new Error(`Unknown resource type: ${resourceType}`);
  }
}

async function updateResource(
  auth: AuthConfig,
  resourceType: string,
  remoteId: string,
  config: Record<string, unknown>,
): Promise<void> {
  const { domains, ports, mounts, redirects, security, schedules, serverName, _resolvedServerId, ...updateFields } = config as any;

  switch (resourceType) {
    case "application":
      await api.updateApplication(auth, { applicationId: remoteId, ...updateFields });
      break;
    case "compose":
      await api.updateCompose(auth, { composeId: remoteId, ...updateFields });
      break;
    case "postgres":
      await api.updatePostgres(auth, { postgresId: remoteId, ...updateFields });
      break;
    case "mysql":
      await api.updateMysql(auth, { mysqlId: remoteId, ...updateFields });
      break;
    case "mariadb":
      await api.updateMariadb(auth, { mariadbId: remoteId, ...updateFields });
      break;
    case "mongo":
      await api.updateMongo(auth, { mongoId: remoteId, ...updateFields });
      break;
    case "redis":
      await api.updateRedis(auth, { redisId: remoteId, ...updateFields });
      break;
  }
}

async function executeChildAction(
  auth: AuthConfig,
  action: Action,
  parentResourceType: string,
  parentId: string,
): Promise<void> {
  if (action.type === "unchanged") return;

  const { resourceType, config } = action;

  if (action.type === "create") {
    switch (resourceType) {
      case "domain": {
        const domainType = parentResourceType === "compose" ? "compose" : "application";
        const parentKey = parentResourceType === "compose" ? "composeId" : "applicationId";
        await api.createDomain(auth, { ...config, domainType, [parentKey]: parentId });
        break;
      }
      case "port":
        await api.createPort(auth, { ...config, applicationId: parentId });
        break;
      case "mount": {
        const serviceType = parentResourceType;
        try {
          await api.createMount(auth, { ...config, serviceType, serviceId: parentId });
        } catch (err: any) {
          // Mount may already exist (auto-created by database service) - ignore duplicates
          const msg = err.response?.data?.error?.json?.message ?? "";
          if (err.response?.status === 409 || (err.response?.status === 400 && msg.includes("already"))) {
            return;
          }
          throw err;
        }
        break;
      }
      case "redirect":
        await api.createRedirect(auth, { ...config, applicationId: parentId });
        break;
      case "security":
        await api.createSecurity(auth, { ...config, applicationId: parentId });
        break;
      case "schedule": {
        const scheduleType = parentResourceType === "compose" ? "compose" : "application";
        const parentKey = parentResourceType === "compose" ? "composeId" : "applicationId";
        await api.createSchedule(auth, { ...config, scheduleType, [parentKey]: parentId });
        break;
      }
    }
  } else if (action.type === "update") {
    const id = action.remoteId!;
    switch (resourceType) {
      case "domain":
        await api.updateDomain(auth, { domainId: id, ...config });
        break;
      case "port":
        await api.updatePort(auth, { portId: id, ...config });
        break;
      case "mount":
        await api.updateMount(auth, { mountId: id, ...config });
        break;
      case "redirect":
        await api.updateRedirect(auth, { redirectId: id, ...config });
        break;
      case "security":
        await api.updateSecurity(auth, { securityId: id, ...config });
        break;
      case "schedule":
        await api.updateSchedule(auth, { scheduleId: id, ...config });
        break;
    }
  }
}

function countAction(result: ApplyResult, type: string): void {
  if (type === "create") result.created++;
  else if (type === "update") result.updated++;
  else if (type === "unchanged") result.unchanged++;
}
