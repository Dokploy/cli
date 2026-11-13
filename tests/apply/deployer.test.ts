import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/client.js", () => ({
	apiGet: vi.fn(),
	apiPost: vi.fn(),
	readAuthConfig: () => ({ url: "https://dokploy.test", token: "token" }),
}));

import { apiGet, apiPost } from "../../src/client.js";
import {
	changedFiles,
	DEPLOY_MARKER,
	type Deployment,
	deployAll,
	deployTargets,
	fingerprint,
	landedKeys,
	servicesMounting,
} from "../../src/lib/apply/deployer.js";
import type { Action, Plan } from "../../src/lib/apply/types.js";

const service = (overrides: Partial<Action> = {}): Action => ({
	type: "unchanged",
	resourceType: "compose",
	name: "crm",
	config: { name: "crm", composeFile: "services: {}" },
	remoteId: "c1",
	children: [
		{
			type: "unchanged",
			resourceType: "domain",
			name: "crm.example.com",
			config: { host: "crm.example.com", port: 3000 },
		},
	],
	...overrides,
});

const planWith = (...services: Action[]): Plan => ({
	organization: [],
	projects: [
		{
			project: {
				type: "unchanged",
				resourceType: "project",
				name: "demo",
				config: {},
			},
			environments: [
				{
					type: "unchanged",
					resourceType: "environment",
					name: "production",
					config: {},
					children: services,
				},
			],
		},
	],
});

const KEY = "demo/production/compose/crm";

const fileMount = (
	filePath: string,
	type: Action["type"] = "unchanged",
): Action => ({
	type,
	resourceType: "mount",
	name: filePath,
	config: {
		type: "file",
		filePath,
		mountPath: `/etc/${filePath}`,
		content: "x",
	},
});

const deployment = (overrides: Partial<Deployment>): Deployment => ({
	deploymentId: "d1",
	status: "done",
	createdAt: "2026-11-01T00:00:00Z",
	...overrides,
});

const historyOf = (deployments: Deployment[]) => vi.fn(async () => deployments);

describe("fingerprint", () => {
	it("ignores key order and changes with any child", () => {
		const reordered = service({
			config: { composeFile: "services: {}", name: "crm" },
		});
		const otherPort = service({
			children: [
				{
					type: "unchanged",
					resourceType: "domain",
					name: "crm.example.com",
					config: { host: "crm.example.com", port: 4000 },
				},
			],
		});
		expect(fingerprint(reordered)).toBe(fingerprint(service()));
		expect(fingerprint(otherPort)).not.toBe(fingerprint(service()));
	});
});

describe("deployTargets", () => {
	it("deploys a service whose configuration changed", async () => {
		const targets = await deployTargets(
			planWith(service()),
			new Set([KEY]),
			historyOf([]),
		);
		expect(targets.map((target) => target.reason)).toEqual([
			"configuration changed",
		]);
	});

	it("leaves a service alone whose last deploy matches the file", async () => {
		const current = `${DEPLOY_MARKER}${fingerprint(service())}`;
		const targets = await deployTargets(
			planWith(service()),
			new Set(),
			historyOf([deployment({ description: current })]),
		);
		expect(targets).toEqual([]);
	});

	it("redeploys when the last deploy shipped another configuration", async () => {
		const targets = await deployTargets(
			planWith(service()),
			new Set(),
			historyOf([deployment({ description: `${DEPLOY_MARKER}old` })]),
		);
		expect(targets.map((target) => target.reason)).toEqual([
			"configuration differs from the last deploy",
		]);
	});

	it("retries a failed deploy even when a manual deploy came later", async () => {
		const targets = await deployTargets(
			planWith(service()),
			new Set(),
			historyOf([
				deployment({
					deploymentId: "manual",
					createdAt: "2026-11-02T00:00:00Z",
					description: null,
				}),
				deployment({
					status: "error",
					description: `${DEPLOY_MARKER}${fingerprint(service())}`,
				}),
			]),
		);
		expect(targets.map((target) => target.reason)).toEqual([
			"last deploy failed",
		]);
	});

	it("adopts services that apply never deployed", async () => {
		const targets = await deployTargets(
			planWith(service()),
			new Set(),
			historyOf([deployment({ description: null })]),
		);
		expect(targets).toEqual([]);
	});
});

describe("mounted files", () => {
	it("names the changed file mounts of each service", () => {
		const plan = planWith(
			service({
				children: [fileMount("otel.yaml", "update"), fileMount("loki.yaml")],
			}),
		);
		expect(changedFiles(plan).get(KEY)).toEqual(["otel.yaml"]);
	});

	it("restarts for the changed files on a fresh change, for every file on a retried deploy", async () => {
		const mounted = service({
			children: [fileMount("otel.yaml"), fileMount("loki.yaml")],
		});
		const [changed] = await deployTargets(
			planWith(mounted),
			new Set([KEY]),
			historyOf([]),
			new Map([[KEY, ["otel.yaml"]]]),
		);
		expect(changed.files).toEqual(["otel.yaml"]);
		const [retried] = await deployTargets(
			planWith(mounted),
			new Set(),
			historyOf([
				deployment({
					status: "error",
					description: `${DEPLOY_MARKER}${fingerprint(mounted)}`,
				}),
			]),
		);
		expect(retried.files).toEqual(["otel.yaml", "loki.yaml"]);
	});

	it("finds the services that mount a file, in short or long volume syntax", () => {
		const composeFile = [
			"services:",
			"  otel:",
			"    volumes:",
			"      - ../files/otel.yaml:/etc/otel/config.yaml:ro",
			"  loki:",
			"    volumes:",
			"      - type: bind",
			"        source: ../files/loki.yaml",
			"        target: /etc/loki.yaml",
			"  grafana:",
			"    volumes:",
			"      - grafana-data:/var/lib/grafana",
			"  kuma: {}",
		].join("\n");
		expect(servicesMounting(composeFile, ["otel.yaml"])).toEqual(["otel"]);
		expect(servicesMounting(composeFile, ["loki.yaml", "otel.yaml"])).toEqual([
			"otel",
			"loki",
		]);
		expect(servicesMounting(composeFile, ["grafana.ini"])).toEqual([]);
	});
});

describe("landedKeys", () => {
	it("skips services whose changes did not apply", () => {
		const changed = planWith(service({ type: "update" }));
		expect(landedKeys(changed, planWith(service()))).toEqual(new Set([KEY]));
		expect(landedKeys(changed, changed)).toEqual(new Set());
	});
});

describe("deployAll", () => {
	beforeEach(() => {
		vi.mocked(apiPost).mockReset();
		vi.mocked(apiGet).mockReset();
	});

	const target = {
		key: KEY,
		type: "compose" as const,
		name: "crm",
		environment: "production",
		serviceId: "c1",
		fingerprint: "abc123",
		reason: "configuration changed",
		files: [] as string[],
	};

	const afterTrigger = (result: Deployment) => {
		const history = vi.fn();
		history.mockResolvedValueOnce([deployment({ deploymentId: "old" })]);
		history.mockResolvedValue([result, deployment({ deploymentId: "old" })]);
		return history;
	};

	it("starts a marked deploy and waits for it to finish", async () => {
		const history = afterTrigger(
			deployment({
				deploymentId: "new",
				description: `${DEPLOY_MARKER}abc123`,
			}),
		);
		const result = await deployAll([target], "release", history);
		expect(apiPost).toHaveBeenCalledWith("compose.deploy", {
			composeId: "c1",
			title: "release",
			description: `${DEPLOY_MARKER}abc123`,
		});
		expect(result.failed).toBe(0);
	});

	it("restarts the containers that mount a changed file once the deploy is done", async () => {
		const history = afterTrigger(
			deployment({
				deploymentId: "new",
				description: `${DEPLOY_MARKER}abc123`,
			}),
		);
		vi.mocked(apiGet).mockImplementation(async (endpoint: string) =>
			endpoint === "compose.one"
				? {
						appName: "app",
						serverId: "s1",
						composeFile:
							"services:\n  otel:\n    volumes:\n      - ../files/otel.yaml:/etc/otel.yaml\n  loki:\n    volumes:\n      - ../files/loki.yaml:/etc/loki.yaml\n",
					}
				: [
						{ name: "app-otel-1", containerId: "o1" },
						{ name: "app-loki-1", containerId: "l1" },
						{ name: "app-otel-proxy-1", containerId: "p1" },
					],
		);
		const result = await deployAll(
			[{ ...target, files: ["otel.yaml"] }],
			"release",
			history,
		);
		expect(result.failed).toBe(0);
		expect(apiGet).toHaveBeenCalledWith("docker.getContainersByAppNameMatch", {
			appName: "app",
			appType: "docker-compose",
			serverId: "s1",
		});
		expect(
			vi
				.mocked(apiPost)
				.mock.calls.filter(
					([endpoint]) => endpoint === "docker.restartContainer",
				),
		).toEqual([
			["docker.restartContainer", { containerId: "o1", serverId: "s1" }],
		]);
	});

	it("reports a deploy that fails", async () => {
		const history = afterTrigger(
			deployment({
				deploymentId: "new",
				status: "error",
				errorMessage: "image not found",
				description: `${DEPLOY_MARKER}abc123`,
			}),
		);
		const result = await deployAll([target], "release", history);
		expect(result.failed).toBe(1);
		expect(result.errors[0].error).toBe("image not found");
	});
});
