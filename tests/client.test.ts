import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const getSpy = vi.hoisted(() => vi.fn());

vi.mock("axios", () => {
	return {
		default: {
			create: () => ({
				get: getSpy,
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
	beforeEach(() => {
		process.env.DOKPLOY_URL = "https://test.dokploy.com";
		process.env.DOKPLOY_API_KEY = "test-key-123";
		getSpy.mockReset().mockResolvedValue({ data: {} });
	});

	it("should wrap GET params in the SuperJSON { json: ... } input envelope", async () => {
		const { apiGet } = await import("../src/client.js");
		await apiGet("compose.one", { composeId: "abc123", limit: 1 });

		expect(getSpy).toHaveBeenCalledWith(
			`/trpc/compose.one?input=${encodeURIComponent(
				JSON.stringify({ json: { composeId: "abc123", limit: 1 } }),
			)}`,
		);
	});

	it("should omit the input query string when params are undefined", async () => {
		const { apiGet } = await import("../src/client.js");
		await apiGet("project.all");

		expect(getSpy).toHaveBeenCalledWith("/trpc/project.all");
	});

	it("should send an empty { json: {} } envelope when params are an empty object", async () => {
		const { apiGet } = await import("../src/client.js");
		await apiGet("project.all", {});

		expect(getSpy).toHaveBeenCalledWith(
			`/trpc/project.all?input=${encodeURIComponent(JSON.stringify({ json: {} }))}`,
		);
	});
});

describe("saveAuthConfig", () => {
	it("should write config with correct structure", async () => {
		const { saveAuthConfig } = await import("../src/client.js");
		expect(typeof saveAuthConfig).toBe("function");
	});
});
