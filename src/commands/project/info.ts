import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { readAuthConfig } from "../../utils/utils.js";

export default class ProjectInfo extends Command {
	static description =
		"Get detailed information about a project, including the number of applications and databases.";

	static examples = [
		"$ <%= config.bin %> project info",
		"$ <%= config.bin %> project info -p <projectId>",
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

		const { flags } = await this.parse(ProjectInfo);

		if (flags.projectId) {
			// Si se proporciona un projectId, mostrar directamente la información del proyecto
			await this.showProjectInfo(auth, flags.projectId);
		} else {
			// Obtener la lista de proyectos y permitir la selección
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));

			try {
				const response = await axios.get(`${auth.url}/api/trpc/project.all`, {
					headers: {
						Authorization: `Bearer ${auth.token}`,
						"Content-Type": "application/json",
					},
				});

				if (!response.data.result.data.json) {
					this.error(chalk.red("Error fetching projects"));
				}

				const projects = response.data.result.data.json;

				if (projects.length === 0) {
					this.log(chalk.yellow("No projects found."));
					return;
				}

				// Permitir al usuario seleccionar un proyecto
				const answers = await inquirer.prompt([
					{
						choices: projects.map((project: any) => ({
							name: project.name,
							value: project.projectId,
						})),
						message: "Select a project to view details:",
						name: "selectedProject",
						type: "list",
					},
				]);

				const selectedProjectId = answers.selectedProject;

				await this.showProjectInfo(auth, selectedProjectId);
			} catch (error) {
				// @ts-expect-error hola
				this.error(chalk.red(`Failed to fetch project list: ${error.message}`));
			}
		}
	}

	private async showProjectInfo(
		auth: { token: string; url: string },
		projectId: string,
	) {
		console.log(
			chalk.blue.bold(`\n  Information for Project ID: ${projectId} \n`),
		);

		try {
			const response = await axios.get(`${auth.url}/api/trpc/project.one`, {
				headers: {
					Authorization: `Bearer ${auth.token}`,
					"Content-Type": "application/json",
				},
				params: {
					input: JSON.stringify({
						json: { projectId },
					}),
				},
			});

			if (!response.data.result.data.json) {
				this.error(chalk.red("Error fetching project information"));
			}

			const projectInfo = response.data.result.data.json;

			this.log(chalk.green(`Project Name: ${projectInfo.name}`));
			this.log(
				chalk.green(
					`Description: ${projectInfo?.description || "No description"}`,
				),
			);
			this.log(
				chalk.green(
					`Number of Applications: ${projectInfo.applications.length}`,
				),
			);
			this.log(
				chalk.green(
					`Number of Compose Services: ${projectInfo.compose.length}`,
				),
			);
			this.log(
				chalk.green(
					`Number of MariaDB Databases: ${projectInfo.mariadb.length}`,
				),
			);
			this.log(
				chalk.green(`Number of MongoDB Databases: ${projectInfo.mongo.length}`),
			);
			this.log(
				chalk.green(`Number of MySQL Databases: ${projectInfo.mysql.length}`),
			);
			this.log(
				chalk.green(
					`Number of PostgreSQL Databases: ${projectInfo.postgres.length}`,
				),
			);
			this.log(
				chalk.green(`Number of Redis Databases: ${projectInfo.redis.length}`),
			);

			if (projectInfo.applications.length > 0) {
				this.log(chalk.blue("\nApplications:"));
				projectInfo.applications.forEach((app: any, index: number) => {
					this.log(`  ${index + 1}. ${app.name}`);
				});
			}

			if (projectInfo.compose.length > 0) {
				this.log(chalk.blue("\nCompose Services:"));
				projectInfo.compose.forEach((service: any, index: number) => {
					this.log(`  ${index + 1}. ${service.name}`);
				});
			}

			if (projectInfo.mariadb.length > 0) {
				this.log(chalk.blue("\nMariaDB Databases:"));
				projectInfo.mariadb.forEach((db: any, index: number) => {
					this.log(`  ${index + 1}. ${db.name}`);
				});
			}

			if (projectInfo.mongo.length > 0) {
				this.log(chalk.blue("\nMongoDB Databases:"));
				projectInfo.mongo.forEach((db: any, index: number) => {
					this.log(`  ${index + 1}. ${db.name}`);
				});
			}

			if (projectInfo.mysql.length > 0) {
				this.log(chalk.blue("\nMySQL Databases:"));
				projectInfo.mysql.forEach((db: any, index: number) => {
					this.log(`  ${index + 1}. ${db.name}`);
				});
			}

			if (projectInfo.postgres.length > 0) {
				this.log(chalk.blue("\nPostgreSQL Databases:"));
				projectInfo.postgres.forEach((db: any, index: number) => {
					this.log(`  ${index + 1}. ${db.name}`);
				});
			}

			if (projectInfo.redis.length > 0) {
				this.log(chalk.blue("\nRedis Databases:"));
				projectInfo.redis.forEach((db: any, index: number) => {
					this.log(`  ${index + 1}. ${db.name}`);
				});
			}
		} catch (error) {
			this.error(
				// @ts-expect-error hola
				chalk.red(`Failed to fetch project information: ${error.message}`),
			);
		}
	}
}
