import * as fs from "node:fs";
import chalk from "chalk";
import type { Command } from "commander";
import { apiGet } from "../client.js";
import {
	type ExportOptions,
	exportAll,
	exportProject,
} from "../lib/apply/exporter.js";
import { errorMessage, requireByName } from "../lib/apply/remote.js";
import type { Fields } from "../lib/apply/resources.js";

const exportOneProject = async (idOrName: string, options: ExportOptions) => {
	const projects: Fields[] = await apiGet("project.all");
	const { projectId } =
		projects.find((project) => project.projectId === idOrName) ??
		requireByName(projects, idOrName, "Project");
	return exportProject(await apiGet("project.one", { projectId }), options);
};

const writePrivate = (file: string, content: string) => {
	const fd = fs.openSync(file, "w", 0o600);
	try {
		fs.fchmodSync(fd, 0o600);
		fs.writeFileSync(fd, content, "utf8");
	} finally {
		fs.closeSync(fd);
	}
};

interface ExportFlags {
	project?: string;
	all?: boolean;
	file?: string;
	includeEnv?: boolean;
	includeSecrets?: boolean;
}

const selection = (opts: ExportFlags) => {
	if (opts.all === true && opts.project) {
		throw new Error("Use either --project or --all, not both");
	}
	if (opts.all !== true && !opts.project) {
		throw new Error("Pass --project <id or name>, or --all");
	}
	return opts.project;
};

export function registerExportCommand(program: Command) {
	program
		.command("export")
		.description(
			"Export a project, or everything with --all, as a declarative dokploy.yaml",
		)
		.option("-p, --project <id-or-name>", "Id or name of the project to export")
		.option(
			"-a, --all",
			"Export every project plus organization settings: SSH keys, servers, S3 destinations, registries, certificates, notifications and secret managers",
		)
		.option("-f, --file <path>", "Write to this file instead of stdout")
		.option(
			"--include-env",
			"Include env, buildArgs and buildSecrets (written in plain text)",
		)
		.option(
			"--include-secrets",
			"Include env plus every password, key and token Dokploy returns (written in plain text)",
		)
		.action(async (opts: ExportFlags) => {
			const project = selection(opts);
			const options = {
				includeEnv: opts.includeEnv === true,
				includeSecrets: opts.includeSecrets === true,
			};
			const yaml = await (project
				? exportOneProject(project, options)
				: exportAll(options)
			).catch((error) => {
				throw new Error(errorMessage(error));
			});
			if (opts.file) {
				writePrivate(opts.file, yaml);
				console.error(chalk.green(`Exported to ${opts.file}`));
			} else {
				process.stdout.write(yaml);
			}
		});
}
