import { createHash } from "node:crypto";
import chalk from "chalk";
import stringify from "safe-stable-stringify";
import { apiGet, apiPost } from "../../client.js";
import { errorMessage } from "./remote.js";
import { SERVICE_TYPES, type ServiceType } from "./resources.js";
import type { Action, ApplyResult, Plan } from "./types.js";

export const DEPLOY_MARKER = "dokploy-apply config ";
export const TRACKED_TYPES: ServiceType[] = ["application", "compose"];

const POLL_INTERVAL_MS = 5_000;
const DEPLOY_TIMEOUT_MS = 20 * 60_000;

export interface Deployment {
	deploymentId: string;
	status: string;
	description?: string | null;
	errorMessage?: string | null;
	createdAt: string;
}

export interface DeployTarget {
	key: string;
	type: ServiceType;
	name: string;
	environment: string;
	serviceId?: string;
	fingerprint: string;
	reason: string;
}

interface PlannedService {
	key: string;
	environment: string;
	action: Action;
}

export type History = (
	type: ServiceType,
	serviceId: string,
) => Promise<Deployment[]>;

const isService = (action: Action) =>
	SERVICE_TYPES.includes(action.resourceType as ServiceType);

export const hasChanges = (action: Action): boolean =>
	action.type !== "unchanged" || (action.children ?? []).some(hasChanges);

export const fingerprint = (service: Action): string =>
	createHash("sha256")
		.update(
			stringify({
				config: service.config,
				children: (service.children ?? [])
					.filter((child) => child.type !== "delete")
					.map((child) => ({ type: child.resourceType, config: child.config })),
			}) ?? "",
		)
		.digest("hex")
		.slice(0, 12);

export const plannedServices = (plan: Plan): PlannedService[] =>
	plan.projects.flatMap(({ project, environments }) =>
		environments.flatMap((environment) =>
			(environment.children ?? [])
				.filter((action) => isService(action) && action.type !== "delete")
				.map((action) => ({
					key: `${project.name}/${environment.name}/${action.resourceType}/${action.name}`,
					environment: environment.name,
					action,
				})),
		),
	);

export const changedKeys = (plan: Plan): Set<string> =>
	new Set(
		plannedServices(plan)
			.filter(({ action }) => hasChanges(action))
			.map(({ key }) => key),
	);

export const landedKeys = (before: Plan, after: Plan): Set<string> => {
	const pending = changedKeys(after);
	return new Set([...changedKeys(before)].filter((key) => !pending.has(key)));
};

const newest = (deployments: Deployment[]) =>
	[...deployments].sort(
		(a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
	);

export const fetchHistory: History = async (type, serviceId) =>
	(await apiGet("deployment.allByType", { id: serviceId, type })) ?? [];

async function reasonToDeploy(
	{ action }: PlannedService,
	changed: boolean,
	history: History,
): Promise<string | undefined> {
	if (changed) return "configuration changed";
	const type = action.resourceType as ServiceType;
	if (!TRACKED_TYPES.includes(type) || !action.remoteId) return undefined;
	const last = newest(await history(type, action.remoteId)).find((deployment) =>
		deployment.description?.startsWith(DEPLOY_MARKER),
	);
	if (last?.status === "error") return "last deploy failed";
	if (
		last?.status === "done" &&
		last.description !== `${DEPLOY_MARKER}${fingerprint(action)}`
	) {
		return "configuration differs from the last deploy";
	}
	return undefined;
}

export async function deployTargets(
	plan: Plan,
	changed: Set<string>,
	history: History = fetchHistory,
): Promise<DeployTarget[]> {
	const services = plannedServices(plan);
	const reasons = await Promise.all(
		services.map((service) =>
			reasonToDeploy(service, changed.has(service.key), history),
		),
	);
	return services.flatMap((service, index) => {
		const reason = reasons[index];
		return reason
			? [
					{
						key: service.key,
						type: service.action.resourceType as ServiceType,
						name: service.action.name,
						environment: service.environment,
						serviceId: service.action.remoteId,
						fingerprint: fingerprint(service.action),
						reason,
					},
				]
			: [];
	});
}

export const formatTargets = (targets: DeployTarget[]): string =>
	targets.length === 0
		? chalk.gray("\nNothing to deploy.")
		: [
				"\nDeploy",
				...targets.map(
					(target) =>
						`  ${target.type} "${target.name}" in ${target.environment}`.padEnd(
							50,
						) + chalk.cyan(`(${target.reason})`),
				),
			].join("\n");

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function awaitDeployment(
	target: DeployTarget,
	known: Set<string>,
	history: History,
	deadline: number,
): Promise<void> {
	while (Date.now() < deadline) {
		const deployment = newest(
			await history(target.type, target.serviceId!),
		).find(
			(candidate) =>
				!known.has(candidate.deploymentId) &&
				candidate.description === `${DEPLOY_MARKER}${target.fingerprint}`,
		);
		if (deployment?.status === "done") return;
		if (deployment?.status === "error") {
			throw new Error(deployment.errorMessage || "deployment failed");
		}
		await sleep(POLL_INTERVAL_MS);
	}
	throw new Error(
		`still deploying after ${DEPLOY_TIMEOUT_MS / 60_000} minutes`,
	);
}

async function deployOne(
	target: DeployTarget,
	title: string,
	history: History,
): Promise<void> {
	const idField = `${target.type}Id`;
	if (!TRACKED_TYPES.includes(target.type)) {
		await apiPost(`${target.type}.deploy`, { [idField]: target.serviceId });
		return;
	}
	const known = new Set(
		(await history(target.type, target.serviceId!)).map(
			(deployment) => deployment.deploymentId,
		),
	);
	await apiPost(`${target.type}.deploy`, {
		[idField]: target.serviceId,
		title,
		description: `${DEPLOY_MARKER}${target.fingerprint}`,
	});
	await awaitDeployment(target, known, history, Date.now() + DEPLOY_TIMEOUT_MS);
}

export async function deployAll(
	targets: DeployTarget[],
	title: string,
	history: History = fetchHistory,
): Promise<ApplyResult> {
	const outcomes = await Promise.all(
		targets.map(async (target) => {
			const label = `${target.type} "${target.name}" in ${target.environment}`;
			try {
				await deployOne(target, title, history);
				console.log(chalk.green(`Deployed ${label}`));
				return { label };
			} catch (error) {
				console.log(chalk.red(`Deploy failed for ${label}`));
				return { label, error: errorMessage(error) };
			}
		}),
	);
	const errors = outcomes.flatMap(({ label, error }) =>
		error ? [{ resource: `deploy ${label}`, error }] : [],
	);
	return {
		created: 0,
		updated: 0,
		deleted: 0,
		unchanged: 0,
		failed: errors.length,
		errors,
	};
}
