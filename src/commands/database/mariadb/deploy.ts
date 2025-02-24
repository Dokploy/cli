import { Command, Flags } from "@oclif/core";
import { readAuthConfig } from "../../../utils/utils.js";
import chalk from "chalk";
import { getProject, getProjects } from "../../../utils/shared.js";
import inquirer from "inquirer";
import type { Answers } from "../../app/create.js";
import axios from "axios";

export default class DatabaseMariadbDeploy extends Command {
	static description = "Deploy an mariadb to a project.";

	static examples = ["$ <%= config.bin %> app deploy"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		mariadbId: Flags.string({
			char: "m",
			description: "ID of the MariaDB instance to deploy",
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
		const { flags } = await this.parse(DatabaseMariadbDeploy);
		let { projectId, mariadbId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !mariadbId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to deploy the MariaDB in:",
						name: "project",
						type: "list",
					},
				]);
				projectId = project.projectId;
			}

			const projectSelected = await getProject(projectId, auth, this);

			if (projectSelected.mariadb.length === 0) {
				this.error(chalk.yellow("No MariaDB instances found in this project."));
			}

			if (!mariadbId) {
				const dbAnswers = await inquirer.prompt([
					{
						// @ts-ignore
						choices: projectSelected.mariadb.map((db) => ({
							name: db.name,
							value: db.mariadbId,
						})),
						message: "Select the MariaDB instance to deploy:",
						name: "selectedDb",
						type: "list",
					},
				]);
				mariadbId = dbAnswers.selectedDb;
			}
		}

		// Confirmar si no se especifica --skipConfirm
		if (!flags.skipConfirm) {
			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to deploy this MariaDB instance?",
					name: "confirmDeploy",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDeploy) {
				this.error(chalk.yellow("MariaDB deployment cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/mariadb.deploy`,
				{
					json: {
						mariadbId,
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
				this.error(chalk.red("Error deploying MariaDB instance"));
			}
			this.log(chalk.green("MariaDB instance deployed successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error deploying MariaDB instance: ${error.message}`));
		}
	}
}
