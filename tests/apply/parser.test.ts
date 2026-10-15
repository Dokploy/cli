import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
	ConfigParseError,
	parseConfigFile,
	parseDocuments,
} from "../../src/lib/apply/parser.js";

const ROOT = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../..",
);

const project = (environment: string) =>
	`apiVersion: v1\nkind: Project\nname: demo\nenvironments:\n${environment}`;

const organization = (body: string) =>
	`apiVersion: v1\nkind: Organization\n${body}`;

describe("parseDocuments", () => {
	it("accepts the bundled example", async () => {
		const [settings, config] = await parseConfigFile(
			path.join(ROOT, "examples", "dokploy.yaml"),
		);
		expect(settings.kind).toBe("Organization");
		expect(config.kind === "Project" && config.environments[0]).toMatchObject({
			applications: [expect.objectContaining({ name: "web-api" })],
			postgres: [expect.objectContaining({ databaseName: "myapp" })],
		});
	});

	it("reads several documents from one file", () => {
		const documents = parseDocuments(
			`${organization("destinations:\n  - name: r2\n")}---\n${project("  - name: production\n")}`,
		);

		expect(documents.map((document) => document.kind)).toEqual([
			"Organization",
			"Project",
		]);
	});

	it("rejects a second Organization document and repeated projects", () => {
		expect(() =>
			parseDocuments(`${organization("")}---\n${organization("")}`),
		).toThrow("Only one Organization document is allowed per file");
		expect(() =>
			parseDocuments(
				`${project("  - name: production\n")}---\n${project("  - name: staging\n")}`,
			),
		).toThrow('Project "demo" is declared more than once');
	});

	it("checks notification and secret manager fields against their type", () => {
		expect(() =>
			parseDocuments(
				organization(
					"notifications:\n  - name: alerts\n    type: telegram\n    webhookUrl: https://x\n",
				),
			),
		).toThrow(/notifications\.0: Unrecognized key: "webhookUrl"/);
		expect(() =>
			parseDocuments(
				organization(
					"vaultProviders:\n  - name: vault\n    providerType: doppler\n    url: https://x\n",
				),
			),
		).toThrow(/vaultProviders\.0: Unrecognized key: "url"/);
	});

	it("rejects an empty file", () => {
		expect(() => parseDocuments("")).toThrow("Config file has no documents");
	});

	it("rejects unknown keys so typos are not silently ignored", () => {
		expect(() =>
			parseDocuments(
				project(
					"  - name: production\n    applications:\n      - name: web\n        dockerImg: nginx\n",
				),
			),
		).toThrow(/applications\.0: Unrecognized key: "dockerImg"/);
	});

	it("requires at least one environment", () => {
		expect(() =>
			parseDocuments(
				"apiVersion: v1\nkind: Project\nname: demo\nenvironments: []\n",
			),
		).toThrow(ConfigParseError);
	});

	it("reports YAML syntax errors", () => {
		expect(() => parseDocuments("name: [unclosed")).toThrow(/YAML parse error/);
	});

	it("reports a missing file", async () => {
		await expect(parseConfigFile("/nonexistent/dokploy.yaml")).rejects.toThrow(
			/Config file not found/,
		);
	});
});
