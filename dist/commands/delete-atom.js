"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAtom = deleteAtom;
const inquirer_1 = __importDefault(require("inquirer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
/**
 * Fluxo completo de remoção de átomos baseado no atom.md
 * 3 Passos: Listar → Visualizar → Confirmar
 */
async function deleteAtom() {
    console.log('🗑️  Removendo átomo Khaos...\n');
    try {
        // PASSO 1: Listar átomos existentes
        const existingAtoms = await getExistingAtoms();
        if (existingAtoms.length === 0) {
            console.log('❌ Nenhum átomo encontrado em src/atoms/');
            console.log('💡 Crie um átomo primeiro com: khaos atom');
            return;
        }
        const { selectedAtom } = await inquirer_1.default.prompt([
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
        const { confirm } = await inquirer_1.default.prompt([
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
    }
    catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}
/**
 * Lista todos os átomos existentes no diretório src/atoms/
 */
async function getExistingAtoms() {
    const atomsDir = path_1.default.join(process.cwd(), 'src/atoms');
    try {
        if (!await fs_extra_1.default.pathExists(atomsDir)) {
            return [];
        }
        const items = await fs_extra_1.default.readdir(atomsDir);
        const atoms = [];
        for (const item of items) {
            const itemPath = path_1.default.join(atomsDir, item);
            const stat = await fs_extra_1.default.stat(itemPath);
            if (stat.isDirectory()) {
                // Verifica se é um átomo válido (tem index.ts e .atom.tsx)
                const indexPath = path_1.default.join(itemPath, 'index.ts');
                const atomPath = path_1.default.join(itemPath, `${item}.atom.tsx`);
                if (await fs_extra_1.default.pathExists(indexPath) && await fs_extra_1.default.pathExists(atomPath)) {
                    atoms.push(item);
                }
            }
        }
        return atoms.sort();
    }
    catch (error) {
        return [];
    }
}
/**
 * Conta quantos arquivos o átomo possui
 */
function getAtomFilesCount(atomName) {
    const atomDir = path_1.default.join(process.cwd(), 'src/atoms', atomName);
    try {
        const files = fs_extra_1.default.readdirSync(atomDir);
        return files.length;
    }
    catch (error) {
        return 0;
    }
}
/**
 * Exibe a árvore de arquivos que será removida
 */
async function displayAtomDeletionTree(atomName) {
    const atomDir = path_1.default.join(process.cwd(), 'src/atoms', atomName);
    try {
        const files = await fs_extra_1.default.readdir(atomDir);
        const sortedFiles = files.sort();
        console.log(`src/atoms/`);
        console.log(`├── ${atomName}/`);
        sortedFiles.forEach((file, index) => {
            const isLast = index === sortedFiles.length - 1;
            const connector = isLast ? '└──' : '├──';
            console.log(`│   ${connector} ${file}`);
        });
        console.log('');
    }
    catch (error) {
        console.log('❌ Erro ao ler arquivos do átomo');
    }
}
/**
 * Remove todos os arquivos do átomo
 */
async function removeAtomFiles(atomName) {
    const atomDir = path_1.default.join(process.cwd(), 'src/atoms', atomName);
    try {
        await fs_extra_1.default.remove(atomDir);
        console.log(`✅ Diretório removido: src/atoms/${atomName}/`);
    }
    catch (error) {
        throw new Error(`Erro ao remover átomo: ${error.message}`);
    }
}
/**
 * Realiza commit automático seguindo Conventional Commits
 */
async function performAutoCommit(atomName) {
    try {
        // Verifica se está em um repositório git
        (0, child_process_1.execSync)('git rev-parse --git-dir', { stdio: 'ignore' });
        // Add e commit
        (0, child_process_1.execSync)('git add .', { stdio: 'ignore' });
        (0, child_process_1.execSync)(`git commit -m "chore: remove ${atomName} atom"`, { stdio: 'ignore' });
        console.log('📝 Commit automático realizado');
    }
    catch (error) {
        console.log('⚠️  Commit automático falhou (não é um repositório git ou sem mudanças)');
    }
}
