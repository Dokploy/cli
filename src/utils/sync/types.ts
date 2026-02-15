export type DomainState = {
	certificateType?: string;
	domainId: string;
	host: string;
	https?: boolean;
	path?: string;
	port?: number;
	serviceName?: string;
	uniqueConfigKey?: number;
};

export type PortState = {
	portId: string;
	publishedPort: number;
	targetPort: number;
	protocol?: string;
};

export type MountState = {
	content?: string;
	filePath?: string;
	hostPath?: string;
	mountId: string;
	mountPath: string;
	type: string;
	serviceType?: string;
};

export type RedirectState = {
	redirectId: string;
	regex: string;
	replacement: string;
	permanent?: boolean;
};

export type SecurityState = {
	securityId: string;
	username: string;
	password: string;
};

export type ApplicationState = {
	applicationId: string;
	name: string;
	appName: string;
	description?: string;
	env?: string;
	memoryLimit?: number;
	memoryReservation?: number;
	cpuLimit?: number;
	cpuReservation?: number;
	replicas?: number;
	command?: string;
	sourceType?: string;
	repository?: string;
	branch?: string;
	buildPath?: string;
	buildType?: string;
	dockerfile?: string;
	dockerImage?: string;
	username?: string;
	password?: string;
	customGitUrl?: string;
	customGitBranch?: string;
	customGitSSHKeyId?: string;
	publishDirectory?: string;
	autoDeploy?: boolean;
	domains?: DomainState[];
	ports?: PortState[];
	mounts?: MountState[];
	redirects?: RedirectState[];
	security?: SecurityState[];
	[key: string]: unknown;
};

export type ComposeState = {
	composeId: string;
	name: string;
	appName: string;
	description?: string;
	env?: string;
	composeFile?: string;
	composeType?: string;
	sourceType?: string;
	repository?: string;
	branch?: string;
	autoDeploy?: boolean;
	customGitUrl?: string;
	customGitBranch?: string;
	customGitSSHKeyId?: string;
	command?: string;
	domains?: DomainState[];
	mounts?: MountState[];
	[key: string]: unknown;
};

export type PostgresState = {
	postgresId: string;
	type: "postgres";
	name: string;
	appName: string;
	description?: string;
	env?: string;
	databaseName?: string;
	databaseUser?: string;
	databasePassword?: string;
	dockerImage?: string;
	memoryLimit?: number;
	memoryReservation?: number;
	cpuLimit?: number;
	cpuReservation?: number;
	command?: string;
	domains?: DomainState[];
	ports?: PortState[];
	mounts?: MountState[];
	[key: string]: unknown;
};

export type MySqlState = {
	mysqlId: string;
	type: "mysql";
	name: string;
	appName: string;
	description?: string;
	env?: string;
	databaseName?: string;
	databaseUser?: string;
	databasePassword?: string;
	databaseRootPassword?: string;
	dockerImage?: string;
	memoryLimit?: number;
	memoryReservation?: number;
	cpuLimit?: number;
	cpuReservation?: number;
	command?: string;
	domains?: DomainState[];
	ports?: PortState[];
	mounts?: MountState[];
	[key: string]: unknown;
};

export type MariadbState = {
	mariadbId: string;
	type: "mariadb";
	name: string;
	appName: string;
	description?: string;
	env?: string;
	databaseName?: string;
	databaseUser?: string;
	databasePassword?: string;
	databaseRootPassword?: string;
	dockerImage?: string;
	memoryLimit?: number;
	memoryReservation?: number;
	cpuLimit?: number;
	cpuReservation?: number;
	command?: string;
	domains?: DomainState[];
	ports?: PortState[];
	mounts?: MountState[];
	[key: string]: unknown;
};

export type MongoState = {
	mongoId: string;
	type: "mongo";
	name: string;
	appName: string;
	description?: string;
	env?: string;
	databaseUser?: string;
	databasePassword?: string;
	dockerImage?: string;
	memoryLimit?: number;
	memoryReservation?: number;
	cpuLimit?: number;
	cpuReservation?: number;
	command?: string;
	domains?: DomainState[];
	ports?: PortState[];
	mounts?: MountState[];
	[key: string]: unknown;
};

export type RedisState = {
	redisId: string;
	type: "redis";
	name: string;
	appName: string;
	description?: string;
	env?: string;
	databasePassword?: string;
	dockerImage?: string;
	memoryLimit?: number;
	memoryReservation?: number;
	cpuLimit?: number;
	cpuReservation?: number;
	command?: string;
	domains?: DomainState[];
	ports?: PortState[];
	mounts?: MountState[];
	[key: string]: unknown;
};

export type DatabaseState =
	| PostgresState
	| MySqlState
	| MariadbState
	| MongoState
	| RedisState;

export type EnvironmentState = {
	environmentId: string;
	name: string;
	description?: string;
	applications: ApplicationState[];
	compose: ComposeState[];
	databases: DatabaseState[];
};

export type ProjectState = {
	projectId: string;
	name: string;
	description?: string;
	environments: EnvironmentState[];
};

export type SyncState = {
	projects: ProjectState[];
};
