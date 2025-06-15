#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const create_1 = require("./commands/create");
const update_1 = require("./commands/update");
const init_1 = require("./commands/init");
const validate_1 = require("./commands/validate");
commander_1.program
    .version('1.0.0')
    .description('Tartarus CLI - Gerador de código para arquitetura Khaos')
    .option('-v, --verbose', 'Saída detalhada');
(0, create_1.setupCreateCommand)(commander_1.program);
(0, update_1.setupUpdateCommand)(commander_1.program);
(0, init_1.setupInitCommand)(commander_1.program);
(0, validate_1.setupValidateCommand)(commander_1.program);
// Melhor tratamento de erros
commander_1.program.on('command:*', () => {
    console.error('❌ Comando inválido: %s\n', commander_1.program.args.join(' '));
    console.log('💡 Execute "tartarus --help" para ver comandos disponíveis.');
    process.exit(1);
});
commander_1.program.parse(process.argv);
// Se nenhum comando foi fornecido, mostrar ajuda
if (!process.argv.slice(2).length) {
    commander_1.program.outputHelp();
}
