import { describe, expect, it } from "vitest";
import { diffChildren, diffResource } from "../../src/lib/apply/differ.js";

describe("diffResource", () => {
	it("plans a create when nothing matches remotely", () => {
		expect(
			diffResource("application", "web", { replicas: 2 }, undefined).type,
		).toBe("create");
	});

	it("only compares fields present in the config", () => {
		const action = diffResource(
			"application",
			"web",
			{ buildType: "dockerfile", args: ["--port", "80"] },
			{
				applicationId: "a1",
				buildType: "dockerfile",
				args: ["--port", "80"],
				replicas: 3,
			},
		);
		expect(action).toMatchObject({ type: "unchanged", remoteId: "a1" });
	});

	it("records changed fields", () => {
		const action = diffResource(
			"application",
			"web",
			{ replicas: 2 },
			{ applicationId: "a1", replicas: 1 },
		);
		expect(action.type).toBe("update");
		expect(action.changes).toEqual({ replicas: { from: 1, to: 2 } });
	});

	it("never diffs ignored fields", () => {
		const action = diffResource(
			"postgres",
			"db",
			{ databasePassword: "new", dockerImage: "postgres:16" },
			{ postgresId: "p1", databasePassword: "old", dockerImage: "postgres:16" },
			["databasePassword"],
		);
		expect(action.type).toBe("unchanged");
	});
});

describe("diffChildren", () => {
	it("matches compose domains by host and service name", () => {
		const actions = diffChildren(
			"domains",
			"compose",
			[
				{ host: "example.com", serviceName: "web", port: 80 },
				{ host: "example.com", serviceName: "api", port: 3000 },
			],
			[{ domainId: "d1", host: "example.com", serviceName: "web", port: 8080 }],
		);
		expect(actions.map(({ type, name }) => [type, name])).toEqual([
			["update", "example.com:web"],
			["create", "example.com:api"],
		]);
	});
});
