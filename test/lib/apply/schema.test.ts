import { expect } from "chai";
import { describe, it } from "mocha";
import { dokployConfigSchema } from "../../../src/lib/apply/schema.js";

describe("dokployConfigSchema", () => {
  it("accepts a minimal valid config", () => {
    const config = {
      apiVersion: "v1",
      kind: "Project",
      name: "my-project",
      environments: [{ name: "production" }],
    };
    const result = dokployConfigSchema.safeParse(config);
    expect(result.success).to.be.true;
  });

  it("rejects missing name", () => {
    const config = {
      apiVersion: "v1",
      kind: "Project",
      environments: [{ name: "prod" }],
    };
    const result = dokployConfigSchema.safeParse(config);
    expect(result.success).to.be.false;
  });

  it("rejects unsupported apiVersion", () => {
    const config = {
      apiVersion: "v2",
      kind: "Project",
      name: "my-project",
      environments: [{ name: "prod" }],
    };
    const result = dokployConfigSchema.safeParse(config);
    expect(result.success).to.be.false;
  });

  it("rejects empty name", () => {
    const config = {
      apiVersion: "v1",
      kind: "Project",
      name: "",
      environments: [{ name: "prod" }],
    };
    const result = dokployConfigSchema.safeParse(config);
    expect(result.success).to.be.false;
  });

  it("rejects environments as non-array", () => {
    const config = {
      apiVersion: "v1",
      kind: "Project",
      name: "my-project",
      environments: "not-an-array",
    };
    const result = dokployConfigSchema.safeParse(config);
    expect(result.success).to.be.false;
  });

  it("validates application sourceType enum", () => {
    const config = {
      apiVersion: "v1",
      kind: "Project",
      name: "my-project",
      environments: [{
        name: "prod",
        applications: [{
          name: "app",
          sourceType: "invalid-source",
        }],
      }],
    };
    const result = dokployConfigSchema.safeParse(config);
    expect(result.success).to.be.false;
  });

  it("validates port protocol enum", () => {
    const config = {
      apiVersion: "v1",
      kind: "Project",
      name: "my-project",
      environments: [{
        name: "prod",
        applications: [{
          name: "app",
          ports: [{ publishedPort: 80, targetPort: 3000, protocol: "http" }],
        }],
      }],
    };
    const result = dokployConfigSchema.safeParse(config);
    expect(result.success).to.be.false;
  });

  it("accepts a full config with all resource types", () => {
    const config = {
      apiVersion: "v1",
      kind: "Project",
      name: "full-project",
      description: "A full project",
      environments: [{
        name: "production",
        applications: [{
          name: "web",
          sourceType: "github",
          buildType: "dockerfile",
          domains: [{ host: "example.com", port: 3000, https: true }],
          ports: [{ publishedPort: 80, targetPort: 3000, protocol: "tcp" }],
          mounts: [{ type: "volume", mountPath: "/data", volumeName: "vol" }],
          redirects: [{ regex: "^/a", replacement: "/b" }],
          security: [{ username: "admin", password: "pass" }],
          schedules: [{ name: "cron", cronExpression: "* * * * *", command: "echo hi" }],
        }],
        compose: [{
          name: "stack",
          sourceType: "raw",
          composeType: "docker-compose",
        }],
        postgres: [{
          name: "pg",
          dockerImage: "postgres:16",
          databaseName: "db",
          databaseUser: "user",
          databasePassword: "pass",
        }],
        mysql: [{
          name: "my",
          dockerImage: "mysql:8",
          databaseName: "db",
          databaseUser: "user",
          databasePassword: "pass",
          databaseRootPassword: "root",
        }],
        mariadb: [{
          name: "maria",
          dockerImage: "mariadb:11",
          databaseName: "db",
          databaseUser: "user",
          databasePassword: "pass",
          databaseRootPassword: "root",
        }],
        mongo: [{
          name: "mg",
          dockerImage: "mongo:7",
          databaseUser: "user",
          databasePassword: "pass",
        }],
        redis: [{
          name: "rd",
          dockerImage: "redis:7",
          databasePassword: "pass",
        }],
      }],
    };
    const result = dokployConfigSchema.safeParse(config);
    expect(result.success).to.be.true;
  });
});
