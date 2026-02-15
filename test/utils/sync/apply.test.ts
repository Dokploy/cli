import { expect } from "chai";
import { buildApplyPlan } from "../../../src/utils/sync/apply.js";
import type { Change } from "../../../src/utils/sync/diff.js";
import { REDACTED_VALUE } from "../../../src/utils/sync/constants.js";

describe("buildApplyPlan", () => {
	it("should create update actions for modified resources", () => {
		const changes: Change[] = [
			{
				type: "modified",
				path: "MyProject/Prod/applications/web",
				resourceType: "application",
				resourceId: "app-1",
				fields: [
					{ field: "replicas", local: 5, remote: 2 },
					{ field: "dockerImage", local: "nginx:2", remote: "nginx:1" },
				],
			},
		];

		const plan = buildApplyPlan(changes);

		expect(plan).to.have.length(1);
		expect(plan[0].type).to.equal("update");
		if (plan[0].type === "update") {
			expect(plan[0].endpoint).to.equal("application.update");
			expect(plan[0].payload.applicationId).to.equal("app-1");
			expect(plan[0].payload.replicas).to.equal(5);
			expect(plan[0].payload.dockerImage).to.equal("nginx:2");
		}
	});

	it("should skip added resources (create not supported in v1)", () => {
		const changes: Change[] = [
			{
				type: "added",
				path: "MyProject/Prod/applications/new-app",
				resourceType: "application",
				resourceId: "app-new",
			},
		];

		const plan = buildApplyPlan(changes);

		expect(plan).to.have.length(1);
		expect(plan[0].type).to.equal("skip");
		if (plan[0].type === "skip") {
			expect(plan[0].reason).to.include("Create not supported");
		}
	});

	it("should skip removed resources (delete not supported in v1)", () => {
		const changes: Change[] = [
			{
				type: "removed",
				path: "MyProject/Prod/applications/old-app",
				resourceType: "application",
				resourceId: "app-old",
			},
		];

		const plan = buildApplyPlan(changes);

		expect(plan).to.have.length(1);
		expect(plan[0].type).to.equal("skip");
		if (plan[0].type === "skip") {
			expect(plan[0].reason).to.include("Delete not supported");
		}
	});

	it("should filter out redacted fields from update payload", () => {
		const changes: Change[] = [
			{
				type: "modified",
				path: "MyProject/Prod/applications/web",
				resourceType: "application",
				resourceId: "app-1",
				fields: [
					{ field: "replicas", local: 5, remote: 2 },
					{ field: "env", local: REDACTED_VALUE, remote: "KEY=val" },
				],
			},
		];

		const plan = buildApplyPlan(changes);

		expect(plan).to.have.length(1);
		expect(plan[0].type).to.equal("update");
		if (plan[0].type === "update") {
			expect(plan[0].payload.replicas).to.equal(5);
			expect(plan[0].payload.env).to.be.undefined;
		}
	});

	it("should skip entirely if all changed fields are redacted", () => {
		const changes: Change[] = [
			{
				type: "modified",
				path: "MyProject/Prod/applications/web",
				resourceType: "application",
				resourceId: "app-1",
				fields: [
					{ field: "env", local: REDACTED_VALUE, remote: "KEY=val" },
					{ field: "password", local: REDACTED_VALUE, remote: "pass" },
				],
			},
		];

		const plan = buildApplyPlan(changes);

		expect(plan).to.have.length(1);
		expect(plan[0].type).to.equal("skip");
		if (plan[0].type === "skip") {
			expect(plan[0].reason).to.include("redacted");
		}
	});

	it("should map all database types to correct endpoints", () => {
		const dbTypes = [
			{ type: "postgres", endpoint: "postgres.update", idField: "postgresId" },
			{ type: "mysql", endpoint: "mysql.update", idField: "mysqlId" },
			{ type: "mariadb", endpoint: "mariadb.update", idField: "mariadbId" },
			{ type: "mongo", endpoint: "mongo.update", idField: "mongoId" },
			{ type: "redis", endpoint: "redis.update", idField: "redisId" },
		];

		for (const { type, endpoint, idField } of dbTypes) {
			const changes: Change[] = [
				{
					type: "modified",
					path: `Proj/Env/databases/db`,
					resourceType: type,
					resourceId: "db-1",
					fields: [{ field: "dockerImage", local: "new", remote: "old" }],
				},
			];

			const plan = buildApplyPlan(changes);
			expect(plan).to.have.length(1);
			expect(plan[0].type).to.equal("update");
			if (plan[0].type === "update") {
				expect(plan[0].endpoint).to.equal(endpoint);
				expect(plan[0].payload[idField]).to.equal("db-1");
			}
		}
	});
});
