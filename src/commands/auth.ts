import type { Command } from "commander";
import chalk from "chalk";
import axios from "axios";
import { saveAuthConfig } from "../client.js";

export function registerAuthCommand(program: Command) {
	program
		.command("auth")
		.description("Authenticate with your Dokploy server")
		.requiredOption("-u, --url <url>", "Server URL (e.g., https://panel.dokploy.com)")
		.requiredOption("-t, --token <token>", "API key from your Dokploy dashboard")
		.action(async (opts: { url: string; token: string }) => {
			const url = opts.url.replace(/\/+$/, "");

			console.log(chalk.blue("Validating credentials..."));

			try {
				await axios.get(`${url}/api/trpc/user.get`, {
					headers: {
						"x-api-key": opts.token,
						"Content-Type": "application/json",
					},
				});

				saveAuthConfig(url, opts.token);
				console.log(chalk.green("Authenticated successfully."));
			} catch (error: any) {
				console.error(chalk.red(`Authentication failed: ${error.message}`));
				process.exit(1);
			}
		});
}
