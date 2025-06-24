#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import { createAtom } from './commands/create-atom';
import { deleteAtom } from './commands/delete-atom';

const program = new Command();

program
  .name('khaos')
  .description('🧬 Khaos CLI - Gerador de componentes baseado em Atomic Design')
  .version('1.0.0');

// Comando create com menu de tipos ou direto
program
  .command('create')
  .description('Criar um novo componente')
  .argument('[type]', 'Tipo do componente (atom, molecule)')
  .action(async (type?: string) => {
    if (type) {
      await handleCreateType(type);
    } else {
      await showCreateMenu();
    }
  });

// Comando delete com menu de tipos ou direto
program
  .command('delete')
  .description('Remover um componente existente')
  .argument('[type]', 'Tipo do componente (atom, molecule)')
  .action(async (type?: string) => {
    if (type) {
      await handleDeleteType(type);
    } else {
      await showDeleteMenu();
    }
  });

// Comando direto para átomos (mantém compatibilidade)
program
  .command('atom')
  .description('Criar um novo átomo diretamente')
  .action(async () => {
    await createAtom();
  });

async function showCreateMenu() {
  console.log('🧬 Criando novo componente Khaos...\n');
  
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: '🎯 Qual tipo de componente você deseja criar?',
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

  await handleCreateType(choice);
}

async function showDeleteMenu() {
  console.log('🗑️  Removendo componente Khaos...\n');
  
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: '🎯 Qual tipo de componente você deseja remover?',
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

  await handleDeleteType(choice);
}

async function handleCreateType(type: string) {
  switch (type) {
    case 'atom':
      await createAtom();
      break;
    case 'molecule':
      console.log('🧪 Criação de moléculas ainda não implementada!');
      console.log('💡 Em breve: componentes que combinam múltiplos átomos');
      console.log('📋 Por enquanto, use: khaos create atom');
      break;
    case 'cancel':
      console.log('👋 Operação cancelada. Até logo!');
      break;
    default:
      console.log(`❌ Tipo inválido: ${type}`);
      console.log('💡 Tipos disponíveis: atom, molecule');
  }
}

async function handleDeleteType(type: string) {
  switch (type) {
    case 'atom':
      await deleteAtom();
      break;
    case 'molecule':
      console.log('🧪 Remoção de moléculas ainda não implementada!');
      console.log('💡 Em breve: remoção de componentes que combinam múltiplos átomos');
      console.log('📋 Por enquanto, use: khaos delete atom');
      break;
    case 'cancel':
      console.log('👋 Operação cancelada. Até logo!');
      break;
    default:
      console.log(`❌ Tipo inválido: ${type}`);
      console.log('💡 Tipos disponíveis: atom, molecule');
  }
}

program.parse();