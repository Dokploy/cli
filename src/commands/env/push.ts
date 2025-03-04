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

    static override flags = {}

    public async run(): Promise<void> {
        const {args, flags} = await this.parse(EnvPush)

        if (!fs.existsSync(args.file)) {
            console.log(chalk.red.bold(`\n File ${args.file} doesn't exists \n`));
            return;
        }

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

        const fileContent = fs.readFileSync(args.file, 'utf-8');
        const auth = await readAuthConfig(this);
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
        const projectId = project.projectId;
        const projectSelected = await getProject(projectId, auth, this);

        const choices = [
            ...projectSelected.applications.map((app: any) => ({
                name: `${app.name} (Application)`,
                value: {serviceType: 'app', service: app},
            })),
            ...projectSelected.compose.map((compose: any) => ({
                name: `${compose.name} (Compose)`,
                value: {serviceType: 'compose', service: compose}
            })),
        ]
        const {result: {serviceType, service}} = await inquirer.prompt<any>([
            {
                choices,
                message: "Select a service to pull the environment variables:",
                name: "result",
                type: "list",
            },

        ]);

        if (serviceType === 'app') {
            const {applicationId} = service;
            const response = await axios.post(
                `${auth.url}/api/trpc/application.update`,
                {
                    json: {
                        applicationId,
                        env: fileContent
                    }
                }, {

                    headers: {
                        "x-api-key": auth.token,
                        "Content-Type": "application/json",
                    },
                }
            )
            if (response.status !== 200) {
                this.error(chalk.red("Error stopping application"));
            }
            this.log(chalk.green("Environment variable push successful."));

        }

        if (serviceType === 'compose') {
            const {composeId} = service;
            const response = await axios.post(
                `${auth.url}/api/trpc/compose.update`,
                {
                    json: {
                        composeId,
                        env: fileContent
                    }
                }, {
                    headers: {
                        "x-api-key": auth.token,
                        "Content-Type": "application/json",
                    },
                }
            )
            if (response.status !== 200) {
                this.error(chalk.red("Error stopping application"));
            }
            this.log(chalk.green("Environment variable push successful."));

        }


    }
}
