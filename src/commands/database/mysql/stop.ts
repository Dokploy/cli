import { Command } from "@oclif/core";
import chalk from "chalk";
import inquirer from "inquirer";
import axios from "axios";
import { getProject, getProjects } from "../../../utils/shared.js";
import { readAuthConfig } from "../../../utils/utils.js";
import type { Answers } from "../../app/create.js";

export default class DatabaseMysqlStop extends Command {
	static description = "Stop an mysql from a project.";

	static examples = ["$ <%= config.bin %> mysql stop"];

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(DatabaseMysqlStop);
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
						message: "Select a project to stop the MySQL instance from:",
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
						message: "Select the MySQL instance to stop:",
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
					message: "Are you sure you want to stop this MySQL instance?",
					name: "confirmStop",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmStop) {
				this.error(chalk.yellow("MySQL stop cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/mysql.stop`,
				{
					json: {
						mysqlId,
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
				this.error(chalk.red("Error stopping MySQL instance"));
			}
			this.log(chalk.green("MySQL instance stopped successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error stopping MySQL instance: ${error.message}`));
		}
	}
}
