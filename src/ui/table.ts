import {
	type Cell,
	formatValue,
	humanize,
	isEmpty,
	isEnvKey,
	isPlainObject,
	isPrimitive,
	isSecretKey,
	isStatusKey,
	paint,
	primaryIdKey,
	TITLE_KEYS,
	titleOf,
} from "./format.js";
import { color, padEnd, symbols, truncate } from "./style.js";

type Kind =
	| "title"
	| "id"
	| "status"
	| "type"
	| "other"
	| "long"
	| "count"
	| "date"
	| "foreign";

export interface Column {
	key: string;
	header: string;
	kind: Kind;
	priority: number;
	index: number;
}

const KIND_ORDER: Kind[] = [
	"title",
	"id",
	"status",
	"type",
	"other",
	"long",
	"foreign",
	"count",
	"date",
];

export function pickColumns(
	rows: Record<string, unknown>[],
	group: string,
	maxColumns = 6,
): { columns: Column[]; omitted: number } {
	const sample = rows.slice(0, 50);
	const keys: string[] = [];
	for (const row of sample) {
		for (const key of Object.keys(row)) {
			if (!keys.includes(key)) keys.push(key);
		}
	}
	const union = Object.fromEntries(keys.map((k) => [k, true]));
	const titleKey = TITLE_KEYS.find((k) =>
		sample.some((r) => typeof r[k] === "string" && r[k] !== ""),
	);
	const idKey = primaryIdKey(group, union);

	const candidates: Column[] = [];
	keys.forEach((key, index) => {
		const values = sample.map((r) => r[key]);
		if (values.every(isEmpty)) return;
		if (isSecretKey(key) || isEnvKey(key)) return;

		const header = key === idKey ? "ID" : humanize(key);
		const col = (kind: Kind, priority: number): Column => ({
			key,
			header,
			kind,
			priority,
			index,
		});

		const objects = values.filter(isPlainObject);
		if (objects.length > 0) {
			if (objects.every((o) => titleOf(o))) candidates.push(col("other", 45));
			return;
		}
		if (values.some(Array.isArray)) {
			candidates.push(col("count", 40));
			return;
		}
		if (key === titleKey) return void candidates.push(col("title", 100));
		if (key === idKey) return void candidates.push(col("id", 95));
		if (isStatusKey(key)) return void candidates.push(col("status", 90));
		if (key === "createdAt") return void candidates.push(col("date", 60));
		// A value shared by every row (like the organization ID) says nothing.
		const constant =
			sample.length > 1 &&
			values.every((v) => isPrimitive(v) && v === values[0]);
		if (/Id$/.test(key) || key === "id") {
			if (constant) return;
			return void candidates.push(col("foreign", 10));
		}
		if (/(type|role|kind)$/i.test(key)) {
			return void candidates.push(col("type", 70));
		}
		const strings = values.filter((v) => typeof v === "string") as string[];
		const avg =
			strings.reduce((sum, s) => sum + s.length, 0) / (strings.length || 1);
		if (strings.some((s) => s.includes("\n")) || avg > 40) {
			return void candidates.push(col("long", 20));
		}
		candidates.push(col("other", 50 - index / 1000));
	});

	const chosen = [...candidates]
		.sort((a, b) => b.priority - a.priority)
		.slice(0, maxColumns);

	return {
		columns: sortColumns(chosen),
		omitted: candidates.length - chosen.length,
	};
}

function sortColumns(columns: Column[]): Column[] {
	return [...columns].sort(
		(a, b) =>
			KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) ||
			a.index - b.index,
	);
}

export interface TableOptions {
	width: number;
	indent?: number;
	maxRows?: number;
	now?: Date;
}

const GAP = 3;
const MAX_CELL = 48;
const SOFT_MIN_CELL = 24;
const MIN_CELL = 6;

export function renderTable(
	rows: Record<string, unknown>[],
	columns: Column[],
	opts: TableOptions,
): { lines: string[]; droppedColumns: number } {
	const indent = opts.indent ?? 2;
	const shown = opts.maxRows !== undefined ? rows.slice(0, opts.maxRows) : rows;
	let cols = [...columns];

	const cellsFor = (col: Column): Cell[] =>
		shown.map((row) =>
			formatValue(col.key, row[col.key], { compact: true, now: opts.now }),
		);

	let cells = new Map(cols.map((c) => [c, cellsFor(c)]));
	const naturalWidth = (col: Column) =>
		Math.min(
			Math.max(
				[...col.header].length,
				...cells.get(col)!.map((cell) => [...cell.text].length),
			),
			MAX_CELL,
		);

	let widths = new Map(cols.map((c) => [c, naturalWidth(c)]));
	const total = () =>
		[...widths.values()].reduce((a, b) => a + b, 0) +
		GAP * (cols.length - 1) +
		indent;

	const shrinkWidest = (floor: number): boolean => {
		const widest = [...widths.entries()].sort((a, b) => b[1] - a[1])[0];
		if (!widest || widest[1] <= floor) return false;
		widths.set(widest[0], widest[1] - 1);
		return true;
	};

	while (total() > opts.width && shrinkWidest(SOFT_MIN_CELL)) {}
	let dropped = 0;
	while (total() > opts.width && cols.length > 2) {
		const victim = [...cols]
			.filter((c) => c.kind !== "title")
			.sort((a, b) => a.priority - b.priority)[0];
		if (!victim) break;
		cols = cols.filter((c) => c !== victim);
		widths.delete(victim);
		dropped++;
	}
	while (total() > opts.width && shrinkWidest(MIN_CELL)) {}
	cells = new Map(cols.map((c) => [c, cells.get(c)!]));
	widths = new Map(cols.map((c) => [c, widths.get(c)!]));

	const pad = " ".repeat(indent);
	const join = (parts: string[]) => pad + parts.join(" ".repeat(GAP)).trimEnd();

	const header = cols.map((c, i) => {
		const text = truncate(c.header.toUpperCase(), widths.get(c)!);
		const styled = color.muted(text);
		return i === cols.length - 1 ? styled : padEnd(styled, widths.get(c)!);
	});

	const body = shown.map((_, r) =>
		join(
			cols.map((c, i) => {
				const cell = cells.get(c)![r];
				const text = truncate(cell.text, widths.get(c)!);
				const styled = c.kind === "id" ? color.muted(text) : paint(cell, text);
				return i === cols.length - 1 ? styled : padEnd(styled, widths.get(c)!);
			}),
		),
	);

	const lines = [join(header), ...body];
	if (opts.maxRows !== undefined && rows.length > opts.maxRows) {
		const more = rows.length - opts.maxRows;
		lines.push(`${pad}${color.muted(`${symbols.ellipsis} ${more} more`)}`);
	}
	return { lines, droppedColumns: dropped };
}
