import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/client.js", () => ({
	apiGet: vi.fn(),
	apiPost: vi.fn(),
	readAuthConfig: () => ({ url: "https://dokploy.test", token: "token" }),
}));

import { apiGet, apiPost } from "../../src/client.js";
import { executePlan } from "../../src/lib/apply/executor.js";
import { providerIdField } from "../../src/lib/apply/remote.js";
import { planProject } from "./helpers.js";

const config = `
apiVersion: v1
kind: Project
name: fresh
description: new project
environments:
  - name: production
    applications:
      - name: web
        serverName: worker-1
        gitProvider: my-github-app
        sourceType: github
        repository: api
        owner: acme
        replicas: 2
        domains:
          - host: web.example.com
            port: 3000
        ports:
          - publishedPort: 8080
            targetPort: 80
            protocol: tcp
        mounts:
          - type: bind
            mountPath: /data
            hostPath: /srv/data
        redirects:
          - regex: ^/old$
            replacement: /new
        security:
          - username: admin
            password: pw
        schedules:
          - name: nightly
            cronExpression: "0 3 * * *"
            command: echo hi
    compose:
      - name: stack
        composeType: stack
        sourceType: raw
        composeFile: "services: {}"
        domains:
          - host: app.example.com
            serviceName: app
            port: 80
        schedules:
          - name: prune
            cronExpression: "0 4 * * *"
            command: echo prune
            serviceName: app
    mysql:
      - name: mysql
        databaseName: app
        databaseUser: app
        databasePassword: pw
        databaseRootPassword: root
        externalPort: 3307
    mariadb:
      - name: maria
        databaseName: app
        databaseUser: app
        databasePassword: pw
    mongo:
      - name: mongo
        databaseUser: app
        databasePassword: pw
        replicaSets: true
    redis:
      - name: cache
        databasePassword: pw
  - name: staging
`;

const remote: Record<string, (params: any) => unknown> = {
	"project.all": () => [],
	"server.all": () => [{ serverId: "srv1", name: "worker-1" }],
	"gitProvider.getAll": () => [
		{
			name: "my-github-app",
			providerType: "github",
			github: { githubId: "gh1" },
		},
	],
	"environment.byProjectId": () => [
		{ environmentId: "env-prod", name: "production" },
	],
	"schedule.list": () => [],
};

const created: Record<string, unknown> = {
	"project.create": {
		project: { projectId: "p1" },
		environment: { environmentId: "env-prod" },
	},
	"environment.create": { environmentId: "env-staging" },
	"application.create": { applicationId: "app1" },
	"compose.create": { composeId: "c1" },
	"mysql.create": { mysqlId: "my1" },
	"mariadb.create": { mariadbId: "ma1" },
	"mongo.create": { mongoId: "mo1" },
	"redis.create": { redisId: "r1" },
};

const serve = (overrides: Record<string, (params: any) => unknown> = {}) => {
	const routes = { ...remote, ...overrides };
	vi.mocked(apiGet).mockImplementation(
		async (endpoint, params) => routes[endpoint]?.(params) ?? {},
	);
};

describe("apply to an empty server", () => {
	beforeEach(() => {
		vi.mocked(apiGet).mockReset();
		vi.mocked(apiPost).mockReset();
		serve();
		vi.mocked(apiPost).mockImplementation(
			async (endpoint) => created[endpoint] ?? {},
		);
	});

	it("creates every resource with the payload each endpoint expects", async () => {
		const result = await executePlan(await planProject(config));

		expect(vi.mocked(apiPost).mock.calls).toEqual([
			["project.create", { name: "fresh", description: "new project" }],
			[
				"application.create",
				{ name: "web", serverId: "srv1", environmentId: "env-prod" },
			],
			[
				"application.update",
				{
					applicationId: "app1",
					sourceType: "github",
					repository: "api",
					owner: "acme",
					replicas: 2,
					githubId: "gh1",
				},
			],
			[
				"domain.create",
				{
					host: "web.example.com",
					port: 3000,
					domainType: "application",
					applicationId: "app1",
				},
			],
			[
				"port.create",
				{
					publishMode: "ingress",
					publishedPort: 8080,
					targetPort: 80,
					protocol: "tcp",
					applicationId: "app1",
				},
			],
			[
				"mounts.create",
				{
					type: "bind",
					mountPath: "/data",
					hostPath: "/srv/data",
					serviceType: "application",
					serviceId: "app1",
				},
			],
			[
				"redirects.create",
				{
					permanent: false,
					regex: "^/old$",
					replacement: "/new",
					applicationId: "app1",
				},
			],
			[
				"security.create",
				{ username: "admin", password: "pw", applicationId: "app1" },
			],
			[
				"schedule.create",
				{
					name: "nightly",
					cronExpression: "0 3 * * *",
					command: "echo hi",
					scheduleType: "application",
					applicationId: "app1",
				},
			],
			[
				"compose.create",
				{ name: "stack", composeType: "stack", environmentId: "env-prod" },
			],
			[
				"compose.update",
				{ composeId: "c1", sourceType: "raw", composeFile: "services: {}" },
			],
			[
				"domain.create",
				{
					host: "app.example.com",
					serviceName: "app",
					port: 80,
					domainType: "compose",
					composeId: "c1",
				},
			],
			[
				"schedule.create",
				{
					name: "prune",
					cronExpression: "0 4 * * *",
					command: "echo prune",
					serviceName: "app",
					scheduleType: "compose",
					composeId: "c1",
				},
			],
			[
				"mysql.create",
				{
					name: "mysql",
					databaseName: "app",
					databaseUser: "app",
					databasePassword: "pw",
					databaseRootPassword: "root",
					environmentId: "env-prod",
				},
			],
			["mysql.update", { mysqlId: "my1", externalPort: 3307 }],
			[
				"mariadb.create",
				{
					name: "maria",
					databaseName: "app",
					databaseUser: "app",
					databasePassword: "pw",
					environmentId: "env-prod",
				},
			],
			[
				"mongo.create",
				{
					name: "mongo",
					databaseUser: "app",
					databasePassword: "pw",
					replicaSets: true,
					environmentId: "env-prod",
				},
			],
			[
				"redis.create",
				{ name: "cache", databasePassword: "pw", environmentId: "env-prod" },
			],
			["environment.create", { name: "staging", projectId: "p1" }],
		]);
		expect(result).toEqual({
			created: 17,
			updated: 0,
			deleted: 0,
			unchanged: 0,
			failed: 0,
			errors: [],
		});
	});

	it("applies env everywhere and fills in the auto-created production environment", async () => {
		vi.mocked(apiPost).mockImplementation(async (endpoint, body) =>
			endpoint === "environment.create"
				? { environmentId: "env-staging", ...body }
				: (created[endpoint] ?? {}),
		);

		await executePlan(
			await planProject(`
apiVersion: v1
kind: Project
name: fresh
env: SHARED=1
environments:
  - name: production
    description: live
    env: API_URL=https://api.example.com
    applications:
      - name: web
        env: TOKEN=from-vault
        buildSecrets: NPM_TOKEN=x
    redis:
      - name: cache
        databasePassword: pw
        env: MAXMEMORY=64mb
  - name: staging
    description: preview
    env: API_URL=https://staging.example.com
`),
		);

		expect(vi.mocked(apiPost).mock.calls).toEqual([
			["project.create", { name: "fresh", env: "SHARED=1" }],
			[
				"environment.update",
				{
					environmentId: "env-prod",
					description: "live",
					env: "API_URL=https://api.example.com",
				},
			],
			["application.create", { name: "web", environmentId: "env-prod" }],
			[
				"application.update",
				{
					applicationId: "app1",
					env: "TOKEN=from-vault",
					buildSecrets: "NPM_TOKEN=x",
				},
			],
			[
				"redis.create",
				{ name: "cache", databasePassword: "pw", environmentId: "env-prod" },
			],
			["redis.update", { redisId: "r1", env: "MAXMEMORY=64mb" }],
			[
				"environment.create",
				{ name: "staging", description: "preview", projectId: "p1" },
			],
			[
				"environment.update",
				{
					environmentId: "env-staging",
					env: "API_URL=https://staging.example.com",
				},
			],
		]);
	});

	it("updates env on an existing environment and service", async () => {
		serve({
			"project.all": () => [{ projectId: "p1", name: "fresh" }],
			"project.one": () => ({
				projectId: "p1",
				name: "fresh",
				environments: [
					{
						environmentId: "env-prod",
						name: "production",
						env: "API_URL=old",
						applications: [{ applicationId: "a1", name: "web" }],
					},
				],
			}),
			"application.one": () => ({
				applicationId: "a1",
				name: "web",
				env: "TOKEN=old",
				buildArgs: "NODE_ENV=production",
			}),
		});

		await executePlan(
			await planProject(
				"apiVersion: v1\nkind: Project\nname: fresh\nenvironments:\n  - name: production\n    env: API_URL=new\n    applications:\n      - name: web\n        env: TOKEN=new\n        buildArgs: NODE_ENV=production\n",
			),
		);

		expect(vi.mocked(apiPost).mock.calls).toEqual([
			["environment.update", { environmentId: "env-prod", env: "API_URL=new" }],
			["application.update", { applicationId: "a1", env: "TOKEN=new" }],
		]);
	});

	it("keeps a service on the server it already runs on", async () => {
		serve({
			"project.all": () => [{ projectId: "p1", name: "fresh" }],
			"project.one": () => ({
				projectId: "p1",
				name: "fresh",
				environments: [
					{
						environmentId: "env-prod",
						name: "production",
						applications: [{ applicationId: "a1", name: "web" }],
					},
				],
			}),
			"application.one": () => ({
				applicationId: "a1",
				name: "web",
				serverId: "srv1",
			}),
		});

		const plan = await planProject(
			"apiVersion: v1\nkind: Project\nname: fresh\nenvironments:\n  - name: production\n    applications:\n      - name: web\n        serverName: worker-1\n",
		);

		expect(plan.environments[0].children?.[0].type).toBe("unchanged");
	});

	it("refuses to move an existing service to another server", async () => {
		serve({
			"project.all": () => [{ projectId: "p1", name: "fresh" }],
			"project.one": () => ({
				projectId: "p1",
				name: "fresh",
				environments: [
					{
						environmentId: "env-prod",
						name: "production",
						applications: [{ applicationId: "a1", name: "web" }],
					},
				],
			}),
			"application.one": () => ({
				applicationId: "a1",
				name: "web",
				serverId: null,
			}),
		});

		await expect(
			planProject(
				"apiVersion: v1\nkind: Project\nname: fresh\nenvironments:\n  - name: production\n    applications:\n      - name: web\n        serverName: worker-1\n",
			),
		).rejects.toThrow(
			'application "web" runs on a different server; serverName only applies when creating it',
		);
	});

	it("updates project and environment descriptions", async () => {
		serve({
			"project.all": () => [{ projectId: "p1", name: "fresh" }],
			"project.one": () => ({
				projectId: "p1",
				name: "fresh",
				description: "old",
				environments: [
					{ environmentId: "env-prod", name: "production", description: "old" },
				],
			}),
		});

		await executePlan(
			await planProject(
				"apiVersion: v1\nkind: Project\nname: fresh\ndescription: new\nenvironments:\n  - name: production\n    description: live\n",
			),
		);

		expect(vi.mocked(apiPost).mock.calls).toEqual([
			["project.update", { projectId: "p1", description: "new" }],
			[
				"environment.update",
				{ environmentId: "env-prod", description: "live" },
			],
		]);
	});

	it("refuses ambiguous service names", async () => {
		serve({
			"project.all": () => [{ projectId: "p1", name: "fresh" }],
			"project.one": () => ({
				projectId: "p1",
				name: "fresh",
				environments: [
					{
						environmentId: "env-prod",
						name: "production",
						applications: [
							{ applicationId: "a1", name: "web" },
							{ applicationId: "a2", name: "web" },
						],
					},
				],
			}),
		});

		await expect(
			planProject(
				"apiVersion: v1\nkind: Project\nname: fresh\nenvironments:\n  - name: production\n    applications:\n      - name: web\n",
			),
		).rejects.toThrow('Multiple application resources named "web"');
	});

	it("refuses unknown server names before changing anything", async () => {
		await expect(
			planProject(config.replace("worker-1", "worker-9")),
		).rejects.toThrow('Server "worker-9" not found. Available: worker-1');
		expect(apiPost).not.toHaveBeenCalled();
	});
});

describe("providerIdField", () => {
	it.each([
		["github", { github: { githubId: "x" } }, { githubId: "x" }],
		["gitlab", { gitlab: { gitlabId: "x" } }, { gitlabId: "x" }],
		["gitea", { gitea: { giteaId: "x" } }, { giteaId: "x" }],
		["bitbucket", { bitbucket: { bitbucketId: "x" } }, { bitbucketId: "x" }],
	])("maps a %s provider to its id field", (providerType, nested, expected) => {
		expect(providerIdField({ providerType, ...nested })).toEqual(expected);
	});
});
