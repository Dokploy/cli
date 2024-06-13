import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { readAuthConfig } from "../../../utils/utils.js";

export default class DatabaseMariadbDelete extends Command {
	static description = "Delete an application from a project.";

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
			// Obtener la lista de proyectos y permitir la selección
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));

			try {
				const response = await axios.get(`${auth.url}/api/trpc/project.all`, {
					headers: {
						Authorization: `Bearer ${auth.token}`,
						"Content-Type": "application/json",
					},
				});

				if (!response.data.result.data.json) {
					this.error(chalk.red("Error fetching projects"));
				}

				const projects = response.data.result.data.json;

				if (projects.length === 0) {
					this.log(chalk.yellow("No projects found."));
					return;
				}

				// Permitir al usuario seleccionar un proyecto
				const answers = await inquirer.prompt([
					{
						choices: projects.map((project: any) => ({
							name: project.name,
							value: project.projectId,
						})),
						message: "Select a project to delete the mariadb database from:",
						name: "selectedProject",
						type: "list",
					},
				]);

				projectId = answers.selectedProject;
			} catch (error) {
				// @ts-expect-error - TS2339: Property 'data' does not exist on type 'AxiosError<any>'.
				this.error(chalk.red(`Failed to fetch project list: ${error.message}`));
			}
		}

		try {
			const response = await axios.get(`${auth.url}/api/trpc/project.one`, {
				headers: {
					Authorization: `Bearer ${auth.token}`,
					"Content-Type": "application/json",
				},
				params: {
					input: JSON.stringify({
						json: { projectId },
					}),
				},
			});

			if (!response.data.result.data.json) {
				this.error(chalk.red("Error fetching applications"));
			}

			const apps = response.data.result.data.json;

			if (apps.mariadb.length === 0) {
				this.log(chalk.yellow("No applications found in this project."));
				return;
			}

			// Permitir al usuario seleccionar una aplicación
			const appAnswers = await inquirer.prompt([
				{
					choices: apps.mariadb.map((app: any) => ({
						name: app.name,
						value: app.mariadbId,
					})),
					message: "Select the mariadb database to delete:",
					name: "selectedApp",
					type: "list",
				},
			]);

			const mariadbId = appAnswers.selectedApp;

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
				this.error(chalk.red("Error deleting application"));
			}

			this.log(chalk.green("Application deleted successfully."));
		} catch (error) {
			// @ts-expect-error - TS2339: Property 'data' does not exist on type 'AxiosError<any>'.
			this.error(chalk.red(`Failed to delete application: ${error.message}`));
		}
	}
}
