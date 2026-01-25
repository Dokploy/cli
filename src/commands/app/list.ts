import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import Table from "cli-table3";
import inquirer from "inquirer";

import { getProject, getProjects } from "../../utils/shared.js";
import { readAuthConfig } from "../../utils/utils.js";
import type { Answers } from "./create.js";

export default class AppList extends Command {
	static description = "List all applications and compose services within an environment.";

	static examples = [
		"$ <%= config.bin %> app list",
		"$ <%= config.bin %> app list -p <projectId>",
		"$ <%= config.bin %> app list -p <projectId> -e <environmentId>",
	];

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
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(AppList);
		let { projectId, environmentId } = flags;

		// Interactive mode if projectId not provided
		if (!projectId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

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
			projectId = project.projectId;
		}

		try {
			const project = await getProject(projectId, auth, this);

			let environment;

			// Interactive mode if environmentId not provided
			if (!environmentId) {
				if (!project.environments || project.environments.length === 0) {
					this.log(chalk.yellow("No environments found in this project."));
					return;
				}

				const result = await inquirer.prompt<any>([
					{
						choices: project.environments.map((env: any) => ({
							name: env.name,
							value: env,
						})),
						message: "Select an environment:",
						name: "environment",
						type: "list",
					},
				]);
				environment = result.environment;
			} else {
				environment = project.environments?.find(
					(env: any) => env.environmentId === environmentId
				);
				if (!environment) {
					this.error(chalk.red(`Environment with ID '${environmentId}' not found.`));
				}
			}

			console.log(chalk.blue.bold(`\n  Services in environment: ${environment.name} \n`));

			const apps = environment.applications || [];
			const composeServices = environment.compose || [];

			if (apps.length === 0 && composeServices.length === 0) {
				this.log(chalk.yellow("No services found in this environment."));
				return;
			}

			const table = new Table({
				wordWrap: false,
				wrapOnWordBoundary: false,
				head: [
					chalk.cyan("ID"),
					chalk.cyan("Name"),
					chalk.cyan("Type"),
					chalk.cyan("Status"),
				],
			});

			for (const app of apps) {
				table.push([
					chalk.white(app.applicationId),
					chalk.white(app.name),
					chalk.blue("Application"),
					chalk.white(app.applicationStatus || "N/A"),
				]);
			}

			for (const compose of composeServices) {
				table.push([
					chalk.white(compose.composeId),
					chalk.white(compose.name),
					chalk.magenta("Compose"),
					chalk.white(compose.composeStatus || "N/A"),
				]);
			}

			this.log(table.toString());
		} catch (error: any) {
			this.error(chalk.red(`Failed to list services: ${error?.message}`));
		}
	}
}
