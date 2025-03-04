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
		mariadbId: Flags.string({
			char: "m",
			description: "ID of the MariaDB instance to delete",
			required: false,
		}),
		skipConfirm: Flags.boolean({
			char: "y",
			description: "Skip confirmation prompt",
			default: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(DatabaseMariadbDelete);
		let { projectId, mariadbId } = flags;

		if (!projectId || !mariadbId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const answers = await inquirer.prompt([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project.projectId,
						})),
						message: "Select a project to delete the MariaDB instance from:",
						name: "selectedProject",
						type: "list",
					},
				]);
				projectId = answers.selectedProject;
			}

			const projectSelected = await getProject(projectId, auth, this);

			if (!projectSelected.mariadb || projectSelected.mariadb.length === 0) {
				this.error(chalk.yellow("No MariaDB instances found in this project."));
			}

			if (!mariadbId) {
				const dbAnswers = await inquirer.prompt([
					{
						// @ts-ignore
						choices: projectSelected.mariadb.map((db) => ({
							name: db.name,
							value: db.mariadbId,
						})),
						message: "Select the MariaDB instance to delete:",
						name: "selectedDb",
						type: "list",
					},
				]);
				mariadbId = dbAnswers.selectedDb;
			}
		}

		if (!flags.skipConfirm) {
			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to delete this MariaDB instance?",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.error(chalk.yellow("MariaDB deletion cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/mariadb.remove`,
				{
					json: {
						mariadbId,
					},
				},
				{
					headers: {
						"x-api-key": auth.token,
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.data.result.data.json) {
				this.error(chalk.red("Error deleting MariaDB instance"));
			}
			this.log(chalk.green("MariaDB instance deleted successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error deleting MariaDB instance: ${error.message}`));
		}
	}
}
