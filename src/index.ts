#!/usr/bin/env node

import { program } from 'commander';
import { setupCreateCommand } from './commands/create';
import { setupUpdateCommand } from './commands/update';

program.version('1.0.0').description('Tartarus CLI para automação de arquivos');
setupCreateCommand(program);
setupUpdateCommand(program);
program.parse(process.argv); 