import { Command } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "..", "..", "config.json");

export default class Verify extends Command {
	static description = "Verify if the saved authentication token is valid";

	static examples = ["$ <%= config.bin %> <%= command.id %>"];

	async run() {
		console.log(chalk.blue.bold("\nVerifying Authentication Token"));

		if (!fs.existsSync(configPath)) {
			this.error(
				chalk.red(
					"No configuration file found. Please authenticate first using `authenticate` command.",
				),
			);
		}

		const configFileContent = fs.readFileSync(configPath, "utf8");
		const config = JSON.parse(configFileContent);
		const { token, url } = config;

		if (!url || !token) {
			this.error(
				chalk.red(
					"Incomplete authentication details. Please authenticate again using `authenticate` command.",
				),
			);
		}

		try {
			console.log(`\n${chalk.blue("Validating token...")}`);

			const response = await axios.post(
				`${url}/api/trpc/auth.verifyToken`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.data.result.data.json) {
				this.log(chalk.green("Token is valid."));
			} else {
				this.error(
					chalk.red(
						"Invalid token. Please authenticate again using `authenticate` command.",
					),
				);
			}
		} catch (error) {
			this.error(
				chalk.red(
					// @ts-ignore
					`Failed to verify token: ${error.message}. Please authenticate again using 'authenticate' command.`,
				),
			);
		}
	}
}
