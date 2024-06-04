import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "..", "..", "config.json");

export default class Authenticate extends Command {
	static description = "Authenticate the user by saving server URL and token";

	static examples = [
		"$ <%= config.bin %> <%= command.id %> --url=https://panel.dokploy.com --token=aslgjasndjanskj123%!@#",
		"$ <%= config.bin %> <%= command.id %> -u https://panel.dokploy.com -t aslgjasndjanskj123%!@#",
	];

	static flags = {
		token: Flags.string({
			char: "t",
			description: "Authentication token",
		}),
		url: Flags.string({
			char: "u",
			description: "Server URL",
		}),
	};

	async run() {
		console.log(
			chalk.blue.bold("\n  Welcome to Dokploy CLI Authentication \n"),
		);

		const { flags } = await this.parse(Authenticate);

		let answers: any;
		if (!flags.token || !flags.url) {
			answers = await inquirer.prompt([
				{
					message: chalk.green(
						"Enter your server URL (e.g., https://panel.dokploy.com): ",
					),
					name: "url",
					type: "input",
					validate: (input) => (input ? true : "Server URL is required"),
				},
				{
					message: chalk.green(
						"Enter your authentication token (e.g., aslgjasndjanskj123%!@#): ",
					),
					name: "token",
					type: "input",
					validate: (input) =>
						input ? true : "Authentication token is required",
				},
			]);
		}

		const url = flags.url || answers.url;
		const token = flags.token || answers.token;

		const config = {
			token,
			url,
		};

		try {
			console.log(`\n${chalk.blue("Validating server...")}`);

			const response = await axios.post(
				`${url}/api/trpc/auth.verifyToken`,
				{
					json: {
						token,
					},
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.data.result.data.json) {
				this.error(chalk.red("Invalid token"));
			}

			fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
			this.log(chalk.green("Authentication details saved successfully."));
		} catch (error) {
			this.error(
				// @ts-expect-error - Type
				chalk.red(`Failed to save authentication details: ${error.message}`),
			);
		}
	}
}
