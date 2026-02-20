import { Command, Flags } from "@oclif/core";
import { readAuthConfig } from "../../utils/utils.js";
import chalk from "chalk";
import {
	getApplication,
	getProjects,
	getServer,
	type Application,
} from "../../utils/shared.js";
import type { AuthConfig } from "../../utils/utils.js";
import inquirer from "inquirer";
import type { Answers } from "./create.js";
import { WebSocket } from "ws";
import type { Data } from "ws";
import { spawn } from "node:child_process";

type LogFlags = { follow: boolean; tail: number; since?: string; search?: string };

export default class AppLogs extends Command {
	static description = "View logs of an application.";

	static examples = [
		"$ <%= config.bin %> app logs",
		"$ <%= config.bin %> app logs --applicationId myAppId --follow",
		"$ <%= config.bin %> app logs -a myAppId --tail 200 --since 2h",
		"$ <%= config.bin %> app logs -a myAppId --search error",
	];

	static flags = {
		applicationId: Flags.string({
			char: "a",
			description: "ID of the application",
			required: false,
		}),
		projectId: Flags.string({
			char: "p",
			description: "ID of the project",
			required: false,
		}),
		environmentId: Flags.string({
			char: "e",
			description: "ID of the environment",
			required: false,
		}),
		follow: Flags.boolean({
			char: "f",
			description: "Stream logs continuously",
			default: false,
		}),
		tail: Flags.integer({
			char: "t",
			description: "Number of recent log lines to show",
			default: 100,
		}),
		since: Flags.string({
			char: "s",
			description: 'Show logs since a time period (e.g. "30m", "1h", "2d", or "all")',
			required: false,
		}),
		search: Flags.string({
			description: "Filter logs by keyword",
			required: false,
		}),
	};

	public async run(): Promise<void> {
		const auth = await readAuthConfig(this);
		const { flags } = await this.parse(AppLogs);
		let { projectId, applicationId, environmentId } = flags;

		// Interactive mode if required flags are missing
		if (!projectId || !applicationId || !environmentId) {
			console.log(chalk.blue.bold("\n  Listing all Projects \n"));
			const projects = await getProjects(auth, this);

			let selectedProject;
			let selectedEnvironment;

			// 1. Select project
			if (!projectId) {
				const { project } = await inquirer.prompt<Answers>([
					{
						choices: projects.map((project) => ({
							name: project.name,
							value: project,
						})),
						message: "Select a project:",
						name: "project",
						type: "list",
					},
				]);
				selectedProject = project;
				projectId = project.projectId;
			} else {
				selectedProject = projects.find(
					(p) => p.projectId === projectId,
				);
			}

			// 2. Select environment
			if (!environmentId) {
				if (
					!selectedProject?.environments ||
					selectedProject.environments.length === 0
				) {
					this.error(
						chalk.yellow(
							"No environments found in this project.",
						),
					);
				}

				const { environment } = await inquirer.prompt([
					{
						choices: selectedProject.environments.map((env) => ({
							name: `${env.name} (${env.description})`,
							value: env,
						})),
						message: "Select an environment:",
						name: "environment",
						type: "list",
					},
				]);
				selectedEnvironment = environment;
				environmentId = environment.environmentId;
			} else {
				selectedEnvironment =
					selectedProject?.environments?.find(
						(e) => e.environmentId === environmentId,
					);
			}

			// 3. Select application
			if (!applicationId) {
				if (
					!selectedEnvironment?.applications ||
					selectedEnvironment.applications.length === 0
				) {
					this.error(
						chalk.yellow(
							"No applications found in this environment.",
						),
					);
				}

				const appAnswers = await inquirer.prompt([
					{
						choices: selectedEnvironment.applications.map(
							(app: Application) => ({
								name: app.name,
								value: app.applicationId,
							}),
						),
						message: "Select the application to view logs:",
						name: "selectedApp",
						type: "list",
					},
				]);
				applicationId = appAnswers.selectedApp;
			}
		}

		// Fetch full application details to get appName and serverId
		const app = await getApplication(applicationId!, auth, this);

		this.log(chalk.blue("Connecting to log stream..."));

		try {
			// Try swarm mode first (most Dokploy deployments use Docker Swarm),
			// then fall back to native if the container isn't found as a service.
			const swarmResult = await this.streamViaWebSocket(app, auth, flags, "swarm");

			if (swarmResult === "not-found") {
				const nativeResult = await this.streamViaWebSocket(app, auth, flags, "native");
				if (nativeResult === "not-found") {
					this.error(chalk.red(`Container '${app.appName}' not found. The application may be stopped.`));
				} else if (nativeResult === "cloud-blocked") {
					await this.handleCloudFallback(app, auth, flags);
				}
			} else if (swarmResult === "cloud-blocked") {
				await this.handleCloudFallback(app, auth, flags);
			}
		} catch (error: any) {
			this.error(chalk.red(`Error streaming logs: ${error.message}`));
		}
	}

	private async handleCloudFallback(
		app: Application,
		auth: AuthConfig,
		flags: LogFlags,
	): Promise<void> {
		if (!app.serverId) {
			this.error(chalk.red("Log streaming is not available on Dokploy Cloud without a remote server."));
		}

		this.log(chalk.yellow("WebSocket logs not available on Dokploy Cloud. Falling back to SSH..."));
		const server = await getServer(app.serverId, auth, this);
		await this.streamViaSSH(server, app, flags);
	}

	private streamViaWebSocket(
		app: Application,
		auth: AuthConfig,
		flags: LogFlags,
		runType: "swarm" | "native",
	): Promise<"ok" | "not-found" | "cloud-blocked"> {
		return new Promise((resolve, reject) => {
			const wsProtocol = auth.url.startsWith("https") ? "wss" : "ws";
			const host = auth.url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
			const params = new URLSearchParams({
				containerId: app.appName,
				tail: String(flags.tail),
				runType,
			});

			if (flags.since) {
				params.set("since", flags.since);
			}

			if (flags.search) {
				params.set("search", flags.search);
			}

			if (app.serverId) {
				params.set("serverId", app.serverId);
			}

			const wsUrl = `${wsProtocol}://${host}/docker-container-logs?${params.toString()}`;

			const ws = new WebSocket(wsUrl, {
				headers: { "x-api-key": auth.token },
				handshakeTimeout: 10_000,
			});

			let receivedLogs = false;
			let silenceTimer: ReturnType<typeof setTimeout> | null = null;

			const cleanup = () => {
				if (silenceTimer) {
					clearTimeout(silenceTimer);
					silenceTimer = null;
				}

				if (
					ws.readyState === WebSocket.OPEN ||
					ws.readyState === WebSocket.CONNECTING
				) {
					ws.close();
				}
			};

			const onSignal = () => {
				cleanup();
				resolve("ok");
			};

			process.on("SIGINT", onSignal);
			process.on("SIGTERM", onSignal);

			const removeListeners = () => {
				process.removeListener("SIGINT", onSignal);
				process.removeListener("SIGTERM", onSignal);
			};

			ws.on("open", () => {
				if (!flags.follow) {
					silenceTimer = setTimeout(() => {
						cleanup();
						removeListeners();
						resolve("ok");
					}, 2000);
				}
			});

			ws.on("message", (data: Data) => {
				const message = data.toString();

				// Detect cloud version limitation
				if (!receivedLogs && message.includes("not available in the cloud version")) {
					cleanup();
					removeListeners();
					resolve("cloud-blocked");
					return;
				}

				// Detect container/service not found
				if (!receivedLogs && message.includes("No such container")) {
					cleanup();
					removeListeners();
					resolve("not-found");
					return;
				}

				receivedLogs = true;
				const formatted = message.replace(
					/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z?\s?)/gm,
					(match) => chalk.gray(match),
				);
				process.stdout.write(formatted);

				if (!flags.follow && silenceTimer) {
					clearTimeout(silenceTimer);
					silenceTimer = setTimeout(() => {
						cleanup();
						removeListeners();
						resolve("ok");
					}, 2000);
				}
			});

			ws.on("error", (error: Error) => {
				cleanup();
				removeListeners();
				reject(error);
			});

			ws.on("close", () => {
				cleanup();
				removeListeners();
				resolve("ok");
			});
		});
	}

	private streamViaSSH(
		server: { ipAddress: string; port: number; username: string },
		app: Application,
		flags: LogFlags,
	): Promise<void> {
		return new Promise((resolve, reject) => {
			const dockerArgs = ["service", "logs", "--timestamps"];
			dockerArgs.push("--tail", String(flags.tail));

			if (flags.follow) {
				dockerArgs.push("--follow");
			}

			if (flags.since && flags.since !== "all") {
				dockerArgs.push("--since", flags.since);
			}

			dockerArgs.push(app.appName);

			let remoteCmd = `docker ${dockerArgs.join(" ")}`;

			if (flags.search) {
				remoteCmd += ` 2>&1 | grep -iF '${flags.search.replace(/'/g, "'\\''")}'`;
			}

			const sshArgs = [
				"-o", "StrictHostKeyChecking=accept-new",
				"-o", "ConnectTimeout=10",
				"-p", String(server.port),
				`${server.username}@${server.ipAddress}`,
				remoteCmd,
			];

			this.log(chalk.blue(`Connecting via SSH to ${server.ipAddress}...`));

			const ssh = spawn("ssh", sshArgs, {
				stdio: ["ignore", "pipe", "pipe"],
			});

			ssh.stdout.on("data", (data: Buffer) => {
				const message = data.toString();
				const formatted = message.replace(
					/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z?\s?)/gm,
					(match) => chalk.gray(match),
				);
				process.stdout.write(formatted);
			});

			ssh.stderr.on("data", (data: Buffer) => {
				const msg = data.toString();
				// Docker writes log output to stderr for service logs
				const formatted = msg.replace(
					/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z?\s?)/gm,
					(match) => chalk.gray(match),
				);
				process.stderr.write(formatted);
			});

			const onSignal = () => {
				ssh.kill("SIGTERM");
			};

			process.on("SIGINT", onSignal);
			process.on("SIGTERM", onSignal);

			ssh.on("close", (code) => {
				process.removeListener("SIGINT", onSignal);
				process.removeListener("SIGTERM", onSignal);

				if (code && code !== 0 && code !== 255) {
					reject(new Error(`SSH exited with code ${code}`));
				} else {
					resolve();
				}
			});

			ssh.on("error", (error) => {
				process.removeListener("SIGINT", onSignal);
				process.removeListener("SIGTERM", onSignal);
				reject(error);
			});
		});
	}
}
