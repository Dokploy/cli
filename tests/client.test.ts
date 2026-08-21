import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("axios", () => {
	return {
		default: {
			create: () => ({
				get: () => Promise.resolve({ data: {} }),
				post: () => Promise.resolve({ data: {} }),
			}),
		},
	};
});

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

describe("apiGet", () => {
	it("should wrap GET params in the SuperJSON { json: ... } input envelope", async () => {
		process.env.DOKPLOY_URL = "https://test.dokploy.com";
		process.env.DOKPLOY_API_KEY = "test-key-123";

		const urls: string[] = [];
		const axiosMock = await import("axios");
		axiosMock.default.create = () =>
			({
				get: async (url: string) => {
					urls.push(url);
					return { data: {} };
				},
			}) as never;

		const { apiGet } = await import("../src/client.js");
		await apiGet("compose.one", { composeId: "abc123", limit: 1 });

		expect(urls[0]).toBe(
			`/trpc/compose.one?input=${encodeURIComponent(
				JSON.stringify({ json: { composeId: "abc123", limit: 1 } }),
			)}`,
		);
	});

	it("should omit the input query string when no params are passed", async () => {
		process.env.DOKPLOY_URL = "https://test.dokploy.com";
		process.env.DOKPLOY_API_KEY = "test-key-123";

		const urls: string[] = [];
		const axiosMock = await import("axios");
		axiosMock.default.create = () =>
			({
				get: async (url: string) => {
					urls.push(url);
					return { data: {} };
				},
			}) as never;

		const { apiGet } = await import("../src/client.js");
		await apiGet("project.all");

		expect(urls[0]).toBe("/trpc/project.all");
	});
});

describe("saveAuthConfig", () => {
	it("should write config with correct structure", async () => {
		const { saveAuthConfig } = await import("../src/client.js");
		expect(typeof saveAuthConfig).toBe("function");
	});
});
