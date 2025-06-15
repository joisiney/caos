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
const config_1 = require("../utils/config");
const helpers_1 = require("../utils/helpers");
function setupCreateCommand(program) {
    program
        .command('create <layer>')
        .description('Cria arquivos para uma camada específica')
        .action(async (layer) => {
        const supportedLayers = ['repository', 'gateway', 'model', 'entity', 'component', 'feature', 'layout'];
        if (!supportedLayers.includes(layer)) {
            console.log('❌ Camada não suportada.');
            console.log(`💡 Camadas disponíveis: ${supportedLayers.join(', ')}`);
            return;
        }
        // Verificar se é um projeto Khaos
        if (!await (0, helpers_1.isKhaosProject)()) {
            console.log('⚠️  Este não parece ser um projeto Khaos.');
            const { proceed } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'proceed',
                    message: 'Continuar mesmo assim?',
                    default: false,
                },
            ]);
            if (!proceed) {
                console.log('💡 Execute "tartarus init" para inicializar um projeto Khaos.');
                return;
            }
        }
        const config = await (0, config_1.loadConfig)();
        // Passo 1: Perguntar descrição
        const { description } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'description',
                message: 'Descreva o que você quer construir:',
            },
        ]);
        // Passo 2: Sugerir nome usando IA simulada
        const suggestedName = (0, helpers_1.suggestName)(description);
        const { name } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: `Nome sugerido: ${suggestedName}. Novo nome (Enter para aceitar):`,
                default: suggestedName,
                validate: (input) => {
                    const result = (0, helpers_1.sanitizeName)(input);
                    return result.isValid || result.error || 'Nome inválido';
                },
            },
        ]);
        // Passo 3: Sugerir camadas relacionadas (apenas para repository)
        let relatedLayers = [];
        if (layer === 'repository') {
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
            relatedLayers = layers;
        }
        else if (layer === 'feature') {
            const { includeRepository } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'includeRepository',
                    message: 'Incluir repository relacionado?',
                    default: true,
                },
            ]);
            if (includeRepository) {
                relatedLayers = ['repository', 'gateway', 'model', 'entity'];
            }
        }
        // Passo 4: Gerar arquivos
        const spinner = (0, helpers_1.createSpinner)('Gerando arquivos...');
        try {
            const files = [];
            const templateDir = path_1.default.join(__dirname, '../templates');
            const outputDir = process.cwd();
            const nameCapitalized = (0, helpers_1.toPascalCase)(name);
            // Função para gerar arquivo individual
            const generateFile = async (layerType, namePrefix = '') => {
                const templatePath = path_1.default.join(templateDir, config.templates[layerType]);
                const layerDir = config.directories[layerType + 's'] || config.directories[layerType];
                const suffix = config.naming.suffixes[layerType];
                if (!await fs_extra_1.default.pathExists(templatePath)) {
                    console.log(`⚠️ Template não encontrado para ${layerType}: ${templatePath}`);
                    return;
                }
                const template = await ejs_1.default.renderFile(templatePath, { name, nameCapitalized });
                const fileName = namePrefix ? `${namePrefix}-${name}${suffix}` : `${name}${suffix}`;
                const filePath = path_1.default.join(outputDir, layerDir, fileName);
                await fs_extra_1.default.ensureDir(path_1.default.dirname(filePath));
                await fs_extra_1.default.writeFile(filePath, template);
                files.push(filePath);
            };
            // Gerar arquivo principal da camada
            await generateFile(layer);
            // Gerar arquivos relacionados
            if (relatedLayers.includes('gateway (find-one)')) {
                await generateFile('gateway', 'find-one');
            }
            if (relatedLayers.includes('model')) {
                await generateFile('model');
            }
            if (relatedLayers.includes('entity')) {
                await generateFile('entity');
            }
            if (relatedLayers.includes('repository')) {
                await generateFile('repository');
            }
            spinner.stop('✅ Arquivos gerados com sucesso!');
            console.log('📁 Arquivos criados:', files.map(f => path_1.default.relative(outputDir, f)));
            // Passo 5: Sugerir commit
            if (config.git.autoCommit) {
                const { doCommit } = await inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'doCommit',
                        message: `Fazer commit? Mensagem: '${config.git.commitTemplate.replace('{name}', name).replace('{layer}', 'repository')}'`,
                        default: true,
                    },
                ]);
                if (doCommit) {
                    const commitSpinner = (0, helpers_1.createSpinner)('Fazendo commit...');
                    const git = (0, simple_git_1.simpleGit)();
                    try {
                        await git.add(files);
                        await git.commit(config.git.commitTemplate.replace('{name}', name).replace('{layer}', 'repository'));
                        commitSpinner.stop('✅ Commit realizado com sucesso!');
                    }
                    catch (error) {
                        commitSpinner.stop('❌ Erro ao fazer commit');
                        console.log('Erro:', error.message);
                    }
                }
            }
        }
        catch (error) {
            spinner.stop('❌ Erro ao gerar arquivos');
            console.error('Erro:', error.message);
            process.exit(1);
        }
    });
}
