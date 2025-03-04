import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";
import { slugify } from "../../../utils/slug.js";
import { readAuthConfig } from "../../../utils/utils.js";
import { getProjects } from "../../../utils/shared.js";
import type { Answers } from "../../app/create.js";

export default class DatabaseRedisCreate extends Command {
	static description = "Create a new Redis instance within a project.";

	static examples = ["$ <%= config.bin %> redis create"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		name: Flags.string({
			char: "n",
			description: "Instance name",
			required: false,
		}),
		description: Flags.string({
			char: "d",
			description: "Instance description",
			required: false,
		}),
		databasePassword: Flags.string({
			description: "Redis password",
			required: false,
		}),
		dockerImage: Flags.string({
			description: "Docker image",
			default: "redis:7",
		}),
		skipConfirm: Flags.boolean({
			char: "y",
			description: "Skip confirmation prompt",
			default: false,
		}),
		appName: Flags.string({
			description: "App name",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(DatabaseRedisCreate);
		let { 
			projectId, 
			name, 
			description, 
			databasePassword,
			dockerImage,
			appName 
		} = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !name || !appName || !databasePassword) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to create the Redis instance in:",
						name: "project",
						type: "list",
					},
				]);
				projectId = project.projectId;
			}

			if (!name || !appName || !databasePassword) {
				const redisDetails = await inquirer.prompt([
					{
						message: "Enter the name:",
						name: "name",
						type: "input",
						validate: (input) => (input ? true : "Instance name is required"),
						default: name,
					},
					{
						message: "Enter the instance description (optional):",
						name: "description",
						type: "input",
						default: description,
					},
					{
						message: "Redis password:",
						name: "databasePassword",
						type: "password",
						default: databasePassword,
					},
					{
						default: dockerImage || "redis:7",
						message: "Docker Image (default: redis:7):",
						name: "dockerImage",
						type: "input",
					},
				]);

				name = redisDetails.name;
				description = redisDetails.description;
				databasePassword = redisDetails.databasePassword;
				dockerImage = redisDetails.dockerImage;

				const appNamePrompt = await inquirer.prompt([
					{
						default: appName || `${slugify(name)}`,
						message: "Enter the App name:",
						name: "appName",
						type: "input",
						validate: (input) => (input ? true : "App name is required"),
					},
				]);

				appName = appNamePrompt.appName;
			}
		}

		// Confirmar si no se especifica --skipConfirm
		if (!flags.skipConfirm) {
			const confirm = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'proceed',
					message: 'Do you want to create this Redis instance?',
					default: false,
				},
			]);

			if (!confirm.proceed) {
				this.error(chalk.yellow("Redis creation cancelled."));
				return;
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/redis.create`,
				{
					json: {
						name,
						description,
						databasePassword,
						dockerImage,
						appName,
						projectId,
					},
				},
				{
					headers: {
						"x-api-key": auth.token,
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.data.result.data.json) {
				this.error(chalk.red("Error creating Redis instance", response.data.result.data.json));
			}

			this.log(chalk.green(`Redis instance '${name}' created successfully.`));
		} catch (error: any) {
			this.error(chalk.red(`Error creating Redis instance: ${error.message}`));
		}
	}
}
