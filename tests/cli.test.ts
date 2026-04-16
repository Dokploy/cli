import { execFileSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CLI = path.join(ROOT, "dist", "index.js");

function run(...args: string[]): string {
	return execFileSync("node", [CLI, ...args], {
		encoding: "utf8",
		env: { ...process.env, NO_COLOR: "1" },
	});
}

describe("CLI", () => {
	it("should show help with --help", () => {
		const output = run("--help");
		expect(output).toContain("Dokploy CLI");
		expect(output).toContain("auth");
		expect(output).toContain("application");
		expect(output).toContain("project");
	});

	it("should show version with --version", () => {
		const output = run("--version");
		expect(output.trim()).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it("should show subcommands for application", () => {
		const output = run("application", "--help");
		expect(output).toContain("create");
		expect(output).toContain("deploy");
		expect(output).toContain("delete");
		expect(output).toContain("stop");
	});

	it("should show subcommands for postgres", () => {
		const output = run("postgres", "--help");
		expect(output).toContain("create");
		expect(output).toContain("deploy");
		expect(output).toContain("remove");
	});

	it("should show options for a specific command", () => {
		const output = run("application", "create", "--help");
		expect(output).toContain("--name");
		expect(output).toContain("--environmentId");
	});

	it("should show auth command options", () => {
		const output = run("auth", "--help");
		expect(output).toContain("--url");
		expect(output).toContain("--token");
	});

	it("should show all expected command groups", () => {
		const output = run("--help");
		const expectedGroups = [
			"application",
			"postgres",
			"mysql",
			"redis",
			"mongo",
			"mariadb",
			"compose",
			"docker",
			"project",
			"server",
			"domain",
			"backup",
			"settings",
			"user",
			"environment",
		];
		for (const group of expectedGroups) {
			expect(output).toContain(group);
		}
	});

	it("should exit with 0 when no args provided", () => {
		const output = run();
		expect(output).toContain("Usage:");
	});
});
