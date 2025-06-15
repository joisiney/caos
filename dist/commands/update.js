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
const config_1 = require("../utils/config");
function setupUpdateCommand(program) {
    program
        .command('update <layer>')
        .description('Atualiza o nome de arquivos de uma camada')
        .action(async (layer) => {
        const supportedLayers = ['repository', 'gateway', 'model', 'entity', 'component', 'feature', 'layout'];
        if (!supportedLayers.includes(layer)) {
            console.log('❌ Camada não suportada.');
            console.log(`💡 Camadas disponíveis: ${supportedLayers.join(', ')}`);
            return;
        }
        const config = await (0, config_1.loadConfig)();
        // Passo 1: Listar arquivos existentes da camada
        const layerDir = config.directories[layer + 's'] || config.directories[layer];
        const suffix = config.naming.suffixes[layer];
        let files = [];
        try {
            const fullPath = path_1.default.join(process.cwd(), layerDir);
            files = (await fs_extra_1.default.readdir(fullPath)).filter(f => f.endsWith(suffix));
        }
        catch {
            console.log(`❌ Nenhum arquivo de ${layer} encontrado em ${layerDir}.`);
            return;
        }
        if (files.length === 0) {
            console.log(`❌ Nenhum arquivo de ${layer} encontrado.`);
            return;
        }
        const { selectedFile } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'selectedFile',
                message: `Selecione o ${layer}:`,
                choices: files,
            },
        ]);
        const oldName = selectedFile.replace(suffix, '');
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
        const updatedFiles = [];
        const oldFilePath = path_1.default.join(process.cwd(), layerDir, selectedFile);
        const newFileName = `${newName}${suffix}`;
        const newFilePath = path_1.default.join(process.cwd(), layerDir, newFileName);
        await fs_extra_1.default.rename(oldFilePath, newFilePath);
        updatedFiles.push(newFilePath);
        for (const file of relatedFiles) {
            const oldPath = path_1.default.join(process.cwd(), file.path);
            const newPath = path_1.default.join(process.cwd(), file.newPath);
            await fs_extra_1.default.rename(oldPath, newPath);
            updatedFiles.push(newPath);
        }
        // Passo 5: Atualizar imports (simplificado)
        for (const file of updatedFiles) {
            let content = await fs_extra_1.default.readFile(file, 'utf-8');
            // Substituir nomes nos imports e referencias
            const oldNameCapitalized = oldName.split('-').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join('');
            const newNameCapitalized = newName.split('-').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join('');
            content = content.replace(new RegExp(oldName, 'g'), newName);
            content = content.replace(new RegExp(oldNameCapitalized, 'g'), newNameCapitalized);
            await fs_extra_1.default.writeFile(file, content);
        }
        console.log('✅ Arquivos atualizados:', updatedFiles.map(f => path_1.default.relative(process.cwd(), f)));
        // Passo 6: Sugerir commit
        const { doCommit } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'doCommit',
                message: `Fazer commit? Mensagem: 'refactor: rename ${layer} ${oldName} to ${newName}'`,
                default: true,
            },
        ]);
        if (doCommit) {
            const git = (0, simple_git_1.simpleGit)();
            try {
                await git.add(updatedFiles);
                await git.commit(`refactor: rename ${layer} ${oldName} to ${newName}`);
                console.log('✅ Commit realizado com sucesso!');
            }
            catch (error) {
                console.log('❌ Erro ao fazer commit:', error.message);
            }
        }
    });
}
