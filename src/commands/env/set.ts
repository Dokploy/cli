import {Args, Command, Flags} from '@oclif/core'
import {readAuthConfig} from "../../utils/utils.js";
import chalk from "chalk";
import {getProject, getProjects} from "../../utils/shared.js";
import inquirer from "inquirer";
import {Answers} from "../app/create.js";
import axios from "axios";

export default class EnvSet extends Command {
    static override args = {
        key: Args.string({description: 'Environment variable key', required: true}),
        value: Args.string({description: 'Environment variable value', required: true}),
    }

    static override description = 'Set a single environment variable on a service'

    static override examples = [
        '<%= config.bin %> <%= command.id %> DATABASE_URL postgres://localhost:5432/db',
        '<%= config.bin %> <%= command.id %> DATABASE_URL postgres://localhost:5432/db -a <appId>',
    ]

    static override flags = {
        appId: Flags.string({
            char: 'a',
            description: 'ID of the app (application or compose, auto-detected)',
            required: false,
            exclusive: ['projectId', 'environmentId', 'serviceName'],
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
        serviceName: Flags.string({
            char: 's',
            description: 'Name of the service',
            required: false,
        }),
        skipConfirm: Flags.boolean({
            char: 'y',
            description: 'Skip confirmation prompt',
            default: false,
        }),
    }

    private parseEnv(envString: string): Record<string, string> {
        const result: Record<string, string> = {};
        const lines = envString.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) continue;
            const key = trimmed.substring(0, eqIndex);
            const value = trimmed.substring(eqIndex + 1);
            result[key] = value;
        }
        return result;
    }

    private serializeEnv(envVars: Record<string, string>): string {
        return Object.entries(envVars)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');
    }

    public async run(): Promise<void> {
        const {args, flags} = await this.parse(EnvSet)
        const {appId, projectId: flagProjectId, environmentId: flagEnvironmentId, serviceName, skipConfirm} = flags;

        const auth = await readAuthConfig(this);

        let envString: string = "";
        let serviceType: 'application' | 'compose' = 'application';
        let serviceId: string = "";
        let serviceFriendlyName: string = "";

        // Direct fetch by appId
        if (appId) {
            // Try application first
            try {
                const response = await axios.get(`${auth.url}/api/trpc/application.one`, {
                    headers: {
                        "x-api-key": auth.token,
                        "Content-Type": "application/json",
                    },
                    params: {
                        input: JSON.stringify({ json: { applicationId: appId } }),
                    },
                });

                if (response.data.result?.data?.json) {
                    envString = response.data.result.data.json.env || "";
                    serviceType = 'application';
                    serviceId = appId;
                    serviceFriendlyName = response.data.result.data.json.name;
                }
            } catch {
                // Try compose
            }

            if (!serviceId) {
                try {
                    const response = await axios.get(`${auth.url}/api/trpc/compose.one`, {
                        headers: {
                            "x-api-key": auth.token,
                            "Content-Type": "application/json",
                        },
                        params: {
                            input: JSON.stringify({ json: { composeId: appId } }),
                        },
                    });

                    if (response.data.result?.data?.json) {
                        envString = response.data.result.data.json.env || "";
                        serviceType = 'compose';
                        serviceId = appId;
                        serviceFriendlyName = response.data.result.data.json.name;
                    }
                } catch {
                    this.error(chalk.red(`Service with ID '${appId}' not found.`));
                }
            }
        } else {
            // Interactive flow
            let projectId = flagProjectId;
            let environmentId = flagEnvironmentId;

            if (!projectId) {
                console.log(chalk.blue.bold("\n  Listing all Projects \n"));
                const projects = await getProjects(auth, this);
                const {project} = await inquirer.prompt<Answers>([
                    {
                        choices: projects.map((p) => ({ name: p.name, value: p })),
                        message: "Select the project:",
                        name: "project",
                        type: "list",
                    },
                ]);
                projectId = project.projectId;
            }

            const projectSelected = await getProject(projectId, auth, this);

            let environment;
            if (!environmentId) {
                const result = await inquirer.prompt<any>([
                    {
                        choices: projectSelected.environments.map((env: any) => ({
                            name: env.name,
                            value: env,
                        })),
                        message: "Select the environment:",
                        name: "environment",
                        type: "list",
                    },
                ]);
                environment = result.environment;
            } else {
                environment = projectSelected.environments.find(
                    (env: any) => env.environmentId === environmentId
                );
                if (!environment) {
                    this.error(chalk.red(`Environment not found.`));
                }
            }

            const choices = [
                ...environment.applications.map((app: any) => ({
                    name: `${app.name} (Application)`,
                    value: { type: 'application', id: app.applicationId, env: app.env, friendlyName: app.name },
                    serviceName: app.name,
                })),
                ...environment.compose.map((compose: any) => ({
                    name: `${compose.name} (Compose)`,
                    value: { type: 'compose', id: compose.composeId, env: compose.env, friendlyName: compose.name },
                    serviceName: compose.name,
                })),
            ];

            let selected;
            if (!serviceName) {
                const result = await inquirer.prompt<any>([
                    {
                        choices,
                        message: "Select a service:",
                        name: "selected",
                        type: "list",
                    },
                ]);
                selected = result.selected;
            } else {
                const service = choices.find(
                    (c) => c.serviceName.toLowerCase() === serviceName.toLowerCase()
                );
                if (!service) {
                    this.error(chalk.red(`Service '${serviceName}' not found.`));
                }
                selected = service.value;
            }

            envString = selected.env;
            serviceType = selected.type;
            serviceId = selected.id;
            serviceFriendlyName = selected.friendlyName;
        }

        // Parse, update, and serialize env
        const envVars = this.parseEnv(envString);
        const isNew = envVars[args.key] === undefined;
        const oldValue = envVars[args.key];

        if (!skipConfirm) {
            const action = isNew ? 'add' : 'update';
            const message = isNew
                ? `Add '${args.key}=${args.value}' to ${serviceFriendlyName}?`
                : `Update '${args.key}' from '${oldValue}' to '${args.value}' on ${serviceFriendlyName}?`;

            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message,
                    default: false,
                },
            ]);

            if (!confirm) {
                this.log(chalk.yellow("Cancelled."));
                return;
            }
        }

        envVars[args.key] = args.value;
        const newEnvString = this.serializeEnv(envVars);

        // Push updated env
        try {
            if (serviceType === 'application') {
                await axios.post(
                    `${auth.url}/api/trpc/application.update`,
                    { json: { applicationId: serviceId, env: newEnvString } },
                    {
                        headers: {
                            "x-api-key": auth.token,
                            "Content-Type": "application/json",
                        },
                    }
                );
            } else {
                await axios.post(
                    `${auth.url}/api/trpc/compose.update`,
                    { json: { composeId: serviceId, env: newEnvString } },
                    {
                        headers: {
                            "x-api-key": auth.token,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            const action = isNew ? 'added' : 'updated';
            this.log(chalk.green(`Environment variable '${args.key}' ${action} successfully.`));
        } catch (error: any) {
            this.error(chalk.red(`Failed to update environment variable: ${error.message}`));
        }
    }
}
