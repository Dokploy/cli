import { Command } from '@oclif/core';

export default class Autocomplete extends Command {
  static override description = 'Autocomplete is automatically enabled';
  static override hidden = true;

  async run(): Promise<void> {
    this.error('This command is disabled. Autocomplete is automatically enabled during installation.');
  }
}
