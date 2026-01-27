import { Command, Flags } from "@oclif/core";
import { readAuthConfig } from "../../utils/utils.js";
import chalk from "chalk";
import { getProject, getProjects, type Application } from "../../utils/shared.js";
import inquirer from "inquirer";
import type { Answers } from "./create.js";
import axios from "axios";

type ServiceType = "application" | "compose";

type Service = {
	id: string;
	name: string;
	type: ServiceType;
};

export default class AppDeploy extends Command {
	static description = "Deploy an application or compose service.";

	static examples = [
		"$ <%= config.bin %> app deploy",
		"$ <%= config.bin %> app deploy --id myAppId",
		"$ <%= config.bin %> app deploy --id myComposeId --type compose",
	];

	static flags = {
		id: Flags.string({
			char: 'i',
			description: 'ID of the application or compose service to deploy',
			required: false,
		}),
		type: Flags.string({
			char: 't',
			description: 'Type of service: application or compose (auto-detected if not specified)',
			required: false,
			options: ['application', 'compose'],
		}),
		projectId: Flags.string({
			char: 'p',
			description: 'ID of the project',
			required: false,
		}),
		environmentId: Flags.string({
			char: 'e',
			description: 'ID of the environment',
			required: false,
		}),
		skipConfirm: Flags.boolean({
			char: 'y',
			description: 'Skip confirmation prompt',
			default: false,
		})
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(AppDeploy);
		let { projectId, environmentId } = flags;

		let serviceId = flags.id;
		let serviceType: ServiceType | undefined = flags.type as ServiceType | undefined;

		// Interactive mode only if we don't have both id and type
		const needsInteractiveMode = !(serviceId && serviceType) && (!projectId || !serviceId || !environmentId);
		if (needsInteractiveMode) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			let selectedProject;
			let selectedEnvironment;

			// 1. Select project
			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project to deploy from:",
						name: "project",
						type: "list",
					},
				]);
				selectedProject = project;
				projectId = project.projectId;
			} else {
				selectedProject = projects.find(p => p.projectId === projectId);
			}

			// 2. Select environment
			if (!environmentId) {
				if (!selectedProject?.environments || selectedProject.environments.length === 0) {
					this.error(chalk.yellow("No environments found in this project."));
				}

				const { environment } = await inquirer.prompt([
					{
						choices: selectedProject.environments.map((env) => ({
							name: `${env.name} (${env.description})`,
							value: env,
						})),
						message: "Select an environment:",
						name: "environment",
						type: "list",
					},
				]);
				selectedEnvironment = environment;
				environmentId = environment.environmentId;
			} else {
				selectedEnvironment = selectedProject?.environments?.find(e => e.environmentId === environmentId);
			}

			// 3. Select service (application or compose)
			if (!serviceId) {
				const applications = selectedEnvironment?.applications || [];
				const composeServices = selectedEnvironment?.compose || [];

				if (applications.length === 0 && composeServices.length === 0) {
					this.error(chalk.yellow("No services found in this environment."));
				}

				// Combine applications and compose services into one list
				const services: Service[] = [
					...applications.map((app: Application) => ({
						id: app.applicationId,
						name: `${app.name} (Application)`,
						type: "application" as ServiceType,
					})),
					...composeServices.map((compose: any) => ({
						id: compose.composeId,
						name: `${compose.name} (Compose)`,
						type: "compose" as ServiceType,
					})),
				];

				const serviceAnswers = await inquirer.prompt([
					{
						choices: services.map((svc) => ({
							name: svc.name,
							value: svc,
						})),
						message: "Select the service to deploy:",
						name: "selectedService",
						type: "list",
					},
				]);
				serviceId = serviceAnswers.selectedService.id;
				serviceType = serviceAnswers.selectedService.type;
			}
		}

		// Auto-detect service type if not specified
		if (!serviceType && serviceId) {
			serviceType = await this.detectServiceType(auth, projectId!, environmentId!, serviceId);
		}

		if (!serviceType) {
			this.error(chalk.red("Could not determine service type. Please specify --type application or --type compose"));
		}

		// Confirm if --skipConfirm not specified
		if (!flags.skipConfirm) {
			const confirmAnswers = await inquirer.prompt([
				{
					default: false,
					message: `Are you sure you want to deploy this ${serviceType}?`,
					name: "confirmDeploy",
					type: "confirm",
				},
			]);

			if (!confirmAnswers.confirmDeploy) {
				this.error(chalk.yellow("Deployment cancelled."));
			}
		}

		try {
			const endpoint = serviceType === "compose"
				? `${auth.url}/api/trpc/compose.deploy`
				: `${auth.url}/api/trpc/application.deploy`;

			const payload = serviceType === "compose"
				? { json: { composeId: serviceId } }
				: { json: { applicationId: serviceId } };

			const response = await axios.post(
				endpoint,
				payload,
				{
					headers: {
						"x-api-key": auth.token,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.status !== 200) {
				this.error(chalk.red(`Error deploying ${serviceType}`));
			}
			this.log(chalk.green(`${serviceType === "compose" ? "Compose" : "Application"} deploy successful.`));
		} catch (error: any) {
			this.error(chalk.red(`Error deploying ${serviceType}: ${error.message}`));
		}
	}

	private async detectServiceType(
		auth: { url: string; token: string },
		projectId: string,
		environmentId: string,
		serviceId: string
	): Promise<ServiceType | undefined> {
		try {
			const project = await getProject(projectId, auth, this);
			const environment = project?.environments?.find(
				(e: any) => e.environmentId === environmentId
			);

			if (!environment) return undefined;

			// Check if it's an application
			const app = environment.applications?.find(
				(a: any) => a.applicationId === serviceId
			);
			if (app) return "application";

			// Check if it's a compose service
			const compose = environment.compose?.find(
				(c: any) => c.composeId === serviceId
			);
			if (compose) return "compose";

			return undefined;
		} catch {
			return undefined;
		}
	}
}
