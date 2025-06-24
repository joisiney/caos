import { AIProvider } from '../providers/ai-provider.interface';
import { ContextBuilder } from './context-builder';
import { LayerAnalysis } from '../types';
/**
 * Analyzes natural language descriptions to determine appropriate layer and structure
 */
export declare class DescriptionAnalyzer {
    private aiProvider;
    private contextBuilder;
    constructor(aiProvider: AIProvider, contextBuilder: ContextBuilder);
    /**
     * Analyze a description to determine layer, name, and structure
     * @param description - Natural language description
     * @param projectContext - Optional project context
     * @returns Promise with layer analysis result
     */
    analyze(description: string, projectContext?: Record<string, any>): Promise<LayerAnalysis>;
    /**
     * Validate the AI analysis result
     */
    private validateAnalysis;
    /**
     * Enrich analysis with additional context and suggestions
     */
    private enrichAnalysis;
    /**
     * Check if the suggested layer is valid
     */
    private isValidLayer;
    /**
     * Check if the component name follows conventions
     */
    private isValidName;
    /**
     * Sanitize component name to follow conventions
     */
    private sanitizeName;
    /**
     * Validate and filter dependencies
     */
    private validateDependencies;
    /**
     * Suggest imports based on analysis and context
     */
    private suggestImports;
    /**
     * Suggest additional files based on layer conventions
     */
    private suggestAdditionalFiles;
    /**
     * Get layer-specific metadata
     */
    private getLayerMetadata;
    /**
     * Get conventions for a specific layer
     */
    private getLayerConventions;
    /**
     * Get restrictions for a specific layer
     */
    private getLayerRestrictions;
    /**
     * Convert string to PascalCase
     */
    private toPascalCase;
}
//# sourceMappingURL=description-analyzer.d.ts.map