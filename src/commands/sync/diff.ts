import { Command, Flags } from "@oclif/core";
import chalk from "chalk";

import { DEFAULT_OUTPUT_DIR } from "../../utils/sync/constants.js";
import { computeDiff, formatDiff } from "../../utils/sync/diff.js";
import { fetchFullState } from "../../utils/sync/fetch-state.js";
import { readStateFromDisk } from "../../utils/sync/yaml-io.js";
import { readAuthConfig } from "../../utils/utils.js";

export default class SyncDiff extends Command {
	static description =
		"Compare local YAML state files against the live Dokploy server.";

	static examples = [
		"$ <%= config.bin %> sync diff",
		"$ <%= config.bin %> sync diff -i ./my-state",
		"$ <%= config.bin %> sync diff -p my-project",
	];

	static flags = {
		"input-dir": Flags.string({
			char: "i",
			default: DEFAULT_OUTPUT_DIR,
			description: "Directory containing local YAML state files",
		}),
		project: Flags.string({
			char: "p",
			description: "Filter by project name or ID",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(SyncDiff);

		const inputDir = flags["input-dir"];
		const projectFilter = flags.project;

		this.log(chalk.blue(`Reading local state from ${inputDir}/...`));
		const localState = readStateFromDisk(inputDir);

		if (localState.projects.length === 0) {
			this.error(
				chalk.red(
					`No state files found in ${inputDir}/. Run 'sync pull' first.`,
				),
			);
		}

		this.log(chalk.blue("Fetching remote state from Dokploy..."));
		const remoteState = await fetchFullState(auth, this, projectFilter);

		const changes = computeDiff(localState, remoteState);

		this.log("");
		this.log(formatDiff(changes));

		if (changes.length > 0) {
			const modified = changes.filter((c) => c.type === "modified").length;
			const added = changes.filter((c) => c.type === "added").length;
			const removed = changes.filter((c) => c.type === "removed").length;
			this.log(
				chalk.bold(
					`Summary: ${modified} modified, ${added} local-only, ${removed} remote-only`,
				),
			);
		}
	}
}
