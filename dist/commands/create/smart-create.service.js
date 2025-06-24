"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartCreateService = void 0;
const perf_hooks_1 = require("perf_hooks");
const crypto_1 = require("crypto");
const interactive_prompt_1 = require("./interactive-prompt");
const providers_1 = require("../../core/ai/providers");
class SmartCreateService {
    cache = new Map();
    state;
    config;
    interactivePrompt;
    codeGenerator;
    aiProvider = null;
    constructor(config, codeGenerator, interactivePrompt) {
        this.config = config;
        this.codeGenerator = codeGenerator;
        this.interactivePrompt = interactivePrompt || new interactive_prompt_1.InteractivePrompt();
        this.state = this.createInitialState();
        // Initialize AI provider if available
        this.initializeAIProvider();
    }
    /**
     * Create initial state for the service
     */
    createInitialState() {
        return {
            phase: 'input',
            startTime: perf_hooks_1.performance.now()
        };
    }
    /**
     * Initialize AI provider based on configuration or environment
     */
    initializeAIProvider() {
        try {
            const providerType = this.config.aiProvider || this.config.defaultProvider;
            if (providerType) {
                // Use specified provider
                this.aiProvider = providers_1.ProviderFactory.createFromEnvironment(providerType);
            }
            else {
                // Try to get default provider
                const availableProviders = providers_1.ProviderFactory.getAvailableProviders();
                if (availableProviders.length > 0) {
                    this.aiProvider = providers_1.ProviderFactory.getDefaultProvider();
                }
            }
            if (this.aiProvider) {
                console.log(`🤖 AI Provider initialized: ${this.aiProvider.name}`);
            }
            else {
                console.log('⚠️ No AI provider available, using heuristic analysis');
            }
        }
        catch (error) {
            console.warn('⚠️ Failed to initialize AI provider, using heuristic analysis:', error);
            this.aiProvider = null;
        }
    }
    async execute(input) {
        try {
            this.state = {
                phase: 'input',
                input,
                startTime: perf_hooks_1.performance.now()
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
        }
        catch (error) {
            await this.transitionTo('error');
            this.state.error = error;
            return this.createErrorResult(error);
        }
    }
    async executeInteractive() {
        try {
            // Coletar entrada do usuário
            const { description, options } = await this.interactivePrompt.collectInput();
            const input = {
                description,
                options: {
                    ...options,
                    interactive: true
                }
            };
            return await this.execute(input);
        }
        catch (error) {
            await this.interactivePrompt.showError('Erro no modo interativo', error);
            throw error;
        }
    }
    async executeBatch(descriptions, options) {
        const results = [];
        for (const description of descriptions) {
            try {
                const input = {
                    description,
                    options: {
                        ...options,
                        interactive: false
                    }
                };
                const result = await this.execute(input);
                results.push(result);
            }
            catch (error) {
                results.push(this.createErrorResult(error));
            }
        }
        return results;
    }
    async analyzeDescription(input) {
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
        const analysis = this.aiProvider
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
    async performAIAnalysis(description, options) {
        if (!this.aiProvider) {
            throw new Error('AI provider not available');
        }
        try {
            // Build analysis context
            const context = {
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
        }
        catch (error) {
            console.warn('AI analysis failed, falling back to heuristic:', error);
            return this.performHeuristicAnalysis(description, options);
        }
    }
    /**
     * Perform heuristic analysis as fallback
     */
    async performHeuristicAnalysis(description, options) {
        const layerType = this.classifyLayerHeuristic(description);
        const componentName = this.extractNameHeuristic(description);
        const analysis = {
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
    classifyLayerHeuristic(description) {
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
    extractNameHeuristic(description) {
        // Extrair nome baseado em palavras-chave
        const words = description.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2);
        const relevantWords = words.filter(word => !['um', 'uma', 'de', 'para', 'com', 'que', 'the', 'a', 'an', 'of', 'for', 'with', 'that'].includes(word));
        return relevantWords.slice(0, 2).join('-') || 'component';
    }
    extractFeaturesHeuristic(description) {
        const features = [];
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
    getRequiredFiles(layerType) {
        const filesByLayer = {
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
    async confirmWithUser(description, analysis) {
        return await this.interactivePrompt.confirmAnalysis({
            description,
            analysis,
            options: this.state.input?.options || {}
        });
    }
    async generateCode(analysis, options) {
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
    createDryRunResult(analysis) {
        const files = {};
        const requiredFiles = analysis.metadata?.['files'] || [];
        requiredFiles.forEach((file) => {
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
    createSuccessResult(analysis, generated) {
        const executionTime = perf_hooks_1.performance.now() - this.state.startTime;
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
                analysisId: (0, crypto_1.randomUUID)()
            }
        };
    }
    createErrorResult(error) {
        const executionTime = perf_hooks_1.performance.now() - this.state.startTime;
        return {
            success: false,
            analysis: {},
            filesCreated: [],
            errors: [error.message],
            warnings: [],
            metadata: {
                executionTime,
                provider: 'error',
                model: 'error',
                cacheHit: false,
                analysisId: (0, crypto_1.randomUUID)()
            }
        };
    }
    createCancelledResult(analysis) {
        const executionTime = perf_hooks_1.performance.now() - this.state.startTime;
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
                analysisId: (0, crypto_1.randomUUID)()
            }
        };
    }
    async transitionTo(phase) {
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
    cacheAnalysis(description, analysis) {
        const key = this.generateCacheKey(description);
        const cache = {
            key,
            analysis,
            timestamp: Date.now(),
            expiresAt: Date.now() + this.config.cacheTTL
        };
        this.cache.set(key, cache);
    }
    getCachedAnalysis(description) {
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
    generateCacheKey(description) {
        return Buffer.from(description.toLowerCase().trim()).toString('base64');
    }
    generateReport(result) {
        const { analysis, metadata, filesCreated } = result;
        return {
            summary: result.success
                ? `Componente ${analysis.componentName} criado com sucesso`
                : `Falha ao criar componente: ${result.errors.join(', ')}`,
            analysis: {
                layer: analysis.layerType,
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
    countLinesOfCode(files) {
        return Object.values(files)
            .reduce((total, content) => total + content.split('\n').length, 0);
    }
    generateNextSteps(analysis) {
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
    getState() {
        return { ...this.state };
    }
    clearCache() {
        this.cache.clear();
    }
}
exports.SmartCreateService = SmartCreateService;
//# sourceMappingURL=smart-create.service.js.map