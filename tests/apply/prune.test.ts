import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/client.js", () => ({
	apiGet: vi.fn(),
	apiPost: vi.fn(),
	readAuthConfig: () => ({ url: "https://dokploy.test", token: "token" }),
}));

import { apiGet, apiPost } from "../../src/client.js";
import { executePlan } from "../../src/lib/apply/executor.js";
import type { Action, ProjectPlan } from "../../src/lib/apply/types.js";
import { planProject } from "./helpers.js";

const remote: Record<string, (params: any) => unknown> = {
	"project.all": () => [{ projectId: "p1", name: "demo" }],
	"project.one": () => ({
		projectId: "p1",
		name: "demo",
		environments: [
			{
				environmentId: "env1",
				name: "production",
				isDefault: true,
				applications: [
					{ applicationId: "app1", name: "web" },
					{ applicationId: "app2", name: "old-web" },
				],
				compose: [{ composeId: "c1", name: "stack" }],
				postgres: [{ postgresId: "pg1", name: "db" }],
			},
			{
				environmentId: "env2",
				name: "preview",
				isDefault: false,
				redis: [{ redisId: "r1", name: "cache" }],
			},
		],
	}),
	"application.one": () => ({
		applicationId: "app1",
		name: "web",
		domains: [
			{ domainId: "d1", host: "keep.example.com" },
			{ domainId: "d2", host: "stale.example.com" },
		],
	}),
	"schedule.list": () => [],
	"redis.one": () => ({ redisId: "r1", name: "cache", mounts: [] }),
	"postgres.one": () => ({
		postgresId: "pg1",
		name: "db",
		appName: "db-x1",
		mounts: [
			{
				mountId: "m1",
				type: "volume",
				mountPath: "/var/lib/postgresql/data",
				volumeName: "db-x1-data",
			},
			{ mountId: "m2", type: "bind", mountPath: "/backups", hostPath: "/srv" },
		],
	}),
};

const config = `
apiVersion: v1
kind: Project
name: demo
environments:
  - name: production
    applications:
      - name: web
        domains:
          - host: keep.example.com
    postgres:
      - name: db
`;

const flatten = (action: Action): string[] => [
	`${action.type} ${action.resourceType} ${action.name}`,
	...(action.children ?? []).flatMap(flatten),
];

const describePlan = (plan: ProjectPlan) => [
	...flatten(plan.project),
	...plan.environments.flatMap(flatten),
];

describe("apply --prune", () => {
	beforeEach(() => {
		vi.mocked(apiGet).mockReset();
		vi.mocked(apiPost).mockReset();
		vi.mocked(apiGet).mockImplementation(async (endpoint, params) =>
			remote[endpoint]?.(params),
		);
		vi.mocked(apiPost).mockImplementation(async () => ({}));
	});

	it("plans deletes for everything the file leaves out, except a database's own data mount", async () => {
		expect(describePlan(await planProject(config, true))).toEqual([
			"unchanged project demo",
			"unchanged environment production",
			"unchanged application web",
			"unchanged domain keep.example.com",
			"delete domain stale.example.com",
			"unchanged postgres db",
			"delete mount /backups",
			"delete application old-web",
			"delete compose stack",
			"delete environment preview",
			"delete redis cache",
		]);
	});

	it("deletes children and services before their environment, keeping compose volumes", async () => {
		const result = await executePlan(await planProject(config, true));

		expect(vi.mocked(apiPost).mock.calls).toEqual([
			["domain.delete", { domainId: "d2" }],
			["mounts.remove", { mountId: "m2" }],
			["application.delete", { applicationId: "app2" }],
			["compose.delete", { composeId: "c1", deleteVolumes: false }],
			["redis.remove", { redisId: "r1" }],
			["environment.remove", { environmentId: "env2" }],
		]);
		expect(result).toMatchObject({ deleted: 6, failed: 0 });
	});

	it("empties the default environment instead of deleting it", async () => {
		const plan = await planProject(
			"apiVersion: v1\nkind: Project\nname: demo\nenvironments:\n  - name: preview\n    redis:\n      - name: cache\n",
			true,
		);

		expect(describePlan(plan)).toEqual([
			"unchanged project demo",
			"unchanged environment preview",
			"unchanged redis cache",
			"unchanged environment production",
			"delete application web",
			"delete application old-web",
			"delete compose stack",
			"delete postgres db",
		]);
	});

	it("deletes nothing without --prune", async () => {
		const plan = await planProject(config);

		expect(
			describePlan(plan).filter((line) => line.startsWith("delete")),
		).toEqual([]);
	});
});
