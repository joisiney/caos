import { Command } from 'commander';
import chalk from 'chalk';
import { SmartCreateService } from './smart-create.service';
import { SmartCreateOptions, SmartCreateConfig, SmartCreateMode } from './smart-create.types';
import { CodeGenerator } from '../../core/ai/generators/code-generator';
import { InteractivePrompt } from './interactive-prompt';

export class SmartCreateCommand {
  private service: SmartCreateService;
  private config: SmartCreateConfig;

  constructor() {
    this.config = this.getDefaultConfig();
    this.service = new SmartCreateService(
      this.config,
      new CodeGenerator(), // TODO: Configurar com providers reais quando estiverem prontos
      new InteractivePrompt()
    );
  }

  createCommand(): Command {
    const command = new Command('smart')
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

  private async execute(description?: string, options: any = {}): Promise<void> {
    try {
      console.log(chalk.blue.bold('\n🧬 Khaos Smart Create\n'));

      const mode = this.determineMode(description, options);
      const smartOptions = this.parseOptions(options);

      let result;

      switch (mode) {
        case SmartCreateMode.INTERACTIVE:
          result = await this.executeInteractive();
          break;

        case SmartCreateMode.DIRECT:
          result = await this.executeDirect(description!, smartOptions);
          break;

        case SmartCreateMode.BATCH:
          result = await this.executeBatch([description!], smartOptions);
          break;

        default:
          throw new Error(`Modo não suportado: ${mode}`);
      }

      await this.displayResult(result);

    } catch (error) {
      await this.handleError(error as Error);
    }
  }

  private determineMode(description?: string, options: any = {}): SmartCreateMode {
    // Se não há descrição e interactive não foi desabilitado, usar modo interativo
    if (!description && options.interactive !== false) {
      return SmartCreateMode.INTERACTIVE;
    }

    // Se há descrição, usar modo direto
    if (description) {
      return SmartCreateMode.DIRECT;
    }

    // Fallback para interativo
    return SmartCreateMode.INTERACTIVE;
  }

  private parseOptions(options: any): SmartCreateOptions {
    return {
      description: options.description,
      layer: options.layer,
      name: options.name,
      features: options.features ? options.features.split(',').map((f: string) => f.trim()) : [],
      provider: options.provider || 'openrouter',
      model: options.model,
      interactive: options.interactive !== false,
      dryRun: options.dryRun || false,
      force: options.force || false,
      verbose: options.verbose || false,
      saveAnalysis: options.saveAnalysis || false
    };
  }

  private async executeInteractive() {
    console.log(chalk.cyan('🎯 Modo Interativo Ativado\n'));
    return await this.service.executeInteractive();
  }

  private async executeDirect(description: string, options: SmartCreateOptions) {
    if (options.verbose) {
      console.log(chalk.cyan(`🎯 Modo Direto: "${description}"\n`));
    }

    return await this.service.execute({
      description,
      options: {
        ...options,
        interactive: false
      }
    });
  }

  private async executeBatch(descriptions: string[], options: SmartCreateOptions) {
    console.log(chalk.cyan(`🎯 Modo Batch: ${descriptions.length} componentes\n`));
    
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
      analysis: {} as any,
      metadata: {
        executionTime: 0,
        provider: 'batch',
        model: 'batch',
        cacheHit: false,
        analysisId: 'batch'
      }
    };
  }

  private async displayResult(result: any): Promise<void> {
    if (Array.isArray(result)) {
      // Resultado batch
      await this.displayBatchResults(result);
    } else {
      // Resultado único
      await this.displaySingleResult(result);
    }
  }

  private async displaySingleResult(result: any): Promise<void> {
    console.log(chalk.green.bold('\n✨ Resultado da Operação\n'));

    if (result.success) {
      console.log(chalk.green(`✅ Sucesso!`));
      console.log(chalk.cyan(`🏗️  Camada: ${result.analysis.layerType}`));
      console.log(chalk.cyan(`📛 Nome: ${result.analysis.componentName}`));
      console.log(chalk.cyan(`🎯 Confiança: ${Math.round(result.analysis.confidence * 100)}%`));
      
      if (result.filesCreated.length > 0) {
        console.log(chalk.green(`\n📁 Arquivos criados (${result.filesCreated.length}):`));
        result.filesCreated.forEach((file: string) => {
          console.log(chalk.green(`   ✓ ${file}`));
        });
      }

      // Exibir relatório detalhado se verbose
      if (result.metadata && result.analysis) {
        const report = this.service.generateReport(result);
        await this.displayReport(report);
      }

    } else {
      console.log(chalk.red(`❌ Falha na operação`));
      
      if (result.errors && result.errors.length > 0) {
        console.log(chalk.red('\nErros:'));
        result.errors.forEach((error: string) => {
          console.log(chalk.red(`   • ${error}`));
        });
      }

      if (result.warnings && result.warnings.length > 0) {
        console.log(chalk.yellow('\nAvisos:'));
        result.warnings.forEach((warning: string) => {
          console.log(chalk.yellow(`   • ${warning}`));
        });
      }
    }

    // Estatísticas de performance
    if (result.metadata) {
      console.log(chalk.gray(`\n⏱️  Tempo de execução: ${Math.round(result.metadata.executionTime)}ms`));
      console.log(chalk.gray(`🤖 Provider: ${result.metadata.provider}`));
      if (result.metadata.model) {
        console.log(chalk.gray(`🧠 Modelo: ${result.metadata.model}`));
      }
    }

    console.log(''); // Linha em branco final
  }

  private async displayBatchResults(results: any[]): Promise<void> {
    console.log(chalk.green.bold('\n✨ Resultados do Batch\n'));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(chalk.cyan(`📊 Total: ${results.length} componentes`));
    console.log(chalk.green(`✅ Sucessos: ${successful.length}`));
    console.log(chalk.red(`❌ Falhas: ${failed.length}`));

    if (successful.length > 0) {
      console.log(chalk.green('\n✅ Componentes criados com sucesso:'));
      successful.forEach((result, index) => {
        console.log(chalk.green(`   ${index + 1}. ${result.analysis.componentName} (${result.analysis.layerType})`));
      });
    }

    if (failed.length > 0) {
      console.log(chalk.red('\n❌ Componentes que falharam:'));
      failed.forEach((result, index) => {
        const error = result.errors?.[0] || 'Erro desconhecido';
        console.log(chalk.red(`   ${index + 1}. ${error}`));
      });
    }

    console.log('');
  }

  private async displayReport(report: any): Promise<void> {
    console.log(chalk.blue.bold('\n📊 Relatório Detalhado\n'));
    
    console.log(chalk.gray(`📝 ${report.summary}`));
    console.log(chalk.cyan(`🎯 Confiança: ${Math.round(report.analysis.confidence * 100)}%`));
    console.log(chalk.gray(`💭 ${report.analysis.reasoning}`));
    
    console.log(chalk.green(`\n📁 Geração:`));
    console.log(chalk.green(`   • ${report.generation.filesCreated} arquivos`));
    console.log(chalk.green(`   • ${report.generation.linesOfCode} linhas de código`));
    
    if (report.generation.validationScore > 0) {
      console.log(chalk.green(`   • ${Math.round(report.generation.validationScore * 100)}% qualidade`));
    }

    console.log(chalk.blue(`\n⏱️  Performance:`));
    console.log(chalk.blue(`   • Análise: ${Math.round(report.performance.analysisTime)}ms`));
    console.log(chalk.blue(`   • Geração: ${Math.round(report.performance.generationTime)}ms`));
    console.log(chalk.blue(`   • Total: ${Math.round(report.performance.totalTime)}ms`));
    
    if (report.performance.cacheHit) {
      console.log(chalk.blue(`   • Cache: ✅ hit`));
    }

    if (report.nextSteps && report.nextSteps.length > 0) {
      console.log(chalk.yellow(`\n🚀 Próximos passos:`));
      report.nextSteps.forEach((step: string, index: number) => {
        console.log(chalk.yellow(`   ${index + 1}. ${step}`));
      });
    }

    console.log('');
  }

  private async handleError(error: Error): Promise<void> {
    console.log(chalk.red.bold('\n❌ Erro na Operação\n'));
    console.log(chalk.red(`Erro: ${error.message}`));
    
    // Sugestões de solução baseadas no tipo de erro
    const suggestions = this.getErrorSuggestions(error);
    if (suggestions.length > 0) {
      console.log(chalk.yellow('\n💡 Sugestões:'));
      suggestions.forEach((suggestion, index) => {
        console.log(chalk.yellow(`   ${index + 1}. ${suggestion}`));
      });
    }

    // Stack trace em modo verbose
    if (process.env['NODE_ENV'] === 'development') {
      console.log(chalk.gray('\n🔍 Stack trace:'));
      console.log(chalk.gray(error.stack));
    }

    console.log('');
    process.exit(1);
  }

  private getErrorSuggestions(error: Error): string[] {
    const message = error.message.toLowerCase();
    const suggestions: string[] = [];

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

  private getDefaultConfig(): SmartCreateConfig {
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
  static register(program: Command): void {
    const smartCommand = new SmartCreateCommand();
    program.addCommand(smartCommand.createCommand());
  }
} 