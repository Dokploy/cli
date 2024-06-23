import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import inquirer from "inquirer";

import { readAuthConfig } from "../../utils/utils.js";
import { getProject, getProjects } from "../../utils/shared.js";

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
			await this.showProjectInfo(auth, flags.projectId);
		} else {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));

			try {
				const projects = await getProjects(auth, this);

				if (projects.length === 0) {
					this.log(chalk.yellow("No projects found."));
					return;
				}

				const answers = await inquirer.prompt([
					{
						choices: projects.map((project) => ({
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
			const projectInfo = await getProject(projectId, auth, this);

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
				// @ts-ignore
				projectInfo.applications.forEach((app, index: number) => {
					this.log(`  ${index + 1}. ${app.name}`);
				});
			}

			if (projectInfo.compose.length > 0) {
				this.log(chalk.blue("\nCompose Services:"));
				// @ts-ignore
				projectInfo.compose.forEach((service, index: number) => {
					this.log(`  ${index + 1}. ${service.name}`);
				});
			}

			if (projectInfo.mariadb.length > 0) {
				this.log(chalk.blue("\nMariaDB Databases:"));
				// @ts-ignore
				projectInfo.mariadb.forEach((db, index: number) => {
					this.log(`  ${index + 1}. ${db.name}`);
				});
			}

			if (projectInfo.mongo.length > 0) {
				this.log(chalk.blue("\nMongoDB Databases:"));
				// @ts-ignore
				projectInfo.mongo.forEach((db, index: number) => {
					this.log(`  ${index + 1}. ${db.name}`);
				});
			}

			if (projectInfo.mysql.length > 0) {
				this.log(chalk.blue("\nMySQL Databases:"));
				// @ts-ignore
				projectInfo.mysql.forEach((db, index: number) => {
					this.log(`  ${index + 1}. ${db.name}`);
				});
			}

			if (projectInfo.postgres.length > 0) {
				this.log(chalk.blue("\nPostgreSQL Databases:"));
				// @ts-ignore
				projectInfo.postgres.forEach((db, index: number) => {
					this.log(`  ${index + 1}. ${db.name}`);
				});
			}

			if (projectInfo.redis.length > 0) {
				this.log(chalk.blue("\nRedis Databases:"));
				// @ts-ignore
				projectInfo.redis.forEach((db, index: number) => {
					this.log(`  ${index + 1}. ${db.name}`);
				});
			}
		} catch (error) {
			this.error(
				// @ts-expect-error
				chalk.red(`Failed to fetch project information: ${error.message}`),
			);
		}
	}
}
