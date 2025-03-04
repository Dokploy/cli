import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";
import { readAuthConfig } from "../../../utils/utils.js";
import { getProjects } from "../../../utils/shared.js";
import { slugify } from "../../../utils/slug.js";
import type { Answers } from "../../app/create.js";

export default class DatabaseMariadbCreate extends Command {
	static description = "Create a new MariaDB database within a project.";

	static examples = ["$ <%= config.bin %> mariadb create"];

	static flags = {
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		name: Flags.string({
			char: "n",
			description: "Database name",
			required: false,
		}),
		databaseName: Flags.string({
			description: "MariaDB database name",
			required: false,
		}),
		description: Flags.string({
			char: "d",
			description: "Database description",
			required: false,
		}),
		databaseRootPassword: Flags.string({
			description: "Database root password",
			required: false,
		}),
		databasePassword: Flags.string({
			description: "Database password",
			required: false,
		}),
		databaseUser: Flags.string({
			description: "Database user",
			default: "mariadb",
		}),
		dockerImage: Flags.string({
			description: "Docker image",
			default: "mariadb:11",
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
		const { flags } = await this.parse(DatabaseMariadbCreate);
		let { 
			projectId, 
			name, 
			databaseName, 
			description, 
			databaseRootPassword,
			databasePassword,
			databaseUser,
			dockerImage,
			appName 
		} = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!projectId || !name || !databaseName || !appName) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to create the MariaDB instance in:",
						name: "project",
						type: "list",
					},
				]);
				projectId = project.projectId;
			}

			if (!name || !databaseName || !appName) {
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
						message: "Database Root Password (optional):",
						name: "databaseRootPassword",
						type: "password",
						default: databaseRootPassword,
					},
					{
						message: "Database password (optional):",
						name: "databasePassword",
						type: "password",
						default: databasePassword,
					},
					{
						default: dockerImage || "mariadb:11",
						message: "Docker Image (default: mariadb:11):",
						name: "dockerImage",
						type: "input",
					},
					{
						default: databaseUser || "mariadb",
						message: "Database User: (default: mariadb):",
						name: "databaseUser",
						type: "input",
					},
				]);

				name = dbDetails.name;
				databaseName = dbDetails.databaseName;
				description = dbDetails.description;
				databaseRootPassword = dbDetails.databaseRootPassword;
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
					message: 'Do you want to create this MariaDB instance?',
					default: false,
				},
			]);

			if (!confirm.proceed) {
				this.error(chalk.yellow("MariaDB creation cancelled."));
				return;
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/mariadb.create`,
				{
					json: {
						name,
						databaseName,
						description,
						databaseRootPassword,
						databasePassword,
						databaseUser,
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
				this.error(chalk.red("Error creating MariaDB instance", response.data.result.data.json));
			}

			this.log(chalk.green(`MariaDB instance '${name}' created successfully.`));
		} catch (error: any) {
			this.error(chalk.red(`Error creating MariaDB instance: ${error.message}`));
		}
	}
}
