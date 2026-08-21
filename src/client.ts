import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import axios, { type AxiosInstance } from "axios";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const legacyConfigPath = path.join(__dirname, "..", "config.json");
const configDir =
	process.env.DOKPLOY_CONFIG_DIR ?? path.join(os.homedir(), ".dokploy");
const configPath = path.join(configDir, "config.json");

export interface AuthConfig {
	token: string;
	url: string;
}

interface StoredProfile extends AuthConfig {}

interface StoredConfig {
	currentProfile: string;
	profiles: Record<string, StoredProfile>;
}

export function getConfigPath(): string {
	return configPath;
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

function readStoredConfig(): StoredConfig | null {
	if (!fs.existsSync(configPath)) return null;
	try {
		return JSON.parse(fs.readFileSync(configPath, "utf8")) as StoredConfig;
	} catch {
		return null;
	}
}

function migrateLegacyConfig(): void {
	if (fs.existsSync(configPath)) return;
	if (!fs.existsSync(legacyConfigPath)) return;

	try {
		const legacy = JSON.parse(
			fs.readFileSync(legacyConfigPath, "utf8"),
		) as AuthConfig;
		if (legacy?.url && legacy?.token) {
			saveAuthConfig(legacy.url, legacy.token, "default");
			fs.renameSync(legacyConfigPath, `${legacyConfigPath}.bak`);
		}
	} catch {
		// ignore malformed legacy config
	}
}

export function getCurrentProfile(): string {
	const envProfile = process.env.DOKPLOY_PROFILE;
	if (envProfile) return envProfile;

	const config = readStoredConfig();
	if (config?.currentProfile) return config.currentProfile;

	return "default";
}

export function listProfiles(): { name: string; url: string }[] {
	migrateLegacyConfig();
	const config = readStoredConfig();
	if (!config) return [];
	return Object.entries(config.profiles).map(([name, profile]) => ({
		name,
		url: profile.url,
	}));
}

export function setCurrentProfile(name: string): void {
	const config = readStoredConfig() ?? {
		currentProfile: "default",
		profiles: {},
	};
	if (!config.profiles[name]) {
		throw new Error(
			`Profile '${name}' does not exist. Run 'dokploy auth --profile <name>' first.`,
		);
	}
	config.currentProfile = name;
	fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
	fs.writeFileSync(configPath, JSON.stringify(config, null, 2), {
		mode: 0o600,
	});
}

export function removeProfile(name: string): void {
	const config = readStoredConfig();
	if (!config?.profiles[name]) {
		throw new Error(`Profile '${name}' does not exist.`);
	}
	delete config.profiles[name];
	if (config.currentProfile === name) {
		const remaining = Object.keys(config.profiles);
		config.currentProfile = remaining[0] ?? "default";
	}
	fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
	fs.writeFileSync(configPath, JSON.stringify(config, null, 2), {
		mode: 0o600,
	});
}

export function readAuthConfig(profile?: string): AuthConfig {
	loadEnvFile();
	migrateLegacyConfig();

	const selectedProfile = profile ?? getCurrentProfile();
	const envToken =
		process.env.DOKPLOY_API_KEY ?? process.env.DOKPLOY_AUTH_TOKEN;
	const envUrl = process.env.DOKPLOY_URL;

	// Explicit profile selection takes priority, but allow env vars to
	// override when no profile is selected (backward compatible).
	if (!profile && envToken && envUrl) {
		return { token: envToken, url: envUrl };
	}

	const config = readStoredConfig();
	const stored = config?.profiles[selectedProfile];

	if (stored?.url && stored?.token) {
		return { url: stored.url, token: stored.token };
	}

	if (envToken && envUrl) {
		return { token: envToken, url: envUrl };
	}

	console.error(
		chalk.red(
			`No configuration found for profile '${selectedProfile}'. Run 'dokploy auth --profile ${selectedProfile} -u <url> -t <token>' or set DOKPLOY_URL and DOKPLOY_API_KEY environment variables.`,
		),
	);
	process.exit(1);
}

export function saveAuthConfig(
	url: string,
	token: string,
	profile = "default",
): void {
	const config = readStoredConfig() ?? {
		currentProfile: "default",
		profiles: {},
	};
	config.profiles[profile] = { url, token };
	if (
		config.currentProfile === "default" ||
		Object.keys(config.profiles).length === 1
	) {
		config.currentProfile = profile;
	}
	fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
	fs.writeFileSync(configPath, JSON.stringify(config, null, 2), {
		mode: 0o600,
	});
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
		`/trpc/${endpoint}`,
		data ? { json: data } : undefined,
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
	const response = await client.get(`/trpc/${endpoint}${query}`);
	return response.data?.result?.data?.json ?? response.data;
}
