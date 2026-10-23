import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("readAuthConfig", () => {
	const originalEnv = { ...process.env };

	beforeEach(() => {
		delete process.env.DOKPLOY_URL;
		delete process.env.DOKPLOY_API_KEY;
		delete process.env.DOKPLOY_AUTH_TOKEN;
	});

	afterEach(() => {
		process.env = { ...originalEnv };
		vi.restoreAllMocks();
	});

	it("should read from DOKPLOY_API_KEY env var", async () => {
		process.env.DOKPLOY_URL = "https://test.dokploy.com";
		process.env.DOKPLOY_API_KEY = "test-key-123";

		const { readAuthConfig } = await import("../src/client.js");
		const config = readAuthConfig();

		expect(config.url).toBe("https://test.dokploy.com");
		expect(config.token).toBe("test-key-123");
	});

	it("should read from DOKPLOY_AUTH_TOKEN env var as fallback", async () => {
		process.env.DOKPLOY_URL = "https://test.dokploy.com";
		process.env.DOKPLOY_AUTH_TOKEN = "auth-token-456";

		const { readAuthConfig } = await import("../src/client.js");
		const config = readAuthConfig();

		expect(config.url).toBe("https://test.dokploy.com");
		expect(config.token).toBe("auth-token-456");
	});

	it("should prefer DOKPLOY_API_KEY over DOKPLOY_AUTH_TOKEN", async () => {
		process.env.DOKPLOY_URL = "https://test.dokploy.com";
		process.env.DOKPLOY_API_KEY = "api-key";
		process.env.DOKPLOY_AUTH_TOKEN = "auth-token";

		const { readAuthConfig } = await import("../src/client.js");
		const config = readAuthConfig();

		expect(config.token).toBe("api-key");
	});
});

describe("saveAuthConfig", () => {
	it("should write a private config under the user config dir and read it back", async () => {
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dokploy-cfg-"));
		const originalEnv = { ...process.env };
		process.env.XDG_CONFIG_HOME = dir;
		delete process.env.DOKPLOY_URL;
		delete process.env.DOKPLOY_API_KEY;
		delete process.env.DOKPLOY_AUTH_TOKEN;

		try {
			const { saveAuthConfig, readAuthConfig, getConfigPath } = await import(
				"../src/client.js"
			);
			saveAuthConfig("https://x.dokploy.com", "tok");

			expect(getConfigPath()).toBe(path.join(dir, "dokploy", "config.json"));
			expect(fs.statSync(getConfigPath()).mode & 0o777).toBe(0o600);
			expect(readAuthConfig()).toEqual({
				url: "https://x.dokploy.com",
				token: "tok",
			});
		} finally {
			process.env = originalEnv;
			fs.rmSync(dir, { recursive: true, force: true });
		}
	});
});
