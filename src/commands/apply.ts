import type { Command } from "commander";
import { reconcile } from "../lib/apply/reconciler.js";
import { errorMessage } from "../lib/apply/remote.js";

export function registerApplyCommand(program: Command) {
	program
		.command("apply")
		.description(
			"Create or update the resources described in a declarative dokploy.yaml",
		)
		.requiredOption("-f, --file <path>", "Path to the dokploy.yaml config file")
		.option("-d, --dry-run", "Preview changes without applying them")
		.option("-v, --verbose", "Show field-level changes")
		.action(
			async (opts: { file: string; dryRun?: boolean; verbose?: boolean }) => {
				const result = await reconcile({
					filePath: opts.file,
					dryRun: opts.dryRun ?? false,
					verbose: opts.verbose ?? false,
				}).catch((error) => {
					throw new Error(errorMessage(error));
				});
				if (result.failed > 0) {
					process.exit(1);
				}
			},
		);
}
