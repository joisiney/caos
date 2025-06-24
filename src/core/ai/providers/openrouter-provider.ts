import OpenAI from 'openai';
import { AIProvider } from './ai-provider.interface';
import {
  AnalysisContext,
  LayerAnalysis,
  GeneratedCode,
  ValidationRules,
  ValidationSuggestions,
  Template,
  ProviderConfig,
  OpenRouterConfig,
  UsageStats,
  CodeIssue,
  RefactoringSuggestions,
} from '../types';

/**
 * OpenRouter provider implementation for AI-powered code analysis and generation
 * Provides access to multiple AI models through a unified API
 */
export class OpenRouterProvider implements AIProvider {
  public readonly name = 'openrouter';
  public readonly version = '1.0.0';

  private client: OpenAI | null = null;
  private config: OpenRouterConfig | null = null;
  private usage: UsageStats = {
    requests: 0,
    tokens: 0,
    cost: 0,
    errors: 0,
    cacheHitRate: 0,
  };

  /**
   * Configure the OpenRouter provider
   */
  configure(config: ProviderConfig): void {
    this.config = config as OpenRouterConfig;
    this.client = new OpenAI({
      apiKey: this.config.apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': this.config.appUrl || 'https://khaos-cli.dev',
        'X-Title': 'Khaos CLI',
      },
    });
  }

  /**
   * Check if the provider is configured
   */
  isConfigured(): boolean {
    return this.client !== null && this.config !== null;
  }

  /**
   * Test the provider connection
   */
  async test(): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('OpenRouter provider is not configured');
    }

    try {
      await this.client!.chat.completions.create({
        model: this.config!.model,
        messages: [{ role: 'user', content: 'Test connection' }],
        max_tokens: 10,
      });
    } catch (error) {
      throw new Error(`OpenRouter provider test failed: ${error}`);
    }
  }

  /**
   * Analyze description to determine appropriate layer with fallback support
   */
  async analyzeDescription(description: string, context?: AnalysisContext): Promise<LayerAnalysis> {
    if (!this.isConfigured()) {
      throw new Error('OpenRouter provider is not configured');
    }

    const models = [this.config!.model, ...(this.config!.fallbackModels || [])];
    
    for (const model of models) {
      try {
        return await this.analyzeWithModel(description, context, model);
      } catch (error) {
        console.warn(`Model ${model} failed for analysis, trying next...`);
        if (model === models[models.length - 1]) {
          this.usage.errors++;
          throw new Error(`All models failed for analysis: ${error}`);
        }
        continue;
      }
    }

    throw new Error('No models available for analysis');
  }

  /**
   * Generate code based on analysis and template with fallback support
   */
  async generateCode(analysis: LayerAnalysis, template: Template): Promise<GeneratedCode> {
    if (!this.isConfigured()) {
      throw new Error('OpenRouter provider is not configured');
    }

    const models = [this.config!.model, ...(this.config!.fallbackModels || [])];
    
    for (const model of models) {
      try {
        return await this.generateWithModel(analysis, template, model);
      } catch (error) {
        console.warn(`Model ${model} failed for generation, trying next...`);
        if (model === models[models.length - 1]) {
          this.usage.errors++;
          throw new Error(`All models failed for generation: ${error}`);
        }
        continue;
      }
    }

    throw new Error('No models available for generation');
  }

  /**
   * Validate code and provide suggestions with fallback support
   */
  async validateCode(code: string, rules: ValidationRules): Promise<ValidationSuggestions> {
    if (!this.isConfigured()) {
      throw new Error('OpenRouter provider is not configured');
    }

    const models = [this.config!.model, ...(this.config!.fallbackModels || [])];
    
    for (const model of models) {
      try {
        return await this.validateWithModel(code, rules, model);
      } catch (error) {
        console.warn(`Model ${model} failed for validation, trying next...`);
        if (model === models[models.length - 1]) {
          this.usage.errors++;
          throw new Error(`All models failed for validation: ${error}`);
        }
        continue;
      }
    }

    throw new Error('No models available for validation');
  }

  /**
   * Suggest refactoring improvements with fallback support
   */
  async suggestRefactoring(code: string, issues: CodeIssue[]): Promise<RefactoringSuggestions> {
    if (!this.isConfigured()) {
      throw new Error('OpenRouter provider is not configured');
    }

    const models = [this.config!.model, ...(this.config!.fallbackModels || [])];
    
    for (const model of models) {
      try {
        return await this.refactorWithModel(code, issues, model);
      } catch (error) {
        console.warn(`Model ${model} failed for refactoring, trying next...`);
        if (model === models[models.length - 1]) {
          this.usage.errors++;
          throw new Error(`All models failed for refactoring: ${error}`);
        }
        continue;
      }
    }

    throw new Error('No models available for refactoring');
  }

  /**
   * Get usage statistics
   */
  getUsage(): UsageStats {
    return { ...this.usage };
  }

  /**
   * Reset usage statistics
   */
  resetUsage(): void {
    this.usage = {
      requests: 0,
      tokens: 0,
      cost: 0,
      errors: 0,
      cacheHitRate: 0,
    };
  }

  /**
   * Analyze description with specific model
   */
  private async analyzeWithModel(description: string, context: AnalysisContext | undefined, model: string): Promise<LayerAnalysis> {
    const prompt = this.buildAnalysisPrompt(description, context);
    
    const response = await this.client!.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: this.getKhaosArchitectureSystemPrompt(),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: this.config!.temperature || 0.3,
      max_tokens: this.config!.maxTokens || 1000,
      response_format: { type: 'json_object' },
    });

    this.updateUsage(response.usage?.total_tokens || 0, 0);
    return this.parseAnalysisResponse(response.choices[0]?.message?.content || '{}');
  }

  /**
   * Generate code with specific model
   */
  private async generateWithModel(analysis: LayerAnalysis, template: Template, model: string): Promise<GeneratedCode> {
    const prompt = this.buildGenerationPrompt(analysis, template);
    
    const response = await this.client!.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: this.getKhaosCodeGenerationSystemPrompt(),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: this.config!.temperature || 0.1,
      max_tokens: this.config!.maxTokens || 2000,
    });

    this.updateUsage(response.usage?.total_tokens || 0, 0);
    return this.parseGenerationResponse(response.choices[0]?.message?.content || '', analysis);
  }

  /**
   * Validate code with specific model
   */
  private async validateWithModel(code: string, rules: ValidationRules, model: string): Promise<ValidationSuggestions> {
    const prompt = this.buildValidationPrompt(code, rules);
    
    const response = await this.client!.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: this.getKhaosValidationSystemPrompt(),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: this.config!.temperature || 0.2,
      max_tokens: this.config!.maxTokens || 1500,
      response_format: { type: 'json_object' },
    });

    this.updateUsage(response.usage?.total_tokens || 0, 0);
    return this.parseValidationResponse(response.choices[0]?.message?.content || '{}');
  }

  /**
   * Suggest refactoring with specific model
   */
  private async refactorWithModel(code: string, issues: CodeIssue[], model: string): Promise<RefactoringSuggestions> {
    const prompt = this.buildRefactoringPrompt(code, issues);
    
    const response = await this.client!.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: this.getKhaosRefactoringSystemPrompt(),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: this.config!.temperature || 0.3,
      max_tokens: this.config!.maxTokens || 2000,
      response_format: { type: 'json_object' },
    });

    this.updateUsage(response.usage?.total_tokens || 0, 0);
    return this.parseRefactoringResponse(response.choices[0]?.message?.content || '{}');
  }

  /**
   * Build analysis prompt for layer classification
   */
  private buildAnalysisPrompt(description: string, context?: AnalysisContext): string {
    return `
Analise a seguinte descrição e determine a camada apropriada da arquitetura Khaos:

DESCRIÇÃO: "${description}"

${context ? `CONTEXTO: ${JSON.stringify(context, null, 2)}` : ''}

CAMADAS DISPONÍVEIS:
- atom: Elementos básicos reutilizáveis (botões, inputs, ícones)
- molecule: Combinação de átomos com lógica local (modais, cards, formulários simples)
- organism: Composições complexas (headers, sidebars, listas com filtros)
- template: Layouts visuais (estrutura de páginas)
- feature: Funcionalidades completas (telas específicas com lógica de negócio)
- layout: Navegação e estrutura de módulos
- particle: Serviços e contextos compartilháveis
- model: Classes de regras de negócio
- entity: Tipos de dados da API
- util: Funções utilitárias puras
- gateway: Acesso a APIs
- repository: Orquestração de gateways

RESPONDA EM JSON:
{
  "layerType": "atom|molecule|organism|template|feature|layout|particle|model|entity|util|gateway|repository",
  "confidence": 0.95,
  "componentName": "nome-em-dash-case",
  "reasoning": "explicação da escolha",
  "dependencies": ["dependency1", "dependency2"],
  "props": [
    {
      "name": "propName",
      "type": "string",
      "required": true,
      "description": "prop description"
    }
  ],
  "methods": [
    {
      "name": "methodName",
      "parameters": [],
      "returnType": "void",
      "description": "method description"
    }
  ],
  "metadata": {}
}
    `;
  }

  /**
   * Build generation prompt for code creation
   */
  private buildGenerationPrompt(analysis: LayerAnalysis, template: Template): string {
    return `
Gere código TypeScript/React seguindo rigorosamente a arquitetura Khaos:

ANÁLISE:
${JSON.stringify(analysis, null, 2)}

TEMPLATE:
${template.content}

INSTRUÇÕES:
1. Seguir convenções de nomenclatura da camada ${analysis.layerType}
2. Implementar tipos TypeScript rigorosos
3. Adicionar comentários JSDoc quando apropriado
4. Garantir conformidade com as regras da arquitetura Khaos
5. Usar namespace para tipos (ex: N${analysis.componentName.replace(/-/g, '')}${analysis.layerType.charAt(0).toUpperCase() + analysis.layerType.slice(1)})

RETORNE O CÓDIGO GERADO SEM EXPLICAÇÕES ADICIONAIS.
    `;
  }

  /**
   * Build validation prompt for code analysis
   */
  private buildValidationPrompt(code: string, rules: ValidationRules): string {
    return `
Analise o seguinte código da camada ${rules.layer} da arquitetura Khaos:

\`\`\`typescript
${code}
\`\`\`

VERIFIQUE:
1. Conformidade com convenções da camada ${rules.layer}
2. Boas práticas de TypeScript/React
3. Padrões de nomenclatura
4. Estrutura de arquivos
5. Imports/exports corretos
6. Code smells

RESPONDA EM JSON:
{
  "isValid": true,
  "issues": [
    {
      "type": "error|warning|suggestion",
      "message": "descrição do problema",
      "line": 10,
      "suggestion": "como corrigir"
    }
  ],
  "score": 0.95,
  "improvements": ["sugestão1", "sugestão2"]
}
    `;
  }

  /**
   * Build refactoring prompt
   */
  private buildRefactoringPrompt(code: string, issues: CodeIssue[]): string {
    return `
Analise o código e sugira refatorações baseadas nos problemas identificados:

CÓDIGO:
\`\`\`typescript
${code}
\`\`\`

PROBLEMAS IDENTIFICADOS:
${issues.map(issue => `- ${issue.type}: ${issue.description}`).join('\n')}

RESPONDA EM JSON:
{
  "suggestions": [
    {
      "type": "extract-component",
      "description": "descrição da refatoração",
      "changes": [
        {
          "file": "arquivo.ts",
          "original": "código original",
          "replacement": "código refatorado",
          "line": 10
        }
      ],
      "confidence": 0.9
    }
  ],
  "confidence": 0.85,
  "impact": "medium"
}
    `;
  }

  /**
   * Get Khaos architecture system prompt
   */
  private getKhaosArchitectureSystemPrompt(): string {
    return `
Você é um especialista na arquitetura Khaos, uma arquitetura de software baseada em camadas hierárquicas para React/React Native.

HIERARQUIA DAS CAMADAS (do mais baixo ao mais alto):
1. Utils - Funções utilitárias puras
2. Entities - Tipos de dados da API
3. Gateways - Acesso a APIs
4. Models - Classes de regras de negócio
5. Repositories - Orquestração de gateways
6. Particles - Serviços e contextos compartilháveis
7. Atoms - Elementos básicos reutilizáveis
8. Molecules - Combinação de átomos
9. Organisms - Composições complexas
10. Templates - Layouts visuais
11. Features - Funcionalidades completas
12. Layouts - Navegação e estrutura

REGRAS FUNDAMENTAIS:
- Cada camada só pode depender das camadas abaixo dela
- Features renderizam exclusivamente templates
- Templates não dependem de features
- Atoms, molecules, organisms e templates podem fazer composition root
- Organisms podem fazer chamadas diretas de API
- Utils não podem ser usados em entity, gateway, repository, model

Analise sempre com base nessas regras e na documentação da arquitetura Khaos.
    `;
  }

  /**
   * Get code generation system prompt
   */
  private getKhaosCodeGenerationSystemPrompt(): string {
    return `
Você é um gerador de código especializado na arquitetura Khaos.

GERE CÓDIGO QUE:
1. Segue rigorosamente as convenções de nomenclatura
2. Implementa tipos TypeScript com namespaces
3. Usa padrões de export/import corretos
4. Inclui testID para componentes visuais
5. Segue as regras de dependência entre camadas
6. Implementa composition root quando apropriado

PADRÕES DE NOMENCLATURA:
- Arquivos: nome-da-camada.layer.tsx
- Componentes: NomeComponenteLayer
- Namespaces: NNomeComponenteLayer
- Exports: sempre através do index.ts

Gere código limpo, bem documentado e que passe na validação da arquitetura Khaos.
    `;
  }

  /**
   * Get validation system prompt
   */
  private getKhaosValidationSystemPrompt(): string {
    return `
Você é um validador especializado na arquitetura Khaos.

VALIDE:
1. Conformidade com convenções de nomenclatura
2. Estrutura de arquivos correta
3. Imports/exports apropriados
4. Uso correto de namespaces
5. Dependências entre camadas
6. Boas práticas de TypeScript/React

SEJA RIGOROSO na validação e forneça sugestões específicas para correção.
    `;
  }

  /**
   * Get refactoring system prompt
   */
  private getKhaosRefactoringSystemPrompt(): string {
    return `
Você é um especialista em refatoração para a arquitetura Khaos.

SUGIRA REFATORAÇÕES QUE:
1. Melhorem a conformidade com a arquitetura
2. Reduzam code smells
3. Melhorem a manutenibilidade
4. Otimizem a estrutura de dependências
5. Sigam as melhores práticas

Priorize refatorações que tenham alto impacto na qualidade do código.
    `;
  }

  /**
   * Parse analysis response
   */
  private parseAnalysisResponse(content: string): LayerAnalysis {
    try {
      const parsed = JSON.parse(content);
      return {
        layerType: parsed.layerType,
        confidence: parsed.confidence,
        componentName: parsed.componentName,
        dependencies: parsed.dependencies || [],
        props: parsed.props || [],
        methods: parsed.methods || [],
        metadata: parsed.metadata || {},
        reasoning: parsed.reasoning,
      };
    } catch (error) {
      throw new Error(`Failed to parse analysis response: ${error}`);
    }
  }

  /**
   * Parse generation response
   */
  private parseGenerationResponse(content: string, analysis: LayerAnalysis): GeneratedCode {
    // Extract code blocks from the response
    const files: Record<string, string> = {};
    
    // Simple extraction - in a real implementation, this would be more sophisticated
    files[`${analysis.componentName}.${analysis.layerType}.tsx`] = content;
    
    return {
      files,
      metadata: {
        layer: analysis.layerType,
        name: analysis.componentName,
        generatedAt: new Date(),
        aiProvider: this.name,
        confidence: analysis.confidence,
      },
    };
  }

  /**
   * Parse validation response
   */
  private parseValidationResponse(content: string): ValidationSuggestions {
    try {
      const parsed = JSON.parse(content);
      return {
        isValid: parsed.isValid,
        issues: parsed.issues || [],
        score: parsed.score,
        improvements: parsed.improvements || [],
      };
    } catch (error) {
      throw new Error(`Failed to parse validation response: ${error}`);
    }
  }

  /**
   * Parse refactoring response
   */
  private parseRefactoringResponse(content: string): RefactoringSuggestions {
    try {
      const parsed = JSON.parse(content);
      return {
        suggestions: parsed.suggestions || [],
        confidence: parsed.confidence,
        impact: parsed.impact,
      };
    } catch (error) {
      throw new Error(`Failed to parse refactoring response: ${error}`);
    }
  }

  /**
   * Update usage statistics
   */
  private updateUsage(tokens: number, cost: number): void {
    this.usage.requests++;
    this.usage.tokens += tokens;
    this.usage.cost += cost;
  }
}