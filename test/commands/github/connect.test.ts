import { expect } from "chai";
import { runCommand } from "@oclif/test";
import { buildRedirectPage } from "../../../src/commands/github/connect.js";

describe("github connect – buildRedirectPage", () => {
	it("returns valid HTML with the correct DOCTYPE", () => {
		const html = buildRedirectPage("https://github.com/settings/apps/new", "{}");
		expect(html).to.include("<!DOCTYPE html>");
	});

	it("sets the form action to the provided URL", () => {
		const action = "https://github.com/settings/apps/new?state=gh_init:org1:user1";
		const html = buildRedirectPage(action, "{}");
		expect(html).to.include(`action="${action}"`);
	});

	it("uses POST as the form method", () => {
		const html = buildRedirectPage("https://example.com", "{}");
		expect(html).to.include('method="post"');
	});

	it("includes a hidden manifest input with the given value", () => {
		const manifest = "{&quot;name&quot;:&quot;my-app&quot;}";
		const html = buildRedirectPage("https://example.com", manifest);
		expect(html).to.include('name="manifest"');
		expect(html).to.include(`value="${manifest}"`);
	});

	it("includes a self-submitting script", () => {
		const html = buildRedirectPage("https://example.com", "{}");
		expect(html).to.include('document.getElementById("f").submit()');
	});

	it("includes the redirect notice paragraph", () => {
		const html = buildRedirectPage("https://example.com", "{}");
		expect(html).to.include("Redirecting to GitHub");
	});
});

describe("github connect – command metadata", () => {
	it("shows description in --help output", async () => {
		const { stdout } = await runCommand(["github", "connect", "--help"]);
		expect(stdout).to.include("Connect a GitHub account");
	});

	it("shows --org flag in --help output", async () => {
		const { stdout } = await runCommand(["github", "connect", "--help"]);
		expect(stdout).to.include("--org");
	});
});
