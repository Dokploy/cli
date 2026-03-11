import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { type Database, getProject, getProjects } from "../../../utils/shared.js";
import { readAuthConfig } from "../../../utils/utils.js";

export default class DatabasePostgresDeploy extends Command {
	static description = "Deploy a PostgreSQL instance to a project.";

	static examples = ["$ <%= config.bin %> postgres deploy"];

	static flags = {
		environmentId: Flags.string({
			char: "e",
			description: "ID of the environment",
			required: false,
		}),
		postgresId: Flags.string({
			char: "d",
			description: "ID of the PostgreSQL instance to deploy",
			required: false,
		}),
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		skipConfirm: Flags.boolean({
			char: "y",
			default: false,
			description: "Skip confirmation prompt",
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(DatabasePostgresDeploy);
		let { environmentId, postgresId, projectId } = flags;

		if (!projectId || !environmentId || !postgresId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const { project } = await inquirer.prompt<{ project: { name: string; projectId: string } }>([
					{
						choices: projects.map((p) => ({ name: p.name, value: p })),
						message: "Select a project to deploy the PostgreSQL instance from:",
						name: "project",
						type: "list",
					},
				]);
				projectId = project.projectId;
			}

			// Fetch full project data (includes name + appName for all services)
			const projectDetails = await getProject(projectId, auth, this);

			if (!environmentId) {
				if (!projectDetails.environments || projectDetails.environments.length === 0) {
					this.error(chalk.yellow("No environments found in this project."));
				}

				const { environment } = await inquirer.prompt<{ environment: { environmentId: string; name: string } }>([
					{
						choices: projectDetails.environments.map((env: { description: string; environmentId: string; name: string }) => ({
							name: `${env.name} (${env.description})`,
							value: env,
						})),
						message: "Select an environment:",
						name: "environment",
						type: "list",
					},
				]);
				environmentId = environment.environmentId;
			}

			if (!postgresId) {
				const selectedEnv = projectDetails.environments.find(
					(e: { environmentId: string }) => e.environmentId === environmentId,
				);

				if (!selectedEnv?.postgres || selectedEnv.postgres.length === 0) {
					this.error(chalk.yellow("No PostgreSQL instances found in this environment."));
				}

				const { selectedDb } = await inquirer.prompt<{ selectedDb: string }>([
					{
						choices: selectedEnv.postgres.map((db: Database) => ({
							name: `${db.appName}:${db.name}`,
							value: db.postgresId,
						})),
						message: "Select the PostgreSQL instance to deploy:",
						name: "selectedDb",
						type: "list",
					},
				]);
				postgresId = selectedDb;
			}
		}

		if (!flags.skipConfirm) {
			const { confirmDeploy } = await inquirer.prompt<{ confirmDeploy: boolean }>([
				{
					default: false,
					message: "Are you sure you want to deploy this PostgreSQL instance?",
					name: "confirmDeploy",
					type: "confirm",
				},
			]);

			if (!confirmDeploy) {
				this.error(chalk.yellow("PostgreSQL deployment cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/postgres.deploy`,
				{ json: { postgresId } },
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": auth.token,
					},
				},
			);

			if (response.status !== 200) {
				this.error(chalk.red("Error deploying PostgreSQL instance"));
			}

			this.log(chalk.green("PostgreSQL instance deployed successfully."));
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			this.error(chalk.red(`Error deploying PostgreSQL instance: ${message}`));
		}
	}
}
