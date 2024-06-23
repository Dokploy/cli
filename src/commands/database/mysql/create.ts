import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { slugify } from "../../../utils/slug.js";
import { readAuthConfig } from "../../../utils/utils.js";
import { getProjects } from "../../../utils/shared.js";
import type { Answers } from "../../app/create.js";

export default class DatabaseMysqlCreate extends Command {
	static description = "Create a new MySQL database within a project.";

	static examples = ["$ <%= config.bin %> mysql create"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		const { flags } = await this.parse(DatabaseMysqlCreate);

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
					message: "Select a project to create the MySQL database in:",
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
					message: "Database Root Password (optional):",
					name: "databaseRootPassword",
					type: "password",
				},
				{
					message: "Database password (optional):",
					name: "databasePassword",
					type: "password",
				},
				{
					default: "mysql:8",
					message: "Docker Image (default: mysql:8):",
					name: "dockerImage",
					type: "input",
				},
				{
					default: "mysql",
					message: "Database User: (default: mysql):",
					name: "databaseUser",
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
					`${auth.url}/api/trpc/mysql.create`,
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
					this.error(chalk.red("Error creating MySQL database"));
				}

				this.log(
					chalk.green(
						`MySQL database '${dbDetails.name}' created successfully.`,
					),
				);
			} catch (error) {
				this.error(
					// @ts-ignore
					chalk.red(`Failed to create MySQL database: ${error.message}`),
				);
			}
		}
	}
}
