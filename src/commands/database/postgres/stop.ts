import { Command, Flags } from "@oclif/core";
import { readAuthConfig } from "../../../utils/utils.js";
import chalk from "chalk";
import { getProject, getProjects } from "../../../utils/shared.js";
import inquirer from "inquirer";
import type { Answers } from "../../app/create.js";
import axios from "axios";

export default class DatabasePostgresStop extends Command {
	static description = "Stop a PostgreSQL instance in a project.";

	static examples = ["$ <%= config.bin %> postgres stop"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		postgresId: Flags.string({
			char: "d",
			description: "ID of the PostgreSQL instance to stop",
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
		const { flags } = await this.parse(DatabasePostgresStop);
		let { projectId, postgresId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !postgresId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to stop the PostgreSQL instance from:",
						name: "project",
						type: "list",
					},
				]);
				projectId = project.projectId;
			}

			const projectSelected = await getProject(projectId, auth, this);

			if (projectSelected.postgres.length === 0) {
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
						message: "Select the PostgreSQL instance to stop:",
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
					message: "Are you sure you want to stop this PostgreSQL instance?",
					name: "confirmStop",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmStop) {
				this.error(chalk.yellow("PostgreSQL stop cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/postgres.stop`,
				{
					json: {
						postgresId,
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
				this.error(chalk.red("Error stopping PostgreSQL instance"));
			}
			this.log(chalk.green("PostgreSQL instance stopped successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error stopping PostgreSQL instance: ${error.message}`));
		}
	}
}
