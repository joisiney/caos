import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Fluxo completo de remoção de átomos baseado no atom.md
 * 3 Passos: Listar → Visualizar → Confirmar
 */
export async function deleteAtom() {
  console.log('🗑️  Removendo átomo Khaos...\n');

  try {
    // PASSO 1: Listar átomos existentes
    const existingAtoms = await getExistingAtoms();
    
    if (existingAtoms.length === 0) {
      console.log('❌ Nenhum átomo encontrado em src/atoms/');
      console.log('💡 Crie um átomo primeiro com: khaos atom');
      return;
    }

    const { selectedAtom } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedAtom',
        message: '🎯 Selecione um átomo para remover:',
        choices: existingAtoms.map(atom => ({
          name: `${atom} (${getAtomFilesCount(atom)} arquivos)`,
          value: atom,
          short: atom
        }))
      },
    ]);

    // PASSO 2: Visualizar árvore de arquivos que será removida
    console.log('\n📁 Arquivos que serão removidos:');
    await displayAtomDeletionTree(selectedAtom);

    // PASSO 3: Confirmar remoção e commit
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `⚠️  Confirmar remoção do átomo "${selectedAtom}"? (Esta ação não pode ser desfeita)`,
        default: false,
      },
    ]);

    if (!confirm) {
      console.log('❌ Operação cancelada.');
      return;
    }

    // Remover átomo
    await removeAtomFiles(selectedAtom);
    
    // Commit automático
    await performAutoCommit(selectedAtom);
    
    console.log(`\n🎉 Átomo "${selectedAtom}" removido com sucesso!`);
    console.log(`💡 Commit automático: chore: remove ${selectedAtom} atom`);

  } catch (error: any) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

/**
 * Lista todos os átomos existentes no diretório src/atoms/
 */
async function getExistingAtoms(): Promise<string[]> {
  const atomsDir = path.join(process.cwd(), 'src/atoms');
  
  try {
    if (!await fs.pathExists(atomsDir)) {
      return [];
    }

    const items = await fs.readdir(atomsDir);
    const atoms: string[] = [];

    for (const item of items) {
      const itemPath = path.join(atomsDir, item);
      const stat = await fs.stat(itemPath);
      
      if (stat.isDirectory()) {
        // Verifica se é um átomo válido (tem index.ts e .atom.tsx)
        const indexPath = path.join(itemPath, 'index.ts');
        const atomPath = path.join(itemPath, `${item}.atom.tsx`);
        
        if (await fs.pathExists(indexPath) && await fs.pathExists(atomPath)) {
          atoms.push(item);
        }
      }
    }

    return atoms.sort();
  } catch (error) {
    return [];
  }
}

/**
 * Conta quantos arquivos o átomo possui
 */
function getAtomFilesCount(atomName: string): number {
  const atomDir = path.join(process.cwd(), 'src/atoms', atomName);
  
  try {
    const files = fs.readdirSync(atomDir);
    return files.length;
  } catch (error) {
    return 0;
  }
}

/**
 * Exibe a árvore de arquivos que será removida
 */
async function displayAtomDeletionTree(atomName: string) {
  const atomDir = path.join(process.cwd(), 'src/atoms', atomName);
  
  try {
    const files = await fs.readdir(atomDir);
    const sortedFiles = files.sort();
    
    console.log(`src/atoms/`);
    console.log(`├── ${atomName}/`);
    
    sortedFiles.forEach((file, index) => {
      const isLast = index === sortedFiles.length - 1;
      const connector = isLast ? '└──' : '├──';
      console.log(`│   ${connector} ${file}`);
    });
    
    console.log('');
  } catch (error) {
    console.log('❌ Erro ao ler arquivos do átomo');
  }
}

/**
 * Remove todos os arquivos do átomo
 */
async function removeAtomFiles(atomName: string) {
  const atomDir = path.join(process.cwd(), 'src/atoms', atomName);
  
  try {
    await fs.remove(atomDir);
    console.log(`✅ Diretório removido: src/atoms/${atomName}/`);
  } catch (error: any) {
    throw new Error(`Erro ao remover átomo: ${error.message}`);
  }
}

/**
 * Realiza commit automático seguindo Conventional Commits
 */
async function performAutoCommit(atomName: string) {
  try {
    // Verifica se está em um repositório git
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    
    // Add e commit
    execSync('git add .', { stdio: 'ignore' });
    execSync(`git commit -m "chore: remove ${atomName} atom"`, { stdio: 'ignore' });
    
    console.log('📝 Commit automático realizado');
  } catch (error) {
    console.log('⚠️  Commit automático falhou (não é um repositório git ou sem mudanças)');
  }
} 