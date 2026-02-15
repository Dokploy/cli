import type { Command } from "@oclif/core";

import axios from "axios";
import chalk from "chalk";

import type { AuthConfig } from "../utils.js";
import { DB_ID_FIELD, type DbType } from "./constants.js";
import type { Change, FieldChange } from "./diff.js";
import { isRedacted } from "./redact.js";

export type UpdateAction = {
	type: "update";
	resourceType: string;
	resourceId: string;
	path: string;
	endpoint: string;
	idField: string;
	payload: Record<string, unknown>;
};

export type SkipAction = {
	type: "skip";
	resourceType: string;
	path: string;
	reason: string;
};

export type ApplyAction = UpdateAction | SkipAction;

const ENDPOINT_MAP: Record<string, { endpoint: string; idField: string }> = {
	application: { endpoint: "application.update", idField: "applicationId" },
	compose: { endpoint: "compose.update", idField: "composeId" },
	postgres: { endpoint: "postgres.update", idField: "postgresId" },
	mysql: { endpoint: "mysql.update", idField: "mysqlId" },
	mariadb: { endpoint: "mariadb.update", idField: "mariadbId" },
	mongo: { endpoint: "mongo.update", idField: "mongoId" },
	redis: { endpoint: "redis.update", idField: "redisId" },
};

function filterRedactedFields(fields: FieldChange[]): FieldChange[] {
	return fields.filter((f) => !isRedacted(f.local));
}

export function buildApplyPlan(changes: Change[]): ApplyAction[] {
	const actions: ApplyAction[] = [];

	for (const change of changes) {
		if (change.type === "added") {
			actions.push({
				type: "skip",
				resourceType: change.resourceType,
				path: change.path,
				reason: "Create not supported in v1 (local-only resource)",
			});
			continue;
		}

		if (change.type === "removed") {
			actions.push({
				type: "skip",
				resourceType: change.resourceType,
				path: change.path,
				reason: "Delete not supported in v1 (remote-only resource)",
			});
			continue;
		}

		if (change.type === "modified" && change.fields) {
			const mapping = ENDPOINT_MAP[change.resourceType];
			if (!mapping) {
				actions.push({
					type: "skip",
					resourceType: change.resourceType,
					path: change.path,
					reason: `Unknown resource type: ${change.resourceType}`,
				});
				continue;
			}

			const applicableFields = filterRedactedFields(change.fields);
			if (applicableFields.length === 0) {
				actions.push({
					type: "skip",
					resourceType: change.resourceType,
					path: change.path,
					reason: "All changed fields are redacted",
				});
				continue;
			}

			const payload: Record<string, unknown> = {
				[mapping.idField]: change.resourceId,
			};
			for (const field of applicableFields) {
				payload[field.field] = field.local;
			}

			actions.push({
				type: "update",
				resourceType: change.resourceType,
				resourceId: change.resourceId,
				path: change.path,
				endpoint: mapping.endpoint,
				idField: mapping.idField,
				payload,
			});
		}
	}

	return actions;
}

export function formatApplyPlan(actions: ApplyAction[]): string {
	const lines: string[] = [];
	const updates = actions.filter((a) => a.type === "update") as UpdateAction[];
	const skips = actions.filter((a) => a.type === "skip") as SkipAction[];

	if (updates.length > 0) {
		lines.push(chalk.bold(`Updates (${updates.length}):`));
		for (const action of updates) {
			lines.push(
				chalk.yellow(
					`  ~ [${action.resourceType}] ${action.path}`,
				),
			);
			const fields = Object.keys(action.payload).filter(
				(k) => k !== action.idField,
			);
			lines.push(chalk.gray(`    fields: ${fields.join(", ")}`));
		}
		lines.push("");
	}

	if (skips.length > 0) {
		lines.push(chalk.bold(`Skipped (${skips.length}):`));
		for (const action of skips) {
			lines.push(
				chalk.gray(
					`  - [${action.resourceType}] ${action.path}: ${action.reason}`,
				),
			);
		}
		lines.push("");
	}

	if (updates.length === 0) {
		lines.push(chalk.green("Nothing to update."));
	}

	return lines.join("\n");
}

export async function executeApplyPlan(
	actions: ApplyAction[],
	auth: AuthConfig,
	command: Command,
): Promise<{ success: number; failed: number }> {
	const updates = actions.filter((a) => a.type === "update") as UpdateAction[];
	let success = 0;
	let failed = 0;

	for (const action of updates) {
		try {
			const response = await axios.post(
				`${auth.url}/api/trpc/${action.endpoint}`,
				{ json: action.payload },
				{
					headers: {
						"x-api-key": auth.token,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.status === 200) {
				command.log(
					chalk.green(
						`  Updated [${action.resourceType}] ${action.path}`,
					),
				);
				success++;
			} else {
				command.log(
					chalk.red(
						`  Failed [${action.resourceType}] ${action.path}: HTTP ${response.status}`,
					),
				);
				failed++;
			}
		} catch (error) {
			const message =
				error instanceof Error ? error.message : String(error);
			command.log(
				chalk.red(
					`  Failed [${action.resourceType}] ${action.path}: ${message}`,
				),
			);
			failed++;
		}
	}

	return { success, failed };
}
