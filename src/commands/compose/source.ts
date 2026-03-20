import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";

import { getProject, getProjects } from "../../utils/shared.js";
import { type AuthConfig, readAuthConfig } from "../../utils/utils.js";

type GithubProvider = {
	githubId: string;
	gitProvider: { name: string };
};

type GithubRepo = {
	full_name: string;
	name: string;
	owner: { login: string };
};

type GithubBranch = {
	name: string;
};

export default class ComposeSource extends Command {
	static override description = "Configure the GitHub source for a Docker Compose service.";

	static override examples = [
		"$ <%= config.bin %> compose source",
		"$ <%= config.bin %> compose source --composeId <id> --githubId <id> --repository wordpress-template --owner samuelteixeiras --branch main -y",
	];

	static override flags = {
		branch: Flags.string({
			char: "b",
			description: "Branch to deploy from",
			required: false,
		}),
		composeId: Flags.string({
			char: "c",
			description: "ID of the compose service to configure",
			required: false,
		}),
		environmentId: Flags.string({
			char: "e",
			description: "ID of the environment",
			required: false,
		}),
		githubId: Flags.string({
			description: "ID of the GitHub provider",
			required: false,
		}),
		owner: Flags.string({
			description: "GitHub repository owner",
			required: false,
		}),
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		repository: Flags.string({
			char: "r",
			description: "GitHub repository name",
			required: false,
		}),
		skipConfirm: Flags.boolean({
			char: "y",
			default: false,
			description: "Skip confirmation prompt",
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(ComposeSource);
		let { branch, composeId, environmentId, githubId, owner, projectId, repository } = flags;

		// Resolve composeId interactively if not provided
		if (!composeId) {
			this.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const { project } = await inquirer.prompt<{ project: { projectId: string } }>([
					{
						choices: projects.map((p) => ({ name: p.name, value: p })),
						message: "Select a project:",
						name: "project",
						type: "list",
					},
				]);
				projectId = project.projectId;
			}

			const projectDetails = await getProject(projectId, auth, this);

			if (!environmentId) {
				const { environment } = await inquirer.prompt<{ environment: { environmentId: string } }>([
					{
						choices: projectDetails.environments.map((e: any) => ({
							name: e.name,
							value: e,
						})),
						message: "Select an environment:",
						name: "environment",
						type: "list",
					},
				]);
				environmentId = environment.environmentId;
			}

			const environment = projectDetails.environments.find(
				(e: any) => e.environmentId === environmentId,
			) as any;

			if (!environment?.compose?.length) {
				this.error(chalk.red("No compose services found in this environment."));
			}

			const { selectedCompose } = await inquirer.prompt<{ selectedCompose: string }>([
				{
					choices: environment.compose.map((c: any) => ({ name: c.name, value: c.composeId })),
					message: "Select the compose service to configure:",
					name: "selectedCompose",
					type: "list",
				},
			]);
			composeId = selectedCompose;
		}

		// Resolve GitHub provider
		const providers = await this.fetchGithubProviders(auth);
		if (!providers.length) {
			this.error(chalk.red("No GitHub providers connected. Run `dokploy github connect` first."));
		}

		if (!githubId) {
			const { provider } = await inquirer.prompt<{ provider: GithubProvider }>([
				{
					choices: providers.map((p) => ({ name: p.gitProvider.name, value: p })),
					message: "Select GitHub provider:",
					name: "provider",
					type: "list",
				},
			]);
			githubId = provider.githubId;
		}

		// Resolve repository
		if (!repository || !owner) {
			this.log(chalk.dim("  Fetching repositories..."));
			const repos = await this.fetchRepos(auth, githubId);
			if (!repos.length) {
				this.error(chalk.red("No repositories accessible for this provider."));
			}
			const { repo } = await inquirer.prompt<{ repo: GithubRepo }>([
				{
					choices: repos.map((r) => ({ name: r.full_name, value: r })),
					message: "Select repository:",
					name: "repo",
					type: "list",
				},
			]);
			repository = repo.name;
			owner = repo.owner.login;
		}

		// Resolve branch
		if (!branch) {
			this.log(chalk.dim("  Fetching branches..."));
			const branches = await this.fetchBranches(auth, repository, owner, githubId);
			const { selectedBranch } = await inquirer.prompt<{ selectedBranch: string }>([
				{
					choices: branches.map((b) => ({ name: b.name, value: b.name })),
					message: "Select branch:",
					name: "selectedBranch",
					type: "list",
				},
			]);
			branch = selectedBranch;
		}

		if (!flags.skipConfirm) {
			this.log(chalk.bold("\nSummary:"));
			this.log(chalk.dim(`  Repository: ${owner}/${repository}`));
			this.log(chalk.dim(`  Branch:     ${branch}`));
			const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
				{
					default: true,
					message: "Save configuration?",
					name: "confirm",
					type: "confirm",
				},
			]);
			if (!confirm) {
				this.log(chalk.yellow("Cancelled."));
				return;
			}
		}

		await axios.post(
			`${auth.url}/api/trpc/compose.update`,
			{
				json: {
					branch,
					composeId,
					githubId,
					owner,
					repository,
					sourceType: "github",
				},
			},
			{
				headers: {
					"Content-Type": "application/json",
					"x-api-key": auth.token,
				},
			},
		);

		this.log(chalk.green("\n✓ Compose source configured successfully!"));
		this.log(chalk.dim(`  Run \`dokploy compose deploy --composeId ${composeId} -y\` to deploy.`));
	}

	private async fetchBranches(auth: AuthConfig, repo: string, owner: string, githubId: string): Promise<GithubBranch[]> {
		const response = await axios.get(`${auth.url}/api/trpc/github.getGithubBranches`, {
			headers: { "Content-Type": "application/json", "x-api-key": auth.token },
			params: { input: JSON.stringify({ json: { githubId, owner, repo } }) },
		});
		return response.data.result.data.json ?? [];
	}

	private async fetchGithubProviders(auth: AuthConfig): Promise<GithubProvider[]> {
		const response = await axios.get(`${auth.url}/api/trpc/github.githubProviders`, {
			headers: { "Content-Type": "application/json", "x-api-key": auth.token },
		});
		return response.data.result.data.json ?? [];
	}

	private async fetchRepos(auth: AuthConfig, githubId: string): Promise<GithubRepo[]> {
		const response = await axios.get(`${auth.url}/api/trpc/github.getGithubRepositories`, {
			headers: { "Content-Type": "application/json", "x-api-key": auth.token },
			params: { input: JSON.stringify({ json: { githubId } }) },
		});
		return response.data.result.data.json ?? [];
	}
}
