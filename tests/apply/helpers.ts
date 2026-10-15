import { parseDocuments } from "../../src/lib/apply/parser.js";
import { buildPlan } from "../../src/lib/apply/reconciler.js";
import type { ProjectConfig } from "../../src/lib/apply/schema.js";

export const parseProject = (raw: string) =>
	parseDocuments(raw)[0] as ProjectConfig;

export const planProject = (raw: string, prune = false) =>
	buildPlan(parseProject(raw), { prune, declaredServers: [] });
