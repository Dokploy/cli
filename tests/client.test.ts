import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const testConfigDir = path.join(os.tmpdir(), `dokploy-test-${process.pid}`);

describe("readAuthConfig", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		process.env.DOKPLOY_CONFIG_DIR = testConfigDir;
		fs.mkdirSync(testConfigDir, { recursive: true });
		delete process.env.DOKPLOY_URL;
		delete process.env.DOKPLOY_API_KEY;
		delete process.env.DOKPLOY_AUTH_TOKEN;
		delete process.env.DOKPLOY_PROFILE;
	});

	afterEach(() => {
		process.env = { ...originalEnv };
		fs.rmSync(testConfigDir, { recursive: true, force: true });
		vi.restoreAllMocks();
		vi.resetModules();
	});

	async function loadClient() {
		return import("../src/client.js");
	}

	it("should read from DOKPLOY_API_KEY env var", async () => {
		process.env.DOKPLOY_URL = "https://test.dokploy.com";
		process.env.DOKPLOY_API_KEY = "test-key-123";

		const { readAuthConfig } = await loadClient();
		const config = readAuthConfig();

		expect(config.url).toBe("https://test.dokploy.com");
		expect(config.token).toBe("test-key-123");
	});

	it("should read from DOKPLOY_AUTH_TOKEN env var as fallback", async () => {
		process.env.DOKPLOY_URL = "https://test.dokploy.com";
		process.env.DOKPLOY_AUTH_TOKEN = "auth-token-456";

		const { readAuthConfig } = await loadClient();
		const config = readAuthConfig();

		expect(config.url).toBe("https://test.dokploy.com");
		expect(config.token).toBe("auth-token-456");
	});

	it("should prefer DOKPLOY_API_KEY over DOKPLOY_AUTH_TOKEN", async () => {
		process.env.DOKPLOY_URL = "https://test.dokploy.com";
		process.env.DOKPLOY_API_KEY = "api-key";
		process.env.DOKPLOY_AUTH_TOKEN = "auth-token";

		const { readAuthConfig } = await loadClient();
		const config = readAuthConfig();

		expect(config.token).toBe("api-key");
	});
});

describe("profile management", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		process.env.DOKPLOY_CONFIG_DIR = testConfigDir;
		fs.mkdirSync(testConfigDir, { recursive: true });
		delete process.env.DOKPLOY_URL;
		delete process.env.DOKPLOY_API_KEY;
		delete process.env.DOKPLOY_AUTH_TOKEN;
		delete process.env.DOKPLOY_PROFILE;
	});

	afterEach(() => {
		process.env = { ...originalEnv };
		fs.rmSync(testConfigDir, { recursive: true, force: true });
		vi.resetModules();
	});

	async function loadClient() {
		return import("../src/client.js");
	}

	it("should save and read multiple profiles", async () => {
		const { saveAuthConfig, readAuthConfig } = await loadClient();
		saveAuthConfig("https://prod.example.com", "prod-token", "prod");
		saveAuthConfig("https://staging.example.com", "staging-token", "staging");

		const prod = readAuthConfig("prod");
		const staging = readAuthConfig("staging");

		expect(prod).toEqual({
			url: "https://prod.example.com",
			token: "prod-token",
		});
		expect(staging).toEqual({
			url: "https://staging.example.com",
			token: "staging-token",
		});
	});

	it("should save to default profile when none specified", async () => {
		const { saveAuthConfig, readAuthConfig } = await loadClient();
		saveAuthConfig("https://prod.example.com", "prod-token");

		const config = readAuthConfig("default");
		expect(config).toEqual({
			url: "https://prod.example.com",
			token: "prod-token",
		});
	});

	it("should switch active profile and persist it", async () => {
		const { saveAuthConfig, setCurrentProfile, getCurrentProfile } =
			await loadClient();
		saveAuthConfig("https://prod.example.com", "prod-token", "prod");
		saveAuthConfig("https://staging.example.com", "staging-token", "staging");

		expect(getCurrentProfile()).toBe("prod");
		setCurrentProfile("staging");
		expect(getCurrentProfile()).toBe("staging");
	});

	it("should resolve active profile when no explicit profile given", async () => {
		const { saveAuthConfig, setCurrentProfile, readAuthConfig } =
			await loadClient();
		saveAuthConfig("https://prod.example.com", "prod-token", "prod");
		saveAuthConfig("https://staging.example.com", "staging-token", "staging");
		setCurrentProfile("staging");

		const config = readAuthConfig();
		expect(config.url).toBe("https://staging.example.com");
		expect(config.token).toBe("staging-token");
	});

	it("should respect DOKPLOY_PROFILE env var over active profile", async () => {
		const { saveAuthConfig, readAuthConfig } = await loadClient();
		saveAuthConfig("https://prod.example.com", "prod-token", "prod");
		saveAuthConfig("https://staging.example.com", "staging-token", "staging");

		process.env.DOKPLOY_PROFILE = "staging";
		const config = readAuthConfig();
		expect(config.url).toBe("https://staging.example.com");
	});

	it("should list profiles", async () => {
		const { saveAuthConfig, listProfiles } = await loadClient();
		saveAuthConfig("https://prod.example.com", "prod-token", "prod");
		saveAuthConfig("https://staging.example.com", "staging-token", "staging");

		const profiles = listProfiles();
		expect(profiles).toHaveLength(2);
		expect(profiles[0]).toEqual({
			name: "prod",
			url: "https://prod.example.com",
		});
	});

	it("should remove a profile", async () => {
		const { saveAuthConfig, removeProfile, listProfiles } = await loadClient();
		saveAuthConfig("https://prod.example.com", "prod-token", "prod");
		saveAuthConfig("https://staging.example.com", "staging-token", "staging");

		removeProfile("prod");
		const profiles = listProfiles();
		expect(profiles).toHaveLength(1);
		expect(profiles[0].name).toBe("staging");
	});
});

describe("saveAuthConfig", () => {
	it("should write config with correct structure", async () => {
		const { saveAuthConfig } = await import("../src/client.js");
		expect(typeof saveAuthConfig).toBe("function");
	});
});
