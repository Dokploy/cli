import {Args, Command, Flags} from '@oclif/core'
import {readAuthConfig} from "../../utils/utils.js";
import chalk from "chalk";
import {getProject, getProjects} from "../../utils/shared.js";
import inquirer from "inquirer";
import {Answers} from "../app/create.js";
import axios from "axios";
import fs from 'fs';

export default class EnvPull extends Command {
    static override args = {
        file: Args.string({description: 'write to file', required: true}),
    }

    static override description = 'Store remote environment variables in local'

    static override examples = [
        '<%= config.bin %> <%= command.id %> .env.stage.local',
        '<%= config.bin %> <%= command.id %> .env.local --appId <id>',
        '<%= config.bin %> <%= command.id %> .env.local -p <projectId> -e <environmentId> -s <serviceName>',
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
            description: 'ID of the project (skip project selection prompt)',
            required: false,
        }),
        environmentId: Flags.string({
            char: 'e',
            description: 'ID of the environment (skip environment selection prompt)',
            required: false,
        }),
        serviceName: Flags.string({
            char: 's',
            description: 'Name of the service (skip service selection prompt)',
            required: false,
        }),
        skipConfirm: Flags.boolean({
            char: 'y',
            description: 'Skip confirmation prompt when overriding existing file',
            default: false,
        }),
    }

    public async run(): Promise<void> {
        const {args, flags} = await this.parse(EnvPull)
        const {appId, projectId: flagProjectId, environmentId: flagEnvironmentId, serviceName, skipConfirm} = flags;

        if (fs.existsSync(args.file)) {
            if (skipConfirm) {
                this.log(chalk.yellow(`Overriding ${args.file} file...`));
            } else {
                const {override} = await inquirer.prompt<any>([
                    {
                        message: `Do you want to override ${args.file} file?`,
                        name: "override",
                        default: false,
                        type: "confirm",
                    },
                ]);
                if (!override) {
                    return
                }
            }
        }

        const auth = await readAuthConfig(this);

        let env: string;

        // Direct fetch by appId (auto-detect application or compose)
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
                    env = response.data.result.data.json.env || "";
                    fs.writeFileSync(args.file, env);
                    this.log(chalk.green(`Environment variables from application '${response.data.result.data.json.name}' written to file.`));
                    return;
                }
            } catch {
                // Not an application, try compose
            }

            // Try compose
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
                    env = response.data.result.data.json.env || "";
                    fs.writeFileSync(args.file, env);
                    this.log(chalk.green(`Environment variables from compose service '${response.data.result.data.json.name}' written to file.`));
                    return;
                }
            } catch {
                // Not found
            }

            this.error(chalk.red(`Service with ID '${appId}' not found (tried both application and compose).`));
        }

        // Interactive/flag-based flow
        let projectId = flagProjectId;
        let environmentId = flagEnvironmentId;

        // If projectId not provided, show interactive selection
        if (!projectId) {
            console.log(chalk.blue.bold("\n  Listing all Projects \n"));
            const projects = await getProjects(auth, this);
            const {project} = await inquirer.prompt<Answers>([
                {
                    choices: projects.map((project) => ({
                        name: project.name,
                        value: project,
                    })),
                    message: "Select the project:",
                    name: "project",
                    type: "list",
                },
            ]);
            projectId = project.projectId;
        }

        const projectSelected = await getProject(projectId, auth, this);

        let environment;

        // If environmentId not provided, show interactive selection
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
            // Find environment by ID
            environment = projectSelected.environments.find(
                (env: any) => env.environmentId === environmentId
            );
            if (!environment) {
                this.error(chalk.red(`Environment with ID '${environmentId}' not found in project.`));
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

        if (choices.length === 0) {
            this.error(chalk.red("No services found in this environment."));
        }

        // If serviceName not provided, show interactive selection
        if (!serviceName) {
            const result = await inquirer.prompt<any>([
                {
                    choices,
                    message: "Select a service to pull the environment variables:",
                    name: "env",
                    type: "list",
                },
            ]);
            env = result.env;
        } else {
            // Find service by name
            const service = choices.find(
                (choice) => choice.serviceName.toLowerCase() === serviceName.toLowerCase()
            );
            if (!service) {
                this.error(chalk.red(`Service '${serviceName}' not found. Available services: ${choices.map(c => c.serviceName).join(', ')}`));
            }
            env = service.value;
        }

        fs.writeFileSync(args.file, env || "")
        this.log(chalk.green("Environment variable write to file successful."));
    }
}
