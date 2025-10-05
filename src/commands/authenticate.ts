import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer, { type Answers, type QuestionCollection } from "inquirer";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "..", "..", "config.json");

export default class Authenticate extends Command {
	static description = "Authenticate the user by saving server URL and token";

	static examples = [
		"$ <%= config.bin %> <%= command.id %> --url=https://panel.dokploy.com --token=MRTHGZDGMRZWM43EMZSHGZTTMRTHGZDGONSGMZDTMY",
		"$ <%= config.bin %> <%= command.id %> -u https://panel.dokploy.com -t MRTHGZDGMRZWM43EMZSHGZTTMRTHGZDGONSGMZDTMY",
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

		let answers: Answers = {};

		const questions: QuestionCollection[] = [];

		let config: { token?: string; url?: string } = {};
		if (fs.existsSync(configPath)) {
			const configFileContent = fs.readFileSync(configPath, "utf8");
			config = JSON.parse(configFileContent);
		}

		if (!flags.url) {
			questions.push({
				default: config.url,
				message: chalk.green(
					"Enter your server URL (e.g., https://panel.dokploy.com): ",
				),
				name: "url",
				type: "input",
				validate: (input) => (input ? true : "Server URL is required"),
			});
		}

		if (!flags.token) {
			questions.push({
				default: config.token,
				message: chalk.green(
					"Enter your authentication token (e.g., MRTHGZDGMRZWM43EMZSHGZTTMRTHGZDGONSGMZDTMY=): ",
				),
				name: "token",
				type: "input",
				validate: (input) =>
					input ? true : "Authentication token is required",
			});
		}

		if (questions.length > 0) {
			answers = await inquirer.prompt(questions);
		}

		const url = flags.url || answers.url;
		const token = flags.token || answers.token;

		config.token = token;
		config.url = url;

		try {
			console.log(`\n${chalk.blue("Validating server...")}`);

			await axios.get(
				`${url}/api/trpc/user.get`,
				{
					headers: {
						"x-api-key": token,
						"Content-Type": "application/json",
					},
				},
			);

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
