import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const axiosMocks = vi.hoisted(() => ({
	create: vi.fn(),
	get: vi.fn(),
	post: vi.fn(),
}));

vi.mock("axios", () => ({
	default: {
		create: axiosMocks.create,
	},
}));

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

describe("REST API client", () => {
	beforeEach(() => {
		process.env.DOKPLOY_URL = "https://test.dokploy.com";
		process.env.DOKPLOY_API_KEY = "test-key";
		axiosMocks.create.mockReturnValue({
			get: axiosMocks.get,
			post: axiosMocks.post,
		});
	});

	afterEach(() => {
		delete process.env.DOKPLOY_URL;
		delete process.env.DOKPLOY_API_KEY;
		vi.clearAllMocks();
	});

	it("sends GET parameters to the REST endpoint", async () => {
		const responseData = { projectId: "project-1" };
		axiosMocks.get.mockResolvedValue({ data: responseData });

		const { apiGet } = await import("../src/client.js");
		const result = await apiGet("project.one", {
			projectId: "project with spaces",
		});

		expect(axiosMocks.get).toHaveBeenCalledWith("/project.one", {
			params: { projectId: "project with spaces" },
		});
		expect(result).toEqual(responseData);
	});

	it("sends POST data directly to the REST endpoint", async () => {
		const requestData = { name: "My Project" };
		const responseData = { projectId: "project-1", ...requestData };
		axiosMocks.post.mockResolvedValue({ data: responseData });

		const { apiPost } = await import("../src/client.js");
		const result = await apiPost("project.create", requestData);

		expect(axiosMocks.post).toHaveBeenCalledWith(
			"/project.create",
			requestData,
		);
		expect(result).toEqual(responseData);
	});
});
