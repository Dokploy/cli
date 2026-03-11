import { runCommand } from "@oclif/test";
import { expect } from "chai";

describe("app env push – command metadata", () => {
	it("shows description in --help output", async () => {
		const { stdout } = await runCommand(["app", "env", "push", "--help"]);
		expect(stdout).to.include("Push a .env file");
	});

	it("shows file argument in --help output", async () => {
		const { stdout } = await runCommand(["app", "env", "push", "--help"]);
		expect(stdout).to.include("file");
	});

	it("shows usage examples in --help output", async () => {
		const { stdout } = await runCommand(["app", "env", "push", "--help"]);
		expect(stdout).to.include(".env");
	});
});

describe("app env push – argument validation", () => {
	it("errors when no file argument is provided", async () => {
		const { error } = await runCommand(["app", "env", "push"]);
		expect(error?.message).to.include("file");
	});

	it("errors when the file does not exist", async () => {
		const { error } = await runCommand(["app", "env", "push", "non-existent-file.env"]);
		expect(error?.message).to.include("does not exist");
	});
});
