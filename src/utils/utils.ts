import type { Command } from "@oclif/core";

import chalk from "chalk";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "..", "..", "config.json");

export type AuthConfig = {
	token: string;
	url: string;
};

export const readAuthConfig = async (command: Command): Promise<AuthConfig> => {
	if (!fs.existsSync(configPath)) {
		command.error(
			chalk.red(
				"No configuration file found. Please authenticate first using the 'authenticate' command.",
			),
		);
	}

	const configFileContent = fs.readFileSync(configPath, "utf8");
	const config = JSON.parse(configFileContent);
	const { token, url } = config;

	if (!url || !token) {
		command.error(
			chalk.red(
				"Incomplete authentication details. Please authenticate again using the 'authenticate' command.",
			),
		);
	}

	return { token, url };
};
