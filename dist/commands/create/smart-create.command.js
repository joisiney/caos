"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartCreateCommand = void 0;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const smart_create_service_1 = require("./smart-create.service");
const smart_create_types_1 = require("./smart-create.types");
const code_generator_1 = require("../../core/ai/generators/code-generator");
const interactive_prompt_1 = require("./interactive-prompt");
class SmartCreateCommand {
    service;
    config;
    constructor() {
        this.config = this.getDefaultConfig();
        this.service = new smart_create_service_1.SmartCreateService(this.config, new code_generator_1.CodeGenerator(), // TODO: Configurar com providers reais quando estiverem prontos
        new interactive_prompt_1.InteractivePrompt());
    }
    createCommand() {
        const command = new commander_1.Command('smart')
            .alias('ai')
            .description('Criar componentes usando linguagem natural com IA')
            .argument('[description]', 'Descrição do componente a ser criado')
            .option('-d, --description <text>', 'Descrição do componente')
            .option('-l, --layer <layer>', 'Forçar camada específica (atom|molecule|organism|template|feature|layout|particle|model|entity|util|gateway|repository)')
            .option('-n, --name <name>', 'Forçar nome específico')
            .option('-f, --features <features>', 'Features específicas (separadas por vírgula)')
            .option('-p, --provider <provider>', 'Provider de IA (openai|anthropic|openrouter)', 'openrouter')
            .option('-m, --model <model>', 'Modelo específico')
            .option('--no-interactive', 'Modo não-interativo')
            .option('--dry-run', 'Apenas análise, sem gerar arquivos')
            .option('--force', 'Sobrescrever arquivos existentes')
            .option('-v, --verbose', 'Output detalhado')
            .option('--save-analysis', 'Salvar análise para reutilização')
            .action(async (description, options) => {
            await this.execute(description, options);
        });
        return command;
    }
    async execute(description, options = {}) {
        try {
            console.log(chalk_1.default.blue.bold('\n🧬 Khaos Smart Create\n'));
            const mode = this.determineMode(description, options);
            const smartOptions = this.parseOptions(options);
            let result;
            switch (mode) {
                case smart_create_types_1.SmartCreateMode.INTERACTIVE:
                    result = await this.executeInteractive();
                    break;
                case smart_create_types_1.SmartCreateMode.DIRECT:
                    result = await this.executeDirect(description, smartOptions);
                    break;
                case smart_create_types_1.SmartCreateMode.BATCH:
                    result = await this.executeBatch([description], smartOptions);
                    break;
                default:
                    throw new Error(`Modo não suportado: ${mode}`);
            }
            await this.displayResult(result);
        }
        catch (error) {
            await this.handleError(error);
        }
    }
    determineMode(description, options = {}) {
        // Se não há descrição e interactive não foi desabilitado, usar modo interativo
        if (!description && options.interactive !== false) {
            return smart_create_types_1.SmartCreateMode.INTERACTIVE;
        }
        // Se há descrição, usar modo direto
        if (description) {
            return smart_create_types_1.SmartCreateMode.DIRECT;
        }
        // Fallback para interativo
        return smart_create_types_1.SmartCreateMode.INTERACTIVE;
    }
    parseOptions(options) {
        return {
            description: options.description,
            layer: options.layer,
            name: options.name,
            features: options.features ? options.features.split(',').map((f) => f.trim()) : [],
            provider: options.provider || 'openrouter',
            model: options.model,
            interactive: options.interactive !== false,
            dryRun: options.dryRun || false,
            force: options.force || false,
            verbose: options.verbose || false,
            saveAnalysis: options.saveAnalysis || false
        };
    }
    async executeInteractive() {
        console.log(chalk_1.default.cyan('🎯 Modo Interativo Ativado\n'));
        return await this.service.executeInteractive();
    }
    async executeDirect(description, options) {
        if (options.verbose) {
            console.log(chalk_1.default.cyan(`🎯 Modo Direto: "${description}"\n`));
        }
        return await this.service.execute({
            description,
            options: {
                ...options,
                interactive: false
            }
        });
    }
    async executeBatch(descriptions, options) {
        console.log(chalk_1.default.cyan(`🎯 Modo Batch: ${descriptions.length} componentes\n`));
        const results = await this.service.executeBatch(descriptions, {
            ...options,
            interactive: false
        });
        // Para batch, retornar o primeiro resultado (ou criar um agregado)
        return results[0] || {
            success: false,
            errors: ['Nenhum resultado obtido'],
            warnings: [],
            filesCreated: [],
            analysis: {},
            metadata: {
                executionTime: 0,
                provider: 'batch',
                model: 'batch',
                cacheHit: false,
                analysisId: 'batch'
            }
        };
    }
    async displayResult(result) {
        if (Array.isArray(result)) {
            // Resultado batch
            await this.displayBatchResults(result);
        }
        else {
            // Resultado único
            await this.displaySingleResult(result);
        }
    }
    async displaySingleResult(result) {
        console.log(chalk_1.default.green.bold('\n✨ Resultado da Operação\n'));
        if (result.success) {
            console.log(chalk_1.default.green(`✅ Sucesso!`));
            console.log(chalk_1.default.cyan(`🏗️  Camada: ${result.analysis.layerType}`));
            console.log(chalk_1.default.cyan(`📛 Nome: ${result.analysis.componentName}`));
            console.log(chalk_1.default.cyan(`🎯 Confiança: ${Math.round(result.analysis.confidence * 100)}%`));
            if (result.filesCreated.length > 0) {
                console.log(chalk_1.default.green(`\n📁 Arquivos criados (${result.filesCreated.length}):`));
                result.filesCreated.forEach((file) => {
                    console.log(chalk_1.default.green(`   ✓ ${file}`));
                });
            }
            // Exibir relatório detalhado se verbose
            if (result.metadata && result.analysis) {
                const report = this.service.generateReport(result);
                await this.displayReport(report);
            }
        }
        else {
            console.log(chalk_1.default.red(`❌ Falha na operação`));
            if (result.errors && result.errors.length > 0) {
                console.log(chalk_1.default.red('\nErros:'));
                result.errors.forEach((error) => {
                    console.log(chalk_1.default.red(`   • ${error}`));
                });
            }
            if (result.warnings && result.warnings.length > 0) {
                console.log(chalk_1.default.yellow('\nAvisos:'));
                result.warnings.forEach((warning) => {
                    console.log(chalk_1.default.yellow(`   • ${warning}`));
                });
            }
        }
        // Estatísticas de performance
        if (result.metadata) {
            console.log(chalk_1.default.gray(`\n⏱️  Tempo de execução: ${Math.round(result.metadata.executionTime)}ms`));
            console.log(chalk_1.default.gray(`🤖 Provider: ${result.metadata.provider}`));
            if (result.metadata.model) {
                console.log(chalk_1.default.gray(`🧠 Modelo: ${result.metadata.model}`));
            }
        }
        console.log(''); // Linha em branco final
    }
    async displayBatchResults(results) {
        console.log(chalk_1.default.green.bold('\n✨ Resultados do Batch\n'));
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        console.log(chalk_1.default.cyan(`📊 Total: ${results.length} componentes`));
        console.log(chalk_1.default.green(`✅ Sucessos: ${successful.length}`));
        console.log(chalk_1.default.red(`❌ Falhas: ${failed.length}`));
        if (successful.length > 0) {
            console.log(chalk_1.default.green('\n✅ Componentes criados com sucesso:'));
            successful.forEach((result, index) => {
                console.log(chalk_1.default.green(`   ${index + 1}. ${result.analysis.componentName} (${result.analysis.layerType})`));
            });
        }
        if (failed.length > 0) {
            console.log(chalk_1.default.red('\n❌ Componentes que falharam:'));
            failed.forEach((result, index) => {
                const error = result.errors?.[0] || 'Erro desconhecido';
                console.log(chalk_1.default.red(`   ${index + 1}. ${error}`));
            });
        }
        console.log('');
    }
    async displayReport(report) {
        console.log(chalk_1.default.blue.bold('\n📊 Relatório Detalhado\n'));
        console.log(chalk_1.default.gray(`📝 ${report.summary}`));
        console.log(chalk_1.default.cyan(`🎯 Confiança: ${Math.round(report.analysis.confidence * 100)}%`));
        console.log(chalk_1.default.gray(`💭 ${report.analysis.reasoning}`));
        console.log(chalk_1.default.green(`\n📁 Geração:`));
        console.log(chalk_1.default.green(`   • ${report.generation.filesCreated} arquivos`));
        console.log(chalk_1.default.green(`   • ${report.generation.linesOfCode} linhas de código`));
        if (report.generation.validationScore > 0) {
            console.log(chalk_1.default.green(`   • ${Math.round(report.generation.validationScore * 100)}% qualidade`));
        }
        console.log(chalk_1.default.blue(`\n⏱️  Performance:`));
        console.log(chalk_1.default.blue(`   • Análise: ${Math.round(report.performance.analysisTime)}ms`));
        console.log(chalk_1.default.blue(`   • Geração: ${Math.round(report.performance.generationTime)}ms`));
        console.log(chalk_1.default.blue(`   • Total: ${Math.round(report.performance.totalTime)}ms`));
        if (report.performance.cacheHit) {
            console.log(chalk_1.default.blue(`   • Cache: ✅ hit`));
        }
        if (report.nextSteps && report.nextSteps.length > 0) {
            console.log(chalk_1.default.yellow(`\n🚀 Próximos passos:`));
            report.nextSteps.forEach((step, index) => {
                console.log(chalk_1.default.yellow(`   ${index + 1}. ${step}`));
            });
        }
        console.log('');
    }
    async handleError(error) {
        console.log(chalk_1.default.red.bold('\n❌ Erro na Operação\n'));
        console.log(chalk_1.default.red(`Erro: ${error.message}`));
        // Sugestões de solução baseadas no tipo de erro
        const suggestions = this.getErrorSuggestions(error);
        if (suggestions.length > 0) {
            console.log(chalk_1.default.yellow('\n💡 Sugestões:'));
            suggestions.forEach((suggestion, index) => {
                console.log(chalk_1.default.yellow(`   ${index + 1}. ${suggestion}`));
            });
        }
        // Stack trace em modo verbose
        if (process.env['NODE_ENV'] === 'development') {
            console.log(chalk_1.default.gray('\n🔍 Stack trace:'));
            console.log(chalk_1.default.gray(error.stack));
        }
        console.log('');
        process.exit(1);
    }
    getErrorSuggestions(error) {
        const message = error.message.toLowerCase();
        const suggestions = [];
        if (message.includes('api key') || message.includes('unauthorized')) {
            suggestions.push('Verifique se a API key está configurada corretamente');
            suggestions.push('Execute: khaos config ai --provider=openrouter --openrouter-key=sua-chave');
        }
        if (message.includes('rate limit') || message.includes('quota')) {
            suggestions.push('Aguarde alguns minutos antes de tentar novamente');
            suggestions.push('Considere usar um provider diferente');
        }
        if (message.includes('network') || message.includes('timeout')) {
            suggestions.push('Verifique sua conexão com a internet');
            suggestions.push('Tente novamente em alguns minutos');
        }
        if (message.includes('description') || message.includes('input')) {
            suggestions.push('Forneça uma descrição mais detalhada do componente');
            suggestions.push('Use pelo menos 10 caracteres na descrição');
        }
        if (suggestions.length === 0) {
            suggestions.push('Tente executar com --verbose para mais detalhes');
            suggestions.push('Verifique a documentação: docs/ai-integration.md');
        }
        return suggestions;
    }
    getDefaultConfig() {
        return {
            defaultProvider: 'openrouter',
            cacheEnabled: true,
            cacheTTL: 30 * 60 * 1000, // 30 minutos
            maxRetries: 3,
            timeout: 30000, // 30 segundos
            verboseOutput: false,
            autoConfirm: false,
            backupFiles: true
        };
    }
    // Método para integração com o CLI principal
    static register(program) {
        const smartCommand = new SmartCreateCommand();
        program.addCommand(smartCommand.createCommand());
    }
}
exports.SmartCreateCommand = SmartCreateCommand;
//# sourceMappingURL=smart-create.command.js.map