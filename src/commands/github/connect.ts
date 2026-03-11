import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import * as crypto from "node:crypto";
import * as http from "node:http";

import { type AuthConfig, readAuthConfig } from "../../utils/utils.js";

type GitProviderRecord = {
	gitProviderId: string;
	github: {
		githubAppName: string;
		githubId: string;
		githubInstallationId: null | string;
	} | null;
	name: string;
	providerType: string;
};

type FullProvider = {
	gitProvider: { gitProviderId: string; name: string };
	githubId: string;
};

export function buildRedirectPage(action: string, manifestHtmlSafe: string): string {
	return [
		"<!DOCTYPE html>",
		"<html>",
		"<head><title>Connecting to GitHub...</title></head>",
		"<body>",
		'<p style="font-family:sans-serif">Redirecting to GitHub to create the Dokploy app...</p>',
		`<form id="f" action="${action}" method="post">`,
		`  <input type="hidden" name="manifest" value="${manifestHtmlSafe}">`,
		"</form>",
		'<script>document.getElementById("f").submit();</script>',
		"</body>",
		"</html>",
	].join("\n");
}

export default class GithubConnect extends Command {
	static description =
		"Connect a GitHub account as a git provider via GitHub App.";

	static examples = [
		"$ <%= config.bin %> github connect",
		"$ <%= config.bin %> github connect --org my-organization",
	];

	static flags = {
		org: Flags.string({
			char: "o",
			description:
				"GitHub organization name (creates an org-level app instead of a personal one)",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(GithubConnect);
		const baseUrl = auth.url;

		// 1. Get current user info (userId + organizationId)
		let userId: string;
		let organizationId: string;
		try {
			const userResponse = await axios.get(`${baseUrl}/api/trpc/user.get`, {
				headers: {
					"Content-Type": "application/json",
					"x-api-key": auth.token,
				},
			});
			const member = userResponse.data.result.data.json;
			userId = member.userId;
			organizationId = member.organizationId;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			this.error(chalk.red(`Failed to fetch user info: ${message}`));
		}

		// 2. Snapshot existing git providers (to detect the new one after creation)
		const beforeProviders = await this.fetchAllGitProviders(auth);

		// 3. Build GitHub App manifest (mirrors the web UI flow)
		const appName = `Dokploy-${new Date().toISOString().split("T")[0]}-${crypto.randomBytes(4).toString("hex")}`;
		/* eslint-disable camelcase, perfectionist/sort-objects */
		const manifest = {
			name: appName,
			url: baseUrl,
			redirect_url: `${baseUrl}/api/providers/github/setup?organizationId=${organizationId}&userId=${userId}`,
			hook_attributes: { url: `${baseUrl}/api/deploy/github` },
			callback_urls: [`${baseUrl}/api/providers/github/setup`],
			public: false,
			request_oauth_on_install: true,
			default_permissions: {
				contents: "read",
				emails: "read",
				metadata: "read",
				pull_requests: "write",
			},
			default_events: ["pull_request", "push"],
		};
		/* eslint-enable camelcase, perfectionist/sort-objects */

		// 4. Serve an auto-submitting form and open the browser
		const port = await this.getAvailablePort();
		const githubFormAction = flags.org
			? `https://github.com/organizations/${flags.org}/settings/apps/new?state=gh_init:${organizationId}:${userId}`
			: `https://github.com/settings/apps/new?state=gh_init:${organizationId}:${userId}`;

		const manifestJson = JSON.stringify(manifest);
		const manifestHtmlSafe = manifestJson
			.replaceAll("&", "&amp;")
			.replaceAll('"', "&quot;");

		const server = http.createServer((_req, res) => {
			res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
			res.end(buildRedirectPage(githubFormAction, manifestHtmlSafe));
		});

		await new Promise<void>((resolve) => {
			server.listen(port, "127.0.0.1", resolve);
		});

		this.log(chalk.blue.bold("\n── Step 1/2: Create GitHub App ─────────────────\n"));
		this.log(
			chalk.dim(
				`If your browser does not open, visit: http://localhost:${port}\n`,
			),
		);

		const { default: open } = await import("open");
		await open(`http://localhost:${port}`);

		// 5. Phase 1 – poll git-provider.getAll until the new github provider appears
		this.log(chalk.yellow("Waiting for GitHub App to be created..."));

		let newProvider: GitProviderRecord | null = null;
		const phase1Timeout = Date.now() + 5 * 60 * 1000;

		/* eslint-disable no-await-in-loop */
		while (Date.now() < phase1Timeout) {
			await new Promise((r) => { setTimeout(r, 3000); });
			process.stdout.write(".");

			try {
				const after = await this.fetchAllGitProviders(auth);
				const found = after.find(
					(p) =>
						p.providerType === "github" &&
						p.github !== null &&
						!beforeProviders.some(
							(b) => b.gitProviderId === p.gitProviderId,
						),
				);
				if (found) {
					newProvider = found;
					break;
				}
			} catch {
				// Network hiccup – keep polling
			}
		}
		/* eslint-enable no-await-in-loop */

		server.close();
		process.stdout.write("\n");

		if (!newProvider?.github) {
			this.error(
				chalk.red(
					"\nTimed out waiting for GitHub App creation. Please try again.",
				),
			);
		}

		const { githubAppName, githubId } = newProvider.github;
		this.log(chalk.green(`\n✓ GitHub App created: ${newProvider.name}`));

		// 6. Phase 2 – open the installation URL and wait for githubInstallationId
		this.log(chalk.blue.bold("\n── Step 2/2: Install GitHub App ────────────────\n"));
		this.log(chalk.dim("Opening browser to install the app on your repositories...\n"));

		const installUrl = `${githubAppName}/installations/new?state=gh_setup:${githubId}`;
		await open(installUrl);

		this.log(chalk.yellow("Waiting for app installation to complete..."));

		const phase2Timeout = Date.now() + 5 * 60 * 1000;
		let installed = false;

		/* eslint-disable no-await-in-loop */
		while (Date.now() < phase2Timeout) {
			await new Promise((r) => { setTimeout(r, 3000); });
			process.stdout.write(".");

			try {
				const providers = await this.fetchFullProviders(auth);
				if (providers.some((p) => p.githubId === githubId)) {
					installed = true;
					break;
				}
			} catch {
				// Network hiccup – keep polling
			}
		}
		/* eslint-enable no-await-in-loop */

		process.stdout.write("\n");

		if (!installed) {
			this.error(
				chalk.red(
					"\nTimed out waiting for app installation. " +
					`You can install it manually at: ${installUrl}`,
				),
			);
		}

		this.log(chalk.green("\n✓ GitHub provider connected and installed successfully!"));
		this.log(chalk.dim(`  Provider: ${newProvider.name}`));
		this.log(chalk.dim(`  ID:       ${githubId}`));
	}

	/**
	 * Returns all git providers including partial ones (no installation required).
	 * @param auth - authenticated config with url and token
	 * @returns list of git provider records
	 */
	private async fetchAllGitProviders(auth: AuthConfig): Promise<GitProviderRecord[]> {
		const response = await axios.get(
			`${auth.url}/api/trpc/gitProvider.getAll`,
			{
				headers: {
					"Content-Type": "application/json",
					"x-api-key": auth.token,
				},
			},
		);
		return response.data.result.data.json ?? [];
	}

	/**
	 * Returns only fully configured providers (creation + installation complete).
	 * @param auth - authenticated config with url and token
	 * @returns list of full provider records
	 */
	private async fetchFullProviders(auth: AuthConfig): Promise<FullProvider[]> {
		const response = await axios.get(
			`${auth.url}/api/trpc/github.githubProviders`,
			{
				headers: {
					"Content-Type": "application/json",
					"x-api-key": auth.token,
				},
			},
		);
		return response.data.result.data.json ?? [];
	}

	private getAvailablePort(): Promise<number> {
		return new Promise((resolve, reject) => {
			const server = http.createServer();
			server.listen(0, "127.0.0.1", () => {
				const addr = server.address();
				const port = typeof addr === "object" && addr ? addr.port : null;
				server.close((err) => {
					if (err || !port) return reject(err ?? new Error("No port"));
					resolve(port);
				});
			});
		});
	}
}
