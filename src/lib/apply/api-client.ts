import axios from "axios";
import type { AuthConfig } from "../../utils/utils.js";

function authHeaders(auth: AuthConfig) {
  return {
    "x-api-key": auth.token,
    "Content-Type": "application/json",
  };
}

async function trpcQuery(auth: AuthConfig, endpoint: string, input?: Record<string, unknown>) {
  const params = input ? { input: JSON.stringify({ json: input }) } : undefined;
  const response = await axios.get(`${auth.url}/api/trpc/${endpoint}`, {
    headers: authHeaders(auth),
    params,
  });
  return response.data.result.data.json;
}

async function trpcMutation(auth: AuthConfig, endpoint: string, input: Record<string, unknown>) {
  const response = await axios.post(
    `${auth.url}/api/trpc/${endpoint}`,
    { json: input },
    { headers: authHeaders(auth) },
  );
  return response.data.result.data.json;
}

export async function listProjects(auth: AuthConfig) {
  return trpcQuery(auth, "project.all") as Promise<any[]>;
}

export async function createProject(auth: AuthConfig, input: { name: string; description?: string }) {
  return trpcMutation(auth, "project.create", input);
}

export async function updateProject(auth: AuthConfig, input: { projectId: string; name?: string; description?: string }) {
  return trpcMutation(auth, "project.update", input);
}

export async function listEnvironments(auth: AuthConfig, projectId: string) {
  return trpcQuery(auth, "environment.byProjectId", { projectId }) as Promise<any[]>;
}

export async function createEnvironment(auth: AuthConfig, input: { name: string; description?: string; projectId: string }) {
  return trpcMutation(auth, "environment.create", input);
}

export async function listServers(auth: AuthConfig) {
  return trpcQuery(auth, "server.all") as Promise<any[]>;
}

export async function createApplication(auth: AuthConfig, input: { name: string; description?: string; environmentId: string; serverId?: string }) {
  return trpcMutation(auth, "application.create", input);
}

export async function updateApplication(auth: AuthConfig, input: Record<string, unknown> & { applicationId: string }) {
  return trpcMutation(auth, "application.update", input);
}

export async function createCompose(auth: AuthConfig, input: { name: string; description?: string; environmentId: string; serverId?: string; composeType?: string }) {
  return trpcMutation(auth, "compose.create", input);
}

export async function updateCompose(auth: AuthConfig, input: Record<string, unknown> & { composeId: string }) {
  return trpcMutation(auth, "compose.update", input);
}

export async function createPostgres(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "postgres.create", input);
}

export async function updatePostgres(auth: AuthConfig, input: Record<string, unknown> & { postgresId: string }) {
  return trpcMutation(auth, "postgres.update", input);
}

export async function createMysql(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "mysql.create", input);
}

export async function updateMysql(auth: AuthConfig, input: Record<string, unknown> & { mysqlId: string }) {
  return trpcMutation(auth, "mysql.update", input);
}

export async function createMariadb(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "mariadb.create", input);
}

export async function updateMariadb(auth: AuthConfig, input: Record<string, unknown> & { mariadbId: string }) {
  return trpcMutation(auth, "mariadb.update", input);
}

export async function createMongo(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "mongo.create", input);
}

export async function updateMongo(auth: AuthConfig, input: Record<string, unknown> & { mongoId: string }) {
  return trpcMutation(auth, "mongo.update", input);
}

export async function createRedis(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "redis.create", input);
}

export async function updateRedis(auth: AuthConfig, input: Record<string, unknown> & { redisId: string }) {
  return trpcMutation(auth, "redis.update", input);
}

export async function listDomainsByApplicationId(auth: AuthConfig, applicationId: string) {
  return trpcQuery(auth, "domain.byApplicationId", { applicationId }) as Promise<any[]>;
}

export async function listDomainsByComposeId(auth: AuthConfig, composeId: string) {
  return trpcQuery(auth, "domain.byComposeId", { composeId }) as Promise<any[]>;
}

export async function createDomain(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "domain.create", input);
}

export async function updateDomain(auth: AuthConfig, input: Record<string, unknown> & { domainId: string }) {
  return trpcMutation(auth, "domain.update", input);
}

export async function listPortsByApplicationId(auth: AuthConfig, applicationId: string) {
  return trpcQuery(auth, "port.byApplicationId", { applicationId }) as Promise<any[]>;
}

export async function createPort(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "port.create", input);
}

export async function updatePort(auth: AuthConfig, input: Record<string, unknown> & { portId: string }) {
  return trpcMutation(auth, "port.update", input);
}

export async function listMountsByServiceId(auth: AuthConfig, serviceId: string, serviceType: string) {
  return trpcQuery(auth, "mount.listByServiceId", { serviceId, serviceType }) as Promise<any[]>;
}

export async function createMount(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "mount.create", input);
}

export async function updateMount(auth: AuthConfig, input: Record<string, unknown> & { mountId: string }) {
  return trpcMutation(auth, "mount.update", input);
}

export async function listRedirectsByApplicationId(auth: AuthConfig, applicationId: string) {
  return trpcQuery(auth, "redirect.byApplicationId", { applicationId }) as Promise<any[]>;
}

export async function createRedirect(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "redirect.create", input);
}

export async function updateRedirect(auth: AuthConfig, input: Record<string, unknown> & { redirectId: string }) {
  return trpcMutation(auth, "redirect.update", input);
}

export async function listSecurityByApplicationId(auth: AuthConfig, applicationId: string) {
  return trpcQuery(auth, "security.byApplicationId", { applicationId }) as Promise<any[]>;
}

export async function createSecurity(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "security.create", input);
}

export async function updateSecurity(auth: AuthConfig, input: Record<string, unknown> & { securityId: string }) {
  return trpcMutation(auth, "security.update", input);
}

export async function listSchedulesByApplicationId(auth: AuthConfig, applicationId: string) {
  return trpcQuery(auth, "schedule.byApplicationId", { applicationId }) as Promise<any[]>;
}

export async function listSchedulesByComposeId(auth: AuthConfig, composeId: string) {
  return trpcQuery(auth, "schedule.byComposeId", { composeId }) as Promise<any[]>;
}

export async function createSchedule(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "schedule.create", input);
}

export async function updateSchedule(auth: AuthConfig, input: Record<string, unknown> & { scheduleId: string }) {
  return trpcMutation(auth, "schedule.update", input);
}
