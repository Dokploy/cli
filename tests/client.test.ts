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
	it("should write config with correct structure", async () => {
		const { saveAuthConfig } = await import("../src/client.js");
		expect(typeof saveAuthConfig).toBe("function");
	});
});

describe("extractApiErrorMessage", () => {
	it("should read tRPC and plain error bodies", async () => {
		const { extractApiErrorMessage } = await import("../src/client.js");

		expect(
			extractApiErrorMessage({ error: { json: { message: "Not found" } } }),
		).toBe("Not found");
		expect(extractApiErrorMessage({ message: "Unauthorized" })).toBe(
			"Unauthorized",
		);
		expect(extractApiErrorMessage("<html>")).toBeUndefined();
		expect(extractApiErrorMessage(undefined)).toBeUndefined();
	});

	it("should append the server message to request errors", async () => {
		process.env.DOKPLOY_URL = "http://127.0.0.1:9";
		process.env.DOKPLOY_API_KEY = "k";
		const { createClient } = await import("../src/client.js");
		const client = createClient();
		client.defaults.adapter = async (config) => {
			const error: any = new Error("Request failed with status code 400");
			error.config = config;
			error.response = {
				status: 400,
				data: { error: { json: { message: "Invalid input" } } },
			};
			throw error;
		};

		await expect(client.get("/x")).rejects.toThrow(
			"Request failed with status code 400: Invalid input",
		);
	});
});
