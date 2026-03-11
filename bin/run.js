#!/usr/bin/env node

import 'dotenv/config'
import {execute} from '@oclif/core'

await execute({dir: import.meta.url})
