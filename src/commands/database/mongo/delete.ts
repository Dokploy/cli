import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { readAuthConfig } from "../../../utils/utils.js";
import { getProject, getProjects, type Database } from "../../../utils/shared.js";

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
		environmentId: Flags.string({
			char: "e",
			description: "ID of the environment",
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
		let { projectId, environmentId, mongoId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !environmentId || !mongoId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			let selectedProject;
			let selectedEnvironment;

			// 1. Seleccionar proyecto
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
				selectedProject = projects.find(p => p.projectId === answers.selectedProject);
				projectId = answers.selectedProject;
			} else {
				selectedProject = projects.find(p => p.projectId === projectId);
			}

			// 2. Seleccionar environment del proyecto
			if (!environmentId) {
				if (!selectedProject?.environments || selectedProject.environments.length === 0) {
					this.error(chalk.yellow("No environments found in this project."));
				}

				const { environment } = await inquirer.prompt([
					{
						choices: selectedProject.environments.map((env) => ({
							name: `${env.name} (${env.description})`,
							value: env,
						})),
						message: "Select an environment:",
						name: "environment",
						type: "list",
					},
				]);
				selectedEnvironment = environment;
				environmentId = environment.environmentId;
			} else {
				selectedEnvironment = selectedProject?.environments?.find(e => e.environmentId === environmentId);
			}

			// 3. Seleccionar MongoDB del environment
			if (!mongoId) {
				if (!selectedEnvironment?.mongo || selectedEnvironment.mongo.length === 0) {
					this.error(chalk.yellow("No MongoDB instances found in this environment."));
				}

				const dbAnswers = await inquirer.prompt([
					{
						choices: selectedEnvironment.mongo.map((db: Database) => ({
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
						"x-api-key": auth.token,
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
