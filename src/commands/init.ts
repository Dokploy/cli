import { Command } from "@oclif/core";
import chalk from "chalk";
import inquirer from "inquirer";

import { getProjects, type Application } from "../utils/shared.js";
import { readAuthConfig } from "../utils/utils.js";
import { writeLocalConfig, LOCAL_CONFIG_FILE } from "../utils/local-config.js";
import type { Answers } from "./app/create.js";

export default class Init extends Command {
	static description = `Create a ${LOCAL_CONFIG_FILE} file in the current directory to set default project, environment, and application for CLI commands.`;

	static examples = [
		"$ <%= config.bin %> init",
	];

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		console.log(chalk.blue.bold("\n  Listing all Projects \n"));
		const projects = await getProjects(auth, this);

		// 1. Select project
		const { project } = await inquirer.prompt<Answers>([
			{
				choices: projects.map((project) => ({
					name: project.name,
					value: project,
				})),
				message: "Select a project:",
				name: "project",
				type: "list",
			},
		]);

		const config: Record<string, string> = {};
		config.projectId = project.projectId!;

		// 2. Select environment
		if (project.environments && project.environments.length > 0) {
			const { environment } = await inquirer.prompt([
				{
					choices: project.environments.map((env) => ({
						name: `${env.name} (${env.description})`,
						value: env,
					})),
					message: "Select an environment:",
					name: "environment",
					type: "list",
				},
			]);

			config.environmentId = environment.environmentId;

			// 3. Optionally select application
			if (environment.applications && environment.applications.length > 0) {
				const { selectApp } = await inquirer.prompt([
					{
						type: "confirm",
						name: "selectApp",
						message: "Do you want to set a default application?",
						default: true,
					},
				]);

				if (selectApp) {
					const { selectedApp } = await inquirer.prompt([
						{
							choices: environment.applications.map((app: Application) => ({
								name: app.name,
								value: app.applicationId,
							})),
							message: "Select an application:",
							name: "selectedApp",
							type: "list",
						},
					]);

					config.applicationId = selectedApp;
				}
			}
		}

		const filePath = writeLocalConfig(config);
		this.log(chalk.green(`\nCreated ${filePath}`));
		this.log(chalk.gray("CLI commands will now use these defaults instead of prompting interactively."));
	}
}
