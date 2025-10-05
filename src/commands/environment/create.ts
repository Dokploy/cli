import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { getProjects } from "../../utils/shared.js";
import { readAuthConfig } from "../../utils/utils.js";
import type { Answers } from "../app/create.js";

export default class EnvironmentCreate extends Command {
	static description = "Create a new environment within a project.";

	static examples = ["$ <%= config.bin %> environment create"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		name: Flags.string({
			char: "n",
			description: "Environment name",
			required: false,
		}),
		description: Flags.string({
			char: "d",
			description: "Environment description",
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
		const { flags } = await this.parse(EnvironmentCreate);
		let { projectId, name, description } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !name) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			// 1. Seleccionar proyecto
			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to create the environment in:",
						name: "project",
						type: "list",
					},
				]);
				projectId = project.projectId;
			}

			// 2. Ingresar detalles del environment
			if (!name) {
				const envDetails = await inquirer.prompt([
					{
						message: "Enter the environment name:",
						name: "name",
						type: "input",
						validate: (input) => (input ? true : "Environment name is required"),
						default: name,
					},
					{
						message: "Enter the environment description (optional):",
						name: "description",
						type: "input",
						default: description,
					},
				]);

				name = envDetails.name;
				description = envDetails.description;
			}
		}

		// Confirmar si no se especifica --skipConfirm
		if (!flags.skipConfirm) {
			const confirm = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'proceed',
					message: 'Do you want to create this environment?',
					default: false,
				},
			]);

			if (!confirm.proceed) {
				this.error(chalk.yellow("Environment creation cancelled."));
				return;
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/environment.create`,
				{
					json: {
						name,
						description,
						projectId,
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
				this.error(chalk.red("Error creating environment"));
			}

			this.log(chalk.green(`Environment '${name}' created successfully.`));
		} catch (error: any) {
			this.error(chalk.red(`Error creating environment: ${error.message}`));
		}
	}
}
