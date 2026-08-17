import chalk from "chalk";
import type { Command } from "commander";
import {
	getCurrentProfile,
	listProfiles,
	removeProfile,
	setCurrentProfile,
} from "../client.js";

export function registerProfileCommands(program: Command) {
	const profiles = program
		.command("profiles")
		.description("Manage multiple Dokploy accounts (profiles)");

	profiles
		.command("list")
		.description("List all saved profiles")
		.action(() => {
			const items = listProfiles();
			const current = getCurrentProfile();

			if (items.length === 0) {
				console.log(
					chalk.yellow(
						"No profiles found. Run 'dokploy auth --profile <name> -u <url> -t <token>' to add one.",
					),
				);
				return;
			}

			for (const { name, url } of items) {
				const marker = name === current ? "*" : " ";
				console.log(`${marker} ${chalk.cyan(name.padEnd(16))} ${url}`);
			}
			console.log(chalk.dim(`\nActive profile: ${current}`));
		});

	profiles
		.command("use <name>")
		.description("Switch the active profile")
		.action((name: string) => {
			try {
				setCurrentProfile(name);
				console.log(chalk.green(`Switched to profile '${name}'.`));
			} catch (error: any) {
				console.error(chalk.red(error.message));
				process.exit(1);
			}
		});

	profiles
		.command("current")
		.description("Show the active profile")
		.action(() => {
			console.log(getCurrentProfile());
		});

	profiles
		.command("remove <name>")
		.description("Remove a saved profile")
		.action((name: string) => {
			try {
				removeProfile(name);
				console.log(chalk.green(`Removed profile '${name}'.`));
			} catch (error: any) {
				console.error(chalk.red(error.message));
				process.exit(1);
			}
		});

	profiles.addHelpText(
		"after",
		`
Examples:
  dokploy auth --profile prod -u https://panel.dokploy.com -t <key>
  dokploy profiles list
  dokploy profiles use prod
  dokploy --profile staging project list`,
	);
}
