import { Command, Flags } from "@oclif/core";
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

	static override flags = {
		dbId: Flags.string({
			description: "ID of the database instance",
			required: false,
		}),
		dbType: Flags.string({
			description: "Type of database (mysql, postgres, mariadb, mongo, redis)",
			options: ["mysql", "postgres", "mariadb", "mongo", "redis"],
			required: false,
		}),
		environmentId: Flags.string({
			char: "e",
			description: "ID of the environment",
			required: false,
		}),
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(DbGetConnection);

		let db: DbChoice;

		if (flags.dbId && flags.dbType) {
			// Non-interactive: resolve db name from API
			const type = flags.dbType as DbType;
			const { idField } = DB_META[type];
			const record = await this.fetchDbRecordById(auth, type, flags.dbId);
			db = { id: flags.dbId, name: flags.dbId, type };
			const url = buildConnectionUrl(type, record);
			this.log(chalk.blue.bold("\n── Internal Connection URL ──────────────────────\n"));
			this.log(`  ${chalk.green(url)}`);
			this.log("");
			return;
		}

		// Interactive flow
		this.log(chalk.blue.bold("\n  Listing all Projects \n"));
		const projects = await getProjects(auth, this);

		let projectId = flags.projectId;
		let environmentId = flags.environmentId;

		if (!projectId) {
			const { project } = await inquirer.prompt<{ project: { name: string; projectId: string } }>([
				{
					choices: projects.map((p) => ({ name: p.name, value: p })),
					message: "Select a project:",
					name: "project",
					type: "list",
				},
			]);
			projectId = project.projectId;
		}

		const projectDetails = await getProject(projectId, auth, this);

		if (!environmentId) {
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
			environmentId = environment.environmentId;
		}

		const environment = projectDetails.environments.find(
			(e: Environment) => e.environmentId === environmentId,
		) as Environment;

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

		const { selectedDb } = await inquirer.prompt<{ selectedDb: DbChoice }>([
			{
				choices: dbChoices.map((d) => ({ name: d.name, value: d })),
				message: "Select a database:",
				name: "selectedDb",
				type: "list",
			},
		]);

		const record = await this.fetchDbRecord(auth, selectedDb);
		const url = buildConnectionUrl(selectedDb.type, record);

		this.log(chalk.blue.bold("\n── Internal Connection URL ──────────────────────\n"));
		this.log(`  ${chalk.green(url)}`);
		this.log("");
	}

	private async fetchDbRecord(auth: AuthConfig, db: DbChoice): Promise<DbRecord> {
		return this.fetchDbRecordById(auth, db.type, db.id);
	}

	private async fetchDbRecordById(auth: AuthConfig, type: DbType, id: string): Promise<DbRecord> {
		const { endpoint, idField } = DB_META[type];
		const response = await axios.get(`${auth.url}/api/trpc/${endpoint}`, {
			headers: {
				"Content-Type": "application/json",
				"x-api-key": auth.token,
			},
			params: {
				input: JSON.stringify({ json: { [idField]: id } }),
			},
		});
		return response.data.result.data.json as DbRecord;
	}
}
