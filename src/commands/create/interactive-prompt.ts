import inquirer from 'inquirer';
import chalk from 'chalk';
import { LayerType } from '../../core/types';
import { LayerAnalysis } from '../../core/ai/types';
import {
  InteractivePromptConfig,
  InteractivePromptResult,
  SmartCreateOptions
} from './smart-create.types';

export class InteractivePrompt {
  async collectInput(): Promise<{ description: string; options: SmartCreateOptions }> {
    console.log(chalk.blue.bold('\n🚀 Khaos Smart Create - Modo Interativo\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Descreva o que você quer criar:',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Por favor, forneça uma descrição do componente';
          }
          if (input.trim().length < 10) {
            return 'Descrição muito curta. Seja mais específico (mínimo 10 caracteres)';
          }
          return true;
        }
      },
      {
        type: 'list',
        name: 'provider',
        message: 'Qual provider de IA usar?',
        choices: [
          { name: '🤖 OpenRouter (Recomendado)', value: 'openrouter' },
          { name: '🧠 OpenAI GPT-4', value: 'openai' },
          { name: '🎭 Anthropic Claude', value: 'anthropic' }
        ],
        default: 'openrouter'
      },
      {
        type: 'confirm',
        name: 'verbose',
        message: 'Ativar modo verbose (mais detalhes)?',
        default: false
      }
    ]);

    return {
      description: answers.description.trim(),
      options: {
        provider: answers.provider,
        verbose: answers.verbose,
        interactive: true
      }
    };
  }

  async confirmAnalysis(config: InteractivePromptConfig): Promise<InteractivePromptResult> {
    const { analysis, description } = config;
    
    console.log(chalk.green.bold('\n✨ Análise Concluída!\n'));
    
    // Exibir análise
    this.displayAnalysis(analysis, description);
    
    const confirmation = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Confirma a criação com essas configurações?',
        default: true
      }
    ]);

    if (!confirmation.confirmed) {
      return await this.editAnalysis(config);
    }

    return { confirmed: true };
  }

  private async editAnalysis(config: InteractivePromptConfig): Promise<InteractivePromptResult> {
    const { analysis } = config;
    
    console.log(chalk.yellow('\n🔧 Editando Análise\n'));
    
    const edits = await inquirer.prompt([
      {
        type: 'list',
        name: 'layer',
        message: 'Camada:',
        choices: this.getLayerChoices(),
        default: analysis.layerType
      },
      {
        type: 'input',
        name: 'name',
        message: 'Nome do componente:',
        default: analysis.componentName,
        validate: (input: string) => {
          if (!input.trim()) return 'Nome é obrigatório';
          if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(input)) {
            return 'Use formato kebab-case (ex: my-component)';
          }
          return true;
        }
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Features adicionais:',
        choices: this.getFeatureChoices(analysis.layerType as LayerType),
        default: analysis.metadata?.['features'] || []
      }
    ]);

    const modifiedAnalysis: LayerAnalysis = {
      ...analysis,
      layerType: edits.layer,
      componentName: edits.name,
      metadata: {
        ...analysis.metadata,
        features: edits.features
      }
    };

    // Confirmar novamente
    console.log(chalk.blue('\n📋 Análise Atualizada:\n'));
    this.displayAnalysis(modifiedAnalysis, config.description);
    
    const finalConfirmation = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Confirma agora?',
        default: true
      }
    ]);

    if (finalConfirmation.confirmed) {
      return {
        confirmed: true,
        modifiedAnalysis: modifiedAnalysis
      };
    } else {
      return {
        confirmed: false
      };
    }
  }

  private displayAnalysis(analysis: LayerAnalysis, description: string): void {
    console.log(chalk.gray(`📝 Descrição: ${description}`));
    console.log(chalk.cyan(`🏗️  Camada: ${analysis.layerType}`));
    console.log(chalk.cyan(`📛 Nome: ${analysis.componentName}`));
    console.log(chalk.cyan(`🎯 Confiança: ${Math.round(analysis.confidence * 100)}%`));
    
    if (analysis.reasoning) {
      console.log(chalk.gray(`💭 Raciocínio: ${analysis.reasoning}`));
    }
    
    if (analysis.metadata?.['features'] && analysis.metadata['features'].length > 0) {
      console.log(chalk.yellow(`✨ Features: ${analysis.metadata['features'].join(', ')}`));
    }
    
    if (analysis.dependencies && analysis.dependencies.length > 0) {
      console.log(chalk.magenta(`📦 Dependências: ${analysis.dependencies.join(', ')}`));
    }
    
    if (analysis.metadata?.['files'] && analysis.metadata['files'].length > 0) {
      console.log(chalk.green(`📁 Arquivos a serem criados:`));
      analysis.metadata['files'].forEach((file: string) => {
        console.log(chalk.green(`   ✓ ${file}`));
      });
    }
    
    console.log('');
  }

  private getLayerChoices() {
    return [
      { name: '⚛️  Atom - Elemento básico reutilizável', value: 'atom' },
      { name: '🧩 Molecule - Combinação de átomos', value: 'molecule' },
      { name: '🦠 Organism - Composição complexa', value: 'organism' },
      { name: '📄 Template - Layout visual', value: 'template' },
      { name: '🎯 Feature - Funcionalidade completa', value: 'feature' },
      { name: '🏗️  Layout - Navegação e estrutura', value: 'layout' },
      { name: '⚡ Particle - Serviço compartilhável', value: 'particle' },
      { name: '🧮 Model - Regras de negócio', value: 'model' },
      { name: '📊 Entity - Tipos de dados da API', value: 'entity' },
      { name: '🔧 Util - Função utilitária', value: 'util' },
      { name: '🌐 Gateway - Acesso a API', value: 'gateway' },
      { name: '🗄️  Repository - Orquestração de gateways', value: 'repository' }
    ];
  }

  private getFeatureChoices(layer: LayerType): Array<{ name: string; value: string }> {
    const commonFeatures = [
      { name: 'TypeScript strict mode', value: 'typescript-strict' },
      { name: 'JSDoc documentation', value: 'jsdoc' },
      { name: 'Unit tests', value: 'tests' }
    ];

    const layerSpecificFeatures: Record<string, Array<{ name: string; value: string }>> = {
      atom: [
        { name: 'Variants with CVA', value: 'variants' },
        { name: 'Storybook stories', value: 'stories' },
        { name: 'Forwarded refs', value: 'forwardRef' }
      ],
      molecule: [
        { name: 'Form validation', value: 'form-validation' },
        { name: 'Loading states', value: 'loading-states' },
        { name: 'Error handling', value: 'error-handling' }
      ],
      organism: [
        { name: 'API integration', value: 'api-integration' },
        { name: 'State management', value: 'state-management' },
        { name: 'Real-time updates', value: 'real-time' }
      ],
      feature: [
        { name: 'Route guards', value: 'route-guards' },
        { name: 'SEO metadata', value: 'seo' },
        { name: 'Analytics tracking', value: 'analytics' }
      ],
      particle: [
        { name: 'React Context', value: 'context' },
        { name: 'Custom hooks', value: 'hooks' },
        { name: 'Event emitter', value: 'events' }
      ]
    };

    return [
      ...commonFeatures,
      ...(layerSpecificFeatures[layer] || [])
    ];
  }

  async showProgress(message: string): Promise<void> {
    console.log(chalk.blue(`⏳ ${message}...`));
  }

  async showSuccess(message: string): Promise<void> {
    console.log(chalk.green(`✅ ${message}`));
  }

  async showError(message: string, error?: Error): Promise<void> {
    console.log(chalk.red(`❌ ${message}`));
    if (error && process.env['NODE_ENV'] === 'development') {
      console.log(chalk.gray(error.stack));
    }
  }

  async showWarning(message: string): Promise<void> {
    console.log(chalk.yellow(`⚠️  ${message}`));
  }

  async askRetry(message: string): Promise<boolean> {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'retry',
        message: `${message} Tentar novamente?`,
        default: true
      }
    ]);
    
    return answer.retry;
  }
} 