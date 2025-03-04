import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";
import { readAuthConfig } from "../../utils/utils.js";

export default class ProjectCreate extends Command {
	static description = "Create a new project.";

	static examples = [
		"$ <%= config.bin %> project create",
		"$ <%= config.bin %> project create -n MyProject -d 'Project description'",
		"$ <%= config.bin %> project create --name MyProject --skipConfirm",
	];

	static flags = {
		name: Flags.string({
			char: "n",
			description: "Name of the project",
			required: false,
		}),
		description: Flags.string({
			char: "d",
			description: "Description of the project",
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
		const { flags } = await this.parse(ProjectCreate);
		let { name, description } = flags;

		// Modo interactivo si no se proporcionan los flags necesarios
		if (!name) {
			const answers = await inquirer.prompt([
				{
					message: "Enter the project name:",
					name: "name",
					type: "input",
					validate: (input) => (input ? true : "Project name is required"),
				},
				{
					message: "Enter the project description (optional):",
					name: "description",
					type: "input",
					default: description || "",
				},
			]);

			name = answers.name;
			description = answers.description;
		}

		// Confirmar si no se especifica --skipConfirm
		if (!flags.skipConfirm) {
			const confirm = await inquirer.prompt([
				{
					type: 'confirm',
					name: 'proceed',
					message: 'Do you want to create this project?',
					default: false,
				},
			]);

			if (!confirm.proceed) {
				this.error(chalk.yellow("Project creation cancelled."));
				return;
			}
		}

		try {

			const response = await axios.post(
				`${auth.url}/api/trpc/project.create`,
				{
					json: {
						name,
						description,
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
				this.error(chalk.red("Error creating project", response.data.result.data.json));
			}

			this.log(chalk.green(`Project '${name}' created successfully.`));
		} catch (error: any) {
			this.error(chalk.red(`Error creating project: ${error.message}`));
		}
	}
}
