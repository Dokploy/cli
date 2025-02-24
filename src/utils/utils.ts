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
	// Primero intentar leer desde variables de entorno
	const envToken = process.env.DOKPLOY_AUTH_TOKEN;
	const envUrl = process.env.DOKPLOY_URL;

	if (envToken && envUrl) {
		return { token: envToken, url: envUrl };
	}

	// Si no hay variables de entorno, usar el archivo de configuración
	if (!fs.existsSync(configPath)) {
		command.error(
			chalk.red(
				"No configuration file found and no environment variables set. Please authenticate first using the 'authenticate' command or set DOKPLOY_URL and DOKPLOY_AUTH_TOKEN environment variables.",
			),
		);
	}

	const configFileContent = fs.readFileSync(configPath, "utf8");
	const config = JSON.parse(configFileContent);
	const { token, url } = config;

	if (!url || !token) {
		command.error(
			chalk.red(
				"Incomplete authentication details. Please authenticate again using the 'authenticate' command or set environment variables.",
			),
		);
	}

	return { token, url };
};
