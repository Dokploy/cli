import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/client.js", () => ({
	apiGet: vi.fn(),
	apiPost: vi.fn(),
	readAuthConfig: () => ({ url: "https://dokploy.test", token: "token" }),
}));

import { apiGet, apiPost } from "../../src/client.js";
import { executePlan } from "../../src/lib/apply/executor.js";
import { countPlan } from "../../src/lib/apply/reconciler.js";
import type { Action, ProjectPlan } from "../../src/lib/apply/types.js";
import { planProject } from "./helpers.js";

const emptySections = {
	applications: [],
	compose: [],
	postgres: [],
	mysql: [],
	mariadb: [],
	mongo: [],
	redis: [],
};

const remote: Record<string, (params: any) => unknown> = {
	"project.all": () => [
		{
			projectId: "proj1",
			name: "demo",
			environments: [
				{
					...emptySections,
					environmentId: "env1",
					name: "production",
					postgres: [{ postgresId: "pg1" }],
				},
			],
		},
	],
	"project.one": () => ({
		projectId: "proj1",
		name: "demo",
		environments: [
			{
				...emptySections,
				environmentId: "env1",
				name: "production",
				applications: [{ applicationId: "app1", name: "web" }],
				postgres: [{ postgresId: "pg1", name: "db" }],
			},
		],
	}),
	"application.one": () => ({
		applicationId: "app1",
		name: "web",
		replicas: 1,
		githubId: "gh-old",
		ports: [
			{
				portId: "port1",
				publishedPort: 8080,
				targetPort: 80,
				protocol: "tcp",
				publishMode: "host",
			},
		],
	}),
	"schedule.list": () => [
		{
			scheduleId: "s1",
			name: "cleanup",
			cronExpression: "0 2 * * *",
			command: "rm -rf /tmp/cache",
		},
	],
	"postgres.one": ({ postgresId }) =>
		postgresId === "pg1"
			? {
					postgresId: "pg1",
					name: "db",
					dockerImage: "postgres:16",
					databasePassword: "current",
					mounts: [],
				}
			: {
					postgresId: "pg2",
					appName: "demo-db-x1",
					mounts: [
						{
							mountId: "auto-mount",
							type: "volume",
							mountPath: "/var/lib/postgresql/data",
							volumeName: "demo-db-x1-data",
						},
					],
				},
	"gitProvider.getAll": () => [
		{
			name: "my-github-app",
			providerType: "github",
			github: { githubId: "gh-new" },
		},
	],
	"environment.byProjectId": () => [
		{ environmentId: "env1", name: "production" },
	],
};

const created: Record<string, unknown> = {
	"environment.create": { environmentId: "env2" },
	"postgres.create": { postgresId: "pg2" },
};

const config = `
apiVersion: v1
kind: Project
name: demo
environments:
  - name: production
    applications:
      - name: web
        gitProvider: my-github-app
        replicas: 2
        ports:
          - publishedPort: 8080
            targetPort: 3000
            protocol: tcp
        schedules:
          - name: cleanup
            cronExpression: "0 2 * * *"
            command: rm -rf /tmp/cache
    postgres:
      - name: db
        dockerImage: postgres:16
        databasePassword: rotated
  - name: staging
    postgres:
      - name: db
        dockerImage: postgres:17
        databaseName: app
        databaseUser: app
        databasePassword: secret
        externalPort: 5433
        mounts:
          - type: volume
            mountPath: /var/lib/postgresql/data
            volumeName: staging-data
`;

const flatten = (action: Action): string[] => [
	`${action.type} ${action.resourceType} ${action.name}`,
	...(action.children ?? []).flatMap(flatten),
];

const describePlan = (plan: ProjectPlan) => [
	...flatten(plan.project),
	...plan.environments.flatMap(flatten),
];

describe("apply", () => {
	beforeEach(() => {
		vi.mocked(apiGet).mockReset();
		vi.mocked(apiPost).mockReset();
		vi.mocked(apiGet).mockImplementation(async (endpoint, params) =>
			remote[endpoint](params),
		);
		vi.mocked(apiPost).mockImplementation(
			async (endpoint) => created[endpoint] ?? {},
		);
	});

	it("plans updates by name and leaves database credentials alone", async () => {
		const plan = await planProject(config);

		expect(describePlan(plan)).toEqual([
			"unchanged project demo",
			"unchanged environment production",
			"update application web",
			"update port 8080:tcp",
			"unchanged schedule cleanup",
			"unchanged postgres db",
			"create environment staging",
			"create postgres db",
			"create mount /var/lib/postgresql/data",
		]);
		expect(countPlan({ organization: [], projects: [plan] })).toMatchObject({
			created: 3,
			updated: 2,
			unchanged: 4,
		});
	});

	it("sends only changes, keeps required fields on child updates and adopts auto-created mounts", async () => {
		const result = await executePlan(await planProject(config));

		expect(vi.mocked(apiPost).mock.calls).toEqual([
			[
				"application.update",
				{ applicationId: "app1", replicas: 2, githubId: "gh-new" },
			],
			[
				"port.update",
				{
					publishedPort: 8080,
					publishMode: "host",
					targetPort: 3000,
					protocol: "tcp",
					portId: "port1",
				},
			],
			["environment.create", { name: "staging", projectId: "proj1" }],
			[
				"postgres.create",
				{
					name: "db",
					dockerImage: "postgres:17",
					databaseName: "app",
					databaseUser: "app",
					databasePassword: "secret",
					environmentId: "env2",
				},
			],
			["postgres.update", { postgresId: "pg2", externalPort: 5433 }],
			["mounts.update", { mountId: "auto-mount", volumeName: "staging-data" }],
		]);
		expect(result).toMatchObject({ created: 2, updated: 3, failed: 0 });
	});

	it("refuses to plan a database it cannot create", async () => {
		await expect(
			planProject(config.replace("databasePassword: secret", "")),
		).rejects.toThrow('postgres "db" needs databasePassword to be created');
	});

	it("isolates failures to the resource that failed and reports the server message", async () => {
		vi.mocked(apiPost).mockImplementation(async (endpoint) => {
			if (endpoint === "application.update") {
				throw new AxiosError(
					"Request failed with status code 400",
					"ERR_BAD_REQUEST",
					undefined,
					undefined,
					{
						status: 400,
						data: { error: { json: { message: "boom" } } },
					} as any,
				);
			}
			return created[endpoint] ?? {};
		});

		const result = await executePlan(await planProject(config));

		expect(result.errors).toEqual([
			{ resource: 'Application "web"', error: "boom" },
		]);
		expect(
			vi.mocked(apiPost).mock.calls.map(([endpoint]) => endpoint),
		).not.toContain("port.update");
		expect(
			vi.mocked(apiPost).mock.calls.map(([endpoint]) => endpoint),
		).toContain("postgres.create");
	});
});
