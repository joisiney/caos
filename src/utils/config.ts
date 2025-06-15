import fs from 'fs-extra';
import path from 'path';

export interface TartarusConfig {
  templates: {
    repository: string;
    gateway: string;
    model: string;
    entity: string;
  };
  directories: {
    repositories: string;
    gateways: string;
    models: string;
    entities: string;
  };
  naming: {
    caseStyle: 'kebab-case' | 'camelCase' | 'PascalCase';
    suffixes: {
      repository: string;
      gateway: string;
      model: string;
      entity: string;
    };
  };
  git: {
    autoCommit: boolean;
    commitTemplate: string;
  };
}

const DEFAULT_CONFIG: TartarusConfig = {
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

export async function loadConfig(): Promise<TartarusConfig> {
  const configPaths = [
    '.tartarusrc.json',
    '.tartarusrc.js',
    'tartarus.config.json',
    'tartarus.config.js',
  ];

  for (const configPath of configPaths) {
    if (await fs.pathExists(configPath)) {
      try {
        if (configPath.endsWith('.js')) {
          const configModule = require(path.resolve(configPath));
          return { ...DEFAULT_CONFIG, ...configModule.default || configModule };
        } else {
          const configContent = await fs.readJson(configPath);
          return { ...DEFAULT_CONFIG, ...configContent };
        }
      } catch (error) {
        console.warn(`⚠️  Erro ao carregar configuração de ${configPath}:`, error);
      }
    }
  }

  return DEFAULT_CONFIG;
}

export async function createDefaultConfig(): Promise<void> {
  const configPath = '.tartarusrc.json';
  
  if (await fs.pathExists(configPath)) {
    console.log('📋 Arquivo de configuração já existe:', configPath);
    return;
  }

  await fs.writeJson(configPath, DEFAULT_CONFIG, { spaces: 2 });
  console.log('✅ Arquivo de configuração criado:', configPath);
  console.log('💡 Você pode customizar as configurações editando este arquivo.');
} 