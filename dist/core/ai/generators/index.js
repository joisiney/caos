"use strict";
/**
 * AI Generators for Khaos CLI
 *
 * Intelligent code generation system that creates components following Khaos architecture
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatorUtils = exports.generators = exports.codeGenerator = exports.createCodeGenerator = exports.CodeGenerator = exports.fileGenerator = exports.FileGenerator = exports.createValidationGenerator = exports.ValidationGenerator = exports.variableExtractor = exports.VariableExtractor = exports.createTemplateSelector = exports.DefaultTemplateRegistry = exports.TemplateSelector = exports.templateEngine = exports.TemplateEngine = void 0;
exports.createGeneratorSystem = createGeneratorSystem;
exports.createGeneratorSuite = createGeneratorSuite;
// Core generators
var template_engine_1 = require("./template-engine");
Object.defineProperty(exports, "TemplateEngine", { enumerable: true, get: function () { return template_engine_1.TemplateEngine; } });
Object.defineProperty(exports, "templateEngine", { enumerable: true, get: function () { return template_engine_1.templateEngine; } });
var template_selector_1 = require("./template-selector");
Object.defineProperty(exports, "TemplateSelector", { enumerable: true, get: function () { return template_selector_1.TemplateSelector; } });
Object.defineProperty(exports, "DefaultTemplateRegistry", { enumerable: true, get: function () { return template_selector_1.DefaultTemplateRegistry; } });
Object.defineProperty(exports, "createTemplateSelector", { enumerable: true, get: function () { return template_selector_1.createTemplateSelector; } });
var variable_extractor_1 = require("./variable-extractor");
Object.defineProperty(exports, "VariableExtractor", { enumerable: true, get: function () { return variable_extractor_1.VariableExtractor; } });
Object.defineProperty(exports, "variableExtractor", { enumerable: true, get: function () { return variable_extractor_1.variableExtractor; } });
var validation_generator_1 = require("./validation-generator");
Object.defineProperty(exports, "ValidationGenerator", { enumerable: true, get: function () { return validation_generator_1.ValidationGenerator; } });
Object.defineProperty(exports, "createValidationGenerator", { enumerable: true, get: function () { return validation_generator_1.createValidationGenerator; } });
var file_generator_1 = require("./file-generator");
Object.defineProperty(exports, "FileGenerator", { enumerable: true, get: function () { return file_generator_1.FileGenerator; } });
Object.defineProperty(exports, "fileGenerator", { enumerable: true, get: function () { return file_generator_1.fileGenerator; } });
var code_generator_1 = require("./code-generator");
Object.defineProperty(exports, "CodeGenerator", { enumerable: true, get: function () { return code_generator_1.CodeGenerator; } });
Object.defineProperty(exports, "createCodeGenerator", { enumerable: true, get: function () { return code_generator_1.createCodeGenerator; } });
Object.defineProperty(exports, "codeGenerator", { enumerable: true, get: function () { return code_generator_1.codeGenerator; } });
/**
 * Main generator factory function
 * Creates a complete generator system with all components
 */
function createGeneratorSystem(aiProvider) {
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
exports.generators = {
    /**
     * Create a basic generator without AI
     */
    basic: () => createGeneratorSystem(),
    /**
     * Create a full AI-powered generator
     */
    withAI: (aiProvider) => createGeneratorSystem(aiProvider),
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
exports.generatorUtils = {
    /**
     * Validate if all required generators are configured
     */
    validateSystem: (system) => {
        const required = ['templateEngine', 'templateSelector', 'variableExtractor', 'validationGenerator', 'fileGenerator', 'codeGenerator'];
        const missing = required.filter(key => !system[key]);
        return {
            isValid: missing.length === 0,
            missing,
        };
    },
    /**
     * Get system capabilities based on AI provider availability
     */
    getCapabilities: (hasAI) => ({
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
exports.default = {
    createGeneratorSystem,
    generators: exports.generators,
    generatorUtils: exports.generatorUtils,
};
/**
 * Create a complete generator suite
 */
function createGeneratorSuite(aiProvider) {
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
//# sourceMappingURL=index.js.map