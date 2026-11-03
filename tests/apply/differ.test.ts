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

describe("diffResource with swarm update config", () => {
	it("compares the update config by value", () => {
		const remote = {
			applicationId: "a1",
			updateConfigSwarm: { Parallelism: 1, Order: "start-first" },
		};
		expect(
			diffResource(
				"application",
				"api",
				{ updateConfigSwarm: { Parallelism: 1, Order: "start-first" } },
				remote,
			).type,
		).toBe("unchanged");
		expect(
			diffResource(
				"application",
				"api",
				{ updateConfigSwarm: { Parallelism: 1, Order: "stop-first" } },
				remote,
			).changes,
		).toEqual({
			updateConfigSwarm: {
				from: { Parallelism: 1, Order: "start-first" },
				to: { Parallelism: 1, Order: "stop-first" },
			},
		});
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

	it("matches application domains by host and path", () => {
		const actions = diffChildren(
			"domains",
			"application",
			[
				{ host: "example.com", port: 8888 },
				{ host: "example.com", path: "/ws", port: 8889 },
				{ host: "example.com", path: "/sim", port: 8890 },
			],
			[
				{ domainId: "d1", host: "example.com", path: "/", port: 8888 },
				{ domainId: "d2", host: "example.com", path: "/ws", port: 9999 },
			],
		);
		expect(actions.map(({ type, name }) => [type, name])).toEqual([
			["unchanged", "example.com"],
			["update", "example.com/ws"],
			["create", "example.com/sim"],
		]);
	});
});
