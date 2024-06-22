import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { readAuthConfig } from "../../../utils/utils.js";
import { getProject, getProjects } from "../../../utils/shared.js";

export default class DatabasePostgresDelete extends Command {
	static description = "Delete a PostgreSQL database from a project.";

	static examples = [
		"$ <%= config.bin %> postgres delete",
		"$ <%= config.bin %> postgres delete -p <projectId>",
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

		const { flags } = await this.parse(DatabasePostgresDelete);
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
					message: "Select a project to delete the PostgreSQL database from:",
					name: "selectedProject",
					type: "list",
				},
			]);

			projectId = answers.selectedProject;
		}

		try {
			const project = await getProject(projectId, auth, this);

			if (!project.postgres || project.postgres.length === 0) {
				this.log(
					chalk.yellow("No PostgreSQL databases found in this project."),
				);
				return;
			}

			const appAnswers = await inquirer.prompt([
				{
					choices: project.postgres.map((db: any) => ({
						name: db.name,
						value: db.postgresId,
					})),
					message: "Select the PostgreSQL database to delete:",
					name: "selectedApp",
					type: "list",
				},
			]);

			const postgresId = appAnswers.selectedApp;

			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to delete this postgres database?",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.log(chalk.yellow("Database deletion cancelled."));
				return;
			}

			const deleteResponse = await axios.post(
				`${auth.url}/api/trpc/postgres.remove`,
				{
					json: {
						postgresId,
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
				this.error(chalk.red("Error deleting PostgreSQL database"));
			}

			this.log(chalk.green("PostgreSQL database deleted successfully."));
		} catch (error) {
			// @ts-expect-error - TS2339: Property 'data' does not exist on type 'AxiosError<any>'.
			this.error(chalk.red(`Failed to delete application: ${error.message}`));
		}
	}
}
