#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import { createAtom } from './commands/create-atom';

const program = new Command();

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
    await createAtom();
  });

async function showMainMenu() {
  console.log('🧬 Bem-vindo ao Khaos CLI!\n');
  
  const { choice } = await inquirer.prompt([
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
      await createAtom();
      break;
    case 'molecule':
      console.log('🧪 Criação de moléculas ainda não implementada!');
      console.log('💡 Em breve: componentes que combinam múltiplos átomos');
      console.log('📋 Por enquanto, use: khaos atom');
      break;
    case 'cancel':
      console.log('👋 Operação cancelada. Até logo!');
      break;
    default:
      console.log('❌ Opção inválida');
  }
}

program.parse();