#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const create_atom_1 = require("./commands/create-atom");
const program = new commander_1.Command();
program
    .name('khaos')
    .description('🧬 Khaos CLI - Gerador de componentes baseado em Atomic Design')
    .version('1.0.0');
// Comando principal com menu interativo
program
    .command('create')
    .description('Criar um novo componente')
    .action(async () => {
    await showMainMenu();
});
// Comando direto para átomos (mantém compatibilidade)
program
    .command('atom')
    .description('Criar um novo átomo diretamente')
    .action(async () => {
    await (0, create_atom_1.createAtom)();
});
async function showMainMenu() {
    console.log('🧬 Bem-vindo ao Khaos CLI!\n');
    const { choice } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'choice',
            message: '🎯 O que você deseja criar?',
            choices: [
                {
                    name: '🧬 Átomo (Elemento básico e reutilizável)',
                    value: 'atom',
                    short: 'Átomo'
                },
                {
                    name: '🧪 Molécula (Combinação de átomos)',
                    value: 'molecule',
                    short: 'Molécula'
                },
                {
                    name: '❌ Cancelar',
                    value: 'cancel',
                    short: 'Cancelar'
                }
            ]
        }
    ]);
    switch (choice) {
        case 'atom':
            await (0, create_atom_1.createAtom)();
            break;
        case 'molecule':
            await createMolecule();
            break;
        case 'cancel':
            console.log('👋 Operação cancelada. Até logo!');
            break;
        default:
            console.log('❌ Opção inválida');
    }
}
async function createMolecule() {
    console.log('🧪 Criação de moléculas ainda não implementada!');
    console.log('💡 Em breve: componentes que combinam múltiplos átomos');
    console.log('📋 Por enquanto, use: khaos atom');
}
program.parse();
