"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NamingAnalyzer = void 0;
/**
 * Analyzes descriptions and suggests appropriate names following Khaos conventions
 */
class NamingAnalyzer {
    aiProvider;
    constructor(aiProvider) {
        this.aiProvider = aiProvider;
    }
    /**
     * Suggest names based on description and layer type
     * @param description - Natural language description
     * @param layer - Target layer type
     * @param context - Optional naming context
     * @returns Promise with naming suggestions
     */
    async suggestName(description, layer, context) {
        // Extract concepts from description
        const concepts = await this.extractConcepts(description);
        // Generate suggestions based on layer conventions
        const suggestions = await this.generateSuggestions(concepts, layer, context);
        // Validate and filter suggestions
        const validSuggestions = this.validateSuggestions(suggestions, layer);
        // Score and rank suggestions
        const rankedSuggestions = this.rankSuggestions(validSuggestions, description, layer);
        const primaryName = rankedSuggestions[0] || this.getFallbackName(layer);
        return {
            primary: primaryName,
            alternatives: rankedSuggestions.slice(1, 5),
            reasoning: this.explainNaming(primaryName, concepts, layer),
            confidence: this.calculateNamingConfidence(primaryName, description),
        };
    }
    /**
     * Extract key concepts from description
     */
    async extractConcepts(description) {
        if (this.aiProvider) {
            try {
                // Use AI to extract concepts
                return await this.extractConceptsWithAI(description);
            }
            catch (error) {
                console.warn('AI concept extraction failed, using fallback:', error);
            }
        }
        // Fallback to rule-based extraction
        return this.extractConceptsRuleBased(description);
    }
    /**
     * Extract concepts using AI
     */
    async extractConceptsWithAI(description) {
        if (!this.aiProvider) {
            throw new Error('AI provider not available');
        }
        const prompt = `
Extract the main concepts from this description for component naming:
"${description}"

Return only relevant English keywords that describe the functionality, separated by commas.
Focus on nouns and adjectives that would be useful for naming.
Avoid articles, prepositions, and common words.

Example: "um botão reutilizável com variantes de cor" → "button, reusable, color, variant"
`;
        try {
            const response = await this.aiProvider.analyzeDescription(prompt);
            const concepts = response.reasoning?.split(',').map(c => c.trim()) || [];
            return concepts.filter(c => c.length > 0);
        }
        catch (error) {
            throw new Error(`AI concept extraction failed: ${error}`);
        }
    }
    /**
     * Extract concepts using rule-based approach
     */
    extractConceptsRuleBased(description) {
        const concepts = [];
        const normalizedDesc = this.normalizeText(description);
        // Common concept mappings
        const conceptMappings = {
            // Portuguese to English
            'botao': ['button'],
            'botão': ['button'],
            'input': ['input', 'field'],
            'icone': ['icon'],
            'ícone': ['icon'],
            'modal': ['modal', 'dialog'],
            'formulario': ['form'],
            'formulário': ['form'],
            'lista': ['list'],
            'card': ['card'],
            'header': ['header'],
            'cabecalho': ['header'],
            'cabeçalho': ['header'],
            'sidebar': ['sidebar'],
            'navegacao': ['navigation'],
            'navegação': ['navigation'],
            'tela': ['screen', 'page'],
            'pagina': ['page'],
            'página': ['page'],
            'layout': ['layout'],
            'template': ['template'],
            // Adjectives
            'reutilizavel': ['reusable'],
            'reutilizável': ['reusable'],
            'simples': ['simple'],
            'complexo': ['complex'],
            'basico': ['basic'],
            'básico': ['basic'],
            'avancado': ['advanced'],
            'avançado': ['advanced'],
            // Actions
            'criar': ['create'],
            'editar': ['edit'],
            'deletar': ['delete'],
            'buscar': ['search', 'find'],
            'filtrar': ['filter'],
            'ordenar': ['sort'],
            'validar': ['validate'],
            'formatar': ['format'],
        };
        // Extract words and map to concepts
        const words = normalizedDesc.split(/\s+/);
        for (const word of words) {
            if (conceptMappings[word]) {
                concepts.push(...conceptMappings[word]);
            }
            else if (word.length > 3 && !this.isStopWord(word)) {
                // Include meaningful words as-is
                concepts.push(word);
            }
        }
        // Remove duplicates
        return Promise.resolve([...new Set(concepts)]);
    }
    /**
     * Generate name suggestions based on concepts and layer
     */
    async generateSuggestions(concepts, layer, context) {
        const suggestions = [];
        const conventions = this.getLayerNamingConventions(layer);
        const prefix = context?.prefix || conventions['prefix'] || '';
        const suffix = context?.suffix || '';
        // Single concept names
        for (const concept of concepts) {
            const baseName = this.toDashCase(concept);
            suggestions.push(`${prefix}${baseName}${suffix}`);
        }
        // Two-concept combinations
        for (let i = 0; i < concepts.length - 1; i++) {
            for (let j = i + 1; j < concepts.length; j++) {
                const combined = `${concepts[i]}-${concepts[j]}`;
                const baseName = this.toDashCase(combined);
                suggestions.push(`${prefix}${baseName}${suffix}`);
            }
        }
        // Layer-specific patterns
        const layerSpecific = this.generateLayerSpecificNames(concepts, layer, context);
        suggestions.push(...layerSpecific);
        // Remove duplicates and empty names
        return [...new Set(suggestions)].filter(name => name.length > 0);
    }
    /**
     * Generate layer-specific naming patterns
     */
    generateLayerSpecificNames(concepts, layer, context) {
        const suggestions = [];
        switch (layer) {
            case 'feature':
                // Features require module prefix
                const modulePrefix = context?.prefix || 'module';
                for (const concept of concepts) {
                    suggestions.push(`${modulePrefix}-${this.toDashCase(concept)}`);
                }
                break;
            case 'gateway':
                // Gateways start with verbs
                const verbs = ['find-one', 'find-many', 'create', 'update', 'delete'];
                for (const verb of verbs) {
                    for (const concept of concepts) {
                        suggestions.push(`${verb}-${this.toDashCase(concept)}`);
                    }
                }
                break;
            case 'entity':
                // Entities use T prefix and Entity suffix
                for (const concept of concepts) {
                    const pascalCase = this.toPascalCase(concept);
                    suggestions.push(`T${pascalCase}Entity`);
                }
                break;
            case 'util':
                // Utils often have action verbs
                const utilVerbs = ['format', 'validate', 'parse', 'convert', 'calculate'];
                for (const verb of utilVerbs) {
                    for (const concept of concepts) {
                        suggestions.push(`${verb}-${this.toDashCase(concept)}`);
                    }
                }
                break;
            case 'repository':
                // Repositories are just the noun
                for (const concept of concepts) {
                    suggestions.push(this.toDashCase(concept));
                }
                break;
        }
        return suggestions;
    }
    /**
     * Validate suggestions against naming conventions
     */
    validateSuggestions(suggestions, layer) {
        return suggestions.filter(suggestion => {
            // Check basic format
            if (!this.isValidDashCase(suggestion) && layer !== 'entity') {
                return false;
            }
            // Check entity format
            if (layer === 'entity' && !suggestion.match(/^T[A-Z][a-zA-Z]*Entity$/)) {
                return false;
            }
            // Check length
            if (suggestion.length < 2 || suggestion.length > 50) {
                return false;
            }
            // Check for reserved words
            if (this.isReservedWord(suggestion)) {
                return false;
            }
            return true;
        });
    }
    /**
     * Rank suggestions by relevance and quality
     */
    rankSuggestions(suggestions, description, layer) {
        const scored = suggestions.map(suggestion => ({
            name: suggestion,
            score: this.scoreSuggestion(suggestion, description, layer),
        }));
        return scored
            .sort((a, b) => b.score - a.score)
            .map(item => item.name);
    }
    /**
     * Score a naming suggestion
     */
    scoreSuggestion(suggestion, description, layer) {
        let score = 0;
        // Length preference (not too short, not too long)
        const idealLength = 15;
        const lengthDiff = Math.abs(suggestion.length - idealLength);
        score += Math.max(0, 20 - lengthDiff);
        // Concept coverage
        const normalizedDesc = this.normalizeText(description);
        const suggestionParts = suggestion.split('-');
        for (const part of suggestionParts) {
            if (normalizedDesc.includes(part)) {
                score += 15;
            }
        }
        // Layer convention compliance
        const conventions = this.getLayerNamingConventions(layer);
        if (conventions['pattern'] && suggestion.match(conventions['pattern'])) {
            score += 10;
        }
        // Readability (prefer fewer hyphens)
        const hyphenCount = (suggestion.match(/-/g) || []).length;
        score += Math.max(0, 10 - hyphenCount * 2);
        return score;
    }
    /**
     * Calculate confidence in naming suggestion
     */
    calculateNamingConfidence(name, description) {
        if (!name)
            return 0;
        const normalizedDesc = this.normalizeText(description);
        const nameParts = name.split('-');
        let matches = 0;
        for (const part of nameParts) {
            if (normalizedDesc.includes(part)) {
                matches++;
            }
        }
        const coverage = matches / nameParts.length;
        return Math.min(1, coverage + 0.2); // Base confidence of 0.2
    }
    /**
     * Explain the naming choice
     */
    explainNaming(name, concepts, layer) {
        if (!name)
            return 'No suitable name could be generated';
        const conventions = this.getLayerNamingConventions(layer);
        let explanation = `Nome '${name}' escolhido para camada '${layer}' baseado em: `;
        const usedConcepts = concepts.filter(concept => name.toLowerCase().includes(concept.toLowerCase()));
        if (usedConcepts.length > 0) {
            explanation += `conceitos identificados (${usedConcepts.join(', ')})`;
        }
        if (conventions['pattern']) {
            explanation += `, seguindo padrão ${conventions['pattern']}`;
        }
        if (conventions['prefix']) {
            explanation += `, com prefixo obrigatório`;
        }
        return explanation;
    }
    /**
     * Get fallback name when no good suggestions are found
     */
    getFallbackName(layer) {
        const fallbacks = {
            atom: 'basic-atom',
            molecule: 'basic-molecule',
            organism: 'basic-organism',
            template: 'basic-template',
            feature: 'module-feature',
            layout: 'basic-layout',
            particle: 'basic-particle',
            model: 'basic-model',
            entity: 'TBasicEntity',
            util: 'basic-util',
            gateway: 'find-one-basic',
            repository: 'basic',
        };
        return fallbacks[layer];
    }
    /**
     * Get naming conventions for layer
     */
    getLayerNamingConventions(layer) {
        const conventions = {
            atom: { pattern: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, prefix: '' },
            molecule: { pattern: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, prefix: '' },
            organism: { pattern: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, prefix: '' },
            template: { pattern: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, prefix: '' },
            feature: { pattern: /^[a-z][a-z0-9]*-[a-z0-9]+(-[a-z0-9]+)*$/, prefix: 'module-' },
            layout: { pattern: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, prefix: '' },
            particle: { pattern: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, prefix: '' },
            model: { pattern: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, prefix: '' },
            entity: { pattern: /^T[A-Z][a-zA-Z]*Entity$/, prefix: 'T', suffix: 'Entity' },
            util: { pattern: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, prefix: '' },
            gateway: { pattern: /^(find-one|find-many|create|update|delete)-[a-z0-9]+(-[a-z0-9]+)*$/, prefix: 'verb-' },
            repository: { pattern: /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, prefix: '' },
        };
        return conventions[layer] || {};
    }
    /**
     * Convert string to dash-case
     */
    toDashCase(str) {
        return str
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with dashes
            .replace(/-+/g, '-') // Replace multiple dashes with single
            .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
    }
    /**
     * Convert string to PascalCase
     */
    toPascalCase(str) {
        return str
            .split(/[-\s]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    }
    /**
     * Check if string is valid dash-case
     */
    isValidDashCase(str) {
        return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(str);
    }
    /**
     * Check if word is a reserved word
     */
    isReservedWord(word) {
        const reserved = [
            'class', 'function', 'var', 'let', 'const', 'if', 'else', 'for', 'while',
            'return', 'import', 'export', 'default', 'interface', 'type', 'enum',
            'public', 'private', 'protected', 'static', 'readonly', 'abstract'
        ];
        return reserved.includes(word.toLowerCase());
    }
    /**
     * Check if word is a stop word
     */
    isStopWord(word) {
        const stopWords = [
            'que', 'para', 'com', 'uma', 'um', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
            'a', 'an', 'as', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
        ];
        return stopWords.includes(word.toLowerCase());
    }
    /**
     * Normalize text for processing
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
}
exports.NamingAnalyzer = NamingAnalyzer;
//# sourceMappingURL=naming-analyzer.js.map