import { canAnimate, color, symbols, truncate } from "./style.js";

let quiet = false;

export function setQuiet(value: boolean): void {
	quiet = value;
}

interface ActiveSpinner {
	startTimer: NodeJS.Timeout;
	frameTimer?: NodeJS.Timeout;
	visible: boolean;
}

let active: ActiveSpinner | null = null;

const SHOW_AFTER_MS = 120;
const FRAME_MS = 80;
const HIDE_CURSOR = "\u001b[?25l";
const SHOW_CURSOR = "\u001b[?25h";
const CLEAR_LINE = "\r\u001b[2K";

function restoreCursor(): void {
	process.stderr.write(SHOW_CURSOR);
}

// Exit codes match what the shell reports for a process killed by the signal.
const SIGNAL_EXIT_CODES = { SIGINT: 130, SIGTERM: 143, SIGHUP: 129 } as const;
type Signal = keyof typeof SIGNAL_EXIT_CODES;
const SIGNALS = Object.keys(SIGNAL_EXIT_CODES) as Signal[];

function onSignal(signal: Signal): void {
	stopSpinner();
	process.exit(SIGNAL_EXIT_CODES[signal]);
}

export async function withSpinner<T>(
	label: string,
	task: () => Promise<T>,
): Promise<T> {
	if (quiet || active || !canAnimate()) return task();

	// A line wider than the terminal wraps, and \r then only returns to the
	// start of the last row, so frames pile up. Keep it within one row.
	const text = truncate(
		label,
		Math.max((process.stderr.columns || 80) - 3, 10),
	);
	let frame = 0;
	const draw = () => {
		const mark = symbols.spinner[frame++ % symbols.spinner.length];
		process.stderr.write(
			`${CLEAR_LINE}${color.accent(mark)} ${color.muted(text)}`,
		);
	};

	const spinner: ActiveSpinner = {
		visible: false,
		startTimer: setTimeout(() => {
			spinner.visible = true;
			process.stderr.write(HIDE_CURSOR);
			process.once("exit", restoreCursor);
			for (const signal of SIGNALS) process.once(signal, onSignal);
			draw();
			spinner.frameTimer = setInterval(draw, FRAME_MS);
		}, SHOW_AFTER_MS),
	};
	active = spinner;

	try {
		return await task();
	} finally {
		stopSpinner();
	}
}

export function stopSpinner(): void {
	if (!active) return;
	clearTimeout(active.startTimer);
	if (active.frameTimer) clearInterval(active.frameTimer);
	if (active.visible) {
		process.stderr.write(CLEAR_LINE + SHOW_CURSOR);
		process.removeListener("exit", restoreCursor);
		for (const signal of SIGNALS) process.removeListener(signal, onSignal);
	}
	active = null;
}
