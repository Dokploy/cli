import chalk from "chalk";
import {
	type Cell,
	clean,
	countLines,
	formatValue,
	humanize,
	isDateValue,
	isEmpty,
	isEnvKey,
	isPlainObject,
	isPrimitive,
	isSecretKey,
	isStatusKey,
	paint,
	primaryIdKey,
	titleKeyOf,
	titleOf,
} from "./format.js";
import { presentResult } from "./presenters.js";
import {
	color,
	isInteractive,
	padEnd,
	symbols,
	terminalWidth,
	truncate,
} from "./style.js";
import { pickColumns, renderTable } from "./table.js";

export interface RenderContext {
	json?: boolean;
	endpoint: string;
	method: "get" | "post";
}

export interface RenderEnv {
	interactive: boolean;
	width: number;
	now?: Date;
	print: (line: string) => void;
}

function defaultEnv(): RenderEnv {
	return {
		interactive: isInteractive(),
		width: terminalWidth(),
		print: (line) => console.log(line),
	};
}

// With --json, or when stdout is not a terminal, print exactly what the CLI
// always printed, so scripts and tools that parse it keep working.
export function render(
	data: unknown,
	ctx: RenderContext,
	env: RenderEnv = defaultEnv(),
): void {
	if (ctx.json) {
		console.log(JSON.stringify(data, null, 2));
		return;
	}
	if (!env.interactive) {
		printLegacy(data);
		return;
	}
	try {
		renderPretty(data, ctx, env);
	} catch {
		// The request already succeeded; don't turn a display problem into a failure.
		printLegacy(data);
	}
}

function printLegacy(data: unknown): void {
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

function kebab(s: string): string {
	return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function splitEndpoint(endpoint: string): { group: string; action: string } {
	const [group = "", ...rest] = endpoint.split(".");
	return { group, action: rest.join(".") };
}

const GROUP_NOUNS: Record<string, [string, string]> = {
	compose: ["compose service", "compose services"],
	docker: ["container", "containers"],
	settings: ["entry", "entries"],
	postgres: ["database", "databases"],
	mysql: ["database", "databases"],
	mariadb: ["database", "databases"],
	mongo: ["database", "databases"],
	redis: ["database", "databases"],
	libsql: ["database", "databases"],
};

function singular(word: string): string {
	if (/ies$/.test(word)) return word.replace(/ies$/, "y");
	if (/(ches|shes|sses|xes)$/.test(word)) return word.replace(/es$/, "");
	if (/(ss|us)$/.test(word)) return word;
	return word.replace(/s$/, "");
}

function plural(word: string): string {
	if (/(s|x|z|ch|sh)$/.test(word)) return `${word}es`;
	if (/[^aeiou]y$/.test(word)) return word.replace(/y$/, "ies");
	return `${word}s`;
}

function noun(group: string, action: string, count: number): string {
	const rest = action
		.replace(/^(get|list|all|find)/, "")
		.replace(/By[A-Z]\w*$/, "");
	let one: string;
	let many: string;
	if (/^[A-Z]/.test(rest) && rest !== "All") {
		one = singular(humanize(rest).toLowerCase());
		many = plural(one);
	} else if (Object.hasOwn(GROUP_NOUNS, group)) {
		[one, many] = GROUP_NOUNS[group];
	} else {
		one = singular(humanize(group).toLowerCase());
		many = plural(one);
	}
	return count === 1 ? one : many;
}

// For an empty result the client returns the whole tRPC body
// ({ result: { data: { json: null } } }); treat it as no data.
function unwrapEmptyEnvelope(data: unknown): unknown {
	if (!isPlainObject(data) || Object.keys(data).length !== 1) return data;
	const result = data.result;
	if (!isPlainObject(result) || !isPlainObject(result.data)) return data;
	const json = result.data.json;
	return json === null || json === undefined ? null : data;
}

function renderPretty(raw: unknown, ctx: RenderContext, env: RenderEnv): void {
	const data = unwrapEmptyEnvelope(raw);
	if (presentResult(ctx.endpoint, data, env.print)) return;
	const { group, action } = splitEndpoint(ctx.endpoint);
	const command = `${kebab(group)} ${kebab(action)}`;
	const { print } = env;

	const success = () =>
		print(
			`${color.success(symbols.success)} ${color.strong("Done")} ${color.muted(command)}`,
		);

	if (data === null || data === undefined || data === true) {
		if (ctx.method === "post") {
			success();
		} else {
			print(data === true ? color.success("true") : color.muted("No data."));
		}
		return;
	}
	if (data === false) {
		print(
			ctx.method === "post"
				? `${color.warning(symbols.warning)} ${command} ${color.muted("returned false")}`
				: color.muted("false"),
		);
		return;
	}
	if (typeof data === "string") {
		print(data === "" ? color.muted("(empty response)") : data);
		return;
	}
	if (typeof data === "number" || typeof data === "bigint") {
		print(String(data));
		return;
	}

	if (Array.isArray(data)) {
		renderList(data, group, action, env);
		return;
	}

	if (isPlainObject(data)) {
		if (ctx.method === "post") {
			success();
			print("");
		}
		renderDetails(data, group, env);
		return;
	}

	print(JSON.stringify(data, null, 2));
}

function renderList(
	data: unknown[],
	group: string,
	action: string,
	env: RenderEnv,
): void {
	const { print } = env;
	if (data.length === 0) {
		print(color.muted(`No ${noun(group, action, 0)} found.`));
		return;
	}

	if (data.every(isPrimitive)) {
		for (const item of data) {
			print(`  ${color.muted(symbols.bullet)} ${clean(String(item))}`);
		}
		return;
	}

	if (!data.every(isPlainObject)) {
		print(JSON.stringify(data, null, 2));
		return;
	}

	const rows = data as Record<string, unknown>[];
	const { columns, omitted } = pickColumns(rows, group);
	if (columns.length === 0) {
		print(JSON.stringify(data, null, 2));
		return;
	}
	const { lines, droppedColumns } = renderTable(rows, columns, {
		width: env.width,
		now: env.now,
	});
	for (const line of lines) print(line);

	const hidden = omitted + droppedColumns;
	const summary = `${rows.length} ${noun(group, action, rows.length)}`;
	const hint = hidden > 0 ? ` ${symbols.bullet} --json shows all fields` : "";
	print("");
	print(`  ${color.muted(summary + hint)}`);
}

interface Field {
	label: string;
	cell: Cell;
	order: number;
}

function collectFields(
	obj: Record<string, unknown>,
	skip: Set<string>,
	now: Date | undefined,
	counts: { empty: number; secret: number },
): {
	fields: Field[];
	objects: Array<[string, Record<string, unknown>]>;
	lists: Array<[string, Record<string, unknown>[]]>;
} {
	const fields: Field[] = [];
	const objects: Array<[string, Record<string, unknown>]> = [];
	const lists: Array<[string, Record<string, unknown>[]]> = [];

	Object.entries(obj).forEach(([key, value], index) => {
		if (skip.has(key)) return;
		if (isEmpty(value)) {
			counts.empty++;
			return;
		}
		const label = humanize(key);
		const tiebreak = index / 10000;
		const order =
			(isStatusKey(key)
				? -1
				: /Id$/.test(key)
					? 1
					: isDateValue(key, value)
						? 2
						: 0) + tiebreak;

		if (isEnvKey(key) && typeof value === "string") {
			const n = countLines(value);
			counts.secret++;
			fields.push({
				label,
				cell: {
					text: `${n} variable${n === 1 ? "" : "s"} (hidden)`,
					paint: color.muted,
				},
				order: 3 + tiebreak,
			});
			return;
		}
		if (isSecretKey(key) && isPrimitive(value)) {
			counts.secret++;
			fields.push({
				label,
				cell: { text: symbols.mask, paint: color.muted },
				order: 3 + tiebreak,
			});
			return;
		}
		if (Array.isArray(value) && value.every(isPlainObject)) {
			lists.push([key, value as Record<string, unknown>[]]);
			return;
		}
		if (isPlainObject(value) && !titleOf(value)) {
			if (Object.values(value).some((v) => isPrimitive(v) && !isEmpty(v))) {
				objects.push([key, value]);
				return;
			}
		}
		fields.push({
			label,
			cell: formatValue(key, value, { compact: false, now }),
			order,
		});
	});

	fields.sort((a, b) => a.order - b.order);
	return { fields, objects, lists };
}

function printFields(fields: Field[], indent: number, env: RenderEnv): void {
	if (fields.length === 0) return;
	const labelWidth = Math.min(
		Math.max(...fields.map((f) => f.label.length)),
		24,
	);
	const valueWidth = Math.max(env.width - indent - labelWidth - 2, 12);
	const pad = " ".repeat(indent);
	for (const { label, cell } of fields) {
		const name = padEnd(color.muted(truncate(label, labelWidth)), labelWidth);
		env.print(`${pad}${name}  ${paint(cell, truncate(cell.text, valueWidth))}`);
	}
}

function renderDetails(
	obj: Record<string, unknown>,
	group: string,
	env: RenderEnv,
): void {
	const { print } = env;
	const titleKey = titleKeyOf(obj);
	const idKey = primaryIdKey(group, obj);
	const id = idKey ? obj[idKey] : undefined;
	const kind = humanize(group);

	const heading = titleKey ? clean(String(obj[titleKey])) : kind;
	const subtitle = [
		titleKey ? kind : undefined,
		isPrimitive(id) && id ? clean(String(id)) : undefined,
	]
		.filter(Boolean)
		.join(` ${symbols.bullet} `);
	print(
		`  ${color.strong(heading)}${subtitle ? `  ${color.muted(subtitle)}` : ""}`,
	);
	print("");

	const counts = { empty: 0, secret: 0 };
	const skip = new Set([titleKey, idKey].filter(Boolean) as string[]);
	const { fields, objects, lists } = collectFields(obj, skip, env.now, counts);
	printFields(fields, 2, env);

	for (const [key, value] of objects) {
		print("");
		print(`  ${color.strong(humanize(key))}`);
		const nested = collectFields(value, new Set(), env.now, counts);
		const flattened = [
			...nested.fields,
			...nested.objects.map(([k, v], i) => ({
				label: humanize(k),
				cell: formatValue(k, v, { compact: false }),
				order: 2 + i,
			})),
			...nested.lists.map(([k, v], i) => ({
				label: humanize(k),
				cell: { text: String(v.length) },
				order: 3 + i,
			})),
		];
		printFields(flattened, 4, env);
	}

	for (const [key, rows] of lists) {
		print("");
		print(
			`  ${color.strong(humanize(key))} ${color.muted(`(${rows.length})`)}`,
		);
		const { columns } = pickColumns(rows, singular(key), 5);
		if (columns.length === 0) continue;
		const { lines } = renderTable(rows, columns, {
			width: env.width,
			indent: 4,
			maxRows: 10,
			now: env.now,
		});
		for (const line of lines) print(line);
	}

	const notes: string[] = [];
	if (counts.secret > 0) {
		notes.push(
			`${counts.secret} secret value${counts.secret === 1 ? "" : "s"} hidden`,
		);
	}
	if (counts.empty > 0) {
		notes.push(
			`${counts.empty} empty field${counts.empty === 1 ? "" : "s"} hidden`,
		);
	}
	if (notes.length > 0) {
		print("");
		print(
			`  ${color.muted(`${notes.join(` ${symbols.bullet} `)} ${symbols.bullet} --json shows everything`)}`,
		);
	}
}
