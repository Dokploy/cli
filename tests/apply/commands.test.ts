import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { AxiosError } from "axios";
import chalk from "chalk";
import { Command } from "commander";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/client.js", () => ({
	apiGet: vi.fn(),
	apiPost: vi.fn(),
	readAuthConfig: () => ({ url: "https://dokploy.test", token: "token" }),
}));

import { apiGet, apiPost } from "../../src/client.js";
import { registerApplyCommand } from "../../src/commands/apply.js";
import { registerExportCommand } from "../../src/commands/export.js";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "dokploy-apply-"));
const file = path.join(dir, "dokploy.yaml");

const run = (...args: string[]) => {
	const program = new Command().exitOverride();
	registerApplyCommand(program);
	registerExportCommand(program);
	return program.parseAsync(["node", "dokploy", ...args]);
};

const remote: Record<string, unknown> = {
	"project.all": [
		{
			projectId: "p1",
			name: "demo",
			environments: [{ name: "production", applications: [] }],
		},
	],
	"project.one": {
		projectId: "p1",
		name: "demo",
		environments: [{ environmentId: "e1", name: "production" }],
	},
	"server.all": [],
	"gitProvider.getAll": [],
};

const serverError = (message: string) =>
	new AxiosError(
		"Request failed with status code 400",
		"ERR_BAD_REQUEST",
		undefined,
		undefined,
		{ status: 400, data: { error: { json: { message } } } } as any,
	);

chalk.level = 0;

describe("apply and export commands", () => {
	const output = () =>
		vi
			.mocked(console.log)
			.mock.calls.map((call) => call.join(" "))
			.join("\n");

	beforeEach(() => {
		vi.mocked(apiGet).mockReset();
		vi.mocked(apiPost).mockReset();
		vi.mocked(apiGet).mockImplementation(async (endpoint) => remote[endpoint]);
		vi.mocked(apiPost).mockImplementation(async () => ({}));
		vi.spyOn(console, "log").mockImplementation(() => {});
		vi.spyOn(console, "error").mockImplementation(() => {});
		vi.spyOn(process.stdout, "write").mockImplementation(() => true);
		vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
		fs.writeFileSync(
			file,
			"apiVersion: v1\nkind: Project\nname: demo\nenvironments:\n  - name: production\n    redis:\n      - name: cache\n        databasePassword: pw\n",
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("dry-run prints the plan and changes nothing", async () => {
		await run("apply", "-f", file, "--dry-run");

		expect(output()).toContain('Redis "cache"');
		expect(output()).toContain("[create]");
		expect(output()).toContain("(dry-run) No changes applied.");
		expect(apiPost).not.toHaveBeenCalled();
		expect(process.exit).not.toHaveBeenCalled();
	});

	it("applies and exits non-zero when a resource fails", async () => {
		vi.mocked(apiPost).mockRejectedValue(serverError("quota exceeded"));

		await run("apply", "-f", file);

		expect(output()).toContain('Redis "cache": quota exceeded');
		expect(process.exit).toHaveBeenCalledWith(1);
	});

	it("reports the server's message when planning fails", async () => {
		vi.mocked(apiGet).mockRejectedValue(serverError("UNAUTHORIZED"));

		await expect(run("apply", "-f", file)).rejects.toThrow("UNAUTHORIZED");
	});

	it("exports a project to a file", async () => {
		const out = path.join(dir, "out.yaml");

		await run("export", "-p", "demo", "-f", out);

		expect(fs.readFileSync(out, "utf8")).toContain("name: demo");
	});

	it("exports to stdout and rejects unknown projects", async () => {
		await run("export", "-p", "demo");
		expect(process.stdout.write).toHaveBeenCalledWith(
			expect.stringContaining("kind: Project"),
		);

		await expect(run("export", "-p", "nope")).rejects.toThrow(
			'Project "nope" not found. Available: demo',
		);
	});
});
