"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayerClassifier = void 0;
/**
 * Intelligent layer classifier based on patterns and AI analysis
 */
class LayerClassifier {
    layerPatterns = {
        atom: {
            keywords: ['botão', 'button', 'input', 'ícone', 'icon', 'texto', 'text', 'imagem', 'image', 'básico', 'basic', 'simples', 'simple'],
            complexity: 'low',
            dependencies: 'none',
            reusability: 'high',
            weight: 1.0,
        },
        molecule: {
            keywords: ['modal', 'card', 'formulário', 'form', 'lista', 'list', 'combinação', 'combination', 'dropdown', 'select'],
            complexity: 'medium',
            dependencies: 'atoms',
            reusability: 'medium',
            weight: 1.2,
        },
        organism: {
            keywords: ['header', 'cabeçalho', 'sidebar', 'navegação', 'navigation', 'complexo', 'complex', 'seção', 'section'],
            complexity: 'high',
            dependencies: 'molecules+atoms',
            reusability: 'medium',
            weight: 1.5,
        },
        template: {
            keywords: ['layout', 'estrutura', 'structure', 'página', 'page', 'grid', 'template'],
            complexity: 'medium',
            dependencies: 'organisms+molecules+atoms',
            reusability: 'low',
            weight: 1.3,
        },
        feature: {
            keywords: ['tela', 'screen', 'página', 'page', 'funcionalidade', 'functionality', 'fluxo', 'flow', 'processo', 'process'],
            complexity: 'high',
            dependencies: 'all',
            reusability: 'low',
            weight: 2.0,
        },
        layout: {
            keywords: ['navegação', 'navigation', 'stack', 'tabs', 'drawer', 'rota', 'route'],
            complexity: 'low',
            dependencies: 'navigation',
            reusability: 'high',
            weight: 1.1,
        },
        particle: {
            keywords: ['serviço', 'service', 'contexto', 'context', 'provider', 'compartilhado', 'shared'],
            complexity: 'medium',
            dependencies: 'services+contexts',
            reusability: 'high',
            weight: 1.4,
        },
        model: {
            keywords: ['modelo', 'model', 'regra', 'rule', 'negócio', 'business', 'transformação', 'transformation'],
            complexity: 'medium',
            dependencies: 'entities',
            reusability: 'high',
            weight: 1.3,
        },
        entity: {
            keywords: ['tipo', 'type', 'dados', 'data', 'api', 'interface', 'estrutura', 'structure'],
            complexity: 'low',
            dependencies: 'none',
            reusability: 'high',
            weight: 1.0,
        },
        util: {
            keywords: ['utilitário', 'utility', 'helper', 'função', 'function', 'formatador', 'formatter', 'validador', 'validator'],
            complexity: 'low',
            dependencies: 'none',
            reusability: 'high',
            weight: 1.0,
        },
        gateway: {
            keywords: ['api', 'chamada', 'call', 'requisição', 'request', 'externo', 'external', 'buscar', 'fetch'],
            complexity: 'medium',
            dependencies: 'entities',
            reusability: 'medium',
            weight: 1.2,
        },
        repository: {
            keywords: ['orquestração', 'orchestration', 'combinação', 'combination', 'múltiplos', 'multiple', 'gerenciamento', 'management'],
            complexity: 'high',
            dependencies: 'gateways+models',
            reusability: 'medium',
            weight: 1.6,
        },
    };
    /**
     * Classify a description into appropriate layer
     * @param description - Natural language description
     * @param features - Additional features or keywords
     * @returns Layer classification result
     */
    classify(description, features = []) {
        const scores = this.calculateLayerScores(description, features);
        const sortedLayers = Object.entries(scores)
            .map(([layer, score]) => ({ layer, score }))
            .sort((a, b) => b.score - a.score);
        if (sortedLayers.length === 0) {
            // Fallback if no scores calculated
            return this.fallbackClassification(description, features);
        }
        const primary = sortedLayers[0]; // We know it exists due to length check
        const alternatives = sortedLayers.slice(1, 4);
        const confidence = this.calculateConfidence(primary.score, sortedLayers[1]?.score || 0);
        const reasoning = this.generateReasoning(description, primary, alternatives);
        return {
            primary,
            alternatives,
            confidence,
            reasoning,
        };
    }
    /**
     * Get classification with fallback (non-AI) analysis
     * @param description - Natural language description
     * @param features - Additional features
     * @returns Layer classification with fallback logic
     */
    classifyWithFallback(description, features = []) {
        try {
            return this.classify(description, features);
        }
        catch (error) {
            console.warn('Primary classification failed, using fallback:', error);
            return this.fallbackClassification(description, features);
        }
    }
    /**
     * Calculate scores for each layer based on description and features
     */
    calculateLayerScores(description, features) {
        const scores = {};
        const normalizedDescription = this.normalizeText(description);
        const allFeatures = [...features, ...this.extractFeaturesFromDescription(description)];
        for (const [layer, pattern] of Object.entries(this.layerPatterns)) {
            let score = 0;
            // Score based on keywords
            score += this.calculateKeywordScore(normalizedDescription, pattern.keywords);
            // Score based on features
            score += this.calculateFeatureScore(allFeatures, pattern);
            // Score based on complexity indicators
            score += this.calculateComplexityScore(normalizedDescription, pattern.complexity);
            // Score based on dependency patterns
            score += this.calculateDependencyScore(normalizedDescription, pattern.dependencies);
            // Apply layer weight
            score *= pattern.weight || 1.0;
            scores[layer] = Math.max(0, score);
        }
        return scores;
    }
    /**
     * Calculate keyword-based score
     */
    calculateKeywordScore(description, keywords) {
        let score = 0;
        const words = description.split(/\s+/);
        for (const keyword of keywords) {
            const normalizedKeyword = this.normalizeText(keyword);
            // Exact match
            if (description.includes(normalizedKeyword)) {
                score += 10;
            }
            // Partial match
            for (const word of words) {
                if (word.includes(normalizedKeyword) || normalizedKeyword.includes(word)) {
                    score += 5;
                }
            }
            // Semantic similarity (basic)
            if (this.areSemanticallyRelated(description, normalizedKeyword)) {
                score += 3;
            }
        }
        return score;
    }
    /**
     * Calculate feature-based score
     */
    calculateFeatureScore(features, pattern) {
        let score = 0;
        for (const feature of features) {
            const normalizedFeature = this.normalizeText(feature);
            for (const keyword of pattern.keywords) {
                if (normalizedFeature.includes(this.normalizeText(keyword))) {
                    score += 8;
                }
            }
        }
        return score;
    }
    /**
     * Calculate complexity-based score
     */
    calculateComplexityScore(description, complexity) {
        const complexityIndicators = {
            low: ['simples', 'básico', 'pequeno', 'único', 'simple', 'basic', 'small', 'single'],
            medium: ['médio', 'combinação', 'grupo', 'conjunto', 'medium', 'combination', 'group', 'set'],
            high: ['complexo', 'avançado', 'múltiplo', 'completo', 'complex', 'advanced', 'multiple', 'complete'],
        };
        const indicators = complexityIndicators[complexity] || [];
        let score = 0;
        for (const indicator of indicators) {
            if (description.includes(this.normalizeText(indicator))) {
                score += 5;
            }
        }
        return score;
    }
    /**
     * Calculate dependency-based score
     */
    calculateDependencyScore(description, dependencies) {
        const dependencyKeywords = {
            'none': ['independente', 'isolado', 'standalone', 'independent'],
            'atoms': ['átomo', 'elemento', 'componente', 'atom', 'element', 'component'],
            'molecules+atoms': ['molécula', 'combinação', 'molecule', 'combination'],
            'all': ['tudo', 'completo', 'integrado', 'all', 'complete', 'integrated'],
        };
        const keywords = dependencyKeywords[dependencies] || [];
        let score = 0;
        for (const keyword of keywords) {
            if (description.includes(this.normalizeText(keyword))) {
                score += 3;
            }
        }
        return score;
    }
    /**
     * Calculate confidence based on score difference
     */
    calculateConfidence(primaryScore, secondaryScore) {
        if (primaryScore === 0)
            return 0;
        if (secondaryScore === 0)
            return 1;
        const difference = primaryScore - secondaryScore;
        const confidence = Math.min(1, difference / primaryScore);
        return Math.max(0.1, confidence);
    }
    /**
     * Generate reasoning for the classification
     */
    generateReasoning(description, primary, alternatives) {
        const pattern = this.layerPatterns[primary.layer];
        const matchedKeywords = pattern.keywords.filter(keyword => this.normalizeText(description).includes(this.normalizeText(keyword)));
        let reasoning = `Classificado como '${primary.layer}' baseado em:`;
        if (matchedKeywords.length > 0) {
            reasoning += ` palavras-chave identificadas (${matchedKeywords.join(', ')})`;
        }
        reasoning += `, complexidade ${pattern.complexity}`;
        reasoning += `, dependências: ${pattern.dependencies}`;
        reasoning += `, reusabilidade ${pattern.reusability}`;
        if (alternatives.length > 0) {
            reasoning += `. Alternativas consideradas: ${alternatives.map(alt => alt.layer).join(', ')}`;
        }
        return reasoning;
    }
    /**
     * Fallback classification when primary method fails
     */
    fallbackClassification(description, features) {
        // Simple rule-based fallback
        const normalizedDesc = this.normalizeText(description);
        // Basic patterns for fallback
        if (this.containsAny(normalizedDesc, ['botão', 'input', 'ícone', 'button', 'icon'])) {
            return this.createFallbackResult('atom', 0.7, 'Fallback: elementos básicos identificados');
        }
        if (this.containsAny(normalizedDesc, ['modal', 'card', 'formulário', 'form'])) {
            return this.createFallbackResult('molecule', 0.6, 'Fallback: componentes compostos identificados');
        }
        if (this.containsAny(normalizedDesc, ['header', 'sidebar', 'navegação', 'navigation'])) {
            return this.createFallbackResult('organism', 0.6, 'Fallback: componentes complexos identificados');
        }
        if (this.containsAny(normalizedDesc, ['tela', 'página', 'screen', 'page'])) {
            return this.createFallbackResult('feature', 0.5, 'Fallback: funcionalidade completa identificada');
        }
        // Default fallback
        return this.createFallbackResult('atom', 0.3, 'Fallback: classificação padrão');
    }
    /**
     * Create fallback classification result
     */
    createFallbackResult(layer, confidence, reasoning) {
        return {
            primary: { layer, score: confidence * 100 },
            alternatives: [],
            confidence,
            reasoning,
        };
    }
    /**
     * Extract features from description text
     */
    extractFeaturesFromDescription(description) {
        const features = [];
        const words = this.normalizeText(description).split(/\s+/);
        // Extract meaningful words (longer than 3 characters)
        for (const word of words) {
            if (word.length > 3 && !this.isStopWord(word)) {
                features.push(word);
            }
        }
        return features;
    }
    /**
     * Normalize text for comparison
     */
    normalizeText(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^\w\s]/g, ' ') // Replace special chars with spaces
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();
    }
    /**
     * Check if words are semantically related (basic implementation)
     */
    areSemanticallyRelated(text, keyword) {
        const synonyms = {
            'botao': ['button', 'btn', 'clique', 'click'],
            'modal': ['popup', 'dialog', 'overlay'],
            'formulario': ['form', 'input', 'campo', 'field'],
            'tela': ['screen', 'page', 'pagina', 'view'],
        };
        const keywordSynonyms = synonyms[keyword] || [];
        return keywordSynonyms.some(synonym => text.includes(synonym));
    }
    /**
     * Check if text contains any of the given terms
     */
    containsAny(text, terms) {
        return terms.some(term => text.includes(this.normalizeText(term)));
    }
    /**
     * Check if word is a stop word
     */
    isStopWord(word) {
        const stopWords = [
            'que', 'para', 'com', 'uma', 'um', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'
        ];
        return stopWords.includes(word);
    }
}
exports.LayerClassifier = LayerClassifier;
//# sourceMappingURL=layer-classifier.js.map