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
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		const { flags } = await this.parse(DatabaseMysqlDelete);
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
					message: "Select a project to delete the MySQL database from:",
					name: "selectedProject",
					type: "list",
				},
			]);

			projectId = answers.selectedProject;
		}

		try {
			const project = await getProject(projectId, auth, this);

			if (!project.mysql || project.mysql.length === 0) {
				this.log(chalk.yellow("No MySQL databases found in this project."));
				return;
			}

			// Permitir al usuario seleccionar una aplicación
			const appAnswers = await inquirer.prompt([
				{
					choices: project.mysql.map((app: any) => ({
						name: app.name,
						value: app.mysqlId,
					})),
					message: "Select the MySQL database to delete:",
					name: "selectedApp",
					type: "list",
				},
			]);

			const mysqlId = appAnswers.selectedApp;

			// Confirmar eliminación
			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to delete this mysql database?",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.log(chalk.yellow("Application deletion cancelled."));
				return;
			}

			// Eliminar la aplicación seleccionada
			const deleteResponse = await axios.post(
				`${auth.url}/api/trpc/mysql.remove`,
				{
					json: {
						mysqlId,
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
				this.error(chalk.red("Error deleting application"));
			}

			this.log(chalk.green("Application deleted successfully."));
		} catch (error) {
			// @ts-expect-error - TS2339: Property 'data' does not exist on type 'AxiosError<any>'.
			this.error(chalk.red(`Failed to delete application: ${error.message}`));
		}
	}
}
