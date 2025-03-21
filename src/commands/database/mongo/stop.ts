import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import inquirer from "inquirer";
import axios from "axios";
import { getProject, getProjects } from "../../../utils/shared.js";
import { readAuthConfig } from "../../../utils/utils.js";
import type { Answers } from "../../app/create.js";

export default class DatabaseMongoStop extends Command {
	static description = "Stop an mongo from a project.";

	static examples = ["$ <%= config.bin %> mongo stop"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		mongoId: Flags.string({
			char: "m",
			description: "ID of the MongoDB instance to stop",
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
		const { flags } = await this.parse(DatabaseMongoStop);
		let { projectId, mongoId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !mongoId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to stop the MongoDB instance from:",
						name: "project",
						type: "list",
					},
				]);
				projectId = project.projectId;
			}

			const projectSelected = await getProject(projectId, auth, this);

			if (projectSelected.mongo.length === 0) {
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
						message: "Select the MongoDB instance to stop:",
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
					message: "Are you sure you want to stop this MongoDB instance?",
					name: "confirmStop",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmStop) {
				this.error(chalk.yellow("MongoDB stop cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/mongo.stop`,
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

			if (response.status !== 200) {
				this.error(chalk.red("Error stopping MongoDB instance"));
			}
			this.log(chalk.green("MongoDB instance stopped successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error stopping MongoDB instance: ${error.message}`));
		}
	}
}
