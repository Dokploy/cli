import type { Command } from "@oclif/core";

import axios from "axios";
import chalk from "chalk";

import type { AuthConfig } from "../utils.js";
import {
	BATCH_CONCURRENCY,
	DB_ID_FIELD,
	DB_TYPES,
	type DbType,
} from "./constants.js";
import type {
	ApplicationState,
	ComposeState,
	DatabaseState,
	EnvironmentState,
	ProjectState,
	SyncState,
} from "./types.js";

function apiHeaders(token: string) {
	return {
		"x-api-key": token,
		"Content-Type": "application/json",
	};
}

async function fetchOne(
	url: string,
	endpoint: string,
	idField: string,
	idValue: string,
	token: string,
): Promise<Record<string, unknown>> {
	const response = await axios.get(`${url}/api/trpc/${endpoint}`, {
		headers: apiHeaders(token),
		params: {
			input: JSON.stringify({ json: { [idField]: idValue } }),
		},
	});
	return response.data.result.data.json;
}

async function batchFetch<T>(
	items: Array<{ endpoint: string; idField: string; idValue: string }>,
	url: string,
	token: string,
): Promise<T[]> {
	const results: T[] = [];
	for (let i = 0; i < items.length; i += BATCH_CONCURRENCY) {
		const batch = items.slice(i, i + BATCH_CONCURRENCY);
		const batchResults = await Promise.all(
			batch.map((item) =>
				fetchOne(url, item.endpoint, item.idField, item.idValue, token),
			),
		);
		results.push(...(batchResults as T[]));
	}
	return results;
}

function buildDatabaseState(
	dbType: DbType,
	data: Record<string, unknown>,
): DatabaseState {
	return { ...data, type: dbType } as unknown as DatabaseState;
}

export async function fetchFullState(
	auth: AuthConfig,
	command: Command,
	projectFilter?: string,
): Promise<SyncState> {
	try {
		const response = await axios.get(`${auth.url}/api/trpc/project.all`, {
			headers: apiHeaders(auth.token),
		});

		if (!response.data.result.data.json) {
			command.error(chalk.red("Error fetching projects"));
		}

		let projects: Array<Record<string, unknown>> =
			response.data.result.data.json;

		if (projectFilter) {
			projects = projects.filter(
				(p) => p.projectId === projectFilter || p.name === projectFilter,
			);
			if (projects.length === 0) {
				command.error(
					chalk.red(`Project not found: ${projectFilter}`),
				);
			}
		}

		const projectStates: ProjectState[] = [];

		for (const project of projects) {
			const environments = (project.environments || []) as Array<
				Record<string, unknown>
			>;
			const envStates: EnvironmentState[] = [];

			for (const env of environments) {
				const appItems = ((env.applications || []) as Array<Record<string, unknown>>).map(
					(app) => ({
						endpoint: "application.one",
						idField: "applicationId",
						idValue: app.applicationId as string,
					}),
				);

				const composeItems = ((env.compose || []) as Array<Record<string, unknown>>).map(
					(c) => ({
						endpoint: "compose.one",
						idField: "composeId",
						idValue: c.composeId as string,
					}),
				);

				const dbItems: Array<{
					endpoint: string;
					idField: string;
					idValue: string;
					dbType: DbType;
				}> = [];

				for (const dbType of DB_TYPES) {
					const dbList = (env[dbType] || []) as Array<
						Record<string, unknown>
					>;
					const idField = DB_ID_FIELD[dbType];
					for (const db of dbList) {
						dbItems.push({
							endpoint: `${dbType}.one`,
							idField,
							idValue: db[idField] as string,
							dbType,
						});
					}
				}

				const [applications, composeServices, dbResults] =
					await Promise.all([
						batchFetch<Record<string, unknown>>(
							appItems,
							auth.url,
							auth.token,
						),
						batchFetch<Record<string, unknown>>(
							composeItems,
							auth.url,
							auth.token,
						),
						batchFetch<Record<string, unknown>>(
							dbItems.map((d) => ({
								endpoint: d.endpoint,
								idField: d.idField,
								idValue: d.idValue,
							})),
							auth.url,
							auth.token,
						),
					]);

				const databases: DatabaseState[] = dbResults.map(
					(data, index) =>
						buildDatabaseState(dbItems[index].dbType, data),
				);

				envStates.push({
					environmentId: env.environmentId as string,
					name: env.name as string,
					description: (env.description as string) || undefined,
					applications: applications as unknown as ApplicationState[],
					compose: composeServices as unknown as ComposeState[],
					databases,
				});
			}

			projectStates.push({
				projectId: project.projectId as string,
				name: project.name as string,
				description: (project.description as string) || undefined,
				environments: envStates,
			});
		}

		return { projects: projectStates };
	} catch (error) {
		if (error instanceof Error && "oclif" in error) {
			throw error;
		}
		command.error(
			chalk.red(
				`Failed to fetch state: ${error instanceof Error ? error.message : String(error)}`,
			),
		);
	}
}
