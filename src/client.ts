import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import axios, { type AxiosInstance } from "axios";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "..", "config.json");

export interface AuthConfig {
	token: string;
	url: string;
}

function loadEnvFile(): void {
	const envPath = path.resolve(process.cwd(), ".env");
	if (!fs.existsSync(envPath)) return;

	const content = fs.readFileSync(envPath, "utf8");
	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eqIndex = trimmed.indexOf("=");
		if (eqIndex === -1) continue;
		const key = trimmed.slice(0, eqIndex).trim();
		const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
		if (!process.env[key]) {
			process.env[key] = value;
		}
	}
}

export function readAuthConfig(): AuthConfig {
	loadEnvFile();

	const envToken =
		process.env.DOKPLOY_API_KEY ?? process.env.DOKPLOY_AUTH_TOKEN;
	const envUrl = process.env.DOKPLOY_URL;

	if (envToken && envUrl) {
		return { token: envToken, url: envUrl };
	}

	if (!fs.existsSync(configPath)) {
		console.error(
			chalk.red(
				"No configuration found. Please run 'dokploy auth' first or set DOKPLOY_URL and DOKPLOY_AUTH_TOKEN environment variables.",
			),
		);
		process.exit(1);
	}

	const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
	const { token, url } = config;

	if (!url || !token) {
		console.error(
			chalk.red(
				"Incomplete auth config. Run 'dokploy auth' or set environment variables.",
			),
		);
		process.exit(1);
	}

	return { token, url };
}

export function saveAuthConfig(url: string, token: string): void {
	fs.writeFileSync(configPath, JSON.stringify({ url, token }, null, 2));
}

export function createClient(): AxiosInstance {
	const auth = readAuthConfig();
	return axios.create({
		baseURL: `${auth.url}/api`,
		headers: {
			"x-api-key": auth.token,
			"Content-Type": "application/json",
		},
	});
}

export async function apiPost(
	endpoint: string,
	data?: Record<string, unknown>,
) {
	const client = createClient();
	const response = await client.post(
		`/${endpoint}`,
		data,
	);
	return response.data;
}

export async function apiGet(
	endpoint: string,
	params?: Record<string, unknown>,
) {
	const client = createClient();
	const query = Object
		.entries(params ?? {})
		.map(([key, value]) => `${key}=${value}`)
		.join('&')
	const response = await client.get(`/${endpoint}?${query}`);
	return response.data;
}
