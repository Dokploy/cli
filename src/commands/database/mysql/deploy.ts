import { Command } from "@oclif/core";
import { readAuthConfig } from "../../../utils/utils.js";
import chalk from "chalk";
import { getProject, getProjects } from "../../../utils/shared.js";
import inquirer from "inquirer";
import type { Answers } from "../../app/create.js";
import axios from "axios";

export default class DatabaseMysqlDeploy extends Command {
	static description = "Deploy an mysql to a project.";

	static examples = ["$ <%= config.bin %> app deploy"];

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(DatabaseMysqlDeploy);
		let { projectId, mysqlId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !mysqlId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to deploy the MySQL instance from:",
						name: "project",
						type: "list",
					},
				]);
				projectId = project.projectId;
			}

			const projectSelected = await getProject(projectId, auth, this);

			if (projectSelected.mysql.length === 0) {
				this.error(chalk.yellow("No MySQL instances found in this project."));
			}

			if (!mysqlId) {
				const dbAnswers = await inquirer.prompt([
					{
						// @ts-ignore
						choices: projectSelected.mysql.map((db) => ({
							name: db.name,
							value: db.mysqlId,
						})),
						message: "Select the MySQL instance to deploy:",
						name: "selectedDb",
						type: "list",
					},
				]);
				mysqlId = dbAnswers.selectedDb;
			}
		}

		// Confirmar si no se especifica --skipConfirm
		if (!flags.skipConfirm) {
			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to deploy this MySQL instance?",
					name: "confirmDeploy",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDeploy) {
				this.error(chalk.yellow("MySQL deployment cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/mysql.deploy`,
				{
					json: {
						mysqlId,
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
				this.error(chalk.red("Error deploying MySQL instance"));
			}
			this.log(chalk.green("MySQL instance deployed successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error deploying MySQL instance: ${error.message}`));
		}
	}
}
