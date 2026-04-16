/**
 * Generates CLI commands from the Dokploy OpenAPI spec.
 *
 * Usage: npx tsx scripts/generate.ts
 *
 * Reads openapi.json from the project root and generates:
 *   - src/generated/commands.ts  (all CLI commands)
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SPEC_PATH = path.join(ROOT, "openapi.json");
const OUT_PATH = path.join(ROOT, "src", "generated", "commands.ts");

interface OpenAPISpec {
	paths: Record<string, Record<string, OperationObject>>;
}

interface OperationObject {
	operationId?: string;
	summary?: string;
	description?: string;
	tags?: string[];
	parameters?: ParameterObject[];
	requestBody?: {
		content?: {
			"application/json"?: {
				schema?: SchemaObject;
			};
		};
	};
	responses?: Record<string, unknown>;
}

interface ParameterObject {
	name: string;
	in: string;
	required?: boolean;
	schema?: SchemaObject;
}

interface SchemaObject {
	type?: string;
	properties?: Record<string, SchemaProperty>;
	required?: string[];
	anyOf?: SchemaObject[];
	items?: SchemaObject;
	enum?: string[];
}

interface SchemaProperty {
	type?: string;
	anyOf?: SchemaObject[];
	enum?: string[];
	default?: unknown;
	description?: string;
}

interface CommandInfo {
	/** e.g. "application.create" */
	endpoint: string;
	/** e.g. "application" */
	group: string;
	/** e.g. "create" */
	action: string;
	method: "get" | "post";
	description: string;
	options: OptionInfo[];
}

interface OptionInfo {
	name: string;
	flag: string;
	description: string;
	required: boolean;
	type: "string" | "number" | "boolean";
	enumValues?: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveType(prop: SchemaProperty): "string" | "number" | "boolean" {
	const raw = prop.type ?? prop.anyOf?.find((s) => s.type && s.type !== "null")?.type;
	if (raw === "number" || raw === "integer") return "number";
	if (raw === "boolean") return "boolean";
	return "string";
}

function resolveEnum(prop: SchemaProperty): string[] | undefined {
	if (prop.enum) return prop.enum;
	const inner = prop.anyOf?.find((s) => s.enum);
	return inner?.enum;
}

function extractOptionsFromSchema(schema: SchemaObject | undefined): OptionInfo[] {
	if (!schema?.properties) return [];
	const required = new Set(schema.required ?? []);
	return Object.entries(schema.properties).map(([name, prop]) => {
		const type = resolveType(prop);
		const enumValues = resolveEnum(prop);
		let desc = prop.description ?? name;
		if (enumValues) desc += ` (${enumValues.join(", ")})`;
		return {
			name,
			flag: `--${name} <${type === "boolean" ? "" : "value"}>`.replace(/ <>/g, ""),
			description: desc,
			required: required.has(name),
			type,
			enumValues,
		};
	});
}

function extractOptionsFromParams(params: ParameterObject[]): OptionInfo[] {
	return params.map((p) => {
		const type = resolveType(p.schema ?? {});
		const enumValues = resolveEnum(p.schema ?? {});
		let desc = p.name;
		if (enumValues) desc += ` (${enumValues.join(", ")})`;
		return {
			name: p.name,
			flag: `--${p.name} <${type === "boolean" ? "" : "value"}>`.replace(/ <>/g, ""),
			description: desc,
			required: p.required ?? false,
			type,
			enumValues,
		};
	});
}

function camelToKebab(s: string): string {
	return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

// ---------------------------------------------------------------------------
// Parse spec → CommandInfo[]
// ---------------------------------------------------------------------------

function parseSpec(spec: OpenAPISpec): CommandInfo[] {
	const commands: CommandInfo[] = [];

	for (const [pathKey, methods] of Object.entries(spec.paths)) {
		for (const [method, op] of Object.entries(methods)) {
			const endpoint = pathKey.replace(/^\//, "");
			const [group, ...rest] = endpoint.split(".");
			const action = rest.join(".");

			if (!group || !action) continue;

			const bodySchema = op.requestBody?.content?.["application/json"]?.schema;
			const paramOptions = op.parameters ? extractOptionsFromParams(op.parameters) : [];
			const bodyOptions = extractOptionsFromSchema(bodySchema);
			const options = [...paramOptions, ...bodyOptions];

			commands.push({
				endpoint,
				group,
				action,
				method: method as "get" | "post",
				description: op.summary ?? op.description ?? `${group} ${action}`,
				options,
			});
		}
	}

	return commands.sort((a, b) => a.endpoint.localeCompare(b.endpoint));
}

// ---------------------------------------------------------------------------
// Code generation
// ---------------------------------------------------------------------------

function generateOptionLine(opt: OptionInfo): string {
	const flag = opt.type === "boolean"
		? `--${opt.name}`
		: `--${opt.name} <value>`;
	const escaped = opt.description.replace(/'/g, "\\'");
	return opt.required
		? `.requiredOption('${flag}', '${escaped}')`
		: `.option('${flag}', '${escaped}')`;
}

function generateCoercion(opt: OptionInfo): string {
	if (opt.type === "number") {
		return `if (opts["${opt.name}"] != null) opts["${opt.name}"] = Number(opts["${opt.name}"]);`;
	}
	if (opt.type === "boolean") {
		return `if (opts["${opt.name}"] != null) opts["${opt.name}"] = opts["${opt.name}"] === true || opts["${opt.name}"] === "true";`;
	}
	return "";
}

function generateCommandCode(cmd: CommandInfo, groupVar: string): string {
	const actionName = camelToKebab(cmd.action);
	const optionLines = cmd.options.map(generateOptionLine).join("\n\t\t");
	const coercions = cmd.options
		.map(generateCoercion)
		.filter(Boolean)
		.map((c) => `\t\t\t${c}`)
		.join("\n");

	const apiCall = cmd.method === "post"
		? `await apiPost("${cmd.endpoint}", opts)`
		: `await apiGet("${cmd.endpoint}", opts)`;

	const escapedDesc = cmd.description.replace(/'/g, "\\'");

	return `
	${groupVar}
		.command('${actionName}')
		.description('${escapedDesc}')
		${optionLines}
		.option('--json', 'Output raw JSON')
		.action(async (opts: Record<string, any>) => {
			const jsonOutput = opts.json; delete opts.json;
${coercions}
			const data = ${apiCall};
			if (jsonOutput) {
				console.log(JSON.stringify(data, null, 2));
			} else {
				printOutput(data);
			}
		});`;
}

function generateFile(commands: CommandInfo[]): string {
	// Group commands by their group name
	const groups = new Map<string, CommandInfo[]>();
	for (const cmd of commands) {
		const existing = groups.get(cmd.group) ?? [];
		existing.push(cmd);
		groups.set(cmd.group, existing);
	}

	const groupBlocks: string[] = [];
	for (const [group, cmds] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
		const varName = `g_${group.replace(/[^a-zA-Z0-9]/g, "_")}`;
		const kebabGroup = camelToKebab(group);
		groupBlocks.push(`\tconst ${varName} = program.command('${kebabGroup}').description('${kebabGroup} commands');`);
		for (const cmd of cmds) {
			groupBlocks.push(generateCommandCode(cmd, varName));
		}
	}

	return `// Auto-generated from openapi.json — do not edit manually.
// Run: npx tsx scripts/generate.ts

import type { Command } from "commander";
import chalk from "chalk";
import { apiPost, apiGet } from "../client.js";

function printOutput(data: unknown) {
	if (data === null || data === undefined) {
		console.log(chalk.green("OK"));
		return;
	}
	if (typeof data === "string") {
		console.log(data);
		return;
	}
	console.log(JSON.stringify(data, null, 2));
}

export function registerGeneratedCommands(program: Command) {
${groupBlocks.join("\n")}
}
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const spec: OpenAPISpec = JSON.parse(fs.readFileSync(SPEC_PATH, "utf8"));
const commands = parseSpec(spec);

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, generateFile(commands));

console.log(`Generated ${commands.length} commands → ${path.relative(ROOT, OUT_PATH)}`);
