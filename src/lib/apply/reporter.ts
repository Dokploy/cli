import chalk from "chalk";
import { SECRET_FIELDS } from "./resources.js";
import type { Action, ApplyPlan, ApplyResult } from "./types.js";

const STATUS_COLORS: Record<Action["type"], (text: string) => string> = {
	create: chalk.green,
	update: chalk.yellow,
	unchanged: chalk.gray,
};

const capitalize = (text: string) =>
	text.charAt(0).toUpperCase() + text.slice(1);

export const actionLabel = (action: Action) =>
	`${capitalize(action.resourceType)} "${action.name}"`;

export function formatAction(action: Action, depth: number): string {
	const line = `${"  ".repeat(depth)}${actionLabel(action)}`.padEnd(50);
	const status = STATUS_COLORS[action.type](`[${action.type}]`);
	return action.type === "unchanged"
		? `${line}${status}${chalk.gray(" (no changes)")}`
		: `${line}${status}`;
}

export function formatChanges(action: Action, depth: number): string[] {
	const indent = "  ".repeat(depth + 1);
	return Object.entries(action.changes ?? {}).map(([key, { from, to }]) =>
		SECRET_FIELDS.includes(key)
			? `${indent}${chalk.gray(key)}: ${chalk.yellow("(changed)")}`
			: `${indent}${chalk.gray(key)}: ${chalk.red(JSON.stringify(from))} → ${chalk.green(JSON.stringify(to))}`,
	);
}

const formatTree = (
	action: Action,
	depth: number,
	verbose: boolean,
): string[] => [
	formatAction(action, depth),
	...(verbose ? formatChanges(action, depth) : []),
	...(action.children ?? []).flatMap((child) =>
		formatTree(child, depth + 1, verbose),
	),
];

export const formatPlan = (plan: ApplyPlan, verbose: boolean): string =>
	[
		"",
		...formatTree(plan.project, 0, verbose),
		...plan.environments.flatMap((environment) =>
			formatTree(environment, 1, verbose),
		),
	].join("\n");

export function formatSummary(result: ApplyResult): string {
	const parts = [
		result.created > 0 && chalk.green(`${result.created} created`),
		result.updated > 0 && chalk.yellow(`${result.updated} updated`),
		result.unchanged > 0 && chalk.gray(`${result.unchanged} unchanged`),
		result.failed > 0 && chalk.red(`${result.failed} failed`),
	].filter(Boolean);
	return `\nSummary: ${parts.join(", ")}`;
}

export const formatErrors = (result: ApplyResult): string =>
	chalk.red(
		[
			"\nErrors:",
			...result.errors.map(({ resource, error }) => `  ${resource}: ${error}`),
		].join("\n"),
	);
