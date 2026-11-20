#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { program } from "commander";
import { peekServerUrl } from "./client.js";
import { registerAuthCommand } from "./commands/auth.js";
import { registerGeneratedCommands } from "./generated/commands.js";
import { printError } from "./ui/errors.js";
import { setQuiet, stopSpinner } from "./ui/spinner.js";
import { color, isInteractive, symbols } from "./ui/style.js";

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
	.action(() => {
		program.help();
	});

program.configureHelp({
	styleTitle: (str) => color.strong(str),
	styleCommandText: (str) => color.accent(str),
	styleSubcommandText: (str) => color.accent(str),
	styleArgumentText: (str) => color.muted(str),
});

program.configureOutput({
	outputError: (str, write) =>
		write(process.stderr.isTTY ? color.danger(str) : str),
});

program.addHelpText("before", () => {
	if (!isInteractive()) return "";
	const server = peekServerUrl();
	const status = server
		? `${color.success(symbols.dot)} ${color.muted("Connected to")} ${server}`
		: `${color.muted(symbols.dot)} ${color.muted("Not connected. Run: dokploy auth --url <server-url> --token <api-key>")}`;
	return `\n  ${color.strong("Dokploy CLI")} ${color.muted(`v${pkg.version}`)}\n  ${status}\n`;
});

program.hook("preAction", (_thisCommand, actionCommand) => {
	setQuiet(Boolean(actionCommand.opts().json));
});

registerAuthCommand(program);
registerGeneratedCommands(program);

const argv = process.argv.filter((arg) => arg !== "--");

program.parseAsync(argv).catch((err) => {
	stopSpinner();
	printError(err);
	process.exit(1);
});
