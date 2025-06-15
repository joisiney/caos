"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupUpdateCommand = setupUpdateCommand;
const inquirer_1 = __importDefault(require("inquirer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const simple_git_1 = require("simple-git");
function setupUpdateCommand(program) {
    program
        .command('update <layer>')
        .description('Atualiza o nome de arquivos de uma camada')
        .action(async (layer) => {
        if (layer !== 'repository') {
            console.log('Camada não suportada. Use: repository');
            return;
        }
        // Passo 1: Listar repositórios existentes
        const repoDir = path_1.default.join(process.cwd(), 'src/repositories');
        let repos = [];
        try {
            repos = (await fs_extra_1.default.readdir(repoDir)).filter(f => f.endsWith('.repository.ts'));
        }
        catch {
            console.log('Nenhum repositório encontrado.');
            return;
        }
        if (repos.length === 0) {
            console.log('Nenhum repositório encontrado.');
            return;
        }
        const { repo } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'repo',
                message: 'Selecione o repositório:',
                choices: repos,
            },
        ]);
        const oldName = repo.replace('.repository.ts', '');
        // Passo 2: Perguntar novo nome
        const { newName } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'newName',
                message: `Novo nome (atual: ${oldName}):`,
                validate: (input) => /^[a-z0-9-]+$/.test(input) || 'Use apenas letras minúsculas, números e hífens',
            },
        ]);
        if (newName === oldName) {
            console.log('Nome não foi alterado. Operação cancelada.');
            return;
        }
        // Passo 3: Listar arquivos relacionados
        const relatedFiles = [
            { path: `src/gateways/find-one-${oldName}.gateway.ts`, newPath: `src/gateways/find-one-${newName}.gateway.ts` },
            { path: `src/models/${oldName}.model.ts`, newPath: `src/models/${newName}.model.ts` },
            { path: `src/entities/${oldName}.entity.ts`, newPath: `src/entities/${newName}.entity.ts` },
        ].filter(f => fs_extra_1.default.existsSync(path_1.default.join(process.cwd(), f.path)));
        if (relatedFiles.length === 0) {
            console.log('Nenhum arquivo relacionado encontrado.');
        }
        else {
            const { selectedFiles } = await inquirer_1.default.prompt([
                {
                    type: 'checkbox',
                    name: 'selectedFiles',
                    message: 'Renomear arquivos relacionados?',
                    choices: relatedFiles.map(f => ({ name: f.path, value: f, checked: true })),
                },
            ]);
            relatedFiles.splice(0, relatedFiles.length, ...selectedFiles);
        }
        // Passo 4: Renomear arquivos
        const files = [];
        const repoPath = path_1.default.join(repoDir, repo);
        const newRepoPath = path_1.default.join(repoDir, `${newName}.repository.ts`);
        await fs_extra_1.default.rename(repoPath, newRepoPath);
        files.push(newRepoPath);
        for (const file of relatedFiles) {
            const oldPath = path_1.default.join(process.cwd(), file.path);
            const newPath = path_1.default.join(process.cwd(), file.newPath);
            await fs_extra_1.default.rename(oldPath, newPath);
            files.push(newPath);
        }
        // Passo 5: Atualizar imports (simplificado)
        for (const file of files) {
            let content = await fs_extra_1.default.readFile(file, 'utf-8');
            // Substituir nomes nos imports e referencias
            const oldNameCapitalized = oldName.split('-').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join('');
            const newNameCapitalized = newName.split('-').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join('');
            content = content.replace(new RegExp(oldName, 'g'), newName);
            content = content.replace(new RegExp(oldNameCapitalized, 'g'), newNameCapitalized);
            await fs_extra_1.default.writeFile(file, content);
        }
        console.log('Arquivos atualizados:', files);
        // Passo 6: Sugerir commit
        const { doCommit } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'doCommit',
                message: `Fazer commit? Mensagem: 'refactor: rename ${oldName} to ${newName}'`,
                default: true,
            },
        ]);
        if (doCommit) {
            const git = (0, simple_git_1.simpleGit)();
            try {
                await git.add(files);
                await git.commit(`refactor: rename ${oldName} to ${newName}`);
                console.log('Commit realizado com sucesso!');
            }
            catch (error) {
                console.log('Erro ao fazer commit:', error.message);
            }
        }
    });
}
