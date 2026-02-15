import chalk from "chalk";

import { EPHEMERAL_FIELDS } from "./constants.js";
import { isRedacted } from "./redact.js";
import type { SyncState } from "./types.js";

export type ChangeType = "added" | "removed" | "modified";

export type Change = {
	type: ChangeType;
	path: string;
	resourceType: string;
	resourceId: string;
	fields?: FieldChange[];
};

export type FieldChange = {
	field: string;
	local: unknown;
	remote: unknown;
};

function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (a === null || b === null) return false;
	if (typeof a !== typeof b) return false;
	if (typeof a !== "object") return false;

	if (Array.isArray(a)) {
		if (!Array.isArray(b)) return false;
		if (a.length !== b.length) return false;
		return a.every((item, i) => deepEqual(item, b[i]));
	}

	const aObj = a as Record<string, unknown>;
	const bObj = b as Record<string, unknown>;
	const keys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);

	for (const key of keys) {
		if (EPHEMERAL_FIELDS.has(key)) continue;
		if (!deepEqual(aObj[key], bObj[key])) return false;
	}
	return true;
}

function diffFields(
	local: Record<string, unknown>,
	remote: Record<string, unknown>,
): FieldChange[] {
	const changes: FieldChange[] = [];
	const keys = new Set([...Object.keys(local), ...Object.keys(remote)]);

	for (const key of keys) {
		if (EPHEMERAL_FIELDS.has(key)) continue;
		if (isRedacted(local[key])) continue;

		const localVal = local[key];
		const remoteVal = remote[key];

		if (!deepEqual(localVal, remoteVal)) {
			changes.push({ field: key, local: localVal, remote: remoteVal });
		}
	}
	return changes;
}

type ResourceEntry = {
	id: string;
	idField: string;
	type: string;
	path: string;
	data: Record<string, unknown>;
};

function flattenState(state: SyncState): Map<string, ResourceEntry> {
	const map = new Map<string, ResourceEntry>();

	for (const project of state.projects) {
		for (const env of project.environments) {
			const basePath = `${project.name}/${env.name}`;

			for (const app of env.applications) {
				const key = `application:${app.applicationId}`;
				map.set(key, {
					id: app.applicationId,
					idField: "applicationId",
					type: "application",
					path: `${basePath}/applications/${app.name}`,
					data: app as unknown as Record<string, unknown>,
				});
			}

			for (const comp of env.compose) {
				const key = `compose:${comp.composeId}`;
				map.set(key, {
					id: comp.composeId,
					idField: "composeId",
					type: "compose",
					path: `${basePath}/compose/${comp.name}`,
					data: comp as unknown as Record<string, unknown>,
				});
			}

			for (const db of env.databases) {
				const idField =
					db.type === "postgres"
						? "postgresId"
						: db.type === "mysql"
							? "mysqlId"
							: db.type === "mariadb"
								? "mariadbId"
								: db.type === "mongo"
									? "mongoId"
									: "redisId";
				const id = (db as unknown as Record<string, unknown>)[
					idField
				] as string;
				const key = `${db.type}:${id}`;
				map.set(key, {
					id,
					idField,
					type: db.type,
					path: `${basePath}/databases/${db.name}`,
					data: db as unknown as Record<string, unknown>,
				});
			}
		}
	}

	return map;
}

export function computeDiff(local: SyncState, remote: SyncState): Change[] {
	const localMap = flattenState(local);
	const remoteMap = flattenState(remote);
	const changes: Change[] = [];

	for (const [key, localEntry] of localMap) {
		const remoteEntry = remoteMap.get(key);
		if (!remoteEntry) {
			changes.push({
				type: "added",
				path: localEntry.path,
				resourceType: localEntry.type,
				resourceId: localEntry.id,
			});
			continue;
		}

		const fieldChanges = diffFields(localEntry.data, remoteEntry.data);
		if (fieldChanges.length > 0) {
			changes.push({
				type: "modified",
				path: localEntry.path,
				resourceType: localEntry.type,
				resourceId: localEntry.id,
				fields: fieldChanges,
			});
		}
	}

	for (const [key, remoteEntry] of remoteMap) {
		if (!localMap.has(key)) {
			changes.push({
				type: "removed",
				path: remoteEntry.path,
				resourceType: remoteEntry.type,
				resourceId: remoteEntry.id,
			});
		}
	}

	return changes;
}

function truncate(value: unknown, maxLen = 80): string {
	const str =
		typeof value === "string" ? value : JSON.stringify(value) ?? "undefined";
	if (str.length <= maxLen) return str;
	return `${str.slice(0, maxLen)}...`;
}

export function formatDiff(changes: Change[]): string {
	if (changes.length === 0) {
		return chalk.green("No differences found. Local state matches remote.");
	}

	const lines: string[] = [
		chalk.bold(`${changes.length} difference(s) found:\n`),
	];

	for (const change of changes) {
		if (change.type === "added") {
			lines.push(
				chalk.green(`+ [${change.resourceType}] ${change.path}`),
			);
			lines.push(
				chalk.green("  (exists locally but not on remote - push will skip)"),
			);
		} else if (change.type === "removed") {
			lines.push(
				chalk.red(`- [${change.resourceType}] ${change.path}`),
			);
			lines.push(
				chalk.red("  (exists on remote but not locally - push will skip)"),
			);
		} else if (change.type === "modified" && change.fields) {
			lines.push(
				chalk.yellow(`~ [${change.resourceType}] ${change.path}`),
			);
			for (const field of change.fields) {
				lines.push(
					chalk.red(`  - ${field.field}: ${truncate(field.remote)}`),
				);
				lines.push(
					chalk.green(`  + ${field.field}: ${truncate(field.local)}`),
				);
			}
		}

		lines.push("");
	}

	return lines.join("\n");
}
