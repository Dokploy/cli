#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import { registerAuthCommand } from "./commands/auth.js";
import { registerGeneratedCommands } from "./generated/commands.js";

const pkg = { name: "dokploy", version: "0.3.0", description: "Dokploy CLI - Manage your Dokploy server" };

program
	.name(pkg.name)
	.version(pkg.version)
	.description(pkg.description);

registerAuthCommand(program);
registerGeneratedCommands(program);

program.parseAsync(process.argv).catch((err) => {
	console.error(chalk.red(err.message));
	process.exit(1);
});
