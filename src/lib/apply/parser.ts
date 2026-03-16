import * as fs from "node:fs";
import { parse } from "yaml";
import { dokployConfigSchema } from "./schema.js";
import type { DokployConfigParsed } from "./schema.js";

export class ConfigParseError extends Error {
  constructor(
    message: string,
    public details?: string[],
  ) {
    super(message);
    this.name = "ConfigParseError";
  }
}

export async function parseConfigFile(filePath: string): Promise<DokployConfigParsed> {
  if (!fs.existsSync(filePath)) {
    throw new ConfigParseError(`Config file not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");

  let parsed: unknown;
  try {
    parsed = parse(raw);
  } catch (err: any) {
    throw new ConfigParseError(`YAML parse error: ${err.message}`);
  }

  const result = dokployConfigSchema.safeParse(parsed);

  if (!result.success) {
    const details = result.error.issues.map(
      (issue) => `  ${issue.path.join(".")}: ${issue.message}`,
    );
    throw new ConfigParseError(
      `Validation failed:\n${details.join("\n")}`,
      details,
    );
  }

  return result.data;
}
