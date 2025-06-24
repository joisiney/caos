/**
 * AI Generators for Khaos CLI
 *
 * Intelligent code generation system that creates components following Khaos architecture
 */
import { AIProvider } from '../providers/ai-provider.interface';
export { TemplateEngine, templateEngine } from './template-engine';
export { TemplateSelector, DefaultTemplateRegistry, createTemplateSelector } from './template-selector';
export { VariableExtractor, variableExtractor } from './variable-extractor';
export { ValidationGenerator, createValidationGenerator } from './validation-generator';
export { FileGenerator, fileGenerator } from './file-generator';
export { CodeGenerator, createCodeGenerator, codeGenerator } from './code-generator';
export type { TemplateContext, ImportDefinition, TemplateFile, LayerTemplate, FileGenerationContext, GeneratedFile, TemplateSelection, VariableExtractionResult, CodeEnhancement, GenerationOptions, LayerStructure, TemplateEngine as ITemplateEngine, CompiledTemplate, TemplateHelper, TemplateRegistry, } from '../types';
/**
 * Main generator factory function
 * Creates a complete generator system with all components
 */
export declare function createGeneratorSystem(aiProvider?: any): {
    templateEngine: any;
    templateSelector: any;
    variableExtractor: any;
    validationGenerator: any;
    fileGenerator: any;
    codeGenerator: any;
};
/**
 * Quick generator creation for common use cases
 */
export declare const generators: {
    /**
     * Create a basic generator without AI
     */
    basic: () => {
        templateEngine: any;
        templateSelector: any;
        variableExtractor: any;
        validationGenerator: any;
        fileGenerator: any;
        codeGenerator: any;
    };
    /**
     * Create a full AI-powered generator
     */
    withAI: (aiProvider: any) => {
        templateEngine: any;
        templateSelector: any;
        variableExtractor: any;
        validationGenerator: any;
        fileGenerator: any;
        codeGenerator: any;
    };
    /**
     * Get default generator instances
     */
    default: () => {
        templateEngine: any;
        variableExtractor: any;
        fileGenerator: any;
        codeGenerator: any;
    };
};
/**
 * Utility functions for generator usage
 */
export declare const generatorUtils: {
    /**
     * Validate if all required generators are configured
     */
    validateSystem: (system: ReturnType<typeof createGeneratorSystem>) => {
        isValid: boolean;
        missing: string[];
    };
    /**
     * Get system capabilities based on AI provider availability
     */
    getCapabilities: (hasAI: boolean) => {
        templateSelection: boolean;
        variableExtraction: boolean;
        basicGeneration: boolean;
        fileGeneration: boolean;
        aiEnhancement: boolean;
        intelligentTemplateSelection: boolean;
        codeValidation: boolean;
        autoFix: boolean;
    };
};
declare const _default: {
    createGeneratorSystem: typeof createGeneratorSystem;
    generators: {
        /**
         * Create a basic generator without AI
         */
        basic: () => {
            templateEngine: any;
            templateSelector: any;
            variableExtractor: any;
            validationGenerator: any;
            fileGenerator: any;
            codeGenerator: any;
        };
        /**
         * Create a full AI-powered generator
         */
        withAI: (aiProvider: any) => {
            templateEngine: any;
            templateSelector: any;
            variableExtractor: any;
            validationGenerator: any;
            fileGenerator: any;
            codeGenerator: any;
        };
        /**
         * Get default generator instances
         */
        default: () => {
            templateEngine: any;
            variableExtractor: any;
            fileGenerator: any;
            codeGenerator: any;
        };
    };
    generatorUtils: {
        /**
         * Validate if all required generators are configured
         */
        validateSystem: (system: ReturnType<typeof createGeneratorSystem>) => {
            isValid: boolean;
            missing: string[];
        };
        /**
         * Get system capabilities based on AI provider availability
         */
        getCapabilities: (hasAI: boolean) => {
            templateSelection: boolean;
            variableExtraction: boolean;
            basicGeneration: boolean;
            fileGeneration: boolean;
            aiEnhancement: boolean;
            intelligentTemplateSelection: boolean;
            codeValidation: boolean;
            autoFix: boolean;
        };
    };
};
export default _default;
/**
 * Create a complete generator suite
 */
export declare function createGeneratorSuite(aiProvider?: AIProvider): {
    templateEngine: any;
    templateSelector: any;
    variableExtractor: any;
    validationGenerator: any;
    fileGenerator: any;
    codeGenerator: any;
};
/**
 * Generator suite interface
 */
export interface GeneratorSuite {
    templateEngine: any;
    templateSelector: any;
    variableExtractor: any;
    validationGenerator: any;
    fileGenerator: any;
    codeGenerator: any;
}
//# sourceMappingURL=index.d.ts.map