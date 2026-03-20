import {Args, Command, Flags} from '@oclif/core'
import fs from "fs";
import chalk from "chalk";
import inquirer from "inquirer";
import {readAuthConfig} from "../../utils/utils.js";
import {getProject, getProjects} from "../../utils/shared.js";
import {Answers} from "../app/create.js";
import axios from "axios";

export default class EnvPush extends Command {
    static override args = {
        file: Args.string({description: '.env file to push', required: true}),
    }

    static override description = 'Push dotenv file to remote service'

    static override examples = [
        '<%= config.bin %> <%= command.id %> .env.stage.local',
    ]

    static override flags = {
        composeId: Flags.string({
            description: "ID of the compose service to push env vars to",
            required: false,
        }),
        environmentId: Flags.string({
            char: "e",
            description: "ID of the environment",
            required: false,
        }),
        projectId: Flags.string({
            char: "p",
            description: "ID of the project",
            required: false,
        }),
        yes: Flags.boolean({
            char: "y",
            default: false,
            description: "Skip confirmation prompt",
        }),
    }

    public async run(): Promise<void> {
        const {args, flags} = await this.parse(EnvPush)

        if (!fs.existsSync(args.file)) {
            console.log(chalk.red.bold(`\n File ${args.file} doesn't exists \n`));
            return;
        }

        if (!flags.yes) {
            const {override} = await inquirer.prompt<any>([
                {
                    message: `This command will override entire remote environment variables. Do you want to continue?`,
                    name: "override",
                    default: false,
                    type: "confirm",
                },
            ]);
            if (!override) {
                return
            }
        }

        const fileContent = fs.readFileSync(args.file, 'utf-8');
        const auth = await readAuthConfig(this);

        // Non-interactive path: composeId provided directly
        if (flags.composeId) {
            const response = await axios.post(
                `${auth.url}/api/trpc/compose.update`,
                { json: { composeId: flags.composeId, env: fileContent } },
                { headers: { "x-api-key": auth.token, "Content-Type": "application/json" } }
            );
            if (response.status !== 200) {
                this.error(chalk.red("Error pushing environment variables"));
            }
            this.log(chalk.green("Environment variable push successful."));
            return;
        }

        console.log(chalk.blue.bold("\n  Listing all Projects \n"));

        const projects = await getProjects(auth, this);

        let projectId = flags.projectId;
        if (!projectId) {
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

        let environmentId = flags.environmentId;
        let environment: any;
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
            environmentId = environment.environmentId;
        } else {
            environment = projectSelected.environments.find((e: any) => e.environmentId === environmentId);
        }

        const choices = [
            ...environment.applications.map((app: any) => ({
                name: `${app.name} (Application)`,
                value: {serviceType: 'app', service: app},
            })),
            ...environment.compose.map((compose: any) => ({
                name: `${compose.name} (Compose)`,
                value: {serviceType: 'compose', service: compose}
            })),
        ]
        const {result: {serviceType, service}} = await inquirer.prompt<any>([
            {
                choices,
                message: "Select a service to push the environment variables:",
                name: "result",
                type: "list",
            },

        ]);

        if (serviceType === 'app') {
            const {applicationId} = service;
            const response = await axios.post(
                `${auth.url}/api/trpc/application.update`,
                { json: { applicationId, env: fileContent } },
                { headers: { "x-api-key": auth.token, "Content-Type": "application/json" } }
            )
            if (response.status !== 200) {
                this.error(chalk.red("Error pushing environment variables"));
            }
            this.log(chalk.green("Environment variable push successful."));
        }

        if (serviceType === 'compose') {
            const {composeId} = service;
            const response = await axios.post(
                `${auth.url}/api/trpc/compose.update`,
                { json: { composeId, env: fileContent } },
                { headers: { "x-api-key": auth.token, "Content-Type": "application/json" } }
            )
            if (response.status !== 200) {
                this.error(chalk.red("Error pushing environment variables"));
            }
            this.log(chalk.green("Environment variable push successful."));
        }
    }
}
