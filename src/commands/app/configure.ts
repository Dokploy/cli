import { Command, Flags } from "@oclif/core";
import axios from "axios";
import chalk from "chalk";
import inquirer from "inquirer";
import { readAuthConfig, type AuthConfig } from "../../utils/utils.js";
import { getProjects } from "../../utils/shared.js";
import type { Answers } from "./create.js";

// ── Types ──────────────────────────────────────────────────────────────────────

type GithubProvider = {
	githubId: string;
	gitProvider: { name: string };
};

type GithubRepo = {
	name: string;
	owner: { login: string };
	full_name: string;
};

type GithubBranch = {
	name: string;
};

type BuildType =
	| "nixpacks"
	| "dockerfile"
	| "heroku_buildpacks"
	| "paketo_buildpacks"
	| "static"
	| "railpack";

// ── Command ────────────────────────────────────────────────────────────────────

export default class AppConfigure extends Command {
	static description =
		"Configure the GitHub source and build settings for an application.";

	static examples = [
		"$ <%= config.bin %> app configure",
		"$ <%= config.bin %> app configure --applicationId myAppId",
	];

	static flags = {
		applicationId: Flags.string({
			char: "a",
			description: "ID of the application to configure",
			required: false,
		}),
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		environmentId: Flags.string({
			char: "e",
			description: "ID of the environment",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(AppConfigure);
		let { applicationId, projectId, environmentId } = flags;

		// ── Step 1: resolve applicationId interactively if not provided ──────────
		if (!applicationId) {
			console.log(chalk.blue.bold("\n  Listing all Projects\n"));
			const projects = await getProjects(auth, this);

			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						type: "list",
						name: "project",
						message: "Select a project:",
						choices: projects.map((p) => ({ name: p.name, value: p })),
					},
				]);
				projectId = project.projectId;
				const selectedProject = project;

				if (!environmentId) {
					if (!selectedProject.environments?.length) {
						this.error(chalk.yellow("No environments found in this project."));
					}
					const { environment } = await inquirer.prompt([
						{
							type: "list",
							name: "environment",
							message: "Select an environment:",
							choices: selectedProject.environments!.map((e) => ({
								name: `${e.name} (${e.description})`,
								value: e,
							})),
						},
					]);
					environmentId = environment.environmentId;

					if (!environment.applications?.length) {
						this.error(chalk.yellow("No applications found in this environment."));
					}
					const { app } = await inquirer.prompt([
						{
							type: "list",
							name: "app",
							message: "Select the application to configure:",
							choices: environment.applications.map((a: any) => ({
								name: a.name,
								value: a.applicationId,
							})),
						},
					]);
					applicationId = app;
				}
			}
		}

		// ── Step 2: pick GitHub provider ─────────────────────────────────────────
		console.log(chalk.blue.bold("\n  GitHub Source\n"));

		const providers = await this.fetchGithubProviders(auth);
		if (!providers.length) {
			this.error(
				chalk.red(
					"No GitHub providers connected. Run `dokploy github connect` first.",
				),
			);
		}

		const { provider } = await inquirer.prompt<{ provider: GithubProvider }>([
			{
				type: "list",
				name: "provider",
				message: "Select GitHub provider:",
				choices: providers.map((p) => ({
					name: p.gitProvider.name,
					value: p,
				})),
			},
		]);

		// ── Step 3: pick repository ───────────────────────────────────────────────
		this.log(chalk.dim("  Fetching repositories..."));
		const repos = await this.fetchRepos(auth, provider.githubId);
		if (!repos.length) {
			this.error(chalk.red("No repositories accessible for this provider."));
		}

		const { repo } = await inquirer.prompt<{ repo: GithubRepo }>([
			{
				type: "list",
				name: "repo",
				message: "Select repository:",
				choices: repos.map((r) => ({ name: r.full_name, value: r })),
			},
		]);

		// ── Step 4: pick branch ───────────────────────────────────────────────────
		this.log(chalk.dim("  Fetching branches..."));
		const branches = await this.fetchBranches(
			auth,
			repo.name,
			repo.owner.login,
			provider.githubId,
		);

		const { branch } = await inquirer.prompt<{ branch: string }>([
			{
				type: "list",
				name: "branch",
				message: "Select branch:",
				choices: branches.map((b) => ({ name: b.name, value: b.name })),
			},
		]);

		// ── Step 5: advanced source options ───────────────────────────────────────
		const { buildPath, triggerType, enableSubmodules } = await inquirer.prompt([
			{
				type: "input",
				name: "buildPath",
				message: "Build path:",
				default: "/",
			},
			{
				type: "list",
				name: "triggerType",
				message: "Trigger deployments on:",
				choices: [
					{ name: "Push to branch", value: "push" },
					{ name: "New tag", value: "tag" },
				],
				default: "push",
			},
			{
				type: "confirm",
				name: "enableSubmodules",
				message: "Enable git submodules?",
				default: false,
			},
		]);

		// ── Step 6: build type ────────────────────────────────────────────────────
		console.log(chalk.blue.bold("\n  Build Settings\n"));

		const { buildType } = await inquirer.prompt<{ buildType: BuildType }>([
			{
				type: "list",
				name: "buildType",
				message: "Build type:",
				choices: [
					{ name: "Nixpacks (recommended)", value: "nixpacks" },
					{ name: "Dockerfile", value: "dockerfile" },
					{ name: "Heroku Buildpacks", value: "heroku_buildpacks" },
					{ name: "Paketo Buildpacks", value: "paketo_buildpacks" },
					{ name: "Static", value: "static" },
					{ name: "Railpack", value: "railpack" },
				],
				default: "nixpacks",
			},
		]);

		// Build-type specific options
		const buildOptions: Record<string, any> = {};

		if (buildType === "dockerfile") {
			const answers = await inquirer.prompt([
				{
					type: "input",
					name: "dockerfile",
					message: "Dockerfile path:",
					default: "Dockerfile",
				},
				{
					type: "input",
					name: "dockerContextPath",
					message: "Docker context path (leave blank for default):",
					default: "",
				},
				{
					type: "input",
					name: "dockerBuildStage",
					message: "Build stage (leave blank for default):",
					default: "",
				},
			]);
			buildOptions.dockerfile = answers.dockerfile;
			if (answers.dockerContextPath)
				buildOptions.dockerContextPath = answers.dockerContextPath;
			if (answers.dockerBuildStage)
				buildOptions.dockerBuildStage = answers.dockerBuildStage;
		} else if (buildType === "nixpacks") {
			const { publishDirectory } = await inquirer.prompt([
				{
					type: "input",
					name: "publishDirectory",
					message: "Publish directory (leave blank if not needed):",
					default: "",
				},
			]);
			if (publishDirectory) buildOptions.publishDirectory = publishDirectory;
		} else if (buildType === "static") {
			const answers = await inquirer.prompt([
				{
					type: "input",
					name: "publishDirectory",
					message: "Publish directory:",
					default: "dist",
				},
				{
					type: "confirm",
					name: "isStaticSpa",
					message: "Is this a Single Page Application (SPA)?",
					default: false,
				},
			]);
			buildOptions.publishDirectory = answers.publishDirectory;
			buildOptions.isStaticSpa = answers.isStaticSpa;
		} else if (buildType === "heroku_buildpacks") {
			const { herokuVersion } = await inquirer.prompt([
				{
					type: "input",
					name: "herokuVersion",
					message: "Heroku stack version:",
					default: "24",
				},
			]);
			buildOptions.herokuVersion = herokuVersion;
		} else if (buildType === "railpack") {
			const { railpackVersion } = await inquirer.prompt([
				{
					type: "input",
					name: "railpackVersion",
					message: "Railpack version:",
					default: "0.15.4",
				},
			]);
			buildOptions.railpackVersion = railpackVersion;
		}

		// ── Step 7: confirm & save ────────────────────────────────────────────────
		console.log();
		this.log(chalk.bold("Summary:"));
		this.log(chalk.dim(`  Repository:  ${repo.full_name}`));
		this.log(chalk.dim(`  Branch:      ${branch}`));
		this.log(chalk.dim(`  Build path:  ${buildPath}`));
		this.log(chalk.dim(`  Trigger:     ${triggerType}`));
		this.log(chalk.dim(`  Build type:  ${buildType}`));
		console.log();

		const { confirm } = await inquirer.prompt([
			{
				type: "confirm",
				name: "confirm",
				message: "Save configuration?",
				default: true,
			},
		]);

		if (!confirm) {
			this.log(chalk.yellow("Cancelled."));
			return;
		}

		// Save GitHub source
		await axios.post(
			`${auth.url}/api/trpc/application.saveGithubProvider`,
			{
				json: {
					applicationId,
					githubId: provider.githubId,
					repository: repo.name,
					owner: repo.owner.login,
					branch,
					buildPath,
					triggerType,
					enableSubmodules,
				},
			},
			{
				headers: {
					"x-api-key": auth.token,
					"Content-Type": "application/json",
				},
			},
		);

		// Save build type — all fields must be sent (null when not applicable)
		await axios.post(
			`${auth.url}/api/trpc/application.saveBuildType`,
			{
				json: {
					applicationId,
					buildType,
					dockerfile: buildOptions.dockerfile ?? null,
					dockerContextPath: buildOptions.dockerContextPath ?? null,
					dockerBuildStage: buildOptions.dockerBuildStage ?? null,
					herokuVersion: buildOptions.herokuVersion ?? null,
					railpackVersion: buildOptions.railpackVersion ?? null,
					publishDirectory: buildOptions.publishDirectory ?? null,
					isStaticSpa: buildOptions.isStaticSpa ?? null,
				},
			},
			{
				headers: {
					"x-api-key": auth.token,
					"Content-Type": "application/json",
				},
			},
		);

		this.log(chalk.green("\n✓ Application configured successfully!"));
		this.log(
			chalk.dim(
				`  Run \`dokploy app deploy --applicationId ${applicationId}\` to deploy.`,
			),
		);
	}

	// ── Helpers ─────────────────────────────────────────────────────────────────

	private async fetchGithubProviders(auth: AuthConfig): Promise<GithubProvider[]> {
		const response = await axios.get(
			`${auth.url}/api/trpc/github.githubProviders`,
			{
				headers: {
					"x-api-key": auth.token,
					"Content-Type": "application/json",
				},
			},
		);
		return response.data.result.data.json ?? [];
	}

	private async fetchRepos(
		auth: AuthConfig,
		githubId: string,
	): Promise<GithubRepo[]> {
		const response = await axios.get(
			`${auth.url}/api/trpc/github.getGithubRepositories`,
			{
				headers: {
					"x-api-key": auth.token,
					"Content-Type": "application/json",
				},
				params: {
					input: JSON.stringify({ json: { githubId } }),
				},
			},
		);
		return response.data.result.data.json ?? [];
	}

	private async fetchBranches(
		auth: AuthConfig,
		repo: string,
		owner: string,
		githubId: string,
	): Promise<GithubBranch[]> {
		const response = await axios.get(
			`${auth.url}/api/trpc/github.getGithubBranches`,
			{
				headers: {
					"x-api-key": auth.token,
					"Content-Type": "application/json",
				},
				params: {
					input: JSON.stringify({ json: { repo, owner, githubId } }),
				},
			},
		);
		return response.data.result.data.json ?? [];
	}
}
