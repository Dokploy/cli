#!/usr/bin/env node

// Load .env from the CLI install directory, not the user's cwd
import { config } from 'dotenv'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') })

import {execute} from '@oclif/core'

await execute({dir: import.meta.url})
