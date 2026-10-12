import * as fs from "node:fs";
import { parse } from "yaml";
import { type DokployConfig, dokployConfigSchema } from "./schema.js";

export class ConfigParseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ConfigParseError";
	}
}

const parseYaml = (raw: string): unknown => {
	try {
		return parse(raw);
	} catch (error) {
		throw new ConfigParseError(`YAML parse error: ${(error as Error).message}`);
	}
};

export function parseConfig(raw: string): DokployConfig {
	const result = dokployConfigSchema.safeParse(parseYaml(raw));
	if (!result.success) {
		const details = result.error.issues.map(
			(issue) => `  ${issue.path.join(".")}: ${issue.message}`,
		);
		throw new ConfigParseError(`Validation failed:\n${details.join("\n")}`);
	}
	return result.data;
}

export async function parseConfigFile(
	filePath: string,
): Promise<DokployConfig> {
	if (!fs.existsSync(filePath)) {
		throw new ConfigParseError(`Config file not found: ${filePath}`);
	}
	return parseConfig(fs.readFileSync(filePath, "utf8"));
}
