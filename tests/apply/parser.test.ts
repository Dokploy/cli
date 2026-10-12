import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
	ConfigParseError,
	parseConfig,
	parseConfigFile,
} from "../../src/lib/apply/parser.js";

const ROOT = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../..",
);

const project = (environment: string) =>
	`apiVersion: v1\nkind: Project\nname: demo\nenvironments:\n${environment}`;

describe("parseConfig", () => {
	it("accepts the bundled example", async () => {
		const config = await parseConfigFile(
			path.join(ROOT, "examples", "dokploy.yaml"),
		);
		expect(config.environments[0].applications?.[0].name).toBe("web-api");
		expect(config.environments[0].postgres?.[0].databaseName).toBe("myapp");
	});

	it("rejects unknown keys so typos are not silently ignored", () => {
		expect(() =>
			parseConfig(
				project(
					"  - name: production\n    applications:\n      - name: web\n        dockerImg: nginx\n",
				),
			),
		).toThrow(/applications\.0: Unrecognized key: "dockerImg"/);
	});

	it("requires at least one environment", () => {
		expect(() =>
			parseConfig(
				"apiVersion: v1\nkind: Project\nname: demo\nenvironments: []\n",
			),
		).toThrow(ConfigParseError);
	});

	it("reports YAML syntax errors", () => {
		expect(() => parseConfig("name: [unclosed")).toThrow(/YAML parse error/);
	});

	it("reports a missing file", async () => {
		await expect(parseConfigFile("/nonexistent/dokploy.yaml")).rejects.toThrow(
			/Config file not found/,
		);
	});
});
