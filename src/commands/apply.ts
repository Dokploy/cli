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
		.option(
			"--deploy",
			"After applying, deploy every service whose configuration changed, and redeploy services whose last deploy by apply failed or no longer matches the file",
		)
		.option(
			"--deploy-title <title>",
			"Title for the deployments --deploy starts",
			"dokploy apply",
		)
		.option(
			"--prune",
			"Delete environments, services and their domains, ports, mounts, redirects, basic auth and schedules that the file doesn't declare",
		)
		.action(
			async (opts: {
				file: string;
				dryRun?: boolean;
				verbose?: boolean;
				prune?: boolean;
				deploy?: boolean;
				deployTitle: string;
			}) => {
				const result = await reconcile({
					filePath: opts.file,
					dryRun: opts.dryRun === true,
					verbose: opts.verbose === true,
					prune: opts.prune === true,
					deploy: opts.deploy === true,
					deployTitle: opts.deployTitle,
				}).catch((error) => {
					throw new Error(errorMessage(error));
				});
				if (result.failed > 0) {
					process.exit(1);
				}
			},
		);
}
