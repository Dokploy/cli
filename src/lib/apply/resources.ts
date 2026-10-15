export type Fields = Record<string, any>;

export type ServiceType =
	| "application"
	| "compose"
	| "postgres"
	| "mysql"
	| "mariadb"
	| "mongo"
	| "redis";

export type ChildKey =
	| "domains"
	| "ports"
	| "mounts"
	| "redirects"
	| "security"
	| "schedules";

interface ServiceSpec {
	section: string;
	children: ChildKey[];
	createFields: string[];
	createOnly: string[];
	requiredOnCreate: string[];
	remove: string;
	removeParams: Fields;
}

interface ChildSpec {
	resourceType: string;
	endpoint: string;
	remove: string;
	updateRequires: string[];
	requiredOnCreate: string[];
	createDefaults: Fields;
	identity: (item: Fields, parentType: ServiceType) => string;
	parent: (parentType: ServiceType, parentId: string) => Fields;
}

export const SCOPE_FIELDS = ["name", "description", "env"];

export const PASSWORD_FIELDS = [
	"databasePassword",
	"databaseRootPassword",
	"password",
];

export const ENV_FIELDS = ["env", "buildArgs", "buildSecrets"];

export const CREDENTIAL_FIELDS = [
	"privateKey",
	"secretAccessKey",
	"webhookUrl",
	"botToken",
	"apiKey",
	"appToken",
	"accessToken",
	"apiToken",
	"userKey",
	"headers",
	"token",
	"clientSecret",
	"serviceToken",
	"secretKey",
];

export const SECRET_FIELDS = [
	...PASSWORD_FIELDS,
	...ENV_FIELDS,
	...CREDENTIAL_FIELDS,
];

const credentials = [
	"databaseName",
	"databaseUser",
	"databasePassword",
	"databaseRootPassword",
];

const database = (
	type: ServiceType,
	createFields: string[],
	requiredOnCreate: string[],
): Omit<ServiceSpec, "section"> => ({
	children: ["mounts"],
	createFields: ["name", "description", "dockerImage", ...createFields],
	createOnly: credentials,
	requiredOnCreate,
	remove: `${type}.remove`,
	removeParams: {},
});

export const SERVICES: Record<ServiceType, ServiceSpec> = {
	application: {
		section: "applications",
		children: [
			"domains",
			"ports",
			"mounts",
			"redirects",
			"security",
			"schedules",
		],
		createFields: ["name", "description"],
		createOnly: [],
		requiredOnCreate: [],
		remove: "application.delete",
		removeParams: {},
	},
	compose: {
		section: "compose",
		children: ["domains", "mounts", "schedules"],
		createFields: ["name", "description", "composeType"],
		createOnly: [],
		requiredOnCreate: [],
		remove: "compose.delete",
		removeParams: { deleteVolumes: false },
	},
	postgres: {
		section: "postgres",
		...database(
			"postgres",
			["databaseName", "databaseUser", "databasePassword"],
			["databaseName", "databaseUser", "databasePassword"],
		),
	},
	mysql: {
		section: "mysql",
		...database(
			"mysql",
			[
				"databaseName",
				"databaseUser",
				"databasePassword",
				"databaseRootPassword",
			],
			["databaseName", "databaseUser", "databasePassword"],
		),
	},
	mariadb: {
		section: "mariadb",
		...database(
			"mariadb",
			[
				"databaseName",
				"databaseUser",
				"databasePassword",
				"databaseRootPassword",
			],
			["databaseName", "databaseUser", "databasePassword"],
		),
	},
	mongo: {
		section: "mongo",
		...database(
			"mongo",
			["databaseUser", "databasePassword", "replicaSets"],
			["databaseUser", "databasePassword"],
		),
	},
	redis: {
		section: "redis",
		...database("redis", ["databasePassword"], ["databasePassword"]),
	},
};

export const SERVICE_TYPES = Object.keys(SERVICES) as ServiceType[];

const parentIdField = (parentType: ServiceType, parentId: string) => ({
	[`${parentType}Id`]: parentId,
});

export const CHILDREN: Record<ChildKey, ChildSpec> = {
	domains: {
		resourceType: "domain",
		endpoint: "domain",
		remove: "domain.delete",
		updateRequires: ["host"],
		requiredOnCreate: [],
		createDefaults: {},
		identity: (domain, parentType) =>
			parentType === "compose"
				? `${domain.host}:${domain.serviceName ?? ""}`
				: domain.host,
		parent: (parentType, parentId) => ({
			domainType: parentType,
			...parentIdField(parentType, parentId),
		}),
	},
	ports: {
		resourceType: "port",
		endpoint: "port",
		remove: "port.delete",
		updateRequires: ["publishedPort", "publishMode", "targetPort", "protocol"],
		requiredOnCreate: [],
		createDefaults: { publishMode: "ingress" },
		identity: (port) => `${port.publishedPort}:${port.protocol}`,
		parent: parentIdField,
	},
	mounts: {
		resourceType: "mount",
		endpoint: "mounts",
		remove: "mounts.remove",
		updateRequires: [],
		requiredOnCreate: [],
		createDefaults: {},
		identity: (mount) => mount.mountPath,
		parent: (parentType, parentId) => ({
			serviceType: parentType,
			serviceId: parentId,
		}),
	},
	redirects: {
		resourceType: "redirect",
		endpoint: "redirects",
		remove: "redirects.delete",
		updateRequires: ["regex", "replacement", "permanent"],
		requiredOnCreate: [],
		createDefaults: { permanent: false },
		identity: (redirect) => redirect.regex,
		parent: parentIdField,
	},
	security: {
		resourceType: "security",
		endpoint: "security",
		remove: "security.delete",
		updateRequires: ["username", "password"],
		requiredOnCreate: ["password"],
		createDefaults: {},
		identity: (security) => security.username,
		parent: parentIdField,
	},
	schedules: {
		resourceType: "schedule",
		endpoint: "schedule",
		remove: "schedule.delete",
		updateRequires: ["name", "cronExpression", "command"],
		requiredOnCreate: [],
		createDefaults: {},
		identity: (schedule) => schedule.name,
		parent: (parentType, parentId) => ({
			scheduleType: parentType,
			...parentIdField(parentType, parentId),
		}),
	},
};

export const CHILD_KEYS = Object.keys(CHILDREN) as ChildKey[];

export const isAutoCreatedMount = (
	type: ServiceType,
	mount: Fields,
	service: Fields,
) =>
	type !== "application" &&
	type !== "compose" &&
	mount.type === "volume" &&
	mount.volumeName === `${service.appName}-data`;

export const pick = (fields: Fields, keys: string[]): Fields =>
	Object.fromEntries(
		Object.entries(fields).filter(
			([key, value]) => keys.includes(key) && value !== undefined,
		),
	);

export const omit = (fields: Fields, keys: string[]): Fields =>
	Object.fromEntries(
		Object.entries(fields).filter(
			([key, value]) => !keys.includes(key) && value !== undefined,
		),
	);

export const childKeyOf = (resourceType: string): ChildKey =>
	CHILD_KEYS.find((key) => CHILDREN[key].resourceType === resourceType)!;

export const requiredOnCreate = (resourceType: string): string[] =>
	resourceType in SERVICES
		? SERVICES[resourceType as ServiceType].requiredOnCreate
		: (CHILDREN[childKeyOf(resourceType)]?.requiredOnCreate ?? []);

export const sequence = <T, R>(
	items: T[],
	run: (item: T) => Promise<R>,
): Promise<R[]> =>
	items.reduce<Promise<R[]>>(
		async (done, item) => [...(await done), await run(item)],
		Promise.resolve([]),
	);
