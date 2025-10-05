import { Command, Flags } from "@oclif/core";
import { readAuthConfig } from "../../utils/utils.js";
import chalk from "chalk";
import { getProject, getProjects, type Application } from "../../utils/shared.js";
import inquirer from "inquirer";
import type { Answers } from "./create.js";
import axios from "axios";

export default class AppDeploy extends Command {
	static description = "Deploy an application to a project.";

	static examples = [
		"$ <%= config.bin %> app deploy",
		"$ <%= config.bin %> app deploy --applicationId myAppId",
		"$ DOKPLOY_URL=xxx DOKPLOY_AUTH_TOKEN=xxx <%= config.bin %> app deploy --applicationId myAppId"
	];

	static flags = {
		applicationId: Flags.string({
			char: 'a',
			description: 'ID of the application to deploy',
			required: false,
		}),
		projectId: Flags.string({
			char: 'p', 
			description: 'ID of the project',
			required: false,
		}),
		environmentId: Flags.string({
			char: 'e',
			description: 'ID of the environment',
			required: false,
		}),
		skipConfirm: Flags.boolean({
			char: 'y',
			description: 'Skip confirmation prompt',
			default: false,
		})
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(AppDeploy);
		let { projectId, applicationId, environmentId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !applicationId || !environmentId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			let selectedProject;
			let selectedEnvironment;

			// 1. Seleccionar proyecto
			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to deploy the application from:",
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
				selectedEnvironment = environment;
				environmentId = environment.environmentId;
			} else {
				selectedEnvironment = selectedProject?.environments?.find(e => e.environmentId === environmentId);
			}

			// 3. Seleccionar application del environment
			if (!applicationId) {
				if (!selectedEnvironment?.applications || selectedEnvironment.applications.length === 0) {
					this.error(chalk.yellow("No applications found in this environment."));
				}

				const appAnswers = await inquirer.prompt([
					{
						choices: selectedEnvironment.applications.map((app: Application) => ({
							name: app.name,
							value: app.applicationId,
						})),
						message: "Select the application to deploy:",
						name: "selectedApp",
						type: "list",
					},
				]);
				applicationId = appAnswers.selectedApp;
			}
		}

		// Confirmar si no se especifica --skipConfirm
		if (!flags.skipConfirm) {
			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to deploy this application?",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.error(chalk.yellow("Application deployment cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/application.deploy`,
				{
					json: {
						applicationId,
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
				this.error(chalk.red("Error deploying application"));
			}
			this.log(chalk.green("Application deploy successful."));
		} catch (error: any) {
			this.error(chalk.red(`Error deploying application: ${error.message}`));
		}
	}
}
