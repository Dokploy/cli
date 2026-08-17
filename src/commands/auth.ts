import axios from "axios";
import chalk from "chalk";
import type { Command } from "commander";
import { saveAuthConfig } from "../client.js";

export function registerAuthCommand(program: Command) {
	program
		.command("auth")
		.description("Authenticate with your Dokploy server")
		.option(
			"-p, --profile <name>",
			"Profile name to save these credentials under (default: default)",
			"default",
		)
		.requiredOption(
			"-u, --url <url>",
			"Server URL (e.g., https://panel.dokploy.com)",
		)
		.requiredOption(
			"-t, --token <token>",
			"API key from your Dokploy dashboard",
		)
		.action(async (opts: { url: string; token: string; profile: string }) => {
			const url = opts.url.replace(/\/+$/, "");

			console.log(chalk.blue("Validating credentials..."));

			try {
				await axios.get(`${url}/api/trpc/user.get`, {
					headers: {
						"x-api-key": opts.token,
						"Content-Type": "application/json",
					},
				});

				saveAuthConfig(url, opts.token, opts.profile);
				console.log(
					chalk.green(
						`Authenticated successfully. Saved profile '${opts.profile}'.`,
					),
				);
			} catch (error: any) {
				console.error(chalk.red(`Authentication failed: ${error.message}`));
				process.exit(1);
			}
		});
}
