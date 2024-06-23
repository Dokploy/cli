dokploy
=================

A CLI to manage dokploy server remotely


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dokploy.svg)](https://npmjs.org/package/dokploy)
[![Downloads/week](https://img.shields.io/npm/dw/dokploy.svg)](https://npmjs.org/package/dokploy)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g dokploy
$ dokploy COMMAND
running command...
$ dokploy (--version)
dokploy/0.0.0 darwin-arm64 node-v18.18.0
$ dokploy --help [COMMAND]
USAGE
  $ dokploy COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`dokploy hello PERSON`](#dokploy-hello-person)
* [`dokploy hello world`](#dokploy-hello-world)
* [`dokploy help [COMMAND]`](#dokploy-help-command)
* [`dokploy plugins`](#dokploy-plugins)
* [`dokploy plugins add PLUGIN`](#dokploy-plugins-add-plugin)
* [`dokploy plugins:inspect PLUGIN...`](#dokploy-pluginsinspect-plugin)
* [`dokploy plugins install PLUGIN`](#dokploy-plugins-install-plugin)
* [`dokploy plugins link PATH`](#dokploy-plugins-link-path)
* [`dokploy plugins remove [PLUGIN]`](#dokploy-plugins-remove-plugin)
* [`dokploy plugins reset`](#dokploy-plugins-reset)
* [`dokploy plugins uninstall [PLUGIN]`](#dokploy-plugins-uninstall-plugin)
* [`dokploy plugins unlink [PLUGIN]`](#dokploy-plugins-unlink-plugin)
* [`dokploy plugins update`](#dokploy-plugins-update)

## `dokploy hello PERSON`

Say hello

```
USAGE
  $ dokploy hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ dokploy hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/Dokploy/cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `dokploy hello world`

Say hello world

```
USAGE
  $ dokploy hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ dokploy hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/Dokploy/cli/blob/v0.0.0/src/commands/hello/world.ts)_

## `dokploy help [COMMAND]`

Display help for dokploy.

```
USAGE
  $ dokploy help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for dokploy.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.1.0/src/commands/help.ts)_

## `dokploy plugins`

List installed plugins.

```
USAGE
  $ dokploy plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ dokploy plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/src/commands/plugins/index.ts)_

## `dokploy plugins add PLUGIN`

Installs a plugin into dokploy.

```
USAGE
  $ dokploy plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into dokploy.

  Uses bundled npm executable to install plugins into /Users/mauricio/.local/share/dokploy

  Installation of a user-installed plugin will override a core plugin.

  Use the DOKPLOY_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the DOKPLOY_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ dokploy plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ dokploy plugins add myplugin

  Install a plugin from a github url.

    $ dokploy plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ dokploy plugins add someuser/someplugin
```

## `dokploy plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ dokploy plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ dokploy plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/src/commands/plugins/inspect.ts)_

## `dokploy plugins install PLUGIN`

Installs a plugin into dokploy.

```
USAGE
  $ dokploy plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into dokploy.

  Uses bundled npm executable to install plugins into /Users/mauricio/.local/share/dokploy

  Installation of a user-installed plugin will override a core plugin.

  Use the DOKPLOY_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the DOKPLOY_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ dokploy plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ dokploy plugins install myplugin

  Install a plugin from a github url.

    $ dokploy plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ dokploy plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/src/commands/plugins/install.ts)_

## `dokploy plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ dokploy plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ dokploy plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/src/commands/plugins/link.ts)_

## `dokploy plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ dokploy plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ dokploy plugins unlink
  $ dokploy plugins remove

EXAMPLES
  $ dokploy plugins remove myplugin
```

## `dokploy plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ dokploy plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/src/commands/plugins/reset.ts)_

## `dokploy plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ dokploy plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ dokploy plugins unlink
  $ dokploy plugins remove

EXAMPLES
  $ dokploy plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/src/commands/plugins/uninstall.ts)_

## `dokploy plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ dokploy plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ dokploy plugins unlink
  $ dokploy plugins remove

EXAMPLES
  $ dokploy plugins unlink myplugin
```

## `dokploy plugins update`

Update installed plugins.

```
USAGE
  $ dokploy plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.2.1/src/commands/plugins/update.ts)_
<!-- commandsstop -->
