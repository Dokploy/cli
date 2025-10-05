import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { type Project, getProjects } from "../../utils/shared.js";
import { slugify } from "../../utils/slug.js";
import { readAuthConfig } from "../../utils/utils.js";

export interface Answers {
	project: Project;
}

export default class AppCreate extends Command {
	static description = "Create a new application within a project.";

	static examples = ["$ <%= config.bin %> app create"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		environmentId: Flags.string({
			char: "e",
			description: "ID of the environment",
			required: false,
		}),
		name: Flags.string({
			char: "n",
			description: "Application name",
			required: false,
		}),
		description: Flags.string({
			char: "d",
			description: "Application description",
			required: false,
		}),
		appName: Flags.string({
			description: "Docker app name",
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
		const { flags } = await this.parse(AppCreate);
		let { projectId, environmentId, name, description, appName } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !environmentId || !name || !appName) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			let selectedProject;

			// 1. Seleccionar proyecto
			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to create the application in:",
						name: "project",
						type: "list",
					},
				]);
				selectedProject = project;
				projectId = project.projectId;
			} else {
				selectedProject = projects.find(p => p.projectId === projectId);
			}

			// 2. Seleccionar environment del proyecto
			if (!environmentId) {
				if (!selectedProject?.environments || selectedProject.environments.length === 0) {
					this.error(chalk.yellow("No environments found in this project."));
				}

				const { environment } = await inquirer.prompt([
					{
						choices: selectedProject.environments.map((env) => ({
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

			if (!name || !appName) {
				const appDetails = await inquirer.prompt([
					{
						message: "Enter the application name:",
						name: "name",
						type: "input",
						validate: (input) => (input ? true : "Application name is required"),
						default: name,
					},
					{
						message: "Enter the application description (optional):",
						name: "appDescription",
						type: "input",
						default: description,
					},
				]);

				name = appDetails.name;
				description = appDetails.appDescription;

				const appNamePrompt = await inquirer.prompt([
					{
						default: appName || `${slugify(name)}`,
						message: "Enter the App name:",
						name: "appName",
						type: "input",
						validate: (input) => (input ? true : "App name is required"),
					},
				]);

				appName = appNamePrompt.appName;
			}
		}

		// Confirmar si no se especifica --skipConfirm
		if (!flags.skipConfirm) {
			const confirm = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'proceed',
					message: 'Do you want to create this application?',
					default: false,
				},
			]);

			if (!confirm.proceed) {
				this.error(chalk.yellow("Application creation cancelled."));
				return;
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/application.create`,
				{
					json: {
						name,
						appDescription: description,
						appName,
						projectId,
						environmentId,
					},
				},
				{
					headers: {
						"x-api-key": auth.token,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.status !== 200) {
				this.error(chalk.red("Error creating application"));
			}

			this.log(chalk.green(`Application '${name}' created successfully.`));
		} catch (error: any) {
			this.error(chalk.red(`Error creating application: ${error.message}`));
		}
	}
}
