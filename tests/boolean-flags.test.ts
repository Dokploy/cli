import { execFile } from "node:child_process";
import * as http from "node:http";
import type { AddressInfo } from "node:net";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.join(__dirname, "..", "dist", "index.js");

describe("generated boolean flags", () => {
	let server: http.Server;
	let url: string;
	let bodies: unknown[] = [];

	beforeAll(async () => {
		server = http.createServer((req, res) => {
			let raw = "";
			req.on("data", (chunk) => {
				raw += chunk;
			});
			req.on("end", () => {
				bodies.push(raw ? JSON.parse(raw) : undefined);
				res.setHeader("Content-Type", "application/json");
				res.end(JSON.stringify({ result: { data: { json: true } } }));
			});
		});
		await new Promise<void>((resolve) =>
			server.listen(0, "127.0.0.1", resolve),
		);
		url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
	});

	afterAll(async () => {
		await new Promise((resolve) => server.close(resolve));
	});

	beforeEach(() => {
		bodies = [];
	});

	async function update(...args: string[]) {
		await execFileAsync(
			"node",
			[CLI, "application", "update", "--applicationId", "app-1", ...args],
			{
				env: {
					...process.env,
					DOKPLOY_URL: url,
					DOKPLOY_API_KEY: "test-key",
					NO_COLOR: "1",
				},
			},
		);
		return bodies.at(-1);
	}

	it("sends true for --flag", async () => {
		expect(await update("--autoDeploy")).toEqual({
			json: { applicationId: "app-1", autoDeploy: true },
		});
	});

	it("sends false for --no-flag", async () => {
		expect(await update("--no-autoDeploy", "--no-cleanCache")).toEqual({
			json: { applicationId: "app-1", autoDeploy: false, cleanCache: false },
		});
	});

	it("omits booleans that are not passed", async () => {
		expect(await update("--name", "renamed")).toEqual({
			json: { applicationId: "app-1", name: "renamed" },
		});
	});

	it("lists the negated flag in help", async () => {
		const { stdout } = await execFileAsync("node", [
			CLI,
			"application",
			"update",
			"--help",
		]);
		expect(stdout).toContain("--no-autoDeploy");
	});
});
