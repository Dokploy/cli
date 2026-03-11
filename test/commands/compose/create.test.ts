import { runCommand } from "@oclif/test";
import { expect } from "chai";

describe("compose create – command metadata", () => {
	it("shows description in --help output", async () => {
		const { stdout } = await runCommand(["compose", "create", "--help"]);
		expect(stdout).to.include("Docker Compose");
	});

	it("shows --name flag in --help output", async () => {
		const { stdout } = await runCommand(["compose", "create", "--help"]);
		expect(stdout).to.include("--name");
	});

	it("shows --composeType flag with options in --help output", async () => {
		const { stdout } = await runCommand(["compose", "create", "--help"]);
		expect(stdout).to.include("--composeType");
		expect(stdout).to.include("docker-compose");
		expect(stdout).to.include("stack");
	});

	it("shows --environmentId flag in --help output", async () => {
		const { stdout } = await runCommand(["compose", "create", "--help"]);
		expect(stdout).to.include("--environmentId");
	});

	it("shows --skipConfirm flag in --help output", async () => {
		const { stdout } = await runCommand(["compose", "create", "--help"]);
		expect(stdout).to.include("--skipConfirm");
	});

	it("shows usage examples in --help output", async () => {
		const { stdout } = await runCommand(["compose", "create", "--help"]);
		expect(stdout).to.include("compose create");
	});
});

describe("compose create – flag validation", () => {
	it("rejects an invalid --composeType value", async () => {
		const { error } = await runCommand(["compose", "create", "--composeType", "invalid"]);
		expect(error?.message).to.include("invalid");
	});
});
