import { expect } from "chai";
import { cleanResource } from "../../../src/lib/apply/exporter.js";

describe("cleanResource", () => {
  it("strips ID fields from a resource", () => {
    const resource = {
      name: "my-app",
      applicationId: "abc-123",
      composeId: "xyz-456",
      projectId: "proj-1",
      environmentId: "env-1",
      serverId: "srv-1",
      domainId: "dom-1",
    };
    const result = cleanResource(resource);
    expect(result).to.deep.equal({ name: "my-app" });
  });

  it("strips null, undefined, and empty string values", () => {
    const resource = {
      name: "my-app",
      description: null,
      command: undefined,
      dockerImage: "",
      branch: "main",
    };
    const result = cleanResource(resource as any);
    expect(result).to.deep.equal({ name: "my-app", branch: "main" });
  });

  it("strips default values (replicas: 1, triggerType: push, etc.)", () => {
    const resource = {
      name: "my-app",
      replicas: 1,
      triggerType: "push",
      autoDeploy: true,
      buildPath: "/",
      buildType: "nixpacks",
      sourceType: "github",
    };
    const result = cleanResource(resource);
    expect(result).to.deep.equal({ name: "my-app" });
  });

  it("keeps non-default values", () => {
    const resource = {
      name: "my-app",
      replicas: 3,
      triggerType: "tag",
      autoDeploy: false,
      buildPath: "/app",
      buildType: "dockerfile",
    };
    const result = cleanResource(resource);
    expect(result).to.deep.equal({
      name: "my-app",
      replicas: 3,
      triggerType: "tag",
      autoDeploy: false,
      buildPath: "/app",
      buildType: "dockerfile",
    });
  });

  it("resolves serverId to serverName when serverMap provided", () => {
    const serverMap = new Map([["srv-1", "production-server"]]);
    const resource = {
      name: "my-app",
      serverId: "srv-1",
    };
    const result = cleanResource(resource, serverMap);
    expect(result).to.deep.equal({
      name: "my-app",
      serverName: "production-server",
    });
  });

  it("strips swarm fields", () => {
    const resource = {
      name: "my-app",
      healthCheckSwarm: '{"test": []}',
      restartPolicySwarm: "any",
      placementSwarm: '{"constraints": []}',
      updateConfigSwarm: "{}",
      rollbackConfigSwarm: "{}",
      modeSwarm: "replicated",
      labelsSwarm: "{}",
      networkSwarm: "[]",
      stopGracePeriodSwarm: "10s",
      endpointSpecSwarm: "{}",
      ulimitsSwarm: "{}",
    };
    const result = cleanResource(resource);
    expect(result).to.deep.equal({ name: "my-app" });
  });

  it("strips empty arrays", () => {
    const resource = {
      name: "my-app",
      args: [] as string[],
      branch: "main",
    };
    const result = cleanResource(resource);
    expect(result).to.deep.equal({ name: "my-app", branch: "main" });
  });
});
