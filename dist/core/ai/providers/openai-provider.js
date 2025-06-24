"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const openai_1 = __importDefault(require("openai"));
/**
 * OpenAI provider implementation for AI-powered code analysis and generation
 */
class OpenAIProvider {
    name = 'openai';
    version = '1.0.0';
    client = null;
    config = null;
    usage = {
        requests: 0,
        tokens: 0,
        cost: 0,
        errors: 0,
        cacheHitRate: 0,
    };
    /**
     * Configure the OpenAI provider
     */
    configure(config) {
        this.config = config;
        this.client = new openai_1.default({
            apiKey: this.config.apiKey,
        });
    }
    /**
     * Check if the provider is configured
     */
    isConfigured() {
        return this.client !== null && this.config !== null;
    }
    /**
     * Test the provider connection
     */
    async test() {
        if (!this.isConfigured()) {
            throw new Error('OpenAI provider is not configured');
        }
        try {
            await this.client.chat.completions.create({
                model: this.config.model,
                messages: [{ role: 'user', content: 'Test connection' }],
                max_tokens: 10,
            });
        }
        catch (error) {
            throw new Error(`OpenAI provider test failed: ${error}`);
        }
    }
    /**
     * Analyze description to determine appropriate layer
     */
    async analyzeDescription(description, context) {
        if (!this.isConfigured()) {
            throw new Error('OpenAI provider is not configured');
        }
        const prompt = this.buildAnalysisPrompt(description, context);
        try {
            const response = await this.client.chat.completions.create({
                model: this.config.model,
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
                temperature: this.config.temperature || 0.3,
                max_tokens: this.config.maxTokens || 1000,
                response_format: { type: 'json_object' },
            });
            this.updateUsage(response.usage?.total_tokens || 0, 0);
            return this.parseAnalysisResponse(response.choices[0]?.message?.content || '{}');
        }
        catch (error) {
            this.usage.errors++;
            throw new Error(`OpenAI analysis failed: ${error}`);
        }
    }
    /**
     * Generate code based on analysis and template
     */
    async generateCode(analysis, template) {
        if (!this.isConfigured()) {
            throw new Error('OpenAI provider is not configured');
        }
        const prompt = this.buildGenerationPrompt(analysis, template);
        try {
            const response = await this.client.chat.completions.create({
                model: this.config.model,
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
                temperature: this.config.temperature || 0.1,
                max_tokens: this.config.maxTokens || 2000,
            });
            this.updateUsage(response.usage?.total_tokens || 0, 0);
            return this.parseGenerationResponse(response.choices[0]?.message?.content || '', analysis);
        }
        catch (error) {
            this.usage.errors++;
            throw new Error(`OpenAI code generation failed: ${error}`);
        }
    }
    /**
     * Validate code and provide suggestions
     */
    async validateCode(code, rules) {
        if (!this.isConfigured()) {
            throw new Error('OpenAI provider is not configured');
        }
        const prompt = this.buildValidationPrompt(code, rules);
        try {
            const response = await this.client.chat.completions.create({
                model: this.config.model,
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
                temperature: this.config.temperature || 0.2,
                max_tokens: this.config.maxTokens || 1500,
                response_format: { type: 'json_object' },
            });
            this.updateUsage(response.usage?.total_tokens || 0, 0);
            return this.parseValidationResponse(response.choices[0]?.message?.content || '{}');
        }
        catch (error) {
            this.usage.errors++;
            throw new Error(`OpenAI validation failed: ${error}`);
        }
    }
    /**
     * Suggest refactoring improvements
     */
    async suggestRefactoring(code, issues) {
        if (!this.isConfigured()) {
            throw new Error('OpenAI provider is not configured');
        }
        const prompt = this.buildRefactoringPrompt(code, issues);
        try {
            const response = await this.client.chat.completions.create({
                model: this.config.model,
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
                temperature: this.config.temperature || 0.3,
                max_tokens: this.config.maxTokens || 2000,
                response_format: { type: 'json_object' },
            });
            this.updateUsage(response.usage?.total_tokens || 0, 0);
            return this.parseRefactoringResponse(response.choices[0]?.message?.content || '{}');
        }
        catch (error) {
            this.usage.errors++;
            throw new Error(`OpenAI refactoring failed: ${error}`);
        }
    }
    /**
     * Get usage statistics
     */
    getUsage() {
        return { ...this.usage };
    }
    /**
     * Reset usage statistics
     */
    resetUsage() {
        this.usage = {
            requests: 0,
            tokens: 0,
            cost: 0,
            errors: 0,
            cacheHitRate: 0,
        };
    }
    /**
     * Build analysis prompt for layer classification
     */
    buildAnalysisPrompt(description, context) {
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
    buildGenerationPrompt(analysis, template) {
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
    buildValidationPrompt(code, rules) {
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
    buildRefactoringPrompt(code, issues) {
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
    getKhaosArchitectureSystemPrompt() {
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
    getKhaosCodeGenerationSystemPrompt() {
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
    getKhaosValidationSystemPrompt() {
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
    getKhaosRefactoringSystemPrompt() {
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
     * Parse analysis response from OpenAI
     */
    parseAnalysisResponse(content) {
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
        }
        catch (error) {
            throw new Error(`Failed to parse analysis response: ${error}`);
        }
    }
    /**
     * Parse generation response from OpenAI
     */
    parseGenerationResponse(content, analysis) {
        // Extract code blocks from the response
        const files = {};
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
     * Parse validation response from OpenAI
     */
    parseValidationResponse(content) {
        try {
            const parsed = JSON.parse(content);
            return {
                isValid: parsed.isValid,
                issues: parsed.issues || [],
                score: parsed.score,
                improvements: parsed.improvements || [],
            };
        }
        catch (error) {
            throw new Error(`Failed to parse validation response: ${error}`);
        }
    }
    /**
     * Parse refactoring response from OpenAI
     */
    parseRefactoringResponse(content) {
        try {
            const parsed = JSON.parse(content);
            return {
                suggestions: parsed.suggestions || [],
                confidence: parsed.confidence,
                impact: parsed.impact,
            };
        }
        catch (error) {
            throw new Error(`Failed to parse refactoring response: ${error}`);
        }
    }
    /**
     * Update usage statistics
     */
    updateUsage(tokens, cost) {
        this.usage.requests++;
        this.usage.tokens += tokens;
        this.usage.cost += cost;
    }
}
exports.OpenAIProvider = OpenAIProvider;
//# sourceMappingURL=openai-provider.js.map