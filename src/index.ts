#!/usr/bin/env node

import { readFileSync } from "node:fs";
import chalk from "chalk";
import { program } from "commander";
import { registerAuthCommand } from "./commands/auth.js";
import { registerProfileCommands } from "./commands/profile.js";
import { registerGeneratedCommands } from "./generated/commands.js";

const packageJson = JSON.parse(
	readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };

const pkg = {
	name: "dokploy",
	version: packageJson.version,
	description: "Dokploy CLI - Manage your Dokploy server",
};

program
	.name(pkg.name)
	.version(pkg.version)
	.description(pkg.description)
	.enablePositionalOptions()
	.option("--profile <name>", "Profile to use (overrides active profile)")
	.action(() => {
		program.help();
	});

program.hook("preAction", (_thisCommand) => {
	const rootOpts = program.opts() as { profile?: string };
	if (rootOpts.profile) {
		process.env.DOKPLOY_PROFILE = rootOpts.profile;
	}
});

registerAuthCommand(program);
registerProfileCommands(program);
registerGeneratedCommands(program);

const argv = process.argv.filter((arg) => arg !== "--");

program.parseAsync(argv).catch((err) => {
	console.error(chalk.red(err.message));
	process.exit(1);
});
