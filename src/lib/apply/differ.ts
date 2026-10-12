import { isDeepStrictEqual } from "node:util";
import {
	CHILDREN,
	type ChildKey,
	type Fields,
	type ServiceType,
} from "./resources.js";
import type { Action } from "./types.js";

export function diffResource(
	resourceType: string,
	name: string,
	config: Fields,
	remote: Fields | undefined,
	ignored: string[] = [],
): Action {
	if (!remote) {
		return { type: "create", resourceType, name, config };
	}

	const remoteId = remote[`${resourceType}Id`] as string;
	const changes = Object.fromEntries(
		Object.entries(config)
			.filter(
				([key, value]) =>
					value !== undefined &&
					!ignored.includes(key) &&
					!isDeepStrictEqual(value, remote[key]),
			)
			.map(([key, value]) => [key, { from: remote[key], to: value }]),
	);

	return Object.keys(changes).length === 0
		? { type: "unchanged", resourceType, name, config, remote, remoteId }
		: { type: "update", resourceType, name, config, remote, remoteId, changes };
}

export function diffChildren(
	key: ChildKey,
	parentType: ServiceType,
	localItems: Fields[],
	remoteItems: Fields[],
): Action[] {
	const { resourceType, identity } = CHILDREN[key];
	const remoteByIdentity = new Map(
		remoteItems.map((remote) => [identity(remote, parentType), remote]),
	);
	return localItems.map((local) => {
		const name = identity(local, parentType);
		return diffResource(resourceType, name, local, remoteByIdentity.get(name));
	});
}

export const changedValues = (action: Action): Fields =>
	Object.fromEntries(
		Object.entries(action.changes ?? {}).map(([key, { to }]) => [key, to]),
	);
