import { Command, Flags } from "@oclif/core";
import { readAuthConfig } from "../../../utils/utils.js";
import chalk from "chalk";
import { getProject, getProjects } from "../../../utils/shared.js";
import inquirer from "inquirer";
import type { Answers } from "../../app/create.js";
import axios from "axios";

export default class DatabaseRedisDelete extends Command {
	static description = "Delete a Redis instance from a project.";

	static examples = [
		"$ <%= config.bin %> redis delete",
		"$ <%= config.bin %> redis delete -p <projectId>",
	];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		redisId: Flags.string({
			char: "r",
			description: "ID of the Redis instance to delete",
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
		const { flags } = await this.parse(DatabaseRedisDelete);
		let { projectId, redisId } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !redisId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const answers = await inquirer.prompt([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project.projectId,
						})),
						message: "Select a project to delete the Redis instance from:",
						name: "selectedProject",
						type: "list",
					},
				]);
				projectId = answers.selectedProject;
			}

			const projectSelected = await getProject(projectId, auth, this);

			if (!projectSelected.redis || projectSelected.redis.length === 0) {
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
						message: "Select the Redis instance to delete:",
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
					message: "Are you sure you want to delete this Redis instance?",
					name: "confirmDelete",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDelete) {
				this.error(chalk.yellow("Redis deletion cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/redis.remove`,
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

			if (!response.data.result.data.json) {
				this.error(chalk.red("Error deleting Redis instance"));
			}
			this.log(chalk.green("Redis instance deleted successfully."));
		} catch (error: any) {
			this.error(chalk.red(`Error deleting Redis instance: ${error.message}`));
		}
	}
}
