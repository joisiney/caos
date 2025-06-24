import { LayerAnalysis, GeneratedCode, GenerationOptions } from '../types';
import { AIProvider } from '../providers/ai-provider.interface';
import { TemplateEngine } from './template-engine';
import { TemplateSelector } from './template-selector';
import { VariableExtractor } from './variable-extractor';
import { ValidationGenerator } from './validation-generator';
import { FileGenerator } from './file-generator';
/**
 * Code Generator for Khaos CLI
 *
 * Main orchestrator for intelligent code generation
 */
export declare class CodeGenerator {
    private aiProvider?;
    private templateEngine;
    private templateSelector;
    private variableExtractor;
    private validationGenerator;
    private fileGenerator;
    constructor(aiProvider?: AIProvider, templateEngine?: TemplateEngine, templateSelector?: TemplateSelector, variableExtractor?: VariableExtractor, validationGenerator?: ValidationGenerator, fileGenerator?: FileGenerator);
    /**
     * Generate complete component from analysis
     */
    generateComponent(analysis: LayerAnalysis, options?: GenerationOptions): Promise<GeneratedCode>;
    /**
     * Generate base code from template
     */
    private generateBaseCode;
    /**
     * Load template files from disk
     */
    private loadTemplateFiles;
    /**
     * Get default templates when files can't be loaded
     */
    private getDefaultTemplates;
    /**
     * Generate file name from template name and context
     */
    private generateFileName;
    /**
     * Create file generation context
     */
    private createFileGenerationContext;
    /**
     * Check if file is required for the layer
     */
    private isRequiredFile;
    /**
     * Generate component preview
     */
    generatePreview(analysis: LayerAnalysis): Promise<{
        structure: string;
        files: string[];
        confidence: number;
    }>;
    /**
     * Validate generation requirements
     */
    validateGenerationRequirements(analysis: LayerAnalysis): {
        isValid: boolean;
        issues: string[];
    };
}
/**
 * Create default code generator instance
 */
export declare const createCodeGenerator: (aiProvider?: AIProvider) => CodeGenerator;
/**
 * Default code generator instance
 */
export declare const codeGenerator: CodeGenerator;
//# sourceMappingURL=code-generator.d.ts.map