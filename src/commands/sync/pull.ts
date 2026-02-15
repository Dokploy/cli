import { Command, Flags } from "@oclif/core";
import chalk from "chalk";

import { DEFAULT_OUTPUT_DIR } from "../../utils/sync/constants.js";
import { fetchFullState } from "../../utils/sync/fetch-state.js";
import { writeStateToDisk } from "../../utils/sync/yaml-io.js";
import { readAuthConfig } from "../../utils/utils.js";

export default class SyncPull extends Command {
	static description =
		"Pull the full Dokploy state and write it to local YAML files.";

	static examples = [
		"$ <%= config.bin %> sync pull",
		"$ <%= config.bin %> sync pull -o ./my-state",
		"$ <%= config.bin %> sync pull -p my-project --redact",
	];

	static flags = {
		"output-dir": Flags.string({
			char: "o",
			default: DEFAULT_OUTPUT_DIR,
			description: "Directory to write YAML state files",
		}),
		project: Flags.string({
			char: "p",
			description: "Filter by project name or ID",
			required: false,
		}),
		redact: Flags.boolean({
			char: "r",
			default: false,
			description: "Replace sensitive fields with redacted placeholders",
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(SyncPull);

		const outputDir = flags["output-dir"];
		const projectFilter = flags.project;
		const redact = flags.redact;

		this.log(chalk.blue("Fetching state from Dokploy..."));

		const state = await fetchFullState(auth, this, projectFilter);

		let totalApps = 0;
		let totalCompose = 0;
		let totalDbs = 0;
		for (const p of state.projects) {
			for (const e of p.environments) {
				totalApps += e.applications.length;
				totalCompose += e.compose.length;
				totalDbs += e.databases.length;
			}
		}

		writeStateToDisk(state, outputDir, redact);

		this.log(chalk.green(`State written to ${outputDir}/`));
		this.log(
			chalk.green(
				`  ${state.projects.length} project(s), ${totalApps} application(s), ${totalCompose} compose service(s), ${totalDbs} database(s)`,
			),
		);
		if (redact) {
			this.log(chalk.yellow("  Sensitive fields have been redacted."));
		}
	}
}
