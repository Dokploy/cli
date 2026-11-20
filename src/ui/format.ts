import { color, symbols } from "./style.js";

export type Plain = string | number | boolean | null | undefined;

export interface Cell {
	text: string;
	paint?: (s: string) => string;
}

export function isPlainObject(v: unknown): v is Record<string, unknown> {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function isPrimitive(v: unknown): v is Plain {
	return v === null || v === undefined || typeof v !== "object";
}

export function isEmpty(v: unknown): boolean {
	return (
		v === null ||
		v === undefined ||
		v === "" ||
		(Array.isArray(v) && v.length === 0)
	);
}

const SECRET_KEY =
	/(password|passwd|passphrase|secrets?|token|privatekey|apikey|accesskey|secretkey|credentials?)$/i;
const ENV_KEY = /^(env|buildArgs|buildSecrets)$|(Env|BuildArgs|BuildSecrets)$/;
const STATUS_KEY = /(^status$|^state$|Status$)/;
const DATE_KEY = /(At|Date)$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/;

export const TITLE_KEYS = [
	"name",
	"title",
	"appName",
	"email",
	"host",
	"domain",
	"username",
	"label",
];

export function isSecretKey(key: string): boolean {
	return SECRET_KEY.test(key);
}

export function isEnvKey(key: string): boolean {
	return ENV_KEY.test(key);
}

export function isStatusKey(key: string): boolean {
	return STATUS_KEY.test(key);
}

export function isDateValue(key: string, value: unknown): boolean {
	return (
		typeof value === "string" &&
		ISO_DATE.test(value) &&
		!Number.isNaN(Date.parse(value)) &&
		(DATE_KEY.test(key) || value.length <= 30)
	);
}

// Prefer "id": rows like invitations also carry their parent's "organizationId".
export function primaryIdKey(
	group: string,
	sample: Record<string, unknown>,
): string | undefined {
	if ("id" in sample) return "id";
	const singular = group.replace(/ies$/, "y").replace(/s$/, "");
	for (const key of [`${group}Id`, `${singular}Id`]) {
		if (key in sample) return key;
	}
	return Object.keys(sample).find((k) => /Id$/.test(k));
}

const LABEL_OVERRIDES: Record<string, string> = {
	createdAt: "Created",
	updatedAt: "Updated",
	startedAt: "Started",
	finishedAt: "Finished",
	appName: "App name",
	url: "URL",
	https: "HTTPS",
	ip: "IP",
	ipAddress: "IP address",
	cpuLimit: "CPU limit",
	cpuReservation: "CPU reservation",
};

export function humanize(key: string): string {
	if (Object.hasOwn(LABEL_OVERRIDES, key)) return LABEL_OVERRIDES[key];
	const words = clean(key)
		.replace(/[_-]+/g, " ")
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
		.trim()
		.split(/\s+/)
		.map((w) => (w.toLowerCase() === "id" ? "ID" : w.toLowerCase()));
	const label = words.join(" ");
	return label.charAt(0).toUpperCase() + label.slice(1);
}

const STATUS_COLORS: Array<[RegExp, (s: string) => string]> = [
	[
		/^(done|ok|success|succeeded|completed|healthy|active|up|ready|enabled)$/i,
		color.success,
	],
	[/^(error|failed|failure|unhealthy|dead|exited|rejected)$/i, color.danger],
	[
		/^(running|deploying|building|pending|queued|starting|restarting|in[_ ]progress|updating|warning)$/i,
		color.warning,
	],
];

// "running" means a deployment in progress, except for Docker containers (`state`).
export function statusCell(key: string, value: string): Cell {
	if (key === "state" && /^running$/i.test(value)) {
		return { text: `${symbols.dot} ${value}`, paint: color.success };
	}
	for (const [pattern, paint] of STATUS_COLORS) {
		if (pattern.test(value)) return { text: `${symbols.dot} ${value}`, paint };
	}
	return { text: `${symbols.dot} ${value}`, paint: color.muted };
}

export function relativeTime(date: Date, now: Date = new Date()): string {
	const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
	const future = seconds < 0;
	const s = Math.abs(seconds);
	const units: Array<[number, string]> = [
		[60 * 60 * 24 * 365, "y"],
		[60 * 60 * 24 * 30, "mo"],
		[60 * 60 * 24, "d"],
		[60 * 60, "h"],
		[60, "m"],
	];
	if (s < 45) return future ? "in a moment" : "just now";
	for (const [size, unit] of units) {
		if (s >= size) {
			const n = Math.floor(s / size);
			return future ? `in ${n}${unit}` : `${n}${unit} ago`;
		}
	}
	return future ? `in ${s}s` : `${s}s ago`;
}

function pad2(n: number): string {
	return String(n).padStart(2, "0");
}

export function absoluteTime(date: Date): string {
	return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function countLines(text: string): number {
	return text
		.split(/\r?\n/)
		.filter((l) => l.trim() && !l.trim().startsWith("#")).length;
}

export interface FormatOptions {
	compact: boolean;
	now?: Date;
}

// biome-ignore lint/suspicious/noControlCharactersInRegex: removing them is the point
const CONTROL = /[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g;

// Server text can carry escape sequences that move the cursor, clear the
// screen or set the window title. JSON output escaped them; strip them here.
export function clean(text: string): string {
	return text.replace(/\t/g, " ").replace(CONTROL, "");
}

export function formatValue(
	key: string,
	value: unknown,
	opts: FormatOptions,
): Cell {
	const cell = describeValue(key, value, opts);
	return { ...cell, text: clean(cell.text) };
}

function describeValue(key: string, value: unknown, opts: FormatOptions): Cell {
	if (value === null || value === undefined || value === "") {
		return { text: symbols.dash, paint: color.muted };
	}
	if (typeof value === "boolean") {
		return value
			? { text: "yes", paint: color.success }
			: { text: "no", paint: color.muted };
	}
	if (typeof value === "number" || typeof value === "bigint") {
		return { text: String(value) };
	}
	if (typeof value === "string") {
		if (isStatusKey(key) && !value.includes("\n") && value.length <= 24) {
			return statusCell(key, value);
		}
		if (isDateValue(key, value)) {
			const date = new Date(value);
			const rel = relativeTime(date, opts.now);
			return opts.compact
				? { text: rel }
				: { text: `${absoluteTime(date)}  ${rel}` };
		}
		const lines = value.split(/\r?\n/);
		if (lines.length > 1) {
			const extra = lines.length - 1;
			return {
				text: `${lines[0]} (+${extra} more line${extra === 1 ? "" : "s"})`,
			};
		}
		return { text: value };
	}
	if (Array.isArray(value)) {
		if (value.length === 0) return { text: symbols.dash, paint: color.muted };
		if (value.every((v) => isPrimitive(v))) {
			return { text: value.map((v) => String(v)).join(", ") };
		}
		const names = value
			.map((v) => (isPlainObject(v) ? titleOf(v) : undefined))
			.filter((v): v is string => Boolean(v));
		if (!opts.compact && names.length === value.length && names.length <= 5) {
			return { text: names.join(", ") };
		}
		return { text: String(value.length) };
	}
	if (isPlainObject(value)) {
		const title = titleOf(value);
		if (title) return { text: title };
		const size = Object.keys(value).length;
		return {
			text: `{${size} field${size === 1 ? "" : "s"}}`,
			paint: color.muted,
		};
	}
	return { text: String(value) };
}

export function titleKeyOf(obj: Record<string, unknown>): string | undefined {
	return TITLE_KEYS.find(
		(k) => typeof obj[k] === "string" && (obj[k] as string).trim() !== "",
	);
}

export function titleOf(obj: Record<string, unknown>): string | undefined {
	const key = titleKeyOf(obj);
	return key ? clean(obj[key] as string) : undefined;
}

export function paint(cell: Cell, text: string = cell.text): string {
	return cell.paint ? cell.paint(text) : text;
}
