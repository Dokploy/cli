import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { readAuthConfig } from "../../../utils/utils.js";
import { getProject, getProjects } from "../../../utils/shared.js";

export default class DatabaseRedisDelete extends Command {
	static description = "Delete an redis database from a project.";

	static examples = [
		"$ <%= config.bin %> redis delete",
		"$ <%= config.bin %> redis delete -p <projectId>",
	];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		const { flags } = await this.parse(DatabaseRedisDelete);
		let { projectId } = flags;

		if (!projectId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));

			const projects = await getProjects(auth, this);

			if (projects.length === 0) {
				this.log(chalk.yellow("No projects found."));
				return;
			}

			const answers = await inquirer.prompt([
				{
					choices: projects.map((project: any) => ({
						name: project.name,
						value: project.projectId,
					})),
					message: "Select a project to delete the redis database from:",
					name: "selectedProject",
					type: "list",
				},
			]);

			projectId = answers.selectedProject;
		}

		try {
			const project = await getProject(projectId, auth, this);

			if (!project.redis || project.redis.length === 0) {
				this.log(chalk.yellow("No redis databases found in this project."));
				return;
			}

			// Permitir al usuario seleccionar una aplicación
			const appAnswers = await inquirer.prompt([
				{
					choices: project.redis.map((db: any) => ({
						name: db.name,
						value: db.redisId,
					})),
					message: "Select the redis database to delete:",
					name: "selectedApp",
					type: "list",
				},
			]);

			const redisId = appAnswers.selectedApp;

			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to delete this redis database?",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.log(chalk.yellow("Database deletion cancelled."));
				return;
			}

			const deleteResponse = await axios.post(
				`${auth.url}/api/trpc/redis.remove`,
				{
					json: {
						redisId,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${auth.token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (!deleteResponse.data.result.data.json) {
				this.error(chalk.red("Error deleting redis database"));
			}

			this.log(chalk.green("Redis database deleted successfully."));
		} catch (error) {
			this.error(
				// @ts-expect-error - TS2339: Property 'data' does not exist on type 'AxiosError<any>'.
				chalk.red(`Failed to delete redis database: ${error.message}`),
			);
		}
	}
}
