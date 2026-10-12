import { z } from "zod";

const domainSchema = z.strictObject({
	host: z.string().min(1),
	port: z.number().int().positive().optional(),
	https: z.boolean().optional(),
	path: z.string().optional(),
	certificateType: z.enum(["none", "letsencrypt", "custom"]).optional(),
	customCertResolver: z.string().optional(),
	serviceName: z.string().optional(),
	internalPath: z.string().optional(),
	stripPath: z.boolean().optional(),
});

const portSchema = z.strictObject({
	publishedPort: z.number().int().positive(),
	targetPort: z.number().int().positive(),
	protocol: z.enum(["tcp", "udp"]),
	publishMode: z.enum(["host", "ingress"]).optional(),
});

const mountSchema = z.strictObject({
	type: z.enum(["bind", "volume", "file"]),
	mountPath: z.string().min(1),
	hostPath: z.string().optional(),
	volumeName: z.string().optional(),
	filePath: z.string().optional(),
	content: z.string().optional(),
});

const redirectSchema = z.strictObject({
	regex: z.string().min(1),
	replacement: z.string().min(1),
	permanent: z.boolean().optional(),
});

const securitySchema = z.strictObject({
	username: z.string().min(1),
	password: z.string().min(1).optional(),
});

const scheduleSchema = z.strictObject({
	name: z.string().min(1),
	cronExpression: z.string().min(1),
	command: z.string().min(1),
	description: z.string().optional(),
	shellType: z.enum(["bash", "sh"]).optional(),
	enabled: z.boolean().optional(),
	timezone: z.string().optional(),
	serviceName: z.string().optional(),
});

export const childSchemas = {
	domains: domainSchema,
	ports: portSchema,
	mounts: mountSchema,
	redirects: redirectSchema,
	security: securitySchema,
	schedules: scheduleSchema,
};

const serviceFields = {
	name: z.string().min(1),
	description: z.string().optional(),
	serverName: z.string().optional(),
};

const resourceLimitFields = {
	memoryReservation: z.string().optional(),
	memoryLimit: z.string().optional(),
	cpuReservation: z.string().optional(),
	cpuLimit: z.string().optional(),
};

const gitFields = {
	gitProvider: z.string().optional(),
	repository: z.string().optional(),
	owner: z.string().optional(),
	branch: z.string().optional(),
	customGitUrl: z.string().optional(),
	customGitBranch: z.string().optional(),
	autoDeploy: z.boolean().optional(),
	triggerType: z.enum(["push", "tag"]).optional(),
};

const applicationSchema = z.strictObject({
	...serviceFields,
	...gitFields,
	...resourceLimitFields,
	sourceType: z
		.enum(["docker", "git", "github", "gitlab", "bitbucket", "gitea", "drop"])
		.optional(),
	buildType: z
		.enum([
			"dockerfile",
			"nixpacks",
			"heroku_buildpacks",
			"paketo_buildpacks",
			"static",
			"railpack",
		])
		.optional(),
	buildPath: z.string().optional(),
	customGitBuildPath: z.string().optional(),
	dockerImage: z.string().optional(),
	dockerfile: z.string().optional(),
	dockerContextPath: z.string().optional(),
	dockerBuildStage: z.string().optional(),
	buildArgs: z.string().optional(),
	command: z.string().optional(),
	args: z.array(z.string()).optional(),
	replicas: z.number().int().positive().optional(),
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

const composeSchema = z.strictObject({
	...serviceFields,
	...gitFields,
	sourceType: z
		.enum(["git", "github", "gitlab", "bitbucket", "gitea", "raw"])
		.optional(),
	composeType: z.enum(["docker-compose", "stack"]).optional(),
	composeFile: z.string().optional(),
	composePath: z.string().optional(),
	command: z.string().optional(),
	domains: z.array(domainSchema).optional(),
	mounts: z.array(mountSchema).optional(),
	schedules: z.array(scheduleSchema).optional(),
});

const databaseFields = {
	...serviceFields,
	...resourceLimitFields,
	dockerImage: z.string().optional(),
	databasePassword: z.string().optional(),
	command: z.string().optional(),
	args: z.array(z.string()).optional(),
	externalPort: z.number().int().positive().optional(),
	replicas: z.number().int().positive().optional(),
	mounts: z.array(mountSchema).optional(),
};

const postgresSchema = z.strictObject({
	...databaseFields,
	databaseName: z.string().optional(),
	databaseUser: z.string().optional(),
});

const mysqlSchema = z.strictObject({
	...databaseFields,
	databaseName: z.string().optional(),
	databaseUser: z.string().optional(),
	databaseRootPassword: z.string().optional(),
});

const mongoSchema = z.strictObject({
	...databaseFields,
	databaseUser: z.string().optional(),
	replicaSets: z.boolean().optional(),
});

const redisSchema = z.strictObject(databaseFields);

export const serviceSchemas = {
	application: applicationSchema,
	compose: composeSchema,
	postgres: postgresSchema,
	mysql: mysqlSchema,
	mariadb: mysqlSchema,
	mongo: mongoSchema,
	redis: redisSchema,
};

const environmentSchema = z.strictObject({
	name: z.string().min(1),
	description: z.string().optional(),
	applications: z.array(applicationSchema).optional(),
	compose: z.array(composeSchema).optional(),
	postgres: z.array(postgresSchema).optional(),
	mysql: z.array(mysqlSchema).optional(),
	mariadb: z.array(mysqlSchema).optional(),
	mongo: z.array(mongoSchema).optional(),
	redis: z.array(redisSchema).optional(),
});

export const dokployConfigSchema = z.strictObject({
	apiVersion: z.literal("v1"),
	kind: z.literal("Project"),
	name: z.string().min(1),
	description: z.string().optional(),
	environments: z.array(environmentSchema).min(1),
});

export type DokployConfig = z.output<typeof dokployConfigSchema>;
export type EnvironmentConfig = z.output<typeof environmentSchema>;
