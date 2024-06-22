import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { readAuthConfig } from "../../../utils/utils.js";
import { getProject, getProjects } from "../../../utils/shared.js";

export default class DatabaseMongoDelete extends Command {
	static description = "Delete a MongoDB database from a project.";

	static examples = [
		"$ <%= config.bin %> mongo delete",
		"$ <%= config.bin %> mongo delete -p <projectId>",
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

		const { flags } = await this.parse(DatabaseMongoDelete);
		let { projectId } = flags;

		if (!projectId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));

			const projects = await getProjects(auth, this);

			if (projects.length === 0) {
				this.log(chalk.yellow("No projects found."));
				return;
			}

			const answers = await inquirer.prompt([
				{
					choices: projects.map((project: any) => ({
						name: project.name,
						value: project.projectId,
					})),
					message: "Select a project to delete the MongoDB database from:",
					name: "selectedProject",
					type: "list",
				},
			]);

			projectId = answers.selectedProject;
		}

		try {
			const project = await getProject(projectId, auth, this);

			if (!project.mongo || project.mongo.length === 0) {
				this.log(chalk.yellow("No MongoDB databases found in this project."));
				return;
			}

			const appAnswers = await inquirer.prompt([
				{
					choices: project.mongo.map((db: any) => ({
						name: db.name,
						value: db.mongoId,
					})),
					message: "Select the MongoDB database to delete:",
					name: "selectedApp",
					type: "list",
				},
			]);

			const mongoId = appAnswers.selectedApp;

			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to delete this MongoDB database?",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.log(chalk.yellow("Database deletion cancelled."));
				return;
			}

			const deleteResponse = await axios.post(
				`${auth.url}/api/trpc/mongo.remove`,
				{
					json: {
						mongoId,
					},
				},
				{
					headers: {
						Authorization: `Bearer ${auth.token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (!deleteResponse.data.result.data.json) {
				this.error(chalk.red("Error deleting MongoDB database"));
			}

			this.log(chalk.green("MongoDB database deleted successfully."));
		} catch (error) {
			this.error(
				// @ts-ignore
				chalk.red(`Failed to delete MongoDB database: ${error.message}`),
			);
		}
	}
}
