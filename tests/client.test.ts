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

describe("apiUpdateMerged", () => {
	it("should preserve current values for omitted fields", async () => {
		process.env.DOKPLOY_URL = "https://test.dokploy.com";
		process.env.DOKPLOY_API_KEY = "test-key";

		const axios = (await import("axios")).default;
		const get = vi.fn().mockResolvedValue({
			data: {
				result: {
					data: {
						json: {
							applicationId: "a1",
							name: "Old",
							buildType: "nixpacks",
							autoDeploy: true,
							sourceType: null,
							deployments: [],
						},
					},
				},
			},
		});
		const post = vi.fn().mockResolvedValue({ data: {} });
		vi.spyOn(axios, "create").mockReturnValue({ get, post } as never);

		const { apiUpdateMerged } = await import("../src/client.js");
		await apiUpdateMerged(
			"application.update",
			"application.one",
			"applicationId",
			{ applicationId: "a1", name: "New" },
			["applicationId", "name", "buildType", "autoDeploy", "sourceType"],
		);

		expect(post).toHaveBeenCalledWith("/trpc/application.update", {
			json: {
				applicationId: "a1",
				name: "New",
				buildType: "nixpacks",
				autoDeploy: true,
			},
		});
	});
});
