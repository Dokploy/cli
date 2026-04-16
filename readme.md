# Dokploy CLI

Dokploy CLI is a command-line tool to manage your Dokploy server remotely. It provides **449 commands** auto-generated from the Dokploy OpenAPI spec, covering every API endpoint.

## Installation

```bash
npm install -g @dokploy/cli
```

## Authentication

### Option 1: Using the `auth` command

```bash
dokploy auth -u https://panel.dokploy.com -t YOUR_API_KEY
```

### Option 2: Environment variables

```bash
export DOKPLOY_URL="https://panel.dokploy.com"
export DOKPLOY_API_KEY="YOUR_API_KEY"
```

### Option 3: `.env` file

Create a `.env` file in your working directory:

```env
DOKPLOY_URL="https://panel.dokploy.com"
DOKPLOY_API_KEY="YOUR_API_KEY"
```

The CLI loads it automatically. Shell environment variables take priority over the `.env` file.

## Usage

```bash
dokploy <group> <action> [options]
```

### Examples

```bash
# List all projects
dokploy project all

# Get a specific project
dokploy project one --projectId abc123

# Create an application
dokploy application create --name "my-app" --environmentId env123

# Deploy an application
dokploy application deploy --applicationId app123

# Create a postgres database
dokploy postgres create --name "my-db" --environmentId env123

# Stop a database
dokploy postgres stop --postgresId pg123

# Get raw JSON output
dokploy project all --json
```

### Getting help

```bash
# List all groups
dokploy --help

# List actions in a group
dokploy application --help

# See options for a specific action
dokploy application deploy --help
```

## Available command groups

| Group | Commands | Group | Commands |
|---|---|---|---|
| `admin` | 1 | `notification` | 38 |
| `ai` | 9 | `organization` | 10 |
| `application` | 29 | `patch` | 12 |
| `backup` | 11 | `port` | 4 |
| `bitbucket` | 7 | `postgres` | 14 |
| `certificates` | 4 | `preview-deployment` | 4 |
| `cluster` | 4 | `project` | 8 |
| `compose` | 28 | `redirects` | 4 |
| `deployment` | 8 | `redis` | 14 |
| `destination` | 6 | `registry` | 7 |
| `docker` | 7 | `rollback` | 2 |
| `domain` | 9 | `schedule` | 6 |
| `environment` | 7 | `security` | 4 |
| `gitea` | 8 | `server` | 16 |
| `github` | 6 | `settings` | 49 |
| `gitlab` | 7 | `ssh-key` | 6 |
| `git-provider` | 2 | `sso` | 10 |
| `license-key` | 6 | `stripe` | 7 |
| `mariadb` | 14 | `swarm` | 3 |
| `mongo` | 14 | `user` | 18 |
| `mounts` | 6 | `volume-backups` | 6 |
| `mysql` | 14 | | |

## Development

```bash
# Install dependencies
pnpm install

# Run in dev mode
pnpm run dev -- project all

# Regenerate commands from OpenAPI spec
pnpm run generate

# Build
pnpm run build

# Lint & format
pnpm run lint
```

### Updating commands

Commands are auto-generated from `openapi.json`. To update:

1. Replace `openapi.json` with the latest spec from the [Dokploy repo](https://github.com/Dokploy/dokploy)
2. Run `pnpm run generate`
3. Build with `pnpm run build`

## Contributing

If you want to contribute to Dokploy CLI, please check out our [Contributing Guide](https://github.com/Dokploy/cli/blob/main/CONTRIBUTING.md).

## Support

If you encounter any issues or have any questions, please [open an issue](https://github.com/Dokploy/cli/issues) in our GitHub repository.

## License

This project is licensed under the [MIT License](LICENSE).
