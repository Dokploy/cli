import { expect } from "chai";
import { describe, it } from "mocha";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { parseConfigFile } from "../../../src/lib/apply/parser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.join(__dirname, "..", "..", "fixtures");

describe("parseConfigFile", () => {
  it("parses a valid YAML file", async () => {
    const config = await parseConfigFile(path.join(fixturesDir, "valid.dokploy.yaml"));
    expect(config.name).to.equal("test-project");
    expect(config.apiVersion).to.equal("v1");
    expect(config.environments).to.have.lengthOf(1);
    expect(config.environments[0].name).to.equal("production");
    expect(config.environments[0].applications).to.have.lengthOf(1);
    expect(config.environments[0].postgres).to.have.lengthOf(1);
  });

  it("parses a minimal YAML file", async () => {
    const config = await parseConfigFile(path.join(fixturesDir, "minimal.dokploy.yaml"));
    expect(config.name).to.equal("minimal-project");
    expect(config.environments).to.have.lengthOf(1);
  });

  it("throws on non-existent file", async () => {
    try {
      await parseConfigFile("/nonexistent/file.yaml");
      expect.fail("should have thrown");
    } catch (err: any) {
      expect(err.message).to.include("not found");
    }
  });

  it("throws on invalid schema", async () => {
    try {
      await parseConfigFile(path.join(fixturesDir, "invalid-schema.dokploy.yaml"));
      expect.fail("should have thrown");
    } catch (err: any) {
      expect(err.message).to.include("Validation");
    }
  });
});
