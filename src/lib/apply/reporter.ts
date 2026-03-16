import chalk from "chalk";
import type { Action, ApplyResult } from "./types.js";

const STATUS_COLORS: Record<string, (s: string) => string> = {
  create: chalk.green,
  update: chalk.yellow,
  unchanged: chalk.gray,
};

const STATUS_LABELS: Record<string, string> = {
  create: "create",
  update: "update",
  unchanged: "unchanged",
};

export function formatAction(action: Action, depth: number): string {
  const indent = "  ".repeat(depth);
  const colorFn = STATUS_COLORS[action.type] ?? chalk.white;
  const label = STATUS_LABELS[action.type] ?? action.type;
  const resourceLabel = capitalizeFirst(action.resourceType);

  let line = `${indent}${resourceLabel} "${action.name}"`;
  line = line.padEnd(50);
  line += colorFn(`[${label}]`);

  if (action.type === "unchanged") {
    line += chalk.gray(" (no changes)");
  }

  return line;
}

export function formatChanges(action: Action, depth: number): string[] {
  if (!action.changes) return [];
  const indent = "  ".repeat(depth + 1);
  return Object.entries(action.changes).map(([key, { from, to }]) =>
    `${indent}${chalk.gray(key)}: ${chalk.red(String(from))} → ${chalk.green(String(to))}`,
  );
}

export function formatSummary(result: ApplyResult): string {
  const parts: string[] = [];
  if (result.created > 0) parts.push(chalk.green(`${result.created} created`));
  if (result.updated > 0) parts.push(chalk.yellow(`${result.updated} updated`));
  if (result.unchanged > 0) parts.push(chalk.gray(`${result.unchanged} unchanged`));
  if (result.failed > 0) parts.push(chalk.red(`${result.failed} failed`));
  return `\nSummary: ${parts.join(", ")}`;
}

export function printPlan(plan: { project: Action; environments: Action[] }, dryRun: boolean, verbose: boolean): void {
  if (dryRun) {
    console.log(chalk.cyan("\n(dry-run) Planned changes:\n"));
  } else {
    console.log("");
  }

  console.log(formatAction(plan.project, 0));

  for (const env of plan.environments) {
    console.log(formatAction(env, 1));
    if (env.children) {
      for (const resource of env.children) {
        console.log(formatAction(resource, 2));
        if (verbose && resource.changes) {
          for (const line of formatChanges(resource, 2)) {
            console.log(line);
          }
        }
        if (resource.children) {
          for (const child of resource.children) {
            console.log(formatAction(child, 3));
            if (verbose && child.changes) {
              for (const line of formatChanges(child, 3)) {
                console.log(line);
              }
            }
          }
        }
      }
    }
  }
}

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
