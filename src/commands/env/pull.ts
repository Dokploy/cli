import {Args, Command, Flags} from '@oclif/core'
import {readAuthConfig} from "../../utils/utils.js";
import chalk from "chalk";
import {getProject, getProjects} from "../../utils/shared.js";
import inquirer from "inquirer";
import {Answers} from "../app/create.js";
import fs from 'fs';

export default class EnvPull extends Command {
    static override args = {
        file: Args.string({description: 'write to file', required: true}),
    }

    static override description = 'Store remote environment variables in local'

    static override examples = [
        '<%= config.bin %> <%= command.id %> .env.stage.local',
    ]

    static override flags = {}

    public async run(): Promise<void> {
        const {args} = await this.parse(EnvPull)

        if (fs.existsSync(args.file)) {
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
                value: app.env,
            })),
            ...projectSelected.compose.map((compose: any) => ({
                name: `${compose.name} (Compose)`,
                value: compose.env,
            })),
        ]
        const {env} = await inquirer.prompt<any>([
            {
                choices,
                message: "Select a service to pull the environment variables:",
                name: "env",
                type: "list",
            },

        ]);


        fs.writeFileSync(args.file, env || "")
        this.log(chalk.green("Environment variable write to file successful."));


    }
}
