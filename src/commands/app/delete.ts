import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { getProject, getProjects } from "../../utils/shared.js";
import { readAuthConfig } from "../../utils/utils.js";
import type { Answers } from "./create.js";

export default class AppDelete extends Command {
	static description = "Delete an application from a project.";

	static examples = [
		"$ <%= config.bin %> app delete",
		"$ <%= config.bin %> app delete -p <projectId>",
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

		const { flags } = await this.parse(AppDelete);

		let { projectId } = flags;

		if (!projectId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));

			const projects = await getProjects(auth, this);

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

			projectId = project.projectId;
			const projectSelected = await getProject(projectId, auth, this);

			if (projectSelected.applications.length === 0) {
				this.error(chalk.yellow("No applications found in this project."));
			}

			const appAnswers = await inquirer.prompt([
				{
					// @ts-ignore
					choices: projectSelected.applications.map((app) => ({
						name: app.name,
						value: app.applicationId,
					})),
					message: "Select the application to delete:",
					name: "selectedApp",
					type: "list",
				},
			]);

			const applicationId = appAnswers.selectedApp;

			// // Confirmar eliminación
			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to delete this application?",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.error(chalk.yellow("Application deletion cancelled."));
			}

			const deleteResponse = await axios.post(
				`${auth.url}/api/trpc/application.delete`,
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

			if (!deleteResponse.data.result.data.json) {
				this.error(chalk.red("Error deleting application"));
			}

			this.log(chalk.green("Application deleted successfully."));
		}
	}
}
