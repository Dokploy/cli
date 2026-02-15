import { expect } from "chai";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { writeStateToDisk, readStateFromDisk } from "../../../src/utils/sync/yaml-io.js";
import type { SyncState } from "../../../src/utils/sync/types.js";

function makeSampleState(): SyncState {
	return {
		projects: [
			{
				projectId: "proj-1",
				name: "My Project",
				description: "A test project",
				environments: [
					{
						environmentId: "env-1",
						name: "Production",
						description: "Prod env",
						applications: [
							{
								applicationId: "app-1",
								name: "web-app",
								appName: "web-app",
								replicas: 2,
								dockerImage: "nginx:latest",
								env: "KEY=VALUE\nKEY2=VALUE2",
							},
						],
						compose: [
							{
								composeId: "comp-1",
								name: "stack",
								appName: "stack",
								composeFile: "version: '3'\nservices:\n  web:\n    image: nginx",
							},
						],
						databases: [
							{
								postgresId: "pg-1",
								type: "postgres",
								name: "main-db",
								appName: "main-db",
								databasePassword: "secret",
								dockerImage: "postgres:15",
							},
						],
					},
				],
			},
		],
	};
}

describe("yaml-io round-trip", () => {
	let tmpDir: string;

	beforeEach(() => {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dokploy-test-"));
	});

	afterEach(() => {
		fs.rmSync(tmpDir, { recursive: true, force: true });
	});

	it("should write and read back the same structure", () => {
		const state = makeSampleState();
		writeStateToDisk(state, tmpDir, false);

		const result = readStateFromDisk(tmpDir);

		expect(result.projects).to.have.length(1);
		expect(result.projects[0].name).to.equal("My Project");
		expect(result.projects[0].environments).to.have.length(1);

		const env = result.projects[0].environments[0];
		expect(env.name).to.equal("Production");
		expect(env.applications).to.have.length(1);
		expect(env.compose).to.have.length(1);
		expect(env.databases).to.have.length(1);
	});

	it("should preserve application fields through round-trip", () => {
		const state = makeSampleState();
		writeStateToDisk(state, tmpDir, false);

		const result = readStateFromDisk(tmpDir);
		const app = result.projects[0].environments[0].applications[0];

		expect(app.name).to.equal("web-app");
		expect(app.replicas).to.equal(2);
		expect(app.dockerImage).to.equal("nginx:latest");
		expect(app.env).to.equal("KEY=VALUE\nKEY2=VALUE2");
	});

	it("should strip ephemeral fields from output", () => {
		const state = makeSampleState();
		(state.projects[0].environments[0].applications[0] as Record<string, unknown>).createdAt = "2024-01-01";
		(state.projects[0].environments[0].applications[0] as Record<string, unknown>).applicationStatus = "running";

		writeStateToDisk(state, tmpDir, false);
		const result = readStateFromDisk(tmpDir);
		const app = result.projects[0].environments[0].applications[0] as Record<string, unknown>;

		expect(app.createdAt).to.be.undefined;
		expect(app.applicationStatus).to.be.undefined;
		expect(app.name).to.equal("web-app");
	});

	it("should redact sensitive fields when redact=true", () => {
		const state = makeSampleState();
		writeStateToDisk(state, tmpDir, true);

		const result = readStateFromDisk(tmpDir);
		const app = result.projects[0].environments[0].applications[0] as Record<string, unknown>;
		const db = result.projects[0].environments[0].databases[0] as Record<string, unknown>;

		expect(app.env).to.equal("*** REDACTED ***");
		expect(db.databasePassword).to.equal("*** REDACTED ***");
	});

	it("should create the correct directory structure", () => {
		const state = makeSampleState();
		writeStateToDisk(state, tmpDir, false);

		const projectDir = path.join(tmpDir, "projects", "my-project");
		expect(fs.existsSync(path.join(projectDir, "project.yaml"))).to.be.true;

		const envDir = path.join(projectDir, "environments", "production");
		expect(fs.existsSync(path.join(envDir, "environment.yaml"))).to.be.true;
		expect(fs.existsSync(path.join(envDir, "applications", "webapp.yaml"))).to.be.true;
		expect(fs.existsSync(path.join(envDir, "compose", "stack.yaml"))).to.be.true;
		expect(fs.existsSync(path.join(envDir, "databases", "maindb.yaml"))).to.be.true;
	});

	it("should not create empty resource directories", () => {
		const state = makeSampleState();
		state.projects[0].environments[0].compose = [];
		state.projects[0].environments[0].databases = [];

		writeStateToDisk(state, tmpDir, false);

		const envDir = path.join(tmpDir, "projects", "my-project", "environments", "production");
		expect(fs.existsSync(path.join(envDir, "applications"))).to.be.true;
		expect(fs.existsSync(path.join(envDir, "compose"))).to.be.false;
		expect(fs.existsSync(path.join(envDir, "databases"))).to.be.false;
	});

	it("should return empty state for non-existent directory", () => {
		const result = readStateFromDisk("/tmp/nonexistent-dir-12345");
		expect(result.projects).to.have.length(0);
	});

	it("should handle name collisions by appending ID prefix", () => {
		const state: SyncState = {
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
									applicationId: "aaa111",
									name: "web",
									appName: "web-1",
									replicas: 1,
								},
								{
									applicationId: "bbb222",
									name: "web",
									appName: "web-2",
									replicas: 2,
								},
							],
							compose: [],
							databases: [],
						},
					],
				},
			],
		};

		writeStateToDisk(state, tmpDir, false);

		const appsDir = path.join(tmpDir, "projects", "my-project", "environments", "production", "applications");
		const files = fs.readdirSync(appsDir).sort();
		expect(files).to.have.length(2);
		// One gets plain name, the other gets ID suffix to avoid collision
		const plain = files.find((f) => f === "web.yaml");
		const suffixed = files.find((f) => f !== "web.yaml" && f.startsWith("web-"));
		expect(plain).to.equal("web.yaml");
		expect(suffixed).to.match(/^web-.*\.yaml$/);
	});
});
