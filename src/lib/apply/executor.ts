import { apiGet, apiPost } from "../../client.js";
import { changedValues, diffChildren, diffResource } from "./differ.js";
import { errorMessage, fetchService, requireByName } from "./remote.js";
import { actionLabel } from "./reporter.js";
import {
	CHILDREN,
	childKeyOf,
	type Fields,
	omit,
	pick,
	SERVICES,
	type ServiceType,
	sequence,
} from "./resources.js";
import type { Action, ApplyResult, ProjectPlan } from "./types.js";

export interface Outcome {
	action: Action;
	label: string;
	error?: string;
}

interface Attempt<T> {
	outcome: Outcome;
	value?: T;
}

export async function attempt<T>(
	action: Action,
	label: string,
	task: () => Promise<T>,
): Promise<Attempt<T>> {
	try {
		return { outcome: { action, label }, value: await task() };
	} catch (error) {
		return {
			outcome: {
				action,
				label,
				error: errorMessage(error),
			},
		};
	}
}

async function executeProject(action: Action): Promise<string> {
	if (action.type === "create") {
		const created = await apiPost("project.create", action.config);
		return created.project.projectId;
	}
	if (action.type === "update") {
		await apiPost("project.update", {
			projectId: action.remoteId,
			...changedValues(action),
		});
	}
	return action.remoteId!;
}

async function executeEnvironment(
	action: Action,
	projectId: string,
): Promise<string> {
	if (action.type === "create") {
		const existing: Fields[] = await apiGet("environment.byProjectId", {
			projectId,
		});
		const remote: Fields =
			existing.find((environment) => environment.name === action.name) ??
			(await apiPost("environment.create", {
				...pick(action.config, ["name", "description"]),
				projectId,
			}));
		const pending = changedValues(
			diffResource(
				"environment",
				action.name,
				omit(action.config, ["name"]),
				remote,
			),
		);
		if (Object.keys(pending).length > 0) {
			await apiPost("environment.update", {
				environmentId: remote.environmentId,
				...pending,
			});
		}
		return remote.environmentId;
	}
	if (action.type === "update") {
		await apiPost("environment.update", {
			environmentId: action.remoteId,
			...changedValues(action),
		});
	}
	return action.remoteId!;
}

const rediffAgainst =
	(parentType: ServiceType, remote: Fields) =>
	(child: Action): Action => {
		const key = childKeyOf(child.resourceType);
		return diffChildren(key, parentType, [child.config], remote[key] ?? [])[0];
	};

const serverField = async (config: Fields): Promise<Fields> =>
	config.serverName
		? {
				serverId: requireByName(
					await apiGet("server.all"),
					config.serverName,
					"Server",
				).serverId,
			}
		: {};

async function executeService(
	action: Action,
	environmentId: string,
): Promise<{ serviceId: string; children: Action[] }> {
	const type = action.resourceType as ServiceType;
	const spec = SERVICES[type];
	const idField = `${type}Id`;

	if (action.type === "delete") {
		await apiPost(spec.remove, {
			[idField]: action.remoteId,
			...spec.removeParams,
		});
		return { serviceId: action.remoteId!, children: [] };
	}

	if (action.type === "create") {
		const created = await apiPost(`${type}.create`, {
			...pick(action.config, spec.createFields),
			...(await serverField(action.config)),
			environmentId,
		});
		const serviceId: string = created[idField];
		const rest = omit(action.config, [
			...spec.createFields,
			...spec.createOnly,
			"serverId",
			"serverName",
		]);
		if (Object.keys(rest).length > 0) {
			await apiPost(`${type}.update`, { [idField]: serviceId, ...rest });
		}
		const remote = await fetchService(type, serviceId);
		return {
			serviceId,
			children: (action.children ?? []).map(rediffAgainst(type, remote)),
		};
	}

	if (action.type === "update") {
		await apiPost(`${type}.update`, {
			[idField]: action.remoteId,
			...changedValues(action),
		});
	}
	return { serviceId: action.remoteId!, children: action.children ?? [] };
}

async function executeChild(
	action: Action,
	parentType: ServiceType,
	parentId: string,
): Promise<void> {
	const spec = CHILDREN[childKeyOf(action.resourceType)];
	if (action.type === "delete") {
		await apiPost(spec.remove, {
			[`${spec.resourceType}Id`]: action.remoteId,
		});
	}
	if (action.type === "create") {
		await apiPost(`${spec.endpoint}.create`, {
			...spec.createDefaults,
			...action.config,
			...spec.parent(parentType, parentId),
		});
	}
	if (action.type === "update") {
		await apiPost(`${spec.endpoint}.update`, {
			...pick(action.remote ?? {}, spec.updateRequires),
			...changedValues(action),
			[`${spec.resourceType}Id`]: action.remoteId,
		});
	}
}

async function executeServiceTree(
	action: Action,
	environmentId: string,
): Promise<Outcome[]> {
	const service = await attempt(action, actionLabel(action), () =>
		executeService(action, environmentId),
	);
	if (!service.value) return [service.outcome];

	const { serviceId, children } = service.value;
	const childAttempts = await sequence(children, (child) =>
		attempt(child, `${actionLabel(child)} on ${action.name}`, () =>
			executeChild(child, action.resourceType as ServiceType, serviceId),
		),
	);
	return [service.outcome, ...childAttempts.map(({ outcome }) => outcome)];
}

async function executeEnvironmentTree(
	action: Action,
	projectId: string,
): Promise<Outcome[]> {
	if (action.type === "delete") {
		const services = await sequence(action.children ?? [], (service) =>
			executeServiceTree(service, action.remoteId!),
		);
		const environment = await attempt(action, actionLabel(action), () =>
			apiPost("environment.remove", { environmentId: action.remoteId }),
		);
		return [...services.flat(), environment.outcome];
	}

	const environment = await attempt(action, actionLabel(action), () =>
		executeEnvironment(action, projectId),
	);
	if (!environment.value) return [environment.outcome];

	const services = await sequence(action.children ?? [], (service) =>
		executeServiceTree(service, environment.value!),
	);
	return [environment.outcome, ...services.flat()];
}

export const summarize = (outcomes: Outcome[]): ApplyResult => {
	const succeeded = outcomes.filter((outcome) => !outcome.error);
	const count = (type: Action["type"]) =>
		succeeded.filter((outcome) => outcome.action.type === type).length;
	return {
		created: count("create"),
		updated: count("update"),
		deleted: count("delete"),
		unchanged: count("unchanged"),
		failed: outcomes.length - succeeded.length,
		errors: outcomes
			.filter((outcome) => outcome.error)
			.map((outcome) => ({ resource: outcome.label, error: outcome.error! })),
	};
};

export const combineResults = (results: ApplyResult[]): ApplyResult => {
	const total = (key: Exclude<keyof ApplyResult, "errors">) =>
		results.reduce((sum, result) => sum + result[key], 0);
	return {
		created: total("created"),
		updated: total("updated"),
		deleted: total("deleted"),
		unchanged: total("unchanged"),
		failed: total("failed"),
		errors: results.flatMap((result) => result.errors),
	};
};

export async function executePlan(plan: ProjectPlan): Promise<ApplyResult> {
	const project = await attempt(plan.project, actionLabel(plan.project), () =>
		executeProject(plan.project),
	);
	const environments = project.value
		? await sequence(plan.environments, (environment) =>
				executeEnvironmentTree(environment, project.value!),
			)
		: [];
	return summarize([project.outcome, ...environments.flat()]);
}
