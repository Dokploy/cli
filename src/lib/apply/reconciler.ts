import chalk from "chalk";
import { apiGet, readAuthConfig } from "../../client.js";
import {
	deletion,
	diffChildren,
	diffResource,
	pruneChildren,
} from "./differ.js";
import { combineResults, executePlan } from "./executor.js";
import { executeOrganization, planOrganization } from "./organization.js";
import { parseConfigFile } from "./parser.js";
import {
	fetchService,
	findByName,
	type Lookups,
	loadLookups,
} from "./remote.js";
import { formatErrors, formatPlan, formatSummary } from "./reporter.js";
import {
	type ChildKey,
	type Fields,
	isAutoCreatedMount,
	omit,
	pick,
	requiredOnCreate,
	SCOPE_FIELDS,
	SERVICE_TYPES,
	SERVICES,
	type ServiceType,
	sequence,
} from "./resources.js";
import type {
	DokployDocument,
	EnvironmentConfig,
	OrganizationConfig,
	ProjectConfig,
} from "./schema.js";
import type { Action, ApplyResult, Plan, ProjectPlan } from "./types.js";

export interface ReconcileOptions {
	filePath: string;
	dryRun: boolean;
	verbose: boolean;
	prune: boolean;
}

export interface PlanOptions {
	prune: boolean;
	declaredServers: string[];
}

export async function reconcile({
	filePath,
	dryRun,
	verbose,
	prune,
}: ReconcileOptions): Promise<ApplyResult> {
	const documents = await parseConfigFile(filePath);
	console.log(chalk.blue(`Applying ${filePath} to ${readAuthConfig().url}`));

	const plan = await buildFilePlan(documents, prune);
	console.log(formatPlan(plan, verbose));

	if (dryRun) {
		console.log(chalk.cyan("\n(dry-run) No changes applied."));
		return countPlan(plan);
	}

	const result = await executeFilePlan(plan);
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

const remoteServices = (environment: Fields): Action[] =>
	SERVICE_TYPES.flatMap((type) =>
		(environment[SERVICES[type].section] ?? []).map((service: Fields) =>
			deletion(type, service.name, service),
		),
	);

const resolveNames = (config: Fields, lookups: Lookups): Fields => {
	const { gitProvider, ...fields } = config;
	return {
		...fields,
		...(fields.serverName
			? { serverId: lookups.serverId(fields.serverName) }
			: {}),
		...(gitProvider ? lookups.gitProviderFields(gitProvider) : {}),
	};
};

const childActions = (
	key: ChildKey,
	type: ServiceType,
	local: Fields[] | undefined,
	remote: Fields | undefined,
	prune: boolean,
): Action[] => [
	...(local ? diffChildren(key, type, local, remote?.[key] ?? []) : []),
	...(prune && remote
		? pruneChildren(key, type, local ?? [], remote[key] ?? [], (item) =>
				isAutoCreatedMount(type, item, remote),
			)
		: []),
];

async function planService(
	type: ServiceType,
	config: Fields,
	remoteSummary: Fields | undefined,
	prune: boolean,
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
		[...spec.createOnly, "serverId", "serverName"],
	);
	const children = spec.children.flatMap((key) =>
		childActions(key, type, config[key], remote, prune),
	);
	return { ...action, children };
}

async function planEnvironment(
	environment: EnvironmentConfig,
	remoteEnvironments: Fields[],
	lookups: Lookups,
	prune: boolean,
): Promise<Action> {
	const remote = findByName(
		remoteEnvironments,
		environment.name,
		"environment",
	);
	const action = diffResource(
		"environment",
		environment.name,
		pick(environment, SCOPE_FIELDS),
		remote,
	);
	const declared = servicesOf(environment);
	const services = await Promise.all(
		declared.map(({ type, config }) =>
			planService(
				type,
				resolveNames(config, lookups),
				remote
					? findByName(remote[SERVICES[type].section] ?? [], config.name, type)
					: undefined,
				prune,
			),
		),
	);
	const pruned =
		prune && remote
			? remoteServices(remote).filter(
					(service) =>
						!declared.some(
							({ type, config }) =>
								type === service.resourceType && config.name === service.name,
						),
				)
			: [];
	return { ...action, children: [...services, ...pruned] };
}

const prunedEnvironments = (
	config: ProjectConfig,
	remoteEnvironments: Fields[],
): Action[] =>
	remoteEnvironments
		.filter(
			(remote) =>
				!config.environments.some(
					(environment) => environment.name === remote.name,
				),
		)
		.map((remote) => ({
			...(remote.isDefault
				? diffResource("environment", remote.name, {}, remote)
				: deletion("environment", remote.name, remote)),
			children: remoteServices(remote),
		}));

const missingOnCreate = (action: Action): string[] => {
	const missing =
		action.type === "create"
			? requiredOnCreate(action.resourceType).filter(
					(field) => action.config[field] === undefined,
				)
			: [];
	return missing.length > 0
		? [
				`${action.resourceType} "${action.name}" needs ${missing.join(", ")} to be created`,
			]
		: [];
};

const movedServer = (action: Action): string[] =>
	action.type !== "create" &&
	action.config.serverName !== undefined &&
	action.config.serverId !== action.remote?.serverId
		? [
				`${action.resourceType} "${action.name}" runs on a different server; serverName only applies when creating it`,
			]
		: [];

const planErrors = (action: Action): string[] => [
	...missingOnCreate(action),
	...movedServer(action),
	...(action.children ?? []).flatMap(planErrors),
];

export async function buildPlan(
	config: ProjectConfig,
	{ prune, declaredServers }: PlanOptions,
): Promise<ProjectPlan> {
	const lookups = await loadLookups(
		config.environments.flatMap(servicesOf).map(({ config }) => config),
		declaredServers,
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
		pick(config, SCOPE_FIELDS),
		remoteProject,
	);
	const remoteEnvironments: Fields[] = remoteProject?.environments ?? [];
	const environments = [
		...(await Promise.all(
			config.environments.map((environment) =>
				planEnvironment(environment, remoteEnvironments, lookups, prune),
			),
		)),
		...(prune ? prunedEnvironments(config, remoteEnvironments) : []),
	];

	const errors = environments.flatMap(planErrors);
	if (errors.length > 0) {
		throw new Error(`Cannot apply:\n  ${errors.join("\n  ")}`);
	}
	return { project, environments };
}

const isOrganization = (
	document: DokployDocument,
): document is OrganizationConfig => document.kind === "Organization";

const isProject = (document: DokployDocument): document is ProjectConfig =>
	document.kind === "Project";

export async function buildFilePlan(
	documents: DokployDocument[],
	prune: boolean,
): Promise<Plan> {
	const organization = documents.find(isOrganization);
	const projects = documents.filter(isProject);
	return {
		organization: organization
			? await planOrganization(
					organization,
					projects.map((project) => project.name),
				)
			: [],
		projects: await sequence(projects, (project) =>
			buildPlan(project, {
				prune,
				declaredServers: (organization?.servers ?? []).map(
					(server) => server.name,
				),
			}),
		),
	};
}

export async function executeFilePlan(plan: Plan): Promise<ApplyResult> {
	const before = await executeOrganization(plan.organization, "before");
	const projects = await sequence(plan.projects, executePlan);
	const after = await executeOrganization(plan.organization, "after");
	return combineResults([before, ...projects, after]);
}

const flatten = (action: Action): Action[] => [
	action,
	...(action.children ?? []).flatMap(flatten),
];

export function countPlan(plan: Plan): ApplyResult {
	const actions = [
		...plan.organization,
		...plan.projects.flatMap((project) => [
			project.project,
			...project.environments.flatMap(flatten),
		]),
	];
	const count = (type: Action["type"]) =>
		actions.filter((action) => action.type === type).length;
	return {
		created: count("create"),
		updated: count("update"),
		deleted: count("delete"),
		unchanged: count("unchanged"),
		failed: 0,
		errors: [],
	};
}
