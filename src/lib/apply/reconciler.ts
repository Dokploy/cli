import chalk from "chalk";
import { apiGet, readAuthConfig } from "../../client.js";
import { diffChildren, diffResource } from "./differ.js";
import { executePlan } from "./executor.js";
import { parseConfigFile } from "./parser.js";
import {
	fetchService,
	findByName,
	type Lookups,
	loadLookups,
} from "./remote.js";
import { formatErrors, formatPlan, formatSummary } from "./reporter.js";
import {
	type Fields,
	omit,
	pick,
	requiredOnCreate,
	SERVICE_TYPES,
	SERVICES,
	type ServiceType,
} from "./resources.js";
import type { DokployConfig, EnvironmentConfig } from "./schema.js";
import type { Action, ApplyPlan, ApplyResult } from "./types.js";

export interface ReconcileOptions {
	filePath: string;
	dryRun: boolean;
	verbose: boolean;
}

export async function reconcile({
	filePath,
	dryRun,
	verbose,
}: ReconcileOptions): Promise<ApplyResult> {
	const config = await parseConfigFile(filePath);
	console.log(chalk.blue(`Applying ${filePath} to ${readAuthConfig().url}`));

	const plan = await buildPlan(config);
	console.log(formatPlan(plan, verbose));

	if (dryRun) {
		console.log(chalk.cyan("\n(dry-run) No changes applied."));
		return countPlan(plan);
	}

	const result = await executePlan(plan);
	console.log(formatSummary(result));
	if (result.errors.length > 0) {
		console.log(formatErrors(result));
	}
	return result;
}

const servicesOf = (
	environment: EnvironmentConfig,
): Array<{ type: ServiceType; config: Fields }> =>
	SERVICE_TYPES.flatMap((type) =>
		((environment as Fields)[SERVICES[type].section] ?? []).map(
			(config: Fields) => ({ type, config }),
		),
	);

const resolveNames = (config: Fields, lookups: Lookups): Fields => {
	const { serverName, gitProvider, ...fields } = config;
	return {
		...fields,
		...(serverName ? { serverId: lookups.serverId(serverName) } : {}),
		...(gitProvider ? lookups.gitProviderFields(gitProvider) : {}),
	};
};

async function planService(
	type: ServiceType,
	config: Fields,
	remoteSummary: Fields | undefined,
): Promise<Action> {
	const spec = SERVICES[type];
	const remote = remoteSummary
		? await fetchService(type, remoteSummary[`${type}Id`])
		: undefined;
	const action = diffResource(
		type,
		config.name,
		omit(config, spec.children),
		remote,
		[...spec.createOnly, "serverId"],
	);
	const children = spec.children.flatMap((key) =>
		config[key]
			? diffChildren(key, type, config[key], remote?.[key] ?? [])
			: [],
	);
	return { ...action, children };
}

async function planEnvironment(
	environment: EnvironmentConfig,
	remoteEnvironments: Fields[],
	lookups: Lookups,
): Promise<Action> {
	const remote = findByName(
		remoteEnvironments,
		environment.name,
		"environment",
	);
	const action = diffResource(
		"environment",
		environment.name,
		pick(environment, ["name", "description"]),
		remote,
	);
	const children = await Promise.all(
		servicesOf(environment).map(({ type, config }) =>
			planService(
				type,
				resolveNames(config, lookups),
				remote
					? findByName(remote[SERVICES[type].section] ?? [], config.name, type)
					: undefined,
			),
		),
	);
	return { ...action, children };
}

const missingOnCreate = (action: Action): string[] => {
	const missing =
		action.type === "create"
			? requiredOnCreate(action.resourceType).filter(
					(field) => action.config[field] === undefined,
				)
			: [];
	return [
		...(missing.length > 0
			? [
					`${action.resourceType} "${action.name}" needs ${missing.join(", ")} to be created`,
				]
			: []),
		...(action.children ?? []).flatMap(missingOnCreate),
	];
};

export async function buildPlan(config: DokployConfig): Promise<ApplyPlan> {
	const lookups = await loadLookups(
		config.environments.flatMap(servicesOf).map(({ config }) => config),
	);
	const projectSummary = findByName(
		await apiGet("project.all"),
		config.name,
		"project",
	);
	const remoteProject = projectSummary
		? await apiGet("project.one", { projectId: projectSummary.projectId })
		: undefined;
	const project = diffResource(
		"project",
		config.name,
		pick(config, ["name", "description"]),
		remoteProject,
	);
	const environments = await Promise.all(
		config.environments.map((environment) =>
			planEnvironment(environment, remoteProject?.environments ?? [], lookups),
		),
	);

	const missing = environments.flatMap(missingOnCreate);
	if (missing.length > 0) {
		throw new Error(`Cannot apply:\n  ${missing.join("\n  ")}`);
	}
	return { project, environments };
}

const flatten = (action: Action): Action[] => [
	action,
	...(action.children ?? []).flatMap(flatten),
];

export function countPlan(plan: ApplyPlan): ApplyResult {
	const actions = [plan.project, ...plan.environments.flatMap(flatten)];
	const count = (type: Action["type"]) =>
		actions.filter((action) => action.type === type).length;
	return {
		created: count("create"),
		updated: count("update"),
		unchanged: count("unchanged"),
		failed: 0,
		errors: [],
	};
}
