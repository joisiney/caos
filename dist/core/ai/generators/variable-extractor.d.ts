import { LayerAnalysis, VariableExtractionResult } from '../types';
/**
 * Variable Extractor for Khaos CLI
 *
 * Extracts variables from analysis and context to create template variables
 */
export declare class VariableExtractor {
    /**
     * Extract template context from layer analysis
     */
    extractContext(analysis: LayerAnalysis, options?: {
        targetDirectory?: string;
        prefix?: string;
        features?: string[];
    }): Promise<VariableExtractionResult>;
    /**
     * Build template context from analysis
     */
    private buildTemplateContext;
    /**
     * Apply prefix based on layer requirements
     */
    private applyPrefix;
    /**
     * Check if a string is a valid prefix
     */
    private isValidPrefix;
    /**
     * Generate name variations
     */
    private generateNameVariations;
    /**
     * Generate namespace for component
     */
    private generateNamespace;
    /**
     * Extract features from analysis
     */
    private extractFeatures;
    /**
     * Generate imports based on analysis and layer
     */
    private generateImports;
    /**
     * Check if layer generates React components
     */
    private isReactComponent;
    /**
     * Generate props interface import
     */
    private generatePropsImport;
    /**
     * Check if component has variants
     */
    private hasVariants;
    /**
     * Check if component needs utility imports
     */
    private needsUtilityImports;
    /**
     * Generate layer-specific imports
     */
    private generateLayerSpecificImports;
    /**
     * Determine which files should be generated
     */
    private determineFilesToGenerate;
    /**
     * Get base files for each layer
     */
    private getBaseFilesForLayer;
    /**
     * Validate the generated context
     */
    private validateContext;
    /**
     * Sanitize description text
     */
    private sanitizeDescription;
    /**
     * String transformation utilities
     */
    private toPascalCase;
    private toCamelCase;
    private toKebabCase;
}
/**
 * Default variable extractor instance
 */
export declare const variableExtractor: VariableExtractor;
//# sourceMappingURL=variable-extractor.d.ts.map