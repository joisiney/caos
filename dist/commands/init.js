"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupInitCommand = setupInitCommand;
const inquirer_1 = __importDefault(require("inquirer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../utils/config");
function setupInitCommand(program) {
    program
        .command('init')
        .description('Inicializa um projeto com a estrutura Khaos e configuração Tartarus')
        .option('--config-only', 'Cria apenas o arquivo de configuração')
        .action(async (options) => {
        console.log('🌀 Inicializando projeto Khaos...\n');
        // Verificar se já existe estrutura
        const srcExists = await fs_extra_1.default.pathExists('src');
        if (!options.configOnly) {
            if (srcExists) {
                const { proceed } = await inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'proceed',
                        message: 'Diretório src/ já existe. Continuar mesmo assim?',
                        default: true,
                    },
                ]);
                if (!proceed) {
                    console.log('❌ Operação cancelada.');
                    return;
                }
            }
            // Criar estrutura de diretórios
            const directories = [
                'src/repositories',
                'src/gateways',
                'src/models',
                'src/entities',
                'src/components',
                'src/features',
                'src/layouts',
                'src/utils',
            ];
            console.log('📁 Criando estrutura de diretórios...');
            for (const dir of directories) {
                await fs_extra_1.default.ensureDir(dir);
                // Criar arquivo .gitkeep para manter diretórios vazios
                const gitkeepPath = path_1.default.join(dir, '.gitkeep');
                if (!await fs_extra_1.default.pathExists(gitkeepPath)) {
                    await fs_extra_1.default.writeFile(gitkeepPath, '# Manter diretório no Git\n');
                }
            }
            console.log('✅ Estrutura de diretórios criada!');
        }
        // Criar arquivo de configuração
        console.log('⚙️  Criando arquivo de configuração...');
        await (0, config_1.createDefaultConfig)();
        // Criar arquivo tsconfig.json se não existir
        const tsconfigPath = 'tsconfig.json';
        if (!await fs_extra_1.default.pathExists(tsconfigPath)) {
            const tsconfig = {
                compilerOptions: {
                    target: 'ES2020',
                    module: 'ESNext',
                    moduleResolution: 'node',
                    strict: true,
                    esModuleInterop: true,
                    skipLibCheck: true,
                    forceConsistentCasingInFileNames: true,
                    resolveJsonModule: true,
                    baseUrl: '.',
                    paths: {
                        '@/*': ['src/*'],
                    },
                },
                include: ['src/**/*'],
                exclude: ['node_modules'],
            };
            await fs_extra_1.default.writeJson(tsconfigPath, tsconfig, { spaces: 2 });
            console.log('✅ tsconfig.json criado com paths configurados!');
        }
        // Criar arquivo README.md básico se não existir
        const readmePath = 'README.md';
        if (!await fs_extra_1.default.pathExists(readmePath)) {
            const readmeContent = `# Projeto Khaos

Projeto criado com a arquitetura Khaos e Tartarus CLI.

## Estrutura

\`\`\`
src/
├── repositories/    # Camada de dados
├── gateways/       # Comunicação com APIs
├── models/         # Modelos de domínio  
├── entities/       # Tipagens de dados
├── components/     # Componentes reutilizáveis
├── features/       # Features da aplicação
├── layouts/        # Layouts da aplicação
└── utils/          # Utilitários
\`\`\`

## Comandos Tartarus

\`\`\`bash
# Criar repositório
tartarus create repository

# Atualizar repositório  
tartarus update repository

# Ver ajuda
tartarus --help
\`\`\`
`;
            await fs_extra_1.default.writeFile(readmePath, readmeContent);
            console.log('✅ README.md criado!');
        }
        console.log('\n🎉 Projeto inicializado com sucesso!');
        console.log('💡 Execute "tartarus create repository" para começar a criar arquivos.');
    });
}
