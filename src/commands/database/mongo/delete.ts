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
		mongoId: Flags.string({
			char: "m",
			description: "ID of the MongoDB instance to delete",
			required: false,
		}),
		skipConfirm: Flags.boolean({
			char: "y",
			description: "Skip confirmation prompt",
			default: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(DatabaseMongoDelete);
		let { projectId, mongoId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !mongoId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const answers = await inquirer.prompt([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project.projectId,
						})),
						message: "Select a project to delete the MongoDB instance from:",
						name: "selectedProject",
						type: "list",
					},
				]);
				projectId = answers.selectedProject;
			}

			const projectSelected = await getProject(projectId, auth, this);

			if (!projectSelected.mongo || projectSelected.mongo.length === 0) {
				this.error(chalk.yellow("No MongoDB instances found in this project."));
			}

			if (!mongoId) {
				const dbAnswers = await inquirer.prompt([
					{
						// @ts-ignore
						choices: projectSelected.mongo.map((db) => ({
							name: db.name,
							value: db.mongoId,
						})),
						message: "Select the MongoDB instance to delete:",
						name: "selectedDb",
						type: "list",
					},
				]);
				mongoId = dbAnswers.selectedDb;
			}
		}

		// Confirmar si no se especifica --skipConfirm
		if (!flags.skipConfirm) {
			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to delete this MongoDB instance?",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.error(chalk.yellow("MongoDB deletion cancelled."));
			}
		}

		try {
			const response = await axios.post(
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

			if (!response.data.result.data.json) {
				this.error(chalk.red("Error deleting MongoDB instance"));
			}
			this.log(chalk.green("MongoDB instance deleted successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error deleting MongoDB instance: ${error.message}`));
		}
	}
}
