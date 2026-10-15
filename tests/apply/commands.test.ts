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
		env: "SHARED=1",
		environments: [
			{ environmentId: "e1", name: "production" },
			{ environmentId: "e2", name: "preview" },
		],
	},
	"server.all": [],
	"gitProvider.getAll": [],
	"sshKey.all": [],
	"destination.all": [],
	"registry.all": [],
	"certificates.all": [],
	"notification.all": [],
	"vaultProvider.all": [],
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

	it("writes env only with --include-env", async () => {
		const out = path.join(dir, "env.yaml");

		await run("export", "-p", "demo", "-f", out);
		expect(fs.readFileSync(out, "utf8")).not.toContain("SHARED=1");

		fs.chmodSync(out, 0o644);
		await run("export", "-p", "demo", "-f", out, "--include-env");
		expect(fs.readFileSync(out, "utf8")).toContain("env: SHARED=1");
		expect(fs.statSync(out).mode & 0o777).toBe(0o600);
	});

	it("lists deletions with --prune and leaves them out otherwise", async () => {
		await run("apply", "-f", file, "--dry-run");
		expect(output()).not.toContain('Environment "preview"');

		await run("apply", "-f", file, "--dry-run", "--prune");
		expect(output()).toMatch(/Environment "preview"\s+\[delete\]/);
		expect(apiPost).not.toHaveBeenCalled();
	});

	it("exports a project by id", async () => {
		await run("export", "-p", "p1");

		expect(process.stdout.write).toHaveBeenCalledWith(
			expect.stringContaining("name: demo"),
		);
	});

	it("exports the organization and every project with --all", async () => {
		await run("export", "--all");

		const [yaml] = vi.mocked(process.stdout.write).mock.calls[0];
		expect(yaml).toContain("kind: Organization");
		expect(yaml).toContain("---\napiVersion: v1\nkind: Project\nname: demo");
	});

	it("needs exactly one of --project and --all", async () => {
		await expect(run("export")).rejects.toThrow(
			"Pass --project <id or name>, or --all",
		);
		await expect(run("export", "-p", "demo", "--all")).rejects.toThrow(
			"Use either --project or --all, not both",
		);
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
