import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";
import { slugify } from "../../../utils/slug.js";
import { readAuthConfig } from "../../../utils/utils.js";
import { getProjects } from "../../../utils/shared.js";
import type { Answers } from "../../app/create.js";

export default class DatabaseRedisCreate extends Command {
	static description = "Create a new Redis database within a project.";

	static examples = ["$ <%= config.bin %> redis create"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		const { flags } = await this.parse(DatabaseRedisCreate);

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
					message: "Select a project to create the Redis database in:",
					name: "project",
					type: "list",
				},
			]);

			projectId = project.projectId;

			const dbDetails = await inquirer.prompt([
				{
					message: "Enter the name:",
					name: "name",
					type: "input",
					validate: (input) => (input ? true : "Database name is required"),
				},
				{
					message: "Enter the database description (optional):",
					name: "description",
					type: "input",
				},
				{
					message: "Database password (optional):",
					name: "databasePassword",
					type: "password",
				},
				{
					default: "redis:7",
					message: "Docker Image (default: redis:7):",
					name: "dockerImage",
					type: "input",
				},
			]);

			const appName = await inquirer.prompt([
				{
					default: `${slugify(project.name)}-${dbDetails.name}`,
					message: "Enter the App name:",
					name: "appName",
					type: "input",
					validate: (input) => (input ? true : "App name is required"),
				},
			]);

			try {
				const response = await axios.post(
					`${auth.url}/api/trpc/redis.create`,
					{
						json: {
							...dbDetails,
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

				if (!response.data.result.data.json) {
					this.error(chalk.red("Error creating Redis database"));
				}

				this.log(
					chalk.green(
						`Redis database '${dbDetails.name}' created successfully.`,
					),
				);
			} catch (error) {
				this.error(
					// @ts-ignore
					chalk.red(`Failed to create Redis database: ${error.message}`),
				);
			}
		}
	}
}
