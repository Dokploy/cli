import chalk from "chalk";
import { describe, expect, it } from "vitest";
import {
	formatChanges,
	formatErrors,
	formatPlan,
	formatSummary,
} from "../../src/lib/apply/reporter.js";

chalk.level = 0;

describe("formatChanges", () => {
	it("never prints secret values", () => {
		const lines = formatChanges(
			{
				type: "update",
				resourceType: "security",
				name: "admin",
				config: {},
				changes: {
					password: { from: "old-secret", to: "new-secret" },
					username: { from: "admin", to: "root" },
				},
			},
			0,
		).join("\n");

		expect(lines).not.toContain("secret");
		expect(lines).toContain('"admin" → "root"');
	});
});

describe("formatPlan", () => {
	const plan = {
		project: {
			type: "unchanged" as const,
			resourceType: "project",
			name: "demo",
			config: {},
		},
		environments: [
			{
				type: "update" as const,
				resourceType: "environment",
				name: "production",
				config: {},
				changes: { description: { from: null, to: "live" } },
				children: [
					{
						type: "create" as const,
						resourceType: "redis",
						name: "cache",
						config: {},
					},
				],
			},
		],
	};

	it("prints the tree with each action's status", () => {
		const lines = formatPlan(plan, false).split("\n").filter(Boolean);

		expect(lines).toHaveLength(3);
		expect(lines[0]).toMatch(/^Project "demo"\s+\[unchanged\] \(no changes\)$/);
		expect(lines[1]).toMatch(/^ {2}Environment "production"\s+\[update\]$/);
		expect(lines[2]).toMatch(/^ {4}Redis "cache"\s+\[create\]$/);
	});

	it("adds field-level changes when verbose", () => {
		expect(formatPlan(plan, true)).toContain('description: null → "live"');
	});
});

describe("formatSummary and formatErrors", () => {
	it("lists only non-zero counts and every error", () => {
		const result = {
			created: 2,
			updated: 0,
			unchanged: 5,
			failed: 1,
			errors: [{ resource: 'Redis "cache"', error: "boom" }],
		};

		expect(formatSummary(result)).toBe(
			"\nSummary: 2 created, 5 unchanged, 1 failed",
		);
		expect(formatErrors(result)).toContain('Redis "cache": boom');
	});
});
