import { describe, expect, it } from "vitest";
import { formatChanges } from "../../src/lib/apply/reporter.js";

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
