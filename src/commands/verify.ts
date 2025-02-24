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

		let token: string;
		let url: string;

		// Verificar variables de entorno primero
		const envToken = process.env.DOKPLOY_AUTH_TOKEN;
		const envUrl = process.env.DOKPLOY_URL;

		if (envToken && envUrl) {
			token = envToken;
			url = envUrl;
			this.log(chalk.green("Using environment variables for authentication"));
		} else {
			// Si no hay variables de entorno, verificar archivo de configuración
			if (!fs.existsSync(configPath)) {
				this.error(
					chalk.red(
						"No configuration found. Please either:\n" +
						"1. Authenticate using `authenticate` command\n" +
						"2. Set DOKPLOY_URL and DOKPLOY_AUTH_TOKEN environment variables",
					),
				);
			}

			try {
				const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
				token = config.token;
				url = config.url;
				this.log(chalk.green("Using configuration file for authentication"));
			} catch (error) {
				this.error(
					chalk.red(
						"Invalid configuration file. Please authenticate again using `authenticate` command.",
					),
				);
			}
		}

		// Validar el token contra el servidor
		try {
			console.log(chalk.blue("Validating token with server..."));

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
				this.log(chalk.green("\n✓ Token is valid"));
			} else {
				this.error(
					chalk.red(
						"Invalid token. Please authenticate again using `authenticate` command.",
					),
				);
			}
		} catch (error: any) {
			this.error(
				chalk.red(
					`Failed to verify token: ${error.message}. Please authenticate again using 'authenticate' command.`,
				),
			);
		}
	}
}
