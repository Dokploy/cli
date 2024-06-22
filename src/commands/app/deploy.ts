import { Command } from "@oclif/core";
import { readAuthConfig } from "../../utils/utils.js";
import chalk from "chalk";
import { getProject, getProjects } from "../../utils/shared.js";
import inquirer from "inquirer";
import type { Answers } from "./create.js";
import axios from "axios";

export default class AppDeploy extends Command {
	static description = "Deploy an application to a project.";

	static examples = ["$ <%= config.bin %> app deploy"];

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
				message: "Select a project to deploy the application in:",
				name: "project",
				type: "list",
			},
		]);

		const projectId = project.projectId;

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
				message: "Select the application to deploy:",
				name: "selectedApp",
				type: "list",
			},
		]);

		const applicationId = appAnswers.selectedApp;

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

		const response = await axios.post(
			`${auth.url}/api/trpc/application.deploy`,
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
			this.error(chalk.red("Error deploying application"));
		}
		this.log(chalk.green("Application deploy successful."));
	}
}
