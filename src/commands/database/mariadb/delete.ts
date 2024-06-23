import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { getProject, getProjects } from "../../../utils/shared.js";
import { readAuthConfig } from "../../../utils/utils.js";

export default class DatabaseMariadbDelete extends Command {
	static description = "Delete a MariaDB database from a project.";
	static examples = [
		"$ <%= config.bin %> mariadb delete",
		"$ <%= config.bin %> mariadb delete -p <projectId>",
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
		const { flags } = await this.parse(DatabaseMariadbDelete);
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
					type: "list",
					name: "selectedProject",
					message: "Select a project to delete the MariaDB database from:",
					choices: projects.map((project: any) => ({
						name: project.name,
						value: project.projectId,
					})),
				},
			]);
			projectId = answers.selectedProject;
		}

		try {
			const project = await getProject(projectId, auth, this);

			if (!project.mariadb || project.mariadb.length === 0) {
				this.log(chalk.yellow("No MariaDB databases found in this project."));
				return;
			}

			const appAnswers = await inquirer.prompt([
				{
					type: "list",
					name: "selectedDb",
					message: "Select the MariaDB database to delete:",
					choices: project.mariadb.map((db: any) => ({
						name: db.name,
						value: db.mariadbId,
					})),
				},
			]);

			const mariadbId = appAnswers.selectedDb;

			const confirmAnswers = await inquirer.prompt([
				{
					type: "confirm",
					name: "confirmDelete",
					message: "Are you sure you want to delete this MariaDB database?",
					default: false,
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.log(chalk.yellow("Database deletion cancelled."));
				return;
			}

			const deleteResponse = await axios.post(
				`${auth.url}/api/trpc/mariadb.remove`,
				{
					json: {
						mariadbId,
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
				this.error(chalk.red("Error deleting mariadb database"));
			}
			this.log(chalk.green("MariaDB database deleted successfully."));
		} catch (error) {
			this.error(
				// @ts-ignore
				chalk.red(`Failed to delete MariaDB database: ${error.message}`),
			);
		}
	}
}
