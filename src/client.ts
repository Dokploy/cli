import axios, { type AxiosInstance } from "axios";
import chalk from "chalk";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.join(__dirname, "..", "config.json");

export interface AuthConfig {
	token: string;
	url: string;
}

export function readAuthConfig(): AuthConfig {
	const envToken = process.env.DOKPLOY_AUTH_TOKEN;
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

export async function apiPost(endpoint: string, data?: Record<string, unknown>) {
	const client = createClient();
	const response = await client.post(`/trpc/${endpoint}`, data ? { json: data } : undefined);
	return response.data?.result?.data?.json ?? response.data;
}

export async function apiGet(endpoint: string, params?: Record<string, unknown>) {
	const client = createClient();
	const query = params
		? `?input=${encodeURIComponent(JSON.stringify(params))}`
		: "";
	const response = await client.get(`/trpc/${endpoint}${query}`);
	return response.data?.result?.data?.json ?? response.data;
}
