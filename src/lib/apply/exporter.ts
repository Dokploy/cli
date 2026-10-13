import { stringify } from "yaml";
import { apiGet } from "../../client.js";
import { fetchService, providerIdField } from "./remote.js";
import {
	type ChildKey,
	type Fields,
	PASSWORD_FIELDS,
	SCOPE_FIELDS,
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

const pickVisible = (keys: string[], item: Fields, hidden: string[]): Fields =>
	present(
		Object.fromEntries(
			keys
				.filter((key) => !hidden.includes(key))
				.map((key) => [key, item[key]]),
		),
	);

const shapeKeys = (schema: { shape: Record<string, unknown> }) =>
	Object.keys(schema.shape);

export interface ExportOptions {
	includeEnv?: boolean;
}

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

const exportChildren = (
	type: ServiceType,
	service: Fields,
	hidden: string[],
): Fields =>
	Object.fromEntries(
		SERVICES[type].children
			.map((key: ChildKey) => [
				key,
				(service[key] ?? [])
					.filter((item: Fields) => !isAutoCreatedMount(type, item, service))
					.map((item: Fields) =>
						pickVisible(shapeKeys(childSchemas[key]), item, hidden),
					),
			])
			.filter(([, items]) => items.length > 0),
	);

async function exportService(
	type: ServiceType,
	summary: Fields,
	names: Names,
	hidden: string[],
): Promise<Fields> {
	const service = await fetchService(type, summary[`${type}Id`]);
	const named = {
		...service,
		serverName: service.serverId ? names.server(service.serverId) : undefined,
		gitProvider: names.gitProvider(service),
	};
	return {
		...pickVisible(shapeKeys(serviceSchemas[type]), named, [
			...hidden,
			...SERVICES[type].children,
		]),
		...exportChildren(type, service, hidden),
	};
}

async function exportEnvironment(
	environment: Fields,
	names: Names,
	hidden: string[],
): Promise<Fields> {
	const sections = await Promise.all(
		SERVICE_TYPES.map(async (type) => {
			const { section } = SERVICES[type];
			const services = await Promise.all(
				(environment[section] ?? []).map((service: Fields) =>
					exportService(type, service, names, hidden),
				),
			);
			return [section, services] as const;
		}),
	);
	return {
		...pickVisible(SCOPE_FIELDS, environment, hidden),
		...Object.fromEntries(
			sections.filter(([, services]) => services.length > 0),
		),
	};
}

export async function exportProject(
	project: Fields,
	{ includeEnv = false }: ExportOptions = {},
): Promise<string> {
	const hidden = includeEnv ? PASSWORD_FIELDS : SECRET_FIELDS;
	const names = await loadNames();
	const environments = await Promise.all(
		(project.environments ?? []).map((environment: Fields) =>
			exportEnvironment(environment, names, hidden),
		),
	);
	return stringify(
		{
			apiVersion: "v1",
			kind: "Project",
			...pickVisible(SCOPE_FIELDS, project, hidden),
			environments,
		},
		{ lineWidth: 0 },
	);
}
