import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import { describeError } from "../src/ui/errors.js";

const config = {
	baseURL: "https://panel.example.com/api",
	headers: new AxiosHeaders(),
};

function httpError(status: number, data: unknown) {
	return new AxiosError(
		`Request failed with status code ${status}`,
		AxiosError.ERR_BAD_REQUEST,
		config,
		{},
		{ status, statusText: "", headers: {}, config, data },
	);
}

describe("describeError", () => {
	it("explains a rejected API key", () => {
		const err = httpError(401, {
			error: {
				json: {
					message: "Unauthorized",
					data: { code: "UNAUTHORIZED", httpStatus: 401 },
				},
			},
		});
		const friendly = describeError(err);
		expect(friendly.title).toBe("Not authorized");
		expect(friendly.status).toBe(401);
		expect(friendly.details).toEqual(["Unauthorized"]);
		expect(friendly.hints.join(" ")).toContain("dokploy auth");
	});

	it("shows the server's own message", () => {
		const err = httpError(404, {
			error: { json: { message: "Application not found", data: {} } },
		});
		const friendly = describeError(err);
		expect(friendly.title).toBe("Not found");
		expect(friendly.details).toEqual(["Application not found"]);
		expect(friendly.hints).toEqual([]);
	});

	it("turns validation errors into flag names", () => {
		const issues = [
			{ path: ["environmentId"], message: "Required" },
			{
				path: ["name"],
				message: "String must contain at least 1 character(s)",
			},
		];
		const err = httpError(400, {
			error: { json: { message: JSON.stringify(issues), data: {} } },
		});
		const friendly = describeError(err);
		expect(friendly.title).toBe("Invalid request");
		expect(friendly.details).toEqual([
			"--environmentId: Required",
			"--name: String must contain at least 1 character(s)",
		]);
	});

	it("prefers zod field errors when the server sends them", () => {
		const err = httpError(400, {
			error: {
				json: {
					message: "[]",
					data: { zodError: { fieldErrors: { applicationId: ["Required"] } } },
				},
			},
		});
		expect(describeError(err).details).toEqual(["--applicationId: Required"]);
	});

	it("explains a missing endpoint", () => {
		const friendly = describeError(httpError(404, "<html>Not Found</html>"));
		expect(friendly.hints.join(" ")).toContain("panel.example.com");
	});

	it("explains network failures by host", () => {
		const err = new AxiosError("connect ECONNREFUSED", "ECONNREFUSED", config);
		const friendly = describeError(err);
		expect(friendly.title).toBe("Could not connect to panel.example.com");
		expect(friendly.hints[0]).toContain("server is running");
	});

	it("passes plain errors through", () => {
		expect(describeError(new Error("boom")).title).toBe("boom");
	});
});
