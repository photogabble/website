#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import path from "node:path";
import fs from "node:fs";
import { commands } from './bin/index.mjs';

yargs(hideBin(process.argv))
  .command(commands)
  .demandCommand()
  .help()
  .parse();
