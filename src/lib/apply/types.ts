import type { Fields } from "./resources.js";

export type ActionType = "create" | "update" | "delete" | "unchanged";

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

export interface ProjectPlan {
	project: Action;
	environments: Action[];
}

export interface Plan {
	organization: Action[];
	projects: ProjectPlan[];
}

export interface ApplyResult {
	created: number;
	updated: number;
	deleted: number;
	unchanged: number;
	failed: number;
	errors: Array<{ resource: string; error: string }>;
}
