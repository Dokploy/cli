import { Command, Flags } from "@oclif/core";
import chalk from "chalk";
import inquirer from "inquirer";

import {
	buildApplyPlan,
	executeApplyPlan,
	formatApplyPlan,
} from "../../utils/sync/apply.js";
import { DEFAULT_OUTPUT_DIR } from "../../utils/sync/constants.js";
import { computeDiff } from "../../utils/sync/diff.js";
import { fetchFullState } from "../../utils/sync/fetch-state.js";
import { readStateFromDisk } from "../../utils/sync/yaml-io.js";
import { readAuthConfig } from "../../utils/utils.js";

export default class SyncPush extends Command {
	static description =
		"Push local YAML state changes to the live Dokploy server.";

	static examples = [
		"$ <%= config.bin %> sync push",
		"$ <%= config.bin %> sync push --dry-run",
		"$ <%= config.bin %> sync push -i ./my-state --yes",
		"$ <%= config.bin %> sync push -p my-project",
	];

	static flags = {
		"dry-run": Flags.boolean({
			char: "d",
			default: false,
			description: "Show what would be updated without making changes",
		}),
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
		yes: Flags.boolean({
			char: "y",
			default: false,
			description: "Skip confirmation prompt",
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(SyncPush);

		const inputDir = flags["input-dir"];
		const projectFilter = flags.project;
		const dryRun = flags["dry-run"];
		const skipConfirm = flags.yes;

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

		if (changes.length === 0) {
			this.log(
				chalk.green(
					"No differences found. Local state matches remote.",
				),
			);
			return;
		}

		const plan = buildApplyPlan(changes);
		const updates = plan.filter((a) => a.type === "update");

		this.log("");
		this.log(formatApplyPlan(plan));

		if (updates.length === 0) {
			this.log(chalk.yellow("No applicable updates to push."));
			return;
		}

		if (dryRun) {
			this.log(chalk.yellow("Dry run - no changes applied."));
			return;
		}

		if (!skipConfirm) {
			const { proceed } = await inquirer.prompt([
				{
					default: false,
					message: `Apply ${updates.length} update(s) to the remote server?`,
					name: "proceed",
					type: "confirm",
				},
			]);

			if (!proceed) {
				this.log(chalk.yellow("Push cancelled."));
				return;
			}
		}

		this.log(chalk.blue("\nApplying updates..."));
		const result = await executeApplyPlan(plan, auth, this);

		this.log("");
		if (result.failed === 0) {
			this.log(
				chalk.green(
					`All ${result.success} update(s) applied successfully.`,
				),
			);
		} else {
			this.log(
				chalk.yellow(
					`${result.success} succeeded, ${result.failed} failed.`,
				),
			);
		}
	}
}
