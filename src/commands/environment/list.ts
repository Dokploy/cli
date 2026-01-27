import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import Table from "cli-table3";
import inquirer from "inquirer";

import { getProject, getProjects } from "../../utils/shared.js";
import { readAuthConfig } from "../../utils/utils.js";
import type { Answers } from "../app/create.js";

export default class EnvironmentList extends Command {
	static description = "List all environments within a project.";

	static examples = [
		"$ <%= config.bin %> environment list",
		"$ <%= config.bin %> environment list -p <projectId>",
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
		const { flags } = await this.parse(EnvironmentList);
		let { projectId } = flags;

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
					message: "Select a project to list environments:",
					name: "project",
					type: "list",
				},
			]);
			projectId = project.projectId;
		}

		try {
			const project = await getProject(projectId, auth, this);

			console.log(chalk.blue.bold(`\n  Environments for project: ${project.name} \n`));

			if (!project.environments || project.environments.length === 0) {
				this.log(chalk.yellow("No environments found."));
				return;
			}

			const table = new Table({
				wordWrap: false,
				wrapOnWordBoundary: false,
				head: [
					chalk.cyan("Environment ID"),
					chalk.cyan("Name"),
					chalk.cyan("Description"),
					chalk.cyan("Apps"),
					chalk.cyan("Compose"),
				],
			});

			for (const env of project.environments) {
				table.push([
					chalk.white(env.environmentId),
					chalk.white(env.name),
					chalk.gray(env.description || "No description"),
					chalk.white(env.applications?.length || 0),
					chalk.white(env.compose?.length || 0),
				]);
			}

			this.log(table.toString());
		} catch (error: any) {
			this.error(chalk.red(`Failed to list environments: ${error?.message}`));
		}
	}
}
