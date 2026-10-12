import { stringify } from "yaml";
import { apiGet } from "../../client.js";
import { fetchService, providerIdField } from "./remote.js";
import {
	type ChildKey,
	type Fields,
	SECRET_FIELDS,
	SERVICE_TYPES,
	SERVICES,
	type ServiceType,
} from "./resources.js";
import { childSchemas, serviceSchemas } from "./schema.js";

const isPresent = (value: unknown) =>
	value !== null &&
	value !== undefined &&
	value !== "" &&
	!(Array.isArray(value) && value.length === 0);

const present = (fields: Fields): Fields =>
	Object.fromEntries(
		Object.entries(fields).filter(([, value]) => isPresent(value)),
	);

export const pickKnown = (
	schema: { shape: Record<string, unknown> },
	item: Fields,
	exclude: string[] = [],
): Fields =>
	present(
		Object.fromEntries(
			Object.keys(schema.shape)
				.filter((key) => !SECRET_FIELDS.includes(key) && !exclude.includes(key))
				.map((key) => [key, item[key]]),
		),
	);

interface Names {
	server: (serverId: string) => string | undefined;
	gitProvider: (service: Fields) => string | undefined;
}

async function loadNames(): Promise<Names> {
	const [servers, providers]: Fields[][] = await Promise.all([
		apiGet("server.all").catch(() => []),
		apiGet("gitProvider.getAll").catch(() => []),
	]);
	return {
		server: (serverId) =>
			servers.find((server) => server.serverId === serverId)?.name,
		gitProvider: (service) =>
			providers.find((provider) =>
				Object.entries(providerIdField(provider)).some(
					([field, id]) => id && service[field] === id,
				),
			)?.name,
	};
}

const isAutoCreatedMount = (
	type: ServiceType,
	mount: Fields,
	service: Fields,
) =>
	type !== "application" &&
	type !== "compose" &&
	mount.type === "volume" &&
	mount.volumeName === `${service.appName}-data`;

const exportChildren = (type: ServiceType, service: Fields): Fields =>
	Object.fromEntries(
		SERVICES[type].children
			.map((key: ChildKey) => [
				key,
				(service[key] ?? [])
					.filter((item: Fields) => !isAutoCreatedMount(type, item, service))
					.map((item: Fields) => pickKnown(childSchemas[key], item)),
			])
			.filter(([, items]) => items.length > 0),
	);

async function exportService(
	type: ServiceType,
	summary: Fields,
	names: Names,
): Promise<Fields> {
	const service = await fetchService(type, summary[`${type}Id`]);
	const named = {
		...service,
		serverName: service.serverId ? names.server(service.serverId) : undefined,
		gitProvider: names.gitProvider(service),
	};
	return {
		...pickKnown(serviceSchemas[type], named, SERVICES[type].children),
		...exportChildren(type, service),
	};
}

async function exportEnvironment(
	environment: Fields,
	names: Names,
): Promise<Fields> {
	const sections = await Promise.all(
		SERVICE_TYPES.map(async (type) => {
			const { section } = SERVICES[type];
			const services = await Promise.all(
				(environment[section] ?? []).map((service: Fields) =>
					exportService(type, service, names),
				),
			);
			return [section, services] as const;
		}),
	);
	return {
		...present({
			name: environment.name,
			description: environment.description,
		}),
		...Object.fromEntries(
			sections.filter(([, services]) => services.length > 0),
		),
	};
}

export async function exportProject(project: Fields): Promise<string> {
	const names = await loadNames();
	const environments = await Promise.all(
		(project.environments ?? []).map((environment: Fields) =>
			exportEnvironment(environment, names),
		),
	);
	return stringify(
		{
			apiVersion: "v1",
			kind: "Project",
			...present({ name: project.name, description: project.description }),
			environments,
		},
		{ lineWidth: 0 },
	);
}
