import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { getProjects } from "../../utils/shared.js";
import { readAuthConfig } from "../../utils/utils.js";
import type { Answers } from "../app/create.js";

export default class EnvironmentDelete extends Command {
	static description = "Delete an environment from a project.";

	static examples = [
		"$ <%= config.bin %> environment delete",
		"$ <%= config.bin %> environment delete -p <projectId>",
	];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		environmentId: Flags.string({
			char: "e",
			description: "ID of the environment to delete",
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
		const { flags } = await this.parse(EnvironmentDelete);
		let { projectId, environmentId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !environmentId) {
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
						message: "Select a project to delete the environment from:",
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
						message: "Select an environment to delete:",
						name: "environment",
						type: "list",
					},
				]);
				environmentId = environment.environmentId;
			}
		}

		// Confirmar si no se especifica --skipConfirm
		if (!flags.skipConfirm) {
			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to delete this environment? This action cannot be undone.",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.error(chalk.yellow("Environment deletion cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/environment.remove`,
				{
					json: {
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

			if (!response.data.result.data.json) {
				this.error(chalk.red("Error deleting environment"));
			}

			this.log(chalk.green("Environment deleted successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error deleting environment: ${error.message}`));
		}
	}
}
