import { z } from "zod";

const domainSchema = z.object({
  host: z.string().min(1),
  port: z.number().int().positive().optional().default(3000),
  https: z.boolean().optional().default(false),
  path: z.string().optional().default("/"),
  certificateType: z.enum(["none", "letsencrypt", "custom"]).optional().default("none"),
  customCertResolver: z.string().optional(),
  serviceName: z.string().optional(),
  internalPath: z.string().optional(),
  stripPath: z.boolean().optional(),
});

const portSchema = z.object({
  publishedPort: z.number().int().positive(),
  targetPort: z.number().int().positive(),
  protocol: z.enum(["tcp", "udp"]),
  publishMode: z.enum(["host", "ingress"]).optional().default("host"),
});

const mountSchema = z.object({
  type: z.enum(["bind", "volume", "file"]),
  mountPath: z.string().min(1),
  hostPath: z.string().optional(),
  volumeName: z.string().optional(),
  filePath: z.string().optional(),
  content: z.string().optional(),
});

const redirectSchema = z.object({
  regex: z.string().min(1),
  replacement: z.string().min(1),
  permanent: z.boolean().optional().default(false),
});

const securitySchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const scheduleSchema = z.object({
  name: z.string().min(1),
  cronExpression: z.string().min(1),
  command: z.string().min(1),
  shellType: z.enum(["bash", "sh"]).optional().default("bash"),
  enabled: z.boolean().optional().default(true),
  timezone: z.string().optional(),
  serviceName: z.string().optional(),
});

const applicationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  serverName: z.string().optional(),
  sourceType: z.enum(["docker", "git", "github", "gitlab", "bitbucket", "gitea", "drop"]).optional(),
  buildType: z.enum(["dockerfile", "nixpacks", "heroku_buildpacks", "paketo_buildpacks", "static", "railpack"]).optional(),
  repository: z.string().optional(),
  owner: z.string().optional(),
  branch: z.string().optional(),
  buildPath: z.string().optional(),
  customGitUrl: z.string().optional(),
  customGitBranch: z.string().optional(),
  customGitBuildPath: z.string().optional(),
  dockerImage: z.string().optional(),
  dockerfile: z.string().optional(),
  dockerContextPath: z.string().optional(),
  dockerBuildStage: z.string().nullable().optional(),
  buildArgs: z.string().optional(),
  command: z.string().optional(),
  args: z.array(z.string()).optional(),
  replicas: z.number().int().positive().optional(),
  autoDeploy: z.boolean().optional(),
  triggerType: z.enum(["push", "tag"]).optional(),
  memoryReservation: z.string().optional(),
  memoryLimit: z.string().optional(),
  cpuReservation: z.string().optional(),
  cpuLimit: z.string().optional(),
  isPreviewDeploymentsActive: z.boolean().optional(),
  previewPort: z.number().int().positive().optional(),
  previewHttps: z.boolean().optional(),
  previewPath: z.string().optional(),
  previewLimit: z.number().int().positive().optional(),
  domains: z.array(domainSchema).optional(),
  ports: z.array(portSchema).optional(),
  mounts: z.array(mountSchema).optional(),
  redirects: z.array(redirectSchema).optional(),
  security: z.array(securitySchema).optional(),
  schedules: z.array(scheduleSchema).optional(),
});

const composeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  serverName: z.string().optional(),
  sourceType: z.enum(["git", "github", "gitlab", "bitbucket", "gitea", "raw"]).optional(),
  composeType: z.enum(["docker-compose", "stack"]).optional(),
  composeFile: z.string().optional(),
  composePath: z.string().optional(),
  repository: z.string().optional(),
  owner: z.string().optional(),
  branch: z.string().optional(),
  autoDeploy: z.boolean().optional(),
  customGitUrl: z.string().optional(),
  customGitBranch: z.string().optional(),
  domains: z.array(domainSchema).optional(),
  mounts: z.array(mountSchema).optional(),
  schedules: z.array(scheduleSchema).optional(),
});

const baseDatabaseSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  serverName: z.string().optional(),
  dockerImage: z.string().min(1),
  databasePassword: z.string().min(1),
  command: z.string().optional(),
  args: z.array(z.string()).optional(),
  externalPort: z.number().int().positive().optional(),
  memoryReservation: z.string().optional(),
  memoryLimit: z.string().optional(),
  cpuReservation: z.string().optional(),
  cpuLimit: z.string().optional(),
  replicas: z.number().int().positive().optional(),
  mounts: z.array(mountSchema).optional(),
});

const postgresSchema = baseDatabaseSchema.extend({
  databaseName: z.string().min(1),
  databaseUser: z.string().min(1),
});

const mysqlSchema = baseDatabaseSchema.extend({
  databaseName: z.string().min(1),
  databaseUser: z.string().min(1),
  databaseRootPassword: z.string().min(1),
});

const mariadbSchema = baseDatabaseSchema.extend({
  databaseName: z.string().min(1),
  databaseUser: z.string().min(1),
  databaseRootPassword: z.string().min(1),
});

const mongoSchema = baseDatabaseSchema.extend({
  databaseUser: z.string().min(1),
  replicaSets: z.boolean().optional(),
});

const redisSchema = baseDatabaseSchema;

const environmentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  applications: z.array(applicationSchema).optional(),
  compose: z.array(composeSchema).optional(),
  postgres: z.array(postgresSchema).optional(),
  mysql: z.array(mysqlSchema).optional(),
  mariadb: z.array(mariadbSchema).optional(),
  mongo: z.array(mongoSchema).optional(),
  redis: z.array(redisSchema).optional(),
});

export const dokployConfigSchema = z.object({
  apiVersion: z.literal("v1"),
  kind: z.literal("Project"),
  name: z.string().min(1),
  description: z.string().optional(),
  environments: z.array(environmentSchema).min(1),
});

export type DokployConfigInput = z.input<typeof dokployConfigSchema>;
export type DokployConfigParsed = z.output<typeof dokployConfigSchema>;
