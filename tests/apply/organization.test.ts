import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/client.js", () => ({
	apiGet: vi.fn(),
	apiPost: vi.fn(),
	readAuthConfig: () => ({ url: "https://dokploy.test", token: "token" }),
}));

import { apiGet, apiPost } from "../../src/client.js";
import { parseDocuments } from "../../src/lib/apply/parser.js";
import {
	buildFilePlan,
	executeFilePlan,
} from "../../src/lib/apply/reconciler.js";

const posted = (endpoint: string) =>
	vi.mocked(apiPost).mock.calls.some(([called]) => called === endpoint);

const events = {
	appDeploy: true,
	appBuildError: false,
	databaseBackup: false,
	dokployBackup: false,
	volumeBackup: false,
	dokployRestart: false,
	dockerCleanup: false,
	serverThreshold: false,
};

const routes: Record<string, () => unknown> = {
	"organization.active": () => ({ id: "org1" }),
	"sshKey.all": () =>
		posted("sshKey.create") ? [{ sshKeyId: "k1", name: "deploy" }] : [],
	"server.all": () =>
		posted("server.create")
			? [{ serverId: "s1", name: "worker-1", sshKeyId: "k1" }]
			: [],
	"destination.all": () => [
		{
			destinationId: "d1",
			name: "backups",
			provider: "cloudflare",
			accessKey: "AK",
			secretAccessKey: "old",
			bucket: "dokploy",
			region: "auto",
			endpoint: "https://r2.example.com",
			additionalFlags: null,
			serverId: null,
		},
	],
	"notification.all": () => [
		{
			notificationId: "n1",
			name: "alerts",
			notificationType: "slack",
			...events,
			slack: {
				slackId: "sl1",
				webhookUrl: "https://hooks.example.com/1",
				channel: "#ops",
			},
		},
	],
	"vaultProvider.all": () => [
		{
			vaultProviderId: "v1",
			name: "infisical",
			config: {
				providerType: "infisical",
				siteUrl: "https://app.infisical.com",
				clientId: "id",
				clientSecret: "********",
				projectId: "inf",
				environmentSlug: "prod",
			},
			assignments: [{ projectId: "p0", environmentIds: [] }],
		},
	],
	"project.all": () => [
		{
			projectId: "p0",
			name: "legacy",
			environments: [{ environmentId: "e0", name: "production" }],
		},
		...(posted("project.create")
			? [
					{
						projectId: "p1",
						name: "shop",
						environments: [{ environmentId: "e1", name: "production" }],
					},
				]
			: []),
	],
	"environment.byProjectId": () => [
		{ environmentId: "e1", name: "production" },
	],
	"schedule.list": () => [],
};

const created: Record<string, unknown> = {
	"project.create": { project: { projectId: "p1" } },
	"redis.create": { redisId: "r1" },
};

const restore = `
apiVersion: v1
kind: Organization
sshKeys:
  - name: deploy
    publicKey: ssh-ed25519 AAA
    privateKey: KEY
servers:
  - name: worker-1
    ipAddress: 10.0.0.1
    username: root
    sshKeyName: deploy
destinations:
  - name: backups
    secretAccessKey: new
notifications:
  - name: alerts
    type: slack
    channel: "#deploys"
vaultProviders:
  - name: shop-secrets
    providerType: doppler
    serviceToken: dp.st.1
    assignments:
      - project: shop
        environments: [production]
---
apiVersion: v1
kind: Project
name: shop
environments:
  - name: production
    redis:
      - name: cache
        databasePassword: pw
        serverName: worker-1
`;

describe("Organization documents", () => {
	beforeEach(() => {
		vi.mocked(apiGet).mockReset();
		vi.mocked(apiPost).mockReset();
		vi.mocked(apiGet).mockImplementation(
			async (endpoint) => routes[endpoint]?.() ?? {},
		);
		vi.mocked(apiPost).mockImplementation(
			async (endpoint) => created[endpoint] ?? {},
		);
	});

	it("creates organization resources before projects and secret managers after them", async () => {
		const result = await executeFilePlan(
			await buildFilePlan(parseDocuments(restore), false),
		);

		expect(vi.mocked(apiPost).mock.calls).toEqual([
			[
				"sshKey.create",
				{
					name: "deploy",
					publicKey: "ssh-ed25519 AAA",
					privateKey: "KEY",
					organizationId: "org1",
				},
			],
			[
				"server.create",
				{
					description: "",
					port: 22,
					serverType: "deploy",
					name: "worker-1",
					ipAddress: "10.0.0.1",
					username: "root",
					sshKeyId: "k1",
				},
			],
			[
				"destination.update",
				{
					name: "backups",
					provider: "cloudflare",
					accessKey: "AK",
					secretAccessKey: "new",
					bucket: "dokploy",
					region: "auto",
					endpoint: "https://r2.example.com",
					additionalFlags: null,
					destinationId: "d1",
				},
			],
			[
				"notification.updateSlack",
				{ channel: "#deploys", notificationId: "n1", slackId: "sl1" },
			],
			["project.create", { name: "shop" }],
			[
				"redis.create",
				{
					name: "cache",
					databasePassword: "pw",
					serverId: "s1",
					environmentId: "e1",
				},
			],
			[
				"vaultProvider.create",
				{
					name: "shop-secrets",
					config: { providerType: "doppler", serviceToken: "dp.st.1" },
					assignments: [{ projectId: "p1", environmentIds: ["e1"] }],
				},
			],
		]);
		expect(result).toMatchObject({ created: 6, updated: 2, failed: 0 });
	});

	it("sends the masked placeholder for secret manager credentials it wasn't given", async () => {
		await executeFilePlan(
			await buildFilePlan(
				parseDocuments(
					"apiVersion: v1\nkind: Organization\nvaultProviders:\n  - name: infisical\n    providerType: infisical\n    environmentSlug: staging\n    assignments:\n      - project: legacy\n",
				),
				false,
			),
		);

		expect(vi.mocked(apiPost).mock.calls).toEqual([
			[
				"vaultProvider.update",
				{
					name: "infisical",
					config: {
						clientSecret: "********",
						providerType: "infisical",
						siteUrl: "https://app.infisical.com",
						clientId: "id",
						projectId: "inf",
						environmentSlug: "staging",
					},
					assignments: [{ projectId: "p0", environmentIds: [] }],
					vaultProviderId: "v1",
				},
			],
		]);
	});

	it("leaves resources that already match alone", async () => {
		const plan = await buildFilePlan(
			parseDocuments(
				"apiVersion: v1\nkind: Organization\nnotifications:\n  - name: alerts\n    type: slack\n    channel: '#ops'\n    appDeploy: true\nvaultProviders:\n  - name: infisical\n    providerType: infisical\n    clientSecret: rotated\n    assignments:\n      - project: legacy\n",
			),
			false,
		);

		expect(plan.organization.map((action) => action.type)).toEqual([
			"unchanged",
			"unchanged",
		]);
	});

	it("refuses unknown references, missing credentials and type changes before changing anything", async () => {
		await expect(
			buildFilePlan(
				parseDocuments(
					"apiVersion: v1\nkind: Organization\nservers:\n  - name: worker-2\n    ipAddress: 10.0.0.2\n    username: root\n    sshKeyName: ghost\nnotifications:\n  - name: alerts\n    type: discord\n    webhookUrl: https://discord.example.com\nvaultProviders:\n  - name: doppler\n    providerType: doppler\n    assignments:\n      - project: nope\n",
				),
				false,
			),
		).rejects.toThrow(
			[
				'vaultProvider "doppler" needs serviceToken to be created',
				'notification "alerts" can\'t change type; remove it in the dashboard and apply again',
				'SSH key "ghost" not found',
				'vaultProvider "doppler" is assigned to unknown project "nope"',
			].join("\n  "),
		);
		expect(apiPost).not.toHaveBeenCalled();
	});

	it("rejects a project service on a server nobody declared", async () => {
		await expect(
			buildFilePlan(
				parseDocuments(
					"apiVersion: v1\nkind: Project\nname: shop\nenvironments:\n  - name: production\n    redis:\n      - name: cache\n        databasePassword: pw\n        serverName: worker-1\n",
				),
				false,
			),
		).rejects.toThrow('Server "worker-1" not found');
	});
});
