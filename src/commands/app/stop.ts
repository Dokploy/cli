import { Command, Flags } from "@oclif/core";
import { readAuthConfig } from "../../utils/utils.js";
import chalk from "chalk";
import inquirer from "inquirer";
import { getProject, getProjects } from "../../utils/shared.js";
import type { Answers } from "./create.js";
import axios from "axios";

export default class AppStop extends Command {
	static description = "Stop an application from a project.";

	static examples = ["$ <%= config.bin %> app stop"];

	static flags = {
		projectId: Flags.string({
			char: 'p',
			description: 'ID of the project',
			required: false,
		}),
		applicationId: Flags.string({
			char: 'a',
			description: 'ID of the application to stop',
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
		const { flags } = await this.parse(AppStop);
		let { projectId, applicationId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !applicationId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to stop the application from:",
						name: "project",
						type: "list",
					},
				]);
				projectId = project.projectId;
			}

			const projectSelected = await getProject(projectId, auth, this);

			if (projectSelected.applications.length === 0) {
				this.error(chalk.yellow("No applications found in this project."));
			}

			if (!applicationId) {
				const appAnswers = await inquirer.prompt([
					{
						choices: projectSelected.applications.map((app: { name: string; applicationId: string }) => ({
							name: app.name,
							value: app.applicationId,
						})),
						message: "Select the application to stop:",
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
					message: "Are you sure you want to stop this application?",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.error(chalk.yellow("Application stop cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/application.stop`,
				{
					json: {
						applicationId,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${auth.token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.status !== 200) {
				this.error(chalk.red("Error stopping application"));
			}
			this.log(chalk.green("Application stop successful."));
		} catch (error: any) {
			this.error(chalk.red(`Error stopping application: ${error.message}`));
		}
	}
}
