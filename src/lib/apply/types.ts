// src/lib/apply/types.ts

// ── YAML Config shape ──────────────────────────────────────────

export interface DokployConfig {
  apiVersion: string;
  kind: string;
  name: string;
  description?: string;
  environments: EnvironmentConfig[];
}

export interface EnvironmentConfig {
  name: string;
  description?: string;
  applications?: ApplicationConfig[];
  compose?: ComposeConfig[];
  postgres?: PostgresConfig[];
  mysql?: MySqlConfig[];
  mariadb?: MariadbConfig[];
  mongo?: MongoConfig[];
  redis?: RedisConfig[];
}

export interface DomainConfig {
  host: string;
  port?: number;
  https?: boolean;
  path?: string;
  certificateType?: "none" | "letsencrypt" | "custom";
  customCertResolver?: string;
  serviceName?: string;
  internalPath?: string;
  stripPath?: boolean;
}

export interface PortConfig {
  publishedPort: number;
  targetPort: number;
  protocol: "tcp" | "udp";
  publishMode?: "host" | "ingress";
}

export interface MountConfig {
  type: "bind" | "volume" | "file";
  mountPath: string;
  hostPath?: string;
  volumeName?: string;
  filePath?: string;
  content?: string;
}

export interface RedirectConfig {
  regex: string;
  replacement: string;
  permanent?: boolean;
}

export interface SecurityConfig {
  username: string;
  password: string;
}

export interface ScheduleConfig {
  name: string;
  cronExpression: string;
  command: string;
  shellType?: "bash" | "sh";
  enabled?: boolean;
  timezone?: string;
  serviceName?: string;
}

export interface ApplicationConfig {
  name: string;
  description?: string;
  serverName?: string;
  sourceType?: "docker" | "git" | "github" | "gitlab" | "bitbucket" | "gitea" | "drop";
  buildType?: "dockerfile" | "nixpacks" | "heroku_buildpacks" | "paketo_buildpacks" | "static" | "railpack";
  repository?: string;
  owner?: string;
  branch?: string;
  buildPath?: string;
  customGitUrl?: string;
  customGitBranch?: string;
  customGitBuildPath?: string;
  dockerImage?: string;
  dockerfile?: string;
  dockerContextPath?: string;
  dockerBuildStage?: string;
  buildArgs?: string;
  command?: string;
  args?: string[];
  replicas?: number;
  autoDeploy?: boolean;
  triggerType?: "push" | "tag";
  memoryReservation?: string;
  memoryLimit?: string;
  cpuReservation?: string;
  cpuLimit?: string;
  isPreviewDeploymentsActive?: boolean;
  previewPort?: number;
  previewHttps?: boolean;
  previewPath?: string;
  previewLimit?: number;
  domains?: DomainConfig[];
  ports?: PortConfig[];
  mounts?: MountConfig[];
  redirects?: RedirectConfig[];
  security?: SecurityConfig[];
  schedules?: ScheduleConfig[];
}

export interface ComposeConfig {
  name: string;
  description?: string;
  serverName?: string;
  sourceType?: "git" | "github" | "gitlab" | "bitbucket" | "gitea" | "raw";
  composeType?: "docker-compose" | "stack";
  composeFile?: string;
  composePath?: string;
  repository?: string;
  owner?: string;
  branch?: string;
  autoDeploy?: boolean;
  customGitUrl?: string;
  customGitBranch?: string;
  domains?: DomainConfig[];
  mounts?: MountConfig[];
  schedules?: ScheduleConfig[];
}

interface BaseDatabaseConfig {
  name: string;
  description?: string;
  serverName?: string;
  dockerImage: string;
  databasePassword: string;
  command?: string;
  args?: string[];
  externalPort?: number;
  memoryReservation?: string;
  memoryLimit?: string;
  cpuReservation?: string;
  cpuLimit?: string;
  replicas?: number;
  mounts?: MountConfig[];
}

export interface PostgresConfig extends BaseDatabaseConfig {
  databaseName: string;
  databaseUser: string;
}

export interface MySqlConfig extends BaseDatabaseConfig {
  databaseName: string;
  databaseUser: string;
  databaseRootPassword: string;
}

export interface MariadbConfig extends BaseDatabaseConfig {
  databaseName: string;
  databaseUser: string;
  databaseRootPassword: string;
}

export interface MongoConfig extends BaseDatabaseConfig {
  databaseUser: string;
  replicaSets?: boolean;
}

export interface RedisConfig extends BaseDatabaseConfig {}

// ── Action plan types ──────────────────────────────────────────

export type ActionType = "create" | "update" | "unchanged";

export type ResourceType =
  | "project"
  | "environment"
  | "application"
  | "compose"
  | "postgres"
  | "mysql"
  | "mariadb"
  | "mongo"
  | "redis"
  | "domain"
  | "port"
  | "mount"
  | "redirect"
  | "security"
  | "schedule";

export interface Action {
  type: ActionType;
  resourceType: ResourceType;
  name: string;
  parentName?: string;
  remoteId?: string;
  config: Record<string, unknown>;
  changes?: Record<string, { from: unknown; to: unknown }>;
  children?: Action[];
  error?: string;
}

export interface ApplyPlan {
  project: Action;
  environments: Action[];
}

export interface ApplyResult {
  created: number;
  updated: number;
  unchanged: number;
  failed: number;
  errors: Array<{ resource: string; error: string }>;
}
