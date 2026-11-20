import { isAxiosError } from "axios";
import { clean, isPlainObject } from "./format.js";
import { color, padEnd, symbols } from "./style.js";

type Print = (line: string) => void;
type Presenter = (data: unknown, print: Print) => boolean;

const ok = (title: string) =>
	`${color.success(symbols.success)} ${color.strong(title)}`;
const note = (text: string) => `  ${color.muted(text)}`;
const hint = (text: string) => `  ${color.muted(`${symbols.pointer} ${text}`)}`;

const STATUS_NAMES: Record<string, string> = {
	postgres: "PostgreSQL",
	traefik: "Traefik",
	redis: "Redis",
};

const PRESENTERS: Record<string, Presenter> = {
	"settings.reloadServer": (_data, print) => {
		print(ok("Dokploy is restarting"));
		print(note("It is usually back within 30 seconds."));
		print(hint("Check it with: dokploy settings health"));
		return true;
	},

	"settings.reloadTraefik": (_data, print) => {
		print(ok("Traefik is restarting"));
		print(note("Your apps may be unreachable for a few seconds."));
		return true;
	},

	"settings.updateServer": (_data, print) => {
		print(ok("Update requested"));
		print(
			note(
				"If a newer version is available, Dokploy downloads it and restarts on it.",
			),
		);
		print(note("This can take a few minutes."));
		print(
			hint(
				"Check the running version with: dokploy settings get-dokploy-version",
			),
		);
		return true;
	},

	"settings.getUpdateData": (data, print) => {
		if (!isPlainObject(data) || typeof data.updateAvailable !== "boolean") {
			return false;
		}
		const latest =
			typeof data.latestVersion === "string"
				? clean(data.latestVersion)
				: undefined;
		if (data.updateAvailable) {
			print(
				`${color.info(symbols.info)} ${color.strong("Update available")}${latest ? ` ${color.accent(latest)}` : ""}`,
			);
			print(hint("Install it with: dokploy settings update-server"));
		} else {
			print(ok("Dokploy is up to date"));
			if (latest) print(note(`Latest version: ${latest}`));
		}
		return true;
	},

	"settings.getDokployVersion": (data, print) => {
		if (typeof data !== "string") return false;
		print(`${color.strong("Dokploy")} ${color.accent(clean(data))}`);
		return true;
	},

	"settings.health": (data, print) => {
		if (!isPlainObject(data) || typeof data.status !== "string") return false;
		if (data.status === "ok") {
			print(ok("Dokploy is healthy"));
			print(note("The API and its database are responding."));
		} else {
			print(
				`${color.warning(symbols.warning)} ${color.strong("Dokploy reported")} ${clean(data.status)}`,
			);
		}
		return true;
	},

	"settings.checkInfrastructureHealth": (data, print) => {
		if (!isPlainObject(data)) return false;
		const rows = Object.entries(data).filter(
			([, v]) => isPlainObject(v) && typeof v.status === "string",
		) as Array<[string, { status: string; message?: unknown }]>;
		if (rows.length === 0) return false;

		const names = rows.map(([key]) =>
			Object.hasOwn(STATUS_NAMES, key) ? STATUS_NAMES[key] : clean(key),
		);
		const width = Math.max(...names.map((n) => n.length));
		rows.forEach(([, value], i) => {
			const healthy = value.status === "healthy";
			const dot = healthy
				? color.success(symbols.dot)
				: color.danger(symbols.dot);
			const status = healthy
				? color.success(value.status)
				: color.danger(value.status);
			const message =
				typeof value.message === "string"
					? `  ${color.muted(clean(value.message))}`
					: "";
			print(`  ${dot} ${padEnd(names[i], width)}  ${status}${message}`);
		});
		return true;
	},

	"settings.cleanAll": (data, print) => {
		if (!isPlainObject(data) || data.status !== "scheduled") return false;
		print(ok("Cleanup started"));
		print(
			note(
				"Unused images, containers, volumes and build cache are removed in the background.",
			),
		);
		return true;
	},
};

const SPINNER_LABELS: Record<string, string> = {
	"settings.reloadServer": "Restarting Dokploy",
	"settings.reloadTraefik": "Restarting Traefik",
	"settings.updateServer": "Requesting update",
	"settings.getUpdateData": "Checking for updates",
	"settings.getDokployVersion": "Checking version",
	"settings.health": "Checking health",
	"settings.checkInfrastructureHealth": "Checking PostgreSQL and Traefik",
	"settings.cleanAll": "Starting cleanup",
};

export function presentResult(
	endpoint: string,
	data: unknown,
	print: Print,
): boolean {
	return PRESENTERS[endpoint]?.(data, print) ?? false;
}

export function spinnerLabel(endpoint: string): string | undefined {
	return SPINNER_LABELS[endpoint];
}

// Only errors where an open connection was closed. A refused connection
// means Dokploy was never reached, so nothing is restarting.
const DROPPED = new Set(["ECONNRESET", "EPIPE"]);

// Restarting Dokploy stops the process answering the request, so the
// connection usually drops before a reply arrives.
export function presentError(
	endpoint: string | undefined,
	err: unknown,
	print: Print,
): boolean {
	if (endpoint !== "settings.reloadServer" || !isAxiosError(err)) return false;
	const status = err.response?.status;
	const dropped =
		(!err.response && DROPPED.has(err.code ?? "")) ||
		err.message === "socket hang up" ||
		status === 502 ||
		status === 503 ||
		status === 504;
	if (!dropped) return false;

	print(
		`${color.warning(symbols.warning)} ${color.strong("Dokploy is restarting")}`,
	);
	print(
		note(
			"The connection closed while Dokploy restarted, which is expected for this command.",
		),
	);
	print(hint("Check it is back with: dokploy settings health"));
	return true;
}

let currentEndpoint: string | undefined;

export function setCurrentEndpoint(endpoint: string): void {
	currentEndpoint = endpoint;
}

export function getCurrentEndpoint(): string | undefined {
	return currentEndpoint;
}
