import { Command } from "@oclif/core";
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
		"Add a domain to an application. Supports custom domains or auto-generated traefik.me domains.";

	static override examples = [
		"<%= config.bin %> app add-domain",
	];

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		this.log(chalk.blue.bold("\n  Listing all Projects \n"));
		const projects = await getProjects(auth, this);

		const { project } = await inquirer.prompt<{ project: { name: string; projectId: string } }>([
			{
				choices: projects.map((p) => ({ name: p.name, value: p })),
				message: "Select a project:",
				name: "project",
				type: "list",
			},
		]);

		const projectDetails = await getProject(project.projectId, auth, this);

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

		if (environment.applications.length === 0) {
			this.error(chalk.red("No applications found in this environment."));
		}

		const { application } = await inquirer.prompt<{ application: Application }>([
			{
				choices: environment.applications.map((app) => ({
					name: `${app.appName}:${app.name}`,
					value: app,
				})),
				message: "Select an application:",
				name: "application",
				type: "list",
			},
		]);

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

		let host: string;
		let https = false;
		let certificateType: CertificateType = "none";
		let customCertResolver: string | undefined;

		if (domainMode === "traefik") {
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

		const { path, port } = await inquirer.prompt<{ path: string; port: number }>([
			{
				default: 3000,
				message: "Port:",
				name: "port",
				type: "number",
				validate: (input: number) => (input > 0 && input <= 65_535 ? true : "Port must be between 1 and 65535"),
			},
			{
				default: "/",
				message: "Path prefix:",
				name: "path",
				type: "input",
				validate: (input: string) => (input.startsWith("/") ? true : "Path must start with /"),
			},
		]);

		await this.createDomain(auth, {
			applicationId: application.applicationId,
			certificateType,
			customCertResolver,
			host,
			https,
			path,
			port,
		});

		this.log(chalk.green(`\n✓ Domain ${chalk.bold(host)} added to ${application.name} successfully.`));
	}

	private async createDomain(auth: AuthConfig, domain: DomainInput): Promise<void> {
		const response = await axios.post(
			`${auth.url}/api/trpc/domain.create`,
			{
				json: {
					applicationId: domain.applicationId,
					certificateType: domain.certificateType,
					customCertResolver: domain.customCertResolver,
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
