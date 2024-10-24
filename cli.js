#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { commands } from './bin/index.mjs';

// https://laurieontech.com/posts/yargs/
// https://github.com/yargs/yargs/blob/main/docs/advanced.md

yargs(hideBin(process.argv))
  .command(commands)
  .demandCommand()
  .help()
  .parse();
