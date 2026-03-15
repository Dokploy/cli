import { Command, Flags } from "@oclif/core";
import chalk from "chalk";

import { ConfigParseError } from "../lib/apply/parser.js";
import { reconcile } from "../lib/apply/reconciler.js";
import { readAuthConfig } from "../utils/utils.js";

export default class Apply extends Command {
  static description = "Apply a declarative dokploy.yaml config to create or update resources on the server";

  static examples = [
    "<%= config.bin %> apply -f dokploy.yaml",
    "<%= config.bin %> apply -f dokploy.yaml --dry-run",
    "<%= config.bin %> apply -f dokploy.yaml --verbose",
  ];

  static flags = {
    file: Flags.string({
      char: "f",
      description: "Path to the dokploy.yaml config file",
      required: true,
    }),
    "dry-run": Flags.boolean({
      char: "d",
      description: "Preview changes without applying them",
      default: false,
    }),
    verbose: Flags.boolean({
      char: "v",
      description: "Show detailed output including field-level changes",
      default: false,
    }),
  };

  public async run(): Promise<void> {
    const auth = await readAuthConfig(this);
    const { flags } = await this.parse(Apply);

    try {
      const result = await reconcile(auth, {
        filePath: flags.file,
        dryRun: flags["dry-run"],
        verbose: flags.verbose,
      });

      if (result.failed > 0) {
        this.exit(1);
      }
    } catch (err: any) {
      if (err instanceof ConfigParseError) {
        this.error(chalk.red(err.message));
      }
      this.error(chalk.red(`Apply failed: ${err.message}`));
    }
  }
}
