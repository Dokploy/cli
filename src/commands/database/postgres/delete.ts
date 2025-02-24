import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { readAuthConfig } from "../../../utils/utils.js";
import { getProject, getProjects } from "../../../utils/shared.js";

export default class DatabasePostgresDelete extends Command {
	static description = "Delete a PostgreSQL database from a project.";

	static examples = [
		"$ <%= config.bin %> postgres delete",
		"$ <%= config.bin %> postgres delete -p <projectId>",
	];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		postgresId: Flags.string({
			char: "d",
			description: "ID of the PostgreSQL database",
			required: false,
		}),
		skipConfirm: Flags.boolean({
			char: "y",
			description: "Skip confirmation",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(DatabasePostgresDelete);
		let { projectId, postgresId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !postgresId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const answers = await inquirer.prompt([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project.projectId,
						})),
						message: "Select a project to delete the PostgreSQL instance from:",
						name: "selectedProject",
						type: "list",
					},
				]);
				projectId = answers.selectedProject;
			}

			const projectSelected = await getProject(projectId, auth, this);

			if (!projectSelected.postgres || projectSelected.postgres.length === 0) {
				this.error(chalk.yellow("No PostgreSQL instances found in this project."));
			}

			if (!postgresId) {
				const dbAnswers = await inquirer.prompt([
					{
						// @ts-ignore
						choices: projectSelected.postgres.map((db) => ({
							name: db.name,
							value: db.postgresId,
						})),
						message: "Select the PostgreSQL instance to delete:",
						name: "selectedDb",
						type: "list",
					},
				]);
				postgresId = dbAnswers.selectedDb;
			}
		}

		// Confirmar si no se especifica --skipConfirm
		if (!flags.skipConfirm) {
			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to delete this PostgreSQL instance?",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.error(chalk.yellow("PostgreSQL deletion cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/postgres.remove`,
				{
					json: {
						postgresId,
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
				this.error(chalk.red("Error deleting PostgreSQL instance"));
			}
			this.log(chalk.green("PostgreSQL instance deleted successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error deleting PostgreSQL instance: ${error.message}`));
		}
	}
}
