import * as fs from "node:fs";
import { parseAllDocuments } from "yaml";
import { type DokployDocument, documentSchema } from "./schema.js";

export class ConfigParseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ConfigParseError";
	}
}

const parseYaml = (raw: string): unknown[] => {
	const documents = [...parseAllDocuments(raw)];
	const errors = documents.flatMap((document) => document.errors);
	if (errors.length > 0) {
		throw new ConfigParseError(`YAML parse error: ${errors[0].message}`);
	}
	return documents
		.map((document) => document.toJS())
		.filter((document) => document !== null);
};

const validate = (document: unknown, index: number): DokployDocument => {
	const result = documentSchema.safeParse(document);
	if (!result.success) {
		const prefix = index > 0 ? `document ${index + 1}: ` : "";
		const details = result.error.issues.map(
			(issue) => `  ${prefix}${issue.path.join(".")}: ${issue.message}`,
		);
		throw new ConfigParseError(`Validation failed:\n${details.join("\n")}`);
	}
	return result.data;
};

const duplicates = (names: string[]) =>
	names.filter((name, index) => names.indexOf(name) !== index);

const checkDocuments = (documents: DokployDocument[]): DokployDocument[] => {
	if (documents.length === 0) {
		throw new ConfigParseError("Config file has no documents");
	}
	const organizations = documents.filter(
		(document) => document.kind === "Organization",
	);
	if (organizations.length > 1) {
		throw new ConfigParseError(
			"Only one Organization document is allowed per file",
		);
	}
	const repeated = duplicates(
		documents.flatMap((document) =>
			document.kind === "Project" ? [document.name] : [],
		),
	);
	if (repeated.length > 0) {
		throw new ConfigParseError(
			`Project "${repeated[0]}" is declared more than once`,
		);
	}
	return documents;
};

export const parseDocuments = (raw: string): DokployDocument[] =>
	checkDocuments(parseYaml(raw).map(validate));

export async function parseConfigFile(
	filePath: string,
): Promise<DokployDocument[]> {
	if (!fs.existsSync(filePath)) {
		throw new ConfigParseError(`Config file not found: ${filePath}`);
	}
	return parseDocuments(fs.readFileSync(filePath, "utf8"));
}
