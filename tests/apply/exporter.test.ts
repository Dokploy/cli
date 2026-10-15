import { describe, expect, it, vi } from "vitest";

vi.mock("../../src/client.js", () => ({
	apiGet: vi.fn(async (endpoint: string, params?: { projectId: string }) =>
		endpoint === "project.one"
			? projects.find((project) => project.projectId === params?.projectId)
			: remote[endpoint],
	),
	apiPost: vi.fn(),
}));

import { apiGet } from "../../src/client.js";
import {
	exportAll,
	exportOrganization,
	exportProject,
} from "../../src/lib/apply/exporter.js";
import { parseDocuments } from "../../src/lib/apply/parser.js";
import { parseProject } from "./helpers.js";

const withoutSecrets = { includeEnv: false, includeSecrets: false };
const withSecrets = { includeEnv: false, includeSecrets: true };

const remote: Record<string, unknown> = {
	"server.all": [{ serverId: "srv1", name: "worker-1", sshKeyId: "k1" }],
	"sshKey.all": [
		{
			sshKeyId: "k1",
			name: "deploy",
			publicKey: "ssh-ed25519 AAA",
			privateKey: "KEY",
		},
	],
	"destination.all": [
		{
			destinationId: "d2",
			name: "zeta",
			provider: "aws",
			secretAccessKey: "s3-secret",
			serverId: "srv1",
		},
		{ destinationId: "d1", name: "alpha", provider: "cloudflare" },
	],
	"registry.all": [],
	"certificates.all": [],
	"notification.all": [
		{
			notificationId: "n1",
			name: "alerts",
			notificationType: "slack",
			appDeploy: true,
			appBuildError: false,
			slack: {
				slackId: "sl1",
				webhookUrl: "https://hooks.example.com/1",
				channel: "#ops",
			},
		},
	],
	"vaultProvider.all": [
		{
			vaultProviderId: "v1",
			name: "infisical",
			config: {
				providerType: "infisical",
				clientId: "id",
				clientSecret: "********",
				projectId: "inf",
				environmentSlug: "prod",
			},
			assignments: [{ projectId: "p1", environmentIds: ["e1"] }],
		},
	],
	"project.all": [
		{
			projectId: "p2",
			name: "zoo",
			environments: [{ environmentId: "e2", name: "production" }],
		},
		{
			projectId: "p1",
			name: "demo",
			environments: [{ environmentId: "e1", name: "production" }],
		},
	],
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
	projectId: "p1",
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
		const config = parseProject(
			await exportProject(project, {
				includeEnv: false,
				includeSecrets: false,
			}),
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
		const config = parseProject(
			await exportProject(project, { includeEnv: true, includeSecrets: false }),
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

const projects = [
	project,
	{
		projectId: "p2",
		name: "zoo",
		environments: [{ name: "production" }],
	},
];

describe("exportOrganization", () => {
	it("exports organization settings by name, sorted, without credentials", async () => {
		const [organization] = parseDocuments(
			await exportOrganization(withoutSecrets),
		);

		expect(organization).toEqual({
			apiVersion: "v1",
			kind: "Organization",
			sshKeys: [{ name: "deploy", publicKey: "ssh-ed25519 AAA" }],
			servers: [{ name: "worker-1", sshKeyName: "deploy" }],
			destinations: [
				{ name: "alpha", provider: "cloudflare" },
				{ name: "zeta", provider: "aws", serverName: "worker-1" },
			],
			notifications: [
				{
					name: "alerts",
					type: "slack",
					appDeploy: true,
					appBuildError: false,
					channel: "#ops",
				},
			],
			vaultProviders: [
				{
					name: "infisical",
					providerType: "infisical",
					clientId: "id",
					projectId: "inf",
					environmentSlug: "prod",
					assignments: [{ project: "demo", environments: ["production"] }],
				},
			],
		});
	});

	it("writes credentials with --include-secrets, except the ones the API masks", async () => {
		const [organization] = parseDocuments(
			await exportOrganization(withSecrets),
		);

		expect(organization).toMatchObject({
			sshKeys: [{ privateKey: "KEY" }],
			destinations: [{ name: "alpha" }, { secretAccessKey: "s3-secret" }],
			notifications: [{ webhookUrl: "https://hooks.example.com/1" }],
		});
		expect(
			organization.kind === "Organization" && organization.vaultProviders?.[0],
		).not.toHaveProperty("clientSecret");
	});
});

describe("exportAll", () => {
	it("writes the organization first, then every project sorted by name", async () => {
		const documents = parseDocuments(await exportAll(withoutSecrets));

		expect(
			documents.map((document) =>
				document.kind === "Project" ? document.name : document.kind,
			),
		).toEqual(["Organization", "demo", "zoo"]);
	});

	it("refuses to export projects that share a name", async () => {
		vi.mocked(apiGet).mockImplementationOnce(async () => [
			{ projectId: "p1", name: "demo" },
			{ projectId: "p3", name: "demo" },
		]);

		await expect(exportAll(withoutSecrets)).rejects.toThrow(
			'Multiple projects named "demo" found',
		);
	});
});
