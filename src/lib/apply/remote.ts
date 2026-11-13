import { isAxiosError } from "axios";
import { apiGet } from "../../client.js";
import { type Fields, SERVICES, type ServiceType } from "./resources.js";

export const errorMessage = (error: unknown): string =>
	(isAxiosError(error) && error.response?.data?.error?.json?.message) ||
	(error instanceof Error ? error.message : String(error));

export function findBy(
	items: Fields[],
	field: string,
	name: string,
	label: string,
): Fields | undefined {
	const matches = items.filter((item) => item[field] === name);
	if (matches.length > 1) {
		throw new Error(
			`Multiple ${label} resources named "${name}" found. Rename one in the Dokploy UI to resolve the ambiguity.`,
		);
	}
	return matches[0];
}

export const findByName = (
	items: Fields[],
	name: string,
	label: string,
): Fields | undefined => findBy(items, "name", name, label);

export function requireByName(
	items: Fields[],
	name: string,
	label: string,
): Fields {
	const match = findByName(items, name, label);
	if (!match) {
		throw new Error(
			`${label} "${name}" not found. Available: ${items.map((item) => item.name).join(", ") || "none"}`,
		);
	}
	return match;
}

export async function fetchService(
	type: ServiceType,
	serviceId: string,
): Promise<Fields> {
	const service = await apiGet(`${type}.one`, { [`${type}Id`]: serviceId });
	return SERVICES[type].children.includes("schedules")
		? {
				...service,
				schedules: await apiGet("schedule.list", {
					id: serviceId,
					scheduleType: type,
				}),
			}
		: service;
}

export const providerIdField = (provider: Fields): Fields => {
	const type = provider.providerType as string;
	return { [`${type}Id`]: provider[type]?.[`${type}Id`] };
};

export interface Lookups {
	serverId: (name: string) => string | undefined;
	gitProviderFields: (name: string) => Fields;
}

export async function loadLookups(
	services: Fields[],
	declaredServers: string[],
): Promise<Lookups> {
	const uses = (key: string) => services.some((service) => service[key]);
	const servers: Fields[] = uses("serverName")
		? await apiGet("server.all")
		: [];
	const providers: Fields[] = uses("gitProvider")
		? await apiGet("gitProvider.getAll")
		: [];
	return {
		serverId: (name) =>
			declaredServers.includes(name)
				? findByName(servers, name, "Server")?.serverId
				: requireByName(servers, name, "Server").serverId,
		gitProviderFields: (name) =>
			providerIdField(requireByName(providers, name, "Git provider")),
	};
}
