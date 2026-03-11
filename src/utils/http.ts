import axios from "axios";
import chalk from "chalk";

export const headers = {
	"Content-Type": "application/json",
	"User-Agent": "Dokploy CLI",
};

const isDebug =
	process.env.DEBUG === "1" || process.env.DOKPLOY_DEBUG === "1";

if (isDebug) {
	axios.interceptors.request.use((config) => {
		const safeHeaders: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(config.headers ?? {})) {
			safeHeaders[k] = k.toLowerCase() === "x-api-key" ? "***" : v;
		}
		console.error(
			chalk.dim(
				`[DEBUG] → ${config.method?.toUpperCase()} ${config.url}`,
			),
		);
		console.error(
			chalk.dim(`[DEBUG]   Headers: ${JSON.stringify(safeHeaders)}`),
		);
		if (config.data !== undefined) {
			console.error(
				chalk.dim(`[DEBUG]   Body:    ${JSON.stringify(config.data)}`),
			);
		}
		return config;
	});

	axios.interceptors.response.use(
		(response) => {
			console.error(
				chalk.dim(
					`[DEBUG] ← ${response.status} ${response.config.url}`,
				),
			);
			console.error(
				chalk.dim(
					`[DEBUG]   Response: ${JSON.stringify(response.data)}`,
				),
			);
			return response;
		},
		(error) => {
			if (error.response) {
				console.error(
					chalk.red(
						`[DEBUG] ← ${error.response.status} ${error.config?.url}`,
					),
				);
				console.error(
					chalk.red(
						`[DEBUG]   Error:    ${JSON.stringify(error.response.data)}`,
					),
				);
			} else {
				console.error(chalk.red(`[DEBUG]   Error: ${error.message}`));
			}
			return Promise.reject(error);
		},
	);
}
