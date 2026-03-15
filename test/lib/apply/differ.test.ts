import { expect } from "chai";
import { describe, it } from "mocha";
import { diffResource, diffChildren } from "../../../src/lib/apply/differ.js";

describe("diffResource", () => {
  it("returns 'create' when no remote match exists", () => {
    const action = diffResource(
      "application",
      "web-api",
      { sourceType: "github", buildType: "dockerfile" },
      undefined,
    );
    expect(action.type).to.equal("create");
    expect(action.name).to.equal("web-api");
  });

  it("returns 'unchanged' when config matches remote", () => {
    const config = { sourceType: "github", buildType: "dockerfile" };
    const remote = { applicationId: "abc", sourceType: "github", buildType: "dockerfile" };
    const action = diffResource("application", "web-api", config, remote);
    expect(action.type).to.equal("unchanged");
  });

  it("returns 'update' when config differs from remote", () => {
    const config = { sourceType: "github", buildType: "nixpacks" };
    const remote = { applicationId: "abc", sourceType: "github", buildType: "dockerfile" };
    const action = diffResource("application", "web-api", config, remote);
    expect(action.type).to.equal("update");
    expect(action.changes).to.have.property("buildType");
    expect(action.changes!.buildType).to.deep.equal({ from: "dockerfile", to: "nixpacks" });
  });

  it("ignores ID fields and undefined config values when diffing", () => {
    const config = { sourceType: "github" };
    const remote = { applicationId: "abc", sourceType: "github", buildType: "nixpacks" };
    const action = diffResource("application", "web-api", config, remote);
    expect(action.type).to.equal("unchanged");
  });
});

describe("diffChildren", () => {
  it("marks unmatched local configs as create", () => {
    const local = [{ host: "api.example.com", port: 3000 }];
    const remote: any[] = [];
    const actions = diffChildren("domain", local, remote, (item) => item.host as string);
    expect(actions).to.have.lengthOf(1);
    expect(actions[0].type).to.equal("create");
  });

  it("marks matched and unchanged as unchanged", () => {
    const local = [{ host: "api.example.com", port: 3000 }];
    const remote = [{ domainId: "d1", host: "api.example.com", port: 3000 }];
    const actions = diffChildren("domain", local, remote, (item) => item.host as string);
    expect(actions).to.have.lengthOf(1);
    expect(actions[0].type).to.equal("unchanged");
  });

  it("marks matched but changed as update", () => {
    const local = [{ host: "api.example.com", port: 8080 }];
    const remote = [{ domainId: "d1", host: "api.example.com", port: 3000 }];
    const actions = diffChildren("domain", local, remote, (item) => item.host as string);
    expect(actions).to.have.lengthOf(1);
    expect(actions[0].type).to.equal("update");
  });
});
