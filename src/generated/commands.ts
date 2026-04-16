// Auto-generated from openapi.json — do not edit manually.
// Run: npx tsx scripts/generate.ts

import type { Command } from "commander";
import chalk from "chalk";
import { apiPost, apiGet } from "../client.js";

function printOutput(data: unknown) {
	if (data === null || data === undefined) {
		console.log(chalk.green("OK"));
		return;
	}
	if (typeof data === "string") {
		console.log(data);
		return;
	}
	console.log(JSON.stringify(data, null, 2));
}

export function registerGeneratedCommands(program: Command) {
	const g_admin = program.command('admin').description('admin commands');

	g_admin
		.command('setup-monitoring')
		.description('admin setupMonitoring')
		.requiredOption('--metricsConfig <value>', 'metricsConfig')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("admin.setupMonitoring", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_ai = program.command('ai').description('ai commands');

	g_ai
		.command('create')
		.description('ai create')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--apiUrl <value>', 'apiUrl')
		.requiredOption('--apiKey <value>', 'apiKey')
		.requiredOption('--model <value>', 'model')
		.requiredOption('--isEnabled', 'isEnabled')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["isEnabled"] != null) opts["isEnabled"] = opts["isEnabled"] === true || opts["isEnabled"] === "true";
			const data = await apiPost("ai.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_ai
		.command('delete')
		.description('ai delete')
		.requiredOption('--aiId <value>', 'aiId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("ai.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_ai
		.command('deploy')
		.description('ai deploy')
		.requiredOption('--environmentId <value>', 'environmentId')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--dockerCompose <value>', 'dockerCompose')
		.requiredOption('--envVariables <value>', 'envVariables')
		.option('--serverId <value>', 'serverId')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--description <value>', 'description')
		.option('--domains <value>', 'domains')
		.option('--configFiles <value>', 'configFiles')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("ai.deploy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_ai
		.command('get')
		.description('ai get')
		.requiredOption('--aiId <value>', 'aiId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("ai.get", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_ai
		.command('get-all')
		.description('ai getAll')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("ai.getAll", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_ai
		.command('get-models')
		.description('ai getModels')
		.requiredOption('--apiUrl <value>', 'apiUrl')
		.requiredOption('--apiKey <value>', 'apiKey')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("ai.getModels", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_ai
		.command('one')
		.description('ai one')
		.requiredOption('--aiId <value>', 'aiId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("ai.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_ai
		.command('suggest')
		.description('ai suggest')
		.requiredOption('--aiId <value>', 'aiId')
		.requiredOption('--input <value>', 'input')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("ai.suggest", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_ai
		.command('update')
		.description('ai update')
		.requiredOption('--aiId <value>', 'aiId')
		.option('--name <value>', 'name')
		.option('--apiUrl <value>', 'apiUrl')
		.option('--apiKey <value>', 'apiKey')
		.option('--model <value>', 'model')
		.option('--isEnabled', 'isEnabled')
		.option('--createdAt <value>', 'createdAt')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["isEnabled"] != null) opts["isEnabled"] = opts["isEnabled"] === true || opts["isEnabled"] === "true";
			const data = await apiPost("ai.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_application = program.command('application').description('application commands');

	g_application
		.command('cancel-deployment')
		.description('application cancelDeployment')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.cancelDeployment", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('clean-queues')
		.description('application cleanQueues')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.cleanQueues", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('clear-deployments')
		.description('application clearDeployments')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.clearDeployments", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('create')
		.description('application create')
		.requiredOption('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('delete')
		.description('application delete')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('deploy')
		.description('application deploy')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--title <value>', 'title')
		.option('--description <value>', 'description')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.deploy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('disconnect-git-provider')
		.description('application disconnectGitProvider')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.disconnectGitProvider", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('kill-build')
		.description('application killBuild')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.killBuild", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('mark-running')
		.description('application markRunning')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.markRunning", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('move')
		.description('application move')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--targetEnvironmentId <value>', 'targetEnvironmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.move", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('one')
		.description('application one')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("application.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('read-app-monitoring')
		.description('application readAppMonitoring')
		.requiredOption('--appName <value>', 'appName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("application.readAppMonitoring", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('read-traefik-config')
		.description('application readTraefikConfig')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("application.readTraefikConfig", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('redeploy')
		.description('application redeploy')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--title <value>', 'title')
		.option('--description <value>', 'description')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.redeploy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('refresh-token')
		.description('application refreshToken')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.refreshToken", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('reload')
		.description('application reload')
		.requiredOption('--appName <value>', 'appName')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.reload", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('save-bitbucket-provider')
		.description('application saveBitbucketProvider')
		.requiredOption('--bitbucketBranch <value>', 'bitbucketBranch')
		.requiredOption('--bitbucketBuildPath <value>', 'bitbucketBuildPath')
		.requiredOption('--bitbucketOwner <value>', 'bitbucketOwner')
		.requiredOption('--bitbucketRepository <value>', 'bitbucketRepository')
		.requiredOption('--bitbucketRepositorySlug <value>', 'bitbucketRepositorySlug')
		.requiredOption('--bitbucketId <value>', 'bitbucketId')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--enableSubmodules', 'enableSubmodules')
		.option('--watchPaths <value>', 'watchPaths')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			const data = await apiPost("application.saveBitbucketProvider", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('save-build-type')
		.description('application saveBuildType')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--buildType <value>', 'buildType (dockerfile, heroku_buildpacks, paketo_buildpacks, nixpacks, static, railpack)')
		.requiredOption('--dockerfile <value>', 'dockerfile')
		.requiredOption('--dockerContextPath <value>', 'dockerContextPath')
		.requiredOption('--dockerBuildStage <value>', 'dockerBuildStage')
		.requiredOption('--herokuVersion <value>', 'herokuVersion')
		.requiredOption('--railpackVersion <value>', 'railpackVersion')
		.option('--publishDirectory <value>', 'publishDirectory')
		.option('--isStaticSpa', 'isStaticSpa')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["isStaticSpa"] != null) opts["isStaticSpa"] = opts["isStaticSpa"] === true || opts["isStaticSpa"] === "true";
			const data = await apiPost("application.saveBuildType", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('save-docker-provider')
		.description('application saveDockerProvider')
		.requiredOption('--dockerImage <value>', 'dockerImage')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--username <value>', 'username')
		.requiredOption('--password <value>', 'password')
		.requiredOption('--registryUrl <value>', 'registryUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.saveDockerProvider", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('save-environment')
		.description('application saveEnvironment')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--env <value>', 'env')
		.requiredOption('--buildArgs <value>', 'buildArgs')
		.requiredOption('--buildSecrets <value>', 'buildSecrets')
		.requiredOption('--createEnvFile', 'createEnvFile')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["createEnvFile"] != null) opts["createEnvFile"] = opts["createEnvFile"] === true || opts["createEnvFile"] === "true";
			const data = await apiPost("application.saveEnvironment", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('save-gitea-provider')
		.description('application saveGiteaProvider')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--giteaBranch <value>', 'giteaBranch')
		.requiredOption('--giteaBuildPath <value>', 'giteaBuildPath')
		.requiredOption('--giteaOwner <value>', 'giteaOwner')
		.requiredOption('--giteaRepository <value>', 'giteaRepository')
		.requiredOption('--giteaId <value>', 'giteaId')
		.option('--enableSubmodules', 'enableSubmodules')
		.option('--watchPaths <value>', 'watchPaths')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			const data = await apiPost("application.saveGiteaProvider", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('save-github-provider')
		.description('application saveGithubProvider')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--repository <value>', 'repository')
		.requiredOption('--branch <value>', 'branch')
		.requiredOption('--owner <value>', 'owner')
		.requiredOption('--buildPath <value>', 'buildPath')
		.requiredOption('--githubId <value>', 'githubId')
		.requiredOption('--triggerType <value>', 'triggerType (push, tag)')
		.option('--enableSubmodules', 'enableSubmodules')
		.option('--watchPaths <value>', 'watchPaths')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			const data = await apiPost("application.saveGithubProvider", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('save-gitlab-provider')
		.description('application saveGitlabProvider')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--gitlabBranch <value>', 'gitlabBranch')
		.requiredOption('--gitlabBuildPath <value>', 'gitlabBuildPath')
		.requiredOption('--gitlabOwner <value>', 'gitlabOwner')
		.requiredOption('--gitlabRepository <value>', 'gitlabRepository')
		.requiredOption('--gitlabId <value>', 'gitlabId')
		.requiredOption('--gitlabProjectId <value>', 'gitlabProjectId')
		.requiredOption('--gitlabPathNamespace <value>', 'gitlabPathNamespace')
		.option('--enableSubmodules', 'enableSubmodules')
		.option('--watchPaths <value>', 'watchPaths')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["gitlabProjectId"] != null) opts["gitlabProjectId"] = Number(opts["gitlabProjectId"]);
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			const data = await apiPost("application.saveGitlabProvider", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('save-git-provider')
		.description('application saveGitProvider')
		.requiredOption('--customGitBranch <value>', 'customGitBranch')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--customGitBuildPath <value>', 'customGitBuildPath')
		.requiredOption('--customGitUrl <value>', 'customGitUrl')
		.requiredOption('--watchPaths <value>', 'watchPaths')
		.option('--enableSubmodules', 'enableSubmodules')
		.option('--customGitSSHKeyId <value>', 'customGitSSHKeyId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			const data = await apiPost("application.saveGitProvider", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('search')
		.description('application search')
		.option('--q <value>', 'q')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--repository <value>', 'repository')
		.option('--owner <value>', 'owner')
		.option('--dockerImage <value>', 'dockerImage')
		.option('--projectId <value>', 'projectId')
		.option('--environmentId <value>', 'environmentId')
		.option('--limit <value>', 'limit')
		.option('--offset <value>', 'offset')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["limit"] != null) opts["limit"] = Number(opts["limit"]);
			if (opts["offset"] != null) opts["offset"] = Number(opts["offset"]);
			const data = await apiGet("application.search", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('start')
		.description('application start')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.start", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('stop')
		.description('application stop')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.stop", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('update')
		.description('application update')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--env <value>', 'env')
		.option('--previewEnv <value>', 'previewEnv')
		.option('--watchPaths <value>', 'watchPaths')
		.option('--previewBuildArgs <value>', 'previewBuildArgs')
		.option('--previewBuildSecrets <value>', 'previewBuildSecrets')
		.option('--previewLabels <value>', 'previewLabels')
		.option('--previewWildcard <value>', 'previewWildcard')
		.option('--previewPort <value>', 'previewPort')
		.option('--previewHttps', 'previewHttps')
		.option('--previewPath <value>', 'previewPath')
		.option('--previewCertificateType <value>', 'previewCertificateType (letsencrypt, none, custom)')
		.option('--previewCustomCertResolver <value>', 'previewCustomCertResolver')
		.option('--previewLimit <value>', 'previewLimit')
		.option('--isPreviewDeploymentsActive', 'isPreviewDeploymentsActive')
		.option('--previewRequireCollaboratorPermissions', 'previewRequireCollaboratorPermissions')
		.option('--rollbackActive', 'rollbackActive')
		.option('--buildArgs <value>', 'buildArgs')
		.option('--buildSecrets <value>', 'buildSecrets')
		.option('--memoryReservation <value>', 'memoryReservation')
		.option('--memoryLimit <value>', 'memoryLimit')
		.option('--cpuReservation <value>', 'cpuReservation')
		.option('--cpuLimit <value>', 'cpuLimit')
		.option('--title <value>', 'title')
		.option('--enabled', 'enabled')
		.option('--subtitle <value>', 'subtitle')
		.option('--command <value>', 'command')
		.option('--args <value>', 'args')
		.option('--refreshToken <value>', 'refreshToken')
		.option('--sourceType <value>', 'sourceType (github, docker, git, gitlab, bitbucket, gitea, drop)')
		.option('--cleanCache', 'cleanCache')
		.option('--repository <value>', 'repository')
		.option('--owner <value>', 'owner')
		.option('--branch <value>', 'branch')
		.option('--buildPath <value>', 'buildPath')
		.option('--triggerType <value>', 'triggerType (push, tag)')
		.option('--autoDeploy', 'autoDeploy')
		.option('--gitlabProjectId <value>', 'gitlabProjectId')
		.option('--gitlabRepository <value>', 'gitlabRepository')
		.option('--gitlabOwner <value>', 'gitlabOwner')
		.option('--gitlabBranch <value>', 'gitlabBranch')
		.option('--gitlabBuildPath <value>', 'gitlabBuildPath')
		.option('--gitlabPathNamespace <value>', 'gitlabPathNamespace')
		.option('--giteaRepository <value>', 'giteaRepository')
		.option('--giteaOwner <value>', 'giteaOwner')
		.option('--giteaBranch <value>', 'giteaBranch')
		.option('--giteaBuildPath <value>', 'giteaBuildPath')
		.option('--bitbucketRepository <value>', 'bitbucketRepository')
		.option('--bitbucketRepositorySlug <value>', 'bitbucketRepositorySlug')
		.option('--bitbucketOwner <value>', 'bitbucketOwner')
		.option('--bitbucketBranch <value>', 'bitbucketBranch')
		.option('--bitbucketBuildPath <value>', 'bitbucketBuildPath')
		.option('--username <value>', 'username')
		.option('--password <value>', 'password')
		.option('--dockerImage <value>', 'dockerImage')
		.option('--registryUrl <value>', 'registryUrl')
		.option('--customGitUrl <value>', 'customGitUrl')
		.option('--customGitBranch <value>', 'customGitBranch')
		.option('--customGitBuildPath <value>', 'customGitBuildPath')
		.option('--customGitSSHKeyId <value>', 'customGitSSHKeyId')
		.option('--enableSubmodules', 'enableSubmodules')
		.option('--dockerfile <value>', 'dockerfile')
		.option('--dockerContextPath <value>', 'dockerContextPath')
		.option('--dockerBuildStage <value>', 'dockerBuildStage')
		.option('--dropBuildPath <value>', 'dropBuildPath')
		.option('--healthCheckSwarm <value>', 'healthCheckSwarm')
		.option('--restartPolicySwarm <value>', 'restartPolicySwarm')
		.option('--placementSwarm <value>', 'placementSwarm')
		.option('--updateConfigSwarm <value>', 'updateConfigSwarm')
		.option('--rollbackConfigSwarm <value>', 'rollbackConfigSwarm')
		.option('--modeSwarm <value>', 'modeSwarm')
		.option('--labelsSwarm <value>', 'labelsSwarm')
		.option('--networkSwarm <value>', 'networkSwarm')
		.option('--stopGracePeriodSwarm <value>', 'stopGracePeriodSwarm')
		.option('--endpointSpecSwarm <value>', 'endpointSpecSwarm')
		.option('--ulimitsSwarm <value>', 'ulimitsSwarm')
		.option('--replicas <value>', 'replicas')
		.option('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--buildType <value>', 'buildType (dockerfile, heroku_buildpacks, paketo_buildpacks, nixpacks, static, railpack)')
		.option('--railpackVersion <value>', 'railpackVersion')
		.option('--herokuVersion <value>', 'herokuVersion')
		.option('--publishDirectory <value>', 'publishDirectory')
		.option('--isStaticSpa', 'isStaticSpa')
		.option('--createEnvFile', 'createEnvFile')
		.option('--createdAt <value>', 'createdAt')
		.option('--registryId <value>', 'registryId')
		.option('--rollbackRegistryId <value>', 'rollbackRegistryId')
		.option('--environmentId <value>', 'environmentId')
		.option('--githubId <value>', 'githubId')
		.option('--gitlabId <value>', 'gitlabId')
		.option('--giteaId <value>', 'giteaId')
		.option('--bitbucketId <value>', 'bitbucketId')
		.option('--buildServerId <value>', 'buildServerId')
		.option('--buildRegistryId <value>', 'buildRegistryId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["previewPort"] != null) opts["previewPort"] = Number(opts["previewPort"]);
			if (opts["previewHttps"] != null) opts["previewHttps"] = opts["previewHttps"] === true || opts["previewHttps"] === "true";
			if (opts["previewLimit"] != null) opts["previewLimit"] = Number(opts["previewLimit"]);
			if (opts["isPreviewDeploymentsActive"] != null) opts["isPreviewDeploymentsActive"] = opts["isPreviewDeploymentsActive"] === true || opts["isPreviewDeploymentsActive"] === "true";
			if (opts["previewRequireCollaboratorPermissions"] != null) opts["previewRequireCollaboratorPermissions"] = opts["previewRequireCollaboratorPermissions"] === true || opts["previewRequireCollaboratorPermissions"] === "true";
			if (opts["rollbackActive"] != null) opts["rollbackActive"] = opts["rollbackActive"] === true || opts["rollbackActive"] === "true";
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			if (opts["cleanCache"] != null) opts["cleanCache"] = opts["cleanCache"] === true || opts["cleanCache"] === "true";
			if (opts["autoDeploy"] != null) opts["autoDeploy"] = opts["autoDeploy"] === true || opts["autoDeploy"] === "true";
			if (opts["gitlabProjectId"] != null) opts["gitlabProjectId"] = Number(opts["gitlabProjectId"]);
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			if (opts["replicas"] != null) opts["replicas"] = Number(opts["replicas"]);
			if (opts["isStaticSpa"] != null) opts["isStaticSpa"] = opts["isStaticSpa"] === true || opts["isStaticSpa"] === "true";
			if (opts["createEnvFile"] != null) opts["createEnvFile"] = opts["createEnvFile"] === true || opts["createEnvFile"] === "true";
			const data = await apiPost("application.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_application
		.command('update-traefik-config')
		.description('application updateTraefikConfig')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--traefikConfig <value>', 'traefikConfig')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.updateTraefikConfig", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_backup = program.command('backup').description('backup commands');

	g_backup
		.command('create')
		.description('backup create')
		.requiredOption('--schedule <value>', 'schedule')
		.option('--enabled', 'enabled')
		.requiredOption('--prefix <value>', 'prefix')
		.requiredOption('--destinationId <value>', 'destinationId')
		.option('--keepLatestCount <value>', 'keepLatestCount')
		.requiredOption('--database <value>', 'database')
		.option('--mariadbId <value>', 'mariadbId')
		.option('--mysqlId <value>', 'mysqlId')
		.option('--postgresId <value>', 'postgresId')
		.option('--mongoId <value>', 'mongoId')
		.requiredOption('--databaseType <value>', 'databaseType (postgres, mariadb, mysql, mongo, web-server)')
		.option('--userId <value>', 'userId')
		.option('--backupType <value>', 'backupType (database, compose)')
		.option('--composeId <value>', 'composeId')
		.option('--serviceName <value>', 'serviceName')
		.option('--metadata <value>', 'metadata')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			if (opts["keepLatestCount"] != null) opts["keepLatestCount"] = Number(opts["keepLatestCount"]);
			const data = await apiPost("backup.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_backup
		.command('list-backup-files')
		.description('backup listBackupFiles')
		.requiredOption('--destinationId <value>', 'destinationId')
		.requiredOption('--search <value>', 'search')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("backup.listBackupFiles", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_backup
		.command('manual-backup-compose')
		.description('backup manualBackupCompose')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupCompose", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_backup
		.command('manual-backup-mariadb')
		.description('backup manualBackupMariadb')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupMariadb", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_backup
		.command('manual-backup-mongo')
		.description('backup manualBackupMongo')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupMongo", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_backup
		.command('manual-backup-my-sql')
		.description('backup manualBackupMySql')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupMySql", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_backup
		.command('manual-backup-postgres')
		.description('backup manualBackupPostgres')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupPostgres", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_backup
		.command('manual-backup-web-server')
		.description('backup manualBackupWebServer')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupWebServer", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_backup
		.command('one')
		.description('backup one')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("backup.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_backup
		.command('remove')
		.description('backup remove')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_backup
		.command('update')
		.description('backup update')
		.requiredOption('--schedule <value>', 'schedule')
		.requiredOption('--enabled', 'enabled')
		.requiredOption('--prefix <value>', 'prefix')
		.requiredOption('--backupId <value>', 'backupId')
		.requiredOption('--destinationId <value>', 'destinationId')
		.requiredOption('--database <value>', 'database')
		.requiredOption('--keepLatestCount <value>', 'keepLatestCount')
		.requiredOption('--serviceName <value>', 'serviceName')
		.requiredOption('--metadata <value>', 'metadata')
		.requiredOption('--databaseType <value>', 'databaseType (postgres, mariadb, mysql, mongo, web-server)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			if (opts["keepLatestCount"] != null) opts["keepLatestCount"] = Number(opts["keepLatestCount"]);
			const data = await apiPost("backup.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_bitbucket = program.command('bitbucket').description('bitbucket commands');

	g_bitbucket
		.command('bitbucket-providers')
		.description('bitbucket bitbucketProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("bitbucket.bitbucketProviders", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_bitbucket
		.command('create')
		.description('bitbucket create')
		.option('--bitbucketId <value>', 'bitbucketId')
		.option('--bitbucketUsername <value>', 'bitbucketUsername')
		.option('--bitbucketEmail <value>', 'bitbucketEmail')
		.option('--appPassword <value>', 'appPassword')
		.option('--apiToken <value>', 'apiToken')
		.option('--bitbucketWorkspaceName <value>', 'bitbucketWorkspaceName')
		.option('--gitProviderId <value>', 'gitProviderId')
		.requiredOption('--authId <value>', 'authId')
		.requiredOption('--name <value>', 'name')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("bitbucket.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_bitbucket
		.command('get-bitbucket-branches')
		.description('bitbucket getBitbucketBranches')
		.requiredOption('--owner <value>', 'owner')
		.requiredOption('--repo <value>', 'repo')
		.option('--bitbucketId <value>', 'bitbucketId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("bitbucket.getBitbucketBranches", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_bitbucket
		.command('get-bitbucket-repositories')
		.description('bitbucket getBitbucketRepositories')
		.requiredOption('--bitbucketId <value>', 'bitbucketId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("bitbucket.getBitbucketRepositories", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_bitbucket
		.command('one')
		.description('bitbucket one')
		.requiredOption('--bitbucketId <value>', 'bitbucketId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("bitbucket.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_bitbucket
		.command('test-connection')
		.description('bitbucket testConnection')
		.requiredOption('--bitbucketId <value>', 'bitbucketId')
		.option('--bitbucketUsername <value>', 'bitbucketUsername')
		.option('--bitbucketEmail <value>', 'bitbucketEmail')
		.option('--workspaceName <value>', 'workspaceName')
		.option('--apiToken <value>', 'apiToken')
		.option('--appPassword <value>', 'appPassword')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("bitbucket.testConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_bitbucket
		.command('update')
		.description('bitbucket update')
		.requiredOption('--bitbucketId <value>', 'bitbucketId')
		.option('--bitbucketUsername <value>', 'bitbucketUsername')
		.option('--bitbucketEmail <value>', 'bitbucketEmail')
		.option('--appPassword <value>', 'appPassword')
		.option('--apiToken <value>', 'apiToken')
		.option('--bitbucketWorkspaceName <value>', 'bitbucketWorkspaceName')
		.requiredOption('--gitProviderId <value>', 'gitProviderId')
		.requiredOption('--name <value>', 'name')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("bitbucket.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_certificates = program.command('certificates').description('certificates commands');

	g_certificates
		.command('all')
		.description('certificates all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("certificates.all", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_certificates
		.command('create')
		.description('certificates create')
		.option('--certificateId <value>', 'certificateId')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--certificateData <value>', 'certificateData')
		.requiredOption('--privateKey <value>', 'privateKey')
		.option('--certificatePath <value>', 'certificatePath')
		.option('--autoRenew', 'autoRenew')
		.requiredOption('--organizationId <value>', 'organizationId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["autoRenew"] != null) opts["autoRenew"] = opts["autoRenew"] === true || opts["autoRenew"] === "true";
			const data = await apiPost("certificates.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_certificates
		.command('one')
		.description('certificates one')
		.requiredOption('--certificateId <value>', 'certificateId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("certificates.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_certificates
		.command('remove')
		.description('certificates remove')
		.requiredOption('--certificateId <value>', 'certificateId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("certificates.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_cluster = program.command('cluster').description('cluster commands');

	g_cluster
		.command('add-manager')
		.description('cluster addManager')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("cluster.addManager", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_cluster
		.command('add-worker')
		.description('cluster addWorker')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("cluster.addWorker", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_cluster
		.command('get-nodes')
		.description('cluster getNodes')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("cluster.getNodes", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_cluster
		.command('remove-worker')
		.description('cluster removeWorker')
		.requiredOption('--nodeId <value>', 'nodeId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("cluster.removeWorker", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_compose = program.command('compose').description('compose commands');

	g_compose
		.command('cancel-deployment')
		.description('compose cancelDeployment')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.cancelDeployment", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('clean-queues')
		.description('compose cleanQueues')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.cleanQueues", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('clear-deployments')
		.description('compose clearDeployments')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.clearDeployments", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('create')
		.description('compose create')
		.requiredOption('--name <value>', 'name')
		.option('--description <value>', 'description')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--composeType <value>', 'composeType (docker-compose, stack)')
		.option('--appName <value>', 'appName')
		.option('--serverId <value>', 'serverId')
		.option('--composeFile <value>', 'composeFile')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('delete')
		.description('compose delete')
		.requiredOption('--composeId <value>', 'composeId')
		.requiredOption('--deleteVolumes', 'deleteVolumes')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["deleteVolumes"] != null) opts["deleteVolumes"] = opts["deleteVolumes"] === true || opts["deleteVolumes"] === "true";
			const data = await apiPost("compose.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('deploy')
		.description('compose deploy')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--title <value>', 'title')
		.option('--description <value>', 'description')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.deploy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('deploy-template')
		.description('compose deployTemplate')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--serverId <value>', 'serverId')
		.requiredOption('--id <value>', 'id')
		.option('--baseUrl <value>', 'baseUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.deployTemplate", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('disconnect-git-provider')
		.description('compose disconnectGitProvider')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.disconnectGitProvider", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('fetch-source-type')
		.description('compose fetchSourceType')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.fetchSourceType", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('get-converted-compose')
		.description('compose getConvertedCompose')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("compose.getConvertedCompose", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('get-default-command')
		.description('compose getDefaultCommand')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("compose.getDefaultCommand", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('get-tags')
		.description('compose getTags')
		.option('--baseUrl <value>', 'baseUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("compose.getTags", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('import')
		.description('compose import')
		.requiredOption('--base64 <value>', 'base64')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.import", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('isolated-deployment')
		.description('compose isolatedDeployment')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--suffix <value>', 'suffix')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.isolatedDeployment", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('kill-build')
		.description('compose killBuild')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.killBuild", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('load-mounts-by-service')
		.description('compose loadMountsByService')
		.requiredOption('--composeId <value>', 'composeId')
		.requiredOption('--serviceName <value>', 'serviceName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("compose.loadMountsByService", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('load-services')
		.description('compose loadServices')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--type <value>', 'type (fetch, cache)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("compose.loadServices", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('move')
		.description('compose move')
		.requiredOption('--composeId <value>', 'composeId')
		.requiredOption('--targetEnvironmentId <value>', 'targetEnvironmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.move", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('one')
		.description('compose one')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("compose.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('process-template')
		.description('compose processTemplate')
		.requiredOption('--base64 <value>', 'base64')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.processTemplate", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('randomize-compose')
		.description('compose randomizeCompose')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--suffix <value>', 'suffix')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.randomizeCompose", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('redeploy')
		.description('compose redeploy')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--title <value>', 'title')
		.option('--description <value>', 'description')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.redeploy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('refresh-token')
		.description('compose refreshToken')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.refreshToken", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('search')
		.description('compose search')
		.option('--q <value>', 'q')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--projectId <value>', 'projectId')
		.option('--environmentId <value>', 'environmentId')
		.option('--limit <value>', 'limit')
		.option('--offset <value>', 'offset')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["limit"] != null) opts["limit"] = Number(opts["limit"]);
			if (opts["offset"] != null) opts["offset"] = Number(opts["offset"]);
			const data = await apiGet("compose.search", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('start')
		.description('compose start')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.start", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('stop')
		.description('compose stop')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.stop", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('templates')
		.description('compose templates')
		.option('--baseUrl <value>', 'baseUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("compose.templates", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_compose
		.command('update')
		.description('compose update')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--env <value>', 'env')
		.option('--composeFile <value>', 'composeFile')
		.option('--refreshToken <value>', 'refreshToken')
		.option('--sourceType <value>', 'sourceType (git, github, gitlab, bitbucket, gitea, raw)')
		.option('--composeType <value>', 'composeType (docker-compose, stack)')
		.option('--repository <value>', 'repository')
		.option('--owner <value>', 'owner')
		.option('--branch <value>', 'branch')
		.option('--autoDeploy', 'autoDeploy')
		.option('--gitlabProjectId <value>', 'gitlabProjectId')
		.option('--gitlabRepository <value>', 'gitlabRepository')
		.option('--gitlabOwner <value>', 'gitlabOwner')
		.option('--gitlabBranch <value>', 'gitlabBranch')
		.option('--gitlabPathNamespace <value>', 'gitlabPathNamespace')
		.option('--bitbucketRepository <value>', 'bitbucketRepository')
		.option('--bitbucketRepositorySlug <value>', 'bitbucketRepositorySlug')
		.option('--bitbucketOwner <value>', 'bitbucketOwner')
		.option('--bitbucketBranch <value>', 'bitbucketBranch')
		.option('--giteaRepository <value>', 'giteaRepository')
		.option('--giteaOwner <value>', 'giteaOwner')
		.option('--giteaBranch <value>', 'giteaBranch')
		.option('--customGitUrl <value>', 'customGitUrl')
		.option('--customGitBranch <value>', 'customGitBranch')
		.option('--customGitSSHKeyId <value>', 'customGitSSHKeyId')
		.option('--command <value>', 'command')
		.option('--enableSubmodules', 'enableSubmodules')
		.option('--composePath <value>', 'composePath')
		.option('--suffix <value>', 'suffix')
		.option('--randomize', 'randomize')
		.option('--isolatedDeployment', 'isolatedDeployment')
		.option('--isolatedDeploymentsVolume', 'isolatedDeploymentsVolume')
		.option('--triggerType <value>', 'triggerType (push, tag)')
		.option('--composeStatus <value>', 'composeStatus (idle, running, done, error)')
		.option('--environmentId <value>', 'environmentId')
		.option('--createdAt <value>', 'createdAt')
		.option('--watchPaths <value>', 'watchPaths')
		.option('--githubId <value>', 'githubId')
		.option('--gitlabId <value>', 'gitlabId')
		.option('--bitbucketId <value>', 'bitbucketId')
		.option('--giteaId <value>', 'giteaId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["autoDeploy"] != null) opts["autoDeploy"] = opts["autoDeploy"] === true || opts["autoDeploy"] === "true";
			if (opts["gitlabProjectId"] != null) opts["gitlabProjectId"] = Number(opts["gitlabProjectId"]);
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			if (opts["randomize"] != null) opts["randomize"] = opts["randomize"] === true || opts["randomize"] === "true";
			if (opts["isolatedDeployment"] != null) opts["isolatedDeployment"] = opts["isolatedDeployment"] === true || opts["isolatedDeployment"] === "true";
			if (opts["isolatedDeploymentsVolume"] != null) opts["isolatedDeploymentsVolume"] = opts["isolatedDeploymentsVolume"] === true || opts["isolatedDeploymentsVolume"] === "true";
			const data = await apiPost("compose.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_deployment = program.command('deployment').description('deployment commands');

	g_deployment
		.command('all')
		.description('deployment all')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("deployment.all", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_deployment
		.command('all-by-compose')
		.description('deployment allByCompose')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("deployment.allByCompose", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_deployment
		.command('all-by-server')
		.description('deployment allByServer')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("deployment.allByServer", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_deployment
		.command('all-by-type')
		.description('deployment allByType')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--type <value>', 'type (application, compose, server, schedule, previewDeployment, backup, volumeBackup)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("deployment.allByType", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_deployment
		.command('all-centralized')
		.description('deployment allCentralized')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("deployment.allCentralized", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_deployment
		.command('kill-process')
		.description('deployment killProcess')
		.requiredOption('--deploymentId <value>', 'deploymentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("deployment.killProcess", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_deployment
		.command('queue-list')
		.description('deployment queueList')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("deployment.queueList", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_deployment
		.command('remove-deployment')
		.description('deployment removeDeployment')
		.requiredOption('--deploymentId <value>', 'deploymentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("deployment.removeDeployment", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_destination = program.command('destination').description('destination commands');

	g_destination
		.command('all')
		.description('destination all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("destination.all", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_destination
		.command('create')
		.description('destination create')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--provider <value>', 'provider')
		.requiredOption('--accessKey <value>', 'accessKey')
		.requiredOption('--bucket <value>', 'bucket')
		.requiredOption('--region <value>', 'region')
		.requiredOption('--endpoint <value>', 'endpoint')
		.requiredOption('--secretAccessKey <value>', 'secretAccessKey')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("destination.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_destination
		.command('one')
		.description('destination one')
		.requiredOption('--destinationId <value>', 'destinationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("destination.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_destination
		.command('remove')
		.description('destination remove')
		.requiredOption('--destinationId <value>', 'destinationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("destination.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_destination
		.command('test-connection')
		.description('destination testConnection')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--provider <value>', 'provider')
		.requiredOption('--accessKey <value>', 'accessKey')
		.requiredOption('--bucket <value>', 'bucket')
		.requiredOption('--region <value>', 'region')
		.requiredOption('--endpoint <value>', 'endpoint')
		.requiredOption('--secretAccessKey <value>', 'secretAccessKey')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("destination.testConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_destination
		.command('update')
		.description('destination update')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--accessKey <value>', 'accessKey')
		.requiredOption('--bucket <value>', 'bucket')
		.requiredOption('--region <value>', 'region')
		.requiredOption('--endpoint <value>', 'endpoint')
		.requiredOption('--secretAccessKey <value>', 'secretAccessKey')
		.requiredOption('--destinationId <value>', 'destinationId')
		.requiredOption('--provider <value>', 'provider')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("destination.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_docker = program.command('docker').description('docker commands');

	g_docker
		.command('get-config')
		.description('docker getConfig')
		.requiredOption('--containerId <value>', 'containerId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("docker.getConfig", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_docker
		.command('get-containers')
		.description('docker getContainers')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("docker.getContainers", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_docker
		.command('get-containers-by-app-label')
		.description('docker getContainersByAppLabel')
		.requiredOption('--appName <value>', 'appName')
		.option('--serverId <value>', 'serverId')
		.requiredOption('--type <value>', 'type (standalone, swarm)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("docker.getContainersByAppLabel", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_docker
		.command('get-containers-by-app-name-match')
		.description('docker getContainersByAppNameMatch')
		.option('--appType <value>', 'appType (stack, docker-compose)')
		.requiredOption('--appName <value>', 'appName')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("docker.getContainersByAppNameMatch", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_docker
		.command('get-service-containers-by-app-name')
		.description('docker getServiceContainersByAppName')
		.requiredOption('--appName <value>', 'appName')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("docker.getServiceContainersByAppName", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_docker
		.command('get-stack-containers-by-app-name')
		.description('docker getStackContainersByAppName')
		.requiredOption('--appName <value>', 'appName')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("docker.getStackContainersByAppName", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_docker
		.command('restart-container')
		.description('docker restartContainer')
		.requiredOption('--containerId <value>', 'containerId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("docker.restartContainer", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_domain = program.command('domain').description('domain commands');

	g_domain
		.command('by-application-id')
		.description('domain byApplicationId')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("domain.byApplicationId", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_domain
		.command('by-compose-id')
		.description('domain byComposeId')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("domain.byComposeId", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_domain
		.command('can-generate-traefik-me-domains')
		.description('domain canGenerateTraefikMeDomains')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("domain.canGenerateTraefikMeDomains", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_domain
		.command('create')
		.description('domain create')
		.requiredOption('--host <value>', 'host')
		.option('--path <value>', 'path')
		.option('--port <value>', 'port')
		.option('--https', 'https')
		.option('--applicationId <value>', 'applicationId')
		.option('--certificateType <value>', 'certificateType (letsencrypt, none, custom)')
		.option('--customCertResolver <value>', 'customCertResolver')
		.option('--composeId <value>', 'composeId')
		.option('--serviceName <value>', 'serviceName')
		.option('--domainType <value>', 'domainType (compose, application, preview)')
		.option('--previewDeploymentId <value>', 'previewDeploymentId')
		.option('--internalPath <value>', 'internalPath')
		.option('--stripPath', 'stripPath')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["port"] != null) opts["port"] = Number(opts["port"]);
			if (opts["https"] != null) opts["https"] = opts["https"] === true || opts["https"] === "true";
			if (opts["stripPath"] != null) opts["stripPath"] = opts["stripPath"] === true || opts["stripPath"] === "true";
			const data = await apiPost("domain.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_domain
		.command('delete')
		.description('domain delete')
		.requiredOption('--domainId <value>', 'domainId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("domain.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_domain
		.command('generate-domain')
		.description('domain generateDomain')
		.requiredOption('--appName <value>', 'appName')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("domain.generateDomain", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_domain
		.command('one')
		.description('domain one')
		.requiredOption('--domainId <value>', 'domainId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("domain.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_domain
		.command('update')
		.description('domain update')
		.requiredOption('--host <value>', 'host')
		.option('--path <value>', 'path')
		.option('--port <value>', 'port')
		.option('--https', 'https')
		.option('--certificateType <value>', 'certificateType (letsencrypt, none, custom)')
		.option('--customCertResolver <value>', 'customCertResolver')
		.option('--serviceName <value>', 'serviceName')
		.option('--domainType <value>', 'domainType (compose, application, preview)')
		.option('--internalPath <value>', 'internalPath')
		.option('--stripPath', 'stripPath')
		.requiredOption('--domainId <value>', 'domainId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["port"] != null) opts["port"] = Number(opts["port"]);
			if (opts["https"] != null) opts["https"] = opts["https"] === true || opts["https"] === "true";
			if (opts["stripPath"] != null) opts["stripPath"] = opts["stripPath"] === true || opts["stripPath"] === "true";
			const data = await apiPost("domain.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_domain
		.command('validate-domain')
		.description('domain validateDomain')
		.requiredOption('--domain <value>', 'domain')
		.option('--serverIp <value>', 'serverIp')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("domain.validateDomain", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_environment = program.command('environment').description('environment commands');

	g_environment
		.command('by-project-id')
		.description('environment byProjectId')
		.requiredOption('--projectId <value>', 'projectId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("environment.byProjectId", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_environment
		.command('create')
		.description('environment create')
		.requiredOption('--name <value>', 'name')
		.option('--description <value>', 'description')
		.requiredOption('--projectId <value>', 'projectId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("environment.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_environment
		.command('duplicate')
		.description('environment duplicate')
		.requiredOption('--environmentId <value>', 'environmentId')
		.requiredOption('--name <value>', 'name')
		.option('--description <value>', 'description')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("environment.duplicate", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_environment
		.command('one')
		.description('environment one')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("environment.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_environment
		.command('remove')
		.description('environment remove')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("environment.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_environment
		.command('search')
		.description('environment search')
		.option('--q <value>', 'q')
		.option('--name <value>', 'name')
		.option('--description <value>', 'description')
		.option('--projectId <value>', 'projectId')
		.option('--limit <value>', 'limit')
		.option('--offset <value>', 'offset')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["limit"] != null) opts["limit"] = Number(opts["limit"]);
			if (opts["offset"] != null) opts["offset"] = Number(opts["offset"]);
			const data = await apiGet("environment.search", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_environment
		.command('update')
		.description('environment update')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--name <value>', 'name')
		.option('--description <value>', 'description')
		.option('--projectId <value>', 'projectId')
		.option('--env <value>', 'env')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("environment.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_gitea = program.command('gitea').description('gitea commands');

	g_gitea
		.command('create')
		.description('gitea create')
		.option('--giteaId <value>', 'giteaId')
		.requiredOption('--giteaUrl <value>', 'giteaUrl')
		.option('--giteaInternalUrl <value>', 'giteaInternalUrl')
		.option('--redirectUri <value>', 'redirectUri')
		.option('--clientId <value>', 'clientId')
		.option('--clientSecret <value>', 'clientSecret')
		.option('--gitProviderId <value>', 'gitProviderId')
		.option('--accessToken <value>', 'accessToken')
		.option('--refreshToken <value>', 'refreshToken')
		.option('--expiresAt <value>', 'expiresAt')
		.option('--scopes <value>', 'scopes')
		.option('--lastAuthenticatedAt <value>', 'lastAuthenticatedAt')
		.requiredOption('--name <value>', 'name')
		.option('--giteaUsername <value>', 'giteaUsername')
		.option('--organizationName <value>', 'organizationName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["expiresAt"] != null) opts["expiresAt"] = Number(opts["expiresAt"]);
			if (opts["lastAuthenticatedAt"] != null) opts["lastAuthenticatedAt"] = Number(opts["lastAuthenticatedAt"]);
			const data = await apiPost("gitea.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitea
		.command('get-gitea-branches')
		.description('gitea getGiteaBranches')
		.requiredOption('--owner <value>', 'owner')
		.requiredOption('--repositoryName <value>', 'repositoryName')
		.option('--giteaId <value>', 'giteaId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitea.getGiteaBranches", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitea
		.command('get-gitea-repositories')
		.description('gitea getGiteaRepositories')
		.requiredOption('--giteaId <value>', 'giteaId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitea.getGiteaRepositories", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitea
		.command('get-gitea-url')
		.description('gitea getGiteaUrl')
		.requiredOption('--giteaId <value>', 'giteaId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitea.getGiteaUrl", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitea
		.command('gitea-providers')
		.description('gitea giteaProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitea.giteaProviders", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitea
		.command('one')
		.description('gitea one')
		.requiredOption('--giteaId <value>', 'giteaId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitea.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitea
		.command('test-connection')
		.description('gitea testConnection')
		.option('--giteaId <value>', 'giteaId')
		.option('--organizationName <value>', 'organizationName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("gitea.testConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitea
		.command('update')
		.description('gitea update')
		.requiredOption('--giteaId <value>', 'giteaId')
		.requiredOption('--giteaUrl <value>', 'giteaUrl')
		.option('--giteaInternalUrl <value>', 'giteaInternalUrl')
		.option('--redirectUri <value>', 'redirectUri')
		.option('--clientId <value>', 'clientId')
		.option('--clientSecret <value>', 'clientSecret')
		.requiredOption('--gitProviderId <value>', 'gitProviderId')
		.option('--accessToken <value>', 'accessToken')
		.option('--refreshToken <value>', 'refreshToken')
		.option('--expiresAt <value>', 'expiresAt')
		.option('--scopes <value>', 'scopes')
		.option('--lastAuthenticatedAt <value>', 'lastAuthenticatedAt')
		.requiredOption('--name <value>', 'name')
		.option('--giteaUsername <value>', 'giteaUsername')
		.option('--organizationName <value>', 'organizationName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["expiresAt"] != null) opts["expiresAt"] = Number(opts["expiresAt"]);
			if (opts["lastAuthenticatedAt"] != null) opts["lastAuthenticatedAt"] = Number(opts["lastAuthenticatedAt"]);
			const data = await apiPost("gitea.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_github = program.command('github').description('github commands');

	g_github
		.command('get-github-branches')
		.description('github getGithubBranches')
		.requiredOption('--repo <value>', 'repo')
		.requiredOption('--owner <value>', 'owner')
		.option('--githubId <value>', 'githubId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("github.getGithubBranches", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_github
		.command('get-github-repositories')
		.description('github getGithubRepositories')
		.requiredOption('--githubId <value>', 'githubId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("github.getGithubRepositories", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_github
		.command('github-providers')
		.description('github githubProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("github.githubProviders", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_github
		.command('one')
		.description('github one')
		.requiredOption('--githubId <value>', 'githubId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("github.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_github
		.command('test-connection')
		.description('github testConnection')
		.requiredOption('--githubId <value>', 'githubId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("github.testConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_github
		.command('update')
		.description('github update')
		.requiredOption('--githubId <value>', 'githubId')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--gitProviderId <value>', 'gitProviderId')
		.requiredOption('--githubAppName <value>', 'githubAppName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("github.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_gitlab = program.command('gitlab').description('gitlab commands');

	g_gitlab
		.command('create')
		.description('gitlab create')
		.option('--applicationId <value>', 'applicationId')
		.option('--secret <value>', 'secret')
		.option('--groupName <value>', 'groupName')
		.option('--gitProviderId <value>', 'gitProviderId')
		.option('--redirectUri <value>', 'redirectUri')
		.requiredOption('--authId <value>', 'authId')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--gitlabUrl <value>', 'gitlabUrl')
		.option('--gitlabInternalUrl <value>', 'gitlabInternalUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("gitlab.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitlab
		.command('get-gitlab-branches')
		.description('gitlab getGitlabBranches')
		.option('--id <value>', 'id')
		.requiredOption('--owner <value>', 'owner')
		.requiredOption('--repo <value>', 'repo')
		.option('--gitlabId <value>', 'gitlabId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["id"] != null) opts["id"] = Number(opts["id"]);
			const data = await apiGet("gitlab.getGitlabBranches", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitlab
		.command('get-gitlab-repositories')
		.description('gitlab getGitlabRepositories')
		.requiredOption('--gitlabId <value>', 'gitlabId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitlab.getGitlabRepositories", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitlab
		.command('gitlab-providers')
		.description('gitlab gitlabProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitlab.gitlabProviders", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitlab
		.command('one')
		.description('gitlab one')
		.requiredOption('--gitlabId <value>', 'gitlabId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitlab.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitlab
		.command('test-connection')
		.description('gitlab testConnection')
		.requiredOption('--gitlabId <value>', 'gitlabId')
		.option('--groupName <value>', 'groupName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("gitlab.testConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitlab
		.command('update')
		.description('gitlab update')
		.option('--applicationId <value>', 'applicationId')
		.option('--secret <value>', 'secret')
		.option('--groupName <value>', 'groupName')
		.option('--redirectUri <value>', 'redirectUri')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--gitlabId <value>', 'gitlabId')
		.requiredOption('--gitlabUrl <value>', 'gitlabUrl')
		.requiredOption('--gitProviderId <value>', 'gitProviderId')
		.option('--gitlabInternalUrl <value>', 'gitlabInternalUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("gitlab.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_gitProvider = program.command('git-provider').description('git-provider commands');

	g_gitProvider
		.command('get-all')
		.description('gitProvider getAll')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitProvider.getAll", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_gitProvider
		.command('remove')
		.description('gitProvider remove')
		.requiredOption('--gitProviderId <value>', 'gitProviderId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("gitProvider.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_licenseKey = program.command('license-key').description('license-key commands');

	g_licenseKey
		.command('activate')
		.description('licenseKey activate')
		.requiredOption('--licenseKey <value>', 'licenseKey')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("licenseKey.activate", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_licenseKey
		.command('deactivate')
		.description('licenseKey deactivate')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("licenseKey.deactivate", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_licenseKey
		.command('get-enterprise-settings')
		.description('licenseKey getEnterpriseSettings')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("licenseKey.getEnterpriseSettings", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_licenseKey
		.command('have-valid-license-key')
		.description('licenseKey haveValidLicenseKey')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("licenseKey.haveValidLicenseKey", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_licenseKey
		.command('update-enterprise-settings')
		.description('licenseKey updateEnterpriseSettings')
		.option('--enableEnterpriseFeatures', 'enableEnterpriseFeatures')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableEnterpriseFeatures"] != null) opts["enableEnterpriseFeatures"] = opts["enableEnterpriseFeatures"] === true || opts["enableEnterpriseFeatures"] === "true";
			const data = await apiPost("licenseKey.updateEnterpriseSettings", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_licenseKey
		.command('validate')
		.description('licenseKey validate')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("licenseKey.validate", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_mariadb = program.command('mariadb').description('mariadb commands');

	g_mariadb
		.command('change-status')
		.description('mariadb changeStatus')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.requiredOption('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.changeStatus", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('create')
		.description('mariadb create')
		.requiredOption('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--dockerImage <value>', 'dockerImage')
		.option('--databaseRootPassword <value>', 'databaseRootPassword')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--description <value>', 'description')
		.requiredOption('--databaseName <value>', 'databaseName')
		.requiredOption('--databaseUser <value>', 'databaseUser')
		.requiredOption('--databasePassword <value>', 'databasePassword')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('deploy')
		.description('mariadb deploy')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.deploy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('move')
		.description('mariadb move')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.requiredOption('--targetEnvironmentId <value>', 'targetEnvironmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.move", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('one')
		.description('mariadb one')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("mariadb.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('rebuild')
		.description('mariadb rebuild')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.rebuild", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('reload')
		.description('mariadb reload')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.requiredOption('--appName <value>', 'appName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.reload", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('remove')
		.description('mariadb remove')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('save-environment')
		.description('mariadb saveEnvironment')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.requiredOption('--env <value>', 'env')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.saveEnvironment", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('save-external-port')
		.description('mariadb saveExternalPort')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.requiredOption('--externalPort <value>', 'externalPort')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			const data = await apiPost("mariadb.saveExternalPort", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('search')
		.description('mariadb search')
		.option('--q <value>', 'q')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--projectId <value>', 'projectId')
		.option('--environmentId <value>', 'environmentId')
		.option('--limit <value>', 'limit')
		.option('--offset <value>', 'offset')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["limit"] != null) opts["limit"] = Number(opts["limit"]);
			if (opts["offset"] != null) opts["offset"] = Number(opts["offset"]);
			const data = await apiGet("mariadb.search", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('start')
		.description('mariadb start')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.start", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('stop')
		.description('mariadb stop')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.stop", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mariadb
		.command('update')
		.description('mariadb update')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--databaseName <value>', 'databaseName')
		.option('--databaseUser <value>', 'databaseUser')
		.option('--databasePassword <value>', 'databasePassword')
		.option('--databaseRootPassword <value>', 'databaseRootPassword')
		.option('--dockerImage <value>', 'dockerImage')
		.option('--command <value>', 'command')
		.option('--args <value>', 'args')
		.option('--env <value>', 'env')
		.option('--memoryReservation <value>', 'memoryReservation')
		.option('--memoryLimit <value>', 'memoryLimit')
		.option('--cpuReservation <value>', 'cpuReservation')
		.option('--cpuLimit <value>', 'cpuLimit')
		.option('--externalPort <value>', 'externalPort')
		.option('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--healthCheckSwarm <value>', 'healthCheckSwarm')
		.option('--restartPolicySwarm <value>', 'restartPolicySwarm')
		.option('--placementSwarm <value>', 'placementSwarm')
		.option('--updateConfigSwarm <value>', 'updateConfigSwarm')
		.option('--rollbackConfigSwarm <value>', 'rollbackConfigSwarm')
		.option('--modeSwarm <value>', 'modeSwarm')
		.option('--labelsSwarm <value>', 'labelsSwarm')
		.option('--networkSwarm <value>', 'networkSwarm')
		.option('--stopGracePeriodSwarm <value>', 'stopGracePeriodSwarm')
		.option('--endpointSpecSwarm <value>', 'endpointSpecSwarm')
		.option('--ulimitsSwarm <value>', 'ulimitsSwarm')
		.option('--replicas <value>', 'replicas')
		.option('--createdAt <value>', 'createdAt')
		.option('--environmentId <value>', 'environmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			if (opts["replicas"] != null) opts["replicas"] = Number(opts["replicas"]);
			const data = await apiPost("mariadb.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_mongo = program.command('mongo').description('mongo commands');

	g_mongo
		.command('change-status')
		.description('mongo changeStatus')
		.requiredOption('--mongoId <value>', 'mongoId')
		.requiredOption('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.changeStatus", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('create')
		.description('mongo create')
		.requiredOption('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--dockerImage <value>', 'dockerImage')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--description <value>', 'description')
		.requiredOption('--databaseUser <value>', 'databaseUser')
		.requiredOption('--databasePassword <value>', 'databasePassword')
		.option('--serverId <value>', 'serverId')
		.option('--replicaSets', 'replicaSets')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["replicaSets"] != null) opts["replicaSets"] = opts["replicaSets"] === true || opts["replicaSets"] === "true";
			const data = await apiPost("mongo.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('deploy')
		.description('mongo deploy')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.deploy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('move')
		.description('mongo move')
		.requiredOption('--mongoId <value>', 'mongoId')
		.requiredOption('--targetEnvironmentId <value>', 'targetEnvironmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.move", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('one')
		.description('mongo one')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("mongo.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('rebuild')
		.description('mongo rebuild')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.rebuild", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('reload')
		.description('mongo reload')
		.requiredOption('--mongoId <value>', 'mongoId')
		.requiredOption('--appName <value>', 'appName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.reload", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('remove')
		.description('mongo remove')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('save-environment')
		.description('mongo saveEnvironment')
		.requiredOption('--mongoId <value>', 'mongoId')
		.requiredOption('--env <value>', 'env')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.saveEnvironment", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('save-external-port')
		.description('mongo saveExternalPort')
		.requiredOption('--mongoId <value>', 'mongoId')
		.requiredOption('--externalPort <value>', 'externalPort')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			const data = await apiPost("mongo.saveExternalPort", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('search')
		.description('mongo search')
		.option('--q <value>', 'q')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--projectId <value>', 'projectId')
		.option('--environmentId <value>', 'environmentId')
		.option('--limit <value>', 'limit')
		.option('--offset <value>', 'offset')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["limit"] != null) opts["limit"] = Number(opts["limit"]);
			if (opts["offset"] != null) opts["offset"] = Number(opts["offset"]);
			const data = await apiGet("mongo.search", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('start')
		.description('mongo start')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.start", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('stop')
		.description('mongo stop')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.stop", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mongo
		.command('update')
		.description('mongo update')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--databaseUser <value>', 'databaseUser')
		.option('--databasePassword <value>', 'databasePassword')
		.option('--dockerImage <value>', 'dockerImage')
		.option('--command <value>', 'command')
		.option('--args <value>', 'args')
		.option('--env <value>', 'env')
		.option('--memoryReservation <value>', 'memoryReservation')
		.option('--memoryLimit <value>', 'memoryLimit')
		.option('--cpuReservation <value>', 'cpuReservation')
		.option('--cpuLimit <value>', 'cpuLimit')
		.option('--externalPort <value>', 'externalPort')
		.option('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--healthCheckSwarm <value>', 'healthCheckSwarm')
		.option('--restartPolicySwarm <value>', 'restartPolicySwarm')
		.option('--placementSwarm <value>', 'placementSwarm')
		.option('--updateConfigSwarm <value>', 'updateConfigSwarm')
		.option('--rollbackConfigSwarm <value>', 'rollbackConfigSwarm')
		.option('--modeSwarm <value>', 'modeSwarm')
		.option('--labelsSwarm <value>', 'labelsSwarm')
		.option('--networkSwarm <value>', 'networkSwarm')
		.option('--stopGracePeriodSwarm <value>', 'stopGracePeriodSwarm')
		.option('--endpointSpecSwarm <value>', 'endpointSpecSwarm')
		.option('--ulimitsSwarm <value>', 'ulimitsSwarm')
		.option('--replicas <value>', 'replicas')
		.option('--createdAt <value>', 'createdAt')
		.option('--environmentId <value>', 'environmentId')
		.option('--replicaSets', 'replicaSets')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			if (opts["replicas"] != null) opts["replicas"] = Number(opts["replicas"]);
			if (opts["replicaSets"] != null) opts["replicaSets"] = opts["replicaSets"] === true || opts["replicaSets"] === "true";
			const data = await apiPost("mongo.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_mounts = program.command('mounts').description('mounts commands');

	g_mounts
		.command('all-named-by-application-id')
		.description('mounts allNamedByApplicationId')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("mounts.allNamedByApplicationId", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mounts
		.command('create')
		.description('mounts create')
		.requiredOption('--type <value>', 'type (bind, volume, file)')
		.option('--hostPath <value>', 'hostPath')
		.option('--volumeName <value>', 'volumeName')
		.option('--content <value>', 'content')
		.requiredOption('--mountPath <value>', 'mountPath')
		.option('--serviceType <value>', 'serviceType (application, postgres, mysql, mariadb, mongo, redis, compose)')
		.option('--filePath <value>', 'filePath')
		.requiredOption('--serviceId <value>', 'serviceId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mounts.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mounts
		.command('list-by-service-id')
		.description('mounts listByServiceId')
		.requiredOption('--serviceId <value>', 'serviceId')
		.requiredOption('--serviceType <value>', 'serviceType (application, postgres, mysql, mariadb, mongo, redis, compose)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("mounts.listByServiceId", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mounts
		.command('one')
		.description('mounts one')
		.requiredOption('--mountId <value>', 'mountId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("mounts.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mounts
		.command('remove')
		.description('mounts remove')
		.requiredOption('--mountId <value>', 'mountId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mounts.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mounts
		.command('update')
		.description('mounts update')
		.requiredOption('--mountId <value>', 'mountId')
		.option('--type <value>', 'type (bind, volume, file)')
		.option('--hostPath <value>', 'hostPath')
		.option('--volumeName <value>', 'volumeName')
		.option('--filePath <value>', 'filePath')
		.option('--content <value>', 'content')
		.option('--serviceType <value>', 'serviceType (application, postgres, mysql, mariadb, mongo, redis, compose)')
		.option('--mountPath <value>', 'mountPath')
		.option('--applicationId <value>', 'applicationId')
		.option('--postgresId <value>', 'postgresId')
		.option('--mariadbId <value>', 'mariadbId')
		.option('--mongoId <value>', 'mongoId')
		.option('--mysqlId <value>', 'mysqlId')
		.option('--redisId <value>', 'redisId')
		.option('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mounts.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_mysql = program.command('mysql').description('mysql commands');

	g_mysql
		.command('change-status')
		.description('mysql changeStatus')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.requiredOption('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.changeStatus", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('create')
		.description('mysql create')
		.requiredOption('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--dockerImage <value>', 'dockerImage')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--description <value>', 'description')
		.requiredOption('--databaseName <value>', 'databaseName')
		.requiredOption('--databaseUser <value>', 'databaseUser')
		.requiredOption('--databasePassword <value>', 'databasePassword')
		.option('--databaseRootPassword <value>', 'databaseRootPassword')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('deploy')
		.description('mysql deploy')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.deploy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('move')
		.description('mysql move')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.requiredOption('--targetEnvironmentId <value>', 'targetEnvironmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.move", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('one')
		.description('mysql one')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("mysql.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('rebuild')
		.description('mysql rebuild')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.rebuild", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('reload')
		.description('mysql reload')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.requiredOption('--appName <value>', 'appName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.reload", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('remove')
		.description('mysql remove')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('save-environment')
		.description('mysql saveEnvironment')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.requiredOption('--env <value>', 'env')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.saveEnvironment", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('save-external-port')
		.description('mysql saveExternalPort')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.requiredOption('--externalPort <value>', 'externalPort')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			const data = await apiPost("mysql.saveExternalPort", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('search')
		.description('mysql search')
		.option('--q <value>', 'q')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--projectId <value>', 'projectId')
		.option('--environmentId <value>', 'environmentId')
		.option('--limit <value>', 'limit')
		.option('--offset <value>', 'offset')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["limit"] != null) opts["limit"] = Number(opts["limit"]);
			if (opts["offset"] != null) opts["offset"] = Number(opts["offset"]);
			const data = await apiGet("mysql.search", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('start')
		.description('mysql start')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.start", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('stop')
		.description('mysql stop')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.stop", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_mysql
		.command('update')
		.description('mysql update')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--databaseName <value>', 'databaseName')
		.option('--databaseUser <value>', 'databaseUser')
		.option('--databasePassword <value>', 'databasePassword')
		.option('--databaseRootPassword <value>', 'databaseRootPassword')
		.option('--dockerImage <value>', 'dockerImage')
		.option('--command <value>', 'command')
		.option('--args <value>', 'args')
		.option('--env <value>', 'env')
		.option('--memoryReservation <value>', 'memoryReservation')
		.option('--memoryLimit <value>', 'memoryLimit')
		.option('--cpuReservation <value>', 'cpuReservation')
		.option('--cpuLimit <value>', 'cpuLimit')
		.option('--externalPort <value>', 'externalPort')
		.option('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--healthCheckSwarm <value>', 'healthCheckSwarm')
		.option('--restartPolicySwarm <value>', 'restartPolicySwarm')
		.option('--placementSwarm <value>', 'placementSwarm')
		.option('--updateConfigSwarm <value>', 'updateConfigSwarm')
		.option('--rollbackConfigSwarm <value>', 'rollbackConfigSwarm')
		.option('--modeSwarm <value>', 'modeSwarm')
		.option('--labelsSwarm <value>', 'labelsSwarm')
		.option('--networkSwarm <value>', 'networkSwarm')
		.option('--stopGracePeriodSwarm <value>', 'stopGracePeriodSwarm')
		.option('--endpointSpecSwarm <value>', 'endpointSpecSwarm')
		.option('--ulimitsSwarm <value>', 'ulimitsSwarm')
		.option('--replicas <value>', 'replicas')
		.option('--createdAt <value>', 'createdAt')
		.option('--environmentId <value>', 'environmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			if (opts["replicas"] != null) opts["replicas"] = Number(opts["replicas"]);
			const data = await apiPost("mysql.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_notification = program.command('notification').description('notification commands');

	g_notification
		.command('all')
		.description('notification all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("notification.all", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('create-custom')
		.description('notification createCustom')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
		.requiredOption('--endpoint <value>', 'endpoint')
		.option('--headers <value>', 'headers')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createCustom", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('create-discord')
		.description('notification createDiscord')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--volumeBackup', 'volumeBackup')
		.requiredOption('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appDeploy', 'appDeploy')
		.requiredOption('--dockerCleanup', 'dockerCleanup')
		.requiredOption('--serverThreshold', 'serverThreshold')
		.requiredOption('--webhookUrl <value>', 'webhookUrl')
		.requiredOption('--decoration', 'decoration')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["decoration"] != null) opts["decoration"] = opts["decoration"] === true || opts["decoration"] === "true";
			const data = await apiPost("notification.createDiscord", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('create-email')
		.description('notification createEmail')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--volumeBackup', 'volumeBackup')
		.requiredOption('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appDeploy', 'appDeploy')
		.requiredOption('--dockerCleanup', 'dockerCleanup')
		.requiredOption('--serverThreshold', 'serverThreshold')
		.requiredOption('--smtpServer <value>', 'smtpServer')
		.requiredOption('--smtpPort <value>', 'smtpPort')
		.requiredOption('--username <value>', 'username')
		.requiredOption('--password <value>', 'password')
		.requiredOption('--fromAddress <value>', 'fromAddress')
		.requiredOption('--toAddresses <value>', 'toAddresses')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["smtpPort"] != null) opts["smtpPort"] = Number(opts["smtpPort"]);
			const data = await apiPost("notification.createEmail", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('create-gotify')
		.description('notification createGotify')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--volumeBackup', 'volumeBackup')
		.requiredOption('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appDeploy', 'appDeploy')
		.requiredOption('--dockerCleanup', 'dockerCleanup')
		.requiredOption('--serverUrl <value>', 'serverUrl')
		.requiredOption('--appToken <value>', 'appToken')
		.requiredOption('--priority <value>', 'priority')
		.requiredOption('--decoration', 'decoration')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			if (opts["decoration"] != null) opts["decoration"] = opts["decoration"] === true || opts["decoration"] === "true";
			const data = await apiPost("notification.createGotify", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('create-lark')
		.description('notification createLark')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--volumeBackup', 'volumeBackup')
		.requiredOption('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appDeploy', 'appDeploy')
		.requiredOption('--dockerCleanup', 'dockerCleanup')
		.requiredOption('--serverThreshold', 'serverThreshold')
		.requiredOption('--webhookUrl <value>', 'webhookUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createLark", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('create-ntfy')
		.description('notification createNtfy')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--volumeBackup', 'volumeBackup')
		.requiredOption('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appDeploy', 'appDeploy')
		.requiredOption('--dockerCleanup', 'dockerCleanup')
		.requiredOption('--serverUrl <value>', 'serverUrl')
		.requiredOption('--topic <value>', 'topic')
		.requiredOption('--accessToken <value>', 'accessToken')
		.requiredOption('--priority <value>', 'priority')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			const data = await apiPost("notification.createNtfy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('create-pushover')
		.description('notification createPushover')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
		.requiredOption('--userKey <value>', 'userKey')
		.requiredOption('--apiToken <value>', 'apiToken')
		.option('--priority <value>', 'priority')
		.option('--retry <value>', 'retry')
		.option('--expire <value>', 'expire')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			if (opts["retry"] != null) opts["retry"] = Number(opts["retry"]);
			if (opts["expire"] != null) opts["expire"] = Number(opts["expire"]);
			const data = await apiPost("notification.createPushover", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('create-resend')
		.description('notification createResend')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--volumeBackup', 'volumeBackup')
		.requiredOption('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appDeploy', 'appDeploy')
		.requiredOption('--dockerCleanup', 'dockerCleanup')
		.requiredOption('--serverThreshold', 'serverThreshold')
		.requiredOption('--apiKey <value>', 'apiKey')
		.requiredOption('--fromAddress <value>', 'fromAddress')
		.requiredOption('--toAddresses <value>', 'toAddresses')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createResend", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('create-slack')
		.description('notification createSlack')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--volumeBackup', 'volumeBackup')
		.requiredOption('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appDeploy', 'appDeploy')
		.requiredOption('--dockerCleanup', 'dockerCleanup')
		.requiredOption('--serverThreshold', 'serverThreshold')
		.requiredOption('--webhookUrl <value>', 'webhookUrl')
		.requiredOption('--channel <value>', 'channel')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createSlack", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('create-teams')
		.description('notification createTeams')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--volumeBackup', 'volumeBackup')
		.requiredOption('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appDeploy', 'appDeploy')
		.requiredOption('--dockerCleanup', 'dockerCleanup')
		.requiredOption('--serverThreshold', 'serverThreshold')
		.requiredOption('--webhookUrl <value>', 'webhookUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createTeams", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('create-telegram')
		.description('notification createTelegram')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--volumeBackup', 'volumeBackup')
		.requiredOption('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appDeploy', 'appDeploy')
		.requiredOption('--dockerCleanup', 'dockerCleanup')
		.requiredOption('--serverThreshold', 'serverThreshold')
		.requiredOption('--botToken <value>', 'botToken')
		.requiredOption('--chatId <value>', 'chatId')
		.requiredOption('--messageThreadId <value>', 'messageThreadId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createTelegram", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('get-email-providers')
		.description('notification getEmailProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("notification.getEmailProviders", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('one')
		.description('notification one')
		.requiredOption('--notificationId <value>', 'notificationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("notification.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('receive-notification')
		.description('notification receiveNotification')
		.option('--ServerType <value>', 'ServerType (Dokploy, Remote)')
		.requiredOption('--Type <value>', 'Type (Memory, CPU)')
		.requiredOption('--Value <value>', 'Value')
		.requiredOption('--Threshold <value>', 'Threshold')
		.requiredOption('--Message <value>', 'Message')
		.requiredOption('--Timestamp <value>', 'Timestamp')
		.requiredOption('--Token <value>', 'Token')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["Value"] != null) opts["Value"] = Number(opts["Value"]);
			if (opts["Threshold"] != null) opts["Threshold"] = Number(opts["Threshold"]);
			const data = await apiPost("notification.receiveNotification", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('remove')
		.description('notification remove')
		.requiredOption('--notificationId <value>', 'notificationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("notification.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('test-custom-connection')
		.description('notification testCustomConnection')
		.requiredOption('--endpoint <value>', 'endpoint')
		.option('--headers <value>', 'headers')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("notification.testCustomConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('test-discord-connection')
		.description('notification testDiscordConnection')
		.requiredOption('--webhookUrl <value>', 'webhookUrl')
		.option('--decoration', 'decoration')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["decoration"] != null) opts["decoration"] = opts["decoration"] === true || opts["decoration"] === "true";
			const data = await apiPost("notification.testDiscordConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('test-email-connection')
		.description('notification testEmailConnection')
		.requiredOption('--smtpServer <value>', 'smtpServer')
		.requiredOption('--smtpPort <value>', 'smtpPort')
		.requiredOption('--username <value>', 'username')
		.requiredOption('--password <value>', 'password')
		.requiredOption('--toAddresses <value>', 'toAddresses')
		.requiredOption('--fromAddress <value>', 'fromAddress')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["smtpPort"] != null) opts["smtpPort"] = Number(opts["smtpPort"]);
			const data = await apiPost("notification.testEmailConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('test-gotify-connection')
		.description('notification testGotifyConnection')
		.requiredOption('--serverUrl <value>', 'serverUrl')
		.requiredOption('--appToken <value>', 'appToken')
		.requiredOption('--priority <value>', 'priority')
		.option('--decoration', 'decoration')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			if (opts["decoration"] != null) opts["decoration"] = opts["decoration"] === true || opts["decoration"] === "true";
			const data = await apiPost("notification.testGotifyConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('test-lark-connection')
		.description('notification testLarkConnection')
		.requiredOption('--webhookUrl <value>', 'webhookUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("notification.testLarkConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('test-ntfy-connection')
		.description('notification testNtfyConnection')
		.requiredOption('--serverUrl <value>', 'serverUrl')
		.requiredOption('--topic <value>', 'topic')
		.requiredOption('--accessToken <value>', 'accessToken')
		.requiredOption('--priority <value>', 'priority')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			const data = await apiPost("notification.testNtfyConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('test-pushover-connection')
		.description('notification testPushoverConnection')
		.requiredOption('--userKey <value>', 'userKey')
		.requiredOption('--apiToken <value>', 'apiToken')
		.requiredOption('--priority <value>', 'priority')
		.option('--retry <value>', 'retry')
		.option('--expire <value>', 'expire')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			if (opts["retry"] != null) opts["retry"] = Number(opts["retry"]);
			if (opts["expire"] != null) opts["expire"] = Number(opts["expire"]);
			const data = await apiPost("notification.testPushoverConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('test-resend-connection')
		.description('notification testResendConnection')
		.requiredOption('--apiKey <value>', 'apiKey')
		.requiredOption('--fromAddress <value>', 'fromAddress')
		.requiredOption('--toAddresses <value>', 'toAddresses')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("notification.testResendConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('test-slack-connection')
		.description('notification testSlackConnection')
		.requiredOption('--webhookUrl <value>', 'webhookUrl')
		.requiredOption('--channel <value>', 'channel')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("notification.testSlackConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('test-teams-connection')
		.description('notification testTeamsConnection')
		.requiredOption('--webhookUrl <value>', 'webhookUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("notification.testTeamsConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('test-telegram-connection')
		.description('notification testTelegramConnection')
		.requiredOption('--botToken <value>', 'botToken')
		.requiredOption('--chatId <value>', 'chatId')
		.requiredOption('--messageThreadId <value>', 'messageThreadId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("notification.testTelegramConnection", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('update-custom')
		.description('notification updateCustom')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
		.option('--endpoint <value>', 'endpoint')
		.option('--headers <value>', 'headers')
		.requiredOption('--notificationId <value>', 'notificationId')
		.requiredOption('--customId <value>', 'customId')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateCustom", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('update-discord')
		.description('notification updateDiscord')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
		.option('--webhookUrl <value>', 'webhookUrl')
		.option('--decoration', 'decoration')
		.requiredOption('--notificationId <value>', 'notificationId')
		.requiredOption('--discordId <value>', 'discordId')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["decoration"] != null) opts["decoration"] = opts["decoration"] === true || opts["decoration"] === "true";
			const data = await apiPost("notification.updateDiscord", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('update-email')
		.description('notification updateEmail')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
		.option('--smtpServer <value>', 'smtpServer')
		.option('--smtpPort <value>', 'smtpPort')
		.option('--username <value>', 'username')
		.option('--password <value>', 'password')
		.option('--fromAddress <value>', 'fromAddress')
		.option('--toAddresses <value>', 'toAddresses')
		.requiredOption('--notificationId <value>', 'notificationId')
		.requiredOption('--emailId <value>', 'emailId')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["smtpPort"] != null) opts["smtpPort"] = Number(opts["smtpPort"]);
			const data = await apiPost("notification.updateEmail", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('update-gotify')
		.description('notification updateGotify')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverUrl <value>', 'serverUrl')
		.option('--appToken <value>', 'appToken')
		.option('--priority <value>', 'priority')
		.option('--decoration', 'decoration')
		.requiredOption('--notificationId <value>', 'notificationId')
		.requiredOption('--gotifyId <value>', 'gotifyId')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			if (opts["decoration"] != null) opts["decoration"] = opts["decoration"] === true || opts["decoration"] === "true";
			const data = await apiPost("notification.updateGotify", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('update-lark')
		.description('notification updateLark')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
		.option('--webhookUrl <value>', 'webhookUrl')
		.requiredOption('--notificationId <value>', 'notificationId')
		.requiredOption('--larkId <value>', 'larkId')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateLark", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('update-ntfy')
		.description('notification updateNtfy')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverUrl <value>', 'serverUrl')
		.option('--topic <value>', 'topic')
		.option('--accessToken <value>', 'accessToken')
		.option('--priority <value>', 'priority')
		.requiredOption('--notificationId <value>', 'notificationId')
		.requiredOption('--ntfyId <value>', 'ntfyId')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			const data = await apiPost("notification.updateNtfy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('update-pushover')
		.description('notification updatePushover')
		.requiredOption('--notificationId <value>', 'notificationId')
		.requiredOption('--pushoverId <value>', 'pushoverId')
		.option('--organizationId <value>', 'organizationId')
		.option('--userKey <value>', 'userKey')
		.option('--apiToken <value>', 'apiToken')
		.option('--priority <value>', 'priority')
		.option('--retry <value>', 'retry')
		.option('--expire <value>', 'expire')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			if (opts["retry"] != null) opts["retry"] = Number(opts["retry"]);
			if (opts["expire"] != null) opts["expire"] = Number(opts["expire"]);
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updatePushover", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('update-resend')
		.description('notification updateResend')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
		.option('--apiKey <value>', 'apiKey')
		.option('--fromAddress <value>', 'fromAddress')
		.option('--toAddresses <value>', 'toAddresses')
		.requiredOption('--notificationId <value>', 'notificationId')
		.requiredOption('--resendId <value>', 'resendId')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateResend", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('update-slack')
		.description('notification updateSlack')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
		.option('--webhookUrl <value>', 'webhookUrl')
		.option('--channel <value>', 'channel')
		.requiredOption('--notificationId <value>', 'notificationId')
		.requiredOption('--slackId <value>', 'slackId')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateSlack", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('update-teams')
		.description('notification updateTeams')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
		.option('--webhookUrl <value>', 'webhookUrl')
		.requiredOption('--notificationId <value>', 'notificationId')
		.requiredOption('--teamsId <value>', 'teamsId')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateTeams", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_notification
		.command('update-telegram')
		.description('notification updateTelegram')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
		.option('--botToken <value>', 'botToken')
		.option('--chatId <value>', 'chatId')
		.option('--messageThreadId <value>', 'messageThreadId')
		.requiredOption('--notificationId <value>', 'notificationId')
		.requiredOption('--telegramId <value>', 'telegramId')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateTelegram", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_organization = program.command('organization').description('organization commands');

	g_organization
		.command('active')
		.description('organization active')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("organization.active", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_organization
		.command('all')
		.description('organization all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("organization.all", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_organization
		.command('all-invitations')
		.description('organization allInvitations')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("organization.allInvitations", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_organization
		.command('create')
		.description('organization create')
		.requiredOption('--name <value>', 'name')
		.option('--logo <value>', 'logo')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("organization.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_organization
		.command('delete')
		.description('organization delete')
		.requiredOption('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("organization.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_organization
		.command('one')
		.description('organization one')
		.requiredOption('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("organization.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_organization
		.command('remove-invitation')
		.description('organization removeInvitation')
		.requiredOption('--invitationId <value>', 'invitationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("organization.removeInvitation", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_organization
		.command('set-default')
		.description('organization setDefault')
		.requiredOption('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("organization.setDefault", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_organization
		.command('update')
		.description('organization update')
		.requiredOption('--organizationId <value>', 'organizationId')
		.requiredOption('--name <value>', 'name')
		.option('--logo <value>', 'logo')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("organization.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_organization
		.command('update-member-role')
		.description('organization updateMemberRole')
		.requiredOption('--memberId <value>', 'memberId')
		.requiredOption('--role <value>', 'role (admin, member)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("organization.updateMemberRole", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_patch = program.command('patch').description('patch commands');

	g_patch
		.command('by-entity-id')
		.description('patch byEntityId')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--type <value>', 'type (application, compose)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("patch.byEntityId", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_patch
		.command('clean-patch-repos')
		.description('patch cleanPatchRepos')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("patch.cleanPatchRepos", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_patch
		.command('create')
		.description('patch create')
		.requiredOption('--filePath <value>', 'filePath')
		.requiredOption('--content <value>', 'content')
		.option('--type <value>', 'type (create, update, delete)')
		.option('--enabled', 'enabled')
		.option('--applicationId <value>', 'applicationId')
		.option('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			const data = await apiPost("patch.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_patch
		.command('delete')
		.description('patch delete')
		.requiredOption('--patchId <value>', 'patchId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("patch.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_patch
		.command('ensure-repo')
		.description('patch ensureRepo')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--type <value>', 'type (application, compose)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("patch.ensureRepo", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_patch
		.command('mark-file-for-deletion')
		.description('patch markFileForDeletion')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--type <value>', 'type (application, compose)')
		.requiredOption('--filePath <value>', 'filePath')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("patch.markFileForDeletion", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_patch
		.command('one')
		.description('patch one')
		.requiredOption('--patchId <value>', 'patchId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("patch.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_patch
		.command('read-repo-directories')
		.description('patch readRepoDirectories')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--type <value>', 'type (application, compose)')
		.requiredOption('--repoPath <value>', 'repoPath')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("patch.readRepoDirectories", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_patch
		.command('read-repo-file')
		.description('patch readRepoFile')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--type <value>', 'type (application, compose)')
		.requiredOption('--filePath <value>', 'filePath')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("patch.readRepoFile", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_patch
		.command('save-file-as-patch')
		.description('patch saveFileAsPatch')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--type <value>', 'type (application, compose)')
		.requiredOption('--filePath <value>', 'filePath')
		.requiredOption('--content <value>', 'content')
		.option('--patchType <value>', 'patchType (create, update)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("patch.saveFileAsPatch", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_patch
		.command('toggle-enabled')
		.description('patch toggleEnabled')
		.requiredOption('--patchId <value>', 'patchId')
		.requiredOption('--enabled', 'enabled')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			const data = await apiPost("patch.toggleEnabled", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_patch
		.command('update')
		.description('patch update')
		.requiredOption('--patchId <value>', 'patchId')
		.option('--type <value>', 'type (create, update, delete)')
		.option('--filePath <value>', 'filePath')
		.option('--enabled', 'enabled')
		.option('--content <value>', 'content')
		.option('--createdAt <value>', 'createdAt')
		.option('--updatedAt <value>', 'updatedAt')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			const data = await apiPost("patch.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_port = program.command('port').description('port commands');

	g_port
		.command('create')
		.description('port create')
		.requiredOption('--publishedPort <value>', 'publishedPort')
		.requiredOption('--publishMode <value>', 'publishMode (ingress, host)')
		.requiredOption('--targetPort <value>', 'targetPort')
		.requiredOption('--protocol <value>', 'protocol (tcp, udp)')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["publishedPort"] != null) opts["publishedPort"] = Number(opts["publishedPort"]);
			if (opts["targetPort"] != null) opts["targetPort"] = Number(opts["targetPort"]);
			const data = await apiPost("port.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_port
		.command('delete')
		.description('port delete')
		.requiredOption('--portId <value>', 'portId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("port.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_port
		.command('one')
		.description('port one')
		.requiredOption('--portId <value>', 'portId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("port.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_port
		.command('update')
		.description('port update')
		.requiredOption('--portId <value>', 'portId')
		.requiredOption('--publishedPort <value>', 'publishedPort')
		.requiredOption('--publishMode <value>', 'publishMode (ingress, host)')
		.requiredOption('--targetPort <value>', 'targetPort')
		.requiredOption('--protocol <value>', 'protocol (tcp, udp)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["publishedPort"] != null) opts["publishedPort"] = Number(opts["publishedPort"]);
			if (opts["targetPort"] != null) opts["targetPort"] = Number(opts["targetPort"]);
			const data = await apiPost("port.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_postgres = program.command('postgres').description('postgres commands');

	g_postgres
		.command('change-status')
		.description('postgres changeStatus')
		.requiredOption('--postgresId <value>', 'postgresId')
		.requiredOption('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.changeStatus", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('create')
		.description('postgres create')
		.requiredOption('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.requiredOption('--databaseName <value>', 'databaseName')
		.requiredOption('--databaseUser <value>', 'databaseUser')
		.requiredOption('--databasePassword <value>', 'databasePassword')
		.option('--dockerImage <value>', 'dockerImage')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--description <value>', 'description')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('deploy')
		.description('postgres deploy')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.deploy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('move')
		.description('postgres move')
		.requiredOption('--postgresId <value>', 'postgresId')
		.requiredOption('--targetEnvironmentId <value>', 'targetEnvironmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.move", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('one')
		.description('postgres one')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("postgres.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('rebuild')
		.description('postgres rebuild')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.rebuild", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('reload')
		.description('postgres reload')
		.requiredOption('--postgresId <value>', 'postgresId')
		.requiredOption('--appName <value>', 'appName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.reload", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('remove')
		.description('postgres remove')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('save-environment')
		.description('postgres saveEnvironment')
		.requiredOption('--postgresId <value>', 'postgresId')
		.requiredOption('--env <value>', 'env')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.saveEnvironment", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('save-external-port')
		.description('postgres saveExternalPort')
		.requiredOption('--postgresId <value>', 'postgresId')
		.requiredOption('--externalPort <value>', 'externalPort')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			const data = await apiPost("postgres.saveExternalPort", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('search')
		.description('postgres search')
		.option('--q <value>', 'q')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--projectId <value>', 'projectId')
		.option('--environmentId <value>', 'environmentId')
		.option('--limit <value>', 'limit')
		.option('--offset <value>', 'offset')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["limit"] != null) opts["limit"] = Number(opts["limit"]);
			if (opts["offset"] != null) opts["offset"] = Number(opts["offset"]);
			const data = await apiGet("postgres.search", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('start')
		.description('postgres start')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.start", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('stop')
		.description('postgres stop')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.stop", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_postgres
		.command('update')
		.description('postgres update')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--databaseName <value>', 'databaseName')
		.option('--databaseUser <value>', 'databaseUser')
		.option('--databasePassword <value>', 'databasePassword')
		.option('--description <value>', 'description')
		.option('--dockerImage <value>', 'dockerImage')
		.option('--command <value>', 'command')
		.option('--args <value>', 'args')
		.option('--env <value>', 'env')
		.option('--memoryReservation <value>', 'memoryReservation')
		.option('--externalPort <value>', 'externalPort')
		.option('--memoryLimit <value>', 'memoryLimit')
		.option('--cpuReservation <value>', 'cpuReservation')
		.option('--cpuLimit <value>', 'cpuLimit')
		.option('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--healthCheckSwarm <value>', 'healthCheckSwarm')
		.option('--restartPolicySwarm <value>', 'restartPolicySwarm')
		.option('--placementSwarm <value>', 'placementSwarm')
		.option('--updateConfigSwarm <value>', 'updateConfigSwarm')
		.option('--rollbackConfigSwarm <value>', 'rollbackConfigSwarm')
		.option('--modeSwarm <value>', 'modeSwarm')
		.option('--labelsSwarm <value>', 'labelsSwarm')
		.option('--networkSwarm <value>', 'networkSwarm')
		.option('--stopGracePeriodSwarm <value>', 'stopGracePeriodSwarm')
		.option('--endpointSpecSwarm <value>', 'endpointSpecSwarm')
		.option('--ulimitsSwarm <value>', 'ulimitsSwarm')
		.option('--replicas <value>', 'replicas')
		.option('--createdAt <value>', 'createdAt')
		.option('--environmentId <value>', 'environmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			if (opts["replicas"] != null) opts["replicas"] = Number(opts["replicas"]);
			const data = await apiPost("postgres.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_previewDeployment = program.command('preview-deployment').description('preview-deployment commands');

	g_previewDeployment
		.command('all')
		.description('previewDeployment all')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("previewDeployment.all", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_previewDeployment
		.command('delete')
		.description('previewDeployment delete')
		.requiredOption('--previewDeploymentId <value>', 'previewDeploymentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("previewDeployment.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_previewDeployment
		.command('one')
		.description('previewDeployment one')
		.requiredOption('--previewDeploymentId <value>', 'previewDeploymentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("previewDeployment.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_previewDeployment
		.command('redeploy')
		.description('previewDeployment redeploy')
		.requiredOption('--previewDeploymentId <value>', 'previewDeploymentId')
		.option('--title <value>', 'title')
		.option('--description <value>', 'description')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("previewDeployment.redeploy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_project = program.command('project').description('project commands');

	g_project
		.command('all')
		.description('project all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("project.all", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_project
		.command('all-for-permissions')
		.description('project allForPermissions')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("project.allForPermissions", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_project
		.command('create')
		.description('project create')
		.requiredOption('--name <value>', 'name')
		.option('--description <value>', 'description')
		.option('--env <value>', 'env')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("project.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_project
		.command('duplicate')
		.description('project duplicate')
		.requiredOption('--sourceEnvironmentId <value>', 'sourceEnvironmentId')
		.requiredOption('--name <value>', 'name')
		.option('--description <value>', 'description')
		.option('--includeServices', 'includeServices')
		.option('--selectedServices <value>', 'selectedServices')
		.option('--duplicateInSameProject', 'duplicateInSameProject')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["includeServices"] != null) opts["includeServices"] = opts["includeServices"] === true || opts["includeServices"] === "true";
			if (opts["duplicateInSameProject"] != null) opts["duplicateInSameProject"] = opts["duplicateInSameProject"] === true || opts["duplicateInSameProject"] === "true";
			const data = await apiPost("project.duplicate", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_project
		.command('one')
		.description('project one')
		.requiredOption('--projectId <value>', 'projectId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("project.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_project
		.command('remove')
		.description('project remove')
		.requiredOption('--projectId <value>', 'projectId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("project.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_project
		.command('search')
		.description('project search')
		.option('--q <value>', 'q')
		.option('--name <value>', 'name')
		.option('--description <value>', 'description')
		.option('--limit <value>', 'limit')
		.option('--offset <value>', 'offset')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["limit"] != null) opts["limit"] = Number(opts["limit"]);
			if (opts["offset"] != null) opts["offset"] = Number(opts["offset"]);
			const data = await apiGet("project.search", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_project
		.command('update')
		.description('project update')
		.requiredOption('--projectId <value>', 'projectId')
		.option('--name <value>', 'name')
		.option('--description <value>', 'description')
		.option('--createdAt <value>', 'createdAt')
		.option('--organizationId <value>', 'organizationId')
		.option('--env <value>', 'env')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("project.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_redirects = program.command('redirects').description('redirects commands');

	g_redirects
		.command('create')
		.description('redirects create')
		.requiredOption('--regex <value>', 'regex')
		.requiredOption('--replacement <value>', 'replacement')
		.requiredOption('--permanent', 'permanent')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["permanent"] != null) opts["permanent"] = opts["permanent"] === true || opts["permanent"] === "true";
			const data = await apiPost("redirects.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redirects
		.command('delete')
		.description('redirects delete')
		.requiredOption('--redirectId <value>', 'redirectId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redirects.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redirects
		.command('one')
		.description('redirects one')
		.requiredOption('--redirectId <value>', 'redirectId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("redirects.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redirects
		.command('update')
		.description('redirects update')
		.requiredOption('--redirectId <value>', 'redirectId')
		.requiredOption('--regex <value>', 'regex')
		.requiredOption('--replacement <value>', 'replacement')
		.requiredOption('--permanent', 'permanent')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["permanent"] != null) opts["permanent"] = opts["permanent"] === true || opts["permanent"] === "true";
			const data = await apiPost("redirects.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_redis = program.command('redis').description('redis commands');

	g_redis
		.command('change-status')
		.description('redis changeStatus')
		.requiredOption('--redisId <value>', 'redisId')
		.requiredOption('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.changeStatus", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('create')
		.description('redis create')
		.requiredOption('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.requiredOption('--databasePassword <value>', 'databasePassword')
		.option('--dockerImage <value>', 'dockerImage')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--description <value>', 'description')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('deploy')
		.description('redis deploy')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.deploy", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('move')
		.description('redis move')
		.requiredOption('--redisId <value>', 'redisId')
		.requiredOption('--targetEnvironmentId <value>', 'targetEnvironmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.move", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('one')
		.description('redis one')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("redis.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('rebuild')
		.description('redis rebuild')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.rebuild", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('reload')
		.description('redis reload')
		.requiredOption('--redisId <value>', 'redisId')
		.requiredOption('--appName <value>', 'appName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.reload", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('remove')
		.description('redis remove')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('save-environment')
		.description('redis saveEnvironment')
		.requiredOption('--redisId <value>', 'redisId')
		.requiredOption('--env <value>', 'env')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.saveEnvironment", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('save-external-port')
		.description('redis saveExternalPort')
		.requiredOption('--redisId <value>', 'redisId')
		.requiredOption('--externalPort <value>', 'externalPort')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			const data = await apiPost("redis.saveExternalPort", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('search')
		.description('redis search')
		.option('--q <value>', 'q')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--projectId <value>', 'projectId')
		.option('--environmentId <value>', 'environmentId')
		.option('--limit <value>', 'limit')
		.option('--offset <value>', 'offset')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["limit"] != null) opts["limit"] = Number(opts["limit"]);
			if (opts["offset"] != null) opts["offset"] = Number(opts["offset"]);
			const data = await apiGet("redis.search", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('start')
		.description('redis start')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.start", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('stop')
		.description('redis stop')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.stop", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_redis
		.command('update')
		.description('redis update')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--databasePassword <value>', 'databasePassword')
		.option('--dockerImage <value>', 'dockerImage')
		.option('--command <value>', 'command')
		.option('--args <value>', 'args')
		.option('--env <value>', 'env')
		.option('--memoryReservation <value>', 'memoryReservation')
		.option('--memoryLimit <value>', 'memoryLimit')
		.option('--cpuReservation <value>', 'cpuReservation')
		.option('--cpuLimit <value>', 'cpuLimit')
		.option('--externalPort <value>', 'externalPort')
		.option('--createdAt <value>', 'createdAt')
		.option('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--healthCheckSwarm <value>', 'healthCheckSwarm')
		.option('--restartPolicySwarm <value>', 'restartPolicySwarm')
		.option('--placementSwarm <value>', 'placementSwarm')
		.option('--updateConfigSwarm <value>', 'updateConfigSwarm')
		.option('--rollbackConfigSwarm <value>', 'rollbackConfigSwarm')
		.option('--modeSwarm <value>', 'modeSwarm')
		.option('--labelsSwarm <value>', 'labelsSwarm')
		.option('--networkSwarm <value>', 'networkSwarm')
		.option('--stopGracePeriodSwarm <value>', 'stopGracePeriodSwarm')
		.option('--endpointSpecSwarm <value>', 'endpointSpecSwarm')
		.option('--ulimitsSwarm <value>', 'ulimitsSwarm')
		.option('--replicas <value>', 'replicas')
		.option('--environmentId <value>', 'environmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			if (opts["replicas"] != null) opts["replicas"] = Number(opts["replicas"]);
			const data = await apiPost("redis.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_registry = program.command('registry').description('registry commands');

	g_registry
		.command('all')
		.description('registry all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("registry.all", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_registry
		.command('create')
		.description('registry create')
		.requiredOption('--registryName <value>', 'registryName')
		.requiredOption('--username <value>', 'username')
		.requiredOption('--password <value>', 'password')
		.requiredOption('--registryUrl <value>', 'registryUrl')
		.requiredOption('--registryType <value>', 'registryType (cloud)')
		.requiredOption('--imagePrefix <value>', 'imagePrefix')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("registry.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_registry
		.command('one')
		.description('registry one')
		.requiredOption('--registryId <value>', 'registryId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("registry.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_registry
		.command('remove')
		.description('registry remove')
		.requiredOption('--registryId <value>', 'registryId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("registry.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_registry
		.command('test-registry')
		.description('registry testRegistry')
		.option('--registryName <value>', 'registryName')
		.requiredOption('--username <value>', 'username')
		.requiredOption('--password <value>', 'password')
		.requiredOption('--registryUrl <value>', 'registryUrl')
		.requiredOption('--registryType <value>', 'registryType (cloud)')
		.option('--imagePrefix <value>', 'imagePrefix')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("registry.testRegistry", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_registry
		.command('test-registry-by-id')
		.description('registry testRegistryById')
		.option('--registryId <value>', 'registryId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("registry.testRegistryById", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_registry
		.command('update')
		.description('registry update')
		.requiredOption('--registryId <value>', 'registryId')
		.option('--registryName <value>', 'registryName')
		.option('--imagePrefix <value>', 'imagePrefix')
		.option('--username <value>', 'username')
		.option('--password <value>', 'password')
		.option('--registryUrl <value>', 'registryUrl')
		.option('--createdAt <value>', 'createdAt')
		.option('--registryType <value>', 'registryType (cloud)')
		.option('--organizationId <value>', 'organizationId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("registry.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_rollback = program.command('rollback').description('rollback commands');

	g_rollback
		.command('delete')
		.description('rollback delete')
		.requiredOption('--rollbackId <value>', 'rollbackId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("rollback.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_rollback
		.command('rollback')
		.description('rollback rollback')
		.requiredOption('--rollbackId <value>', 'rollbackId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("rollback.rollback", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_schedule = program.command('schedule').description('schedule commands');

	g_schedule
		.command('create')
		.description('schedule create')
		.option('--scheduleId <value>', 'scheduleId')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--cronExpression <value>', 'cronExpression')
		.option('--appName <value>', 'appName')
		.option('--serviceName <value>', 'serviceName')
		.option('--shellType <value>', 'shellType (bash, sh)')
		.option('--scheduleType <value>', 'scheduleType (application, compose, server, dokploy-server)')
		.requiredOption('--command <value>', 'command')
		.option('--script <value>', 'script')
		.option('--applicationId <value>', 'applicationId')
		.option('--composeId <value>', 'composeId')
		.option('--serverId <value>', 'serverId')
		.option('--userId <value>', 'userId')
		.option('--enabled', 'enabled')
		.option('--timezone <value>', 'timezone')
		.option('--createdAt <value>', 'createdAt')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			const data = await apiPost("schedule.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_schedule
		.command('delete')
		.description('schedule delete')
		.requiredOption('--scheduleId <value>', 'scheduleId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("schedule.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_schedule
		.command('list')
		.description('schedule list')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--scheduleType <value>', 'scheduleType (application, compose, server, dokploy-server)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("schedule.list", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_schedule
		.command('one')
		.description('schedule one')
		.requiredOption('--scheduleId <value>', 'scheduleId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("schedule.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_schedule
		.command('run-manually')
		.description('schedule runManually')
		.requiredOption('--scheduleId <value>', 'scheduleId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("schedule.runManually", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_schedule
		.command('update')
		.description('schedule update')
		.requiredOption('--scheduleId <value>', 'scheduleId')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--cronExpression <value>', 'cronExpression')
		.option('--appName <value>', 'appName')
		.option('--serviceName <value>', 'serviceName')
		.option('--shellType <value>', 'shellType (bash, sh)')
		.option('--scheduleType <value>', 'scheduleType (application, compose, server, dokploy-server)')
		.requiredOption('--command <value>', 'command')
		.option('--script <value>', 'script')
		.option('--applicationId <value>', 'applicationId')
		.option('--composeId <value>', 'composeId')
		.option('--serverId <value>', 'serverId')
		.option('--userId <value>', 'userId')
		.option('--enabled', 'enabled')
		.option('--timezone <value>', 'timezone')
		.option('--createdAt <value>', 'createdAt')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			const data = await apiPost("schedule.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_security = program.command('security').description('security commands');

	g_security
		.command('create')
		.description('security create')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--username <value>', 'username')
		.requiredOption('--password <value>', 'password')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("security.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_security
		.command('delete')
		.description('security delete')
		.requiredOption('--securityId <value>', 'securityId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("security.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_security
		.command('one')
		.description('security one')
		.requiredOption('--securityId <value>', 'securityId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("security.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_security
		.command('update')
		.description('security update')
		.requiredOption('--securityId <value>', 'securityId')
		.requiredOption('--username <value>', 'username')
		.requiredOption('--password <value>', 'password')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("security.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_server = program.command('server').description('server commands');

	g_server
		.command('all')
		.description('server all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.all", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('build-servers')
		.description('server buildServers')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.buildServers", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('count')
		.description('server count')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.count", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('create')
		.description('server create')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--description <value>', 'description')
		.requiredOption('--ipAddress <value>', 'ipAddress')
		.requiredOption('--port <value>', 'port')
		.requiredOption('--username <value>', 'username')
		.requiredOption('--sshKeyId <value>', 'sshKeyId')
		.requiredOption('--serverType <value>', 'serverType (deploy, build)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["port"] != null) opts["port"] = Number(opts["port"]);
			const data = await apiPost("server.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('get-default-command')
		.description('server getDefaultCommand')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.getDefaultCommand", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('get-server-metrics')
		.description('server getServerMetrics')
		.requiredOption('--url <value>', 'url')
		.requiredOption('--token <value>', 'token')
		.requiredOption('--dataPoints <value>', 'dataPoints')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.getServerMetrics", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('get-server-time')
		.description('server getServerTime')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.getServerTime", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('one')
		.description('server one')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('public-ip')
		.description('server publicIp')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.publicIp", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('remove')
		.description('server remove')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("server.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('security')
		.description('server security')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.security", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('setup')
		.description('server setup')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("server.setup", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('setup-monitoring')
		.description('server setupMonitoring')
		.requiredOption('--serverId <value>', 'serverId')
		.requiredOption('--metricsConfig <value>', 'metricsConfig')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("server.setupMonitoring", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('update')
		.description('server update')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--description <value>', 'description')
		.requiredOption('--serverId <value>', 'serverId')
		.requiredOption('--ipAddress <value>', 'ipAddress')
		.requiredOption('--port <value>', 'port')
		.requiredOption('--username <value>', 'username')
		.requiredOption('--sshKeyId <value>', 'sshKeyId')
		.requiredOption('--serverType <value>', 'serverType (deploy, build)')
		.option('--command <value>', 'command')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["port"] != null) opts["port"] = Number(opts["port"]);
			const data = await apiPost("server.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('validate')
		.description('server validate')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.validate", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_server
		.command('with-sshkey')
		.description('server withSSHKey')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.withSSHKey", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_settings = program.command('settings').description('settings commands');

	g_settings
		.command('assign-domain-server')
		.description('settings assignDomainServer')
		.requiredOption('--host <value>', 'host')
		.requiredOption('--certificateType <value>', 'certificateType (letsencrypt, none, custom)')
		.option('--letsEncryptEmail <value>', 'letsEncryptEmail')
		.option('--https', 'https')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["https"] != null) opts["https"] = opts["https"] === true || opts["https"] === "true";
			const data = await apiPost("settings.assignDomainServer", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('check-gpustatus')
		.description('settings checkGPUStatus')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.checkGPUStatus", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('clean-all')
		.description('settings cleanAll')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanAll", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('clean-all-deployment-queue')
		.description('settings cleanAllDeploymentQueue')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanAllDeploymentQueue", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('clean-docker-builder')
		.description('settings cleanDockerBuilder')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanDockerBuilder", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('clean-docker-prune')
		.description('settings cleanDockerPrune')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanDockerPrune", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('clean-monitoring')
		.description('settings cleanMonitoring')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanMonitoring", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('clean-redis')
		.description('settings cleanRedis')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanRedis", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('clean-sshprivate-key')
		.description('settings cleanSSHPrivateKey')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanSSHPrivateKey", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('clean-stopped-containers')
		.description('settings cleanStoppedContainers')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanStoppedContainers", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('clean-unused-images')
		.description('settings cleanUnusedImages')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanUnusedImages", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('clean-unused-volumes')
		.description('settings cleanUnusedVolumes')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanUnusedVolumes", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('get-dokploy-cloud-ips')
		.description('settings getDokployCloudIps')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getDokployCloudIps", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('get-dokploy-version')
		.description('settings getDokployVersion')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getDokployVersion", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('get-ip')
		.description('settings getIp')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getIp", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('get-log-cleanup-status')
		.description('settings getLogCleanupStatus')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getLogCleanupStatus", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('get-open-api-document')
		.description('settings getOpenApiDocument')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getOpenApiDocument", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('get-release-tag')
		.description('settings getReleaseTag')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getReleaseTag", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('get-traefik-ports')
		.description('settings getTraefikPorts')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getTraefikPorts", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('get-update-data')
		.description('settings getUpdateData')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.getUpdateData", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('get-web-server-settings')
		.description('settings getWebServerSettings')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getWebServerSettings", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('have-activate-requests')
		.description('settings haveActivateRequests')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.haveActivateRequests", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('have-traefik-dashboard-port-enabled')
		.description('settings haveTraefikDashboardPortEnabled')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.haveTraefikDashboardPortEnabled", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('health')
		.description('settings health')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.health", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('is-cloud')
		.description('settings isCloud')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.isCloud", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('is-user-subscribed')
		.description('settings isUserSubscribed')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.isUserSubscribed", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('read-directories')
		.description('settings readDirectories')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.readDirectories", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('read-middleware-traefik-config')
		.description('settings readMiddlewareTraefikConfig')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.readMiddlewareTraefikConfig", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('read-traefik-config')
		.description('settings readTraefikConfig')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.readTraefikConfig", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('read-traefik-env')
		.description('settings readTraefikEnv')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.readTraefikEnv", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('read-traefik-file')
		.description('settings readTraefikFile')
		.requiredOption('--path <value>', 'path')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.readTraefikFile", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('read-web-server-traefik-config')
		.description('settings readWebServerTraefikConfig')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.readWebServerTraefikConfig", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('reload-redis')
		.description('settings reloadRedis')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.reloadRedis", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('reload-server')
		.description('settings reloadServer')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.reloadServer", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('reload-traefik')
		.description('settings reloadTraefik')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.reloadTraefik", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('save-sshprivate-key')
		.description('settings saveSSHPrivateKey')
		.requiredOption('--sshPrivateKey <value>', 'sshPrivateKey')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.saveSSHPrivateKey", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('setup-gpu')
		.description('settings setupGPU')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.setupGPU", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('toggle-dashboard')
		.description('settings toggleDashboard')
		.option('--enableDashboard', 'enableDashboard')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableDashboard"] != null) opts["enableDashboard"] = opts["enableDashboard"] === true || opts["enableDashboard"] === "true";
			const data = await apiPost("settings.toggleDashboard", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('toggle-requests')
		.description('settings toggleRequests')
		.requiredOption('--enable', 'enable')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enable"] != null) opts["enable"] = opts["enable"] === true || opts["enable"] === "true";
			const data = await apiPost("settings.toggleRequests", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('update-docker-cleanup')
		.description('settings updateDockerCleanup')
		.requiredOption('--enableDockerCleanup', 'enableDockerCleanup')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableDockerCleanup"] != null) opts["enableDockerCleanup"] = opts["enableDockerCleanup"] === true || opts["enableDockerCleanup"] === "true";
			const data = await apiPost("settings.updateDockerCleanup", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('update-log-cleanup')
		.description('settings updateLogCleanup')
		.requiredOption('--cronExpression <value>', 'cronExpression')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateLogCleanup", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('update-middleware-traefik-config')
		.description('settings updateMiddlewareTraefikConfig')
		.requiredOption('--traefikConfig <value>', 'traefikConfig')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateMiddlewareTraefikConfig", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('update-server')
		.description('settings updateServer')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateServer", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('update-server-ip')
		.description('settings updateServerIp')
		.requiredOption('--serverIp <value>', 'serverIp')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateServerIp", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('update-traefik-config')
		.description('settings updateTraefikConfig')
		.requiredOption('--traefikConfig <value>', 'traefikConfig')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateTraefikConfig", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('update-traefik-file')
		.description('settings updateTraefikFile')
		.requiredOption('--path <value>', 'path')
		.requiredOption('--traefikConfig <value>', 'traefikConfig')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateTraefikFile", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('update-traefik-ports')
		.description('settings updateTraefikPorts')
		.option('--serverId <value>', 'serverId')
		.requiredOption('--additionalPorts <value>', 'additionalPorts')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateTraefikPorts", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('update-web-server-traefik-config')
		.description('settings updateWebServerTraefikConfig')
		.requiredOption('--traefikConfig <value>', 'traefikConfig')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateWebServerTraefikConfig", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_settings
		.command('write-traefik-env')
		.description('settings writeTraefikEnv')
		.requiredOption('--env <value>', 'env')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.writeTraefikEnv", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_sshKey = program.command('ssh-key').description('ssh-key commands');

	g_sshKey
		.command('all')
		.description('sshKey all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sshKey.all", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sshKey
		.command('create')
		.description('sshKey create')
		.requiredOption('--name <value>', 'name')
		.option('--description <value>', 'description')
		.requiredOption('--privateKey <value>', 'privateKey')
		.requiredOption('--publicKey <value>', 'publicKey')
		.requiredOption('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("sshKey.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sshKey
		.command('generate')
		.description('sshKey generate')
		.option('--type <value>', 'type (rsa, ed25519)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("sshKey.generate", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sshKey
		.command('one')
		.description('sshKey one')
		.requiredOption('--sshKeyId <value>', 'sshKeyId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sshKey.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sshKey
		.command('remove')
		.description('sshKey remove')
		.requiredOption('--sshKeyId <value>', 'sshKeyId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("sshKey.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sshKey
		.command('update')
		.description('sshKey update')
		.option('--name <value>', 'name')
		.option('--description <value>', 'description')
		.option('--lastUsedAt <value>', 'lastUsedAt')
		.requiredOption('--sshKeyId <value>', 'sshKeyId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("sshKey.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_sso = program.command('sso').description('sso commands');

	g_sso
		.command('add-trusted-origin')
		.description('sso addTrustedOrigin')
		.requiredOption('--origin <value>', 'origin')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("sso.addTrustedOrigin", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sso
		.command('delete-provider')
		.description('sso deleteProvider')
		.requiredOption('--providerId <value>', 'providerId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("sso.deleteProvider", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sso
		.command('get-trusted-origins')
		.description('sso getTrustedOrigins')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sso.getTrustedOrigins", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sso
		.command('list-providers')
		.description('sso listProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sso.listProviders", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sso
		.command('one')
		.description('sso one')
		.requiredOption('--providerId <value>', 'providerId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sso.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sso
		.command('register')
		.description('sso register')
		.requiredOption('--providerId <value>', 'providerId')
		.requiredOption('--issuer <value>', 'issuer')
		.requiredOption('--domains <value>', 'domains')
		.option('--oidcConfig <value>', 'oidcConfig')
		.option('--samlConfig <value>', 'samlConfig')
		.option('--organizationId <value>', 'organizationId')
		.option('--overrideUserInfo', 'overrideUserInfo')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["overrideUserInfo"] != null) opts["overrideUserInfo"] = opts["overrideUserInfo"] === true || opts["overrideUserInfo"] === "true";
			const data = await apiPost("sso.register", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sso
		.command('remove-trusted-origin')
		.description('sso removeTrustedOrigin')
		.requiredOption('--origin <value>', 'origin')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("sso.removeTrustedOrigin", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sso
		.command('show-sign-in-with-sso')
		.description('sso showSignInWithSSO')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sso.showSignInWithSSO", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sso
		.command('update')
		.description('sso update')
		.requiredOption('--providerId <value>', 'providerId')
		.requiredOption('--issuer <value>', 'issuer')
		.requiredOption('--domains <value>', 'domains')
		.option('--oidcConfig <value>', 'oidcConfig')
		.option('--samlConfig <value>', 'samlConfig')
		.option('--organizationId <value>', 'organizationId')
		.option('--overrideUserInfo', 'overrideUserInfo')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["overrideUserInfo"] != null) opts["overrideUserInfo"] = opts["overrideUserInfo"] === true || opts["overrideUserInfo"] === "true";
			const data = await apiPost("sso.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_sso
		.command('update-trusted-origin')
		.description('sso updateTrustedOrigin')
		.requiredOption('--oldOrigin <value>', 'oldOrigin')
		.requiredOption('--newOrigin <value>', 'newOrigin')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("sso.updateTrustedOrigin", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_stripe = program.command('stripe').description('stripe commands');

	g_stripe
		.command('can-create-more-servers')
		.description('stripe canCreateMoreServers')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("stripe.canCreateMoreServers", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_stripe
		.command('create-checkout-session')
		.description('stripe createCheckoutSession')
		.requiredOption('--tier <value>', 'tier (legacy, hobby, startup)')
		.requiredOption('--productId <value>', 'productId')
		.requiredOption('--serverQuantity <value>', 'serverQuantity')
		.requiredOption('--isAnnual', 'isAnnual')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["serverQuantity"] != null) opts["serverQuantity"] = Number(opts["serverQuantity"]);
			if (opts["isAnnual"] != null) opts["isAnnual"] = opts["isAnnual"] === true || opts["isAnnual"] === "true";
			const data = await apiPost("stripe.createCheckoutSession", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_stripe
		.command('create-customer-portal-session')
		.description('stripe createCustomerPortalSession')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("stripe.createCustomerPortalSession", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_stripe
		.command('get-current-plan')
		.description('stripe getCurrentPlan')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("stripe.getCurrentPlan", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_stripe
		.command('get-invoices')
		.description('stripe getInvoices')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("stripe.getInvoices", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_stripe
		.command('get-products')
		.description('stripe getProducts')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("stripe.getProducts", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_stripe
		.command('upgrade-subscription')
		.description('stripe upgradeSubscription')
		.requiredOption('--tier <value>', 'tier (hobby, startup)')
		.requiredOption('--serverQuantity <value>', 'serverQuantity')
		.requiredOption('--isAnnual', 'isAnnual')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["serverQuantity"] != null) opts["serverQuantity"] = Number(opts["serverQuantity"]);
			if (opts["isAnnual"] != null) opts["isAnnual"] = opts["isAnnual"] === true || opts["isAnnual"] === "true";
			const data = await apiPost("stripe.upgradeSubscription", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_swarm = program.command('swarm').description('swarm commands');

	g_swarm
		.command('get-node-apps')
		.description('swarm getNodeApps')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("swarm.getNodeApps", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_swarm
		.command('get-node-info')
		.description('swarm getNodeInfo')
		.requiredOption('--nodeId <value>', 'nodeId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("swarm.getNodeInfo", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_swarm
		.command('get-nodes')
		.description('swarm getNodes')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("swarm.getNodes", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_user = program.command('user').description('user commands');

	g_user
		.command('all')
		.description('user all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.all", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('assign-permissions')
		.description('user assignPermissions')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--accessedProjects <value>', 'accessedProjects')
		.requiredOption('--accessedEnvironments <value>', 'accessedEnvironments')
		.requiredOption('--accessedServices <value>', 'accessedServices')
		.requiredOption('--canCreateProjects', 'canCreateProjects')
		.requiredOption('--canCreateServices', 'canCreateServices')
		.requiredOption('--canDeleteProjects', 'canDeleteProjects')
		.requiredOption('--canDeleteServices', 'canDeleteServices')
		.requiredOption('--canAccessToDocker', 'canAccessToDocker')
		.requiredOption('--canAccessToTraefikFiles', 'canAccessToTraefikFiles')
		.requiredOption('--canAccessToAPI', 'canAccessToAPI')
		.requiredOption('--canAccessToSSHKeys', 'canAccessToSSHKeys')
		.requiredOption('--canAccessToGitProviders', 'canAccessToGitProviders')
		.requiredOption('--canDeleteEnvironments', 'canDeleteEnvironments')
		.requiredOption('--canCreateEnvironments', 'canCreateEnvironments')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["canCreateProjects"] != null) opts["canCreateProjects"] = opts["canCreateProjects"] === true || opts["canCreateProjects"] === "true";
			if (opts["canCreateServices"] != null) opts["canCreateServices"] = opts["canCreateServices"] === true || opts["canCreateServices"] === "true";
			if (opts["canDeleteProjects"] != null) opts["canDeleteProjects"] = opts["canDeleteProjects"] === true || opts["canDeleteProjects"] === "true";
			if (opts["canDeleteServices"] != null) opts["canDeleteServices"] = opts["canDeleteServices"] === true || opts["canDeleteServices"] === "true";
			if (opts["canAccessToDocker"] != null) opts["canAccessToDocker"] = opts["canAccessToDocker"] === true || opts["canAccessToDocker"] === "true";
			if (opts["canAccessToTraefikFiles"] != null) opts["canAccessToTraefikFiles"] = opts["canAccessToTraefikFiles"] === true || opts["canAccessToTraefikFiles"] === "true";
			if (opts["canAccessToAPI"] != null) opts["canAccessToAPI"] = opts["canAccessToAPI"] === true || opts["canAccessToAPI"] === "true";
			if (opts["canAccessToSSHKeys"] != null) opts["canAccessToSSHKeys"] = opts["canAccessToSSHKeys"] === true || opts["canAccessToSSHKeys"] === "true";
			if (opts["canAccessToGitProviders"] != null) opts["canAccessToGitProviders"] = opts["canAccessToGitProviders"] === true || opts["canAccessToGitProviders"] === "true";
			if (opts["canDeleteEnvironments"] != null) opts["canDeleteEnvironments"] = opts["canDeleteEnvironments"] === true || opts["canDeleteEnvironments"] === "true";
			if (opts["canCreateEnvironments"] != null) opts["canCreateEnvironments"] = opts["canCreateEnvironments"] === true || opts["canCreateEnvironments"] === "true";
			const data = await apiPost("user.assignPermissions", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('check-user-organizations')
		.description('user checkUserOrganizations')
		.requiredOption('--userId <value>', 'userId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.checkUserOrganizations", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('create-api-key')
		.description('user createApiKey')
		.requiredOption('--name <value>', 'name')
		.option('--prefix <value>', 'prefix')
		.option('--expiresIn <value>', 'expiresIn')
		.requiredOption('--metadata <value>', 'metadata')
		.option('--rateLimitEnabled', 'rateLimitEnabled')
		.option('--rateLimitTimeWindow <value>', 'rateLimitTimeWindow')
		.option('--rateLimitMax <value>', 'rateLimitMax')
		.option('--remaining <value>', 'remaining')
		.option('--refillAmount <value>', 'refillAmount')
		.option('--refillInterval <value>', 'refillInterval')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["expiresIn"] != null) opts["expiresIn"] = Number(opts["expiresIn"]);
			if (opts["rateLimitEnabled"] != null) opts["rateLimitEnabled"] = opts["rateLimitEnabled"] === true || opts["rateLimitEnabled"] === "true";
			if (opts["rateLimitTimeWindow"] != null) opts["rateLimitTimeWindow"] = Number(opts["rateLimitTimeWindow"]);
			if (opts["rateLimitMax"] != null) opts["rateLimitMax"] = Number(opts["rateLimitMax"]);
			if (opts["remaining"] != null) opts["remaining"] = Number(opts["remaining"]);
			if (opts["refillAmount"] != null) opts["refillAmount"] = Number(opts["refillAmount"]);
			if (opts["refillInterval"] != null) opts["refillInterval"] = Number(opts["refillInterval"]);
			const data = await apiPost("user.createApiKey", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('delete-api-key')
		.description('user deleteApiKey')
		.requiredOption('--apiKeyId <value>', 'apiKeyId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("user.deleteApiKey", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('generate-token')
		.description('user generateToken')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("user.generateToken", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('get')
		.description('user get')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.get", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('get-backups')
		.description('user getBackups')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getBackups", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('get-container-metrics')
		.description('user getContainerMetrics')
		.requiredOption('--url <value>', 'url')
		.requiredOption('--token <value>', 'token')
		.requiredOption('--appName <value>', 'appName')
		.requiredOption('--dataPoints <value>', 'dataPoints')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getContainerMetrics", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('get-invitations')
		.description('user getInvitations')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getInvitations", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('get-metrics-token')
		.description('user getMetricsToken')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getMetricsToken", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('get-server-metrics')
		.description('user getServerMetrics')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getServerMetrics", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('get-user-by-token')
		.description('user getUserByToken')
		.requiredOption('--token <value>', 'token')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getUserByToken", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('have-root-access')
		.description('user haveRootAccess')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.haveRootAccess", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('one')
		.description('user one')
		.requiredOption('--userId <value>', 'userId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('remove')
		.description('user remove')
		.requiredOption('--userId <value>', 'userId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("user.remove", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('send-invitation')
		.description('user sendInvitation')
		.requiredOption('--invitationId <value>', 'invitationId')
		.requiredOption('--notificationId <value>', 'notificationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("user.sendInvitation", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_user
		.command('update')
		.description('user update')
		.option('--id <value>', 'id')
		.option('--firstName <value>', 'firstName')
		.option('--lastName <value>', 'lastName')
		.option('--isRegistered', 'isRegistered')
		.option('--expirationDate <value>', 'expirationDate')
		.option('--createdAt2 <value>', 'createdAt2')
		.option('--createdAt <value>', 'createdAt')
		.option('--twoFactorEnabled', 'twoFactorEnabled')
		.option('--email <value>', 'email')
		.option('--emailVerified', 'emailVerified')
		.option('--image <value>', 'image')
		.option('--banned', 'banned')
		.option('--banReason <value>', 'banReason')
		.option('--banExpires <value>', 'banExpires')
		.option('--updatedAt <value>', 'updatedAt')
		.option('--enablePaidFeatures', 'enablePaidFeatures')
		.option('--allowImpersonation', 'allowImpersonation')
		.option('--enableEnterpriseFeatures', 'enableEnterpriseFeatures')
		.option('--licenseKey <value>', 'licenseKey')
		.option('--stripeCustomerId <value>', 'stripeCustomerId')
		.option('--stripeSubscriptionId <value>', 'stripeSubscriptionId')
		.option('--serversQuantity <value>', 'serversQuantity')
		.option('--password <value>', 'password')
		.option('--currentPassword <value>', 'currentPassword')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["isRegistered"] != null) opts["isRegistered"] = opts["isRegistered"] === true || opts["isRegistered"] === "true";
			if (opts["twoFactorEnabled"] != null) opts["twoFactorEnabled"] = opts["twoFactorEnabled"] === true || opts["twoFactorEnabled"] === "true";
			if (opts["emailVerified"] != null) opts["emailVerified"] = opts["emailVerified"] === true || opts["emailVerified"] === "true";
			if (opts["banned"] != null) opts["banned"] = opts["banned"] === true || opts["banned"] === "true";
			if (opts["enablePaidFeatures"] != null) opts["enablePaidFeatures"] = opts["enablePaidFeatures"] === true || opts["enablePaidFeatures"] === "true";
			if (opts["allowImpersonation"] != null) opts["allowImpersonation"] = opts["allowImpersonation"] === true || opts["allowImpersonation"] === "true";
			if (opts["enableEnterpriseFeatures"] != null) opts["enableEnterpriseFeatures"] = opts["enableEnterpriseFeatures"] === true || opts["enableEnterpriseFeatures"] === "true";
			if (opts["serversQuantity"] != null) opts["serversQuantity"] = Number(opts["serversQuantity"]);
			const data = await apiPost("user.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
	const g_volumeBackups = program.command('volume-backups').description('volume-backups commands');

	g_volumeBackups
		.command('create')
		.description('volumeBackups create')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--volumeName <value>', 'volumeName')
		.requiredOption('--prefix <value>', 'prefix')
		.option('--serviceType <value>', 'serviceType (application, postgres, mysql, mariadb, mongo, redis, compose)')
		.option('--appName <value>', 'appName')
		.option('--serviceName <value>', 'serviceName')
		.option('--turnOff', 'turnOff')
		.requiredOption('--cronExpression <value>', 'cronExpression')
		.option('--keepLatestCount <value>', 'keepLatestCount')
		.option('--enabled', 'enabled')
		.option('--applicationId <value>', 'applicationId')
		.option('--postgresId <value>', 'postgresId')
		.option('--mariadbId <value>', 'mariadbId')
		.option('--mongoId <value>', 'mongoId')
		.option('--mysqlId <value>', 'mysqlId')
		.option('--redisId <value>', 'redisId')
		.option('--composeId <value>', 'composeId')
		.option('--createdAt <value>', 'createdAt')
		.requiredOption('--destinationId <value>', 'destinationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["turnOff"] != null) opts["turnOff"] = opts["turnOff"] === true || opts["turnOff"] === "true";
			if (opts["keepLatestCount"] != null) opts["keepLatestCount"] = Number(opts["keepLatestCount"]);
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			const data = await apiPost("volumeBackups.create", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_volumeBackups
		.command('delete')
		.description('volumeBackups delete')
		.requiredOption('--volumeBackupId <value>', 'volumeBackupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("volumeBackups.delete", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_volumeBackups
		.command('list')
		.description('volumeBackups list')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--volumeBackupType <value>', 'volumeBackupType (application, postgres, mysql, mariadb, mongo, redis, compose)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("volumeBackups.list", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_volumeBackups
		.command('one')
		.description('volumeBackups one')
		.requiredOption('--volumeBackupId <value>', 'volumeBackupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("volumeBackups.one", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_volumeBackups
		.command('run-manually')
		.description('volumeBackups runManually')
		.requiredOption('--volumeBackupId <value>', 'volumeBackupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("volumeBackups.runManually", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});

	g_volumeBackups
		.command('update')
		.description('volumeBackups update')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--volumeName <value>', 'volumeName')
		.requiredOption('--prefix <value>', 'prefix')
		.option('--serviceType <value>', 'serviceType (application, postgres, mysql, mariadb, mongo, redis, compose)')
		.option('--appName <value>', 'appName')
		.option('--serviceName <value>', 'serviceName')
		.option('--turnOff', 'turnOff')
		.requiredOption('--cronExpression <value>', 'cronExpression')
		.option('--keepLatestCount <value>', 'keepLatestCount')
		.option('--enabled', 'enabled')
		.option('--applicationId <value>', 'applicationId')
		.option('--postgresId <value>', 'postgresId')
		.option('--mariadbId <value>', 'mariadbId')
		.option('--mongoId <value>', 'mongoId')
		.option('--mysqlId <value>', 'mysqlId')
		.option('--redisId <value>', 'redisId')
		.option('--composeId <value>', 'composeId')
		.option('--createdAt <value>', 'createdAt')
		.requiredOption('--destinationId <value>', 'destinationId')
		.requiredOption('--volumeBackupId <value>', 'volumeBackupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["turnOff"] != null) opts["turnOff"] = opts["turnOff"] === true || opts["turnOff"] === "true";
			if (opts["keepLatestCount"] != null) opts["keepLatestCount"] = Number(opts["keepLatestCount"]);
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			const data = await apiPost("volumeBackups.update", opts);
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});
}
