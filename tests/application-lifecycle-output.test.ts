import { Command } from "commander";
import { afterEach, describe, expect, it, vi } from "vitest";
import { registerGeneratedCommands } from "../src/generated/commands.js";

const postSpy = vi.hoisted(() => vi.fn());

vi.mock("../src/client.js", () => ({
	apiGet: vi.fn(),
	apiPost: postSpy,
}));

const cases = [
	{
		action: "create",
		arguments: ["--name", "app", "--environmentId", "env-1"],
		expectedInput: { environmentId: "env-1", name: "app" },
		expectedOutput: { applicationId: "app-1", status: "created" },
	},
	{
		action: "create",
		arguments: ["--name", "app", "--environmentId", "env-1", "--json"],
		expectedInput: { environmentId: "env-1", name: "app" },
		expectedOutput: { applicationId: "app-1", status: "created" },
	},
	{
		action: "move",
		arguments: ["--applicationId", "app-1", "--targetEnvironmentId", "env-2"],
		expectedInput: {
			applicationId: "app-1",
			targetEnvironmentId: "env-2",
		},
		expectedOutput: { applicationId: "app-1", status: "moved" },
	},
	{
		action: "move",
		arguments: [
			"--applicationId",
			"app-1",
			"--targetEnvironmentId",
			"env-2",
			"--json",
		],
		expectedInput: {
			applicationId: "app-1",
			targetEnvironmentId: "env-2",
		},
		expectedOutput: { applicationId: "app-1", status: "moved" },
	},
	...(["delete", "start", "stop"] as const).flatMap((action) => {
		const status = {
			delete: "deleted",
			start: "started",
			stop: "stopped",
		}[action];
		return [
			{
				action,
				arguments: ["--applicationId", "app-1"],
				expectedInput: { applicationId: "app-1" },
				expectedOutput: {
					applicationId: "app-1",
					status,
				},
			},
			{
				action,
				arguments: ["--applicationId", "app-1", "--json"],
				expectedInput: { applicationId: "app-1" },
				expectedOutput: {
					applicationId: "app-1",
					status,
				},
			},
		];
	}),
];

describe("application lifecycle output", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		postSpy.mockReset();
	});

	it.each(cases)(
		"should project a secret-free $expectedOutput.status result",
		async ({
			action,
			arguments: commandArguments,
			expectedInput,
			expectedOutput,
		}) => {
			postSpy.mockResolvedValue({
				applicationId: "app-1",
				password: "must-not-appear",
				refreshToken: "must-not-appear",
			});
			const output: string[] = [];
			vi.spyOn(console, "log").mockImplementation((value) =>
				output.push(String(value)),
			);
			const program = new Command();
			registerGeneratedCommands(program);

			await program.parseAsync([
				"node",
				"dokploy",
				"application",
				action,
				...commandArguments,
			]);

			expect(postSpy).toHaveBeenCalledWith(
				`application.${action}`,
				expectedInput,
			);
			expect(JSON.parse(output.join("\n"))).toEqual(expectedOutput);
			expect(output.join("\n")).not.toContain("must-not-appear");
		},
	);

	it("should not print success when the mutation fails", async () => {
		postSpy.mockRejectedValue(new Error("mutation failed"));
		const output: string[] = [];
		vi.spyOn(console, "log").mockImplementation((value) =>
			output.push(String(value)),
		);
		const program = new Command();
		registerGeneratedCommands(program);

		await expect(
			program.parseAsync([
				"node",
				"dokploy",
				"application",
				"stop",
				"--applicationId",
				"app-1",
			]),
		).rejects.toThrow("mutation failed");
		expect(output).toEqual([]);
	});

	it.each([
		{
			caseName: "missing",
			response: { refreshToken: "must-not-appear" },
		},
		{
			caseName: "not a string",
			response: {
				applicationId: { refreshToken: "must-not-appear" },
			},
		},
	])(
		"should fail closed when create identity is $caseName",
		async ({ response }) => {
			postSpy.mockResolvedValue(response);
			const output: string[] = [];
			vi.spyOn(console, "log").mockImplementation((value) =>
				output.push(String(value)),
			);
			const program = new Command();
			registerGeneratedCommands(program);

			await expect(
				program.parseAsync([
					"node",
					"dokploy",
					"application",
					"create",
					"--name",
					"app",
					"--environmentId",
					"env-1",
				]),
			).rejects.toThrow("application.create response missing applicationId");
			expect(output).toEqual([]);
		},
	);
});
