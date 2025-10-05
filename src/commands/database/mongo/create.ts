import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";
import { readAuthConfig } from "../../../utils/utils.js";
import { getProjects, type Database } from "../../../utils/shared.js";
import { slugify } from "../../../utils/slug.js";
import type { Answers } from "../../app/create.js";

export default class DatabaseMongoCreate extends Command {
	static description = "Create a new MongoDB database within a project.";

	static examples = ["$ <%= config.bin %> mongo create"];

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
		name: Flags.string({
			char: "n",
			description: "Database name",
			required: false,
		}),
		databaseName: Flags.string({
			description: "MongoDB database name",
			required: false,
		}),
		description: Flags.string({
			char: "d",
			description: "Database description",
			required: false,
		}),
		databasePassword: Flags.string({
			description: "Database password",
			required: false,
		}),
		databaseUser: Flags.string({
			description: "Database user",
			default: "mongo",
		}),
		dockerImage: Flags.string({
			description: "Docker image",
			default: "mongo:6",
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
		const { flags } = await this.parse(DatabaseMongoCreate);
		let { 
			projectId, 
			environmentId,
			name, 
			databaseName, 
			description, 
			databasePassword,
			databaseUser,
			dockerImage,
			appName 
		} = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !environmentId || !name || !databaseName || !appName || !databasePassword) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			let selectedProject;

			// 1. Seleccionar proyecto
			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to create the MongoDB instance in:",
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
					environmentId = environment.environmentId;
				}

			if (!name || !databaseName || !appName || !databasePassword) {
				const dbDetails = await inquirer.prompt([
					{
						message: "Enter the name:",
						name: "name",
						type: "input",
						validate: (input) => (input ? true : "Database name is required"),
						default: name,
					},
					{
						message: "Database name:",
						name: "databaseName",
						type: "input",
						validate: (input) => (input ? true : "Database name is required"),
						default: databaseName,
					},
					{
						message: "Enter the database description (optional):",
						name: "description",
						type: "input",
						default: description,
					},
					{
						message: "Database password (optional):",
						name: "databasePassword",
						type: "password",
						default: databasePassword,
					},
					{
						default: dockerImage || "mongo:6",
						message: "Docker Image (default: mongo:6):",
						name: "dockerImage",
						type: "input",
					},
					{
						default: databaseUser || "mongo",
						message: "Database User: (default: mongo):",
						name: "databaseUser",
						type: "input",
					},
				]);

				name = dbDetails.name;
				databaseName = dbDetails.databaseName;
				description = dbDetails.description;
				databasePassword = dbDetails.databasePassword;
				dockerImage = dbDetails.dockerImage;
				databaseUser = dbDetails.databaseUser;

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
					message: 'Do you want to create this MongoDB instance?',
					default: false,
				},
			]);

			if (!confirm.proceed) {
				this.error(chalk.yellow("MongoDB creation cancelled."));
				return;
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/mongo.create`,
				{
					json: {
						name,
						databaseName,
						description,
						databasePassword,
						databaseUser,
						dockerImage,
						appName,
						projectId,
						environmentId,
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
				this.error(chalk.red("Error creating MongoDB instance"));
			}

			this.log(chalk.green(`MongoDB instance '${name}' created successfully.`));
		} catch (error: any) {
			this.error(chalk.red(`Error creating MongoDB instance: ${error.message}`));
		}
	}
}
