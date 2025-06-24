# 🤖 Integração com IA no Khaos CLI

Este documento detalha como a Inteligência Artificial será integrada ao Khaos CLI para fornecer funcionalidades inteligentes de análise, geração e validação de código seguindo a arquitetura Khaos.

---

## 🎯 Objetivos da Integração IA

### 🧠 Capacidades Principais

1. **Análise de Linguagem Natural**: Interpretar descrições em português/inglês para determinar a camada e estrutura apropriada
2. **Geração Inteligente de Código**: Criar código que segue rigorosamente as convenções da arquitetura Khaos
3. **Validação Contextual**: Identificar violações arquiteturais e sugerir correções
4. **Refatoração Assistida**: Propor melhorias baseadas em boas práticas e padrões identificados

### 🎨 Casos de Uso

```bash
# Criação inteligente com descrição natural
khaos create --smart "um botão reutilizável com variantes de cor e tamanho"
# → Gera um átomo com variants usando CVA

khaos create --smart "modal de confirmação que pode ser usado em várias telas"
# → Gera uma molécula com use-case e átomos necessários

khaos create --smart "tela de depósito na carteira com validação de formulário"
# → Gera uma feature com prefixo wallet- e estrutura completa
```

---

## 🏗️ Arquitetura da Integração IA

### 📁 Estrutura de Módulos

```
src/core/ai/
├── providers/                     # Providers de IA
│   ├── ai-provider.interface.ts   # Interface comum
│   ├── openai-provider.ts         # Implementação OpenAI
│   ├── anthropic-provider.ts      # Implementação Anthropic
│   └── provider-factory.ts        # Factory para providers
├── analyzers/                     # Analisadores inteligentes
│   ├── description-analyzer.ts    # Análise de linguagem natural
│   ├── layer-classifier.ts        # Classificação de camadas
│   ├── naming-analyzer.ts         # Sugestão de nomes
│   ├── dependency-analyzer.ts     # Análise de dependências
│   └── code-analyzer.ts           # Análise de código existente
├── generators/                    # Geradores de código
│   ├── code-generator.ts          # Geração principal
│   ├── template-selector.ts       # Seleção de templates
│   ├── variable-extractor.ts      # Extração de variáveis
│   └── validation-generator.ts    # Geração com validação
├── prompts/                       # Prompts para IA
│   ├── analysis-prompts.ts        # Prompts de análise
│   ├── generation-prompts.ts      # Prompts de geração
│   └── validation-prompts.ts      # Prompts de validação
└── utils/                         # Utilitários IA
    ├── token-counter.ts           # Contagem de tokens
    ├── response-parser.ts         # Parse de respostas
    └── cache-manager.ts           # Cache de respostas
```

---

## 🔌 Providers de IA

### 🎭 Interface Comum

```typescript
interface AIProvider {
  name: string;
  version: string;
  
  // Análise de descrições
  analyzeDescription(description: string, context?: AnalysisContext): Promise<LayerAnalysis>;
  
  // Geração de código
  generateCode(analysis: LayerAnalysis, template: Template): Promise<GeneratedCode>;
  
  // Validação e sugestões
  validateCode(code: string, rules: ValidationRules): Promise<ValidationSuggestions>;
  
  // Refatoração
  suggestRefactoring(code: string, issues: CodeIssue[]): Promise<RefactoringSuggestions>;
  
  // Configuração
  configure(config: ProviderConfig): void;
  isConfigured(): boolean;
  getUsage(): UsageStats;
}
```

### 🤖 OpenAI Provider

```typescript
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private config: OpenAIConfig;
  
  constructor(config: OpenAIConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  async analyzeDescription(
    description: string, 
    context?: AnalysisContext
  ): Promise<LayerAnalysis> {
    const prompt = this.buildAnalysisPrompt(description, context);
    
    const response = await this.client.chat.completions.create({
      model: this.config.model || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: KHAOS_ARCHITECTURE_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: this.config.temperature || 0.3,
      max_tokens: this.config.maxTokens || 1000,
      response_format: { type: 'json_object' },
    });

    return this.parseAnalysisResponse(response.choices[0].message.content);
  }

  async generateCode(
    analysis: LayerAnalysis, 
    template: Template
  ): Promise<GeneratedCode> {
    const prompt = this.buildGenerationPrompt(analysis, template);
    
    const response = await this.client.chat.completions.create({
      model: this.config.model || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: KHAOS_CODE_GENERATION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: this.config.temperature || 0.1,
      max_tokens: this.config.maxTokens || 2000,
    });

    return this.parseGenerationResponse(response.choices[0].message.content);
  }

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
  "suggestedLayer": "atom|molecule|organism|template|feature|layout|particle|model|entity|util|gateway|repository",
  "confidence": 0.95,
  "suggestedName": "nome-em-dash-case",
  "reasoning": "explicação da escolha",
  "requiredFeatures": ["feature1", "feature2"],
  "optionalFeatures": ["feature3"],
  "dependencies": ["dependency1"],
  "files": {
    "required": ["file1.ts", "file2.tsx"],
    "optional": ["file3.ts"]
  }
}
    `;
  }
}
```

### 🧠 Anthropic Provider

```typescript
export class AnthropicProvider implements AIProvider {
  private client: Anthropic;
  private config: AnthropicConfig;
  
  constructor(config: AnthropicConfig) {
    this.config = config;
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
  }

  async analyzeDescription(
    description: string,
    context?: AnalysisContext
  ): Promise<LayerAnalysis> {
    const prompt = this.buildAnalysisPrompt(description, context);
    
    const response = await this.client.messages.create({
      model: this.config.model || 'claude-3-sonnet-20240229',
      max_tokens: this.config.maxTokens || 1000,
      temperature: this.config.temperature || 0.3,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return this.parseAnalysisResponse(response.content[0].text);
  }

  // Implementação similar ao OpenAI com adaptações para Anthropic
}
```

### 🌐 OpenRouter Provider

```typescript
export class OpenRouterProvider implements AIProvider {
  private client: OpenAI; // OpenRouter usa API compatível com OpenAI
  private config: OpenRouterConfig;
  
  constructor(config: OpenRouterConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': config.appUrl || 'https://khaos-cli.dev',
        'X-Title': 'Khaos CLI',
      },
    });
  }

  async analyzeDescription(
    description: string,
    context?: AnalysisContext
  ): Promise<LayerAnalysis> {
    const prompt = this.buildAnalysisPrompt(description, context);
    
    const response = await this.client.chat.completions.create({
      model: this.config.model || 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: KHAOS_ARCHITECTURE_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: this.config.temperature || 0.3,
      max_tokens: this.config.maxTokens || 1000,
      response_format: { type: 'json_object' },
    });

    return this.parseAnalysisResponse(response.choices[0].message.content);
  }

  async generateCode(
    analysis: LayerAnalysis,
    template: Template
  ): Promise<GeneratedCode> {
    const prompt = this.buildGenerationPrompt(analysis, template);
    
    const response = await this.client.chat.completions.create({
      model: this.config.model || 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: KHAOS_CODE_GENERATION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: this.config.temperature || 0.1,
      max_tokens: this.config.maxTokens || 2000,
    });

    return this.parseGenerationResponse(response.choices[0].message.content);
  }

  // Vantagens do OpenRouter:
  // - Acesso a múltiplos modelos (GPT-4, Claude, Llama, Gemini, etc.)
  // - Preços competitivos e transparentes
  // - Fallback automático entre modelos
  // - Rate limiting inteligente
  // - Ideal para desenvolvimento e testes
}
```

#### 🔧 Configuração do OpenRouter

```typescript
interface OpenRouterConfig {
  apiKey: string;
  model: string; // 'anthropic/claude-3.5-sonnet' | 'openai/gpt-4' | 'meta-llama/llama-3.1-405b' | etc.
  temperature: number;
  maxTokens: number;
  timeout: number;
  appUrl?: string; // Para tracking de uso
  fallbackModels?: string[]; // Modelos de fallback
}
```

#### 🎯 Modelos Disponíveis no OpenRouter

```typescript
const OPENROUTER_MODELS = {
  // Modelos OpenAI
  'openai/gpt-4': 'GPT-4 - Melhor qualidade geral',
  'openai/gpt-4-turbo': 'GPT-4 Turbo - Mais rápido e barato',
  'openai/gpt-3.5-turbo': 'GPT-3.5 Turbo - Econômico',
  
  // Modelos Anthropic
  'anthropic/claude-3.5-sonnet': 'Claude 3.5 Sonnet - Excelente para código',
  'anthropic/claude-3-opus': 'Claude 3 Opus - Máxima qualidade',
  'anthropic/claude-3-haiku': 'Claude 3 Haiku - Mais rápido',
  
  // Modelos Meta
  'meta-llama/llama-3.1-405b': 'Llama 3.1 405B - Open source premium',
  'meta-llama/llama-3.1-70b': 'Llama 3.1 70B - Balanceado',
  'meta-llama/llama-3.1-8b': 'Llama 3.1 8B - Econômico',
  
  // Modelos Google
  'google/gemini-pro': 'Gemini Pro - Multimodal',
  'google/gemini-flash': 'Gemini Flash - Rápido',
  
  // Modelos especializados
  'deepseek/deepseek-coder': 'DeepSeek Coder - Especializado em código',
  'codellama/codellama-70b': 'Code Llama 70B - Geração de código',
};
```

#### 💰 Vantagens do OpenRouter

1. **Acesso Unificado**: Uma única API key para múltiplos modelos
2. **Preços Competitivos**: Até 50% mais barato que APIs diretas
3. **Flexibilidade**: Troca de modelos sem mudança de código
4. **Fallback Inteligente**: Mudança automática se um modelo falha
5. **Transparência**: Preços em tempo real e usage tracking
6. **Ideal para Desenvolvimento**: Teste diferentes modelos facilmente

#### 🔄 Sistema de Fallback com OpenRouter

```typescript
export class OpenRouterProviderWithFallback extends OpenRouterProvider {
  private fallbackModels: string[];
  
  constructor(config: OpenRouterConfig) {
    super(config);
    this.fallbackModels = config.fallbackModels || [
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4-turbo',
      'meta-llama/llama-3.1-70b',
      'openai/gpt-3.5-turbo'
    ];
  }

  async analyzeDescription(
    description: string,
    context?: AnalysisContext
  ): Promise<LayerAnalysis> {
    for (const model of [this.config.model, ...this.fallbackModels]) {
      try {
        const tempConfig = { ...this.config, model };
        return await this.analyzeWithModel(description, context, tempConfig);
      } catch (error) {
        console.warn(`Modelo ${model} falhou, tentando próximo...`);
        continue;
      }
    }
    
    throw new Error('Todos os modelos de fallback falharam');
  }
}
```

---

## 🧠 Analisadores Inteligentes

### 📝 Description Analyzer

```typescript
export class DescriptionAnalyzer {
  constructor(
    private aiProvider: AIProvider,
    private contextBuilder: ContextBuilder
  ) {}

  async analyze(description: string, projectContext?: ProjectContext): Promise<LayerAnalysis> {
    // Construir contexto da análise
    const context = await this.contextBuilder.build(projectContext);
    
    // Análise principal com IA
    const analysis = await this.aiProvider.analyzeDescription(description, context);
    
    // Validação e refinamento
    const validatedAnalysis = await this.validateAnalysis(analysis);
    
    // Enriquecimento com dados locais
    const enrichedAnalysis = await this.enrichAnalysis(validatedAnalysis, context);
    
    return enrichedAnalysis;
  }

  private async validateAnalysis(analysis: LayerAnalysis): Promise<LayerAnalysis> {
    // Validar se a camada sugerida faz sentido
    if (!this.isValidLayer(analysis.suggestedLayer)) {
      throw new Error(`Camada inválida sugerida: ${analysis.suggestedLayer}`);
    }

    // Validar nome sugerido
    if (!this.isValidName(analysis.suggestedName)) {
      analysis.suggestedName = this.sanitizeName(analysis.suggestedName);
    }

    // Validar dependências
    analysis.dependencies = await this.validateDependencies(analysis.dependencies);

    return analysis;
  }

  private async enrichAnalysis(
    analysis: LayerAnalysis, 
    context: AnalysisContext
  ): Promise<LayerAnalysis> {
    // Adicionar imports necessários baseados no projeto
    analysis.imports = await this.suggestImports(analysis, context);
    
    // Sugerir arquivos adicionais baseados na camada
    analysis.additionalFiles = await this.suggestAdditionalFiles(analysis);
    
    // Adicionar metadados específicos do projeto
    analysis.metadata = {
      ...analysis.metadata,
      projectType: context.projectType,
      existingComponents: context.existingComponents,
    };

    return analysis;
  }
}
```

### 🏷️ Layer Classifier

```typescript
export class LayerClassifier {
  private readonly layerPatterns: Record<LayerType, LayerPattern> = {
    atom: {
      keywords: ['botão', 'input', 'ícone', 'texto', 'imagem', 'básico', 'simples'],
      complexity: 'low',
      dependencies: 'none',
      reusability: 'high',
    },
    molecule: {
      keywords: ['modal', 'card', 'formulário', 'lista', 'combinação'],
      complexity: 'medium',
      dependencies: 'atoms',
      reusability: 'medium',
    },
    organism: {
      keywords: ['header', 'sidebar', 'navegação', 'complexo', 'seção'],
      complexity: 'high',
      dependencies: 'molecules+atoms',
      reusability: 'medium',
    },
    feature: {
      keywords: ['tela', 'página', 'funcionalidade', 'fluxo', 'processo'],
      complexity: 'high',
      dependencies: 'all',
      reusability: 'low',
    },
    // ... outras camadas
  };

  classify(description: string, features: string[]): LayerClassification {
    const scores = this.calculateLayerScores(description, features);
    const sortedLayers = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([layer, score]) => ({ layer: layer as LayerType, score }));

    return {
      primary: sortedLayers[0],
      alternatives: sortedLayers.slice(1, 3),
      confidence: sortedLayers[0].score,
    };
  }

  private calculateLayerScores(description: string, features: string[]): Record<LayerType, number> {
    const scores: Record<LayerType, number> = {} as any;
    
    for (const [layer, pattern] of Object.entries(this.layerPatterns)) {
      let score = 0;
      
      // Score baseado em keywords
      score += this.calculateKeywordScore(description, pattern.keywords);
      
      // Score baseado em features
      score += this.calculateFeatureScore(features, pattern);
      
      // Score baseado em complexidade
      score += this.calculateComplexityScore(description, pattern.complexity);
      
      scores[layer as LayerType] = score;
    }
    
    return scores;
  }
}
```

### 🏷️ Naming Analyzer

```typescript
export class NamingAnalyzer {
  constructor(private aiProvider: AIProvider) {}

  async suggestName(
    description: string, 
    layer: LayerType, 
    context?: NamingContext
  ): Promise<NamingSuggestion> {
    // Extrair conceitos principais da descrição
    const concepts = await this.extractConcepts(description);
    
    // Gerar sugestões baseadas na camada
    const suggestions = await this.generateSuggestions(concepts, layer, context);
    
    // Validar e filtrar sugestões
    const validSuggestions = await this.validateSuggestions(suggestions, layer);
    
    return {
      primary: validSuggestions[0],
      alternatives: validSuggestions.slice(1, 5),
      reasoning: await this.explainNaming(validSuggestions[0], concepts),
    };
  }

  private async extractConcepts(description: string): Promise<string[]> {
    const prompt = `
Extraia os conceitos principais desta descrição para nomenclatura:
"${description}"

Retorne apenas palavras-chave relevantes em inglês, separadas por vírgula.
Foque em substantivos e adjetivos que descrevem a funcionalidade.
    `;

    const response = await this.aiProvider.analyzeDescription(prompt);
    return response.concepts || [];
  }

  private async generateSuggestions(
    concepts: string[], 
    layer: LayerType, 
    context?: NamingContext
  ): Promise<string[]> {
    const layerSuffix = this.getLayerSuffix(layer);
    const prefix = context?.prefix || '';
    
    const suggestions: string[] = [];
    
    // Combinações diretas
    for (const concept of concepts) {
      suggestions.push(`${prefix}${this.toDashCase(concept)}`);
    }
    
    // Combinações de conceitos
    for (let i = 0; i < concepts.length - 1; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const combined = `${concepts[i]}-${concepts[j]}`;
        suggestions.push(`${prefix}${this.toDashCase(combined)}`);
      }
    }
    
    return suggestions;
  }

  private getLayerSuffix(layer: LayerType): string {
    const suffixes: Record<LayerType, string> = {
      atom: '',
      molecule: '',
      organism: '',
      template: '',
      feature: '',
      layout: '',
      particle: '',
      model: '',
      entity: '',
      util: '',
      gateway: '',
      repository: '',
    };
    
    return suffixes[layer];
  }
}
```

---

## 🎨 Geradores de Código

### 🏭 Code Generator

```typescript
export class CodeGenerator {
  constructor(
    private aiProvider: AIProvider,
    private templateEngine: TemplateEngine,
    private validator: CodeValidator
  ) {}

  async generateComponent(analysis: LayerAnalysis): Promise<GeneratedCode> {
    // Selecionar template apropriado
    const template = await this.selectTemplate(analysis);
    
    // Extrair variáveis do contexto
    const variables = await this.extractVariables(analysis);
    
    // Gerar código base
    const baseCode = await this.generateBaseCode(analysis, template, variables);
    
    // Aplicar melhorias com IA
    const enhancedCode = await this.enhanceWithAI(baseCode, analysis);
    
    // Validar código gerado
    const validation = await this.validator.validate(enhancedCode);
    
    if (!validation.isValid) {
      throw new Error(`Código gerado inválido: ${validation.errors.join(', ')}`);
    }
    
    return {
      files: enhancedCode,
      validation,
      metadata: {
        layer: analysis.suggestedLayer,
        name: analysis.suggestedName,
        generatedAt: new Date(),
        aiProvider: this.aiProvider.name,
        confidence: analysis.confidence,
      },
    };
  }

  private async enhanceWithAI(
    baseCode: Record<string, string>, 
    analysis: LayerAnalysis
  ): Promise<Record<string, string>> {
    const enhancedCode: Record<string, string> = {};
    
    for (const [filename, code] of Object.entries(baseCode)) {
      const prompt = this.buildEnhancementPrompt(code, filename, analysis);
      
      const enhanced = await this.aiProvider.generateCode(analysis, {
        name: filename,
        content: code,
        prompt,
      });
      
      enhancedCode[filename] = enhanced.content;
    }
    
    return enhancedCode;
  }

  private buildEnhancementPrompt(
    code: string, 
    filename: string, 
    analysis: LayerAnalysis
  ): string {
    return `
Melhore o seguinte código TypeScript/React seguindo rigorosamente a arquitetura Khaos:

ARQUIVO: ${filename}
CAMADA: ${analysis.suggestedLayer}
CÓDIGO ATUAL:
\`\`\`typescript
${code}
\`\`\`

MELHORIAS NECESSÁRIAS:
1. Garantir conformidade com convenções de nomenclatura
2. Adicionar tipos TypeScript rigorosos
3. Implementar boas práticas da camada ${analysis.suggestedLayer}
4. Adicionar comentários JSDoc quando apropriado
5. Otimizar imports e exports

RETORNE APENAS O CÓDIGO MELHORADO, SEM EXPLICAÇÕES.
    `;
  }
}
```

### 🎯 Template Selector

```typescript
export class TemplateSelector {
  constructor(
    private templateRegistry: TemplateRegistry,
    private aiProvider: AIProvider
  ) {}

  async selectTemplate(analysis: LayerAnalysis): Promise<Template> {
    // Obter templates disponíveis para a camada
    const availableTemplates = this.templateRegistry.getTemplatesForLayer(
      analysis.suggestedLayer
    );
    
    if (availableTemplates.length === 1) {
      return availableTemplates[0];
    }
    
    // Usar IA para selecionar o melhor template
    const selection = await this.selectWithAI(analysis, availableTemplates);
    
    return availableTemplates.find(t => t.name === selection.templateName) || availableTemplates[0];
  }

  private async selectWithAI(
    analysis: LayerAnalysis, 
    templates: Template[]
  ): Promise<TemplateSelection> {
    const prompt = `
Selecione o melhor template para o seguinte componente:

ANÁLISE:
${JSON.stringify(analysis, null, 2)}

TEMPLATES DISPONÍVEIS:
${templates.map(t => `- ${t.name}: ${t.description}`).join('\n')}

RESPONDA EM JSON:
{
  "templateName": "nome-do-template",
  "reasoning": "explicação da escolha"
}
    `;

    const response = await this.aiProvider.analyzeDescription(prompt);
    return this.parseTemplateSelection(response);
  }
}
```

---

## 🔍 Validação Inteligente

### 🛡️ AI-Powered Validator

```typescript
export class AIValidator {
  constructor(
    private aiProvider: AIProvider,
    private ruleEngine: ValidationRuleEngine
  ) {}

  async validateCode(
    code: string, 
    layer: LayerType, 
    context?: ValidationContext
  ): Promise<ValidationResult> {
    // Validação estática primeiro
    const staticValidation = await this.ruleEngine.validate(code, layer);
    
    // Validação com IA para contexto e boas práticas
    const aiValidation = await this.validateWithAI(code, layer, context);
    
    // Combinar resultados
    return this.combineValidationResults(staticValidation, aiValidation);
  }

  private async validateWithAI(
    code: string, 
    layer: LayerType, 
    context?: ValidationContext
  ): Promise<AIValidationResult> {
    const prompt = `
Analise o seguinte código da camada ${layer} da arquitetura Khaos:

\`\`\`typescript
${code}
\`\`\`

VERIFIQUE:
1. Conformidade com convenções da camada ${layer}
2. Boas práticas de TypeScript/React
3. Padrões de nomenclatura
4. Estrutura de arquivos
5. Imports/exports corretos
6. Code smells

RESPONDA EM JSON:
{
  "isValid": true/false,
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

    const response = await this.aiProvider.validateCode(code, {
      layer,
      prompt,
      context,
    });

    return this.parseValidationResponse(response);
  }
}
```

---

## 🔄 Sistema de Cache

### 💾 Cache Manager

```typescript
export class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly TTL = {
    analysis: 30 * 60 * 1000,    // 30 minutos
    generation: 60 * 60 * 1000,  // 1 hora
    validation: 15 * 60 * 1000,  // 15 minutos
  };

  async get<T>(key: string, type: CacheType): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    const ttl = this.TTL[type];
    const isExpired = Date.now() - entry.timestamp > ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  async set<T>(key: string, data: T, type: CacheType): Promise<void> {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      type,
    });
    
    // Limpar cache antigo periodicamente
    this.cleanupExpired();
  }

  generateKey(operation: string, input: any): string {
    const hash = this.hashObject(input);
    return `${operation}:${hash}`;
  }

  private hashObject(obj: any): string {
    return require('crypto')
      .createHash('md5')
      .update(JSON.stringify(obj))
      .digest('hex');
  }

  private cleanupExpired(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      const ttl = this.TTL[entry.type];
      const isExpired = now - entry.timestamp > ttl;
      
      if (isExpired) {
        this.cache.delete(key);
      }
    }
  }
}
```

---

## 📊 Monitoramento e Métricas

### 📈 Usage Analytics

```typescript
export class AIUsageAnalytics {
  private metrics: UsageMetrics = {
    requests: 0,
    tokens: 0,
    costs: 0,
    errors: 0,
    cacheHits: 0,
    cacheMisses: 0,
  };

  trackRequest(provider: string, operation: string, tokens: number, cost: number): void {
    this.metrics.requests++;
    this.metrics.tokens += tokens;
    this.metrics.costs += cost;
    
    this.logUsage({
      provider,
      operation,
      tokens,
      cost,
      timestamp: new Date(),
    });
  }

  trackError(provider: string, operation: string, error: Error): void {
    this.metrics.errors++;
    
    this.logError({
      provider,
      operation,
      error: error.message,
      timestamp: new Date(),
    });
  }

  trackCacheHit(operation: string): void {
    this.metrics.cacheHits++;
  }

  trackCacheMiss(operation: string): void {
    this.metrics.cacheMisses++;
  }

  getMetrics(): UsageMetrics {
    return { ...this.metrics };
  }

  generateReport(): UsageReport {
    const cacheHitRate = this.metrics.cacheHits / 
      (this.metrics.cacheHits + this.metrics.cacheMisses);
    
    const errorRate = this.metrics.errors / this.metrics.requests;
    
    return {
      totalRequests: this.metrics.requests,
      totalTokens: this.metrics.tokens,
      totalCosts: this.metrics.costs,
      cacheHitRate,
      errorRate,
      averageTokensPerRequest: this.metrics.tokens / this.metrics.requests,
      averageCostPerRequest: this.metrics.costs / this.metrics.requests,
    };
  }
}
```

---

## ⚙️ Configuração da IA

### 🔧 AI Configuration

```typescript
interface AIConfig {
  // Provider principal
  primaryProvider: 'openai' | 'anthropic' | 'openrouter';
  
  // Configurações por provider
  providers: {
    openai: {
      apiKey: string;
      model: 'gpt-4' | 'gpt-3.5-turbo';
      temperature: number;
      maxTokens: number;
      timeout: number;
    };
    anthropic: {
      apiKey: string;
      model: 'claude-3-opus' | 'claude-3-sonnet';
      temperature: number;
      maxTokens: number;
      timeout: number;
    };
    openrouter: {
      apiKey: string;
      model: string; // Qualquer modelo disponível no OpenRouter
      temperature: number;
      maxTokens: number;
      timeout: number;
      appUrl?: string;
      fallbackModels?: string[];
    };
  };
  
  // Fallback e redundância
  fallback: {
    enabled: boolean;
    provider: 'openai' | 'anthropic' | 'openrouter';
    retryAttempts: number;
    retryDelay: number;
  };
  
  // Cache
  cache: {
    enabled: boolean;
    ttl: {
      analysis: number;
      generation: number;
      validation: number;
    };
    maxSize: number;
  };
  
  // Limites e quotas
  limits: {
    maxRequestsPerMinute: number;
    maxTokensPerDay: number;
    maxCostPerDay: number;
  };
  
  // Funcionalidades
  features: {
    smartCreation: boolean;
    codeValidation: boolean;
    refactoringSuggestions: boolean;
    documentationGeneration: boolean;
  };
}
```

### 📝 Configuração via CLI

```bash
# Configurar provider principal
khaos config ai --provider=openai
khaos config ai --provider=anthropic
khaos config ai --provider=openrouter

# Configurar chaves de API
khaos config ai --openai-key=sk-...
khaos config ai --anthropic-key=sk-ant-...
khaos config ai --openrouter-key=sk-or-...

# Configurar modelos
khaos config ai --openai-model=gpt-4
khaos config ai --anthropic-model=claude-3-sonnet
khaos config ai --openrouter-model=anthropic/claude-3.5-sonnet

# Configurar fallback para OpenRouter
khaos config ai --openrouter-fallback=openai/gpt-4,meta-llama/llama-3.1-70b

# Configurar cache
khaos config ai --cache-enabled=true
khaos config ai --cache-ttl=3600

# Configurar limites
khaos config ai --max-requests=100
khaos config ai --max-cost=10.00

# Testar configuração
khaos config ai --test

# Listar modelos disponíveis no OpenRouter
khaos config ai --list-openrouter-models

# Comparar preços entre providers
khaos config ai --compare-pricing
```

### 🌐 Configuração Específica do OpenRouter

```bash
# Configuração básica do OpenRouter
khaos config ai --provider=openrouter
khaos config ai --openrouter-key=sk-or-v1-...
khaos config ai --openrouter-model=anthropic/claude-3.5-sonnet

# Configurar múltiplos modelos de fallback
khaos config ai --openrouter-fallback="anthropic/claude-3.5-sonnet,openai/gpt-4-turbo,meta-llama/llama-3.1-70b"

# Configurar URL da aplicação (para tracking)
khaos config ai --openrouter-app-url=https://khaos-cli.dev

# Configurar preferências por tipo de tarefa
khaos config ai --analysis-model=anthropic/claude-3.5-sonnet
khaos config ai --generation-model=openai/gpt-4-turbo
khaos config ai --validation-model=meta-llama/llama-3.1-70b

# Configurar limites de custo por modelo
khaos config ai --openrouter-daily-limit=5.00
khaos config ai --openrouter-per-request-limit=0.10
```

### 💡 Exemplos de Configuração por Cenário

#### 🧪 Desenvolvimento e Testes
```bash
# Configuração econômica para desenvolvimento
khaos config ai --provider=openrouter
khaos config ai --openrouter-model=meta-llama/llama-3.1-8b
khaos config ai --openrouter-fallback=openai/gpt-3.5-turbo
khaos config ai --openrouter-daily-limit=2.00
```

#### 🏭 Produção
```bash
# Configuração premium para produção
khaos config ai --provider=openrouter
khaos config ai --openrouter-model=anthropic/claude-3.5-sonnet
khaos config ai --openrouter-fallback="openai/gpt-4,anthropic/claude-3-opus"
khaos config ai --openrouter-daily-limit=50.00
```

#### ⚡ Performance Máxima
```bash
# Configuração para máxima velocidade
khaos config ai --provider=openrouter
khaos config ai --openrouter-model=anthropic/claude-3-haiku
khaos config ai --openrouter-fallback=openai/gpt-3.5-turbo
khaos config ai --cache-enabled=true
khaos config ai --cache-ttl=7200
```

---

## � Tratamento de Erros

### 🛡️ Error Handling

```typescript
export class AIErrorHandler {
  async handleProviderError(error: Error, provider: string, operation: string): Promise<void> {
    const errorType = this.classifyError(error);
    
    switch (errorType) {
      case 'RATE_LIMIT':
        await this.handleRateLimit(error, provider);
        break;
        
      case 'QUOTA_EXCEEDED':
        await this.handleQuotaExceeded(error, provider);
        break;
        
      case 'INVALID_API_KEY':
        throw new ConfigurationError(`API key inválida para ${provider}`);
        
      case 'NETWORK_ERROR':
        await this.handleNetworkError(error, provider, operation);
        break;
        
      case 'INVALID_RESPONSE':
        await this.handleInvalidResponse(error, provider, operation);
        break;
        
      default:
        throw new AIError(`Erro não tratado: ${error.message}`);
    }
  }

  private async handleRateLimit(error: Error, provider: string): Promise<void> {
    const retryAfter = this.extractRetryAfter(error);
    
    console.warn(`Rate limit atingido para ${provider}. Aguardando ${retryAfter}s...`);
    
    await this.sleep(retryAfter * 1000);
  }

  private async handleNetworkError(
    error: Error, 
    provider: string, 
    operation: string
  ): Promise<void> {
    const maxRetries = 3;
    const baseDelay = 1000;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const delay = baseDelay * Math.pow(2, attempt - 1);
      
      console.warn(`Tentativa ${attempt}/${maxRetries} para ${provider