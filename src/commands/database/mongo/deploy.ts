import { Command, Flags } from "@oclif/core";
import { readAuthConfig } from "../../../utils/utils.js";
import chalk from "chalk";
import { getProject, getProjects } from "../../../utils/shared.js";
import inquirer from "inquirer";
import type { Answers } from "../../app/create.js";
import axios from "axios";

export default class DatabaseMongoDeploy extends Command {
	static description = "Deploy an mongo to a project.";

	static examples = ["$ <%= config.bin %> app deploy"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		mongoId: Flags.string({
			char: "m",
			description: "ID of the MongoDB instance to deploy",
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
		const { flags } = await this.parse(DatabaseMongoDeploy);
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
						message: "Select a project to deploy the MongoDB instance from:",
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
						message: "Select the MongoDB instance to deploy:",
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
					message: "Are you sure you want to deploy this MongoDB instance?",
					name: "confirmDeploy",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDeploy) {
				this.error(chalk.yellow("MongoDB deployment cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/mongo.deploy`,
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

			if (response.status !== 200) {
				this.error(chalk.red("Error deploying MongoDB instance"));
			}
			this.log(chalk.green("MongoDB instance deployed successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error deploying MongoDB instance: ${error.message}`));
		}
	}
}
