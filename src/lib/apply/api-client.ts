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

// Fetch full service details (includes child resources like domains, ports, mounts, etc.)
export async function getApplication(auth: AuthConfig, applicationId: string) {
  return trpcQuery(auth, "application.one", { applicationId });
}

export async function getCompose(auth: AuthConfig, composeId: string) {
  return trpcQuery(auth, "compose.one", { composeId });
}

export async function getPostgres(auth: AuthConfig, postgresId: string) {
  return trpcQuery(auth, "postgres.one", { postgresId });
}

export async function getMysql(auth: AuthConfig, mysqlId: string) {
  return trpcQuery(auth, "mysql.one", { mysqlId });
}

export async function getMariadb(auth: AuthConfig, mariadbId: string) {
  return trpcQuery(auth, "mariadb.one", { mariadbId });
}

export async function getMongo(auth: AuthConfig, mongoId: string) {
  return trpcQuery(auth, "mongo.one", { mongoId });
}

export async function getRedis(auth: AuthConfig, redisId: string) {
  return trpcQuery(auth, "redis.one", { redisId });
}

export async function createDomain(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "domain.create", input);
}

export async function updateDomain(auth: AuthConfig, input: Record<string, unknown> & { domainId: string }) {
  return trpcMutation(auth, "domain.update", input);
}

export async function createPort(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "port.create", input);
}

export async function updatePort(auth: AuthConfig, input: Record<string, unknown> & { portId: string }) {
  return trpcMutation(auth, "port.update", input);
}

export async function createMount(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "mounts.create", input);
}

export async function updateMount(auth: AuthConfig, input: Record<string, unknown> & { mountId: string }) {
  return trpcMutation(auth, "mounts.update", input);
}

export async function createRedirect(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "redirects.create", input);
}

export async function updateRedirect(auth: AuthConfig, input: Record<string, unknown> & { redirectId: string }) {
  return trpcMutation(auth, "redirects.update", input);
}

export async function createSecurity(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "security.create", input);
}

export async function updateSecurity(auth: AuthConfig, input: Record<string, unknown> & { securityId: string }) {
  return trpcMutation(auth, "security.update", input);
}

export async function createSchedule(auth: AuthConfig, input: Record<string, unknown>) {
  return trpcMutation(auth, "schedule.create", input);
}

export async function updateSchedule(auth: AuthConfig, input: Record<string, unknown> & { scheduleId: string }) {
  return trpcMutation(auth, "schedule.update", input);
}
