#!/usr/bin/env node

import { program } from 'commander';
import { setupCreateCommand } from './commands/create';
import { setupUpdateCommand } from './commands/update';
import { setupInitCommand } from './commands/init';
import { setupValidateCommand } from './commands/validate';

program
  .version('1.0.0')
  .description('Tartarus CLI - Gerador de código para arquitetura Khaos')
  .option('-v, --verbose', 'Saída detalhada');

setupCreateCommand(program);
setupUpdateCommand(program);
setupInitCommand(program);
setupValidateCommand(program);

// Melhor tratamento de erros
program.on('command:*', () => {
  console.error('❌ Comando inválido: %s\n', program.args.join(' '));
  console.log('💡 Execute "tartarus --help" para ver comandos disponíveis.');
  process.exit(1);
});

program.parse(process.argv);

// Se nenhum comando foi fornecido, mostrar ajuda
if (!process.argv.slice(2).length) {
  program.outputHelp();
} 