import * as fs from "node:fs";
import * as path from "node:path";

import { stringify, parse } from "yaml";

import { slugify } from "../slug.js";
import { EPHEMERAL_FIELDS } from "./constants.js";
import { redactSensitiveFields } from "./redact.js";
import type {
	ApplicationState,
	ComposeState,
	DatabaseState,
	EnvironmentState,
	ProjectState,
	SyncState,
} from "./types.js";

function stripEphemeral(data: Record<string, unknown>): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(data)) {
		if (EPHEMERAL_FIELDS.has(key)) continue;
		if (Array.isArray(value)) {
			result[key] = value.map((item) =>
				typeof item === "object" && item !== null
					? stripEphemeral(item as Record<string, unknown>)
					: item,
			);
		} else if (typeof value === "object" && value !== null) {
			result[key] = stripEphemeral(value as Record<string, unknown>);
		} else {
			result[key] = value;
		}
	}
	return result;
}

function toYaml(data: unknown): string {
	return stringify(data, {
		lineWidth: 0,
		defaultStringType: "PLAIN",
		defaultKeyType: "PLAIN",
		blockQuote: "literal",
	});
}

function safeDirName(name: string, id: string, usedNames: Set<string>): string {
	let slug = slugify(name) || "unnamed";
	if (usedNames.has(slug)) {
		slug = `${slug}-${id.slice(0, 6)}`;
	}
	usedNames.add(slug);
	return slug;
}

export function writeStateToDisk(
	state: SyncState,
	outputDir: string,
	redact: boolean,
): void {
	const projectsDir = path.join(outputDir, "projects");

	const usedProjectNames = new Set<string>();

	for (const project of state.projects) {
		const projectSlug = safeDirName(
			project.name,
			project.projectId,
			usedProjectNames,
		);
		const projectDir = path.join(projectsDir, projectSlug);
		fs.mkdirSync(projectDir, { recursive: true });

		const projectData = stripEphemeral({
			projectId: project.projectId,
			name: project.name,
			description: project.description,
		});
		fs.writeFileSync(
			path.join(projectDir, "project.yaml"),
			toYaml(projectData),
		);

		const usedEnvNames = new Set<string>();

		for (const env of project.environments) {
			const envSlug = safeDirName(
				env.name,
				env.environmentId,
				usedEnvNames,
			);
			const envDir = path.join(projectDir, "environments", envSlug);
			fs.mkdirSync(envDir, { recursive: true });

			const envData = stripEphemeral({
				environmentId: env.environmentId,
				name: env.name,
				description: env.description,
			});
			fs.writeFileSync(
				path.join(envDir, "environment.yaml"),
				toYaml(envData),
			);

			writeResources(
				env.applications,
				"applications",
				"applicationId",
				envDir,
				redact,
			);
			writeResources(
				env.compose,
				"compose",
				"composeId",
				envDir,
				redact,
			);
			writeDatabases(env.databases, envDir, redact);
		}
	}
}

function writeResources(
	resources: Array<Record<string, unknown>>,
	subdir: string,
	idField: string,
	envDir: string,
	redact: boolean,
): void {
	if (resources.length === 0) return;

	const dir = path.join(envDir, subdir);
	fs.mkdirSync(dir, { recursive: true });
	const usedNames = new Set<string>();

	for (const resource of resources) {
		const slug = safeDirName(
			resource.name as string,
			resource[idField] as string,
			usedNames,
		);
		let data = stripEphemeral(resource);
		if (redact) {
			data = redactSensitiveFields(data);
		}
		fs.writeFileSync(path.join(dir, `${slug}.yaml`), toYaml(data));
	}
}

function writeDatabases(
	databases: DatabaseState[],
	envDir: string,
	redact: boolean,
): void {
	if (databases.length === 0) return;

	const dir = path.join(envDir, "databases");
	fs.mkdirSync(dir, { recursive: true });
	const usedNames = new Set<string>();

	for (const db of databases) {
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

		const slug = safeDirName(
			db.name,
			(db as Record<string, unknown>)[idField] as string,
			usedNames,
		);
		let data = stripEphemeral(db as unknown as Record<string, unknown>);
		if (redact) {
			data = redactSensitiveFields(data);
		}
		fs.writeFileSync(path.join(dir, `${slug}.yaml`), toYaml(data));
	}
}

export function readStateFromDisk(inputDir: string): SyncState {
	const projectsDir = path.join(inputDir, "projects");
	if (!fs.existsSync(projectsDir)) {
		return { projects: [] };
	}

	const projects: ProjectState[] = [];

	for (const projectSlug of fs.readdirSync(projectsDir).sort()) {
		const projectDir = path.join(projectsDir, projectSlug);
		if (!fs.statSync(projectDir).isDirectory()) continue;

		const projectYaml = path.join(projectDir, "project.yaml");
		if (!fs.existsSync(projectYaml)) continue;

		const projectData = parse(
			fs.readFileSync(projectYaml, "utf8"),
		) as Record<string, unknown>;

		const environments: EnvironmentState[] = [];
		const envsDir = path.join(projectDir, "environments");

		if (fs.existsSync(envsDir)) {
			for (const envSlug of fs.readdirSync(envsDir).sort()) {
				const envDir = path.join(envsDir, envSlug);
				if (!fs.statSync(envDir).isDirectory()) continue;

				const envYaml = path.join(envDir, "environment.yaml");
				if (!fs.existsSync(envYaml)) continue;

				const envData = parse(
					fs.readFileSync(envYaml, "utf8"),
				) as Record<string, unknown>;

				const applications = readResourceDir(
					path.join(envDir, "applications"),
				) as unknown as ApplicationState[];

				const compose = readResourceDir(
					path.join(envDir, "compose"),
				) as unknown as ComposeState[];

				const databases = readResourceDir(
					path.join(envDir, "databases"),
				) as unknown as DatabaseState[];

				environments.push({
					environmentId: envData.environmentId as string,
					name: envData.name as string,
					description: envData.description as string | undefined,
					applications,
					compose,
					databases,
				});
			}
		}

		projects.push({
			projectId: projectData.projectId as string,
			name: projectData.name as string,
			description: projectData.description as string | undefined,
			environments,
		});
	}

	return { projects };
}

function readResourceDir(dir: string): Array<Record<string, unknown>> {
	if (!fs.existsSync(dir)) return [];

	const resources: Array<Record<string, unknown>> = [];
	for (const file of fs.readdirSync(dir).sort()) {
		if (!file.endsWith(".yaml")) continue;
		const filePath = path.join(dir, file);
		const data = parse(fs.readFileSync(filePath, "utf8")) as Record<
			string,
			unknown
		>;
		if (data) {
			resources.push(data);
		}
	}
	return resources;
}
