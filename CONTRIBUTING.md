

# Contributing

Hey, thanks for your interest in contributing to Dokploy CLI! We appreciate your help and taking your time to contribute.


Before you start, please first discuss the feature/bug you want to add with the owners and comunity via github issues.

We have a few guidelines to follow when contributing to this project:

- [Commit Convention](#commit-convention)
- [Setup](#setup)
- [Development](#development)
- [Build](#build)
- [Pull Request](#pull-request)

## Commit Convention

Before you craete a Pull Request, please make sure your commit message follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### Commit Message Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests or correcting existing tests
* **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
* **ci**: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
* **chore**: Other changes that don't modify `src` or `test` files
* **revert**: Reverts a previous commit

Example:
```
feat: add new feature
```




## Setup

Before you start, please make the clone based on the `main` branch.

```bash
git clone https://github.com/Dokploy/cli.git
cd cli
pnpm install
```

## Development

First step is to authenticate, you can connect to a dokploy localhost or a remote dokploy server.

Authenticate

```bash
./bin/dev.js authenticate 
```

Let's take the example to create a new command for application called `start`.

You can use the generators from OCLIF to create a new command.

```bash
oclif generate command application:start
```

To run the command, you can use the following command:

```bash
./bin/dev.js application:start or ./bin/dev.js start
```

## Build

```bash
pnpm run build
```

## Publish

```bash
pnpm run publish
```


## Pull Request

- The `main` branch is the source of truth and should always reflect the latest stable release.
- Create a new branch for each feature or bug fix.
- Make sure to add tests for your changes.
- Make sure to update the documentation for any changes Go to the [docs.dokploy.com](https://docs.dokploy.com) website to see the changes.
- When creating a pull request, please provide a clear and concise description of the changes made.
- If you include a video or screenshot, would be awesome so we can see the changes in action.
- If your pull request fixes an open issue, please reference the issue in the pull request description.
- Once your pull request is merged, you will be automatically added as a contributor to the project.

Thank you for your contribution!

