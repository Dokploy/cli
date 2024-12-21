# Dokploy CLI

<!-- ![Dokploy Logo](https://via.placeholder.com/150x150.png?text=Dokploy+CLI) -->

Dokploy CLI is a powerful and versatile command-line tool designed to remotely manage your Dokploy server. It simplifies the process of creating, deploying, and managing applications and databases.

<!-- [![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dokploy.svg)](https://npmjs.org/package/dokploy)
[![Downloads/week](https://img.shields.io/npm/dw/dokploy.svg)](https://npmjs.org/package/dokploy)
[![License](https://img.shields.io/npm/l/dokploy.svg)](https://github.com/yourusername/dokploy/blob/master/package.json) -->

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Commands](#commands)
  - [Authentication](#authentication)
  - [Project Management](#project-management)
  - [Application Management](#application-management)
  - [Database Management](#database-management)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Installation

```sh-session
$ npm install -g @dokploy/cli
```

## Usage

```sh-session
$ dokploy COMMAND
running command...

$ dokploy --version
dokploy/0.0.0 darwin-arm64 node-v18.18.0

$ dokploy --help [COMMAND]
USAGE
  $ dokploy COMMAND
...
```

## Commands

### Authentication

- `dokploy authenticate`: Authenticate with the Dokploy server.
- `dokploy verify`: Verify current authentication.

### Project Management

- `dokploy project:create`: Create a new project.
- `dokploy project:info`: Get information about an existing project.
- `dokploy project:list`: List all projects.

### Application Management

- `dokploy app:create`: Create a new application.
- `dokploy app:delete`: Delete an existing application.
- `dokploy app:deploy`: Deploy an application.
- `dokploy app:stop`: Stop a running application.

### Enviroment Management

- `dokploy env pull <file>`: Pull environment variables from Dokploy in a <file>.
- `dokploy env push <file>`: Push environment variables to Dokploy from a <file>.

### Database Management

Dokploy supports various types of databases:

#### MariaDB

- `dokploy database:mariadb:create`
- `dokploy database:mariadb:delete`
- `dokploy database:mariadb:deploy`
- `dokploy database:mariadb:stop`

#### MongoDB

- `dokploy database:mongo:create`
- `dokploy database:mongo:delete`
- `dokploy database:mongo:deploy`
- `dokploy database:mongo:stop`

#### MySQL

- `dokploy database:mysql:create`
- `dokploy database:mysql:delete`
- `dokploy database:mysql:deploy`
- `dokploy database:mysql:stop`

#### PostgreSQL

- `dokploy database:postgres:create`
- `dokploy database:postgres:delete`
- `dokploy database:postgres:deploy`
- `dokploy database:postgres:stop`

#### Redis

- `dokploy database:redis:create`
- `dokploy database:redis:delete`
- `dokploy database:redis:deploy`
- `dokploy database:redis:stop`

For more information about a specific command, use:

```sh-session
$ dokploy [COMMAND] --help
```

## Contributing

If you want to contribute to Dokploy CLI, please check out our [Contributing Guide](https://github.com/Dokploy/cli/blob/main/CONTRIBUTING.md).

## Support

If you encounter any issues or have any questions, please [open an issue](https://github.com/yourusername/dokploy/issues) in our GitHub repository.

## License

This project is licensed under the [MIT License](LICENSE).
