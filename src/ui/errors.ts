import { isAxiosError } from "axios";
import chalk from "chalk";
import { clean } from "./format.js";
import { getCurrentEndpoint, presentError } from "./presenters.js";
import { canAnimate, color, symbols } from "./style.js";

export interface FriendlyError {
	title: string;
	status?: number;
	details: string[];
	hints: string[];
}

const STATUS_TITLES: Record<number, string> = {
	400: "Invalid request",
	401: "Not authorized",
	403: "Permission denied",
	404: "Not found",
	405: "Method not allowed",
	408: "Request timed out",
	409: "Conflict",
	413: "Request too large",
	429: "Too many requests",
	500: "Server error",
	502: "Bad gateway",
	503: "Service unavailable",
	504: "Gateway timeout",
};

const NETWORK_ERRORS: Record<string, { title: string; hint: string }> = {
	ECONNREFUSED: {
		title: "Could not connect to {host}",
		hint: "Check that the server is running and the URL is correct.",
	},
	ENOTFOUND: {
		title: "Could not resolve {host}",
		hint: "Check the server URL for typos and your DNS or network connection.",
	},
	EAI_AGAIN: {
		title: "Could not resolve {host}",
		hint: "Check your DNS or network connection, then try again.",
	},
	ETIMEDOUT: {
		title: "Timed out connecting to {host}",
		hint: "The server did not respond. Check the URL and your network.",
	},
	ECONNABORTED: {
		title: "Request to {host} timed out",
		hint: "The server took too long to respond. Try again in a moment.",
	},
	ECONNRESET: {
		title: "Connection to {host} was reset",
		hint: "The server closed the connection. Try again in a moment.",
	},
};

const TLS_CODES =
	/^(CERT_|DEPTH_ZERO_SELF_SIGNED_CERT|SELF_SIGNED_CERT_IN_CHAIN|UNABLE_TO_VERIFY_LEAF_SIGNATURE|ERR_TLS_CERT)/;

function hostOf(url: string | undefined): string {
	if (!url) return "the server";
	try {
		return new URL(url).host;
	} catch {
		return url;
	}
}

function parseServerError(body: unknown): {
	message?: string;
	fields: string[];
} {
	const fields: string[] = [];
	if (typeof body !== "object" || body === null) return { fields };
	const b = body as Record<string, any>;
	const err = b.error?.json ?? b.error ?? b;
	let message: string | undefined =
		typeof err?.message === "string" ? err.message : undefined;

	const fieldErrors = err?.data?.zodError?.fieldErrors;
	if (fieldErrors && typeof fieldErrors === "object") {
		for (const [field, msgs] of Object.entries(fieldErrors)) {
			const list = Array.isArray(msgs) ? msgs : [msgs];
			fields.push(`--${field}: ${list.join(", ")}`);
		}
	}

	// Zod validation errors arrive as a JSON-encoded list of issues.
	if (message?.trim().startsWith("[")) {
		try {
			const issues = JSON.parse(message) as Array<{
				path?: Array<string | number>;
				message?: string;
			}>;
			if (Array.isArray(issues)) {
				if (fields.length === 0) {
					for (const issue of issues) {
						const path = issue.path?.join(".");
						fields.push(
							path ? `--${path}: ${issue.message}` : String(issue.message),
						);
					}
				}
				message = undefined;
			}
		} catch {
			// Not JSON after all: keep the message as is.
		}
	}
	return {
		message: message === undefined ? undefined : clean(message),
		fields: fields.map(clean),
	};
}

export function describeError(err: unknown): FriendlyError {
	if (isAxiosError(err)) {
		// `dokploy auth` calls a full URL without a baseURL; use it for the host.
		const server = (err.config?.baseURL ?? err.config?.url ?? "").replace(
			/\/api\/?$/,
			"",
		);
		if (err.response) {
			const status = err.response.status;
			const { message, fields } = parseServerError(err.response.data);
			const title =
				STATUS_TITLES[status] ??
				(status >= 500 ? "Server error" : "Request failed");
			const details = [
				...(message && message !== title ? [message] : []),
				...fields,
			];
			const hints: string[] = [];
			if (status === 401) {
				hints.push(
					"Your API key was rejected. Create a new one in the Dokploy dashboard,",
				);
				hints.push(
					"then run: dokploy auth --url <server-url> --token <api-key>",
				);
			} else if (status === 403) {
				hints.push("This API key's user does not have access to this action.");
			} else if (status === 404 && !message) {
				hints.push(
					`This endpoint was not found on ${hostOf(server)}. Check the server URL,`,
				);
				hints.push("and that your Dokploy server and CLI versions match.");
			} else if (status >= 500) {
				hints.push("Check the Dokploy server logs for details.");
			}
			return { title, status, details, hints };
		}

		const code = err.code ?? "";
		const known = Object.hasOwn(NETWORK_ERRORS, code)
			? NETWORK_ERRORS[code]
			: undefined;
		if (known) {
			return {
				title: known.title.replace("{host}", hostOf(server)),
				details: [],
				hints: [known.hint],
			};
		}
		if (TLS_CODES.test(code)) {
			return {
				title: `TLS certificate for ${hostOf(server)} could not be verified`,
				details: [err.message],
				hints: ["Check the server's HTTPS certificate."],
			};
		}
		return { title: err.message, details: [], hints: [] };
	}

	const message = err instanceof Error ? err.message : String(err);
	return { title: message, details: [], hints: [] };
}

export function printFriendlyError(error: FriendlyError): void {
	const status = error.status ? ` ${color.muted(`(${error.status})`)}` : "";
	const lines = [
		`${color.danger(symbols.error)} ${color.strong(error.title)}${status}`,
		...error.details.map((d) => `  ${d}`),
		...error.hints.map((h) => `  ${color.muted(`${symbols.pointer} ${h}`)}`),
	];
	console.error(lines.join("\n"));
}

// Outside a terminal, print exactly what the CLI always printed.
export function printError(err: unknown): void {
	if (!canAnimate()) {
		const message = err instanceof Error ? err.message : String(err);
		console.error(chalk.red(message));
		return;
	}
	if (presentError(getCurrentEndpoint(), err, (line) => console.error(line))) {
		return;
	}
	printFriendlyError(describeError(err));
}
