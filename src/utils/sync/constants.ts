export const EPHEMERAL_FIELDS = new Set([
	"createdAt",
	"updatedAt",
	"applicationStatus",
	"composeStatus",
	"adminId",
	"projectId",
	"environmentId",
	"applicationId",
	"composeId",
	"postgresId",
	"mysqlId",
	"mariadbId",
	"mongoId",
	"redisId",
	"domainId",
	"portId",
	"mountId",
	"redirectId",
	"securityId",
]);

export const SENSITIVE_FIELDS = new Set([
	"password",
	"databasePassword",
	"databaseRootPassword",
	"env",
	"buildArgs",
	"customGitSSHKeyId",
]);

export const REDACTED_VALUE = "*** REDACTED ***";

export const DEFAULT_OUTPUT_DIR = "./dokploy-state";

export const BATCH_CONCURRENCY = 10;

export const DB_TYPES = ["postgres", "mysql", "mariadb", "mongo", "redis"] as const;

export type DbType = (typeof DB_TYPES)[number];

export const DB_ID_FIELD: Record<DbType, string> = {
	postgres: "postgresId",
	mysql: "mysqlId",
	mariadb: "mariadbId",
	mongo: "mongoId",
	redis: "redisId",
};
