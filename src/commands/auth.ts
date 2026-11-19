import axios from "axios";
import chalk from "chalk";
import type { Command } from "commander";
import { getConfigPath, saveAuthConfig } from "../client.js";
import { describeError, printFriendlyError } from "../ui/errors.js";
import { withSpinner } from "../ui/spinner.js";
import { canAnimate, color, symbols } from "../ui/style.js";

function describeUser(body: any): string | undefined {
	const member = body?.result?.data?.json;
	const email = member?.user?.email ?? member?.email;
	if (typeof email !== "string") return undefined;
	return typeof member?.role === "string" ? `${email} (${member.role})` : email;
}

export function registerAuthCommand(program: Command) {
	program
		.command("auth")
		.description("Authenticate with your Dokploy server")
		.requiredOption(
			"-u, --url <url>",
			"Server URL (e.g., https://panel.dokploy.com)",
		)
		.requiredOption(
			"-t, --token <token>",
			"API key from your Dokploy dashboard",
		)
		.action(async (opts: { url: string; token: string }) => {
			const url = opts.url.replace(/\/+$/, "");
			const pretty = canAnimate();

			if (!pretty) {
				console.log(chalk.blue("Validating credentials..."));
			}

			try {
				const response = await withSpinner(
					`Verifying credentials with ${url}`,
					() =>
						axios.get(`${url}/api/trpc/user.get`, {
							headers: {
								"x-api-key": opts.token,
								"Content-Type": "application/json",
							},
						}),
				);

				saveAuthConfig(url, opts.token);

				if (!pretty) {
					console.log(chalk.green("Authenticated successfully."));
					return;
				}
				const who = describeUser(response.data);
				console.log(
					`${color.success(symbols.success)} ${color.strong("Authenticated")}${who ? ` as ${who}` : ""}`,
				);
				console.log(color.muted(`  Server       ${url}`));
				console.log(color.muted(`  Saved to     ${getConfigPath()}`));
			} catch (error: any) {
				if (!pretty) {
					console.error(chalk.red(`Authentication failed: ${error.message}`));
					process.exit(1);
				}
				const friendly = describeError(error);
				printFriendlyError({
					...friendly,
					title: `Authentication failed: ${friendly.title}`,
					hints:
						friendly.status === 401
							? [
									"Check the API key. You can create one in the Dokploy dashboard.",
								]
							: friendly.hints,
				});
				process.exit(1);
			}
		});
}
