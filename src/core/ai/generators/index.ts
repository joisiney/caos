/**
 * AI Generators for Khaos CLI
 * 
 * Intelligent code generation system that creates components following Khaos architecture
 */

// Core generators
export { TemplateEngine, templateEngine } from './template-engine';
export { TemplateSelector, DefaultTemplateRegistry, createTemplateSelector } from './template-selector';
export { VariableExtractor, variableExtractor } from './variable-extractor';
export { ValidationGenerator, createValidationGenerator } from './validation-generator';
export { FileGenerator, fileGenerator } from './file-generator';
export { CodeGenerator, createCodeGenerator, codeGenerator } from './code-generator';

// Type exports
export type {
  TemplateContext,
  ImportDefinition,
  TemplateFile,
  LayerTemplate,
  FileGenerationContext,
  GeneratedFile,
  TemplateSelection,
  VariableExtractionResult,
  CodeEnhancement,
  GenerationOptions,
  LayerStructure,
  TemplateEngine as ITemplateEngine,
  CompiledTemplate,
  TemplateHelper,
  TemplateRegistry,
} from '../types';

/**
 * Main generator factory function
 * Creates a complete generator system with all components
 */
export function createGeneratorSystem(aiProvider?: any) {
  const templateEngine = new TemplateEngine();
  const templateSelector = createTemplateSelector(aiProvider);
  const variableExtractor = new VariableExtractor();
  const validationGenerator = createValidationGenerator(aiProvider);
  const fileGenerator = new FileGenerator();
  const codeGenerator = createCodeGenerator(aiProvider);

  return {
    templateEngine,
    templateSelector,
    variableExtractor,
    validationGenerator,
    fileGenerator,
    codeGenerator,
  };
}

/**
 * Quick generator creation for common use cases
 */
export const generators = {
  /**
   * Create a basic generator without AI
   */
  basic: () => createGeneratorSystem(),
  
  /**
   * Create a full AI-powered generator
   */
  withAI: (aiProvider: any) => createGeneratorSystem(aiProvider),
  
  /**
   * Get default generator instances
   */
  default: {
    templateEngine,
    variableExtractor,
    fileGenerator,
    codeGenerator,
  },
};

/**
 * Utility functions for generator usage
 */
export const generatorUtils = {
  /**
   * Validate if all required generators are configured
   */
  validateSystem: (system: ReturnType<typeof createGeneratorSystem>) => {
    const required = ['templateEngine', 'templateSelector', 'variableExtractor', 'validationGenerator', 'fileGenerator', 'codeGenerator'];
    const missing = required.filter(key => !system[key as keyof typeof system]);
    
    return {
      isValid: missing.length === 0,
      missing,
    };
  },
  
  /**
   * Get system capabilities based on AI provider availability
   */
  getCapabilities: (hasAI: boolean) => ({
    templateSelection: true,
    variableExtraction: true,
    basicGeneration: true,
    fileGeneration: true,
    aiEnhancement: hasAI,
    intelligentTemplateSelection: hasAI,
    codeValidation: hasAI,
    autoFix: hasAI,
  }),
};

export default {
  createGeneratorSystem,
  generators,
  generatorUtils,
}; 