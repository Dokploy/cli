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
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		const { flags } = await this.parse(AppCreate);

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

			const appDetails = await inquirer.prompt([
				{
					message: "Enter the application name:",
					name: "name",
					type: "input",
					validate: (input) => (input ? true : "Application name is required"),
				},
				{
					message: "Enter the application description (optional):",
					name: "appDescription",
					type: "input",
				},
			]);

			const appName = await inquirer.prompt([
				{
					default: `${slugify(project.name)}-${appDetails.name}`,
					message: "Enter the App name: (optional):",
					name: "appName",
					type: "input",
					validate: (input) => (input ? true : "App name is required"),
				},
			]);

			const response = await axios.post(
				`${auth.url}/api/trpc/application.create`,
				{
					json: {
						...appDetails,
						appName: appName.appName,
						projectId: project.projectId,
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
				this.error(chalk.red("Error creating application"));
			}

			this.log(
				chalk.green(`Application '${appDetails.name}' created successfully.`),
			);
		}
	}
}
