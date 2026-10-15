import { stringify } from "yaml";
import { apiGet } from "../../client.js";
import {
	listOrganization,
	loadDirectory,
	ORGANIZATION,
} from "./organization.js";
import { fetchService, providerIdField } from "./remote.js";
import {
	CHILDREN,
	type ChildKey,
	CREDENTIAL_FIELDS,
	type Fields,
	isAutoCreatedMount,
	PASSWORD_FIELDS,
	SCOPE_FIELDS,
	SECRET_FIELDS,
	SERVICE_TYPES,
	SERVICES,
	type ServiceType,
	sequence,
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

const sortedBy =
	(identity: (item: Fields) => string) =>
	(items: Fields[]): Fields[] =>
		[...items].sort((a, b) => identity(a).localeCompare(identity(b)));

const byName = sortedBy((item) => item.name);

export interface ExportOptions {
	includeEnv: boolean;
	includeSecrets: boolean;
}

const hiddenFields = ({ includeEnv, includeSecrets }: ExportOptions) => {
	if (includeSecrets) return [];
	return includeEnv
		? [...PASSWORD_FIELDS, ...CREDENTIAL_FIELDS]
		: SECRET_FIELDS;
};

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

const exportChildren = (
	type: ServiceType,
	service: Fields,
	hidden: string[],
): Fields =>
	Object.fromEntries(
		SERVICES[type].children
			.map((key: ChildKey) => [
				key,
				sortedBy((item) => CHILDREN[key].identity(item, type))(
					(service[key] ?? []).filter(
						(item: Fields) => !isAutoCreatedMount(type, item, service),
					),
				).map((item: Fields) =>
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
	const sections = await sequence(SERVICE_TYPES, async (type) => {
		const { section } = SERVICES[type];
		const services = await sequence(
			byName(environment[section] ?? []),
			(service: Fields) => exportService(type, service, names, hidden),
		);
		return [section, services] as const;
	});
	return {
		...pickVisible(SCOPE_FIELDS, environment, hidden),
		...Object.fromEntries(
			sections.filter(([, services]) => services.length > 0),
		),
	};
}

const toYaml = (document: Fields) => stringify(document, { lineWidth: 0 });

export async function exportProject(
	project: Fields,
	options: ExportOptions,
): Promise<string> {
	const hidden = hiddenFields(options);
	const names = await loadNames();
	const environments = await sequence(
		byName(project.environments ?? []),
		(environment: Fields) => exportEnvironment(environment, names, hidden),
	);
	return toYaml({
		apiVersion: "v1",
		kind: "Project",
		...pickVisible(SCOPE_FIELDS, project, hidden),
		environments,
	});
}

export async function exportOrganization(
	options: ExportOptions,
): Promise<string> {
	const hidden = hiddenFields(options);
	const directory = await loadDirectory(["servers", "sshKeys", "projects"]);
	const sections = await sequence(ORGANIZATION, async (spec) => {
		const items = (await listOrganization(spec))
			.map((remote) => spec.toYaml(remote, directory))
			.map((item) => pickVisible(spec.exportKeys(item), item, hidden));
		return [
			spec.section,
			sortedBy((item) => item[spec.identity])(items),
		] as const;
	});
	return toYaml({
		apiVersion: "v1",
		kind: "Organization",
		...Object.fromEntries(sections.filter(([, items]) => items.length > 0)),
	});
}

const duplicateNames = (projects: Fields[]) =>
	projects
		.map((project) => project.name)
		.filter((name, index, names) => names.indexOf(name) !== index);

export async function exportAll(options: ExportOptions): Promise<string> {
	const projects: Fields[] = await apiGet("project.all");
	const duplicates = duplicateNames(projects);
	if (duplicates.length > 0) {
		throw new Error(
			`Multiple projects named "${duplicates[0]}" found. Rename one in the Dokploy UI so the export can be applied.`,
		);
	}
	const documents = await sequence(byName(projects), async (project) =>
		exportProject(
			await apiGet("project.one", { projectId: project.projectId }),
			options,
		),
	);
	return [await exportOrganization(options), ...documents].join("---\n");
}
