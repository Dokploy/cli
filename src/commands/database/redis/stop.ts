import { Command } from "@oclif/core";
import chalk from "chalk";
import inquirer from "inquirer";
import axios from "axios";
import { getProject, getProjects } from "../../../utils/shared.js";
import { readAuthConfig } from "../../../utils/utils.js";
import type { Answers } from "../../app/create.js";

export default class DatabaseRedisStop extends Command {
	static description = "Stop an redis from a project.";

	static examples = ["$ <%= config.bin %> redis stop"];

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
				message: "Select a project to stop the redis in:",
				name: "project",
				type: "list",
			},
		]);

		const projectId = project.projectId;

		const projectSelected = await getProject(projectId, auth, this);

		if (projectSelected.redis.length === 0) {
			this.error(chalk.yellow("No redis found in this project."));
		}

		const appAnswers = await inquirer.prompt([
			{
				// @ts-ignore
				choices: projectSelected.redis.map((app) => ({
					name: app.name,
					value: app.redisId,
				})),
				message: "Select the redis to stop:",
				name: "selectedApp",
				type: "list",
			},
		]);

		const redisId = appAnswers.selectedApp;

		const confirmAnswers = await inquirer.prompt([
			{
				default: false,
				message: "Are you sure you want to stop this redis?",
				name: "confirmDelete",
				type: "confirm",
			},
		]);

		if (!confirmAnswers.confirmDelete) {
			this.error(chalk.yellow("redis stop cancelled."));
		}

		const response = await axios.post(
			`${auth.url}/api/trpc/redis.stop`,
			{
				json: {
					redisId,
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
			this.error(chalk.red("Error stopping redis"));
		}
		this.log(chalk.green("Redis stop successful."));
	}
}
