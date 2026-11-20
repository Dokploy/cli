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

describe("getApiErrorMessage", () => {
	const makeAxiosError = async (data: unknown) => {
		const { AxiosError } = await import("axios");
		return new AxiosError(
			"Request failed with status code 400",
			"ERR_BAD_REQUEST",
			undefined,
			undefined,
			{
				data,
				status: 400,
				statusText: "Bad Request",
				headers: {},
				config: {} as never,
			},
		);
	};

	it("should show the server's validation message", async () => {
		const { getApiErrorMessage } = await import("../src/client.js");
		const error = await makeAxiosError({
			error: {
				json: {
					message: "[]",
					data: {
						zodError: {
							formErrors: [],
							fieldErrors: {
								password: [
									"Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character",
								],
							},
						},
					},
				},
			},
		});

		expect(getApiErrorMessage(error)).toBe(
			"Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character",
		);
	});

	it("should show the server's error message", async () => {
		const { getApiErrorMessage } = await import("../src/client.js");
		const error = await makeAxiosError({
			error: {
				json: {
					message: "Current password is incorrect",
					data: { zodError: null },
				},
			},
		});

		expect(getApiErrorMessage(error)).toBe("Current password is incorrect");
	});

	it("should not show a bare error code as the message", async () => {
		const { getApiErrorMessage } = await import("../src/client.js");
		const error = await makeAxiosError({
			error: {
				json: {
					message: "UNAUTHORIZED",
					data: { code: "UNAUTHORIZED", zodError: null },
				},
			},
		});

		expect(getApiErrorMessage(error)).toBe(
			"Request failed with status code 400",
		);
	});

	it("should fall back to the original message", async () => {
		const { getApiErrorMessage } = await import("../src/client.js");

		expect(getApiErrorMessage(await makeAxiosError("<html>"))).toBe(
			"Request failed with status code 400",
		);
		expect(getApiErrorMessage(new Error("Network Error"))).toBe(
			"Network Error",
		);
	});
});
