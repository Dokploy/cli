import { isAxiosError } from "axios";
import { apiGet, apiPost } from "../../client.js";
import { changedValues, diffResource } from "./differ.js";
import { attempt, type Outcome, summarize } from "./executor.js";
import { findBy, requireByName } from "./remote.js";
import { actionLabel } from "./reporter.js";
import { type Fields, omit, pick, sequence } from "./resources.js";
import {
	NOTIFICATION_EVENTS,
	type NotificationType,
	notificationFields,
	type OrganizationConfig,
	organizationItemSchemas,
	type VaultProviderType,
	vaultProviderFields,
} from "./schema.js";
import type { Action, ApplyResult } from "./types.js";

export interface Directory {
	servers: Fields[];
	sshKeys: Fields[];
	projects: Fields[];
}

type DirectoryKind = keyof Directory;

const DIRECTORY_LISTS: Record<DirectoryKind, string> = {
	servers: "server.all",
	sshKeys: "sshKey.all",
	projects: "project.all",
};

export const loadDirectory = async (
	kinds: DirectoryKind[],
): Promise<Directory> => {
	const lists = await sequence(kinds, (kind) => apiGet(DIRECTORY_LISTS[kind]));
	return {
		servers: [],
		sshKeys: [],
		projects: [],
		...Object.fromEntries(kinds.map((kind, index) => [kind, lists[index]])),
	};
};

const REFERENCES = {
	serverName: { field: "serverId", kind: "servers", label: "Server" },
	sshKeyName: { field: "sshKeyId", kind: "sshKeys", label: "SSH key" },
} as const;

type Reference = keyof typeof REFERENCES;

const withNames = (
	item: Fields,
	references: Reference[],
	directory: Directory,
): Fields =>
	references.reduce((result, reference) => {
		const { field, kind } = REFERENCES[reference];
		const target = directory[kind].find(
			(entry) => entry[field] === result[field],
		);
		return {
			...omit(result, [field]),
			...(target ? { [reference]: target.name } : {}),
		};
	}, item);

const withIds = (
	item: Fields,
	references: Reference[],
	directory: Directory,
): Fields =>
	references.reduce((result, reference) => {
		const { field, kind, label } = REFERENCES[reference];
		return result[reference] === undefined
			? result
			: {
					...omit(result, [reference]),
					[field]: requireByName(directory[kind], result[reference], label)[
						field
					],
				};
	}, item);

const assignmentNames = (assignments: Fields[], projects: Fields[]) =>
	assignments.map(({ projectId, environmentIds }) => {
		const project = projects.find((entry) => entry.projectId === projectId);
		const environments: string[] = (environmentIds ?? []).map(
			(environmentId: string) =>
				project?.environments?.find(
					(environment: Fields) => environment.environmentId === environmentId,
				)?.name ?? environmentId,
		);
		return {
			project: project?.name ?? projectId,
			...(environments.length > 0 ? { environments } : {}),
		};
	});

const assignmentIds = (assignments: Fields[], projects: Fields[]) =>
	assignments.map(({ project, environments }) => {
		const match = requireByName(projects, project, "Project");
		return {
			projectId: match.projectId,
			environmentIds: (environments ?? []).map(
				(name: string) =>
					requireByName(
						match.environments ?? [],
						name,
						`Environment in project "${project}"`,
					).environmentId,
			),
		};
	});

type Section = Exclude<keyof OrganizationConfig, "apiVersion" | "kind">;

export interface OrganizationSpec {
	section: Section;
	resourceType: string;
	list: string;
	identity: string;
	references: Reference[];
	directory: DirectoryKind[];
	createOnly: string[];
	immutable: string[];
	phase: "before" | "after";
	requiredOnCreate: (item: Fields) => string[];
	createDefaults: (item: Fields) => Fields;
	withOrganization: boolean;
	exportKeys: (item: Fields) => string[];
	toYaml: (remote: Fields, directory: Directory) => Fields;
	toApi: (item: Fields, directory: Directory) => Fields;
	createEndpoint: (item: Fields) => string;
	updateEndpoint: (action: Action) => string;
	updateBase: (action: Action) => Fields;
	updateIds: (action: Action) => Fields;
}

const requiring =
	(keys: string[]) =>
	(action: Action): Fields => ({
		...pick(action.remote ?? {}, keys),
		...changedValues(action),
	});

const crud = (
	section: Section,
	resourceType: string,
	endpoint: string,
	overrides: Partial<OrganizationSpec>,
): OrganizationSpec => {
	const references = overrides.references ?? [];
	return {
		section,
		resourceType,
		list: `${endpoint}.all`,
		identity: "name",
		references,
		directory: references.map((reference) => REFERENCES[reference].kind),
		createOnly: [],
		immutable: [],
		phase: "before",
		requiredOnCreate: () => [],
		createDefaults: () => ({}),
		withOrganization: false,
		exportKeys: () =>
			Object.keys(
				organizationItemSchemas[section as keyof typeof organizationItemSchemas]
					.shape,
			),
		toYaml: (remote, directory) => withNames(remote, references, directory),
		toApi: (item, directory) => withIds(item, references, directory),
		createEndpoint: () => `${endpoint}.create`,
		updateEndpoint: () => `${endpoint}.update`,
		updateBase: requiring([]),
		updateIds: (action) => ({ [`${resourceType}Id`]: action.remoteId }),
		...overrides,
	};
};

const NOTIFICATIONS: Record<
	NotificationType,
	{ required: string[]; defaults: Fields }
> = {
	slack: { required: ["webhookUrl", "channel"], defaults: {} },
	telegram: {
		required: ["botToken", "chatId"],
		defaults: { messageThreadId: "" },
	},
	discord: { required: ["webhookUrl"], defaults: { decoration: false } },
	email: {
		required: [
			"smtpServer",
			"smtpPort",
			"username",
			"password",
			"fromAddress",
			"toAddresses",
		],
		defaults: {},
	},
	resend: { required: ["apiKey", "fromAddress", "toAddresses"], defaults: {} },
	gotify: {
		required: ["serverUrl", "appToken"],
		defaults: { priority: 5, decoration: false },
	},
	ntfy: {
		required: ["serverUrl", "topic"],
		defaults: { accessToken: "", priority: 3 },
	},
	mattermost: { required: ["webhookUrl"], defaults: {} },
	custom: { required: ["endpoint"], defaults: {} },
	lark: { required: ["webhookUrl"], defaults: {} },
	teams: { required: ["webhookUrl"], defaults: {} },
	pushover: { required: ["userKey", "apiToken"], defaults: {} },
};

const EVENTS_OFF = Object.fromEntries(
	NOTIFICATION_EVENTS.map((event) => [event, false]),
);

const capitalize = (text: string) =>
	text.charAt(0).toUpperCase() + text.slice(1);

export const VAULT_SECRET_MASK = "********";

const VAULT_SECRETS = [
	"token",
	"clientSecret",
	"secretAccessKey",
	"serviceToken",
	"secretKey",
];

const VAULT_REQUIRED: Record<VaultProviderType, string[]> = {
	hashicorp: ["url", "token"],
	infisical: ["clientId", "clientSecret", "projectId", "environmentSlug"],
	aws: ["region", "accessKeyId", "secretAccessKey"],
	"aws-parameter-store": ["region", "accessKeyId", "secretAccessKey"],
	doppler: ["serviceToken"],
	azure: ["vaultUri", "tenantId", "clientId", "clientSecret"],
	scaleway: ["projectId", "secretKey"],
	phase: ["token", "appId", "env"],
};

const vaultKeys = (providerType: VaultProviderType) =>
	Object.keys(vaultProviderFields[providerType]);

const maskedSecrets = (providerType: VaultProviderType): Fields =>
	Object.fromEntries(
		vaultKeys(providerType)
			.filter((key) => VAULT_SECRETS.includes(key))
			.map((key) => [key, VAULT_SECRET_MASK]),
	);

export const ORGANIZATION: OrganizationSpec[] = [
	crud("sshKeys", "sshKey", "sshKey", {
		createOnly: ["publicKey", "privateKey"],
		requiredOnCreate: () => ["publicKey", "privateKey"],
		withOrganization: true,
	}),
	crud("servers", "server", "server", {
		references: ["sshKeyName"],
		directory: ["sshKeys"],
		requiredOnCreate: () => ["ipAddress", "username", "sshKeyName"],
		createDefaults: () => ({ description: "", port: 22, serverType: "deploy" }),
		toYaml: (remote, directory) =>
			withNames(
				{ ...remote, description: remote.description ?? "" },
				["sshKeyName"],
				directory,
			),
		updateBase: requiring([
			"name",
			"description",
			"ipAddress",
			"port",
			"username",
			"sshKeyName",
			"serverType",
		]),
	}),
	crud("destinations", "destination", "destination", {
		references: ["serverName"],
		directory: ["servers"],
		requiredOnCreate: () => [
			"provider",
			"accessKey",
			"secretAccessKey",
			"bucket",
			"region",
			"endpoint",
		],
		createDefaults: () => ({ additionalFlags: [] }),
		updateBase: requiring([
			"name",
			"provider",
			"accessKey",
			"secretAccessKey",
			"bucket",
			"region",
			"endpoint",
			"additionalFlags",
		]),
	}),
	crud("registries", "registry", "registry", {
		identity: "registryName",
		references: ["serverName"],
		directory: ["servers"],
		requiredOnCreate: () => ["registryUrl", "username", "password"],
		createDefaults: () => ({ registryType: "cloud", imagePrefix: null }),
	}),
	crud("certificates", "certificate", "certificates", {
		references: ["serverName"],
		directory: ["servers"],
		requiredOnCreate: () => ["certificateData", "privateKey"],
		withOrganization: true,
	}),
	crud("notifications", "notification", "notification", {
		immutable: ["type"],
		requiredOnCreate: (item) =>
			NOTIFICATIONS[item.type as NotificationType].required,
		createDefaults: (item) => ({
			...EVENTS_OFF,
			...NOTIFICATIONS[item.type as NotificationType].defaults,
		}),
		exportKeys: (item) => [
			"name",
			"type",
			...NOTIFICATION_EVENTS,
			...Object.keys(notificationFields[item.type as NotificationType]),
		],
		toYaml: (remote) => ({
			...pick(remote, ["notificationId", "name", ...NOTIFICATION_EVENTS]),
			type: remote.notificationType,
			...remote[remote.notificationType],
		}),
		toApi: (item) => omit(item, ["type"]),
		createEndpoint: (item) => `notification.create${capitalize(item.type)}`,
		updateEndpoint: (action) =>
			`notification.update${capitalize(action.remote?.type)}`,
		updateIds: (action) => ({
			notificationId: action.remoteId,
			[`${action.remote?.type}Id`]: action.remote?.[`${action.remote?.type}Id`],
		}),
	}),
	crud("vaultProviders", "vaultProvider", "vaultProvider", {
		phase: "after",
		directory: ["projects"],
		createOnly: VAULT_SECRETS,
		immutable: ["providerType"],
		requiredOnCreate: (item) =>
			VAULT_REQUIRED[item.providerType as VaultProviderType],
		exportKeys: (item) => [
			"name",
			"providerType",
			...vaultKeys(item.providerType),
			"assignments",
		],
		toYaml: (remote, directory) => ({
			vaultProviderId: remote.vaultProviderId,
			name: remote.name,
			...Object.fromEntries(
				Object.entries(remote.config).filter(
					([, value]) => value !== VAULT_SECRET_MASK,
				),
			),
			assignments: assignmentNames(
				remote.assignments ?? [],
				directory.projects,
			),
		}),
		toApi: (item, directory) => ({
			name: item.name,
			config: {
				...maskedSecrets(item.providerType),
				...omit(item, ["name", "assignments", "vaultProviderId"]),
			},
			assignments: assignmentIds(item.assignments ?? [], directory.projects),
		}),
		updateBase: (action) => ({ ...action.remote, ...action.config }),
	}),
];

export const listOrganization = async (spec: OrganizationSpec) =>
	apiGet(spec.list).catch((error) => {
		if (isAxiosError(error) && error.response?.status === 404) {
			return [];
		}
		throw error;
	}) as Promise<Fields[]>;

const sectionsIn = (organization: OrganizationConfig) =>
	ORGANIZATION.filter((spec) => organization[spec.section]);

async function planSection(
	spec: OrganizationSpec,
	items: Fields[],
	directory: Directory,
): Promise<Action[]> {
	const remote = (await listOrganization(spec)).map((entry) =>
		spec.toYaml(entry, directory),
	);
	return items.map((item) => {
		const name = item[spec.identity];
		return diffResource(
			spec.resourceType,
			name,
			item,
			findBy(remote, spec.identity, name, spec.resourceType),
			spec.createOnly,
		);
	});
}

const specOf = (action: Action) =>
	ORGANIZATION.find((spec) => spec.resourceType === action.resourceType)!;

const missingOnCreate = (action: Action): string[] => {
	const missing =
		action.type === "create"
			? specOf(action)
					.requiredOnCreate(action.config)
					.filter((field) => action.config[field] === undefined)
			: [];
	return missing.length > 0
		? [
				`${action.resourceType} "${action.name}" needs ${missing.join(", ")} to be created`,
			]
		: [];
};

const immutableChanges = (action: Action): string[] =>
	specOf(action)
		.immutable.filter((field) => action.changes?.[field])
		.map(
			(field) =>
				`${action.resourceType} "${action.name}" can't change ${field}; remove it in the dashboard and apply again`,
		);

const unknownReferences = (
	organization: OrganizationConfig,
	directory: Directory,
	projectNames: string[],
): string[] => {
	const known = (kind: DirectoryKind, declared: string[]) => (name: string) =>
		declared.includes(name) ||
		directory[kind].some((entry) => entry.name === name);
	const serverKnown = known(
		"servers",
		(organization.servers ?? []).map((server) => server.name),
	);
	const sshKeyKnown = known(
		"sshKeys",
		(organization.sshKeys ?? []).map((sshKey) => sshKey.name),
	);
	const projectKnown = known("projects", projectNames);
	const items = sectionsIn(organization).flatMap((spec) =>
		(organization[spec.section] as Fields[]).map((item) => ({ spec, item })),
	);
	return items.flatMap(({ spec, item }) => [
		...(item.serverName && !serverKnown(item.serverName)
			? [`Server "${item.serverName}" not found`]
			: []),
		...(item.sshKeyName && !sshKeyKnown(item.sshKeyName)
			? [`SSH key "${item.sshKeyName}" not found`]
			: []),
		...(item.assignments ?? [])
			.filter((assignment: Fields) => !projectKnown(assignment.project))
			.map(
				(assignment: Fields) =>
					`${spec.resourceType} "${item.name}" is assigned to unknown project "${assignment.project}"`,
			),
	]);
};

export async function planOrganization(
	organization: OrganizationConfig,
	projectNames: string[],
): Promise<Action[]> {
	const specs = sectionsIn(organization);
	const directory = await loadDirectory([
		...new Set(specs.flatMap((spec) => spec.directory)),
	]);
	const actions = (
		await sequence(specs, (spec) =>
			planSection(spec, organization[spec.section] as Fields[], directory),
		)
	).flat();
	const errors = [
		...actions.flatMap(missingOnCreate),
		...actions.flatMap(immutableChanges),
		...unknownReferences(organization, directory, projectNames),
	];
	if (errors.length > 0) {
		throw new Error(`Cannot apply:\n  ${errors.join("\n  ")}`);
	}
	return actions;
}

async function executeAction(
	spec: OrganizationSpec,
	action: Action,
	directory: Directory,
	organizationId: string | undefined,
): Promise<void> {
	if (action.type === "create") {
		const item = { ...spec.createDefaults(action.config), ...action.config };
		await apiPost(spec.createEndpoint(item), {
			...spec.toApi(item, directory),
			...(organizationId ? { organizationId } : {}),
		});
	}
	if (action.type === "update") {
		await apiPost(spec.updateEndpoint(action), {
			...spec.toApi(spec.updateBase(action), directory),
			...spec.updateIds(action),
		});
	}
}

async function executeSection(
	spec: OrganizationSpec,
	actions: Action[],
): Promise<Outcome[]> {
	const changing = actions.some((action) => action.type !== "unchanged");
	const directory = await loadDirectory(changing ? spec.directory : []);
	const organizationId: string | undefined =
		changing && spec.withOrganization
			? (await apiGet("organization.active")).id
			: undefined;
	const attempts = await sequence(actions, (action) =>
		attempt(action, actionLabel(action), () =>
			executeAction(spec, action, directory, organizationId),
		),
	);
	return attempts.map(({ outcome }) => outcome);
}

export async function executeOrganization(
	actions: Action[],
	phase: OrganizationSpec["phase"],
): Promise<ApplyResult> {
	const outcomes = await sequence(
		ORGANIZATION.filter((spec) => spec.phase === phase),
		(spec) =>
			executeSection(
				spec,
				actions.filter((action) => action.resourceType === spec.resourceType),
			),
	);
	return summarize(outcomes.flat());
}
