import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { readAuthConfig } from "../../utils/utils.js";

export default class AppCreate extends Command {
	static description = "Create a new application within a project.";

	static examples = ["$ <%= config.bin %> app create"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		const { flags } = await this.parse(AppCreate);

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
						message: "Select a project to create the database in:",
						name: "selectedProject",
						type: "list",
					},
				]);

				projectId = answers.selectedProject;
			} catch (error) {
				// @ts-expect-error  TODO: Fix this
				this.error(chalk.red(`Failed to fetch project list: ${error.message}`));
			}
		}

		const databases = ["postgres", "mysql", "redis", "mariadb", "mongo"];

		const databaseSelect = await inquirer.prompt([
			{
				choices: databases.map((database: any) => ({
					name: database,
					value: database,
				})),
				message: "Select a database to create the application in:",
				name: "selectedDatabase",
				type: "list",
			},
		]);

		const urlSelected = `${auth.url}/api/trpc/${databaseSelect.selectedDatabase}.create`;

		// Solicitar detalles de la nueva aplicación
		const appDetails = await inquirer.prompt([
			{
				message: "Enter the database name:",
				name: "appName",
				type: "input",
				validate: (input) => (input ? true : "Database name is required"),
			},
			{
				message: "Enter the database description (optional):",
				name: "appDescription",
				type: "input",
			},
		]);

		const { appDescription, appName } = appDetails;

		// Crear la aplicación en el proyecto seleccionado
		try {
			// const response = await axios.post(
			// 	`${auth.url}/api/trpc/application.create`,
			// 	{
			// 		json: {
			// 			description: appDescription,
			// 			name: appName,
			// 			projectId,
			// 		},
			// 	},
			// 	{
			// 		headers: {
			// 			Authorization: `Bearer ${auth.token}`,
			// 			"Content-Type": "application/json",
			// 		},
			// 	},
			// );
			// if (!response.data.result.data.json) {
			// 	this.error(chalk.red("Error creating application"));
			// }
			// this.log(
			// 	chalk.green(
			// 		`Application '${appName}' created successfully in project ID '${projectId}'.`,
			// 	),
			// );
		} catch (error) {
			// @ts-expect-error  TODO: Fix this
			this.error(chalk.red(`Failed to create application: ${error.message}`));
		}
	}
}