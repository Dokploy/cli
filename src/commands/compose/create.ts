import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { type Project, getProjects } from "../../utils/shared.js";
import { slugify } from "../../utils/slug.js";
import { readAuthConfig } from "../../utils/utils.js";

type ComposeType = "docker-compose" | "stack";

interface Answers {
	project: Project;
}

export default class ComposeCreate extends Command {
	static override description = "Create a new Docker Compose service within a project.";

	static override examples = [
		"$ <%= config.bin %> compose create",
		"$ <%= config.bin %> compose create -n my-stack -e <environmentId>",
	];

	static override flags = {
		appName: Flags.string({
			description: "Docker app name (auto-generated if omitted)",
			required: false,
		}),
		composeType: Flags.string({
			char: "t",
			description: "Compose type: docker-compose or stack",
			options: ["docker-compose", "stack"],
			required: false,
		}),
		description: Flags.string({
			char: "d",
			description: "Compose service description",
			required: false,
		}),
		environmentId: Flags.string({
			char: "e",
			description: "ID of the environment",
			required: false,
		}),
		name: Flags.string({
			char: "n",
			description: "Compose service name",
			required: false,
		}),
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		skipConfirm: Flags.boolean({
			char: "y",
			default: false,
			description: "Skip confirmation prompt",
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(ComposeCreate);
		let { appName, environmentId, name, projectId } = flags;
		let description = flags.description;
		let composeType = (flags.composeType ?? "docker-compose") as ComposeType;

		if (!projectId || !environmentId || !name || !appName) {
			this.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			let selectedProject;

			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((p) => ({ name: p.name, value: p })),
						message: "Select a project to create the compose service in:",
						name: "project",
						type: "list",
					},
				]);
				selectedProject = project;
				projectId = project.projectId;
			} else {
				selectedProject = projects.find((p) => p.projectId === projectId);
			}

			if (!environmentId) {
				if (!selectedProject?.environments || selectedProject.environments.length === 0) {
					this.error(chalk.yellow("No environments found in this project."));
				}

				const { environment } = await inquirer.prompt<{ environment: { environmentId: string; name: string } }>([
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

			if (!name || !appName) {
				const details = await inquirer.prompt([
					{
						default: name,
						message: "Enter the compose service name:",
						name: "name",
						type: "input",
						validate: (input: string) => (input ? true : "Name is required"),
					},
					{
						default: description,
						message: "Enter a description (optional):",
						name: "description",
						type: "input",
					},
					{
						choices: [
							{ name: "docker-compose", value: "docker-compose" },
							{ name: "stack (Docker Swarm)", value: "stack" },
						],
						default: "docker-compose",
						message: "Compose type:",
						name: "composeType",
						type: "list",
					},
				]);

				name = details.name;
				description = details.description;
				composeType = details.composeType;

				const { generatedAppName } = await inquirer.prompt([
					{
						default: appName || slugify(name),
						message: "Docker app name:",
						name: "generatedAppName",
						type: "input",
						validate: (input: string) =>
							/^[\w.-]+$/.test(input) ? true : "Only letters, numbers, dots, underscores, and hyphens allowed",
					},
				]);
				appName = generatedAppName;
			}
		}

		if (!flags.skipConfirm) {
			const { proceed } = await inquirer.prompt<{ proceed: boolean }>([
				{
					default: false,
					message: `Create compose service '${name}'?`,
					name: "proceed",
					type: "confirm",
				},
			]);

			if (!proceed) {
				this.error(chalk.yellow("Compose creation cancelled."));
			}
		}

		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/compose.create`,
				{
					json: {
						appName,
						composeType,
						description,
						environmentId,
						name,
					},
				},
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": auth.token,
					},
				},
			);

			if (response.status !== 200) {
				this.error(chalk.red("Error creating compose service."));
			}

			this.log(chalk.green(`\n✓ Compose service '${name}' created successfully.`));
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			this.error(chalk.red(`Error creating compose service: ${message}`));
		}
	}
}
