import { AxiosError, AxiosHeaders } from "axios";
import { describe, expect, it, vi } from "vitest";
import { presentError } from "../src/ui/presenters.js";
import { type RenderEnv, render } from "../src/ui/render.js";
import { stripAnsi } from "../src/ui/style.js";

// Symbols fall back to ASCII on terminals without Unicode (including the
// Windows CI runner). Pin Unicode so expectations match on every platform.
vi.hoisted(() => {
	process.env.TERM = "xterm-256color";
});

function show(data: unknown, endpoint: string, method: "get" | "post") {
	const lines: string[] = [];
	const env: RenderEnv = {
		interactive: true,
		width: 100,
		print: (line) => lines.push(stripAnsi(line)),
	};
	render(data, { endpoint, method }, env);
	return lines.join("\n");
}

describe("instance management output", () => {
	it("explains a restart", () => {
		const text = show(true, "settings.reloadServer", "post");
		expect(text).toContain("✓ Dokploy is restarting");
		expect(text).toContain("dokploy settings health");
	});

	it("explains a Traefik restart", () => {
		expect(show(true, "settings.reloadTraefik", "post")).toContain(
			"✓ Traefik is restarting",
		);
	});

	it("says whether an update is available", () => {
		const available = show(
			{ latestVersion: "v0.31.3", updateAvailable: true },
			"settings.getUpdateData",
			"post",
		);
		expect(available).toContain("Update available v0.31.3");
		expect(available).toContain("dokploy settings update-server");

		const current = show(
			{ latestVersion: "v0.31.2", updateAvailable: false },
			"settings.getUpdateData",
			"post",
		);
		expect(current).toContain("✓ Dokploy is up to date");
		expect(current).toContain("Latest version: v0.31.2");
	});

	it("shows the running version", () => {
		expect(show("v0.31.2", "settings.getDokployVersion", "get")).toBe(
			"Dokploy v0.31.2",
		);
	});

	it("summarises health checks", () => {
		expect(show({ status: "ok" }, "settings.health", "get")).toContain(
			"✓ Dokploy is healthy",
		);
		const infra = show(
			{
				postgres: { status: "healthy" },
				traefik: {
					status: "unhealthy",
					message: "Could not find running container",
				},
			},
			"settings.checkInfrastructureHealth",
			"get",
		);
		expect(infra).toMatch(/● PostgreSQL\s+healthy/);
		expect(infra).toMatch(
			/● Traefik\s+unhealthy\s+Could not find running container/,
		);
	});

	it("confirms a background cleanup", () => {
		expect(
			show(
				{ status: "scheduled", message: "Docker cleanup has been initiated" },
				"settings.cleanAll",
				"post",
			),
		).toContain("✓ Cleanup started");
	});

	it("falls back to the generic view for unexpected shapes", () => {
		expect(show({ foo: 1 }, "settings.getUpdateData", "post")).toContain(
			"✓ Done settings get-update-data",
		);
	});

	it("keeps piped output unchanged", () => {
		const log = vi.spyOn(console, "log").mockImplementation(() => {});
		const data = { latestVersion: "v0.31.3", updateAvailable: true };
		render(
			data,
			{ endpoint: "settings.getUpdateData", method: "post" },
			{ interactive: false, width: 100, print: () => {} },
		);
		expect(log.mock.calls[0]?.[0]).toBe(JSON.stringify(data, null, 2));
		log.mockRestore();
	});
});

describe("restart connection drops", () => {
	const config = { baseURL: "http://x/api", headers: new AxiosHeaders() };

	it("explains a dropped connection during reload-server", () => {
		const lines: string[] = [];
		const err = new AxiosError("socket hang up", "ECONNRESET", config);
		expect(
			presentError("settings.reloadServer", err, (l) =>
				lines.push(stripAnsi(l)),
			),
		).toBe(true);
		expect(lines[0]).toBe("⚠ Dokploy is restarting");
	});

	it("explains a 502 from the proxy during reload-server", () => {
		const err = new AxiosError(
			"Request failed",
			"ERR_BAD_RESPONSE",
			config,
			{},
			{
				status: 502,
				statusText: "Bad Gateway",
				headers: {},
				config,
				data: "",
			},
		);
		expect(presentError("settings.reloadServer", err, () => {})).toBe(true);
	});

	it("leaves other commands' errors alone", () => {
		const err = new AxiosError("socket hang up", "ECONNRESET", config);
		expect(presentError("project.all", err, () => {})).toBe(false);
	});
});
