import chalk from "chalk";

// Chalk does not read NO_COLOR on its own (Commander does), so honour it here
// to keep colors consistent between help output and command output.
if (process.env.NO_COLOR) {
	chalk.level = 0;
}

export function isInteractive(): boolean {
	return process.stdout.isTTY === true && process.env.TERM !== "dumb";
}

export function canAnimate(): boolean {
	return isInteractive() && process.stderr.isTTY === true;
}

export function terminalWidth(): number {
	return Math.max(process.stdout.columns || 100, 40);
}

function unicodeSupported(): boolean {
	if (process.platform !== "win32") return process.env.TERM !== "linux";
	return Boolean(
		process.env.WT_SESSION ||
			process.env.TERMINUS_SUBLIME ||
			process.env.TERM_PROGRAM === "vscode" ||
			process.env.TERM === "xterm-256color" ||
			process.env.TERM === "alacritty" ||
			process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm",
	);
}

const unicode = unicodeSupported();

export const symbols = {
	success: unicode ? "✓" : "√",
	error: unicode ? "✗" : "×",
	warning: unicode ? "⚠" : "!",
	info: unicode ? "ℹ" : "i",
	dot: unicode ? "●" : "*",
	pointer: unicode ? "›" : ">",
	bullet: unicode ? "•" : "-",
	dash: unicode ? "—" : "-",
	ellipsis: unicode ? "…" : "...",
	mask: unicode ? "••••••••" : "********",
	spinner: unicode
		? ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
		: ["-", "\\", "|", "/"],
};

export const color = {
	muted: (s: string) => chalk.dim(s),
	accent: (s: string) => chalk.cyan(s),
	strong: (s: string) => chalk.bold(s),
	success: (s: string) => chalk.green(s),
	warning: (s: string) => chalk.yellow(s),
	danger: (s: string) => chalk.red(s),
	info: (s: string) => chalk.blue(s),
};

// biome-ignore lint/suspicious/noControlCharactersInRegex: matching ANSI escapes is the point
const ANSI = /\u001b\[[0-9;]*m/g;

export function stripAnsi(s: string): string {
	return s.replace(ANSI, "");
}

export function visibleLength(s: string): number {
	return [...stripAnsi(s)].length;
}

export function truncate(s: string, max: number): string {
	const chars = [...s];
	if (chars.length <= max) return s;
	if (max <= 1) return chars.slice(0, max).join("");
	return `${chars.slice(0, max - 1).join("")}${symbols.ellipsis}`;
}

export function padEnd(s: string, width: number): string {
	const gap = width - visibleLength(s);
	return gap > 0 ? s + " ".repeat(gap) : s;
}
