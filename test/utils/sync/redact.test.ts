import { expect } from "chai";
import { redactSensitiveFields, isRedacted } from "../../../src/utils/sync/redact.js";
import { REDACTED_VALUE } from "../../../src/utils/sync/constants.js";

describe("redactSensitiveFields", () => {
	it("should redact top-level sensitive fields", () => {
		const input = {
			name: "my-app",
			password: "secret123",
			databasePassword: "dbpass",
			env: "KEY=VALUE",
		};
		const result = redactSensitiveFields(input);

		expect(result.name).to.equal("my-app");
		expect(result.password).to.equal(REDACTED_VALUE);
		expect(result.databasePassword).to.equal(REDACTED_VALUE);
		expect(result.env).to.equal(REDACTED_VALUE);
	});

	it("should not redact null or undefined sensitive fields", () => {
		const input = {
			name: "my-app",
			password: null,
			databasePassword: undefined,
		};
		const result = redactSensitiveFields(input);

		expect(result.password).to.equal(null);
		expect(result.databasePassword).to.equal(undefined);
	});

	it("should redact nested sensitive fields in objects", () => {
		const input = {
			name: "my-app",
			security: {
				username: "admin",
				password: "secret",
			},
		};
		const result = redactSensitiveFields(input);

		expect((result.security as Record<string, unknown>).username).to.equal("admin");
		expect((result.security as Record<string, unknown>).password).to.equal(REDACTED_VALUE);
	});

	it("should redact sensitive fields inside arrays", () => {
		const input = {
			mounts: [
				{ mountId: "m1", content: "data" },
				{ mountId: "m2", password: "secret" },
			],
		};
		const result = redactSensitiveFields(input);
		const mounts = result.mounts as Array<Record<string, unknown>>;

		expect(mounts[0].content).to.equal("data");
		expect(mounts[1].password).to.equal(REDACTED_VALUE);
	});

	it("should preserve non-sensitive fields", () => {
		const input = {
			name: "test",
			replicas: 3,
			autoDeploy: true,
			dockerImage: "nginx:latest",
		};
		const result = redactSensitiveFields(input);

		expect(result).to.deep.equal(input);
	});
});

describe("isRedacted", () => {
	it("should return true for redacted values", () => {
		expect(isRedacted(REDACTED_VALUE)).to.be.true;
	});

	it("should return false for normal values", () => {
		expect(isRedacted("hello")).to.be.false;
		expect(isRedacted(123)).to.be.false;
		expect(isRedacted(null)).to.be.false;
	});
});
