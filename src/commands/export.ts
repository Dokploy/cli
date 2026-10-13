import * as fs from "node:fs";
import chalk from "chalk";
import type { Command } from "commander";
import { apiGet } from "../client.js";
import { type ExportOptions, exportProject } from "../lib/apply/exporter.js";
import { errorMessage, requireByName } from "../lib/apply/remote.js";

const exportNamedProject = async (name: string, options: ExportOptions) => {
	const { projectId } = requireByName(
		await apiGet("project.all"),
		name,
		"Project",
	);
	return exportProject(await apiGet("project.one", { projectId }), options);
};

export function registerExportCommand(program: Command) {
	program
		.command("export")
		.description("Export an existing project as a declarative dokploy.yaml")
		.requiredOption("-p, --project <name>", "Name of the project to export")
		.option("-f, --file <path>", "Write to this file instead of stdout")
		.option(
			"--include-env",
			"Include env, buildArgs and buildSecrets (written in plain text)",
		)
		.action(
			async (opts: {
				project: string;
				file?: string;
				includeEnv?: boolean;
			}) => {
				const yaml = await exportNamedProject(opts.project, {
					includeEnv: opts.includeEnv === true,
				}).catch((error) => {
					throw new Error(errorMessage(error));
				});
				if (opts.file) {
					fs.writeFileSync(opts.file, yaml, { encoding: "utf8", mode: 0o600 });
					fs.chmodSync(opts.file, 0o600);
					console.error(
						chalk.green(`Exported project "${opts.project}" to ${opts.file}`),
					);
				} else {
					process.stdout.write(yaml);
				}
			},
		);
}
