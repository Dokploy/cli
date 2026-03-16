import type { Command } from "@oclif/core";

import chalk from "chalk";

import * as api from "./api.js";
import type { AuthConfig } from "./utils.js";

export type Application = {
	applicationId: string;
	name: string;
	// Add other application properties as needed
};

export type Database = {
	mariadbId?: string;
	mongoId?: string;
	mysqlId?: string;
	postgresId?: string;
	redisId?: string;
	name: string;
	// Add other database properties as needed
};

export type Environment = {
	name: string;
	environmentId: string;
	description: string;
	createdAt: string;
	env: string;
	projectId: string;
	applications: Application[];
	mariadb: Database[];
	mongo: Database[];
	mysql: Database[];
	postgres: Database[];
	redis: Database[];
	compose: any[];
};

export type Project = {
	adminId: string;
	name: string;
	projectId?: string | undefined;
	description?: string | undefined;
	environments?: Environment[];
};

export const getProjects = async (
	auth: AuthConfig,
	command: Command,
): Promise<Project[]> => {
	try {
		const projects = await api.listProjects(auth);

		if (projects.length === 0) {
			command.log(chalk.yellow("No projects found."));
			return [];
		}

		return projects;
	} catch (error) {
		// @ts-expect-error  TODO: Fix this
		command.error(chalk.red(`Failed to fetch project list: ${error.message}`));
	}
};

export const getProject = async (
	projectId: string | undefined,
	auth: AuthConfig,
	command: Command,
) => {
	try {
		if (!projectId) {
			command.error(chalk.red("Project ID is required"));
		}
		const project = await api.getProject(auth, projectId);

		if (!project) {
			command.error(chalk.red("Error fetching project"));
		}

		return project;
	} catch (error) {
		// @ts-expect-error  TODO: Fix this
		command.error(chalk.red(`Failed to fetch project: ${error.message}`));
	}
};
