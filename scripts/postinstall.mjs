#!/usr/bin/env node

/**
 * Postinstall script to setup autocomplete for dokploy CLI
 * Runs silently to avoid noise during npm install -g
 */

import { execSync } from 'child_process';
import { existsSync, appendFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const HOME = homedir();
const SHELL = process.env.SHELL || '';
const SHELL_NAME = SHELL.split('/').pop() || '';

function setupAutocomplete() {
  // Skip if not in a TTY (CI/CD environments)
  if (!process.stdout.isTTY) {
    return;
  }

  try {
    let rcFile = '';
    let setupCommand = '';

    if (SHELL_NAME === 'bash') {
      rcFile = join(HOME, '.bashrc');
      setupCommand = 'bash';
    } else if (SHELL_NAME === 'zsh') {
      rcFile = join(HOME, '.zshrc');
      setupCommand = 'zsh';
    } else {
      return; // Unsupported shell, skip silently
    }

    // Check if RC file exists
    if (!existsSync(rcFile)) {
      return;
    }

    // Check if already configured
    const rcContent = readFileSync(rcFile, 'utf-8');
    if (rcContent.includes('dokploy/autocomplete')) {
      return; // Already configured
    }

    // Generate autocomplete setup
    try {
      execSync(`dokploy autocomplete:script ${setupCommand} > /dev/null 2>&1`, { stdio: 'pipe' });
    } catch (error) {
      return; // Command not available yet, skip
    }

    const autocompletePath = join(HOME, `.cache/dokploy/autocomplete/${setupCommand}_setup`);

    if (existsSync(autocompletePath)) {
      // Add to RC file
      const autocompleteConfig = `\n# Dokploy CLI autocomplete\nDOKPLOY_AC_BASH_SETUP_PATH=${autocompletePath} && test -f $DOKPLOY_AC_BASH_SETUP_PATH && source $DOKPLOY_AC_BASH_SETUP_PATH;\n`;
      appendFileSync(rcFile, autocompleteConfig);
    }
  } catch (error) {
    // Silent fail - don't interrupt installation
  }
}

// Only run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupAutocomplete();
}

export { setupAutocomplete };
