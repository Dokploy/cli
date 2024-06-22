import { Command } from "@oclif/core";
import chalk from "chalk";
import inquirer from "inquirer";
import axios from "axios";
import { getProject, getProjects } from "../../../utils/shared.js";
import { readAuthConfig } from "../../../utils/utils.js";
import type { Answers } from "../../app/create.js";

export default class DatabaseMysqlStop extends Command {
	static description = "Stop an mysql from a project.";

	static examples = ["$ <%= config.bin %> mysql stop"];

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
				message: "Select a project to stop the mysql in:",
				name: "project",
				type: "list",
			},
		]);

		const projectId = project.projectId;

		const projectSelected = await getProject(projectId, auth, this);

		if (projectSelected.mysql.length === 0) {
			this.error(chalk.yellow("No mysql found in this project."));
		}

		const appAnswers = await inquirer.prompt([
			{
				// @ts-ignore
				choices: projectSelected.mysql.map((app) => ({
					name: app.name,
					value: app.mysqlId,
				})),
				message: "Select the mysql to stop:",
				name: "selectedApp",
				type: "list",
			},
		]);

		const mysqlId = appAnswers.selectedApp;

		const confirmAnswers = await inquirer.prompt([
			{
				default: false,
				message: "Are you sure you want to stop this mysql?",
				name: "confirmDelete",
				type: "confirm",
			},
		]);

		if (!confirmAnswers.confirmDelete) {
			this.error(chalk.yellow("mysql stop cancelled."));
		}

		const response = await axios.post(
			`${auth.url}/api/trpc/mysql.stop`,
			{
				json: {
					mysqlId,
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
			this.error(chalk.red("Error stopping mysql"));
		}
		this.log(chalk.green("Mysql stop successful."));
	}
}
