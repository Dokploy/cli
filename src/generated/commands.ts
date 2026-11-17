// Auto-generated from openapi.json — do not edit manually.
// Run: npx tsx scripts/generate.ts

import type { Command } from "commander";
import { apiPost, apiGet } from "../client.js";
import { render } from "../ui/render.js";

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
			render(data, { json: jsonOutput, endpoint: "admin.setupMonitoring", method: "post" });
		});
	const g_ai = program.command('ai').description('ai commands');

	g_ai
		.command('analyze-logs')
		.description('ai analyzeLogs')
		.requiredOption('--aiId <value>', 'aiId')
		.requiredOption('--logs <value>', 'logs')
		.requiredOption('--context <value>', 'context (build, runtime)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("ai.analyzeLogs", opts);
			render(data, { json: jsonOutput, endpoint: "ai.analyzeLogs", method: "post" });
		});

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
			render(data, { json: jsonOutput, endpoint: "ai.create", method: "post" });
		});

	g_ai
		.command('delete')
		.description('ai delete')
		.requiredOption('--aiId <value>', 'aiId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("ai.delete", opts);
			render(data, { json: jsonOutput, endpoint: "ai.delete", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "ai.deploy", method: "post" });
		});

	g_ai
		.command('get')
		.description('ai get')
		.requiredOption('--aiId <value>', 'aiId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("ai.get", opts);
			render(data, { json: jsonOutput, endpoint: "ai.get", method: "get" });
		});

	g_ai
		.command('get-all')
		.description('ai getAll')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("ai.getAll", opts);
			render(data, { json: jsonOutput, endpoint: "ai.getAll", method: "get" });
		});

	g_ai
		.command('get-custom-providers')
		.description('ai getCustomProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("ai.getCustomProviders", opts);
			render(data, { json: jsonOutput, endpoint: "ai.getCustomProviders", method: "get" });
		});

	g_ai
		.command('get-enabled-providers')
		.description('ai getEnabledProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("ai.getEnabledProviders", opts);
			render(data, { json: jsonOutput, endpoint: "ai.getEnabledProviders", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "ai.getModels", method: "get" });
		});

	g_ai
		.command('one')
		.description('ai one')
		.requiredOption('--aiId <value>', 'aiId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("ai.one", opts);
			render(data, { json: jsonOutput, endpoint: "ai.one", method: "get" });
		});

	g_ai
		.command('save-custom-providers')
		.description('ai saveCustomProviders')
		.requiredOption('--providers <value>', 'providers')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("ai.saveCustomProviders", opts);
			render(data, { json: jsonOutput, endpoint: "ai.saveCustomProviders", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "ai.suggest", method: "post" });
		});

	g_ai
		.command('test-connection')
		.description('ai testConnection')
		.requiredOption('--apiUrl <value>', 'apiUrl')
		.requiredOption('--apiKey <value>', 'apiKey')
		.requiredOption('--model <value>', 'model')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("ai.testConnection", opts);
			render(data, { json: jsonOutput, endpoint: "ai.testConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "ai.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "application.cancelDeployment", method: "post" });
		});

	g_application
		.command('clean-queues')
		.description('application cleanQueues')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.cleanQueues", opts);
			render(data, { json: jsonOutput, endpoint: "application.cleanQueues", method: "post" });
		});

	g_application
		.command('clear-deployments')
		.description('application clearDeployments')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.clearDeployments", opts);
			render(data, { json: jsonOutput, endpoint: "application.clearDeployments", method: "post" });
		});

	g_application
		.command('create')
		.description('application create')
		.requiredOption('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--serverId <value>', 'serverId')
		.option('--sourceType <value>', 'sourceType (github, docker, git, gitlab, bitbucket, gitea, drop)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.create", opts);
			render(data, { json: jsonOutput, endpoint: "application.create", method: "post" });
		});

	g_application
		.command('delete')
		.description('application delete')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.delete", opts);
			render(data, { json: jsonOutput, endpoint: "application.delete", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "application.deploy", method: "post" });
		});

	g_application
		.command('deploy-nginx-quickstart')
		.description('application deployNginxQuickstart')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.deployNginxQuickstart", opts);
			render(data, { json: jsonOutput, endpoint: "application.deployNginxQuickstart", method: "post" });
		});

	g_application
		.command('disconnect-git-provider')
		.description('application disconnectGitProvider')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.disconnectGitProvider", opts);
			render(data, { json: jsonOutput, endpoint: "application.disconnectGitProvider", method: "post" });
		});

	g_application
		.command('drop-deployment')
		.description('application dropDeployment')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.dropDeployment", opts);
			render(data, { json: jsonOutput, endpoint: "application.dropDeployment", method: "post" });
		});

	g_application
		.command('kill-build')
		.description('application killBuild')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.killBuild", opts);
			render(data, { json: jsonOutput, endpoint: "application.killBuild", method: "post" });
		});

	g_application
		.command('mark-running')
		.description('application markRunning')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.markRunning", opts);
			render(data, { json: jsonOutput, endpoint: "application.markRunning", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "application.move", method: "post" });
		});

	g_application
		.command('one')
		.description('application one')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("application.one", opts);
			render(data, { json: jsonOutput, endpoint: "application.one", method: "get" });
		});

	g_application
		.command('read-app-monitoring')
		.description('application readAppMonitoring')
		.requiredOption('--appName <value>', 'appName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("application.readAppMonitoring", opts);
			render(data, { json: jsonOutput, endpoint: "application.readAppMonitoring", method: "get" });
		});

	g_application
		.command('read-logs')
		.description('application readLogs')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--tail <value>', 'tail')
		.option('--since <value>', 'since')
		.option('--search <value>', 'search')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["tail"] != null) opts["tail"] = Number(opts["tail"]);
			const data = await apiGet("application.readLogs", opts);
			render(data, { json: jsonOutput, endpoint: "application.readLogs", method: "get" });
		});

	g_application
		.command('read-traefik-config')
		.description('application readTraefikConfig')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("application.readTraefikConfig", opts);
			render(data, { json: jsonOutput, endpoint: "application.readTraefikConfig", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "application.redeploy", method: "post" });
		});

	g_application
		.command('refresh-token')
		.description('application refreshToken')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.refreshToken", opts);
			render(data, { json: jsonOutput, endpoint: "application.refreshToken", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "application.reload", method: "post" });
		});

	g_application
		.command('save-bitbucket-provider')
		.description('application saveBitbucketProvider')
		.requiredOption('--bitbucketBuildPath <value>', 'bitbucketBuildPath')
		.requiredOption('--bitbucketOwner <value>', 'bitbucketOwner')
		.requiredOption('--bitbucketRepository <value>', 'bitbucketRepository')
		.requiredOption('--bitbucketRepositorySlug <value>', 'bitbucketRepositorySlug')
		.requiredOption('--bitbucketId <value>', 'bitbucketId')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--bitbucketBranch <value>', 'bitbucketBranch')
		.option('--enableSubmodules', 'enableSubmodules')
		.option('--watchPaths <value>', 'watchPaths')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			const data = await apiPost("application.saveBitbucketProvider", opts);
			render(data, { json: jsonOutput, endpoint: "application.saveBitbucketProvider", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "application.saveBuildType", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "application.saveDockerProvider", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "application.saveEnvironment", method: "post" });
		});

	g_application
		.command('save-gitea-provider')
		.description('application saveGiteaProvider')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--giteaBuildPath <value>', 'giteaBuildPath')
		.requiredOption('--giteaOwner <value>', 'giteaOwner')
		.requiredOption('--giteaRepository <value>', 'giteaRepository')
		.requiredOption('--giteaId <value>', 'giteaId')
		.requiredOption('--giteaBranch <value>', 'giteaBranch')
		.option('--enableSubmodules', 'enableSubmodules')
		.option('--watchPaths <value>', 'watchPaths')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			const data = await apiPost("application.saveGiteaProvider", opts);
			render(data, { json: jsonOutput, endpoint: "application.saveGiteaProvider", method: "post" });
		});

	g_application
		.command('save-github-provider')
		.description('application saveGithubProvider')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--repository <value>', 'repository')
		.requiredOption('--owner <value>', 'owner')
		.requiredOption('--buildPath <value>', 'buildPath')
		.requiredOption('--githubId <value>', 'githubId')
		.requiredOption('--branch <value>', 'branch')
		.requiredOption('--triggerType <value>', 'triggerType (push, tag)')
		.option('--enableSubmodules', 'enableSubmodules')
		.option('--watchPaths <value>', 'watchPaths')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			const data = await apiPost("application.saveGithubProvider", opts);
			render(data, { json: jsonOutput, endpoint: "application.saveGithubProvider", method: "post" });
		});

	g_application
		.command('save-gitlab-provider')
		.description('application saveGitlabProvider')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--gitlabBuildPath <value>', 'gitlabBuildPath')
		.requiredOption('--gitlabOwner <value>', 'gitlabOwner')
		.requiredOption('--gitlabRepository <value>', 'gitlabRepository')
		.requiredOption('--gitlabId <value>', 'gitlabId')
		.requiredOption('--gitlabProjectId <value>', 'gitlabProjectId')
		.requiredOption('--gitlabPathNamespace <value>', 'gitlabPathNamespace')
		.requiredOption('--gitlabBranch <value>', 'gitlabBranch')
		.option('--enableSubmodules', 'enableSubmodules')
		.option('--watchPaths <value>', 'watchPaths')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["gitlabProjectId"] != null) opts["gitlabProjectId"] = Number(opts["gitlabProjectId"]);
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			const data = await apiPost("application.saveGitlabProvider", opts);
			render(data, { json: jsonOutput, endpoint: "application.saveGitlabProvider", method: "post" });
		});

	g_application
		.command('save-git-provider')
		.description('application saveGitProvider')
		.requiredOption('--applicationId <value>', 'applicationId')
		.requiredOption('--customGitBuildPath <value>', 'customGitBuildPath')
		.requiredOption('--customGitUrl <value>', 'customGitUrl')
		.requiredOption('--watchPaths <value>', 'watchPaths')
		.option('--enableSubmodules', 'enableSubmodules')
		.requiredOption('--customGitBranch <value>', 'customGitBranch')
		.option('--customGitSSHKeyId <value>', 'customGitSSHKeyId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			const data = await apiPost("application.saveGitProvider", opts);
			render(data, { json: jsonOutput, endpoint: "application.saveGitProvider", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "application.search", method: "get" });
		});

	g_application
		.command('start')
		.description('application start')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.start", opts);
			render(data, { json: jsonOutput, endpoint: "application.start", method: "post" });
		});

	g_application
		.command('stop')
		.description('application stop')
		.requiredOption('--applicationId <value>', 'applicationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("application.stop", opts);
			render(data, { json: jsonOutput, endpoint: "application.stop", method: "post" });
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
		.option('--icon <value>', 'icon')
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
		.option('--networkIds <value>', 'networkIds')
		.option('--detachDokployNetwork', 'detachDokployNetwork')
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
			if (opts["detachDokployNetwork"] != null) opts["detachDokployNetwork"] = opts["detachDokployNetwork"] === true || opts["detachDokployNetwork"] === "true";
			const data = await apiPost("application.update", opts);
			render(data, { json: jsonOutput, endpoint: "application.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "application.updateTraefikConfig", method: "post" });
		});
	const g_auditLog = program.command('audit-log').description('audit-log commands');

	g_auditLog
		.command('all')
		.description('auditLog all')
		.option('--userId <value>', 'userId')
		.option('--userEmail <value>', 'userEmail')
		.option('--resourceName <value>', 'resourceName')
		.option('--action <value>', 'action (create, update, delete, deploy, cancel, redeploy, login, logout)')
		.option('--resourceType <value>', 'resourceType (project, service, environment, deployment, user, customRole, domain, certificate, registry, server, sshKey, gitProvider, notification, settings, session)')
		.option('--from <value>', 'from')
		.option('--to <value>', 'to')
		.option('--limit <value>', 'limit')
		.option('--offset <value>', 'offset')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["limit"] != null) opts["limit"] = Number(opts["limit"]);
			if (opts["offset"] != null) opts["offset"] = Number(opts["offset"]);
			const data = await apiGet("auditLog.all", opts);
			render(data, { json: jsonOutput, endpoint: "auditLog.all", method: "get" });
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
		.option('--libsqlId <value>', 'libsqlId')
		.requiredOption('--databaseType <value>', 'databaseType (postgres, mariadb, mysql, mongo, web-server, libsql)')
		.option('--userId <value>', 'userId')
		.option('--backupType <value>', 'backupType (database, compose)')
		.option('--composeId <value>', 'composeId')
		.option('--serviceName <value>', 'serviceName')
		.option('--includeEncryptionKey', 'includeEncryptionKey')
		.option('--metadata <value>', 'metadata')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			if (opts["keepLatestCount"] != null) opts["keepLatestCount"] = Number(opts["keepLatestCount"]);
			if (opts["includeEncryptionKey"] != null) opts["includeEncryptionKey"] = opts["includeEncryptionKey"] === true || opts["includeEncryptionKey"] === "true";
			const data = await apiPost("backup.create", opts);
			render(data, { json: jsonOutput, endpoint: "backup.create", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "backup.listBackupFiles", method: "get" });
		});

	g_backup
		.command('manual-backup-compose')
		.description('backup manualBackupCompose')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupCompose", opts);
			render(data, { json: jsonOutput, endpoint: "backup.manualBackupCompose", method: "post" });
		});

	g_backup
		.command('manual-backup-libsql')
		.description('backup manualBackupLibsql')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupLibsql", opts);
			render(data, { json: jsonOutput, endpoint: "backup.manualBackupLibsql", method: "post" });
		});

	g_backup
		.command('manual-backup-mariadb')
		.description('backup manualBackupMariadb')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupMariadb", opts);
			render(data, { json: jsonOutput, endpoint: "backup.manualBackupMariadb", method: "post" });
		});

	g_backup
		.command('manual-backup-mongo')
		.description('backup manualBackupMongo')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupMongo", opts);
			render(data, { json: jsonOutput, endpoint: "backup.manualBackupMongo", method: "post" });
		});

	g_backup
		.command('manual-backup-my-sql')
		.description('backup manualBackupMySql')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupMySql", opts);
			render(data, { json: jsonOutput, endpoint: "backup.manualBackupMySql", method: "post" });
		});

	g_backup
		.command('manual-backup-postgres')
		.description('backup manualBackupPostgres')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupPostgres", opts);
			render(data, { json: jsonOutput, endpoint: "backup.manualBackupPostgres", method: "post" });
		});

	g_backup
		.command('manual-backup-web-server')
		.description('backup manualBackupWebServer')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.manualBackupWebServer", opts);
			render(data, { json: jsonOutput, endpoint: "backup.manualBackupWebServer", method: "post" });
		});

	g_backup
		.command('one')
		.description('backup one')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("backup.one", opts);
			render(data, { json: jsonOutput, endpoint: "backup.one", method: "get" });
		});

	g_backup
		.command('remove')
		.description('backup remove')
		.requiredOption('--backupId <value>', 'backupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("backup.remove", opts);
			render(data, { json: jsonOutput, endpoint: "backup.remove", method: "post" });
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
		.requiredOption('--databaseType <value>', 'databaseType (postgres, mariadb, mysql, mongo, web-server, libsql)')
		.option('--includeEncryptionKey', 'includeEncryptionKey')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			if (opts["keepLatestCount"] != null) opts["keepLatestCount"] = Number(opts["keepLatestCount"]);
			if (opts["includeEncryptionKey"] != null) opts["includeEncryptionKey"] = opts["includeEncryptionKey"] === true || opts["includeEncryptionKey"] === "true";
			const data = await apiPost("backup.update", opts);
			render(data, { json: jsonOutput, endpoint: "backup.update", method: "post" });
		});
	const g_bitbucket = program.command('bitbucket').description('bitbucket commands');

	g_bitbucket
		.command('bitbucket-providers')
		.description('bitbucket bitbucketProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("bitbucket.bitbucketProviders", opts);
			render(data, { json: jsonOutput, endpoint: "bitbucket.bitbucketProviders", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "bitbucket.create", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "bitbucket.getBitbucketBranches", method: "get" });
		});

	g_bitbucket
		.command('get-bitbucket-repositories')
		.description('bitbucket getBitbucketRepositories')
		.requiredOption('--bitbucketId <value>', 'bitbucketId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("bitbucket.getBitbucketRepositories", opts);
			render(data, { json: jsonOutput, endpoint: "bitbucket.getBitbucketRepositories", method: "get" });
		});

	g_bitbucket
		.command('one')
		.description('bitbucket one')
		.requiredOption('--bitbucketId <value>', 'bitbucketId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("bitbucket.one", opts);
			render(data, { json: jsonOutput, endpoint: "bitbucket.one", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "bitbucket.testConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "bitbucket.update", method: "post" });
		});
	const g_certificates = program.command('certificates').description('certificates commands');

	g_certificates
		.command('all')
		.description('certificates all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("certificates.all", opts);
			render(data, { json: jsonOutput, endpoint: "certificates.all", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "certificates.create", method: "post" });
		});

	g_certificates
		.command('one')
		.description('certificates one')
		.requiredOption('--certificateId <value>', 'certificateId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("certificates.one", opts);
			render(data, { json: jsonOutput, endpoint: "certificates.one", method: "get" });
		});

	g_certificates
		.command('remove')
		.description('certificates remove')
		.requiredOption('--certificateId <value>', 'certificateId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("certificates.remove", opts);
			render(data, { json: jsonOutput, endpoint: "certificates.remove", method: "post" });
		});

	g_certificates
		.command('update')
		.description('certificates update')
		.requiredOption('--certificateId <value>', 'certificateId')
		.option('--name <value>', 'name')
		.option('--certificateData <value>', 'certificateData')
		.option('--privateKey <value>', 'privateKey')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("certificates.update", opts);
			render(data, { json: jsonOutput, endpoint: "certificates.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "cluster.addManager", method: "get" });
		});

	g_cluster
		.command('add-worker')
		.description('cluster addWorker')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("cluster.addWorker", opts);
			render(data, { json: jsonOutput, endpoint: "cluster.addWorker", method: "get" });
		});

	g_cluster
		.command('get-nodes')
		.description('cluster getNodes')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("cluster.getNodes", opts);
			render(data, { json: jsonOutput, endpoint: "cluster.getNodes", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "cluster.removeWorker", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "compose.cancelDeployment", method: "post" });
		});

	g_compose
		.command('clean-queues')
		.description('compose cleanQueues')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.cleanQueues", opts);
			render(data, { json: jsonOutput, endpoint: "compose.cleanQueues", method: "post" });
		});

	g_compose
		.command('clear-deployments')
		.description('compose clearDeployments')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.clearDeployments", opts);
			render(data, { json: jsonOutput, endpoint: "compose.clearDeployments", method: "post" });
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
		.option('--sourceType <value>', 'sourceType (git, github, gitlab, bitbucket, gitea, raw)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.create", opts);
			render(data, { json: jsonOutput, endpoint: "compose.create", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "compose.delete", method: "post" });
		});

	g_compose
		.command('deploy')
		.description('compose deploy')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--title <value>', 'title')
		.option('--description <value>', 'description')
		.option('--freshVolumes', 'freshVolumes')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["freshVolumes"] != null) opts["freshVolumes"] = opts["freshVolumes"] === true || opts["freshVolumes"] === "true";
			const data = await apiPost("compose.deploy", opts);
			render(data, { json: jsonOutput, endpoint: "compose.deploy", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "compose.deployTemplate", method: "post" });
		});

	g_compose
		.command('disconnect-git-provider')
		.description('compose disconnectGitProvider')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.disconnectGitProvider", opts);
			render(data, { json: jsonOutput, endpoint: "compose.disconnectGitProvider", method: "post" });
		});

	g_compose
		.command('fetch-source-type')
		.description('compose fetchSourceType')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.fetchSourceType", opts);
			render(data, { json: jsonOutput, endpoint: "compose.fetchSourceType", method: "post" });
		});

	g_compose
		.command('get-converted-compose')
		.description('compose getConvertedCompose')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("compose.getConvertedCompose", opts);
			render(data, { json: jsonOutput, endpoint: "compose.getConvertedCompose", method: "get" });
		});

	g_compose
		.command('get-default-command')
		.description('compose getDefaultCommand')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("compose.getDefaultCommand", opts);
			render(data, { json: jsonOutput, endpoint: "compose.getDefaultCommand", method: "get" });
		});

	g_compose
		.command('get-tags')
		.description('compose getTags')
		.option('--baseUrl <value>', 'baseUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("compose.getTags", opts);
			render(data, { json: jsonOutput, endpoint: "compose.getTags", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "compose.import", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "compose.isolatedDeployment", method: "post" });
		});

	g_compose
		.command('kill-build')
		.description('compose killBuild')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.killBuild", opts);
			render(data, { json: jsonOutput, endpoint: "compose.killBuild", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "compose.loadMountsByService", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "compose.loadServices", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "compose.move", method: "post" });
		});

	g_compose
		.command('one')
		.description('compose one')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("compose.one", opts);
			render(data, { json: jsonOutput, endpoint: "compose.one", method: "get" });
		});

	g_compose
		.command('preview-template')
		.description('compose previewTemplate')
		.requiredOption('--base64 <value>', 'base64')
		.requiredOption('--appName <value>', 'appName')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.previewTemplate", opts);
			render(data, { json: jsonOutput, endpoint: "compose.previewTemplate", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "compose.processTemplate", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "compose.randomizeCompose", method: "post" });
		});

	g_compose
		.command('read-logs')
		.description('compose readLogs')
		.requiredOption('--composeId <value>', 'composeId')
		.requiredOption('--containerId <value>', 'containerId')
		.option('--tail <value>', 'tail')
		.option('--since <value>', 'since')
		.option('--search <value>', 'search')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["tail"] != null) opts["tail"] = Number(opts["tail"]);
			const data = await apiGet("compose.readLogs", opts);
			render(data, { json: jsonOutput, endpoint: "compose.readLogs", method: "get" });
		});

	g_compose
		.command('redeploy')
		.description('compose redeploy')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--title <value>', 'title')
		.option('--description <value>', 'description')
		.option('--freshVolumes', 'freshVolumes')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["freshVolumes"] != null) opts["freshVolumes"] = opts["freshVolumes"] === true || opts["freshVolumes"] === "true";
			const data = await apiPost("compose.redeploy", opts);
			render(data, { json: jsonOutput, endpoint: "compose.redeploy", method: "post" });
		});

	g_compose
		.command('refresh-token')
		.description('compose refreshToken')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.refreshToken", opts);
			render(data, { json: jsonOutput, endpoint: "compose.refreshToken", method: "post" });
		});

	g_compose
		.command('save-environment')
		.description('compose saveEnvironment')
		.requiredOption('--composeId <value>', 'composeId')
		.requiredOption('--env <value>', 'env')
		.option('--createEnvFile', 'createEnvFile')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["createEnvFile"] != null) opts["createEnvFile"] = opts["createEnvFile"] === true || opts["createEnvFile"] === "true";
			const data = await apiPost("compose.saveEnvironment", opts);
			render(data, { json: jsonOutput, endpoint: "compose.saveEnvironment", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "compose.search", method: "get" });
		});

	g_compose
		.command('start')
		.description('compose start')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.start", opts);
			render(data, { json: jsonOutput, endpoint: "compose.start", method: "post" });
		});

	g_compose
		.command('stop')
		.description('compose stop')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("compose.stop", opts);
			render(data, { json: jsonOutput, endpoint: "compose.stop", method: "post" });
		});

	g_compose
		.command('templates')
		.description('compose templates')
		.option('--baseUrl <value>', 'baseUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("compose.templates", opts);
			render(data, { json: jsonOutput, endpoint: "compose.templates", method: "get" });
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
		.option('--createEnvFile', 'createEnvFile')
		.option('--enableSubmodules', 'enableSubmodules')
		.option('--composePath <value>', 'composePath')
		.option('--suffix <value>', 'suffix')
		.option('--randomize', 'randomize')
		.option('--isolatedDeployment', 'isolatedDeployment')
		.option('--isolatedDeploymentsVolume', 'isolatedDeploymentsVolume')
		.option('--pullImages', 'pullImages')
		.option('--triggerType <value>', 'triggerType (push, tag)')
		.option('--composeStatus <value>', 'composeStatus (idle, running, done, error)')
		.option('--icon <value>', 'icon')
		.option('--environmentId <value>', 'environmentId')
		.option('--createdAt <value>', 'createdAt')
		.option('--watchPaths <value>', 'watchPaths')
		.option('--githubId <value>', 'githubId')
		.option('--gitlabId <value>', 'gitlabId')
		.option('--bitbucketId <value>', 'bitbucketId')
		.option('--giteaId <value>', 'giteaId')
		.option('--serviceNetworks <value>', 'serviceNetworks')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["autoDeploy"] != null) opts["autoDeploy"] = opts["autoDeploy"] === true || opts["autoDeploy"] === "true";
			if (opts["gitlabProjectId"] != null) opts["gitlabProjectId"] = Number(opts["gitlabProjectId"]);
			if (opts["createEnvFile"] != null) opts["createEnvFile"] = opts["createEnvFile"] === true || opts["createEnvFile"] === "true";
			if (opts["enableSubmodules"] != null) opts["enableSubmodules"] = opts["enableSubmodules"] === true || opts["enableSubmodules"] === "true";
			if (opts["randomize"] != null) opts["randomize"] = opts["randomize"] === true || opts["randomize"] === "true";
			if (opts["isolatedDeployment"] != null) opts["isolatedDeployment"] = opts["isolatedDeployment"] === true || opts["isolatedDeployment"] === "true";
			if (opts["isolatedDeploymentsVolume"] != null) opts["isolatedDeploymentsVolume"] = opts["isolatedDeploymentsVolume"] === true || opts["isolatedDeploymentsVolume"] === "true";
			if (opts["pullImages"] != null) opts["pullImages"] = opts["pullImages"] === true || opts["pullImages"] === "true";
			const data = await apiPost("compose.update", opts);
			render(data, { json: jsonOutput, endpoint: "compose.update", method: "post" });
		});
	const g_customRole = program.command('custom-role').description('custom-role commands');

	g_customRole
		.command('all')
		.description('customRole all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("customRole.all", opts);
			render(data, { json: jsonOutput, endpoint: "customRole.all", method: "get" });
		});

	g_customRole
		.command('create')
		.description('customRole create')
		.requiredOption('--roleName <value>', 'roleName')
		.requiredOption('--permissions <value>', 'permissions')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("customRole.create", opts);
			render(data, { json: jsonOutput, endpoint: "customRole.create", method: "post" });
		});

	g_customRole
		.command('get-statements')
		.description('customRole getStatements')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("customRole.getStatements", opts);
			render(data, { json: jsonOutput, endpoint: "customRole.getStatements", method: "get" });
		});

	g_customRole
		.command('members-by-role')
		.description('customRole membersByRole')
		.requiredOption('--roleName <value>', 'roleName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("customRole.membersByRole", opts);
			render(data, { json: jsonOutput, endpoint: "customRole.membersByRole", method: "get" });
		});

	g_customRole
		.command('remove')
		.description('customRole remove')
		.requiredOption('--roleName <value>', 'roleName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("customRole.remove", opts);
			render(data, { json: jsonOutput, endpoint: "customRole.remove", method: "post" });
		});

	g_customRole
		.command('update')
		.description('customRole update')
		.requiredOption('--roleName <value>', 'roleName')
		.option('--newRoleName <value>', 'newRoleName')
		.requiredOption('--permissions <value>', 'permissions')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("customRole.update", opts);
			render(data, { json: jsonOutput, endpoint: "customRole.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "deployment.all", method: "get" });
		});

	g_deployment
		.command('all-by-compose')
		.description('deployment allByCompose')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("deployment.allByCompose", opts);
			render(data, { json: jsonOutput, endpoint: "deployment.allByCompose", method: "get" });
		});

	g_deployment
		.command('all-by-server')
		.description('deployment allByServer')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("deployment.allByServer", opts);
			render(data, { json: jsonOutput, endpoint: "deployment.allByServer", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "deployment.allByType", method: "get" });
		});

	g_deployment
		.command('all-centralized')
		.description('deployment allCentralized')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("deployment.allCentralized", opts);
			render(data, { json: jsonOutput, endpoint: "deployment.allCentralized", method: "get" });
		});

	g_deployment
		.command('kill-process')
		.description('deployment killProcess')
		.requiredOption('--deploymentId <value>', 'deploymentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("deployment.killProcess", opts);
			render(data, { json: jsonOutput, endpoint: "deployment.killProcess", method: "post" });
		});

	g_deployment
		.command('queue-list')
		.description('deployment queueList')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("deployment.queueList", opts);
			render(data, { json: jsonOutput, endpoint: "deployment.queueList", method: "get" });
		});

	g_deployment
		.command('read-logs')
		.description('deployment readLogs')
		.requiredOption('--deploymentId <value>', 'deploymentId')
		.option('--tail <value>', 'tail')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["tail"] != null) opts["tail"] = Number(opts["tail"]);
			const data = await apiGet("deployment.readLogs", opts);
			render(data, { json: jsonOutput, endpoint: "deployment.readLogs", method: "get" });
		});

	g_deployment
		.command('remove-deployment')
		.description('deployment removeDeployment')
		.requiredOption('--deploymentId <value>', 'deploymentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("deployment.removeDeployment", opts);
			render(data, { json: jsonOutput, endpoint: "deployment.removeDeployment", method: "post" });
		});
	const g_destination = program.command('destination').description('destination commands');

	g_destination
		.command('all')
		.description('destination all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("destination.all", opts);
			render(data, { json: jsonOutput, endpoint: "destination.all", method: "get" });
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
		.requiredOption('--additionalFlags <value>', 'additionalFlags')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("destination.create", opts);
			render(data, { json: jsonOutput, endpoint: "destination.create", method: "post" });
		});

	g_destination
		.command('one')
		.description('destination one')
		.requiredOption('--destinationId <value>', 'destinationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("destination.one", opts);
			render(data, { json: jsonOutput, endpoint: "destination.one", method: "get" });
		});

	g_destination
		.command('remove')
		.description('destination remove')
		.requiredOption('--destinationId <value>', 'destinationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("destination.remove", opts);
			render(data, { json: jsonOutput, endpoint: "destination.remove", method: "post" });
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
		.requiredOption('--additionalFlags <value>', 'additionalFlags')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("destination.testConnection", opts);
			render(data, { json: jsonOutput, endpoint: "destination.testConnection", method: "post" });
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
		.requiredOption('--additionalFlags <value>', 'additionalFlags')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("destination.update", opts);
			render(data, { json: jsonOutput, endpoint: "destination.update", method: "post" });
		});
	const g_dnsProvider = program.command('dns-provider').description('dns-provider commands');

	g_dnsProvider
		.command('all')
		.description('dnsProvider all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dnsProvider.all", opts);
			render(data, { json: jsonOutput, endpoint: "dnsProvider.all", method: "get" });
		});

	g_dnsProvider
		.command('create')
		.description('dnsProvider create')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--config <value>', 'config')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("dnsProvider.create", opts);
			render(data, { json: jsonOutput, endpoint: "dnsProvider.create", method: "post" });
		});

	g_dnsProvider
		.command('create-record')
		.description('dnsProvider createRecord')
		.requiredOption('--type <value>', 'type (A, AAAA, CNAME, MX, TXT, NS, SRV, CAA, PTR)')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--content <value>', 'content')
		.option('--ttl <value>', 'ttl')
		.option('--proxied', 'proxied')
		.requiredOption('--dnsProviderId <value>', 'dnsProviderId')
		.requiredOption('--zoneId <value>', 'zoneId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["ttl"] != null) opts["ttl"] = Number(opts["ttl"]);
			if (opts["proxied"] != null) opts["proxied"] = opts["proxied"] === true || opts["proxied"] === "true";
			const data = await apiPost("dnsProvider.createRecord", opts);
			render(data, { json: jsonOutput, endpoint: "dnsProvider.createRecord", method: "post" });
		});

	g_dnsProvider
		.command('delete-record')
		.description('dnsProvider deleteRecord')
		.requiredOption('--dnsProviderId <value>', 'dnsProviderId')
		.requiredOption('--zoneId <value>', 'zoneId')
		.requiredOption('--recordId <value>', 'recordId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("dnsProvider.deleteRecord", opts);
			render(data, { json: jsonOutput, endpoint: "dnsProvider.deleteRecord", method: "post" });
		});

	g_dnsProvider
		.command('list-records')
		.description('dnsProvider listRecords')
		.requiredOption('--dnsProviderId <value>', 'dnsProviderId')
		.requiredOption('--zoneId <value>', 'zoneId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dnsProvider.listRecords", opts);
			render(data, { json: jsonOutput, endpoint: "dnsProvider.listRecords", method: "get" });
		});

	g_dnsProvider
		.command('list-zones')
		.description('dnsProvider listZones')
		.requiredOption('--dnsProviderId <value>', 'dnsProviderId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dnsProvider.listZones", opts);
			render(data, { json: jsonOutput, endpoint: "dnsProvider.listZones", method: "get" });
		});

	g_dnsProvider
		.command('one')
		.description('dnsProvider one')
		.requiredOption('--dnsProviderId <value>', 'dnsProviderId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dnsProvider.one", opts);
			render(data, { json: jsonOutput, endpoint: "dnsProvider.one", method: "get" });
		});

	g_dnsProvider
		.command('remove')
		.description('dnsProvider remove')
		.requiredOption('--dnsProviderId <value>', 'dnsProviderId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("dnsProvider.remove", opts);
			render(data, { json: jsonOutput, endpoint: "dnsProvider.remove", method: "post" });
		});

	g_dnsProvider
		.command('test-connection')
		.description('dnsProvider testConnection')
		.option('--dnsProviderId <value>', 'dnsProviderId')
		.option('--config <value>', 'config')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("dnsProvider.testConnection", opts);
			render(data, { json: jsonOutput, endpoint: "dnsProvider.testConnection", method: "post" });
		});

	g_dnsProvider
		.command('update')
		.description('dnsProvider update')
		.requiredOption('--dnsProviderId <value>', 'dnsProviderId')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--config <value>', 'config')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("dnsProvider.update", opts);
			render(data, { json: jsonOutput, endpoint: "dnsProvider.update", method: "post" });
		});

	g_dnsProvider
		.command('update-record')
		.description('dnsProvider updateRecord')
		.requiredOption('--type <value>', 'type (A, AAAA, CNAME, MX, TXT, NS, SRV, CAA, PTR)')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--content <value>', 'content')
		.option('--ttl <value>', 'ttl')
		.option('--proxied', 'proxied')
		.requiredOption('--dnsProviderId <value>', 'dnsProviderId')
		.requiredOption('--zoneId <value>', 'zoneId')
		.requiredOption('--recordId <value>', 'recordId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["ttl"] != null) opts["ttl"] = Number(opts["ttl"]);
			if (opts["proxied"] != null) opts["proxied"] = opts["proxied"] === true || opts["proxied"] === "true";
			const data = await apiPost("dnsProvider.updateRecord", opts);
			render(data, { json: jsonOutput, endpoint: "dnsProvider.updateRecord", method: "post" });
		});
	const g_docker = program.command('docker').description('docker commands');

	g_docker
		.command('delete-container-file')
		.description('docker deleteContainerFile')
		.requiredOption('--containerId <value>', 'containerId')
		.requiredOption('--path <value>', 'path')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("docker.deleteContainerFile", opts);
			render(data, { json: jsonOutput, endpoint: "docker.deleteContainerFile", method: "post" });
		});

	g_docker
		.command('get-config')
		.description('docker getConfig')
		.requiredOption('--containerId <value>', 'containerId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("docker.getConfig", opts);
			render(data, { json: jsonOutput, endpoint: "docker.getConfig", method: "get" });
		});

	g_docker
		.command('get-containers')
		.description('docker getContainers')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("docker.getContainers", opts);
			render(data, { json: jsonOutput, endpoint: "docker.getContainers", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "docker.getContainersByAppLabel", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "docker.getContainersByAppNameMatch", method: "get" });
		});

	g_docker
		.command('get-events')
		.description('docker getEvents')
		.option('--serverId <value>', 'serverId')
		.option('--minutes <value>', 'minutes')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["minutes"] != null) opts["minutes"] = Number(opts["minutes"]);
			const data = await apiGet("docker.getEvents", opts);
			render(data, { json: jsonOutput, endpoint: "docker.getEvents", method: "get" });
		});

	g_docker
		.command('get-server-health')
		.description('docker getServerHealth')
		.option('--serverId <value>', 'serverId')
		.option('--sinceHours <value>', 'sinceHours')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["sinceHours"] != null) opts["sinceHours"] = Number(opts["sinceHours"]);
			const data = await apiGet("docker.getServerHealth", opts);
			render(data, { json: jsonOutput, endpoint: "docker.getServerHealth", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "docker.getServiceContainersByAppName", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "docker.getStackContainersByAppName", method: "get" });
		});

	g_docker
		.command('kill-container')
		.description('docker killContainer')
		.requiredOption('--containerId <value>', 'containerId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("docker.killContainer", opts);
			render(data, { json: jsonOutput, endpoint: "docker.killContainer", method: "post" });
		});

	g_docker
		.command('list-container-files')
		.description('docker listContainerFiles')
		.requiredOption('--containerId <value>', 'containerId')
		.requiredOption('--path <value>', 'path')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("docker.listContainerFiles", opts);
			render(data, { json: jsonOutput, endpoint: "docker.listContainerFiles", method: "get" });
		});

	g_docker
		.command('read-container-file')
		.description('docker readContainerFile')
		.requiredOption('--containerId <value>', 'containerId')
		.requiredOption('--path <value>', 'path')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("docker.readContainerFile", opts);
			render(data, { json: jsonOutput, endpoint: "docker.readContainerFile", method: "get" });
		});

	g_docker
		.command('remove-container')
		.description('docker removeContainer')
		.requiredOption('--containerId <value>', 'containerId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("docker.removeContainer", opts);
			render(data, { json: jsonOutput, endpoint: "docker.removeContainer", method: "post" });
		});

	g_docker
		.command('restart-container')
		.description('docker restartContainer')
		.requiredOption('--containerId <value>', 'containerId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("docker.restartContainer", opts);
			render(data, { json: jsonOutput, endpoint: "docker.restartContainer", method: "post" });
		});

	g_docker
		.command('start-container')
		.description('docker startContainer')
		.requiredOption('--containerId <value>', 'containerId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("docker.startContainer", opts);
			render(data, { json: jsonOutput, endpoint: "docker.startContainer", method: "post" });
		});

	g_docker
		.command('stop-container')
		.description('docker stopContainer')
		.requiredOption('--containerId <value>', 'containerId')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("docker.stopContainer", opts);
			render(data, { json: jsonOutput, endpoint: "docker.stopContainer", method: "post" });
		});

	g_docker
		.command('upload-file-to-container')
		.description('docker uploadFileToContainer')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("docker.uploadFileToContainer", opts);
			render(data, { json: jsonOutput, endpoint: "docker.uploadFileToContainer", method: "post" });
		});

	g_docker
		.command('write-container-file')
		.description('docker writeContainerFile')
		.requiredOption('--containerId <value>', 'containerId')
		.requiredOption('--path <value>', 'path')
		.requiredOption('--content <value>', 'content')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("docker.writeContainerFile", opts);
			render(data, { json: jsonOutput, endpoint: "docker.writeContainerFile", method: "post" });
		});
	const g_dockerDiskUsage = program.command('docker-disk-usage').description('docker-disk-usage commands');

	g_dockerDiskUsage
		.command('get-build-cache')
		.description('dockerDiskUsage getBuildCache')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dockerDiskUsage.getBuildCache", opts);
			render(data, { json: jsonOutput, endpoint: "dockerDiskUsage.getBuildCache", method: "get" });
		});

	g_dockerDiskUsage
		.command('get-disk-usage')
		.description('dockerDiskUsage getDiskUsage')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dockerDiskUsage.getDiskUsage", opts);
			render(data, { json: jsonOutput, endpoint: "dockerDiskUsage.getDiskUsage", method: "get" });
		});

	g_dockerDiskUsage
		.command('prune-build-cache')
		.description('dockerDiskUsage pruneBuildCache')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("dockerDiskUsage.pruneBuildCache", opts);
			render(data, { json: jsonOutput, endpoint: "dockerDiskUsage.pruneBuildCache", method: "post" });
		});
	const g_dockerImage = program.command('docker-image').description('docker-image commands');

	g_dockerImage
		.command('get-image-config')
		.description('dockerImage getImageConfig')
		.requiredOption('--imageRef <value>', 'imageRef')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dockerImage.getImageConfig", opts);
			render(data, { json: jsonOutput, endpoint: "dockerImage.getImageConfig", method: "get" });
		});

	g_dockerImage
		.command('get-images')
		.description('dockerImage getImages')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dockerImage.getImages", opts);
			render(data, { json: jsonOutput, endpoint: "dockerImage.getImages", method: "get" });
		});

	g_dockerImage
		.command('remove-image')
		.description('dockerImage removeImage')
		.requiredOption('--repository <value>', 'repository')
		.requiredOption('--tag <value>', 'tag')
		.requiredOption('--id <value>', 'id')
		.option('--force', 'force')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["force"] != null) opts["force"] = opts["force"] === true || opts["force"] === "true";
			const data = await apiPost("dockerImage.removeImage", opts);
			render(data, { json: jsonOutput, endpoint: "dockerImage.removeImage", method: "post" });
		});
	const g_dockerVolume = program.command('docker-volume').description('docker-volume commands');

	g_dockerVolume
		.command('delete-volume-file')
		.description('dockerVolume deleteVolumeFile')
		.requiredOption('--volumeName <value>', 'volumeName')
		.requiredOption('--path <value>', 'path')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("dockerVolume.deleteVolumeFile", opts);
			render(data, { json: jsonOutput, endpoint: "dockerVolume.deleteVolumeFile", method: "post" });
		});

	g_dockerVolume
		.command('get-volume-config')
		.description('dockerVolume getVolumeConfig')
		.requiredOption('--volumeName <value>', 'volumeName')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dockerVolume.getVolumeConfig", opts);
			render(data, { json: jsonOutput, endpoint: "dockerVolume.getVolumeConfig", method: "get" });
		});

	g_dockerVolume
		.command('get-volumes')
		.description('dockerVolume getVolumes')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dockerVolume.getVolumes", opts);
			render(data, { json: jsonOutput, endpoint: "dockerVolume.getVolumes", method: "get" });
		});

	g_dockerVolume
		.command('get-volumes-size')
		.description('dockerVolume getVolumesSize')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dockerVolume.getVolumesSize", opts);
			render(data, { json: jsonOutput, endpoint: "dockerVolume.getVolumesSize", method: "get" });
		});

	g_dockerVolume
		.command('list-volume-files')
		.description('dockerVolume listVolumeFiles')
		.requiredOption('--volumeName <value>', 'volumeName')
		.requiredOption('--path <value>', 'path')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dockerVolume.listVolumeFiles", opts);
			render(data, { json: jsonOutput, endpoint: "dockerVolume.listVolumeFiles", method: "get" });
		});

	g_dockerVolume
		.command('read-volume-file')
		.description('dockerVolume readVolumeFile')
		.requiredOption('--volumeName <value>', 'volumeName')
		.requiredOption('--path <value>', 'path')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("dockerVolume.readVolumeFile", opts);
			render(data, { json: jsonOutput, endpoint: "dockerVolume.readVolumeFile", method: "get" });
		});

	g_dockerVolume
		.command('remove-volume')
		.description('dockerVolume removeVolume')
		.requiredOption('--volumeName <value>', 'volumeName')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("dockerVolume.removeVolume", opts);
			render(data, { json: jsonOutput, endpoint: "dockerVolume.removeVolume", method: "post" });
		});

	g_dockerVolume
		.command('write-volume-file')
		.description('dockerVolume writeVolumeFile')
		.requiredOption('--volumeName <value>', 'volumeName')
		.requiredOption('--path <value>', 'path')
		.requiredOption('--content <value>', 'content')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("dockerVolume.writeVolumeFile", opts);
			render(data, { json: jsonOutput, endpoint: "dockerVolume.writeVolumeFile", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "domain.byApplicationId", method: "get" });
		});

	g_domain
		.command('by-compose-id')
		.description('domain byComposeId')
		.requiredOption('--composeId <value>', 'composeId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("domain.byComposeId", opts);
			render(data, { json: jsonOutput, endpoint: "domain.byComposeId", method: "get" });
		});

	g_domain
		.command('can-generate-traefik-me-domains')
		.description('domain canGenerateTraefikMeDomains')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("domain.canGenerateTraefikMeDomains", opts);
			render(data, { json: jsonOutput, endpoint: "domain.canGenerateTraefikMeDomains", method: "get" });
		});

	g_domain
		.command('create')
		.description('domain create')
		.requiredOption('--host <value>', 'host')
		.option('--path <value>', 'path')
		.option('--port <value>', 'port')
		.option('--customEntrypoint <value>', 'customEntrypoint')
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
		.option('--middlewares <value>', 'middlewares')
		.option('--forwardAuthEnabled', 'forwardAuthEnabled')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["port"] != null) opts["port"] = Number(opts["port"]);
			if (opts["https"] != null) opts["https"] = opts["https"] === true || opts["https"] === "true";
			if (opts["stripPath"] != null) opts["stripPath"] = opts["stripPath"] === true || opts["stripPath"] === "true";
			if (opts["forwardAuthEnabled"] != null) opts["forwardAuthEnabled"] = opts["forwardAuthEnabled"] === true || opts["forwardAuthEnabled"] === "true";
			const data = await apiPost("domain.create", opts);
			render(data, { json: jsonOutput, endpoint: "domain.create", method: "post" });
		});

	g_domain
		.command('delete')
		.description('domain delete')
		.requiredOption('--domainId <value>', 'domainId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("domain.delete", opts);
			render(data, { json: jsonOutput, endpoint: "domain.delete", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "domain.generateDomain", method: "post" });
		});

	g_domain
		.command('one')
		.description('domain one')
		.requiredOption('--domainId <value>', 'domainId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("domain.one", opts);
			render(data, { json: jsonOutput, endpoint: "domain.one", method: "get" });
		});

	g_domain
		.command('toggle-enable')
		.description('domain toggleEnable')
		.requiredOption('--domainId <value>', 'domainId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("domain.toggleEnable", opts);
			render(data, { json: jsonOutput, endpoint: "domain.toggleEnable", method: "post" });
		});

	g_domain
		.command('update')
		.description('domain update')
		.requiredOption('--host <value>', 'host')
		.option('--path <value>', 'path')
		.option('--port <value>', 'port')
		.option('--customEntrypoint <value>', 'customEntrypoint')
		.option('--https', 'https')
		.option('--certificateType <value>', 'certificateType (letsencrypt, none, custom)')
		.option('--customCertResolver <value>', 'customCertResolver')
		.option('--serviceName <value>', 'serviceName')
		.option('--domainType <value>', 'domainType (compose, application, preview)')
		.option('--internalPath <value>', 'internalPath')
		.option('--stripPath', 'stripPath')
		.option('--middlewares <value>', 'middlewares')
		.option('--forwardAuthEnabled', 'forwardAuthEnabled')
		.option('--enabled', 'enabled')
		.requiredOption('--domainId <value>', 'domainId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["port"] != null) opts["port"] = Number(opts["port"]);
			if (opts["https"] != null) opts["https"] = opts["https"] === true || opts["https"] === "true";
			if (opts["stripPath"] != null) opts["stripPath"] = opts["stripPath"] === true || opts["stripPath"] === "true";
			if (opts["forwardAuthEnabled"] != null) opts["forwardAuthEnabled"] = opts["forwardAuthEnabled"] === true || opts["forwardAuthEnabled"] === "true";
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			const data = await apiPost("domain.update", opts);
			render(data, { json: jsonOutput, endpoint: "domain.update", method: "post" });
		});

	g_domain
		.command('validate-domain')
		.description('domain validateDomain')
		.requiredOption('--domain <value>', 'domain')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("domain.validateDomain", opts);
			render(data, { json: jsonOutput, endpoint: "domain.validateDomain", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "environment.byProjectId", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "environment.create", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "environment.duplicate", method: "post" });
		});

	g_environment
		.command('one')
		.description('environment one')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("environment.one", opts);
			render(data, { json: jsonOutput, endpoint: "environment.one", method: "get" });
		});

	g_environment
		.command('remove')
		.description('environment remove')
		.requiredOption('--environmentId <value>', 'environmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("environment.remove", opts);
			render(data, { json: jsonOutput, endpoint: "environment.remove", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "environment.search", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "environment.update", method: "post" });
		});
	const g_forwardAuth = program.command('forward-auth').description('forward-auth commands');

	g_forwardAuth
		.command('deploy-on-server')
		.description('forwardAuth deployOnServer')
		.requiredOption('--serverId <value>', 'serverId')
		.requiredOption('--providerId <value>', 'providerId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("forwardAuth.deployOnServer", opts);
			render(data, { json: jsonOutput, endpoint: "forwardAuth.deployOnServer", method: "post" });
		});

	g_forwardAuth
		.command('disable')
		.description('forwardAuth disable')
		.requiredOption('--domainId <value>', 'domainId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("forwardAuth.disable", opts);
			render(data, { json: jsonOutput, endpoint: "forwardAuth.disable", method: "post" });
		});

	g_forwardAuth
		.command('enable')
		.description('forwardAuth enable')
		.requiredOption('--domainId <value>', 'domainId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("forwardAuth.enable", opts);
			render(data, { json: jsonOutput, endpoint: "forwardAuth.enable", method: "post" });
		});

	g_forwardAuth
		.command('get-auth-domain')
		.description('forwardAuth getAuthDomain')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("forwardAuth.getAuthDomain", opts);
			render(data, { json: jsonOutput, endpoint: "forwardAuth.getAuthDomain", method: "get" });
		});

	g_forwardAuth
		.command('list-providers')
		.description('forwardAuth listProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("forwardAuth.listProviders", opts);
			render(data, { json: jsonOutput, endpoint: "forwardAuth.listProviders", method: "get" });
		});

	g_forwardAuth
		.command('remove-auth-domain')
		.description('forwardAuth removeAuthDomain')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("forwardAuth.removeAuthDomain", opts);
			render(data, { json: jsonOutput, endpoint: "forwardAuth.removeAuthDomain", method: "post" });
		});

	g_forwardAuth
		.command('remove-on-server')
		.description('forwardAuth removeOnServer')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("forwardAuth.removeOnServer", opts);
			render(data, { json: jsonOutput, endpoint: "forwardAuth.removeOnServer", method: "post" });
		});

	g_forwardAuth
		.command('server-status')
		.description('forwardAuth serverStatus')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("forwardAuth.serverStatus", opts);
			render(data, { json: jsonOutput, endpoint: "forwardAuth.serverStatus", method: "get" });
		});

	g_forwardAuth
		.command('set-auth-domain')
		.description('forwardAuth setAuthDomain')
		.requiredOption('--serverId <value>', 'serverId')
		.requiredOption('--authDomain <value>', 'authDomain')
		.option('--https', 'https')
		.option('--certificateType <value>', 'certificateType (none, letsencrypt, custom)')
		.option('--customCertResolver <value>', 'customCertResolver')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["https"] != null) opts["https"] = opts["https"] === true || opts["https"] === "true";
			const data = await apiPost("forwardAuth.setAuthDomain", opts);
			render(data, { json: jsonOutput, endpoint: "forwardAuth.setAuthDomain", method: "post" });
		});

	g_forwardAuth
		.command('status')
		.description('forwardAuth status')
		.requiredOption('--domainId <value>', 'domainId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("forwardAuth.status", opts);
			render(data, { json: jsonOutput, endpoint: "forwardAuth.status", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "gitea.create", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "gitea.getGiteaBranches", method: "get" });
		});

	g_gitea
		.command('get-gitea-repositories')
		.description('gitea getGiteaRepositories')
		.requiredOption('--giteaId <value>', 'giteaId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitea.getGiteaRepositories", opts);
			render(data, { json: jsonOutput, endpoint: "gitea.getGiteaRepositories", method: "get" });
		});

	g_gitea
		.command('get-gitea-url')
		.description('gitea getGiteaUrl')
		.requiredOption('--giteaId <value>', 'giteaId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitea.getGiteaUrl", opts);
			render(data, { json: jsonOutput, endpoint: "gitea.getGiteaUrl", method: "get" });
		});

	g_gitea
		.command('gitea-providers')
		.description('gitea giteaProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitea.giteaProviders", opts);
			render(data, { json: jsonOutput, endpoint: "gitea.giteaProviders", method: "get" });
		});

	g_gitea
		.command('one')
		.description('gitea one')
		.requiredOption('--giteaId <value>', 'giteaId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitea.one", opts);
			render(data, { json: jsonOutput, endpoint: "gitea.one", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "gitea.testConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "gitea.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "github.getGithubBranches", method: "get" });
		});

	g_github
		.command('get-github-repositories')
		.description('github getGithubRepositories')
		.requiredOption('--githubId <value>', 'githubId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("github.getGithubRepositories", opts);
			render(data, { json: jsonOutput, endpoint: "github.getGithubRepositories", method: "get" });
		});

	g_github
		.command('github-providers')
		.description('github githubProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("github.githubProviders", opts);
			render(data, { json: jsonOutput, endpoint: "github.githubProviders", method: "get" });
		});

	g_github
		.command('one')
		.description('github one')
		.requiredOption('--githubId <value>', 'githubId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("github.one", opts);
			render(data, { json: jsonOutput, endpoint: "github.one", method: "get" });
		});

	g_github
		.command('test-connection')
		.description('github testConnection')
		.requiredOption('--githubId <value>', 'githubId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("github.testConnection", opts);
			render(data, { json: jsonOutput, endpoint: "github.testConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "github.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "gitlab.create", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "gitlab.getGitlabBranches", method: "get" });
		});

	g_gitlab
		.command('get-gitlab-repositories')
		.description('gitlab getGitlabRepositories')
		.requiredOption('--gitlabId <value>', 'gitlabId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitlab.getGitlabRepositories", opts);
			render(data, { json: jsonOutput, endpoint: "gitlab.getGitlabRepositories", method: "get" });
		});

	g_gitlab
		.command('gitlab-providers')
		.description('gitlab gitlabProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitlab.gitlabProviders", opts);
			render(data, { json: jsonOutput, endpoint: "gitlab.gitlabProviders", method: "get" });
		});

	g_gitlab
		.command('one')
		.description('gitlab one')
		.requiredOption('--gitlabId <value>', 'gitlabId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitlab.one", opts);
			render(data, { json: jsonOutput, endpoint: "gitlab.one", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "gitlab.testConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "gitlab.update", method: "post" });
		});
	const g_gitProvider = program.command('git-provider').description('git-provider commands');

	g_gitProvider
		.command('all-for-permissions')
		.description('gitProvider allForPermissions')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitProvider.allForPermissions", opts);
			render(data, { json: jsonOutput, endpoint: "gitProvider.allForPermissions", method: "get" });
		});

	g_gitProvider
		.command('get-all')
		.description('gitProvider getAll')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("gitProvider.getAll", opts);
			render(data, { json: jsonOutput, endpoint: "gitProvider.getAll", method: "get" });
		});

	g_gitProvider
		.command('remove')
		.description('gitProvider remove')
		.requiredOption('--gitProviderId <value>', 'gitProviderId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("gitProvider.remove", opts);
			render(data, { json: jsonOutput, endpoint: "gitProvider.remove", method: "post" });
		});

	g_gitProvider
		.command('toggle-share')
		.description('gitProvider toggleShare')
		.requiredOption('--gitProviderId <value>', 'gitProviderId')
		.requiredOption('--sharedWithOrganization', 'sharedWithOrganization')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["sharedWithOrganization"] != null) opts["sharedWithOrganization"] = opts["sharedWithOrganization"] === true || opts["sharedWithOrganization"] === "true";
			const data = await apiPost("gitProvider.toggleShare", opts);
			render(data, { json: jsonOutput, endpoint: "gitProvider.toggleShare", method: "post" });
		});
	const g_libsql = program.command('libsql').description('libsql commands');

	g_libsql
		.command('change-status')
		.description('libsql changeStatus')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.requiredOption('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("libsql.changeStatus", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.changeStatus", method: "post" });
		});

	g_libsql
		.command('create')
		.description('libsql create')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appName <value>', 'appName')
		.requiredOption('--dockerImage <value>', 'dockerImage')
		.requiredOption('--environmentId <value>', 'environmentId')
		.requiredOption('--description <value>', 'description')
		.requiredOption('--databaseUser <value>', 'databaseUser')
		.requiredOption('--databasePassword <value>', 'databasePassword')
		.requiredOption('--sqldNode <value>', 'sqldNode (primary, replica)')
		.requiredOption('--sqldPrimaryUrl <value>', 'sqldPrimaryUrl')
		.requiredOption('--enableNamespaces', 'enableNamespaces')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableNamespaces"] != null) opts["enableNamespaces"] = opts["enableNamespaces"] === true || opts["enableNamespaces"] === "true";
			const data = await apiPost("libsql.create", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.create", method: "post" });
		});

	g_libsql
		.command('deploy')
		.description('libsql deploy')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("libsql.deploy", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.deploy", method: "post" });
		});

	g_libsql
		.command('move')
		.description('libsql move')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.requiredOption('--targetEnvironmentId <value>', 'targetEnvironmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("libsql.move", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.move", method: "post" });
		});

	g_libsql
		.command('one')
		.description('libsql one')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("libsql.one", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.one", method: "get" });
		});

	g_libsql
		.command('read-logs')
		.description('libsql readLogs')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.option('--tail <value>', 'tail')
		.option('--since <value>', 'since')
		.option('--search <value>', 'search')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["tail"] != null) opts["tail"] = Number(opts["tail"]);
			const data = await apiGet("libsql.readLogs", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.readLogs", method: "get" });
		});

	g_libsql
		.command('rebuild')
		.description('libsql rebuild')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("libsql.rebuild", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.rebuild", method: "post" });
		});

	g_libsql
		.command('reload')
		.description('libsql reload')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.requiredOption('--appName <value>', 'appName')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("libsql.reload", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.reload", method: "post" });
		});

	g_libsql
		.command('remove')
		.description('libsql remove')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("libsql.remove", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.remove", method: "post" });
		});

	g_libsql
		.command('save-environment')
		.description('libsql saveEnvironment')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.requiredOption('--env <value>', 'env')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("libsql.saveEnvironment", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.saveEnvironment", method: "post" });
		});

	g_libsql
		.command('save-external-ports')
		.description('libsql saveExternalPorts')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.option('--externalPort <value>', 'externalPort')
		.option('--externalGRPCPort <value>', 'externalGRPCPort')
		.option('--externalAdminPort <value>', 'externalAdminPort')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			if (opts["externalGRPCPort"] != null) opts["externalGRPCPort"] = Number(opts["externalGRPCPort"]);
			if (opts["externalAdminPort"] != null) opts["externalAdminPort"] = Number(opts["externalAdminPort"]);
			const data = await apiPost("libsql.saveExternalPorts", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.saveExternalPorts", method: "post" });
		});

	g_libsql
		.command('start')
		.description('libsql start')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("libsql.start", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.start", method: "post" });
		});

	g_libsql
		.command('stop')
		.description('libsql stop')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("libsql.stop", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.stop", method: "post" });
		});

	g_libsql
		.command('update')
		.description('libsql update')
		.requiredOption('--libsqlId <value>', 'libsqlId')
		.option('--name <value>', 'name')
		.option('--appName <value>', 'appName')
		.option('--description <value>', 'description')
		.option('--databaseUser <value>', 'databaseUser')
		.option('--databasePassword <value>', 'databasePassword')
		.option('--sqldNode <value>', 'sqldNode (primary, replica)')
		.option('--sqldPrimaryUrl <value>', 'sqldPrimaryUrl')
		.option('--enableNamespaces', 'enableNamespaces')
		.option('--dockerImage <value>', 'dockerImage')
		.option('--command <value>', 'command')
		.option('--env <value>', 'env')
		.option('--memoryReservation <value>', 'memoryReservation')
		.option('--memoryLimit <value>', 'memoryLimit')
		.option('--cpuReservation <value>', 'cpuReservation')
		.option('--cpuLimit <value>', 'cpuLimit')
		.option('--externalPort <value>', 'externalPort')
		.option('--externalGRPCPort <value>', 'externalGRPCPort')
		.option('--externalAdminPort <value>', 'externalAdminPort')
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
		.option('--replicas <value>', 'replicas')
		.option('--networkIds <value>', 'networkIds')
		.option('--detachDokployNetwork', 'detachDokployNetwork')
		.option('--createdAt <value>', 'createdAt')
		.option('--environmentId <value>', 'environmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enableNamespaces"] != null) opts["enableNamespaces"] = opts["enableNamespaces"] === true || opts["enableNamespaces"] === "true";
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			if (opts["externalGRPCPort"] != null) opts["externalGRPCPort"] = Number(opts["externalGRPCPort"]);
			if (opts["externalAdminPort"] != null) opts["externalAdminPort"] = Number(opts["externalAdminPort"]);
			if (opts["replicas"] != null) opts["replicas"] = Number(opts["replicas"]);
			if (opts["detachDokployNetwork"] != null) opts["detachDokployNetwork"] = opts["detachDokployNetwork"] === true || opts["detachDokployNetwork"] === "true";
			const data = await apiPost("libsql.update", opts);
			render(data, { json: jsonOutput, endpoint: "libsql.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "licenseKey.activate", method: "post" });
		});

	g_licenseKey
		.command('deactivate')
		.description('licenseKey deactivate')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("licenseKey.deactivate", opts);
			render(data, { json: jsonOutput, endpoint: "licenseKey.deactivate", method: "post" });
		});

	g_licenseKey
		.command('get-enterprise-settings')
		.description('licenseKey getEnterpriseSettings')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("licenseKey.getEnterpriseSettings", opts);
			render(data, { json: jsonOutput, endpoint: "licenseKey.getEnterpriseSettings", method: "get" });
		});

	g_licenseKey
		.command('have-valid-license-key')
		.description('licenseKey haveValidLicenseKey')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("licenseKey.haveValidLicenseKey", opts);
			render(data, { json: jsonOutput, endpoint: "licenseKey.haveValidLicenseKey", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "licenseKey.updateEnterpriseSettings", method: "post" });
		});

	g_licenseKey
		.command('validate')
		.description('licenseKey validate')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("licenseKey.validate", opts);
			render(data, { json: jsonOutput, endpoint: "licenseKey.validate", method: "post" });
		});
	const g_mariadb = program.command('mariadb').description('mariadb commands');

	g_mariadb
		.command('change-password')
		.description('mariadb changePassword')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.requiredOption('--password <value>', 'password')
		.option('--type <value>', 'type (user, root)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.changePassword", opts);
			render(data, { json: jsonOutput, endpoint: "mariadb.changePassword", method: "post" });
		});

	g_mariadb
		.command('change-status')
		.description('mariadb changeStatus')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.requiredOption('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.changeStatus", opts);
			render(data, { json: jsonOutput, endpoint: "mariadb.changeStatus", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mariadb.create", method: "post" });
		});

	g_mariadb
		.command('deploy')
		.description('mariadb deploy')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.deploy", opts);
			render(data, { json: jsonOutput, endpoint: "mariadb.deploy", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mariadb.move", method: "post" });
		});

	g_mariadb
		.command('one')
		.description('mariadb one')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("mariadb.one", opts);
			render(data, { json: jsonOutput, endpoint: "mariadb.one", method: "get" });
		});

	g_mariadb
		.command('read-logs')
		.description('mariadb readLogs')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--tail <value>', 'tail')
		.option('--since <value>', 'since')
		.option('--search <value>', 'search')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["tail"] != null) opts["tail"] = Number(opts["tail"]);
			const data = await apiGet("mariadb.readLogs", opts);
			render(data, { json: jsonOutput, endpoint: "mariadb.readLogs", method: "get" });
		});

	g_mariadb
		.command('rebuild')
		.description('mariadb rebuild')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.rebuild", opts);
			render(data, { json: jsonOutput, endpoint: "mariadb.rebuild", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mariadb.reload", method: "post" });
		});

	g_mariadb
		.command('remove')
		.description('mariadb remove')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.remove", opts);
			render(data, { json: jsonOutput, endpoint: "mariadb.remove", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mariadb.saveEnvironment", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mariadb.saveExternalPort", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mariadb.search", method: "get" });
		});

	g_mariadb
		.command('start')
		.description('mariadb start')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.start", opts);
			render(data, { json: jsonOutput, endpoint: "mariadb.start", method: "post" });
		});

	g_mariadb
		.command('stop')
		.description('mariadb stop')
		.requiredOption('--mariadbId <value>', 'mariadbId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mariadb.stop", opts);
			render(data, { json: jsonOutput, endpoint: "mariadb.stop", method: "post" });
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
		.option('--networkIds <value>', 'networkIds')
		.option('--detachDokployNetwork', 'detachDokployNetwork')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			if (opts["replicas"] != null) opts["replicas"] = Number(opts["replicas"]);
			if (opts["detachDokployNetwork"] != null) opts["detachDokployNetwork"] = opts["detachDokployNetwork"] === true || opts["detachDokployNetwork"] === "true";
			const data = await apiPost("mariadb.update", opts);
			render(data, { json: jsonOutput, endpoint: "mariadb.update", method: "post" });
		});
	const g_mongo = program.command('mongo').description('mongo commands');

	g_mongo
		.command('change-password')
		.description('mongo changePassword')
		.requiredOption('--mongoId <value>', 'mongoId')
		.requiredOption('--password <value>', 'password')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.changePassword", opts);
			render(data, { json: jsonOutput, endpoint: "mongo.changePassword", method: "post" });
		});

	g_mongo
		.command('change-status')
		.description('mongo changeStatus')
		.requiredOption('--mongoId <value>', 'mongoId')
		.requiredOption('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.changeStatus", opts);
			render(data, { json: jsonOutput, endpoint: "mongo.changeStatus", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mongo.create", method: "post" });
		});

	g_mongo
		.command('deploy')
		.description('mongo deploy')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.deploy", opts);
			render(data, { json: jsonOutput, endpoint: "mongo.deploy", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mongo.move", method: "post" });
		});

	g_mongo
		.command('one')
		.description('mongo one')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("mongo.one", opts);
			render(data, { json: jsonOutput, endpoint: "mongo.one", method: "get" });
		});

	g_mongo
		.command('read-logs')
		.description('mongo readLogs')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--tail <value>', 'tail')
		.option('--since <value>', 'since')
		.option('--search <value>', 'search')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["tail"] != null) opts["tail"] = Number(opts["tail"]);
			const data = await apiGet("mongo.readLogs", opts);
			render(data, { json: jsonOutput, endpoint: "mongo.readLogs", method: "get" });
		});

	g_mongo
		.command('rebuild')
		.description('mongo rebuild')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.rebuild", opts);
			render(data, { json: jsonOutput, endpoint: "mongo.rebuild", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mongo.reload", method: "post" });
		});

	g_mongo
		.command('remove')
		.description('mongo remove')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.remove", opts);
			render(data, { json: jsonOutput, endpoint: "mongo.remove", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mongo.saveEnvironment", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mongo.saveExternalPort", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mongo.search", method: "get" });
		});

	g_mongo
		.command('start')
		.description('mongo start')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.start", opts);
			render(data, { json: jsonOutput, endpoint: "mongo.start", method: "post" });
		});

	g_mongo
		.command('stop')
		.description('mongo stop')
		.requiredOption('--mongoId <value>', 'mongoId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mongo.stop", opts);
			render(data, { json: jsonOutput, endpoint: "mongo.stop", method: "post" });
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
		.option('--networkIds <value>', 'networkIds')
		.option('--detachDokployNetwork', 'detachDokployNetwork')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			if (opts["replicas"] != null) opts["replicas"] = Number(opts["replicas"]);
			if (opts["replicaSets"] != null) opts["replicaSets"] = opts["replicaSets"] === true || opts["replicaSets"] === "true";
			if (opts["detachDokployNetwork"] != null) opts["detachDokployNetwork"] = opts["detachDokployNetwork"] === true || opts["detachDokployNetwork"] === "true";
			const data = await apiPost("mongo.update", opts);
			render(data, { json: jsonOutput, endpoint: "mongo.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mounts.allNamedByApplicationId", method: "get" });
		});

	g_mounts
		.command('create')
		.description('mounts create')
		.requiredOption('--type <value>', 'type (bind, volume, file)')
		.option('--hostPath <value>', 'hostPath')
		.option('--volumeName <value>', 'volumeName')
		.option('--content <value>', 'content')
		.requiredOption('--mountPath <value>', 'mountPath')
		.option('--filePath <value>', 'filePath')
		.option('--serviceType <value>', 'serviceType (application, postgres, mysql, mariadb, mongo, redis, compose, libsql)')
		.requiredOption('--serviceId <value>', 'serviceId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mounts.create", opts);
			render(data, { json: jsonOutput, endpoint: "mounts.create", method: "post" });
		});

	g_mounts
		.command('list-by-service-id')
		.description('mounts listByServiceId')
		.requiredOption('--serviceType <value>', 'serviceType')
		.requiredOption('--serviceId <value>', 'serviceId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("mounts.listByServiceId", opts);
			render(data, { json: jsonOutput, endpoint: "mounts.listByServiceId", method: "get" });
		});

	g_mounts
		.command('one')
		.description('mounts one')
		.requiredOption('--mountId <value>', 'mountId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("mounts.one", opts);
			render(data, { json: jsonOutput, endpoint: "mounts.one", method: "get" });
		});

	g_mounts
		.command('remove')
		.description('mounts remove')
		.requiredOption('--mountId <value>', 'mountId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mounts.remove", opts);
			render(data, { json: jsonOutput, endpoint: "mounts.remove", method: "post" });
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
		.option('--serviceType <value>', 'serviceType (application, postgres, mysql, mariadb, mongo, redis, compose, libsql)')
		.option('--mountPath <value>', 'mountPath')
		.option('--applicationId <value>', 'applicationId')
		.option('--composeId <value>', 'composeId')
		.option('--libsqlId <value>', 'libsqlId')
		.option('--mariadbId <value>', 'mariadbId')
		.option('--mongoId <value>', 'mongoId')
		.option('--mysqlId <value>', 'mysqlId')
		.option('--postgresId <value>', 'postgresId')
		.option('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mounts.update", opts);
			render(data, { json: jsonOutput, endpoint: "mounts.update", method: "post" });
		});
	const g_mysql = program.command('mysql').description('mysql commands');

	g_mysql
		.command('change-password')
		.description('mysql changePassword')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.requiredOption('--password <value>', 'password')
		.option('--type <value>', 'type (user, root)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.changePassword", opts);
			render(data, { json: jsonOutput, endpoint: "mysql.changePassword", method: "post" });
		});

	g_mysql
		.command('change-status')
		.description('mysql changeStatus')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.requiredOption('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.changeStatus", opts);
			render(data, { json: jsonOutput, endpoint: "mysql.changeStatus", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mysql.create", method: "post" });
		});

	g_mysql
		.command('deploy')
		.description('mysql deploy')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.deploy", opts);
			render(data, { json: jsonOutput, endpoint: "mysql.deploy", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mysql.move", method: "post" });
		});

	g_mysql
		.command('one')
		.description('mysql one')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("mysql.one", opts);
			render(data, { json: jsonOutput, endpoint: "mysql.one", method: "get" });
		});

	g_mysql
		.command('read-logs')
		.description('mysql readLogs')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--tail <value>', 'tail')
		.option('--since <value>', 'since')
		.option('--search <value>', 'search')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["tail"] != null) opts["tail"] = Number(opts["tail"]);
			const data = await apiGet("mysql.readLogs", opts);
			render(data, { json: jsonOutput, endpoint: "mysql.readLogs", method: "get" });
		});

	g_mysql
		.command('rebuild')
		.description('mysql rebuild')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.rebuild", opts);
			render(data, { json: jsonOutput, endpoint: "mysql.rebuild", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mysql.reload", method: "post" });
		});

	g_mysql
		.command('remove')
		.description('mysql remove')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.remove", opts);
			render(data, { json: jsonOutput, endpoint: "mysql.remove", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mysql.saveEnvironment", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mysql.saveExternalPort", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "mysql.search", method: "get" });
		});

	g_mysql
		.command('start')
		.description('mysql start')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.start", opts);
			render(data, { json: jsonOutput, endpoint: "mysql.start", method: "post" });
		});

	g_mysql
		.command('stop')
		.description('mysql stop')
		.requiredOption('--mysqlId <value>', 'mysqlId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("mysql.stop", opts);
			render(data, { json: jsonOutput, endpoint: "mysql.stop", method: "post" });
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
		.option('--networkIds <value>', 'networkIds')
		.option('--detachDokployNetwork', 'detachDokployNetwork')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			if (opts["replicas"] != null) opts["replicas"] = Number(opts["replicas"]);
			if (opts["detachDokployNetwork"] != null) opts["detachDokployNetwork"] = opts["detachDokployNetwork"] === true || opts["detachDokployNetwork"] === "true";
			const data = await apiPost("mysql.update", opts);
			render(data, { json: jsonOutput, endpoint: "mysql.update", method: "post" });
		});
	const g_network = program.command('network').description('network commands');

	g_network
		.command('all')
		.description('network all')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("network.all", opts);
			render(data, { json: jsonOutput, endpoint: "network.all", method: "get" });
		});

	g_network
		.command('create')
		.description('network create')
		.requiredOption('--name <value>', 'name')
		.option('--driver <value>', 'driver (bridge, overlay)')
		.option('--internal', 'internal')
		.option('--attachable', 'attachable')
		.option('--enableIPv4', 'enableIPv4')
		.option('--enableIPv6', 'enableIPv6')
		.option('--mtu <value>', 'mtu')
		.option('--ipam <value>', 'ipam')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["internal"] != null) opts["internal"] = opts["internal"] === true || opts["internal"] === "true";
			if (opts["attachable"] != null) opts["attachable"] = opts["attachable"] === true || opts["attachable"] === "true";
			if (opts["enableIPv4"] != null) opts["enableIPv4"] = opts["enableIPv4"] === true || opts["enableIPv4"] === "true";
			if (opts["enableIPv6"] != null) opts["enableIPv6"] = opts["enableIPv6"] === true || opts["enableIPv6"] === "true";
			const data = await apiPost("network.create", opts);
			render(data, { json: jsonOutput, endpoint: "network.create", method: "post" });
		});

	g_network
		.command('import')
		.description('network import')
		.option('--serverId <value>', 'serverId')
		.requiredOption('--names <value>', 'names')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("network.import", opts);
			render(data, { json: jsonOutput, endpoint: "network.import", method: "post" });
		});

	g_network
		.command('inspect')
		.description('network inspect')
		.requiredOption('--networkId <value>', 'networkId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("network.inspect", opts);
			render(data, { json: jsonOutput, endpoint: "network.inspect", method: "get" });
		});

	g_network
		.command('networks-to-sync')
		.description('network networksToSync')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("network.networksToSync", opts);
			render(data, { json: jsonOutput, endpoint: "network.networksToSync", method: "get" });
		});

	g_network
		.command('one')
		.description('network one')
		.requiredOption('--networkId <value>', 'networkId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("network.one", opts);
			render(data, { json: jsonOutput, endpoint: "network.one", method: "get" });
		});

	g_network
		.command('recreate')
		.description('network recreate')
		.requiredOption('--networkId <value>', 'networkId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("network.recreate", opts);
			render(data, { json: jsonOutput, endpoint: "network.recreate", method: "post" });
		});

	g_network
		.command('remove')
		.description('network remove')
		.requiredOption('--networkId <value>', 'networkId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("network.remove", opts);
			render(data, { json: jsonOutput, endpoint: "network.remove", method: "post" });
		});

	g_network
		.command('resync')
		.description('network resync')
		.requiredOption('--networkId <value>', 'networkId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("network.resync", opts);
			render(data, { json: jsonOutput, endpoint: "network.resync", method: "post" });
		});
	const g_notification = program.command('notification').description('notification commands');

	g_notification
		.command('all')
		.description('notification all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("notification.all", opts);
			render(data, { json: jsonOutput, endpoint: "notification.all", method: "get" });
		});

	g_notification
		.command('create-custom')
		.description('notification createCustom')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createCustom", opts);
			render(data, { json: jsonOutput, endpoint: "notification.createCustom", method: "post" });
		});

	g_notification
		.command('create-discord')
		.description('notification createDiscord')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["decoration"] != null) opts["decoration"] = opts["decoration"] === true || opts["decoration"] === "true";
			const data = await apiPost("notification.createDiscord", opts);
			render(data, { json: jsonOutput, endpoint: "notification.createDiscord", method: "post" });
		});

	g_notification
		.command('create-email')
		.description('notification createEmail')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["smtpPort"] != null) opts["smtpPort"] = Number(opts["smtpPort"]);
			const data = await apiPost("notification.createEmail", opts);
			render(data, { json: jsonOutput, endpoint: "notification.createEmail", method: "post" });
		});

	g_notification
		.command('create-gotify')
		.description('notification createGotify')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--dokployBackup', 'dokployBackup')
		.requiredOption('--volumeBackup', 'volumeBackup')
		.requiredOption('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appDeploy', 'appDeploy')
		.requiredOption('--dockerCleanup', 'dockerCleanup')
		.requiredOption('--serverThreshold', 'serverThreshold')
		.requiredOption('--serverUrl <value>', 'serverUrl')
		.requiredOption('--appToken <value>', 'appToken')
		.requiredOption('--priority <value>', 'priority')
		.requiredOption('--decoration', 'decoration')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			if (opts["decoration"] != null) opts["decoration"] = opts["decoration"] === true || opts["decoration"] === "true";
			const data = await apiPost("notification.createGotify", opts);
			render(data, { json: jsonOutput, endpoint: "notification.createGotify", method: "post" });
		});

	g_notification
		.command('create-lark')
		.description('notification createLark')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createLark", opts);
			render(data, { json: jsonOutput, endpoint: "notification.createLark", method: "post" });
		});

	g_notification
		.command('create-mattermost')
		.description('notification createMattermost')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--dokployBackup', 'dokployBackup')
		.requiredOption('--volumeBackup', 'volumeBackup')
		.requiredOption('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appDeploy', 'appDeploy')
		.requiredOption('--dockerCleanup', 'dockerCleanup')
		.requiredOption('--serverThreshold', 'serverThreshold')
		.requiredOption('--webhookUrl <value>', 'webhookUrl')
		.option('--channel <value>', 'channel')
		.option('--username <value>', 'username')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createMattermost", opts);
			render(data, { json: jsonOutput, endpoint: "notification.createMattermost", method: "post" });
		});

	g_notification
		.command('create-ntfy')
		.description('notification createNtfy')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--dokployBackup', 'dokployBackup')
		.requiredOption('--volumeBackup', 'volumeBackup')
		.requiredOption('--dokployRestart', 'dokployRestart')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--appDeploy', 'appDeploy')
		.requiredOption('--dockerCleanup', 'dockerCleanup')
		.requiredOption('--serverThreshold', 'serverThreshold')
		.requiredOption('--serverUrl <value>', 'serverUrl')
		.requiredOption('--topic <value>', 'topic')
		.requiredOption('--accessToken <value>', 'accessToken')
		.requiredOption('--priority <value>', 'priority')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			const data = await apiPost("notification.createNtfy", opts);
			render(data, { json: jsonOutput, endpoint: "notification.createNtfy", method: "post" });
		});

	g_notification
		.command('create-pushover')
		.description('notification createPushover')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			if (opts["retry"] != null) opts["retry"] = Number(opts["retry"]);
			if (opts["expire"] != null) opts["expire"] = Number(opts["expire"]);
			const data = await apiPost("notification.createPushover", opts);
			render(data, { json: jsonOutput, endpoint: "notification.createPushover", method: "post" });
		});

	g_notification
		.command('create-resend')
		.description('notification createResend')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createResend", opts);
			render(data, { json: jsonOutput, endpoint: "notification.createResend", method: "post" });
		});

	g_notification
		.command('create-slack')
		.description('notification createSlack')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createSlack", opts);
			render(data, { json: jsonOutput, endpoint: "notification.createSlack", method: "post" });
		});

	g_notification
		.command('create-teams')
		.description('notification createTeams')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createTeams", opts);
			render(data, { json: jsonOutput, endpoint: "notification.createTeams", method: "post" });
		});

	g_notification
		.command('create-telegram')
		.description('notification createTelegram')
		.requiredOption('--appBuildError', 'appBuildError')
		.requiredOption('--databaseBackup', 'databaseBackup')
		.requiredOption('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.createTelegram", opts);
			render(data, { json: jsonOutput, endpoint: "notification.createTelegram", method: "post" });
		});

	g_notification
		.command('get-email-providers')
		.description('notification getEmailProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("notification.getEmailProviders", opts);
			render(data, { json: jsonOutput, endpoint: "notification.getEmailProviders", method: "get" });
		});

	g_notification
		.command('one')
		.description('notification one')
		.requiredOption('--notificationId <value>', 'notificationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("notification.one", opts);
			render(data, { json: jsonOutput, endpoint: "notification.one", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "notification.receiveNotification", method: "post" });
		});

	g_notification
		.command('remove')
		.description('notification remove')
		.requiredOption('--notificationId <value>', 'notificationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("notification.remove", opts);
			render(data, { json: jsonOutput, endpoint: "notification.remove", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "notification.testCustomConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "notification.testDiscordConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "notification.testEmailConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "notification.testGotifyConnection", method: "post" });
		});

	g_notification
		.command('test-lark-connection')
		.description('notification testLarkConnection')
		.requiredOption('--webhookUrl <value>', 'webhookUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("notification.testLarkConnection", opts);
			render(data, { json: jsonOutput, endpoint: "notification.testLarkConnection", method: "post" });
		});

	g_notification
		.command('test-mattermost-connection')
		.description('notification testMattermostConnection')
		.requiredOption('--webhookUrl <value>', 'webhookUrl')
		.option('--channel <value>', 'channel')
		.option('--username <value>', 'username')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("notification.testMattermostConnection", opts);
			render(data, { json: jsonOutput, endpoint: "notification.testMattermostConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "notification.testNtfyConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "notification.testPushoverConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "notification.testResendConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "notification.testSlackConnection", method: "post" });
		});

	g_notification
		.command('test-teams-connection')
		.description('notification testTeamsConnection')
		.requiredOption('--webhookUrl <value>', 'webhookUrl')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("notification.testTeamsConnection", opts);
			render(data, { json: jsonOutput, endpoint: "notification.testTeamsConnection", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "notification.testTelegramConnection", method: "post" });
		});

	g_notification
		.command('update-custom')
		.description('notification updateCustom')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateCustom", opts);
			render(data, { json: jsonOutput, endpoint: "notification.updateCustom", method: "post" });
		});

	g_notification
		.command('update-discord')
		.description('notification updateDiscord')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["decoration"] != null) opts["decoration"] = opts["decoration"] === true || opts["decoration"] === "true";
			const data = await apiPost("notification.updateDiscord", opts);
			render(data, { json: jsonOutput, endpoint: "notification.updateDiscord", method: "post" });
		});

	g_notification
		.command('update-email')
		.description('notification updateEmail')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["smtpPort"] != null) opts["smtpPort"] = Number(opts["smtpPort"]);
			const data = await apiPost("notification.updateEmail", opts);
			render(data, { json: jsonOutput, endpoint: "notification.updateEmail", method: "post" });
		});

	g_notification
		.command('update-gotify')
		.description('notification updateGotify')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			if (opts["decoration"] != null) opts["decoration"] = opts["decoration"] === true || opts["decoration"] === "true";
			const data = await apiPost("notification.updateGotify", opts);
			render(data, { json: jsonOutput, endpoint: "notification.updateGotify", method: "post" });
		});

	g_notification
		.command('update-lark')
		.description('notification updateLark')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateLark", opts);
			render(data, { json: jsonOutput, endpoint: "notification.updateLark", method: "post" });
		});

	g_notification
		.command('update-mattermost')
		.description('notification updateMattermost')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
		.option('--webhookUrl <value>', 'webhookUrl')
		.option('--channel <value>', 'channel')
		.option('--username <value>', 'username')
		.requiredOption('--notificationId <value>', 'notificationId')
		.requiredOption('--mattermostId <value>', 'mattermostId')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["appBuildError"] != null) opts["appBuildError"] = opts["appBuildError"] === true || opts["appBuildError"] === "true";
			if (opts["databaseBackup"] != null) opts["databaseBackup"] = opts["databaseBackup"] === true || opts["databaseBackup"] === "true";
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateMattermost", opts);
			render(data, { json: jsonOutput, endpoint: "notification.updateMattermost", method: "post" });
		});

	g_notification
		.command('update-ntfy')
		.description('notification updateNtfy')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
		.option('--volumeBackup', 'volumeBackup')
		.option('--dokployRestart', 'dokployRestart')
		.option('--name <value>', 'name')
		.option('--appDeploy', 'appDeploy')
		.option('--dockerCleanup', 'dockerCleanup')
		.option('--serverThreshold', 'serverThreshold')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			if (opts["priority"] != null) opts["priority"] = Number(opts["priority"]);
			const data = await apiPost("notification.updateNtfy", opts);
			render(data, { json: jsonOutput, endpoint: "notification.updateNtfy", method: "post" });
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
		.option('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updatePushover", opts);
			render(data, { json: jsonOutput, endpoint: "notification.updatePushover", method: "post" });
		});

	g_notification
		.command('update-resend')
		.description('notification updateResend')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateResend", opts);
			render(data, { json: jsonOutput, endpoint: "notification.updateResend", method: "post" });
		});

	g_notification
		.command('update-slack')
		.description('notification updateSlack')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateSlack", opts);
			render(data, { json: jsonOutput, endpoint: "notification.updateSlack", method: "post" });
		});

	g_notification
		.command('update-teams')
		.description('notification updateTeams')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateTeams", opts);
			render(data, { json: jsonOutput, endpoint: "notification.updateTeams", method: "post" });
		});

	g_notification
		.command('update-telegram')
		.description('notification updateTelegram')
		.option('--appBuildError', 'appBuildError')
		.option('--databaseBackup', 'databaseBackup')
		.option('--dokployBackup', 'dokployBackup')
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
			if (opts["dokployBackup"] != null) opts["dokployBackup"] = opts["dokployBackup"] === true || opts["dokployBackup"] === "true";
			if (opts["volumeBackup"] != null) opts["volumeBackup"] = opts["volumeBackup"] === true || opts["volumeBackup"] === "true";
			if (opts["dokployRestart"] != null) opts["dokployRestart"] = opts["dokployRestart"] === true || opts["dokployRestart"] === "true";
			if (opts["appDeploy"] != null) opts["appDeploy"] = opts["appDeploy"] === true || opts["appDeploy"] === "true";
			if (opts["dockerCleanup"] != null) opts["dockerCleanup"] = opts["dockerCleanup"] === true || opts["dockerCleanup"] === "true";
			if (opts["serverThreshold"] != null) opts["serverThreshold"] = opts["serverThreshold"] === true || opts["serverThreshold"] === "true";
			const data = await apiPost("notification.updateTelegram", opts);
			render(data, { json: jsonOutput, endpoint: "notification.updateTelegram", method: "post" });
		});
	const g_organization = program.command('organization').description('organization commands');

	g_organization
		.command('active')
		.description('organization active')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("organization.active", opts);
			render(data, { json: jsonOutput, endpoint: "organization.active", method: "get" });
		});

	g_organization
		.command('all')
		.description('organization all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("organization.all", opts);
			render(data, { json: jsonOutput, endpoint: "organization.all", method: "get" });
		});

	g_organization
		.command('all-invitations')
		.description('organization allInvitations')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("organization.allInvitations", opts);
			render(data, { json: jsonOutput, endpoint: "organization.allInvitations", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "organization.create", method: "post" });
		});

	g_organization
		.command('delete')
		.description('organization delete')
		.requiredOption('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("organization.delete", opts);
			render(data, { json: jsonOutput, endpoint: "organization.delete", method: "post" });
		});

	g_organization
		.command('invite-member')
		.description('organization inviteMember')
		.requiredOption('--email <value>', 'email')
		.requiredOption('--role <value>', 'role')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("organization.inviteMember", opts);
			render(data, { json: jsonOutput, endpoint: "organization.inviteMember", method: "post" });
		});

	g_organization
		.command('one')
		.description('organization one')
		.requiredOption('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("organization.one", opts);
			render(data, { json: jsonOutput, endpoint: "organization.one", method: "get" });
		});

	g_organization
		.command('remove-invitation')
		.description('organization removeInvitation')
		.requiredOption('--invitationId <value>', 'invitationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("organization.removeInvitation", opts);
			render(data, { json: jsonOutput, endpoint: "organization.removeInvitation", method: "post" });
		});

	g_organization
		.command('set-default')
		.description('organization setDefault')
		.requiredOption('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("organization.setDefault", opts);
			render(data, { json: jsonOutput, endpoint: "organization.setDefault", method: "post" });
		});

	g_organization
		.command('update')
		.description('organization update')
		.requiredOption('--organizationId <value>', 'organizationId')
		.requiredOption('--name <value>', 'name')
		.option('--logo <value>', 'logo')
		.option('--defaultRole <value>', 'defaultRole')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("organization.update", opts);
			render(data, { json: jsonOutput, endpoint: "organization.update", method: "post" });
		});

	g_organization
		.command('update-member-role')
		.description('organization updateMemberRole')
		.requiredOption('--memberId <value>', 'memberId')
		.requiredOption('--role <value>', 'role')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("organization.updateMemberRole", opts);
			render(data, { json: jsonOutput, endpoint: "organization.updateMemberRole", method: "post" });
		});
	const g_overview = program.command('overview').description('overview commands');

	g_overview
		.command('backups')
		.description('overview backups')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("overview.backups", opts);
			render(data, { json: jsonOutput, endpoint: "overview.backups", method: "get" });
		});

	g_overview
		.command('domains')
		.description('overview domains')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("overview.domains", opts);
			render(data, { json: jsonOutput, endpoint: "overview.domains", method: "get" });
		});

	g_overview
		.command('services')
		.description('overview services')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("overview.services", opts);
			render(data, { json: jsonOutput, endpoint: "overview.services", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "patch.byEntityId", method: "get" });
		});

	g_patch
		.command('clean-patch-repos')
		.description('patch cleanPatchRepos')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("patch.cleanPatchRepos", opts);
			render(data, { json: jsonOutput, endpoint: "patch.cleanPatchRepos", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "patch.create", method: "post" });
		});

	g_patch
		.command('delete')
		.description('patch delete')
		.requiredOption('--patchId <value>', 'patchId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("patch.delete", opts);
			render(data, { json: jsonOutput, endpoint: "patch.delete", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "patch.ensureRepo", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "patch.markFileForDeletion", method: "post" });
		});

	g_patch
		.command('one')
		.description('patch one')
		.requiredOption('--patchId <value>', 'patchId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("patch.one", opts);
			render(data, { json: jsonOutput, endpoint: "patch.one", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "patch.readRepoDirectories", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "patch.readRepoFile", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "patch.saveFileAsPatch", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "patch.toggleEnabled", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "patch.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "port.create", method: "post" });
		});

	g_port
		.command('delete')
		.description('port delete')
		.requiredOption('--portId <value>', 'portId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("port.delete", opts);
			render(data, { json: jsonOutput, endpoint: "port.delete", method: "post" });
		});

	g_port
		.command('one')
		.description('port one')
		.requiredOption('--portId <value>', 'portId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("port.one", opts);
			render(data, { json: jsonOutput, endpoint: "port.one", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "port.update", method: "post" });
		});
	const g_postgres = program.command('postgres').description('postgres commands');

	g_postgres
		.command('change-password')
		.description('postgres changePassword')
		.requiredOption('--postgresId <value>', 'postgresId')
		.requiredOption('--password <value>', 'password')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.changePassword", opts);
			render(data, { json: jsonOutput, endpoint: "postgres.changePassword", method: "post" });
		});

	g_postgres
		.command('change-status')
		.description('postgres changeStatus')
		.requiredOption('--postgresId <value>', 'postgresId')
		.requiredOption('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.changeStatus", opts);
			render(data, { json: jsonOutput, endpoint: "postgres.changeStatus", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "postgres.create", method: "post" });
		});

	g_postgres
		.command('deploy')
		.description('postgres deploy')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.deploy", opts);
			render(data, { json: jsonOutput, endpoint: "postgres.deploy", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "postgres.move", method: "post" });
		});

	g_postgres
		.command('one')
		.description('postgres one')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("postgres.one", opts);
			render(data, { json: jsonOutput, endpoint: "postgres.one", method: "get" });
		});

	g_postgres
		.command('read-logs')
		.description('postgres readLogs')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--tail <value>', 'tail')
		.option('--since <value>', 'since')
		.option('--search <value>', 'search')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["tail"] != null) opts["tail"] = Number(opts["tail"]);
			const data = await apiGet("postgres.readLogs", opts);
			render(data, { json: jsonOutput, endpoint: "postgres.readLogs", method: "get" });
		});

	g_postgres
		.command('rebuild')
		.description('postgres rebuild')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.rebuild", opts);
			render(data, { json: jsonOutput, endpoint: "postgres.rebuild", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "postgres.reload", method: "post" });
		});

	g_postgres
		.command('remove')
		.description('postgres remove')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.remove", opts);
			render(data, { json: jsonOutput, endpoint: "postgres.remove", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "postgres.saveEnvironment", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "postgres.saveExternalPort", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "postgres.search", method: "get" });
		});

	g_postgres
		.command('start')
		.description('postgres start')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.start", opts);
			render(data, { json: jsonOutput, endpoint: "postgres.start", method: "post" });
		});

	g_postgres
		.command('stop')
		.description('postgres stop')
		.requiredOption('--postgresId <value>', 'postgresId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("postgres.stop", opts);
			render(data, { json: jsonOutput, endpoint: "postgres.stop", method: "post" });
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
		.option('--networkIds <value>', 'networkIds')
		.option('--detachDokployNetwork', 'detachDokployNetwork')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			if (opts["replicas"] != null) opts["replicas"] = Number(opts["replicas"]);
			if (opts["detachDokployNetwork"] != null) opts["detachDokployNetwork"] = opts["detachDokployNetwork"] === true || opts["detachDokployNetwork"] === "true";
			const data = await apiPost("postgres.update", opts);
			render(data, { json: jsonOutput, endpoint: "postgres.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "previewDeployment.all", method: "get" });
		});

	g_previewDeployment
		.command('delete')
		.description('previewDeployment delete')
		.requiredOption('--previewDeploymentId <value>', 'previewDeploymentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("previewDeployment.delete", opts);
			render(data, { json: jsonOutput, endpoint: "previewDeployment.delete", method: "post" });
		});

	g_previewDeployment
		.command('one')
		.description('previewDeployment one')
		.requiredOption('--previewDeploymentId <value>', 'previewDeploymentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("previewDeployment.one", opts);
			render(data, { json: jsonOutput, endpoint: "previewDeployment.one", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "previewDeployment.redeploy", method: "post" });
		});
	const g_project = program.command('project').description('project commands');

	g_project
		.command('all')
		.description('project all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("project.all", opts);
			render(data, { json: jsonOutput, endpoint: "project.all", method: "get" });
		});

	g_project
		.command('all-for-permissions')
		.description('project allForPermissions')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("project.allForPermissions", opts);
			render(data, { json: jsonOutput, endpoint: "project.allForPermissions", method: "get" });
		});

	g_project
		.command('complete-onboarding')
		.description('project completeOnboarding')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("project.completeOnboarding", opts);
			render(data, { json: jsonOutput, endpoint: "project.completeOnboarding", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "project.create", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "project.duplicate", method: "post" });
		});

	g_project
		.command('home-stats')
		.description('project homeStats')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("project.homeStats", opts);
			render(data, { json: jsonOutput, endpoint: "project.homeStats", method: "get" });
		});

	g_project
		.command('onboarding-status')
		.description('project onboardingStatus')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("project.onboardingStatus", opts);
			render(data, { json: jsonOutput, endpoint: "project.onboardingStatus", method: "get" });
		});

	g_project
		.command('one')
		.description('project one')
		.requiredOption('--projectId <value>', 'projectId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("project.one", opts);
			render(data, { json: jsonOutput, endpoint: "project.one", method: "get" });
		});

	g_project
		.command('remove')
		.description('project remove')
		.requiredOption('--projectId <value>', 'projectId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("project.remove", opts);
			render(data, { json: jsonOutput, endpoint: "project.remove", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "project.search", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "project.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "redirects.create", method: "post" });
		});

	g_redirects
		.command('delete')
		.description('redirects delete')
		.requiredOption('--redirectId <value>', 'redirectId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redirects.delete", opts);
			render(data, { json: jsonOutput, endpoint: "redirects.delete", method: "post" });
		});

	g_redirects
		.command('one')
		.description('redirects one')
		.requiredOption('--redirectId <value>', 'redirectId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("redirects.one", opts);
			render(data, { json: jsonOutput, endpoint: "redirects.one", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "redirects.update", method: "post" });
		});
	const g_redis = program.command('redis').description('redis commands');

	g_redis
		.command('change-password')
		.description('redis changePassword')
		.requiredOption('--redisId <value>', 'redisId')
		.requiredOption('--password <value>', 'password')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.changePassword", opts);
			render(data, { json: jsonOutput, endpoint: "redis.changePassword", method: "post" });
		});

	g_redis
		.command('change-status')
		.description('redis changeStatus')
		.requiredOption('--redisId <value>', 'redisId')
		.requiredOption('--applicationStatus <value>', 'applicationStatus (idle, running, done, error)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.changeStatus", opts);
			render(data, { json: jsonOutput, endpoint: "redis.changeStatus", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "redis.create", method: "post" });
		});

	g_redis
		.command('deploy')
		.description('redis deploy')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.deploy", opts);
			render(data, { json: jsonOutput, endpoint: "redis.deploy", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "redis.move", method: "post" });
		});

	g_redis
		.command('one')
		.description('redis one')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("redis.one", opts);
			render(data, { json: jsonOutput, endpoint: "redis.one", method: "get" });
		});

	g_redis
		.command('read-logs')
		.description('redis readLogs')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--tail <value>', 'tail')
		.option('--since <value>', 'since')
		.option('--search <value>', 'search')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["tail"] != null) opts["tail"] = Number(opts["tail"]);
			const data = await apiGet("redis.readLogs", opts);
			render(data, { json: jsonOutput, endpoint: "redis.readLogs", method: "get" });
		});

	g_redis
		.command('rebuild')
		.description('redis rebuild')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.rebuild", opts);
			render(data, { json: jsonOutput, endpoint: "redis.rebuild", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "redis.reload", method: "post" });
		});

	g_redis
		.command('remove')
		.description('redis remove')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.remove", opts);
			render(data, { json: jsonOutput, endpoint: "redis.remove", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "redis.saveEnvironment", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "redis.saveExternalPort", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "redis.search", method: "get" });
		});

	g_redis
		.command('start')
		.description('redis start')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.start", opts);
			render(data, { json: jsonOutput, endpoint: "redis.start", method: "post" });
		});

	g_redis
		.command('stop')
		.description('redis stop')
		.requiredOption('--redisId <value>', 'redisId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("redis.stop", opts);
			render(data, { json: jsonOutput, endpoint: "redis.stop", method: "post" });
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
		.option('--networkIds <value>', 'networkIds')
		.option('--detachDokployNetwork', 'detachDokployNetwork')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["externalPort"] != null) opts["externalPort"] = Number(opts["externalPort"]);
			if (opts["replicas"] != null) opts["replicas"] = Number(opts["replicas"]);
			if (opts["detachDokployNetwork"] != null) opts["detachDokployNetwork"] = opts["detachDokployNetwork"] === true || opts["detachDokployNetwork"] === "true";
			const data = await apiPost("redis.update", opts);
			render(data, { json: jsonOutput, endpoint: "redis.update", method: "post" });
		});
	const g_registry = program.command('registry').description('registry commands');

	g_registry
		.command('all')
		.description('registry all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("registry.all", opts);
			render(data, { json: jsonOutput, endpoint: "registry.all", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "registry.create", method: "post" });
		});

	g_registry
		.command('one')
		.description('registry one')
		.requiredOption('--registryId <value>', 'registryId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("registry.one", opts);
			render(data, { json: jsonOutput, endpoint: "registry.one", method: "get" });
		});

	g_registry
		.command('remove')
		.description('registry remove')
		.requiredOption('--registryId <value>', 'registryId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("registry.remove", opts);
			render(data, { json: jsonOutput, endpoint: "registry.remove", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "registry.testRegistry", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "registry.testRegistryById", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "registry.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "rollback.delete", method: "post" });
		});

	g_rollback
		.command('rollback')
		.description('rollback rollback')
		.requiredOption('--rollbackId <value>', 'rollbackId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("rollback.rollback", opts);
			render(data, { json: jsonOutput, endpoint: "rollback.rollback", method: "post" });
		});
	const g_schedule = program.command('schedule').description('schedule commands');

	g_schedule
		.command('create')
		.description('schedule create')
		.option('--scheduleId <value>', 'scheduleId')
		.requiredOption('--name <value>', 'name')
		.option('--description <value>', 'description')
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
		.option('--organizationId <value>', 'organizationId')
		.option('--enabled', 'enabled')
		.option('--timezone <value>', 'timezone')
		.option('--createdAt <value>', 'createdAt')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			const data = await apiPost("schedule.create", opts);
			render(data, { json: jsonOutput, endpoint: "schedule.create", method: "post" });
		});

	g_schedule
		.command('delete')
		.description('schedule delete')
		.requiredOption('--scheduleId <value>', 'scheduleId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("schedule.delete", opts);
			render(data, { json: jsonOutput, endpoint: "schedule.delete", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "schedule.list", method: "get" });
		});

	g_schedule
		.command('one')
		.description('schedule one')
		.requiredOption('--scheduleId <value>', 'scheduleId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("schedule.one", opts);
			render(data, { json: jsonOutput, endpoint: "schedule.one", method: "get" });
		});

	g_schedule
		.command('run-manually')
		.description('schedule runManually')
		.requiredOption('--scheduleId <value>', 'scheduleId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("schedule.runManually", opts);
			render(data, { json: jsonOutput, endpoint: "schedule.runManually", method: "post" });
		});

	g_schedule
		.command('update')
		.description('schedule update')
		.requiredOption('--scheduleId <value>', 'scheduleId')
		.requiredOption('--name <value>', 'name')
		.option('--description <value>', 'description')
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
		.option('--organizationId <value>', 'organizationId')
		.option('--enabled', 'enabled')
		.option('--timezone <value>', 'timezone')
		.option('--createdAt <value>', 'createdAt')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			const data = await apiPost("schedule.update", opts);
			render(data, { json: jsonOutput, endpoint: "schedule.update", method: "post" });
		});
	const g_scim = program.command('scim').description('scim commands');

	g_scim
		.command('delete-provider')
		.description('scim deleteProvider')
		.requiredOption('--providerId <value>', 'providerId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("scim.deleteProvider", opts);
			render(data, { json: jsonOutput, endpoint: "scim.deleteProvider", method: "post" });
		});

	g_scim
		.command('generate-token')
		.description('scim generateToken')
		.requiredOption('--providerId <value>', 'providerId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("scim.generateToken", opts);
			render(data, { json: jsonOutput, endpoint: "scim.generateToken", method: "post" });
		});

	g_scim
		.command('list-providers')
		.description('scim listProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("scim.listProviders", opts);
			render(data, { json: jsonOutput, endpoint: "scim.listProviders", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "security.create", method: "post" });
		});

	g_security
		.command('delete')
		.description('security delete')
		.requiredOption('--securityId <value>', 'securityId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("security.delete", opts);
			render(data, { json: jsonOutput, endpoint: "security.delete", method: "post" });
		});

	g_security
		.command('one')
		.description('security one')
		.requiredOption('--securityId <value>', 'securityId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("security.one", opts);
			render(data, { json: jsonOutput, endpoint: "security.one", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "security.update", method: "post" });
		});
	const g_server = program.command('server').description('server commands');

	g_server
		.command('all')
		.description('server all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.all", opts);
			render(data, { json: jsonOutput, endpoint: "server.all", method: "get" });
		});

	g_server
		.command('all-for-permissions')
		.description('server allForPermissions')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.allForPermissions", opts);
			render(data, { json: jsonOutput, endpoint: "server.allForPermissions", method: "get" });
		});

	g_server
		.command('build-servers')
		.description('server buildServers')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.buildServers", opts);
			render(data, { json: jsonOutput, endpoint: "server.buildServers", method: "get" });
		});

	g_server
		.command('count')
		.description('server count')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.count", opts);
			render(data, { json: jsonOutput, endpoint: "server.count", method: "get" });
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
		.option('--enableDockerCleanup', 'enableDockerCleanup')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["port"] != null) opts["port"] = Number(opts["port"]);
			if (opts["enableDockerCleanup"] != null) opts["enableDockerCleanup"] = opts["enableDockerCleanup"] === true || opts["enableDockerCleanup"] === "true";
			const data = await apiPost("server.create", opts);
			render(data, { json: jsonOutput, endpoint: "server.create", method: "post" });
		});

	g_server
		.command('get-default-command')
		.description('server getDefaultCommand')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.getDefaultCommand", opts);
			render(data, { json: jsonOutput, endpoint: "server.getDefaultCommand", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "server.getServerMetrics", method: "get" });
		});

	g_server
		.command('get-server-time')
		.description('server getServerTime')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.getServerTime", opts);
			render(data, { json: jsonOutput, endpoint: "server.getServerTime", method: "get" });
		});

	g_server
		.command('get-services')
		.description('server getServices')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.getServices", opts);
			render(data, { json: jsonOutput, endpoint: "server.getServices", method: "get" });
		});

	g_server
		.command('one')
		.description('server one')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.one", opts);
			render(data, { json: jsonOutput, endpoint: "server.one", method: "get" });
		});

	g_server
		.command('public-ip')
		.description('server publicIp')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.publicIp", opts);
			render(data, { json: jsonOutput, endpoint: "server.publicIp", method: "get" });
		});

	g_server
		.command('remove')
		.description('server remove')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("server.remove", opts);
			render(data, { json: jsonOutput, endpoint: "server.remove", method: "post" });
		});

	g_server
		.command('security')
		.description('server security')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.security", opts);
			render(data, { json: jsonOutput, endpoint: "server.security", method: "get" });
		});

	g_server
		.command('setup')
		.description('server setup')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("server.setup", opts);
			render(data, { json: jsonOutput, endpoint: "server.setup", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "server.setupMonitoring", method: "post" });
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
		.option('--enableDockerCleanup', 'enableDockerCleanup')
		.option('--command <value>', 'command')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["port"] != null) opts["port"] = Number(opts["port"]);
			if (opts["enableDockerCleanup"] != null) opts["enableDockerCleanup"] = opts["enableDockerCleanup"] === true || opts["enableDockerCleanup"] === "true";
			const data = await apiPost("server.update", opts);
			render(data, { json: jsonOutput, endpoint: "server.update", method: "post" });
		});

	g_server
		.command('update-builds-concurrency')
		.description('server updateBuildsConcurrency')
		.requiredOption('--serverId <value>', 'serverId')
		.requiredOption('--buildsConcurrency <value>', 'buildsConcurrency')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["buildsConcurrency"] != null) opts["buildsConcurrency"] = Number(opts["buildsConcurrency"]);
			const data = await apiPost("server.updateBuildsConcurrency", opts);
			render(data, { json: jsonOutput, endpoint: "server.updateBuildsConcurrency", method: "post" });
		});

	g_server
		.command('validate')
		.description('server validate')
		.requiredOption('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.validate", opts);
			render(data, { json: jsonOutput, endpoint: "server.validate", method: "get" });
		});

	g_server
		.command('with-sshkey')
		.description('server withSSHKey')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("server.withSSHKey", opts);
			render(data, { json: jsonOutput, endpoint: "server.withSSHKey", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "settings.assignDomainServer", method: "post" });
		});

	g_settings
		.command('check-gpustatus')
		.description('settings checkGPUStatus')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.checkGPUStatus", opts);
			render(data, { json: jsonOutput, endpoint: "settings.checkGPUStatus", method: "get" });
		});

	g_settings
		.command('check-infrastructure-health')
		.description('settings checkInfrastructureHealth')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.checkInfrastructureHealth", opts);
			render(data, { json: jsonOutput, endpoint: "settings.checkInfrastructureHealth", method: "get" });
		});

	g_settings
		.command('clean-all')
		.description('settings cleanAll')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanAll", opts);
			render(data, { json: jsonOutput, endpoint: "settings.cleanAll", method: "post" });
		});

	g_settings
		.command('clean-all-deployment-queue')
		.description('settings cleanAllDeploymentQueue')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanAllDeploymentQueue", opts);
			render(data, { json: jsonOutput, endpoint: "settings.cleanAllDeploymentQueue", method: "post" });
		});

	g_settings
		.command('clean-docker-builder')
		.description('settings cleanDockerBuilder')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanDockerBuilder", opts);
			render(data, { json: jsonOutput, endpoint: "settings.cleanDockerBuilder", method: "post" });
		});

	g_settings
		.command('clean-docker-prune')
		.description('settings cleanDockerPrune')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanDockerPrune", opts);
			render(data, { json: jsonOutput, endpoint: "settings.cleanDockerPrune", method: "post" });
		});

	g_settings
		.command('clean-monitoring')
		.description('settings cleanMonitoring')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanMonitoring", opts);
			render(data, { json: jsonOutput, endpoint: "settings.cleanMonitoring", method: "post" });
		});

	g_settings
		.command('clean-sshprivate-key')
		.description('settings cleanSSHPrivateKey')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanSSHPrivateKey", opts);
			render(data, { json: jsonOutput, endpoint: "settings.cleanSSHPrivateKey", method: "post" });
		});

	g_settings
		.command('clean-stopped-containers')
		.description('settings cleanStoppedContainers')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanStoppedContainers", opts);
			render(data, { json: jsonOutput, endpoint: "settings.cleanStoppedContainers", method: "post" });
		});

	g_settings
		.command('clean-unused-images')
		.description('settings cleanUnusedImages')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanUnusedImages", opts);
			render(data, { json: jsonOutput, endpoint: "settings.cleanUnusedImages", method: "post" });
		});

	g_settings
		.command('clean-unused-volumes')
		.description('settings cleanUnusedVolumes')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.cleanUnusedVolumes", opts);
			render(data, { json: jsonOutput, endpoint: "settings.cleanUnusedVolumes", method: "post" });
		});

	g_settings
		.command('get-docker-disk-usage')
		.description('settings getDockerDiskUsage')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getDockerDiskUsage", opts);
			render(data, { json: jsonOutput, endpoint: "settings.getDockerDiskUsage", method: "get" });
		});

	g_settings
		.command('get-dokploy-cloud-ips')
		.description('settings getDokployCloudIps')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getDokployCloudIps", opts);
			render(data, { json: jsonOutput, endpoint: "settings.getDokployCloudIps", method: "get" });
		});

	g_settings
		.command('get-dokploy-version')
		.description('settings getDokployVersion')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getDokployVersion", opts);
			render(data, { json: jsonOutput, endpoint: "settings.getDokployVersion", method: "get" });
		});

	g_settings
		.command('get-ip')
		.description('settings getIp')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getIp", opts);
			render(data, { json: jsonOutput, endpoint: "settings.getIp", method: "get" });
		});

	g_settings
		.command('get-log-cleanup-status')
		.description('settings getLogCleanupStatus')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getLogCleanupStatus", opts);
			render(data, { json: jsonOutput, endpoint: "settings.getLogCleanupStatus", method: "get" });
		});

	g_settings
		.command('get-open-api-document')
		.description('settings getOpenApiDocument')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getOpenApiDocument", opts);
			render(data, { json: jsonOutput, endpoint: "settings.getOpenApiDocument", method: "get" });
		});

	g_settings
		.command('get-release-tag')
		.description('settings getReleaseTag')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getReleaseTag", opts);
			render(data, { json: jsonOutput, endpoint: "settings.getReleaseTag", method: "get" });
		});

	g_settings
		.command('get-traefik-ports')
		.description('settings getTraefikPorts')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getTraefikPorts", opts);
			render(data, { json: jsonOutput, endpoint: "settings.getTraefikPorts", method: "get" });
		});

	g_settings
		.command('get-update-data')
		.description('settings getUpdateData')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.getUpdateData", opts);
			render(data, { json: jsonOutput, endpoint: "settings.getUpdateData", method: "post" });
		});

	g_settings
		.command('get-web-server-settings')
		.description('settings getWebServerSettings')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.getWebServerSettings", opts);
			render(data, { json: jsonOutput, endpoint: "settings.getWebServerSettings", method: "get" });
		});

	g_settings
		.command('have-activate-requests')
		.description('settings haveActivateRequests')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.haveActivateRequests", opts);
			render(data, { json: jsonOutput, endpoint: "settings.haveActivateRequests", method: "get" });
		});

	g_settings
		.command('have-traefik-dashboard-port-enabled')
		.description('settings haveTraefikDashboardPortEnabled')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.haveTraefikDashboardPortEnabled", opts);
			render(data, { json: jsonOutput, endpoint: "settings.haveTraefikDashboardPortEnabled", method: "get" });
		});

	g_settings
		.command('health')
		.description('settings health')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.health", opts);
			render(data, { json: jsonOutput, endpoint: "settings.health", method: "get" });
		});

	g_settings
		.command('is-cloud')
		.description('settings isCloud')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.isCloud", opts);
			render(data, { json: jsonOutput, endpoint: "settings.isCloud", method: "get" });
		});

	g_settings
		.command('is-user-subscribed')
		.description('settings isUserSubscribed')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.isUserSubscribed", opts);
			render(data, { json: jsonOutput, endpoint: "settings.isUserSubscribed", method: "get" });
		});

	g_settings
		.command('read-directories')
		.description('settings readDirectories')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.readDirectories", opts);
			render(data, { json: jsonOutput, endpoint: "settings.readDirectories", method: "get" });
		});

	g_settings
		.command('read-middleware-traefik-config')
		.description('settings readMiddlewareTraefikConfig')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.readMiddlewareTraefikConfig", opts);
			render(data, { json: jsonOutput, endpoint: "settings.readMiddlewareTraefikConfig", method: "get" });
		});

	g_settings
		.command('read-traefik-config')
		.description('settings readTraefikConfig')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.readTraefikConfig", opts);
			render(data, { json: jsonOutput, endpoint: "settings.readTraefikConfig", method: "get" });
		});

	g_settings
		.command('read-traefik-env')
		.description('settings readTraefikEnv')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.readTraefikEnv", opts);
			render(data, { json: jsonOutput, endpoint: "settings.readTraefikEnv", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "settings.readTraefikFile", method: "get" });
		});

	g_settings
		.command('read-web-server-traefik-config')
		.description('settings readWebServerTraefikConfig')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("settings.readWebServerTraefikConfig", opts);
			render(data, { json: jsonOutput, endpoint: "settings.readWebServerTraefikConfig", method: "get" });
		});

	g_settings
		.command('reload-server')
		.description('settings reloadServer')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.reloadServer", opts);
			render(data, { json: jsonOutput, endpoint: "settings.reloadServer", method: "post" });
		});

	g_settings
		.command('reload-traefik')
		.description('settings reloadTraefik')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.reloadTraefik", opts);
			render(data, { json: jsonOutput, endpoint: "settings.reloadTraefik", method: "post" });
		});

	g_settings
		.command('save-sshprivate-key')
		.description('settings saveSSHPrivateKey')
		.requiredOption('--sshPrivateKey <value>', 'sshPrivateKey')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.saveSSHPrivateKey", opts);
			render(data, { json: jsonOutput, endpoint: "settings.saveSSHPrivateKey", method: "post" });
		});

	g_settings
		.command('setup-gpu')
		.description('settings setupGPU')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.setupGPU", opts);
			render(data, { json: jsonOutput, endpoint: "settings.setupGPU", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "settings.toggleDashboard", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "settings.toggleRequests", method: "post" });
		});

	g_settings
		.command('update-builds-concurrency')
		.description('settings updateBuildsConcurrency')
		.requiredOption('--buildsConcurrency <value>', 'buildsConcurrency')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["buildsConcurrency"] != null) opts["buildsConcurrency"] = Number(opts["buildsConcurrency"]);
			const data = await apiPost("settings.updateBuildsConcurrency", opts);
			render(data, { json: jsonOutput, endpoint: "settings.updateBuildsConcurrency", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "settings.updateDockerCleanup", method: "post" });
		});

	g_settings
		.command('update-enforce-sso')
		.description('settings updateEnforceSSO')
		.requiredOption('--enforceSSO', 'enforceSSO')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enforceSSO"] != null) opts["enforceSSO"] = opts["enforceSSO"] === true || opts["enforceSSO"] === "true";
			const data = await apiPost("settings.updateEnforceSSO", opts);
			render(data, { json: jsonOutput, endpoint: "settings.updateEnforceSSO", method: "post" });
		});

	g_settings
		.command('update-log-cleanup')
		.description('settings updateLogCleanup')
		.requiredOption('--cronExpression <value>', 'cronExpression')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateLogCleanup", opts);
			render(data, { json: jsonOutput, endpoint: "settings.updateLogCleanup", method: "post" });
		});

	g_settings
		.command('update-middleware-traefik-config')
		.description('settings updateMiddlewareTraefikConfig')
		.requiredOption('--traefikConfig <value>', 'traefikConfig')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateMiddlewareTraefikConfig", opts);
			render(data, { json: jsonOutput, endpoint: "settings.updateMiddlewareTraefikConfig", method: "post" });
		});

	g_settings
		.command('update-remote-servers-only')
		.description('settings updateRemoteServersOnly')
		.requiredOption('--remoteServersOnly', 'remoteServersOnly')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["remoteServersOnly"] != null) opts["remoteServersOnly"] = opts["remoteServersOnly"] === true || opts["remoteServersOnly"] === "true";
			const data = await apiPost("settings.updateRemoteServersOnly", opts);
			render(data, { json: jsonOutput, endpoint: "settings.updateRemoteServersOnly", method: "post" });
		});

	g_settings
		.command('update-server')
		.description('settings updateServer')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateServer", opts);
			render(data, { json: jsonOutput, endpoint: "settings.updateServer", method: "post" });
		});

	g_settings
		.command('update-server-ip')
		.description('settings updateServerIp')
		.requiredOption('--serverIp <value>', 'serverIp')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateServerIp", opts);
			render(data, { json: jsonOutput, endpoint: "settings.updateServerIp", method: "post" });
		});

	g_settings
		.command('update-traefik-config')
		.description('settings updateTraefikConfig')
		.requiredOption('--traefikConfig <value>', 'traefikConfig')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateTraefikConfig", opts);
			render(data, { json: jsonOutput, endpoint: "settings.updateTraefikConfig", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "settings.updateTraefikFile", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "settings.updateTraefikPorts", method: "post" });
		});

	g_settings
		.command('update-web-server-traefik-config')
		.description('settings updateWebServerTraefikConfig')
		.requiredOption('--traefikConfig <value>', 'traefikConfig')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("settings.updateWebServerTraefikConfig", opts);
			render(data, { json: jsonOutput, endpoint: "settings.updateWebServerTraefikConfig", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "settings.writeTraefikEnv", method: "post" });
		});
	const g_sshKey = program.command('ssh-key').description('ssh-key commands');

	g_sshKey
		.command('all')
		.description('sshKey all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sshKey.all", opts);
			render(data, { json: jsonOutput, endpoint: "sshKey.all", method: "get" });
		});

	g_sshKey
		.command('all-for-apps')
		.description('sshKey allForApps')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sshKey.allForApps", opts);
			render(data, { json: jsonOutput, endpoint: "sshKey.allForApps", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "sshKey.create", method: "post" });
		});

	g_sshKey
		.command('generate')
		.description('sshKey generate')
		.option('--type <value>', 'type (rsa, ed25519)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("sshKey.generate", opts);
			render(data, { json: jsonOutput, endpoint: "sshKey.generate", method: "post" });
		});

	g_sshKey
		.command('one')
		.description('sshKey one')
		.requiredOption('--sshKeyId <value>', 'sshKeyId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sshKey.one", opts);
			render(data, { json: jsonOutput, endpoint: "sshKey.one", method: "get" });
		});

	g_sshKey
		.command('remove')
		.description('sshKey remove')
		.requiredOption('--sshKeyId <value>', 'sshKeyId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("sshKey.remove", opts);
			render(data, { json: jsonOutput, endpoint: "sshKey.remove", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "sshKey.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "sso.addTrustedOrigin", method: "post" });
		});

	g_sso
		.command('delete-provider')
		.description('sso deleteProvider')
		.requiredOption('--providerId <value>', 'providerId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("sso.deleteProvider", opts);
			render(data, { json: jsonOutput, endpoint: "sso.deleteProvider", method: "post" });
		});

	g_sso
		.command('enforce-sso')
		.description('sso enforceSSO')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sso.enforceSSO", opts);
			render(data, { json: jsonOutput, endpoint: "sso.enforceSSO", method: "get" });
		});

	g_sso
		.command('get-trusted-origins')
		.description('sso getTrustedOrigins')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sso.getTrustedOrigins", opts);
			render(data, { json: jsonOutput, endpoint: "sso.getTrustedOrigins", method: "get" });
		});

	g_sso
		.command('list-providers')
		.description('sso listProviders')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sso.listProviders", opts);
			render(data, { json: jsonOutput, endpoint: "sso.listProviders", method: "get" });
		});

	g_sso
		.command('one')
		.description('sso one')
		.requiredOption('--providerId <value>', 'providerId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sso.one", opts);
			render(data, { json: jsonOutput, endpoint: "sso.one", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "sso.register", method: "post" });
		});

	g_sso
		.command('remove-trusted-origin')
		.description('sso removeTrustedOrigin')
		.requiredOption('--origin <value>', 'origin')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("sso.removeTrustedOrigin", opts);
			render(data, { json: jsonOutput, endpoint: "sso.removeTrustedOrigin", method: "post" });
		});

	g_sso
		.command('show-sign-in-with-sso')
		.description('sso showSignInWithSSO')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("sso.showSignInWithSSO", opts);
			render(data, { json: jsonOutput, endpoint: "sso.showSignInWithSSO", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "sso.update", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "sso.updateTrustedOrigin", method: "post" });
		});
	const g_stripe = program.command('stripe').description('stripe commands');

	g_stripe
		.command('can-create-more-servers')
		.description('stripe canCreateMoreServers')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("stripe.canCreateMoreServers", opts);
			render(data, { json: jsonOutput, endpoint: "stripe.canCreateMoreServers", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "stripe.createCheckoutSession", method: "post" });
		});

	g_stripe
		.command('create-customer-portal-session')
		.description('stripe createCustomerPortalSession')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("stripe.createCustomerPortalSession", opts);
			render(data, { json: jsonOutput, endpoint: "stripe.createCustomerPortalSession", method: "post" });
		});

	g_stripe
		.command('get-billing-status')
		.description('stripe getBillingStatus')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("stripe.getBillingStatus", opts);
			render(data, { json: jsonOutput, endpoint: "stripe.getBillingStatus", method: "get" });
		});

	g_stripe
		.command('get-current-plan')
		.description('stripe getCurrentPlan')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("stripe.getCurrentPlan", opts);
			render(data, { json: jsonOutput, endpoint: "stripe.getCurrentPlan", method: "get" });
		});

	g_stripe
		.command('get-invoices')
		.description('stripe getInvoices')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("stripe.getInvoices", opts);
			render(data, { json: jsonOutput, endpoint: "stripe.getInvoices", method: "get" });
		});

	g_stripe
		.command('get-products')
		.description('stripe getProducts')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("stripe.getProducts", opts);
			render(data, { json: jsonOutput, endpoint: "stripe.getProducts", method: "get" });
		});

	g_stripe
		.command('start-free-trial')
		.description('stripe startFreeTrial')
		.requiredOption('--tier <value>', 'tier (hobby, startup)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("stripe.startFreeTrial", opts);
			render(data, { json: jsonOutput, endpoint: "stripe.startFreeTrial", method: "post" });
		});

	g_stripe
		.command('update-invoice-notifications')
		.description('stripe updateInvoiceNotifications')
		.requiredOption('--enabled', 'enabled')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
			if (opts["enabled"] != null) opts["enabled"] = opts["enabled"] === true || opts["enabled"] === "true";
			const data = await apiPost("stripe.updateInvoiceNotifications", opts);
			render(data, { json: jsonOutput, endpoint: "stripe.updateInvoiceNotifications", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "stripe.upgradeSubscription", method: "post" });
		});
	const g_swarm = program.command('swarm').description('swarm commands');

	g_swarm
		.command('get-container-stats')
		.description('swarm getContainerStats')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("swarm.getContainerStats", opts);
			render(data, { json: jsonOutput, endpoint: "swarm.getContainerStats", method: "get" });
		});

	g_swarm
		.command('get-node-apps')
		.description('swarm getNodeApps')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("swarm.getNodeApps", opts);
			render(data, { json: jsonOutput, endpoint: "swarm.getNodeApps", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "swarm.getNodeInfo", method: "get" });
		});

	g_swarm
		.command('get-nodes')
		.description('swarm getNodes')
		.option('--serverId <value>', 'serverId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("swarm.getNodes", opts);
			render(data, { json: jsonOutput, endpoint: "swarm.getNodes", method: "get" });
		});
	const g_tag = program.command('tag').description('tag commands');

	g_tag
		.command('all')
		.description('tag all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("tag.all", opts);
			render(data, { json: jsonOutput, endpoint: "tag.all", method: "get" });
		});

	g_tag
		.command('assign-to-project')
		.description('tag assignToProject')
		.requiredOption('--projectId <value>', 'projectId')
		.requiredOption('--tagId <value>', 'tagId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("tag.assignToProject", opts);
			render(data, { json: jsonOutput, endpoint: "tag.assignToProject", method: "post" });
		});

	g_tag
		.command('bulk-assign')
		.description('tag bulkAssign')
		.requiredOption('--projectId <value>', 'projectId')
		.requiredOption('--tagIds <value>', 'tagIds')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("tag.bulkAssign", opts);
			render(data, { json: jsonOutput, endpoint: "tag.bulkAssign", method: "post" });
		});

	g_tag
		.command('create')
		.description('tag create')
		.requiredOption('--name <value>', 'name')
		.option('--color <value>', 'color')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("tag.create", opts);
			render(data, { json: jsonOutput, endpoint: "tag.create", method: "post" });
		});

	g_tag
		.command('one')
		.description('tag one')
		.requiredOption('--tagId <value>', 'tagId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("tag.one", opts);
			render(data, { json: jsonOutput, endpoint: "tag.one", method: "get" });
		});

	g_tag
		.command('remove')
		.description('tag remove')
		.requiredOption('--tagId <value>', 'tagId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("tag.remove", opts);
			render(data, { json: jsonOutput, endpoint: "tag.remove", method: "post" });
		});

	g_tag
		.command('remove-from-project')
		.description('tag removeFromProject')
		.requiredOption('--projectId <value>', 'projectId')
		.requiredOption('--tagId <value>', 'tagId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("tag.removeFromProject", opts);
			render(data, { json: jsonOutput, endpoint: "tag.removeFromProject", method: "post" });
		});

	g_tag
		.command('update')
		.description('tag update')
		.requiredOption('--tagId <value>', 'tagId')
		.option('--name <value>', 'name')
		.option('--color <value>', 'color')
		.option('--createdAt <value>', 'createdAt')
		.option('--organizationId <value>', 'organizationId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("tag.update", opts);
			render(data, { json: jsonOutput, endpoint: "tag.update", method: "post" });
		});
	const g_user = program.command('user').description('user commands');

	g_user
		.command('all')
		.description('user all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.all", opts);
			render(data, { json: jsonOutput, endpoint: "user.all", method: "get" });
		});

	g_user
		.command('assign-permissions')
		.description('user assignPermissions')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--accessedProjects <value>', 'accessedProjects')
		.requiredOption('--accessedEnvironments <value>', 'accessedEnvironments')
		.requiredOption('--accessedServices <value>', 'accessedServices')
		.requiredOption('--accessedGitProviders <value>', 'accessedGitProviders')
		.requiredOption('--accessedServers <value>', 'accessedServers')
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
			render(data, { json: jsonOutput, endpoint: "user.assignPermissions", method: "post" });
		});

	g_user
		.command('check-user-organizations')
		.description('user checkUserOrganizations')
		.requiredOption('--userId <value>', 'userId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.checkUserOrganizations", opts);
			render(data, { json: jsonOutput, endpoint: "user.checkUserOrganizations", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "user.createApiKey", method: "post" });
		});

	g_user
		.command('create-user-with-credentials')
		.description('user createUserWithCredentials')
		.requiredOption('--email <value>', 'email')
		.requiredOption('--password <value>', 'password')
		.requiredOption('--role <value>', 'role')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("user.createUserWithCredentials", opts);
			render(data, { json: jsonOutput, endpoint: "user.createUserWithCredentials", method: "post" });
		});

	g_user
		.command('delete-api-key')
		.description('user deleteApiKey')
		.requiredOption('--apiKeyId <value>', 'apiKeyId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("user.deleteApiKey", opts);
			render(data, { json: jsonOutput, endpoint: "user.deleteApiKey", method: "post" });
		});

	g_user
		.command('generate-token')
		.description('user generateToken')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("user.generateToken", opts);
			render(data, { json: jsonOutput, endpoint: "user.generateToken", method: "post" });
		});

	g_user
		.command('get')
		.description('user get')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.get", opts);
			render(data, { json: jsonOutput, endpoint: "user.get", method: "get" });
		});

	g_user
		.command('get-backups')
		.description('user getBackups')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getBackups", opts);
			render(data, { json: jsonOutput, endpoint: "user.getBackups", method: "get" });
		});

	g_user
		.command('get-bookmarked-templates')
		.description('user getBookmarkedTemplates')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getBookmarkedTemplates", opts);
			render(data, { json: jsonOutput, endpoint: "user.getBookmarkedTemplates", method: "get" });
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
			render(data, { json: jsonOutput, endpoint: "user.getContainerMetrics", method: "get" });
		});

	g_user
		.command('get-invitations')
		.description('user getInvitations')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getInvitations", opts);
			render(data, { json: jsonOutput, endpoint: "user.getInvitations", method: "get" });
		});

	g_user
		.command('get-metrics-token')
		.description('user getMetricsToken')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getMetricsToken", opts);
			render(data, { json: jsonOutput, endpoint: "user.getMetricsToken", method: "get" });
		});

	g_user
		.command('get-permissions')
		.description('user getPermissions')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getPermissions", opts);
			render(data, { json: jsonOutput, endpoint: "user.getPermissions", method: "get" });
		});

	g_user
		.command('get-server-metrics')
		.description('user getServerMetrics')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getServerMetrics", opts);
			render(data, { json: jsonOutput, endpoint: "user.getServerMetrics", method: "get" });
		});

	g_user
		.command('get-user-by-token')
		.description('user getUserByToken')
		.requiredOption('--token <value>', 'token')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.getUserByToken", opts);
			render(data, { json: jsonOutput, endpoint: "user.getUserByToken", method: "get" });
		});

	g_user
		.command('have-root-access')
		.description('user haveRootAccess')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.haveRootAccess", opts);
			render(data, { json: jsonOutput, endpoint: "user.haveRootAccess", method: "get" });
		});

	g_user
		.command('list-passkeys')
		.description('user listPasskeys')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.listPasskeys", opts);
			render(data, { json: jsonOutput, endpoint: "user.listPasskeys", method: "get" });
		});

	g_user
		.command('list-sessions')
		.description('user listSessions')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.listSessions", opts);
			render(data, { json: jsonOutput, endpoint: "user.listSessions", method: "get" });
		});

	g_user
		.command('one')
		.description('user one')
		.requiredOption('--userId <value>', 'userId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.one", opts);
			render(data, { json: jsonOutput, endpoint: "user.one", method: "get" });
		});

	g_user
		.command('remove')
		.description('user remove')
		.requiredOption('--userId <value>', 'userId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("user.remove", opts);
			render(data, { json: jsonOutput, endpoint: "user.remove", method: "post" });
		});

	g_user
		.command('revoke-session')
		.description('user revokeSession')
		.requiredOption('--sessionId <value>', 'sessionId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("user.revokeSession", opts);
			render(data, { json: jsonOutput, endpoint: "user.revokeSession", method: "post" });
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
			render(data, { json: jsonOutput, endpoint: "user.sendInvitation", method: "post" });
		});

	g_user
		.command('session')
		.description('user session')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("user.session", opts);
			render(data, { json: jsonOutput, endpoint: "user.session", method: "get" });
		});

	g_user
		.command('toggle-template-bookmark')
		.description('user toggleTemplateBookmark')
		.requiredOption('--templateId <value>', 'templateId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("user.toggleTemplateBookmark", opts);
			render(data, { json: jsonOutput, endpoint: "user.toggleTemplateBookmark", method: "post" });
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
		.option('--sendInvoiceNotifications', 'sendInvoiceNotifications')
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
			if (opts["sendInvoiceNotifications"] != null) opts["sendInvoiceNotifications"] = opts["sendInvoiceNotifications"] === true || opts["sendInvoiceNotifications"] === "true";
			const data = await apiPost("user.update", opts);
			render(data, { json: jsonOutput, endpoint: "user.update", method: "post" });
		});
	const g_vaultProvider = program.command('vault-provider').description('vault-provider commands');

	g_vaultProvider
		.command('all')
		.description('vaultProvider all')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("vaultProvider.all", opts);
			render(data, { json: jsonOutput, endpoint: "vaultProvider.all", method: "get" });
		});

	g_vaultProvider
		.command('create')
		.description('vaultProvider create')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--config <value>', 'config')
		.requiredOption('--assignments <value>', 'assignments')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("vaultProvider.create", opts);
			render(data, { json: jsonOutput, endpoint: "vaultProvider.create", method: "post" });
		});

	g_vaultProvider
		.command('list-secret-names')
		.description('vaultProvider listSecretNames')
		.requiredOption('--vaultProviderId <value>', 'vaultProviderId')
		.requiredOption('--projectId <value>', 'projectId')
		.option('--environmentId <value>', 'environmentId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("vaultProvider.listSecretNames", opts);
			render(data, { json: jsonOutput, endpoint: "vaultProvider.listSecretNames", method: "get" });
		});

	g_vaultProvider
		.command('one')
		.description('vaultProvider one')
		.requiredOption('--vaultProviderId <value>', 'vaultProviderId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("vaultProvider.one", opts);
			render(data, { json: jsonOutput, endpoint: "vaultProvider.one", method: "get" });
		});

	g_vaultProvider
		.command('remove')
		.description('vaultProvider remove')
		.requiredOption('--vaultProviderId <value>', 'vaultProviderId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("vaultProvider.remove", opts);
			render(data, { json: jsonOutput, endpoint: "vaultProvider.remove", method: "post" });
		});

	g_vaultProvider
		.command('test-connection')
		.description('vaultProvider testConnection')
		.option('--vaultProviderId <value>', 'vaultProviderId')
		.option('--config <value>', 'config')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("vaultProvider.testConnection", opts);
			render(data, { json: jsonOutput, endpoint: "vaultProvider.testConnection", method: "post" });
		});

	g_vaultProvider
		.command('update')
		.description('vaultProvider update')
		.requiredOption('--vaultProviderId <value>', 'vaultProviderId')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--config <value>', 'config')
		.requiredOption('--assignments <value>', 'assignments')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("vaultProvider.update", opts);
			render(data, { json: jsonOutput, endpoint: "vaultProvider.update", method: "post" });
		});
	const g_volumeBackups = program.command('volume-backups').description('volume-backups commands');

	g_volumeBackups
		.command('create')
		.description('volumeBackups create')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--volumeName <value>', 'volumeName')
		.requiredOption('--prefix <value>', 'prefix')
		.option('--serviceType <value>', 'serviceType (application, postgres, mysql, mariadb, mongo, redis, compose, libsql)')
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
		.option('--libsqlId <value>', 'libsqlId')
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
			render(data, { json: jsonOutput, endpoint: "volumeBackups.create", method: "post" });
		});

	g_volumeBackups
		.command('delete')
		.description('volumeBackups delete')
		.requiredOption('--volumeBackupId <value>', 'volumeBackupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("volumeBackups.delete", opts);
			render(data, { json: jsonOutput, endpoint: "volumeBackups.delete", method: "post" });
		});

	g_volumeBackups
		.command('list')
		.description('volumeBackups list')
		.requiredOption('--id <value>', 'id')
		.requiredOption('--volumeBackupType <value>', 'volumeBackupType (application, postgres, mysql, mariadb, mongo, redis, compose, libsql)')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("volumeBackups.list", opts);
			render(data, { json: jsonOutput, endpoint: "volumeBackups.list", method: "get" });
		});

	g_volumeBackups
		.command('one')
		.description('volumeBackups one')
		.requiredOption('--volumeBackupId <value>', 'volumeBackupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("volumeBackups.one", opts);
			render(data, { json: jsonOutput, endpoint: "volumeBackups.one", method: "get" });
		});

	g_volumeBackups
		.command('run-manually')
		.description('volumeBackups runManually')
		.requiredOption('--volumeBackupId <value>', 'volumeBackupId')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("volumeBackups.runManually", opts);
			render(data, { json: jsonOutput, endpoint: "volumeBackups.runManually", method: "post" });
		});

	g_volumeBackups
		.command('update')
		.description('volumeBackups update')
		.requiredOption('--name <value>', 'name')
		.requiredOption('--volumeName <value>', 'volumeName')
		.requiredOption('--prefix <value>', 'prefix')
		.option('--serviceType <value>', 'serviceType (application, postgres, mysql, mariadb, mongo, redis, compose, libsql)')
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
		.option('--libsqlId <value>', 'libsqlId')
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
			render(data, { json: jsonOutput, endpoint: "volumeBackups.update", method: "post" });
		});
	const g_whitelabeling = program.command('whitelabeling').description('whitelabeling commands');

	g_whitelabeling
		.command('get')
		.description('whitelabeling get')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("whitelabeling.get", opts);
			render(data, { json: jsonOutput, endpoint: "whitelabeling.get", method: "get" });
		});

	g_whitelabeling
		.command('get-public')
		.description('whitelabeling getPublic')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiGet("whitelabeling.getPublic", opts);
			render(data, { json: jsonOutput, endpoint: "whitelabeling.getPublic", method: "get" });
		});

	g_whitelabeling
		.command('reset')
		.description('whitelabeling reset')
		
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("whitelabeling.reset", opts);
			render(data, { json: jsonOutput, endpoint: "whitelabeling.reset", method: "post" });
		});

	g_whitelabeling
		.command('update')
		.description('whitelabeling update')
		.requiredOption('--whitelabelingConfig <value>', 'whitelabelingConfig')
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;

			const data = await apiPost("whitelabeling.update", opts);
			render(data, { json: jsonOutput, endpoint: "whitelabeling.update", method: "post" });
		});
}
