import { performance } from 'perf_hooks';
import { randomUUID } from 'crypto';
import { LayerAnalysis, GeneratedCode } from '../../core/ai/types';
import { CodeGenerator } from '../../core/ai/generators/code-generator';
import { InteractivePrompt } from './interactive-prompt';
import {
  SmartCreateInput,
  SmartCreateResult,
  SmartCreateState,
  SmartCreateReport,
  SmartCreateConfig,
  AnalysisCache,
  SmartCreateMode
} from './smart-create.types';
import { ProviderFactory, AIProvider } from '../../core/ai/providers';
import { AnalysisContext } from '../../core/ai/types';

export class SmartCreateService {
  private cache: Map<string, AnalysisCache> = new Map();
  private state: SmartCreateState;
  private config: SmartCreateConfig;
  private interactivePrompt: InteractivePrompt;
  private codeGenerator: CodeGenerator;
  private aiProvider: AIProvider | null = null;

  constructor(
    config: SmartCreateConfig,
    codeGenerator: CodeGenerator,
    interactivePrompt?: InteractivePrompt
  ) {
    this.config = config;
    this.codeGenerator = codeGenerator;
    this.interactivePrompt = interactivePrompt || new InteractivePrompt();
    this.state = this.createInitialState();
    
    // Initialize AI provider if available
    this.initializeAIProvider();
  }

  /**
   * Create initial state for the service
   */
  private createInitialState(): SmartCreateState {
    return {
      phase: 'input',
      startTime: performance.now()
    };
  }

  /**
   * Initialize AI provider based on configuration or environment
   */
  private initializeAIProvider(): void {
    try {
      const providerType = this.config.aiProvider || this.config.defaultProvider;
      
      if (providerType) {
        // Use specified provider
        this.aiProvider = ProviderFactory.createFromEnvironment(providerType);
      } else {
        // Try to get default provider
        const availableProviders = ProviderFactory.getAvailableProviders();
        if (availableProviders.length > 0) {
          this.aiProvider = ProviderFactory.getDefaultProvider();
        }
      }
      
      if (this.aiProvider) {
        console.log(`🤖 AI Provider initialized: ${this.aiProvider.name}`);
      } else {
        console.log('⚠️ No AI provider available, using heuristic analysis');
      }
    } catch (error) {
      console.warn('⚠️ Failed to initialize AI provider, using heuristic analysis:', error);
      this.aiProvider = null;
    }
  }

  async execute(input: SmartCreateInput): Promise<SmartCreateResult> {
    try {
      this.state = {
        phase: 'input',
        input,
        startTime: performance.now()
      };

      // 1. Análise da descrição
      await this.transitionTo('analysis');
      const analysis = await this.analyzeDescription(input);

      // 2. Confirmação (se modo interativo)
      if (input.options.interactive !== false) {
        await this.transitionTo('confirmation');
        const confirmation = await this.confirmWithUser(input.description, analysis);
        
        if (!confirmation.confirmed) {
          return this.createCancelledResult(analysis);
        }
        
        // Usar análise modificada se fornecida
        if (confirmation.modifiedAnalysis) {
          Object.assign(analysis, confirmation.modifiedAnalysis);
        }
      }

      // 3. Geração de código
      await this.transitionTo('generation');
      const generated = await this.generateCode(analysis, input.options);

      // 4. Finalização
      await this.transitionTo('complete');
      const result = this.createSuccessResult(analysis, generated);

      // 5. Cache da análise (se habilitado)
      if (this.config.cacheEnabled && input.options.saveAnalysis) {
        this.cacheAnalysis(input.description, analysis);
      }

      return result;

    } catch (error) {
      await this.transitionTo('error');
      this.state.error = error as Error;
      return this.createErrorResult(error as Error);
    }
  }

  async executeInteractive(): Promise<SmartCreateResult> {
    try {
      // Coletar entrada do usuário
      const { description, options } = await this.interactivePrompt.collectInput();
      
      const input: SmartCreateInput = {
        description,
        options: {
          ...options,
          interactive: true
        }
      };

      return await this.execute(input);

    } catch (error) {
      await this.interactivePrompt.showError('Erro no modo interativo', error as Error);
      throw error;
    }
  }

  async executeBatch(descriptions: string[], options: any): Promise<SmartCreateResult[]> {
    const results: SmartCreateResult[] = [];
    
    for (const description of descriptions) {
      try {
        const input: SmartCreateInput = {
          description,
          options: {
            ...options,
            interactive: false
          }
        };
        
        const result = await this.execute(input);
        results.push(result);
        
      } catch (error) {
        results.push(this.createErrorResult(error as Error));
      }
    }
    
    return results;
  }

  private async analyzeDescription(input: SmartCreateInput): Promise<LayerAnalysis> {
    const { description, options } = input;
    
    // Check cache first
    if (!options?.force) {
      const cached = this.getCachedAnalysis(description);
      if (cached) {
        if (options?.verbose) {
          await this.interactivePrompt.showSuccess('Análise encontrada no cache');
        }
        return cached;
      }
    }

    // Análise com IA (se disponível) ou heurística
    if (options?.verbose) {
      const method = this.aiProvider ? 'IA' : 'heurística';
      await this.interactivePrompt.showProgress(`Analisando descrição com ${method}`);
    }

    const analysis: LayerAnalysis = this.aiProvider 
      ? await this.performAIAnalysis(description, options)
      : await this.performHeuristicAnalysis(description, options);

    if (options?.verbose) {
      await this.interactivePrompt.showSuccess('Análise concluída');
    }

    return analysis;
  }

  /**
   * Perform real AI analysis using configured provider
   */
  private async performAIAnalysis(description: string, options: any): Promise<LayerAnalysis> {
    if (!this.aiProvider) {
      throw new Error('AI provider not available');
    }

    try {
      // Build analysis context
      const context: AnalysisContext = {
        projectStructure: [], // TODO: scan project structure
        existingLayers: [], // TODO: detect existing layers
        framework: 'react-native', // TODO: detect from project
        metadata: {
          targetDirectory: options.targetDirectory,
          preferences: {
            layer: options.layer,
            features: options.features ? options.features.split(',') : undefined,
            name: options.name,
          },
        },
      };

      // Perform AI analysis
      const analysis = await this.aiProvider.analyzeDescription(description, context);
      
      // The analysis should already be in the correct format from the AI provider
      // Add cache and store the analysis
      this.cacheAnalysis(description, analysis);
      
      return analysis;
    } catch (error) {
      console.warn('AI analysis failed, falling back to heuristic:', error);
      return this.performHeuristicAnalysis(description, options);
    }
  }

  /**
   * Perform heuristic analysis as fallback
   */
  private async performHeuristicAnalysis(description: string, options: any): Promise<LayerAnalysis> {
    const layerType = this.classifyLayerHeuristic(description);
    const componentName = this.extractNameHeuristic(description);
    
    const analysis: LayerAnalysis = {
      layerType,
      confidence: 0.75, // Lower confidence for heuristic
      componentName,
      dependencies: [],
      props: [],
      methods: [],
      reasoning: `Análise heurística baseada em palavras-chave na descrição: "${description}"`,
      metadata: {
        provider: 'heuristic',
        model: 'rule-based',
        features: this.extractFeaturesHeuristic(description),
        files: this.getRequiredFiles(layerType)
      }
    };

    // Cache the heuristic analysis too
    this.cacheAnalysis(description, analysis);
    
    return analysis;
  }

  private classifyLayerHeuristic(description: string): string {
    const desc = description.toLowerCase();
    
    // Palavras-chave por camada
    const keywords = {
      atom: ['botão', 'input', 'ícone', 'texto', 'imagem', 'básico', 'simples', 'button', 'icon', 'text'],
      molecule: ['modal', 'card', 'formulário', 'lista', 'form', 'dialog', 'dropdown'],
      organism: ['header', 'sidebar', 'navegação', 'menu', 'navbar', 'footer', 'navigation'],
      template: ['layout', 'página', 'template', 'estrutura', 'page', 'layout'],
      feature: ['tela', 'funcionalidade', 'fluxo', 'processo', 'screen', 'feature', 'flow'],
      particle: ['contexto', 'hook', 'serviço', 'provider', 'context', 'service'],
      util: ['função', 'utilitário', 'helper', 'util', 'function', 'utility']
    };

    for (const [layer, words] of Object.entries(keywords)) {
      if (words.some(word => desc.includes(word))) {
        return layer;
      }
    }

    return 'atom'; // Default
  }

  private extractNameHeuristic(description: string): string {
    // Extrair nome baseado em palavras-chave
    const words = description.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    const relevantWords = words.filter(word => 
      !['um', 'uma', 'de', 'para', 'com', 'que', 'the', 'a', 'an', 'of', 'for', 'with', 'that'].includes(word)
    );

    return relevantWords.slice(0, 2).join('-') || 'component';
  }

  private extractFeaturesHeuristic(description: string): string[] {
    const features: string[] = [];
    const desc = description.toLowerCase();

    if (desc.includes('variant') || desc.includes('cor') || desc.includes('tamanho')) {
      features.push('variants');
    }
    if (desc.includes('formulário') || desc.includes('validação') || desc.includes('form')) {
      features.push('form-validation');
    }
    if (desc.includes('api') || desc.includes('dados')) {
      features.push('api-integration');
    }
    if (desc.includes('loading') || desc.includes('carregando')) {
      features.push('loading-states');
    }

    return features;
  }

  private getRequiredFiles(layerType: string): string[] {
    const filesByLayer: Record<string, string[]> = {
      atom: ['component.atom.tsx', 'types.ts', 'index.ts'],
      molecule: ['component.molecule.tsx', 'types.ts', 'use-case.ts', 'index.ts'],
      organism: ['component.organism.tsx', 'types.ts', 'use-case.ts', 'index.ts'],
      template: ['component.template.tsx', 'types.ts', 'index.ts'],
      feature: ['component.feature.tsx', 'types.ts', 'use-case.ts', 'index.ts'],
      particle: ['particle.ts', 'types.ts', 'index.ts'],
      util: ['util.ts', 'types.ts', 'index.ts']
    };

    return filesByLayer[layerType] || ['component.tsx', 'types.ts', 'index.ts'];
  }

  private async confirmWithUser(description: string, analysis: LayerAnalysis) {
    return await this.interactivePrompt.confirmAnalysis({
      description,
      analysis,
      options: this.state.input?.options || {}
    });
  }

  private async generateCode(analysis: LayerAnalysis, options: any): Promise<GeneratedCode> {
    if (options.verbose) {
      await this.interactivePrompt.showProgress('Gerando código');
    }

    if (options.dryRun) {
      if (options.verbose) {
        await this.interactivePrompt.showWarning('Modo dry-run: código não será gerado');
      }
      return this.createDryRunResult(analysis);
    }

    const generated = await this.codeGenerator.generateComponent(analysis);

    if (options.verbose) {
      await this.interactivePrompt.showSuccess(`Código gerado: ${Object.keys(generated.files).length} arquivos`);
    }

    return generated;
  }

  private createDryRunResult(analysis: LayerAnalysis): GeneratedCode {
    const files: Record<string, string> = {};
    const requiredFiles = analysis.metadata?.['files'] || [];
    
    requiredFiles.forEach((file: string) => {
      files[file] = `// Dry run - conteúdo do arquivo ${file} seria gerado aqui`;
    });

    return {
      files,
      metadata: {
        layer: analysis.layerType,
        name: analysis.componentName,
        generatedAt: new Date(),
        aiProvider: 'dry-run',
        confidence: analysis.confidence
      }
    };
  }

  private createSuccessResult(analysis: LayerAnalysis, generated: GeneratedCode): SmartCreateResult {
    const executionTime = performance.now() - this.state.startTime;
    
    return {
      success: true,
      analysis,
      generated,
      filesCreated: Object.keys(generated.files),
      errors: [],
      warnings: [],
      metadata: {
        executionTime,
        provider: analysis.metadata?.['provider'] || 'unknown',
        model: analysis.metadata?.['model'] || 'unknown',
        cacheHit: false,
        analysisId: randomUUID()
      }
    };
  }

  private createErrorResult(error: Error): SmartCreateResult {
    const executionTime = performance.now() - this.state.startTime;
    
    return {
      success: false,
      analysis: {} as LayerAnalysis,
      filesCreated: [],
      errors: [error.message],
      warnings: [],
      metadata: {
        executionTime,
        provider: 'error',
        model: 'error',
        cacheHit: false,
        analysisId: randomUUID()
      }
    };
  }

  private createCancelledResult(analysis: LayerAnalysis): SmartCreateResult {
    const executionTime = performance.now() - this.state.startTime;
    
    return {
      success: false,
      analysis,
      filesCreated: [],
      errors: ['Operação cancelada pelo usuário'],
      warnings: [],
      metadata: {
        executionTime,
        provider: 'cancelled',
        model: 'cancelled',
        cacheHit: false,
        analysisId: randomUUID()
      }
    };
  }

  private async transitionTo(phase: SmartCreateState['phase']): Promise<void> {
    this.state.phase = phase;
    
    if (this.state.input?.options.verbose) {
      const phaseMessages = {
        input: 'Coletando entrada',
        analysis: 'Analisando descrição',
        confirmation: 'Aguardando confirmação',
        generation: 'Gerando código',
        complete: 'Operação concluída',
        error: 'Erro na operação'
      };
      
      await this.interactivePrompt.showProgress(phaseMessages[phase]);
    }
  }

  private cacheAnalysis(description: string, analysis: LayerAnalysis): void {
    const key = this.generateCacheKey(description);
    const cache: AnalysisCache = {
      key,
      analysis,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.config.cacheTTL
    };
    
    this.cache.set(key, cache);
  }

  private getCachedAnalysis(description: string): LayerAnalysis | null {
    const key = this.generateCacheKey(description);
    const cached = this.cache.get(key);
    
    if (!cached || cached.expiresAt < Date.now()) {
      if (cached) {
        this.cache.delete(key);
      }
      return null;
    }
    
    return cached.analysis;
  }

  private generateCacheKey(description: string): string {
    return Buffer.from(description.toLowerCase().trim()).toString('base64');
  }

  generateReport(result: SmartCreateResult): SmartCreateReport {
    const { analysis, metadata, filesCreated } = result;
    
    return {
      summary: result.success 
        ? `Componente ${analysis.componentName} criado com sucesso`
        : `Falha ao criar componente: ${result.errors.join(', ')}`,
      analysis: {
        layer: analysis.layerType as any,
        name: analysis.componentName,
        confidence: analysis.confidence,
        reasoning: analysis.reasoning
      },
      generation: {
        filesCreated: filesCreated.length,
        linesOfCode: this.countLinesOfCode(result.generated?.files || {}),
        validationScore: result.generated?.validation?.score || 0
      },
      performance: {
        analysisTime: metadata.executionTime * 0.3, // Estimativa
        generationTime: metadata.executionTime * 0.7, // Estimativa
        totalTime: metadata.executionTime,
        cacheHit: metadata.cacheHit
      },
      nextSteps: this.generateNextSteps(analysis)
    };
  }

  private countLinesOfCode(files: Record<string, string>): number {
    return Object.values(files)
      .reduce((total, content) => total + content.split('\n').length, 0);
  }

  private generateNextSteps(analysis: LayerAnalysis): string[] {
    const steps = [
      'Revisar o código gerado',
      'Executar testes unitários',
      'Integrar com outros componentes'
    ];

    if (analysis.layerType === 'atom') {
      steps.push('Criar stories no Storybook');
      steps.push('Documentar variantes disponíveis');
    }

    if (analysis.layerType === 'feature') {
      steps.push('Configurar roteamento');
      steps.push('Implementar testes de integração');
    }

    return steps;
  }

  getState(): SmartCreateState {
    return { ...this.state };
  }

  clearCache(): void {
    this.cache.clear();
  }
} 