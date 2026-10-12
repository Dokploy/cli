import * as fs from "node:fs";
import chalk from "chalk";
import type { Command } from "commander";
import { apiGet } from "../client.js";
import { exportProject } from "../lib/apply/exporter.js";
import { errorMessage, requireByName } from "../lib/apply/remote.js";

const exportNamedProject = async (name: string) =>
	exportProject(requireByName(await apiGet("project.all"), name, "Project"));

export function registerExportCommand(program: Command) {
	program
		.command("export")
		.description("Export an existing project as a declarative dokploy.yaml")
		.requiredOption("-p, --project <name>", "Name of the project to export")
		.option("-f, --file <path>", "Write to this file instead of stdout")
		.action(async (opts: { project: string; file?: string }) => {
			const yaml = await exportNamedProject(opts.project).catch((error) => {
				throw new Error(errorMessage(error));
			});
			if (opts.file) {
				fs.writeFileSync(opts.file, yaml, "utf8");
				console.error(
					chalk.green(`Exported project "${opts.project}" to ${opts.file}`),
				);
			} else {
				process.stdout.write(yaml);
			}
		});
}
