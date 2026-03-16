import { expect } from "chai";
import { describe, it } from "mocha";
import { formatAction, formatSummary } from "../../../src/lib/apply/reporter.js";
import type { Action, ApplyResult } from "../../../src/lib/apply/types.js";

describe("formatAction", () => {
  it("formats a create action", () => {
    const action: Action = { type: "create", resourceType: "application", name: "web-api", config: {} };
    const line = formatAction(action, 0);
    expect(line).to.include("web-api");
    expect(line).to.include("create");
  });

  it("formats an update action", () => {
    const action: Action = {
      type: "update", resourceType: "application", name: "web-api",
      config: {}, changes: { buildType: { from: "dockerfile", to: "nixpacks" } },
    };
    const line = formatAction(action, 0);
    expect(line).to.include("update");
  });

  it("formats an unchanged action", () => {
    const action: Action = { type: "unchanged", resourceType: "application", name: "web-api", config: {} };
    const line = formatAction(action, 0);
    expect(line).to.include("unchanged");
  });

  it("indents based on depth", () => {
    const action: Action = { type: "create", resourceType: "domain", name: "example.com", config: {} };
    const line = formatAction(action, 2);
    expect(line).to.match(/^\s{4}/);
  });
});

describe("formatSummary", () => {
  it("formats result counts", () => {
    const result: ApplyResult = { created: 3, updated: 1, unchanged: 2, failed: 0, errors: [] };
    const summary = formatSummary(result);
    expect(summary).to.include("3 created");
    expect(summary).to.include("1 updated");
    expect(summary).to.include("2 unchanged");
  });

  it("includes failure count when present", () => {
    const result: ApplyResult = { created: 1, updated: 0, unchanged: 0, failed: 1, errors: [{ resource: "app", error: "fail" }] };
    const summary = formatSummary(result);
    expect(summary).to.include("1 failed");
  });
});
