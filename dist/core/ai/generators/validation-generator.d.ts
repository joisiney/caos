import { LayerAnalysis, TemplateContext, GeneratedCode, GenerationOptions } from '../types';
import { AIProvider } from '../providers/ai-provider.interface';
/**
 * Validation Generator for Khaos CLI
 *
 * Generates code with automatic validation and correction
 */
export declare class ValidationGenerator {
    private aiProvider?;
    constructor(aiProvider?: AIProvider);
    /**
     * Generate code with validation
     */
    generateWithValidation(analysis: LayerAnalysis, templateContext: TemplateContext, generatedFiles: Record<string, string>, options?: GenerationOptions): Promise<GeneratedCode>;
    /**
     * Validate generated code
     */
    private validateGeneratedCode;
    /**
     * Validate a single file
     */
    private validateFile;
    /**
     * Validate syntax
     */
    private validateSyntax;
    /**
     * Validate layer conventions
     */
    private validateLayerConventions;
    /**
     * Validate atom conventions
     */
    private validateAtomConventions;
    /**
     * Validate molecule conventions
     */
    private validateMoleculeConventions;
    /**
     * Validate organism conventions
     */
    private validateOrganismConventions;
    /**
     * Validate feature conventions
     */
    private validateFeatureConventions;
    /**
     * Validate React conventions
     */
    private validateReactConventions;
    /**
     * Validate TypeScript conventions
     */
    private validateTypeScriptConventions;
    /**
     * Validate imports
     */
    private validateImports;
    /**
     * Auto-fix errors
     */
    private autoFixErrors;
    /**
     * Fix errors in a single file
     */
    private fixFileErrors;
    /**
     * Apply auto-fix for a specific error
     */
    private applyAutoFix;
    /**
     * Enhance code with AI
     */
    private enhanceWithAI;
    /**
     * Enhance a single file with AI
     */
    private enhanceFileWithAI;
    /**
     * Extract code from AI response
     */
    private extractCodeFromResponse;
    /**
     * Generate improvements based on validation results
     */
    private generateImprovements;
}
/**
 * Default validation generator instance
 */
export declare const createValidationGenerator: (aiProvider?: AIProvider) => ValidationGenerator;
//# sourceMappingURL=validation-generator.d.ts.map