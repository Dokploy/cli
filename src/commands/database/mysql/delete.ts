import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { readAuthConfig } from "../../../utils/utils.js";
import { getProject, getProjects } from "../../../utils/shared.js";

export default class DatabaseMysqlDelete extends Command {
	static description = "Delete a MySQL database from a project.";

	static examples = [
		"$ <%= config.bin %> mysql delete",
		"$ <%= config.bin %> mysql delete -p <projectId>",
	];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		mysqlId: Flags.string({
			char: "i",
			description: "ID of the MySQL database",
			required: false,
		}),
		skipConfirm: Flags.boolean({
			char: "y",
			description: "Skip confirmation",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(DatabaseMysqlDelete);
		let { projectId, mysqlId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !mysqlId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const answers = await inquirer.prompt([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project.projectId,
						})),
						message: "Select a project to delete the MySQL instance from:",
						name: "selectedProject",
						type: "list",
					},
				]);
				projectId = answers.selectedProject;
			}

			const projectSelected = await getProject(projectId, auth, this);

			if (!projectSelected.mysql || projectSelected.mysql.length === 0) {
				this.error(chalk.yellow("No MySQL instances found in this project."));
			}

			if (!mysqlId) {
				const dbAnswers = await inquirer.prompt([
					{
						// @ts-ignore
						choices: projectSelected.mysql.map((db) => ({
							name: db.name,
							value: db.mysqlId,
						})),
						message: "Select the MySQL instance to delete:",
						name: "selectedDb",
						type: "list",
					},
				]);
				mysqlId = dbAnswers.selectedDb;
			}
		}

		// Confirmar si no se especifica --skipConfirm
		if (!flags.skipConfirm) {
			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to delete this MySQL instance?",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.error(chalk.yellow("MySQL deletion cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/mysql.remove`,
				{
					json: {
						mysqlId,
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
				this.error(chalk.red("Error deleting MySQL instance"));
			}
			this.log(chalk.green("MySQL instance deleted successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error deleting MySQL instance: ${error.message}`));
		}
	}
}
