import { AIProvider } from '../providers/ai-provider.interface';
/**
 * Naming suggestion types
 */
export interface NamingSuggestion {
    primary: string;
    alternatives: string[];
    reasoning: string;
    confidence: number;
}
export interface NamingContext {
    prefix?: string;
    suffix?: string;
    existingNames?: string[];
    projectConventions?: Record<string, any>;
}
export type LayerType = 'atom' | 'molecule' | 'organism' | 'template' | 'feature' | 'layout' | 'particle' | 'model' | 'entity' | 'util' | 'gateway' | 'repository';
/**
 * Analyzes descriptions and suggests appropriate names following Khaos conventions
 */
export declare class NamingAnalyzer {
    private aiProvider?;
    constructor(aiProvider?: AIProvider | undefined);
    /**
     * Suggest names based on description and layer type
     * @param description - Natural language description
     * @param layer - Target layer type
     * @param context - Optional naming context
     * @returns Promise with naming suggestions
     */
    suggestName(description: string, layer: LayerType, context?: NamingContext): Promise<NamingSuggestion>;
    /**
     * Extract key concepts from description
     */
    private extractConcepts;
    /**
     * Extract concepts using AI
     */
    private extractConceptsWithAI;
    /**
     * Extract concepts using rule-based approach
     */
    private extractConceptsRuleBased;
    /**
     * Generate name suggestions based on concepts and layer
     */
    private generateSuggestions;
    /**
     * Generate layer-specific naming patterns
     */
    private generateLayerSpecificNames;
    /**
     * Validate suggestions against naming conventions
     */
    private validateSuggestions;
    /**
     * Rank suggestions by relevance and quality
     */
    private rankSuggestions;
    /**
     * Score a naming suggestion
     */
    private scoreSuggestion;
    /**
     * Calculate confidence in naming suggestion
     */
    private calculateNamingConfidence;
    /**
     * Explain the naming choice
     */
    private explainNaming;
    /**
     * Get fallback name when no good suggestions are found
     */
    private getFallbackName;
    /**
     * Get naming conventions for layer
     */
    private getLayerNamingConventions;
    /**
     * Convert string to dash-case
     */
    private toDashCase;
    /**
     * Convert string to PascalCase
     */
    private toPascalCase;
    /**
     * Check if string is valid dash-case
     */
    private isValidDashCase;
    /**
     * Check if word is a reserved word
     */
    private isReservedWord;
    /**
     * Check if word is a stop word
     */
    private isStopWord;
    /**
     * Normalize text for processing
     */
    private normalizeText;
}
//# sourceMappingURL=naming-analyzer.d.ts.map