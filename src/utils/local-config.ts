import * as fs from "node:fs";
import * as path from "node:path";

export type LocalConfig = {
	projectId?: string;
	environmentId?: string;
	applicationId?: string;
};

export const LOCAL_CONFIG_FILE = ".dokploy.json";

/**
 * Walk up from the given directory looking for a .dokploy.json file.
 * Returns the parsed config if found, or an empty object if not.
 */
export const readLocalConfig = (startDir: string = process.cwd()): LocalConfig => {
	let dir = path.resolve(startDir);

	while (true) {
		const candidate = path.join(dir, LOCAL_CONFIG_FILE);
		if (fs.existsSync(candidate)) {
			try {
				const content = fs.readFileSync(candidate, "utf8");
				return JSON.parse(content) as LocalConfig;
			} catch {
				return {};
			}
		}

		const parent = path.dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}

	return {};
};

/**
 * Write a .dokploy.json file to the given directory (defaults to cwd).
 */
export const writeLocalConfig = (config: LocalConfig, dir: string = process.cwd()): string => {
	const filePath = path.join(dir, LOCAL_CONFIG_FILE);
	fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + "\n", "utf8");
	return filePath;
};
