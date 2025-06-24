/**
 * Layer classification types and interfaces
 */
export interface LayerPattern {
    keywords: string[];
    complexity: 'low' | 'medium' | 'high';
    dependencies: string;
    reusability: 'low' | 'medium' | 'high';
    weight?: number;
}
export interface LayerScore {
    layer: string;
    score: number;
}
export interface LayerClassification {
    primary: LayerScore;
    alternatives: LayerScore[];
    confidence: number;
    reasoning: string;
}
export type LayerType = 'atom' | 'molecule' | 'organism' | 'template' | 'feature' | 'layout' | 'particle' | 'model' | 'entity' | 'util' | 'gateway' | 'repository';
/**
 * Intelligent layer classifier based on patterns and AI analysis
 */
export declare class LayerClassifier {
    private readonly layerPatterns;
    /**
     * Classify a description into appropriate layer
     * @param description - Natural language description
     * @param features - Additional features or keywords
     * @returns Layer classification result
     */
    classify(description: string, features?: string[]): LayerClassification;
    /**
     * Get classification with fallback (non-AI) analysis
     * @param description - Natural language description
     * @param features - Additional features
     * @returns Layer classification with fallback logic
     */
    classifyWithFallback(description: string, features?: string[]): LayerClassification;
    /**
     * Calculate scores for each layer based on description and features
     */
    private calculateLayerScores;
    /**
     * Calculate keyword-based score
     */
    private calculateKeywordScore;
    /**
     * Calculate feature-based score
     */
    private calculateFeatureScore;
    /**
     * Calculate complexity-based score
     */
    private calculateComplexityScore;
    /**
     * Calculate dependency-based score
     */
    private calculateDependencyScore;
    /**
     * Calculate confidence based on score difference
     */
    private calculateConfidence;
    /**
     * Generate reasoning for the classification
     */
    private generateReasoning;
    /**
     * Fallback classification when primary method fails
     */
    private fallbackClassification;
    /**
     * Create fallback classification result
     */
    private createFallbackResult;
    /**
     * Extract features from description text
     */
    private extractFeaturesFromDescription;
    /**
     * Normalize text for comparison
     */
    private normalizeText;
    /**
     * Check if words are semantically related (basic implementation)
     */
    private areSemanticallyRelated;
    /**
     * Check if text contains any of the given terms
     */
    private containsAny;
    /**
     * Check if word is a stop word
     */
    private isStopWord;
}
//# sourceMappingURL=layer-classifier.d.ts.map