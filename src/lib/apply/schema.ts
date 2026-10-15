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
	env: z.string().optional(),
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
	buildSecrets: z.string().optional(),
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
	env: z.string().optional(),
	applications: z.array(applicationSchema).optional(),
	compose: z.array(composeSchema).optional(),
	postgres: z.array(postgresSchema).optional(),
	mysql: z.array(mysqlSchema).optional(),
	mariadb: z.array(mysqlSchema).optional(),
	mongo: z.array(mongoSchema).optional(),
	redis: z.array(redisSchema).optional(),
});

export const projectSchema = z.strictObject({
	apiVersion: z.literal("v1"),
	kind: z.literal("Project"),
	name: z.string().min(1),
	description: z.string().optional(),
	env: z.string().optional(),
	environments: z.array(environmentSchema).min(1),
});

const sshKeySchema = z.strictObject({
	name: z.string().min(1),
	description: z.string().optional(),
	publicKey: z.string().optional(),
	privateKey: z.string().optional(),
});

const serverSchema = z.strictObject({
	name: z.string().min(1),
	description: z.string().optional(),
	ipAddress: z.string().optional(),
	port: z.number().int().positive().optional(),
	username: z.string().optional(),
	sshKeyName: z.string().optional(),
	serverType: z.enum(["deploy", "build"]).optional(),
	enableDockerCleanup: z.boolean().optional(),
});

const destinationSchema = z.strictObject({
	name: z.string().min(1),
	provider: z.string().optional(),
	accessKey: z.string().optional(),
	secretAccessKey: z.string().optional(),
	bucket: z.string().optional(),
	region: z.string().optional(),
	endpoint: z.string().optional(),
	additionalFlags: z.array(z.string()).optional(),
	serverName: z.string().optional(),
});

const registrySchema = z.strictObject({
	registryName: z.string().min(1),
	registryType: z.enum(["cloud", "selfHosted"]).optional(),
	registryUrl: z.string().optional(),
	username: z.string().optional(),
	password: z.string().optional(),
	imagePrefix: z.string().optional(),
	serverName: z.string().optional(),
});

const certificateSchema = z.strictObject({
	name: z.string().min(1),
	certificateData: z.string().optional(),
	privateKey: z.string().optional(),
	autoRenew: z.boolean().optional(),
	serverName: z.string().optional(),
});

const text = z.string().optional();
const flag = z.boolean().optional();
const count = z.number().int().optional();
const addresses = z.array(z.string()).optional();

export const NOTIFICATION_EVENTS = [
	"appDeploy",
	"appBuildError",
	"databaseBackup",
	"dokployBackup",
	"volumeBackup",
	"dokployRestart",
	"dockerCleanup",
	"serverThreshold",
];

export const notificationFields = {
	slack: { webhookUrl: text, channel: text },
	telegram: { botToken: text, chatId: text, messageThreadId: text },
	discord: { webhookUrl: text, decoration: flag },
	email: {
		smtpServer: text,
		smtpPort: count,
		username: text,
		password: text,
		fromAddress: text,
		toAddresses: addresses,
	},
	resend: { apiKey: text, fromAddress: text, toAddresses: addresses },
	gotify: {
		serverUrl: text,
		appToken: text,
		priority: count,
		decoration: flag,
	},
	ntfy: { serverUrl: text, topic: text, accessToken: text, priority: count },
	mattermost: { webhookUrl: text, channel: text, username: text },
	custom: {
		endpoint: text,
		headers: z.record(z.string(), z.string()).optional(),
	},
	lark: { webhookUrl: text },
	teams: { webhookUrl: text },
	pushover: {
		userKey: text,
		apiToken: text,
		priority: count,
		retry: count,
		expire: count,
	},
};

export type NotificationType = keyof typeof notificationFields;

const notificationBase = {
	name: z.string().min(1),
	...Object.fromEntries(NOTIFICATION_EVENTS.map((event) => [event, flag])),
};

const notificationSchema = z.discriminatedUnion(
	"type",
	Object.entries(notificationFields).map(([type, fields]) =>
		z.strictObject({ type: z.literal(type), ...notificationBase, ...fields }),
	) as unknown as [z.ZodObject, ...z.ZodObject[]],
);

export const vaultProviderFields = {
	hashicorp: { url: text, token: text, namespace: text, mount: text },
	infisical: {
		siteUrl: text,
		clientId: text,
		clientSecret: text,
		projectId: text,
		environmentSlug: text,
		secretPath: text,
	},
	aws: {
		region: text,
		accessKeyId: text,
		secretAccessKey: text,
		endpoint: text,
	},
	"aws-parameter-store": {
		region: text,
		accessKeyId: text,
		secretAccessKey: text,
		endpoint: text,
		parameterPath: text,
	},
	doppler: { serviceToken: text, project: text, config: text },
	azure: { vaultUri: text, tenantId: text, clientId: text, clientSecret: text },
	scaleway: { region: text, projectId: text, secretKey: text, apiUrl: text },
	phase: { token: text, appId: text, env: text, path: text, apiUrl: text },
};

export type VaultProviderType = keyof typeof vaultProviderFields;

const assignmentSchema = z.strictObject({
	project: z.string().min(1),
	environments: z.array(z.string().min(1)).optional(),
});

const vaultProviderSchema = z.discriminatedUnion(
	"providerType",
	Object.entries(vaultProviderFields).map(([providerType, fields]) =>
		z.strictObject({
			name: z.string().min(1),
			providerType: z.literal(providerType),
			assignments: z.array(assignmentSchema).optional(),
			...fields,
		}),
	) as unknown as [z.ZodObject, ...z.ZodObject[]],
);

export const organizationSchema = z.strictObject({
	apiVersion: z.literal("v1"),
	kind: z.literal("Organization"),
	sshKeys: z.array(sshKeySchema).optional(),
	servers: z.array(serverSchema).optional(),
	destinations: z.array(destinationSchema).optional(),
	registries: z.array(registrySchema).optional(),
	certificates: z.array(certificateSchema).optional(),
	notifications: z.array(notificationSchema).optional(),
	vaultProviders: z.array(vaultProviderSchema).optional(),
});

export const organizationItemSchemas = {
	sshKeys: sshKeySchema,
	servers: serverSchema,
	destinations: destinationSchema,
	registries: registrySchema,
	certificates: certificateSchema,
};

export const documentSchema = z.discriminatedUnion("kind", [
	projectSchema,
	organizationSchema,
]);

export type ProjectConfig = z.output<typeof projectSchema>;
export type OrganizationConfig = z.output<typeof organizationSchema>;
export type DokployDocument = z.output<typeof documentSchema>;
export type EnvironmentConfig = z.output<typeof environmentSchema>;
