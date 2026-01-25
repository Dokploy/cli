# Dokploy CLI

<!-- ![Dokploy Logo](https://via.placeholder.com/150x150.png?text=Dokploy+CLI) -->

Dokploy CLI is a powerful and versatile command-line tool designed to remotely manage your Dokploy server. It simplifies the process of creating, deploying, and managing applications and databases.

<!-- [![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dokploy.svg)](https://npmjs.org/package/dokploy)
[![Downloads/week](https://img.shields.io/npm/dw/dokploy.svg)](https://npmjs.org/package/dokploy)
[![License](https://img.shields.io/npm/l/dokploy.svg)](https://github.com/yourusername/dokploy/blob/master/package.json) -->

## Table of Contents

- [Installation](#installation)
- [Authentication](#authentication)
- [Quick Start](#quick-start)
- [Commands](#commands)
  - [Project Management](#project-management)
  - [Environment Management](#environment-management)
  - [Application Management](#application-management)
  - [Environment Variables](#environment-variables)
  - [Database Management](#database-management)
- [Contributing](#contributing)
- [License](#license)

## Installation

```sh-session
npm install -g @dokploy/cli
```

## Authentication

Before using the CLI, authenticate with your Dokploy server:

```sh-session
# Interactive authentication
dokploy authenticate

# Verify authentication
dokploy verify
```

Alternatively, set environment variables:

```sh-session
export DOKPLOY_URL="https://your-dokploy-server.com"
export DOKPLOY_AUTH_TOKEN="your-api-token"
```

## Quick Start

```sh-session
# List all projects
dokploy project list

# List environments in a project
dokploy environment list -p <projectId>

# List apps/services in an environment
dokploy app list -p <projectId> -e <environmentId>

# Pull environment variables
dokploy env pull .env.local -a <appId>

# Set a single environment variable
dokploy env set DATABASE_URL "postgres://localhost/db" -a <appId>
```

## Commands

### Project Management

| Command | Description |
|---------|-------------|
| `dokploy project list` | List all projects with IDs |
| `dokploy project info` | Get detailed project information |
| `dokploy project info -p <id>` | Get project info by ID |
| `dokploy project create` | Create a new project |

### Environment Management

| Command | Description |
|---------|-------------|
| `dokploy environment list` | List environments (interactive) |
| `dokploy environment list -p <projectId>` | List environments for a project |
| `dokploy environment create` | Create a new environment |
| `dokploy environment delete` | Delete an environment |

### Application Management

| Command | Description |
|---------|-------------|
| `dokploy app list` | List apps/services (interactive) |
| `dokploy app list -p <projectId> -e <envId>` | List apps in an environment |
| `dokploy app create` | Create a new application |
| `dokploy app deploy` | Deploy an application |
| `dokploy app stop` | Stop an application |
| `dokploy app delete` | Delete an application |

### Environment Variables

#### Pull Environment Variables

Download environment variables from a service to a local file.

```sh-session
# Interactive mode
dokploy env pull .env.local

# Using app ID (recommended)
dokploy env pull .env.local -a <appId>

# Using project/environment/service name
dokploy env pull .env.local -p <projectId> -e <envId> -s <serviceName>

# Skip confirmation prompt
dokploy env pull .env.local -a <appId> -y
```

#### Push Environment Variables

Upload a local .env file to a service (replaces all variables).

```sh-session
# Interactive mode
dokploy env push .env.local

# Note: This replaces ALL environment variables on the service
```

#### Get Single Variable

Get the value of a single environment variable.

```sh-session
# Using app ID
dokploy env get DATABASE_URL -a <appId>

# Interactive mode
dokploy env get DATABASE_URL
```

#### Set Single Variable

Set or update a single environment variable.

```sh-session
# Using app ID
dokploy env set DATABASE_URL "postgres://localhost/db" -a <appId>

# Skip confirmation
dokploy env set DATABASE_URL "postgres://localhost/db" -a <appId> -y

# Interactive mode
dokploy env set DATABASE_URL "postgres://localhost/db"
```

### Database Management

Dokploy supports multiple database types. Each has the same set of commands:

#### PostgreSQL

```sh-session
dokploy database postgres create
dokploy database postgres delete
dokploy database postgres deploy
dokploy database postgres stop
```

#### MySQL

```sh-session
dokploy database mysql create
dokploy database mysql delete
dokploy database mysql deploy
dokploy database mysql stop
```

#### MariaDB

```sh-session
dokploy database mariadb create
dokploy database mariadb delete
dokploy database mariadb deploy
dokploy database mariadb stop
```

#### MongoDB

```sh-session
dokploy database mongo create
dokploy database mongo delete
dokploy database mongo deploy
dokploy database mongo stop
```

#### Redis

```sh-session
dokploy database redis create
dokploy database redis delete
dokploy database redis deploy
dokploy database redis stop
```

## Command Help

For detailed help on any command:

```sh-session
dokploy --help
dokploy <command> --help
dokploy <command> <subcommand> --help
```

## Common Flags

| Flag | Short | Description |
|------|-------|-------------|
| `--projectId` | `-p` | Project ID |
| `--environmentId` | `-e` | Environment ID |
| `--appId` | `-a` | Application or Compose service ID |
| `--serviceName` | `-s` | Service name |
| `--skipConfirm` | `-y` | Skip confirmation prompts |

## Workflow Example

```sh-session
# 1. List projects to get project ID
dokploy project list

# 2. List environments to get environment ID
dokploy environment list -p WjxJrruxsH40dLEmtfhTl

# 3. List apps to get app ID
dokploy app list -p WjxJrruxsH40dLEmtfhTl -e WEj2NHHTRragIFLsLcOZp

# 4. Pull env vars using app ID
dokploy env pull .env.local -a qYa4KSujD73axxLuXcfYt -y

# 5. Or set a single variable
dokploy env set API_KEY "secret123" -a qYa4KSujD73axxLuXcfYt -y
```

## Contributing

If you want to contribute to Dokploy CLI, please check out our [Contributing Guide](https://github.com/Dokploy/cli/blob/main/CONTRIBUTING.md).

## Support

If you encounter any issues or have any questions, please [open an issue](https://github.com/yourusername/dokploy/issues) in our GitHub repository.

## License

This project is licensed under the [MIT License](LICENSE).
