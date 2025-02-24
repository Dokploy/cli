import { Command, Flags } from "@oclif/core";
import { readAuthConfig } from "../../../utils/utils.js";
import chalk from "chalk";
import { getProject, getProjects } from "../../../utils/shared.js";
import inquirer from "inquirer";
import type { Answers } from "../../app/create.js";
import axios from "axios";

export default class DatabaseRedisStop extends Command {
	static description = "Stop a Redis instance in a project.";

	static examples = ["$ <%= config.bin %> redis stop"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		redisId: Flags.string({
			char: "r",
			description: "ID of the Redis instance to stop",
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
		const { flags } = await this.parse(DatabaseRedisStop);
		let { projectId, redisId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !redisId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to stop the Redis instance from:",
						name: "project",
						type: "list",
					},
				]);
				projectId = project.projectId;
			}

			const projectSelected = await getProject(projectId, auth, this);

			if (projectSelected.redis.length === 0) {
				this.error(chalk.yellow("No Redis instances found in this project."));
			}

			if (!redisId) {
				const dbAnswers = await inquirer.prompt([
					{
						// @ts-ignore
						choices: projectSelected.redis.map((db) => ({
							name: db.name,
							value: db.redisId,
						})),
						message: "Select the Redis instance to stop:",
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
					message: "Are you sure you want to stop this Redis instance?",
					name: "confirmStop",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmStop) {
				this.error(chalk.yellow("Redis stop cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/redis.stop`,
				{
					json: {
						redisId,
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
				this.error(chalk.red("Error stopping Redis instance"));
			}
			this.log(chalk.green("Redis instance stopped successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error stopping Redis instance: ${error.message}`));
		}
	}
}
