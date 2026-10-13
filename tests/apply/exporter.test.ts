import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/client.js", () => ({
	apiGet: vi.fn(async (endpoint: string) => remote[endpoint]),
	apiPost: vi.fn(),
}));

import { exportProject } from "../../src/lib/apply/exporter.js";
import { parseConfig } from "../../src/lib/apply/parser.js";

const remote: Record<string, unknown> = {
	"server.all": [{ serverId: "srv1", name: "worker-1" }],
	"gitProvider.getAll": [
		{
			name: "my-github-app",
			providerType: "github",
			github: { githubId: "gh1" },
		},
	],
	"application.one": {
		applicationId: "app1",
		appName: "web-x1",
		name: "web",
		serverId: "srv1",
		githubId: "gh1",
		sourceType: "github",
		repository: "api",
		env: "SECRET=1",
		buildArgs: "NODE_ENV=production",
		dockerBuildStage: null,
		createdAt: "2026-01-01",
		domains: [
			{
				domainId: "d1",
				host: "example.com",
				port: 3000,
				https: true,
				createdAt: "x",
			},
		],
		security: [{ securityId: "s1", username: "admin", password: "hunter2" }],
		ports: [],
	},
	"schedule.list": [],
	"postgres.one": {
		postgresId: "pg1",
		appName: "db-x1",
		name: "db",
		dockerImage: "postgres:16",
		databaseName: "app",
		databaseUser: "app",
		databasePassword: "hunter2",
		mounts: [
			{
				type: "volume",
				mountPath: "/var/lib/postgresql/data",
				volumeName: "db-x1-data",
			},
			{ type: "bind", mountPath: "/backups", hostPath: "/srv/backups" },
		],
	},
};

const project = {
	name: "demo",
	env: "SHARED=1",
	environments: [
		{
			name: "production",
			description: null,
			env: "API_URL=https://api.example.com",
			applications: [{ applicationId: "app1" }],
			postgres: [{ postgresId: "pg1" }],
		},
	],
};

describe("exportProject", () => {
	it("exports only declarative fields, without secrets, and round-trips through the schema", async () => {
		const config = parseConfig(
			await exportProject(project, { includeEnv: false }),
		);
		const [environment] = config.environments;

		expect(config.env).toBeUndefined();
		expect(environment.env).toBeUndefined();

		expect(environment.applications).toEqual([
			{
				name: "web",
				serverName: "worker-1",
				gitProvider: "my-github-app",
				repository: "api",
				sourceType: "github",
				domains: [{ host: "example.com", port: 3000, https: true }],
				security: [{ username: "admin" }],
			},
		]);
		expect(environment.postgres).toEqual([
			{
				name: "db",
				dockerImage: "postgres:16",
				databaseName: "app",
				databaseUser: "app",
				mounts: [
					{ type: "bind", mountPath: "/backups", hostPath: "/srv/backups" },
				],
			},
		]);
	});

	it("includes env and build args only when asked, still without passwords", async () => {
		const config = parseConfig(
			await exportProject(project, { includeEnv: true }),
		);
		const [environment] = config.environments;

		expect(config.env).toBe("SHARED=1");
		expect(environment.env).toBe("API_URL=https://api.example.com");
		expect(environment.applications?.[0]).toMatchObject({
			env: "SECRET=1",
			buildArgs: "NODE_ENV=production",
			security: [{ username: "admin" }],
		});
		expect(environment.postgres?.[0]).not.toHaveProperty("databasePassword");
	});
});
