import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer, { type Answers, type QuestionCollection } from "inquirer";

import { readAuthConfig } from "../../utils/utils.js";

export default class ProjectCreate extends Command {
	static override description =
		"Create a new project with an optional description.";

	static override examples = [
		"$ <%= config.bin %> <%= command.id %> -n MyProject -d 'This is my project description'",
		"$ <%= config.bin %> <%= command.id %> -n MyProject",
		"$ <%= config.bin %> <%= command.id %>",
	];

	static override flags = {
		description: Flags.string({
			char: "d",
			description: "Description of the project",
			required: false,
		}),
		name: Flags.string({
			char: "n",
			description: "Name of the project",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		console.log(chalk.blue.bold("\n  Create a New Project \n"));

		const { flags } = await this.parse(ProjectCreate);

		let answers: Answers = {};

		const questions: QuestionCollection[] = [];

		if (!flags.name) {
			questions.push({
				message: chalk.green("Enter the project name:"),
				name: "name",
				type: "input",
				validate: (input) => (input ? true : "Project name is required"),
			});
		}

		if (!flags.description) {
			questions.push({
				default: "",
				message: chalk.green("Enter the project description (optional):"),
				name: "description",
				type: "input",
			});
		}

		if (questions.length > 0) {
			answers = await inquirer.prompt(questions);
		}

		const name = flags.name || answers.name;
		const description = flags.description || answers.description;

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/project.createCLI`,
				{
					json: {
						description,
						name,
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
				this.error(chalk.red("Error`"));
			}

			this.log(chalk.green(`Project '${name}' created successfully.`));
		} catch (error) {
			// @ts-expect-error hola
			this.error(chalk.red(`Failed to create project: ${error.message}`));
		}
	}
}
