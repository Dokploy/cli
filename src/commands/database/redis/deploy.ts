import { Command, Flags } from "@oclif/core";
import { readAuthConfig } from "../../../utils/utils.js";
import chalk from "chalk";
import { getProject, getProjects, type Database } from "../../../utils/shared.js";
import inquirer from "inquirer";
import type { Answers } from "../../app/create.js";
import axios from "axios";

export default class DatabaseRedisDeploy extends Command {
	static description = "Deploy a Redis instance to a project.";

	static examples = ["$ <%= config.bin %> redis deploy"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		environmentId: Flags.string({
			char: "e",
			description: "ID of the environment",
			required: false,
		}),
		redisId: Flags.string({
			char: "r",
			description: "ID of the Redis instance to deploy",
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
		const { flags } = await this.parse(DatabaseRedisDeploy);
		let { projectId, environmentId, redisId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !environmentId || !redisId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			let selectedProject;
			let selectedEnvironment;

			// 1. Seleccionar proyecto
			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to deploy the Redis instance from:",
						name: "project",
						type: "list",
					},
				]);
				selectedProject = project;
				projectId = project.projectId;
			} else {
				selectedProject = projects.find(p => p.projectId === projectId);
			}

			// 2. Seleccionar environment del proyecto
			if (!environmentId) {
				if (!selectedProject?.environments || selectedProject.environments.length === 0) {
					this.error(chalk.yellow("No environments found in this project."));
				}

				const { environment } = await inquirer.prompt([
						{
							choices: selectedProject.environments.map((env) => ({
								name: `${env.name} (${env.description})`,
								value: env,
							})),
							message: "Select an environment:",
							name: "environment",
							type: "list",
						},
					]);
					selectedEnvironment = environment;
					environmentId = environment.environmentId;
				} else {
					selectedEnvironment = selectedProject?.environments?.find(e => e.environmentId === environmentId);
				}

			// 3. Seleccionar Redis del environment
			if (!redisId) {
				if (!selectedEnvironment?.redis || selectedEnvironment.redis.length === 0) {
					this.error(chalk.yellow("No Redis instances found in this environment."));
				}

				const dbAnswers = await inquirer.prompt([
						{
							choices: selectedEnvironment.redis.map((db: Database) => ({
								name: db.name,
								value: db.redisId,
							})),
							message: "Select the Redis instance to deploy:",
							name: "selectedDb",
							type: "list",
						},
					]);
					redisId = dbAnswers.selectedDb;
				}
		}

		// Confirmar si no se especifica --skipConfirm
		if (!flags.skipConfirm) {
			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: "Are you sure you want to deploy this Redis instance?",
					name: "confirmDeploy",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDeploy) {
				this.error(chalk.yellow("Redis deployment cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/redis.deploy`,
				{
					json: {
						redisId,
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
				this.error(chalk.red("Error deploying Redis instance"));
			}
			this.log(chalk.green("Redis instance deployed successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error deploying Redis instance: ${error.message}`));
		}
	}
}
