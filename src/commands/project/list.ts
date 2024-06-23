import { Command } from "@oclif/core";
import chalk from "chalk";
import Table from "cli-table3";

import { readAuthConfig } from "../../utils/utils.js";
import { getProjects } from "../../utils/shared.js";

export default class ProjectList extends Command {
	static description = "List all projects.";

	static examples = ["$ <%= config.bin %> project list"];

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		console.log(chalk.blue.bold("\n  Listing all Projects \n"));

		try {
			const projects = await getProjects(auth, this);

			if (projects.length === 0) {
				this.log(chalk.yellow("No projects found."));
			} else {
				this.log(chalk.green("Projects:"));
				const table = new Table({
					colWidths: [10, 30, 50],
					head: [
						chalk.cyan("Index"),
						chalk.cyan("Name"),
						chalk.cyan("Description"),
					],
				});
				const index = 1;
				for (const project of projects) {
					table.push([
						chalk.white(index + 1),
						chalk.white(project.name),
						chalk.gray(project.description || "No description"),
					]);
				}

				this.log(table.toString());
			}
		} catch (error) {
			// @ts-expect-error error is not defined
			this.error(chalk.red(`Failed to list projects: ${error?.message}`));
		}
	}
}
