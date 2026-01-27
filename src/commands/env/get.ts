import {Args, Command, Flags} from '@oclif/core'
import {readAuthConfig} from "../../utils/utils.js";
import chalk from "chalk";
import {getProject, getProjects} from "../../utils/shared.js";
import inquirer from "inquirer";
import {Answers} from "../app/create.js";
import axios from "axios";

export default class EnvGet extends Command {
    static override args = {
        key: Args.string({description: 'Environment variable key to get', required: true}),
    }

    static override description = 'Get a single environment variable value from a service'

    static override examples = [
        '<%= config.bin %> <%= command.id %> DATABASE_URL',
        '<%= config.bin %> <%= command.id %> DATABASE_URL -a <appId>',
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

    public async run(): Promise<void> {
        const {args, flags} = await this.parse(EnvGet)
        const {appId, projectId: flagProjectId, environmentId: flagEnvironmentId, serviceName} = flags;

        const auth = await readAuthConfig(this);

        let envString: string = "";

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
                }
            } catch {
                // Try compose
            }

            if (!envString) {
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
                    value: app.env,
                    serviceName: app.name,
                })),
                ...environment.compose.map((compose: any) => ({
                    name: `${compose.name} (Compose)`,
                    value: compose.env,
                    serviceName: compose.name,
                })),
            ];

            if (!serviceName) {
                const result = await inquirer.prompt<any>([
                    {
                        choices,
                        message: "Select a service:",
                        name: "env",
                        type: "list",
                    },
                ]);
                envString = result.env;
            } else {
                const service = choices.find(
                    (c) => c.serviceName.toLowerCase() === serviceName.toLowerCase()
                );
                if (!service) {
                    this.error(chalk.red(`Service '${serviceName}' not found.`));
                }
                envString = service.value;
            }
        }

        const envVars = this.parseEnv(envString);
        const value = envVars[args.key];

        if (value === undefined) {
            this.error(chalk.red(`Environment variable '${args.key}' not found.`));
        }

        this.log(value);
    }
}
