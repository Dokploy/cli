import { Args, Command } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "node:fs";

import { type Application, getProject, getProjects } from "../../../utils/shared.js";
import { readAuthConfig } from "../../../utils/utils.js";

type Answers = {
	application: Application;
};

export default class AppEnvPush extends Command {
	static override args = {
		file: Args.string({ description: ".env file to push", required: true }),
	};

	static override description =
		"Push a .env file to a specific application, overriding its current environment variables.";

	static override examples = [
		"<%= config.bin %> app env push .env",
		"<%= config.bin %> app env push .env.production",
	];

	public async run(): Promise<void> {
		const { args } = await this.parse(AppEnvPush);

		if (!fs.existsSync(args.file)) {
			this.error(chalk.red(`File ${args.file} does not exist.`));
		}

		const { override } = await inquirer.prompt<{ override: boolean }>([
			{
				default: false,
				message:
					"This will override all current environment variables for the selected app. Continue?",
				name: "override",
				type: "confirm",
			},
		]);

		if (!override) return;

		const fileContent = fs.readFileSync(args.file, "utf8");
		const auth = await readAuthConfig(this);

		this.log(chalk.blue.bold("\n  Listing all Projects \n"));
		const projects = await getProjects(auth, this);

		const { project } = await inquirer.prompt<{ project: { name: string; projectId: string } }>([
			{
				choices: projects.map((p) => ({ name: p.name, value: p })),
				message: "Select a project:",
				name: "project",
				type: "list",
			},
		]);

		const projectDetails = await getProject(project.projectId, auth, this);

		const { environment } = await inquirer.prompt<{
			environment: { applications: Application[]; environmentId: string; name: string };
		}>([
			{
				choices: projectDetails.environments.map(
					(e: { environmentId: string; name: string }) => ({
						name: e.name,
						value: e,
					}),
				),
				message: "Select an environment:",
				name: "environment",
				type: "list",
			},
		]);

		if (environment.applications.length === 0) {
			this.error(chalk.red("No applications found in this environment."));
		}

		const { application } = await inquirer.prompt<Answers>([
			{
				choices: environment.applications.map((app) => ({
					name: app.name,
					value: app,
				})),
				message: "Select an application:",
				name: "application",
				type: "list",
			},
		]);

		const response = await axios.post(
			`${auth.url}/api/trpc/application.update`,
			{
				json: {
					applicationId: application.applicationId,
					env: fileContent,
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
			this.error(chalk.red("Failed to push environment variables."));
		}

		this.log(chalk.green(`\n✓ Environment variables pushed to ${application.name} successfully.`));
	}
}
