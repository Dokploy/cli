import { afterEach, describe, expect, it, vi } from "vitest";
import { type RenderEnv, render } from "../src/ui/render.js";
import { stripAnsi } from "../src/ui/style.js";

// Symbols fall back to ASCII on terminals without Unicode (including the
// Windows CI runner). Pin Unicode so expectations match on every platform.
vi.hoisted(() => {
	process.env.TERM = "xterm-256color";
});

const NOW = new Date("2026-11-17T12:00:00.000Z");

function pretty(width = 100) {
	const lines: string[] = [];
	const env: RenderEnv = {
		interactive: true,
		width,
		now: NOW,
		print: (line) => lines.push(stripAnsi(line)),
	};
	return { env, lines, text: () => lines.join("\n") };
}

function legacy(data: unknown): string {
	if (data === null || data === undefined) return "OK";
	if (typeof data === "string") return data;
	return JSON.stringify(data, null, 2);
}

const projects = [
	{
		projectId: "prj_8f2k1x",
		name: "storefront",
		description: "Customer facing shop",
		createdAt: "2026-11-17T09:00:00.000Z",
		organizationId: "org_1",
		env: "STRIPE_KEY=sk_live_123\nDATABASE_URL=postgres://x",
		environments: [{ environmentId: "env_1", name: "production" }],
	},
	{
		projectId: "prj_1x9q7z",
		name: "internal-tools",
		description: null,
		createdAt: "2026-11-15T12:00:00.000Z",
		organizationId: "org_1",
		env: "",
		environments: [],
	},
];

const application = {
	applicationId: "app_42",
	name: "api",
	appName: "storefront-api-x8f2",
	applicationStatus: "done",
	buildType: "nixpacks",
	description: null,
	env: "PORT=3000\nSECRET=hunter2\n# comment",
	password: "registry-pass",
	refreshToken: "tok_abc",
	createdAt: "2026-11-17T09:00:00.000Z",
	environment: { environmentId: "env_1", name: "production" },
	domains: [
		{ domainId: "dom_1", host: "api.example.com", port: 3000, https: true },
		{ domainId: "dom_2", host: "api2.example.com", port: 3000, https: false },
	],
};

describe("render: unchanged output for scripts", () => {
	afterEach(() => vi.restoreAllMocks());

	const samples: unknown[] = [
		null,
		undefined,
		"plain text",
		"",
		true,
		false,
		42,
		{ a: 1 },
		[1, 2],
		projects,
		application,
	];

	it("prints exactly the legacy output when not interactive", () => {
		for (const data of samples) {
			const log = vi.spyOn(console, "log").mockImplementation(() => {});
			render(
				data,
				{ endpoint: "project.all", method: "get" },
				{ interactive: false, width: 100, print: () => {} },
			);
			expect(stripAnsi(String(log.mock.calls[0]?.[0]))).toBe(legacy(data));
			expect(log).toHaveBeenCalledTimes(1);
			log.mockRestore();
		}
	});

	it("prints raw JSON with --json, even in a terminal", () => {
		for (const data of samples) {
			const log = vi.spyOn(console, "log").mockImplementation(() => {});
			const { env, lines } = pretty();
			render(data, { json: true, endpoint: "project.all", method: "get" }, env);
			expect(log.mock.calls[0]?.[0]).toBe(JSON.stringify(data, null, 2));
			expect(lines).toHaveLength(0);
			log.mockRestore();
		}
	});
});

describe("render: interactive tables", () => {
	it("shows a table with name, id and the useful columns", () => {
		const out = pretty();
		render(projects, { endpoint: "project.all", method: "get" }, out.env);
		const [header, first, second] = out.lines;
		expect(header).toMatch(/^ {2}NAME\s+ID\s+DESCRIPTION/);
		expect(first).toContain("storefront");
		expect(first).toContain("prj_8f2k1x");
		expect(first).toContain("3h ago");
		expect(second).toContain("internal-tools");
		expect(second).toContain("2d ago");
		expect(out.text()).toContain("2 projects");
	});

	it("never shows env vars or secrets in tables", () => {
		const out = pretty();
		render(projects, { endpoint: "project.all", method: "get" }, out.env);
		expect(out.text()).not.toContain("sk_live_123");
		expect(out.text()).not.toMatch(/\bENV\b/);
	});

	it("skips IDs that are the same on every row", () => {
		const out = pretty();
		render(projects, { endpoint: "project.all", method: "get" }, out.env);
		expect(out.lines[0]).not.toContain("ORGANIZATION");
		expect(out.lines[0]).toContain("ENVIRONMENTS");
	});

	it("drops low-priority columns to fit narrow terminals", () => {
		const out = pretty(50);
		render(projects, { endpoint: "project.all", method: "get" }, out.env);
		for (const line of out.lines) {
			expect([...line].length).toBeLessThanOrEqual(50);
		}
		expect(out.lines[0]).toContain("NAME");
		expect(out.text()).toContain("--json shows all fields");
	});

	it("says so when a list is empty", () => {
		const out = pretty();
		render([], { endpoint: "project.all", method: "get" }, out.env);
		expect(out.text()).toBe("No projects found.");
	});

	it("names list items after the action when it says what they are", () => {
		const out = pretty();
		render(
			[{ ID: "n1", hostname: "manager-1", status: "ready" }],
			{ endpoint: "swarm.getNodes", method: "get" },
			out.env,
		);
		expect(out.text()).toContain("1 node");
		expect(out.text()).toContain("● ready");
	});
});

describe("render: interactive details", () => {
	it("shows a titled detail view with status first", () => {
		const out = pretty();
		render(
			application,
			{ endpoint: "application.one", method: "get" },
			out.env,
		);
		expect(out.lines[0]).toBe("  api  Application • app_42");
		const fields = out.lines.slice(2);
		expect(fields[0]).toMatch(/Application status\s+● done/);
		expect(out.text()).toMatch(/Environment\s+production/);
	});

	it("hides secrets and env values, and says how to see them", () => {
		const out = pretty();
		render(
			application,
			{ endpoint: "application.one", method: "get" },
			out.env,
		);
		const text = out.text();
		expect(text).not.toContain("registry-pass");
		expect(text).not.toContain("tok_abc");
		expect(text).not.toContain("hunter2");
		expect(text).toMatch(/Env\s+2 variables \(hidden\)/);
		expect(text).toContain("3 secret values hidden");
		expect(text).toContain("1 empty field hidden");
		expect(text).toContain("--json shows everything");
	});

	it("renders nested lists as small tables", () => {
		const out = pretty();
		render(
			application,
			{ endpoint: "application.one", method: "get" },
			out.env,
		);
		const text = out.text();
		expect(text).toContain("Domains (2)");
		expect(text).toMatch(/HOST\s+ID\s+PORT\s+HTTPS/);
		expect(text).toMatch(/api\.example\.com\s+dom_1\s+3000\s+yes/);
	});

	it("confirms successful mutations", () => {
		const out = pretty();
		render(null, { endpoint: "application.deploy", method: "post" }, out.env);
		expect(out.text()).toBe("✓ Done application deploy");

		const created = pretty();
		render(
			{ projectId: "prj_new", name: "blog" },
			{ endpoint: "project.create", method: "post" },
			created.env,
		);
		expect(created.lines[0]).toBe("✓ Done project create");
		expect(created.text()).toContain("blog  Project • prj_new");
	});

	it("treats an empty tRPC envelope as a plain success", () => {
		const out = pretty();
		render(
			{ result: { data: { json: null } } },
			{ endpoint: "application.deploy", method: "post" },
			out.env,
		);
		expect(out.text()).toBe("✓ Done application deploy");
	});

	it("puts hidden values after the useful fields", () => {
		const out = pretty();
		render(
			application,
			{ endpoint: "application.one", method: "get" },
			out.env,
		);
		const labels = out.lines.map((l) => l.trim().split(/\s{2,}/)[0]);
		expect(labels.indexOf("Build type")).toBeLessThan(labels.indexOf("Env"));
		expect(labels.indexOf("Created")).toBeLessThan(labels.indexOf("Password"));
	});

	it("prints strings such as logs untouched", () => {
		const out = pretty();
		render(
			"line 1\nline 2",
			{ endpoint: "docker.getLogs", method: "get" },
			out.env,
		);
		expect(out.text()).toBe("line 1\nline 2");
	});
});
