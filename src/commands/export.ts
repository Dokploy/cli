import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import inquirer from "inquirer";
import * as fs from "node:fs";

import { exportProject } from "../lib/apply/exporter.js";
import { readAuthConfig } from "../utils/utils.js";
import { getProjects } from "../utils/shared.js";

export default class Export extends Command {
  static description = "Export an existing project as a declarative dokploy.yaml config";

  static examples = [
    "<%= config.bin %> export",
    "<%= config.bin %> export -p my-project",
    "<%= config.bin %> export -p my-project -f dokploy.yaml",
  ];

  static flags = {
    project: Flags.string({
      char: "p",
      description: "Project name to export",
      required: false,
    }),
    file: Flags.string({
      char: "f",
      description: "Output file path (prints to stdout if omitted)",
      required: false,
    }),
  };

  public async run(): Promise<void> {
    const auth = await readAuthConfig(this);
    const { flags } = await this.parse(Export);

    // Get projects list
    const projects = await getProjects(auth, this);
    if (projects.length === 0) {
      this.error(chalk.red("No projects found on the server."));
    }

    let selectedProject: any;

    if (flags.project) {
      // Find by name
      const matching = projects.filter((p) => p.name === flags.project);
      if (matching.length === 0) {
        this.error(
          chalk.red(
            `Project "${flags.project}" not found. Available projects: ${projects.map((p) => p.name).join(", ")}`,
          ),
        );
      }
      if (matching.length > 1) {
        this.error(
          chalk.red(
            `Multiple projects named "${flags.project}" found. Please resolve the ambiguity in the Dokploy UI.`,
          ),
        );
      }
      selectedProject = matching[0];
    } else {
      // Interactive selection
      const { project } = await inquirer.prompt([
        {
          type: "list",
          name: "project",
          message: "Select a project to export:",
          choices: projects.map((p) => ({
            name: `${p.name}${p.description ? ` — ${p.description}` : ""}`,
            value: p,
          })),
        },
      ]);
      selectedProject = project;
    }

    const projectId = selectedProject.projectId;
    if (!projectId) {
      this.error(chalk.red("Selected project has no ID."));
    }

    const yaml = await exportProject(auth, projectId);

    if (flags.file) {
      fs.writeFileSync(flags.file, yaml, "utf8");
      this.log(
        chalk.green(`Exported project "${selectedProject.name}" to ${flags.file}`),
      );
    } else {
      this.log(yaml);
    }
  }
}
