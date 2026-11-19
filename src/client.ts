import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import axios, { type AxiosInstance } from "axios";
import chalk from "chalk";
import { printFriendlyError } from "./ui/errors.js";
import { setCurrentEndpoint, spinnerLabel } from "./ui/presenters.js";
import { withSpinner } from "./ui/spinner.js";
import { canAnimate } from "./ui/style.js";

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
		const value = trimmed
			.slice(eqIndex + 1)
			.trim()
			.replace(/^["']|["']$/g, "");
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
		if (canAnimate()) {
			printFriendlyError({
				title: "Not connected to a Dokploy server",
				details: [],
				hints: [
					"Run: dokploy auth --url <server-url> --token <api-key>",
					"Or set DOKPLOY_URL and DOKPLOY_API_KEY in your environment or a .env file.",
				],
			});
		} else {
			console.error(
				chalk.red(
					"No configuration found. Please run 'dokploy auth' first or set DOKPLOY_URL and DOKPLOY_AUTH_TOKEN environment variables.",
				),
			);
		}
		process.exit(1);
	}

	const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
	const { token, url } = config;

	if (!url || !token) {
		if (canAnimate()) {
			printFriendlyError({
				title: "Saved credentials are incomplete",
				details: [],
				hints: ["Run: dokploy auth --url <server-url> --token <api-key>"],
			});
		} else {
			console.error(
				chalk.red(
					"Incomplete auth config. Run 'dokploy auth' or set environment variables.",
				),
			);
		}
		process.exit(1);
	}

	return { token, url };
}

export function peekServerUrl(): string | null {
	try {
		// Same order as readAuthConfig: env only when both URL and key are set.
		loadEnvFile();
		const envToken =
			process.env.DOKPLOY_API_KEY ?? process.env.DOKPLOY_AUTH_TOKEN;
		if (envToken && process.env.DOKPLOY_URL) return process.env.DOKPLOY_URL;
		if (!fs.existsSync(configPath)) return null;
		const { url, token } = JSON.parse(fs.readFileSync(configPath, "utf8"));
		return typeof url === "string" && url && token ? url : null;
	} catch {
		return null;
	}
}

export function getConfigPath(): string {
	return configPath;
}

function activityLabel(endpoint: string): string {
	setCurrentEndpoint(endpoint);
	const custom = spinnerLabel(endpoint);
	if (custom) return custom;
	const kebab = (s: string) =>
		s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
	const [group = "", ...rest] = endpoint.split(".");
	return `${kebab(group)} ${kebab(rest.join("."))}`.trim();
}

export function saveAuthConfig(url: string, token: string): void {
	fs.writeFileSync(configPath, JSON.stringify({ url, token }, null, 2));
}

export function extractApiErrorMessage(data: unknown): string | undefined {
	const d = data as any;
	const message = d?.error?.json?.message ?? d?.error?.message ?? d?.message;
	return typeof message === "string" && message ? message : undefined;
}

export function createClient(): AxiosInstance {
	const auth = readAuthConfig();
	const client = axios.create({
		baseURL: `${auth.url}/api`,
		headers: {
			"x-api-key": auth.token,
			"Content-Type": "application/json",
		},
	});
	client.interceptors.response.use(undefined, (error) => {
		const detail = extractApiErrorMessage(error?.response?.data);
		if (detail) error.message = `${error.message}: ${detail}`;
		return Promise.reject(error);
	});
	return client;
}

export async function apiPost(
	endpoint: string,
	data?: Record<string, unknown>,
) {
	const client = createClient();
	const response = await withSpinner(activityLabel(endpoint), () =>
		client.post(`/trpc/${endpoint}`, data ? { json: data } : undefined),
	);
	return response.data?.result?.data?.json ?? response.data;
}

export async function apiGet(
	endpoint: string,
	params?: Record<string, unknown>,
) {
	const client = createClient();
	const query = params
		? `?input=${encodeURIComponent(JSON.stringify(params))}`
		: "";
	const response = await withSpinner(activityLabel(endpoint), () =>
		client.get(`/trpc/${endpoint}${query}`),
	);
	return response.data?.result?.data?.json ?? response.data;
}
