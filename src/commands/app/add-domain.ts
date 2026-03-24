import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { type Application, type Environment, getProject, getProjects } from "../../utils/shared.js";
import { type AuthConfig, readAuthConfig } from "../../utils/utils.js";

type CertificateType = "custom" | "letsencrypt" | "none";

type DomainInput = {
	applicationId: string;
	certificateType: CertificateType;
	customCertResolver?: string;
	host: string;
	https: boolean;
	path: string;
	port: number;
};

export default class AppAddDomain extends Command {
	static override description =
		"Add a domain to an application. Supports custom domains (with optional HTTPS/Let's Encrypt) or auto-generated traefik.me domains (free, no DNS setup required, no SSL).";

	static override examples = [
		"<%= config.bin %> app add-domain",
		"<%= config.bin %> app add-domain --applicationId myAppId --host api.example.com --port 80",
		"<%= config.bin %> app add-domain --applicationId myAppId --host api.example.com --https --certificateType letsencrypt -y",
		"DOKPLOY_URL=xxx DOKPLOY_AUTH_TOKEN=xxx <%= config.bin %> app add-domain --applicationId myAppId --host api.example.com -y",
	];

	static override flags = {
		applicationId: Flags.string({
			char: "a",
			description: "ID of the application to add the domain to",
			required: false,
		}),
		certificateType: Flags.string({
			description: "Certificate type: letsencrypt, custom, or none",
			options: ["letsencrypt", "custom", "none"],
			required: false,
		}),
		customCertResolver: Flags.string({
			description: "Custom certificate resolver name (required when certificateType is custom)",
			required: false,
		}),
		environmentId: Flags.string({
			char: "e",
			description: "ID of the environment",
			required: false,
		}),
		host: Flags.string({
			char: "H",
			description: "Domain hostname (e.g. api.example.com)",
			required: false,
		}),
		https: Flags.boolean({
			description: "Enable HTTPS",
			default: false,
			required: false,
		}),
		path: Flags.string({
			description: "URL path prefix (default: /)",
			default: "/",
			required: false,
		}),
		port: Flags.integer({
			description: "Port the application listens on (default: 3000)",
			default: 3000,
			required: false,
		}),
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		skipConfirm: Flags.boolean({
			char: "y",
			description: "Skip confirmation prompt",
			default: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(AppAddDomain);
		let { applicationId, projectId, environmentId } = flags;

		// --- Interactive selection if applicationId not provided ---
		if (!applicationId) {
			this.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			let selectedProject;
			let selectedEnvironment;

			if (!projectId) {
				const { project } = await inquirer.prompt<{ project: { name: string; projectId: string } }>([
					{
						choices: projects.map((p) => ({ name: p.name, value: p })),
						message: "Select a project:",
						name: "project",
						type: "list",
					},
				]);
				selectedProject = project;
				projectId = project.projectId;
			} else {
				selectedProject = projects.find((p) => p.projectId === projectId);
			}

			const projectDetails = await getProject(projectId, auth, this);

			if (!environmentId) {
				const { environment } = await inquirer.prompt<{ environment: Environment }>([
					{
						choices: projectDetails.environments.map((e: Environment) => ({
							name: e.name,
							value: e,
						})),
						message: "Select an environment:",
						name: "environment",
						type: "list",
					},
				]);
				selectedEnvironment = environment;
				environmentId = environment.environmentId;
			} else {
				selectedEnvironment = projectDetails.environments?.find(
					(e: Environment) => e.environmentId === environmentId,
				);
			}

			if (!selectedEnvironment?.applications || selectedEnvironment.applications.length === 0) {
				this.error(chalk.red("No applications found in this environment."));
			}

			const { application } = await inquirer.prompt<{ application: Application }>([
				{
					choices: selectedEnvironment.applications.map((app: Application) => ({
						name: `${app.name} (${app.appName})`,
						value: app,
					})),
					message: "Select an application:",
					name: "application",
					type: "list",
				},
			]);

			applicationId = application.applicationId;

			// Collect domain settings interactively
			const domainInput = await this.collectDomainInteractive(auth, application, flags);

			if (!flags.skipConfirm) {
				const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
					{
						default: false,
						message: `Add domain ${chalk.bold(domainInput.host)} to ${chalk.bold(application.name)}?`,
						name: "confirm",
						type: "confirm",
					},
				]);
				if (!confirm) {
					this.error(chalk.yellow("Cancelled."));
				}
			}

			await this.createDomain(auth, domainInput);
			this.log(chalk.green(`\n✓ Domain ${chalk.bold(domainInput.host)} added to ${application.name} successfully.`));
			return;
		}

		// --- Non-interactive mode: applicationId provided via flag ---
		let { host, https, path, port } = flags;
		const certificateType = (flags.certificateType as CertificateType | undefined) ?? "none";
		const { customCertResolver } = flags;

		if (!host) {
			this.error(chalk.red("--host is required when --applicationId is provided. Use interactive mode (omit --applicationId) or pass --host."));
		}

		if (https && certificateType === "custom" && !customCertResolver) {
			this.error(chalk.red("--customCertResolver is required when --certificateType is custom."));
		}

		if (!flags.skipConfirm) {
			const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
				{
					default: false,
					message: `Add domain ${chalk.bold(host)} to application ${chalk.bold(applicationId)}?`,
					name: "confirm",
					type: "confirm",
				},
			]);
			if (!confirm) {
				this.error(chalk.yellow("Cancelled."));
			}
		}

		await this.createDomain(auth, {
			applicationId,
			certificateType,
			customCertResolver,
			host,
			https,
			path,
			port,
		});

		this.log(chalk.green(`\n✓ Domain ${chalk.bold(host)} added successfully.`));
	}

	private async collectDomainInteractive(
		auth: AuthConfig,
		application: Application,
		flags: { host?: string; https: boolean; certificateType?: string; customCertResolver?: string; port: number; path: string },
	): Promise<DomainInput> {
		// Domain mode selection (only if host not already provided via flag)
		let host = flags.host;
		let https = flags.https;
		let certificateType: CertificateType = (flags.certificateType as CertificateType) ?? "none";
		let customCertResolver = flags.customCertResolver;

		if (!host) {
			const { domainMode } = await inquirer.prompt<{ domainMode: "custom" | "traefik" }>([
				{
					choices: [
						{ name: "Custom domain", value: "custom" },
						{ name: "Generate traefik.me domain (free, no SSL)", value: "traefik" },
					],
					message: "Domain type:",
					name: "domainMode",
					type: "list",
				},
			]);

			if (domainMode === "traefik") {
				this.log(chalk.yellow("\n  ℹ traefik.me domains are free and require no DNS setup,"));
				this.log(chalk.yellow("    but do not support HTTPS/SSL certificates.\n"));
				host = await this.generateTraefikDomain(auth, application);
				this.log(chalk.dim(`  Generated: ${host}`));
			} else {
				const answers = await inquirer.prompt<{ host: string; https: boolean }>([
					{
						message: "Enter domain (e.g. api.example.com):",
						name: "host",
						type: "input",
						validate: (input: string) => (input.trim() ? true : "Domain is required"),
					},
					{
						default: false,
						message: "Enable HTTPS?",
						name: "https",
						type: "confirm",
					},
				]);

				host = answers.host.trim();
				https = answers.https;

				if (https) {
					const { cert } = await inquirer.prompt<{ cert: CertificateType }>([
						{
							choices: [
								{ name: "Let's Encrypt", value: "letsencrypt" },
								{ name: "Custom resolver", value: "custom" },
								{ name: "None", value: "none" },
							],
							message: "Certificate type:",
							name: "cert",
							type: "list",
						},
					]);
					certificateType = cert;

					if (cert === "custom") {
						const { resolver } = await inquirer.prompt<{ resolver: string }>([
							{
								message: "Custom certificate resolver name:",
								name: "resolver",
								type: "input",
								validate: (input: string) => (input.trim() ? true : "Resolver name is required"),
							},
						]);
						customCertResolver = resolver.trim();
					}
				}
			}
		}

		const { port, path } = await inquirer.prompt<{ path: string; port: number }>([
			{
				default: flags.port,
				message: "Port:",
				name: "port",
				type: "number",
				validate: (input: number) => (input > 0 && input <= 65_535 ? true : "Port must be between 1 and 65535"),
			},
			{
				default: flags.path,
				message: "Path prefix:",
				name: "path",
				type: "input",
				validate: (input: string) => (input.startsWith("/") ? true : "Path must start with /"),
			},
		]);

		return {
			applicationId: application.applicationId,
			certificateType,
			customCertResolver,
			host: host!,
			https,
			path,
			port,
		};
	}

	private async createDomain(auth: AuthConfig, domain: DomainInput): Promise<void> {
		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/domain.create`,
				{
					json: {
						applicationId: domain.applicationId,
						certificateType: domain.certificateType,
						...(domain.customCertResolver ? { customCertResolver: domain.customCertResolver } : {}),
						domainType: "application",
						host: domain.host,
						https: domain.https,
						path: domain.path,
						port: domain.port,
					},
				},
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": auth.token,
					},
				},
			);

			if (response.status !== 200) {
				this.error(chalk.red("Failed to create domain."));
			}
		} catch (error: unknown) {
			const axiosError = error as { response?: { data?: { error?: { json?: { message?: string } } } }; message?: string };
			const message =
				axiosError?.response?.data?.error?.json?.message ??
				(error instanceof Error ? error.message : String(error));
			this.error(chalk.red(`Failed to create domain: ${message}`));
		}
	}

	private async generateTraefikDomain(auth: AuthConfig, app: Application): Promise<string> {
		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/domain.generateDomain`,
				{
					json: {
						appName: app.appName,
						...(app.serverId ? { serverId: app.serverId } : {}),
					},
				},
				{
					headers: {
						"Content-Type": "application/json",
						"x-api-key": auth.token,
					},
				},
			);
			return response.data.result.data.json as string;
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			this.error(chalk.red(`Failed to generate traefik.me domain: ${message}`));
		}
	}
}
