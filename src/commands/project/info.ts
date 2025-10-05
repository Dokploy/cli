import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import inquirer from "inquirer";

import { readAuthConfig } from "../../utils/utils.js";
import { getProjects } from "../../utils/shared.js";

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
			const projects = await getProjects(auth, this);
			const projectInfo = projects.find(p => p.projectId === projectId);

			if (!projectInfo) {
				this.error(chalk.red("Project not found."));
				return;
			}

			this.log(chalk.green(`Project Name: ${projectInfo.name}`));
			this.log(
				chalk.green(
					`Description: ${projectInfo?.description || "No description"}`,
				),
			);

			// Contar totales de todos los environments
			let totalApplications = 0;
			let totalCompose = 0;
			let totalMariaDB = 0;
			let totalMongoDB = 0;
			let totalMySQL = 0;
			let totalPostgreSQL = 0;
			let totalRedis = 0;

			if (projectInfo.environments && projectInfo.environments.length > 0) {
				this.log(chalk.green(`Number of Environments: ${projectInfo.environments.length}`));
				
				// Mostrar información por environment
				projectInfo.environments.forEach((env, envIndex) => {
					this.log(chalk.blue(`\nEnvironment ${envIndex + 1}: ${env.name} (${env.description})`));
					
					// Contar recursos por environment
					const envApps = env.applications?.length || 0;
					const envCompose = env.compose?.length || 0;
					const envMariaDB = env.mariadb?.length || 0;
					const envMongoDB = env.mongo?.length || 0;
					const envMySQL = env.mysql?.length || 0;
					const envPostgreSQL = env.postgres?.length || 0;
					const envRedis = env.redis?.length || 0;

					totalApplications += envApps;
					totalCompose += envCompose;
					totalMariaDB += envMariaDB;
					totalMongoDB += envMongoDB;
					totalMySQL += envMySQL;
					totalPostgreSQL += envPostgreSQL;
					totalRedis += envRedis;

					this.log(`  Applications: ${envApps}`);
					this.log(`  Compose Services: ${envCompose}`);
					this.log(`  MariaDB: ${envMariaDB}`);
					this.log(`  MongoDB: ${envMongoDB}`);
					this.log(`  MySQL: ${envMySQL}`);
					this.log(`  PostgreSQL: ${envPostgreSQL}`);
					this.log(`  Redis: ${envRedis}`);

					// Mostrar detalles de applications
					if (envApps > 0) {
						this.log(chalk.cyan("    Applications:"));
						env.applications.forEach((app, index) => {
							this.log(`      ${index + 1}. ${app.name}`);
						});
					}

					// Mostrar detalles de databases
					if (envMariaDB > 0) {
						this.log(chalk.cyan("    MariaDB Databases:"));
						env.mariadb.forEach((db, index) => {
							this.log(`      ${index + 1}. ${db.name}`);
						});
					}

					if (envMongoDB > 0) {
						this.log(chalk.cyan("    MongoDB Databases:"));
						env.mongo.forEach((db, index) => {
							this.log(`      ${index + 1}. ${db.name}`);
						});
					}

					if (envMySQL > 0) {
						this.log(chalk.cyan("    MySQL Databases:"));
						env.mysql.forEach((db, index) => {
							this.log(`      ${index + 1}. ${db.name}`);
						});
					}

					if (envPostgreSQL > 0) {
						this.log(chalk.cyan("    PostgreSQL Databases:"));
						env.postgres.forEach((db, index) => {
							this.log(`      ${index + 1}. ${db.name}`);
						});
					}

					if (envRedis > 0) {
						this.log(chalk.cyan("    Redis Databases:"));
						env.redis.forEach((db, index) => {
							this.log(`      ${index + 1}. ${db.name}`);
						});
					}
				});
			} else {
				this.log(chalk.yellow("No environments found in this project."));
			}

			// Mostrar totales
			this.log(chalk.green.bold("\n📊 Project Totals:"));
			this.log(chalk.green(`Total Applications: ${totalApplications}`));
			this.log(chalk.green(`Total Compose Services: ${totalCompose}`));
			this.log(chalk.green(`Total MariaDB Databases: ${totalMariaDB}`));
			this.log(chalk.green(`Total MongoDB Databases: ${totalMongoDB}`));
			this.log(chalk.green(`Total MySQL Databases: ${totalMySQL}`));
			this.log(chalk.green(`Total PostgreSQL Databases: ${totalPostgreSQL}`));
			this.log(chalk.green(`Total Redis Databases: ${totalRedis}`));

		} catch (error) {
			this.error(
				// @ts-expect-error
				chalk.red(`Failed to fetch project information: ${error.message}`),
			);
		}
	}
}
