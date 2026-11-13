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

## Declarative config (`apply` / `export`)

Describe projects in a `dokploy.yaml` and let the CLI create or update them. Resources are matched by name, so the same file can be applied repeatedly.

```bash
# Snapshot one project, by id or name
dokploy export -p my-project -f dokploy.yaml

# Snapshot every project plus organization settings
dokploy export --all -f dokploy.yaml

# Include env, buildArgs and buildSecrets
dokploy export -p my-project -f dokploy.yaml --include-env

# Include env plus every password, key and token, e.g. to rebuild on a new machine
dokploy export --all -f backup.yaml --include-secrets

# Preview what would change
dokploy apply -f dokploy.yaml --dry-run --verbose

# Apply it
dokploy apply -f dokploy.yaml

# Also delete what the file doesn't declare
dokploy apply -f dokploy.yaml --dry-run --prune
```

See [`examples/dokploy.yaml`](examples/dokploy.yaml) for the format. A file holds one or more YAML documents separated by `---`:

- `kind: Project` documents describe a project with its environments, applications, compose services, postgres, mysql, mariadb, mongo and redis, plus their domains, ports, mounts, redirects, basic-auth security and schedules.
- At most one `kind: Organization` document describes SSH keys, servers, S3 destinations, registries, certificates, notifications and secret managers (`vaultProviders`). It is applied before the projects, except secret managers, which are applied after them so they can be assigned to projects created in the same run.

How it behaves:

- Only the fields you write are enforced; everything else is left as it is on the server.
- Nothing is deleted unless you pass `--prune`. With it, environments, services and their domains, ports, mounts, redirects, basic auth and schedules that the file doesn't declare are deleted. The default environment is emptied rather than deleted, a database's own data volume is kept, and compose volumes are kept. Organization settings are never pruned. Run with `--dry-run` first: deletions show up as `[delete]`.
- `serverName`, `sshKeyName` and `gitProvider` refer to a server, an SSH key and a git provider by their names in Dokploy. A server or SSH key can be declared in the Organization document of the same file. `serverName` only applies when a service is created; pointing an existing service at another server fails the plan.
- Database credentials (`databaseName`, `databaseUser`, `databasePassword`, `databaseRootPassword`) and SSH key pairs are only used when creating them; change them later from the dashboard.
- `env` is accepted on the project, each environment and each service, and applications also take `buildArgs` and `buildSecrets`. Each one is a block of `KEY=value` lines, the same text as the dashboard's Environment tab, so `${{project.KEY}}` and `${{environment.KEY}}` references work.
- `export` leaves out env and every password, key, token and webhook URL. `--include-env` adds env, and `--include-secrets` adds everything. `--verbose` never prints secret values, and export files are written readable only by you.
- Unknown keys are rejected, so typos fail instead of being ignored.

What it can't carry over:

- Git providers (GitHub apps, GitLab, Gitea, Bitbucket) are connected through an OAuth flow, so connect them in the dashboard first. `apply` stops before changing anything if a `gitProvider` name doesn't exist yet.
- Dokploy's API masks secret manager credentials, so `export` can't include them. Add them to the file before applying it to a new machine.
- Dokploy gives every new service a fresh internal name (`appName`) with a random suffix, so anything that reaches another service by its internal hostname needs updating after a rebuild.
- A new server still has to be set up from the dashboard after `apply` registers it.
- Volume data and database contents are not part of the file. Use Dokploy's backups for those.

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
