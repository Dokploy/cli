import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { slugify } from "../../../utils/slug.js";
import { readAuthConfig } from "../../../utils/utils.js";

export default class DatabaseMongoCreate extends Command {
	static description = "Create a new database within a project.";

	static examples = ["$ <%= config.bin %> mongo create"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(DatabaseMongoCreate);

		const { projectId } = flags;
		if (!projectId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));

			try {
				const response = await axios.get(`${auth.url}/api/trpc/project.all`, {
					headers: {
						Authorization: `Bearer ${auth.token}`,
						"Content-Type": "application/json",
					},
				});

				if (!response.data.result.data.json) {
					this.error(chalk.red("Error fetching projects"));
				}

				const projects = response.data.result.data.json;

				if (projects.length === 0) {
					this.log(chalk.yellow("No projects found."));
					return;
				}

				const { project } = await inquirer.prompt([
					{
						choices: projects.map((project: any) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to create the database in:",
						name: "project",
						type: "list",
					},
				]);

				const appDetails = await inquirer.prompt([
					{
						message: "Enter the name:",
						name: "name",
						type: "input",
						validate: (input) => (input ? true : "Database name is required"),
					},
					{
						message: "Database name:",
						name: "databaseName",
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
						type: "input",
					},
					{
						default: "mongo:6",
						message: "Docker Image (default: mongo:6):",
						name: "dockerImage",
						type: "input",
					},
					{
						default: "mongo",
						message: "Database User: (default: mongo):",
						name: "databaseUser",
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

				const responseDatabase = await axios.post(
					`${auth.url}/api/trpc/mongo.create`,
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

				if (!responseDatabase.data.result.data.json) {
					this.error(chalk.red("Error creating database"));
				}

				this.log(
					chalk.green(`Database '${appDetails.name}' created successfully.`),
				);
			} catch (error) {
				// @ts-expect-error  TODO: Fix this
				this.error(chalk.red(`Failed to fetch project list: ${error.message}`));
			}
		}
	}
}
