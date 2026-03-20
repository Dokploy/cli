import { Command } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";

import { readAuthConfig } from "../../utils/utils.js";

type GithubProvider = {
	gitProvider: { gitProviderId: string; name: string };
	githubId: string;
};

export default class GithubList extends Command {
	static override description = "List connected GitHub providers.";

	static override examples = ["$ <%= config.bin %> github list"];

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);

		const response = await axios.get(`${auth.url}/api/trpc/github.githubProviders`, {
			headers: { "Content-Type": "application/json", "x-api-key": auth.token },
		});

		const providers: GithubProvider[] = response.data.result.data.json ?? [];

		if (!providers.length) {
			this.log(chalk.yellow("No GitHub providers connected. Run `dokploy github connect` first."));
			return;
		}

		this.log(chalk.blue.bold("\n── GitHub Providers ─────────────────────────────\n"));
		for (const p of providers) {
			this.log(`  ${chalk.green(p.gitProvider.name)}  githubId: ${chalk.dim(p.githubId)}`);
		}
		this.log("");
	}
}
