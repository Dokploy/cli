import { expect } from "chai";
import { computeDiff } from "../../../src/utils/sync/diff.js";
import type { SyncState } from "../../../src/utils/sync/types.js";

function makeState(overrides?: Partial<SyncState>): SyncState {
	return {
		projects: [
			{
				projectId: "proj-1",
				name: "My Project",
				environments: [
					{
						environmentId: "env-1",
						name: "Production",
						applications: [
							{
								applicationId: "app-1",
								name: "web-app",
								appName: "web-app",
								replicas: 2,
								dockerImage: "nginx:latest",
							},
						],
						compose: [],
						databases: [
							{
								postgresId: "pg-1",
								type: "postgres",
								name: "main-db",
								appName: "main-db",
								dockerImage: "postgres:15",
							},
						],
					},
				],
			},
		],
		...overrides,
	};
}

describe("computeDiff", () => {
	it("should return no changes when states are identical", () => {
		const state = makeState();
		const changes = computeDiff(state, state);
		expect(changes).to.have.length(0);
	});

	it("should detect modified fields on an application", () => {
		const local = makeState();
		const remote = makeState();
		local.projects[0].environments[0].applications[0].replicas = 5;

		const changes = computeDiff(local, remote);

		expect(changes).to.have.length(1);
		expect(changes[0].type).to.equal("modified");
		expect(changes[0].resourceType).to.equal("application");
		expect(changes[0].resourceId).to.equal("app-1");
		expect(changes[0].fields).to.have.length(1);
		expect(changes[0].fields![0].field).to.equal("replicas");
		expect(changes[0].fields![0].local).to.equal(5);
		expect(changes[0].fields![0].remote).to.equal(2);
	});

	it("should detect modified fields on a database", () => {
		const local = makeState();
		const remote = makeState();
		local.projects[0].environments[0].databases[0].dockerImage = "postgres:16";

		const changes = computeDiff(local, remote);

		expect(changes).to.have.length(1);
		expect(changes[0].type).to.equal("modified");
		expect(changes[0].resourceType).to.equal("postgres");
		expect(changes[0].fields![0].field).to.equal("dockerImage");
	});

	it("should detect local-only resources as added", () => {
		const local = makeState();
		const remote = makeState();
		remote.projects[0].environments[0].applications = [];

		const changes = computeDiff(local, remote);

		expect(changes).to.have.length(1);
		expect(changes[0].type).to.equal("added");
		expect(changes[0].resourceId).to.equal("app-1");
	});

	it("should detect remote-only resources as removed", () => {
		const local = makeState();
		const remote = makeState();
		local.projects[0].environments[0].databases = [];

		const changes = computeDiff(local, remote);

		expect(changes).to.have.length(1);
		expect(changes[0].type).to.equal("removed");
		expect(changes[0].resourceId).to.equal("pg-1");
	});

	it("should ignore ephemeral fields like createdAt", () => {
		const local = makeState();
		const remote = makeState();
		(local.projects[0].environments[0].applications[0] as Record<string, unknown>).createdAt = "2024-01-01";
		(remote.projects[0].environments[0].applications[0] as Record<string, unknown>).createdAt = "2024-06-01";

		const changes = computeDiff(local, remote);
		expect(changes).to.have.length(0);
	});

	it("should skip redacted local fields in diff", () => {
		const local = makeState();
		const remote = makeState();
		(local.projects[0].environments[0].applications[0] as Record<string, unknown>).env = "*** REDACTED ***";
		(remote.projects[0].environments[0].applications[0] as Record<string, unknown>).env = "REAL=value";

		const changes = computeDiff(local, remote);
		// diffFields skips fields where local value is redacted
		expect(changes).to.have.length(0);
	});
});
