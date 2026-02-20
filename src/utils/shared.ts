import type { Command } from "@oclif/core";

import axios from "axios";
import chalk from "chalk";

import type { AuthConfig } from "./utils.js";

export type Application = {
	applicationId: string;
	name: string;
	appName: string;
	serverId: string | null;
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
		const response = await axios.get(`${auth.url}/api/trpc/project.all`, {
			headers: {
				"x-api-key": auth.token,
				"Content-Type": "application/json",
			},
		});

		if (!response.data.result.data.json) {
			command.error(chalk.red("Error fetching projects"));
		}

		const projects = response.data.result.data.json;

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
		const response = await axios.get(`${auth.url}/api/trpc/project.one`, {
			headers: {
				"x-api-key": auth.token,
				"Content-Type": "application/json",
			},
			params: {
				input: JSON.stringify({
					json: { projectId },
				}),
			},
		});

		if (!response.data.result.data.json) {
			command.error(chalk.red("Error fetching project"));
		}

		const project = response.data.result.data.json;

		if (!project) {
			command.error(chalk.red("Error fetching project"));
		}

		return project;
	} catch (error) {
		// @ts-expect-error  TODO: Fix this
		command.error(chalk.red(`Failed to fetch project: ${error.message}`));
	}
};

export type Server = {
	serverId: string;
	name: string;
	ipAddress: string;
	port: number;
	username: string;
	sshKeyId: string | null;
};

export const getServer = async (
	serverId: string,
	auth: AuthConfig,
	command: Command,
): Promise<Server> => {
	try {
		const response = await axios.get(
			`${auth.url}/api/trpc/server.one`,
			{
				headers: {
					"x-api-key": auth.token,
					"Content-Type": "application/json",
				},
				params: {
					input: JSON.stringify({
						json: { serverId },
					}),
				},
			},
		);

		if (!response.data.result.data.json) {
			command.error(chalk.red("Error fetching server"));
		}

		return response.data.result.data.json;
	} catch (error) {
		// @ts-expect-error  TODO: Fix this
		command.error(chalk.red(`Failed to fetch server: ${error.message}`));
	}
};

export const getApplication = async (
	applicationId: string,
	auth: AuthConfig,
	command: Command,
): Promise<Application> => {
	try {
		const response = await axios.get(
			`${auth.url}/api/trpc/application.one`,
			{
				headers: {
					"x-api-key": auth.token,
					"Content-Type": "application/json",
				},
				params: {
					input: JSON.stringify({
						json: { applicationId },
					}),
				},
			},
		);

		if (!response.data.result.data.json) {
			command.error(chalk.red("Error fetching application"));
		}

		return response.data.result.data.json;
	} catch (error) {
		// @ts-expect-error  TODO: Fix this
		command.error(chalk.red(`Failed to fetch application: ${error.message}`));
	}
};
