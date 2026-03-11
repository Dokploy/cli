import { runCommand } from "@oclif/test";
import { expect } from "chai";

describe("app add-domain – command metadata", () => {
	it("shows description in --help output", async () => {
		const { stdout } = await runCommand(["app", "add-domain", "--help"]);
		expect(stdout).to.include("Add a domain to an application");
	});

	it("mentions custom domain support in --help output", async () => {
		const { stdout } = await runCommand(["app", "add-domain", "--help"]);
		expect(stdout).to.include("custom");
	});

	it("mentions traefik.me domain support in --help output", async () => {
		const { stdout } = await runCommand(["app", "add-domain", "--help"]);
		expect(stdout).to.include("traefik.me");
	});

	it("mentions no SSL for traefik.me in --help output", async () => {
		const { stdout } = await runCommand(["app", "add-domain", "--help"]);
		expect(stdout).to.include("no SSL");
	});

	it("shows usage example in --help output", async () => {
		const { stdout } = await runCommand(["app", "add-domain", "--help"]);
		expect(stdout).to.include("app add-domain");
	});
});
