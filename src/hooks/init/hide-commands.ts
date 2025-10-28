import { Hook } from '@oclif/core';

const hook: Hook<'init'> = async function (opts) {
  // Hide all autocomplete-related commands from help
  const commandsToHide = ['autocomplete', 'autocomplete:script'];

  for (const cmd of opts.config.commands) {
    if (commandsToHide.includes(cmd.id) || cmd.id.startsWith('autocomplete:')) {
      cmd.hidden = true;
    }
  }
};

export default hook;
