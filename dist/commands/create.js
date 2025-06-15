"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCreateCommand = setupCreateCommand;
const inquirer_1 = __importDefault(require("inquirer"));
const ejs_1 = __importDefault(require("ejs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const simple_git_1 = require("simple-git");
function setupCreateCommand(program) {
    program
        .command('create <layer>')
        .description('Cria arquivos para uma camada específica')
        .action(async (layer) => {
        if (layer !== 'repository') {
            console.log('Camada não suportada. Use: repository');
            return;
        }
        // Passo 1: Perguntar descrição
        const { description } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'description',
                message: 'Descreva o que você quer construir:',
            },
        ]);
        // Passo 2: Sugerir nome (simulado, IA seria usada aqui)
        let suggestedName = description
            .toLowerCase()
            .replace(/gerenciar|criar/g, '')
            .trim()
            .replace(/\s+/g, '-');
        if (!suggestedName)
            suggestedName = 'strategy';
        const { name } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: `Nome sugerido: ${suggestedName}. Novo nome (Enter para aceitar):`,
                default: suggestedName,
                validate: (input) => /^[a-z0-9-]+$/.test(input) || 'Use apenas letras minúsculas, números e hífens',
            },
        ]);
        // Passo 3: Sugerir camadas
        const { layers } = await inquirer_1.default.prompt([
            {
                type: 'checkbox',
                name: 'layers',
                message: 'Selecione camadas relacionadas:',
                choices: [
                    { name: 'gateway (find-one)', checked: true },
                    { name: 'model', checked: true },
                    { name: 'entity', checked: false },
                ],
            },
        ]);
        // Passo 4: Gerar arquivos
        const files = [];
        const templateDir = path_1.default.join(__dirname, '../templates');
        const outputDir = process.cwd();
        // Repository
        const repoTemplate = await ejs_1.default.renderFile(path_1.default.join(templateDir, 'repository.ts.ejs'), { name, nameCapitalized: name.split('-').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join('') });
        const repoPath = path_1.default.join(outputDir, 'src/repositories', `${name}.repository.ts`);
        await fs_extra_1.default.ensureDir(path_1.default.dirname(repoPath));
        await fs_extra_1.default.writeFile(repoPath, repoTemplate);
        files.push(repoPath);
        // Gateway
        if (layers.includes('gateway (find-one)')) {
            const gatewayTemplate = await ejs_1.default.renderFile(path_1.default.join(templateDir, 'gateway.ts.ejs'), { name, nameCapitalized: name.split('-').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join('') });
            const gatewayPath = path_1.default.join(outputDir, 'src/gateways', `find-one-${name}.gateway.ts`);
            await fs_extra_1.default.ensureDir(path_1.default.dirname(gatewayPath));
            await fs_extra_1.default.writeFile(gatewayPath, gatewayTemplate);
            files.push(gatewayPath);
        }
        // Model
        if (layers.includes('model')) {
            const modelTemplate = await ejs_1.default.renderFile(path_1.default.join(templateDir, 'model.ts.ejs'), { name, nameCapitalized: name.split('-').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join('') });
            const modelPath = path_1.default.join(outputDir, 'src/models', `${name}.model.ts`);
            await fs_extra_1.default.ensureDir(path_1.default.dirname(modelPath));
            await fs_extra_1.default.writeFile(modelPath, modelTemplate);
            files.push(modelPath);
        }
        // Entity
        if (layers.includes('entity')) {
            const entityTemplate = await ejs_1.default.renderFile(path_1.default.join(templateDir, 'entity.ts.ejs'), { name, nameCapitalized: name.split('-').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join('') });
            const entityPath = path_1.default.join(outputDir, 'src/entities', `${name}.entity.ts`);
            await fs_extra_1.default.ensureDir(path_1.default.dirname(entityPath));
            await fs_extra_1.default.writeFile(entityPath, entityTemplate);
            files.push(entityPath);
        }
        console.log('Arquivos gerados:', files);
        // Passo 5: Sugerir commit
        const { doCommit } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'doCommit',
                message: `Fazer commit? Mensagem: 'feat: add ${name} repository and related files'`,
                default: true,
            },
        ]);
        if (doCommit) {
            const git = (0, simple_git_1.simpleGit)();
            try {
                await git.add(files);
                await git.commit(`feat: add ${name} repository and related files`);
                console.log('Commit realizado com sucesso!');
            }
            catch (error) {
                console.log('Erro ao fazer commit:', error.message);
            }
        }
    });
}
