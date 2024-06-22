import { Command } from "@oclif/core";
import chalk from "chalk";
import inquirer from "inquirer";
import axios from "axios";
import { getProject, getProjects } from "../../../utils/shared.js";
import { readAuthConfig } from "../../../utils/utils.js";
import type { Answers } from "../../app/create.js";

export default class DatabaseMariadbStop extends Command {
	static description = "Stop an mariadb from a project.";

	static examples = ["$ <%= config.bin %> mariadb stop"];

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		console.log(chalk.blue.bold("\n  Listing all Projects \n"));

		const projects = await getProjects(auth, this);

		const { project } = await inquirer.prompt<Answers>([
			{
				choices: projects.map((project) => ({
					name: project.name,
					value: project,
				})),
				message: "Select a project to stop the mariadb in:",
				name: "project",
				type: "list",
			},
		]);

		const projectId = project.projectId;

		const projectSelected = await getProject(projectId, auth, this);

		if (projectSelected.mariadb.length === 0) {
			this.error(chalk.yellow("No mariadb found in this project."));
		}

		const appAnswers = await inquirer.prompt([
			{
				// @ts-ignore
				choices: projectSelected.mariadb.map((app) => ({
					name: app.name,
					value: app.mariadbId,
				})),
				message: "Select the mariadb to stop:",
				name: "selectedApp",
				type: "list",
			},
		]);

		const mariadbId = appAnswers.selectedApp;

		const confirmAnswers = await inquirer.prompt([
			{
				default: false,
				message: "Are you sure you want to stop this mariadb?",
				name: "confirmDelete",
				type: "confirm",
			},
		]);

		if (!confirmAnswers.confirmDelete) {
			this.error(chalk.yellow("Mariadb stop cancelled."));
		}

		const response = await axios.post(
			`${auth.url}/api/trpc/mariadb.stop`,
			{
				json: {
					mariadbId,
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
			this.error(chalk.red("Error stopping mariadb"));
		}
		this.log(chalk.green("Mariadb stop successful."));
	}
}
