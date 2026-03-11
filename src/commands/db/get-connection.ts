import { Command } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { type Environment, getProject, getProjects } from "../../utils/shared.js";

import type { AuthConfig } from "../../utils/utils.js";
import { readAuthConfig } from "../../utils/utils.js";

type DbType = "mariadb" | "mongo" | "mysql" | "postgres" | "redis";

type DbChoice = {
	id: string;
	name: string;
	type: DbType;
};

type DbRecord = {
	appName: string;
	databaseName?: string;
	databasePassword: string;
	databaseUser?: string;
};

const DB_META: Record<DbType, { endpoint: string; idField: string; port: number }> = {
	mariadb: { endpoint: "mariadb.one", idField: "mariadbId", port: 3306 },
	mongo:   { endpoint: "mongo.one",   idField: "mongoId",   port: 27_017 },
	mysql:   { endpoint: "mysql.one",   idField: "mysqlId",   port: 3306 },
	postgres: { endpoint: "postgres.one", idField: "postgresId", port: 5432 },
	redis:   { endpoint: "redis.one",   idField: "redisId",   port: 6379 },
};

function buildConnectionUrl(type: DbType, r: DbRecord): string {
	switch (type) {
		case "postgres": {
			return `postgresql://${r.databaseUser}:${r.databasePassword}@${r.appName}:5432/${r.databaseName}`;
		}
		case "mysql": {
			return `mysql://${r.databaseUser}:${r.databasePassword}@${r.appName}:3306/${r.databaseName}`;
		}
		case "mariadb": {
			return `mariadb://${r.databaseUser}:${r.databasePassword}@${r.appName}:3306/${r.databaseName}`;
		}
		case "mongo": {
			return `mongodb://${r.databaseUser}:${r.databasePassword}@${r.appName}:27017`;
		}
		case "redis": {
			return `redis://default:${r.databasePassword}@${r.appName}:6379`;
		}
	}
}

export default class DbGetConnection extends Command {
	static override description =
		"Get the internal connection URL for a database in a project.";

	static override examples = ["<%= config.bin %> db get-connection"];

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		this.log(chalk.blue.bold("\n  Listing all Projects \n"));
		const projects = await getProjects(auth, this);

		const { project } = await inquirer.prompt<{ project: { name: string; projectId: string } }>([
			{
				choices: projects.map((p) => ({ name: p.name, value: p })),
				message: "Select a project:",
				name: "project",
				type: "list",
			},
		]);

		const projectDetails = await getProject(project.projectId, auth, this);

		const { environment } = await inquirer.prompt<{ environment: Environment }>([
			{
				choices: projectDetails.environments.map((e: Environment) => ({
					name: e.name,
					value: e,
				})),
				message: "Select an environment:",
				name: "environment",
				type: "list",
			},
		]);

		const dbChoices: DbChoice[] = [
			...environment.mariadb.map((db) => ({
				id: db.mariadbId ?? "",
				name: `${db.name} (MariaDB)`,
				type: "mariadb" as DbType,
			})),
			...environment.mongo.map((db) => ({
				id: db.mongoId ?? "",
				name: `${db.name} (MongoDB)`,
				type: "mongo" as DbType,
			})),
			...environment.mysql.map((db) => ({
				id: db.mysqlId ?? "",
				name: `${db.name} (MySQL)`,
				type: "mysql" as DbType,
			})),
			...environment.postgres.map((db) => ({
				id: db.postgresId ?? "",
				name: `${db.name} (PostgreSQL)`,
				type: "postgres" as DbType,
			})),
			...environment.redis.map((db) => ({
				id: db.redisId ?? "",
				name: `${db.name} (Redis)`,
				type: "redis" as DbType,
			})),
		];

		if (dbChoices.length === 0) {
			this.error(chalk.red("No databases found in this environment."));
		}

		const { db } = await inquirer.prompt<{ db: DbChoice }>([
			{
				choices: dbChoices.map((d) => ({ name: d.name, value: d })),
				message: "Select a database:",
				name: "db",
				type: "list",
			},
		]);

		const record = await this.fetchDbRecord(auth, db);
		const url = buildConnectionUrl(db.type, record);

		this.log(chalk.blue.bold("\n── Internal Connection URL ──────────────────────\n"));
		this.log(`  ${chalk.green(url)}`);
		this.log("");
	}

	private async fetchDbRecord(auth: AuthConfig, db: DbChoice): Promise<DbRecord> {
		const { endpoint, idField } = DB_META[db.type];
		const response = await axios.get(`${auth.url}/api/trpc/${endpoint}`, {
			headers: {
				"Content-Type": "application/json",
				"x-api-key": auth.token,
			},
			params: {
				input: JSON.stringify({ json: { [idField]: db.id } }),
			},
		});
		return response.data.result.data.json as DbRecord;
	}
}
