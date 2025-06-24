/**
 * AI Generators for Khaos CLI
 * 
 * Intelligent code generation system that creates components following Khaos architecture
 */

import { AIProvider } from '../providers/ai-provider.interface';

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
  const { TemplateEngine } = require('./template-engine');
  const { createTemplateSelector } = require('./template-selector');
  const { VariableExtractor } = require('./variable-extractor');
  const { createValidationGenerator } = require('./validation-generator');
  const { FileGenerator } = require('./file-generator');
  const { createCodeGenerator } = require('./code-generator');

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
  default: () => {
    const { TemplateEngine } = require('./template-engine');
    const { VariableExtractor } = require('./variable-extractor');
    const { FileGenerator } = require('./file-generator');
    const { createCodeGenerator } = require('./code-generator');
    
    return {
      templateEngine: new TemplateEngine(),
      variableExtractor: new VariableExtractor(),
      fileGenerator: new FileGenerator(),
      codeGenerator: createCodeGenerator(),
    };
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

/**
 * Create a complete generator suite
 */
export function createGeneratorSuite(aiProvider?: AIProvider) {
  const { TemplateEngine } = require('./template-engine');
  const { TemplateSelector, DefaultTemplateRegistry } = require('./template-selector');
  const { VariableExtractor } = require('./variable-extractor');
  const { ValidationGenerator } = require('./validation-generator');
  const { FileGenerator } = require('./file-generator');
  const { createCodeGenerator } = require('./code-generator');

  const templateEngine = new TemplateEngine();
  const templateRegistry = new DefaultTemplateRegistry();
  const templateSelector = new TemplateSelector(templateRegistry, aiProvider);
  const variableExtractor = new VariableExtractor();
  const validationGenerator = new ValidationGenerator(aiProvider);
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