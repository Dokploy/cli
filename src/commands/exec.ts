import axios from "axios";
import chalk from "chalk";
import type { Command } from "commander";
import WebSocket from "ws";
import { readAuthConfig } from "../client.js";

interface AuthConfig {
	token: string;
	url: string;
}

interface AppInfo {
	appName: string;
	serviceId: string;
	serviceType: string;
	serverId?: string;
	envName: string;
	projectName: string;
}

interface ContainerInfo {
	containerId: string;
	name: string;
	state: string;
}

const SERVICE_TYPES = [
	{
		key: "applications",
		idField: "applicationId",
		endpoint: "application.one",
	},
	{ key: "redis", idField: "redisId", endpoint: "redis.one" },
	{ key: "postgres", idField: "postgresId", endpoint: "postgres.one" },
	{ key: "mongo", idField: "mongoId", endpoint: "mongo.one" },
	{ key: "mysql", idField: "mysqlId", endpoint: "mysql.one" },
	{ key: "mariadb", idField: "mariadbId", endpoint: "mariadb.one" },
	{ key: "compose", idField: "composeId", endpoint: "compose.one" },
] as const;

async function trpcGet(
	auth: AuthConfig,
	endpoint: string,
	params: Record<string, unknown>,
) {
	const response = await axios.get(`${auth.url}/api/trpc/${endpoint}`, {
		params: { input: JSON.stringify({ json: params }) },
		headers: { "x-api-key": auth.token },
	});
	return response.data?.result?.data?.json ?? response.data;
}

async function findService(
	auth: AuthConfig,
	appName: string,
	envName?: string,
	projectName?: string,
): Promise<AppInfo> {
	const projects = await trpcGet(auth, "project.all", {});

	const matches: AppInfo[] = [];

	for (const project of projects) {
		if (
			projectName &&
			project.name.toLowerCase() !== projectName.toLowerCase()
		) {
			continue;
		}

		for (const env of project.environments ?? []) {
			if (envName && env.name.toLowerCase() !== envName.toLowerCase()) {
				continue;
			}

			for (const svcType of SERVICE_TYPES) {
				const services = env[svcType.key] ?? [];
				for (const svc of services) {
					if (
						svc.name === appName ||
						svc.appName === appName ||
						svc[svcType.idField] === appName
					) {
						const detail = await trpcGet(auth, svcType.endpoint, {
							[svcType.idField]: svc[svcType.idField],
						});
						matches.push({
							appName: detail.appName,
							serviceId: svc[svcType.idField],
							serviceType: svcType.key,
							serverId: detail.serverId ?? undefined,
							envName: env.name,
							projectName: project.name,
						});
					}
				}
			}
		}
	}

	if (matches.length === 0) {
		const hints: string[] = [];
		if (projectName) hints.push(`project "${projectName}"`);
		if (envName) hints.push(`environment "${envName}"`);
		const hintStr = hints.length > 0 ? ` in ${hints.join(", ")}` : "";
		throw new Error(
			`Service "${appName}" not found${hintStr}. Available services:\n${listServices(projects)}`,
		);
	}

	if (matches.length > 1) {
		const list = matches
			.map((m) => `  - ${m.projectName} / ${m.envName} (${m.serviceType})`)
			.join("\n");
		throw new Error(
			`Multiple services named "${appName}" found. Use --project and/or --env to specify:\n${list}`,
		);
	}

	return matches[0];
}

function listServices(projects: any[]): string {
	const services: string[] = [];
	for (const project of projects) {
		for (const env of project.environments ?? []) {
			for (const svcType of SERVICE_TYPES) {
				for (const svc of env[svcType.key] ?? []) {
					const type = svcType.key === "applications" ? "app" : svcType.key;
					services.push(
						`  - ${svc.name} [${type}] (${project.name} / ${env.name})`,
					);
				}
			}
		}
	}
	return services.join("\n") || "  (none)";
}

async function findContainer(
	auth: AuthConfig,
	appName: string,
	serverId?: string,
): Promise<ContainerInfo> {
	const params: Record<string, unknown> = {
		appName,
		type: "standalone",
	};
	if (serverId) {
		params.serverId = serverId;
	}

	const containers: ContainerInfo[] = await trpcGet(
		auth,
		"docker.getContainersByAppLabel",
		params,
	);

	const running = containers.filter((c) => c.state === "running");

	if (running.length === 0) {
		throw new Error(
			`No running containers found for "${appName}". Is the service deployed?`,
		);
	}

	return running[0];
}

export function registerExecCommand(program: Command) {
	program
		.command("exec")
		.description(
			"Execute a command in a running Dokploy service container (like heroku run)",
		)
		.requiredOption("--app <name>", "Service name in Dokploy")
		.option("--project <name>", "Project name in Dokploy")
		.option("--env <name>", "Environment name (e.g. staging, production)")
		.option("--shell <shell>", "Shell to use (bash, sh, zsh, ash)", "bash")
		.argument("[command...]", "Command to run (e.g. rails c)")
		.action(
			async (
				commandArgs: string[],
				opts: { app: string; project?: string; env?: string; shell: string },
			) => {
				const auth = readAuthConfig();

				const labels: string[] = [];
				if (opts.project) labels.push(opts.project);
				if (opts.env) labels.push(opts.env);
				const labelStr = labels.length > 0 ? ` (${labels.join(" / ")})` : "";
				console.log(chalk.blue(`Finding service "${opts.app}"${labelStr}...`));

				let appInfo: AppInfo;
				try {
					appInfo = await findService(auth, opts.app, opts.env, opts.project);
				} catch (err: any) {
					console.error(chalk.red(err.message));
					process.exit(1);
				}

				const typeLabel =
					appInfo.serviceType === "applications" ? "app" : appInfo.serviceType;
				console.log(
					chalk.blue(
						`Found ${appInfo.appName} [${typeLabel}] (${appInfo.projectName} / ${appInfo.envName}), looking for running container...`,
					),
				);

				let container: ContainerInfo;
				try {
					container = await findContainer(
						auth,
						appInfo.appName,
						appInfo.serverId,
					);
				} catch (err: any) {
					console.error(chalk.red(err.message));
					process.exit(1);
				}

				console.log(
					chalk.blue(
						`Connecting to container ${container.containerId} (${container.name})...`,
					),
				);

				// Build WebSocket URL
				const wsProtocol = auth.url.startsWith("https") ? "wss" : "ws";
				const host = auth.url.replace(/^https?:\/\//, "");

				let wsUrl = `${wsProtocol}://${host}/docker-container-terminal?containerId=${container.containerId}&activeWay=${opts.shell}`;
				if (appInfo.serverId) {
					wsUrl += `&serverId=${appInfo.serverId}`;
				}

				const ws = new WebSocket(wsUrl, {
					headers: {
						"x-api-key": auth.token,
					},
				});

				const userCommand =
					commandArgs.length > 0 ? commandArgs.join(" ") : null;

				ws.on("open", () => {
					if (process.stdin.isTTY) {
						process.stdin.setRawMode(true);
					}
					process.stdin.resume();

					if (userCommand) {
						setTimeout(() => {
							ws.send(`${userCommand}\n`);
						}, 500);
					}

					process.stdin.on("data", (data) => {
						if (ws.readyState === WebSocket.OPEN) {
							ws.send(data.toString("utf8"));
						}
					});
				});

				ws.on("message", (data) => {
					const msg = data.toString();
					if (msg.includes("Container closed with code:")) {
						process.stdout.write(msg);
						ws.close();
						return;
					}
					process.stdout.write(msg);
				});

				ws.on("close", () => {
					if (process.stdin.isTTY) {
						process.stdin.setRawMode(false);
					}
					process.exit(0);
				});

				ws.on("error", (err) => {
					if (process.stdin.isTTY) {
						process.stdin.setRawMode(false);
					}
					console.error(chalk.red(`\nConnection error: ${err.message}`));
					process.exit(1);
				});

				for (const signal of ["SIGINT", "SIGTERM"] as const) {
					process.on(signal, () => {
						ws.close();
					});
				}
			},
		);
}
