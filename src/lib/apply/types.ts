import type { Fields } from "./resources.js";

export type ActionType = "create" | "update" | "unchanged";

export interface Change {
	from: unknown;
	to: unknown;
}

export interface Action {
	type: ActionType;
	resourceType: string;
	name: string;
	config: Fields;
	remote?: Fields;
	remoteId?: string;
	changes?: Record<string, Change>;
	children?: Action[];
}

export interface ApplyPlan {
	project: Action;
	environments: Action[];
}

export interface ApplyResult {
	created: number;
	updated: number;
	unchanged: number;
	failed: number;
	errors: Array<{ resource: string; error: string }>;
}
