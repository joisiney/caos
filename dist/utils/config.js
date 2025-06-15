"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.createDefaultConfig = createDefaultConfig;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const DEFAULT_CONFIG = {
    templates: {
        repository: 'repository.ts.ejs',
        gateway: 'gateway.ts.ejs',
        model: 'model.ts.ejs',
        entity: 'entity.ts.ejs',
    },
    directories: {
        repositories: 'src/repositories',
        gateways: 'src/gateways',
        models: 'src/models',
        entities: 'src/entities',
    },
    naming: {
        caseStyle: 'kebab-case',
        suffixes: {
            repository: '.repository.ts',
            gateway: '.gateway.ts',
            model: '.model.ts',
            entity: '.entity.ts',
        },
    },
    git: {
        autoCommit: true,
        commitTemplate: 'feat: add {name} {layer} and related files',
    },
};
async function loadConfig() {
    const configPaths = [
        '.tartarusrc.json',
        '.tartarusrc.js',
        'tartarus.config.json',
        'tartarus.config.js',
    ];
    for (const configPath of configPaths) {
        if (await fs_extra_1.default.pathExists(configPath)) {
            try {
                if (configPath.endsWith('.js')) {
                    const configModule = require(path_1.default.resolve(configPath));
                    return { ...DEFAULT_CONFIG, ...configModule.default || configModule };
                }
                else {
                    const configContent = await fs_extra_1.default.readJson(configPath);
                    return { ...DEFAULT_CONFIG, ...configContent };
                }
            }
            catch (error) {
                console.warn(`⚠️  Erro ao carregar configuração de ${configPath}:`, error);
            }
        }
    }
    return DEFAULT_CONFIG;
}
async function createDefaultConfig() {
    const configPath = '.tartarusrc.json';
    if (await fs_extra_1.default.pathExists(configPath)) {
        console.log('📋 Arquivo de configuração já existe:', configPath);
        return;
    }
    await fs_extra_1.default.writeJson(configPath, DEFAULT_CONFIG, { spaces: 2 });
    console.log('✅ Arquivo de configuração criado:', configPath);
    console.log('💡 Você pode customizar as configurações editando este arquivo.');
}
