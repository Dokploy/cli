import { REDACTED_VALUE, SENSITIVE_FIELDS } from "./constants.js";

export function redactSensitiveFields(
	data: Record<string, unknown>,
): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(data)) {
		if (SENSITIVE_FIELDS.has(key) && value !== null && value !== undefined) {
			result[key] = REDACTED_VALUE;
		} else if (
			Array.isArray(value)
		) {
			result[key] = value.map((item) =>
				typeof item === "object" && item !== null
					? redactSensitiveFields(item as Record<string, unknown>)
					: item,
			);
		} else if (typeof value === "object" && value !== null) {
			result[key] = redactSensitiveFields(
				value as Record<string, unknown>,
			);
		} else {
			result[key] = value;
		}
	}
	return result;
}

export function isRedacted(value: unknown): boolean {
	return value === REDACTED_VALUE;
}
