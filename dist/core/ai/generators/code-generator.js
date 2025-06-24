"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeGenerator = exports.createCodeGenerator = exports.CodeGenerator = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const template_engine_1 = require("./template-engine");
const template_selector_1 = require("./template-selector");
const variable_extractor_1 = require("./variable-extractor");
const validation_generator_1 = require("./validation-generator");
const file_generator_1 = require("./file-generator");
/**
 * Code Generator for Khaos CLI
 *
 * Main orchestrator for intelligent code generation
 */
class CodeGenerator {
    aiProvider;
    templateEngine;
    templateSelector;
    variableExtractor;
    validationGenerator;
    fileGenerator;
    constructor(aiProvider, templateEngine, templateSelector, variableExtractor, validationGenerator, fileGenerator) {
        this.aiProvider = aiProvider;
        this.templateEngine = templateEngine || new template_engine_1.TemplateEngine();
        this.templateSelector = templateSelector || new template_selector_1.TemplateSelector(new template_selector_1.DefaultTemplateRegistry(), aiProvider);
        this.variableExtractor = variableExtractor || new variable_extractor_1.VariableExtractor();
        this.validationGenerator = validationGenerator || new validation_generator_1.ValidationGenerator(aiProvider);
        this.fileGenerator = fileGenerator || new file_generator_1.FileGenerator();
    }
    /**
     * Generate complete component from analysis
     */
    async generateComponent(analysis, options = {
        useAIEnhancement: true,
        validateCode: true,
        autoFix: true,
    }) {
        try {
            console.log(`🚀 Starting code generation for ${analysis.componentName} (${analysis.layerType})...`);
            // Step 1: Select appropriate template
            console.log('📋 Selecting template...');
            const templateSelection = await this.templateSelector.selectTemplate(analysis);
            console.log(`✅ Selected template: ${templateSelection.template.name} (confidence: ${templateSelection.confidence})`);
            // Step 2: Extract variables and context
            console.log('⚙️ Extracting variables...');
            const extractionResult = await this.variableExtractor.extractContext(analysis, {
                targetDirectory: options.targetDirectory,
                features: options.features,
            });
            if (!extractionResult.validation.isValid) {
                throw new Error(`Variable extraction failed: ${extractionResult.validation.issues.map(i => i.message).join(', ')}`);
            }
            const templateContext = extractionResult.context;
            console.log(`✅ Extracted context for ${templateContext.pascalName}`);
            // Step 3: Generate base code from templates
            console.log('🔨 Generating base code...');
            const baseFiles = await this.generateBaseCode(templateSelection.template, templateContext);
            console.log(`✅ Generated ${Object.keys(baseFiles).length} base files`);
            // Step 4: Validate and enhance code
            console.log('🔍 Validating and enhancing code...');
            const generatedCode = await this.validationGenerator.generateWithValidation(analysis, templateContext, baseFiles, options);
            console.log(`✅ Code validation completed (score: ${generatedCode.validation?.score || 0})`);
            // Step 5: Prepare file generation context
            const fileContext = this.createFileGenerationContext(templateContext, generatedCode.files, options.targetDirectory);
            // Step 6: Generate files to disk if target directory is provided
            if (options.targetDirectory) {
                console.log('💾 Writing files to disk...');
                await this.fileGenerator.generateFiles(fileContext);
                console.log('✅ Files written successfully');
            }
            console.log(`🎉 Code generation completed for ${analysis.componentName}!`);
            return generatedCode;
        }
        catch (error) {
            console.error('❌ Code generation failed:', error);
            throw new Error(`Code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Generate base code from template
     */
    async generateBaseCode(template, context) {
        const generatedFiles = {};
        // Load template files from disk
        const templateFiles = await this.loadTemplateFiles(template.layer, template.name);
        for (const templateFile of templateFiles) {
            try {
                const renderedContent = await this.templateEngine.render(templateFile.content, context);
                const fileName = this.generateFileName(templateFile.name, context);
                generatedFiles[fileName] = renderedContent;
            }
            catch (error) {
                console.warn(`Failed to render template ${templateFile.name}:`, error);
                // Continue with other files
            }
        }
        return generatedFiles;
    }
    /**
     * Load template files from disk
     */
    async loadTemplateFiles(layer, templateName = 'default') {
        const templateFiles = [];
        const templateDir = path.join(process.cwd(), 'src', 'templates', layer);
        try {
            const files = await fs.readdir(templateDir);
            for (const file of files) {
                if (file.endsWith('.ejs')) {
                    const filePath = path.join(templateDir, file);
                    const content = await fs.readFile(filePath, 'utf8');
                    const name = file.replace('.ejs', '');
                    templateFiles.push({ name, content });
                }
            }
        }
        catch (error) {
            console.warn(`Failed to load templates for layer ${layer}:`, error);
            // Return default templates
            return this.getDefaultTemplates(layer);
        }
        return templateFiles;
    }
    /**
     * Get default templates when files can't be loaded
     */
    getDefaultTemplates(layer) {
        const templates = [];
        switch (layer) {
            case 'atom':
                templates.push({
                    name: 'component.atom.tsx',
                    content: `import React from 'react';
import type { <%= namespace %>Props } from './<%= kebabName %>.type';

/**
 * <%= pascalName %> Atom Component
 * 
 * @description <%= description %>
 * @layer atom
 * @namespace <%= namespace %>
 */
export function <%= pascalName %>({ testID = '<%= kebabName %>', ...props }: <%= namespace %>Props): React.ReactElement {
  return (
    <div testID={testID} {...props}>
      {/* <%= pascalName %> implementation */}
      <span>
        <%= pascalName %> Component
      </span>
    </div>
  );
}

<%= pascalName %>.displayName = '<%= namespace %>';`,
                });
                templates.push({
                    name: 'type.ts',
                    content: `/**
 * <%= pascalName %> Atom Types
 * 
 * @description Type definitions for <%= pascalName %> atom component
 * @layer atom
 */

export interface <%= namespace %>Props {
  /** Test ID for testing purposes */
  testID?: string;
<% props.forEach(prop => { %>
  /** <%= prop.description || prop.name %> */
  <%= prop.name %><%= prop.required ? '' : '?' %>: <%= prop.type %>;
<% }); %>
}

export namespace <%= namespace %> {
  export type Props = <%= namespace %>Props;
}`,
                });
                templates.push({
                    name: 'index.ts',
                    content: `export { <%= pascalName %> } from './<%= kebabName %>.atom';
export type { <%= namespace %>Props } from './<%= kebabName %>.type';`,
                });
                break;
            default:
                templates.push({
                    name: 'index.ts',
                    content: `// <%= pascalName %> <%= layer %> component
export * from './<%= kebabName %>.<%= layer %>';`,
                });
        }
        return templates;
    }
    /**
     * Generate file name from template name and context
     */
    generateFileName(templateName, context) {
        const { kebabName, layer } = context;
        // Map template names to actual file names
        const fileNameMappings = {
            'component.atom.tsx': `${kebabName}.atom.tsx`,
            'component.molecule.tsx': `${kebabName}.molecule.tsx`,
            'component.organism.tsx': `${kebabName}.organism.tsx`,
            'component.template.tsx': `${kebabName}.template.tsx`,
            'component.feature.tsx': `${kebabName}.feature.tsx`,
            'component.layout.tsx': `${kebabName}.layout.tsx`,
            'type.ts': `${kebabName}.type.ts`,
            'use-case.ts': `${kebabName}.use-case.ts`,
            'variant.ts': `${kebabName}.variant.ts`,
            'constant.ts': `${kebabName}.constant.ts`,
            'mock.ts': `${kebabName}.mock.ts`,
            'stories.tsx': `${kebabName}.stories.tsx`,
            'spec.ts': `${kebabName}.spec.ts`,
            'index.ts': 'index.ts',
        };
        return fileNameMappings[templateName] || templateName;
    }
    /**
     * Create file generation context
     */
    createFileGenerationContext(templateContext, files, targetDirectory) {
        const filesToGenerate = [];
        for (const [fileName, content] of Object.entries(files)) {
            filesToGenerate.push({
                name: fileName,
                content,
                relativePath: fileName,
                required: this.isRequiredFile(fileName, templateContext.layer),
                metadata: {
                    template: 'generated',
                    generatedAt: new Date(),
                    aiEnhanced: true,
                },
            });
        }
        // Determine target directory
        const finalTargetDirectory = targetDirectory ||
            this.fileGenerator.getTargetDirectoryPath(process.cwd(), templateContext.layer, templateContext.name, templateContext);
        return {
            targetDirectory: finalTargetDirectory,
            componentName: templateContext.name,
            layer: templateContext.layer,
            filesToGenerate,
            templateContext,
        };
    }
    /**
     * Check if file is required for the layer
     */
    isRequiredFile(fileName, layer) {
        const requiredFiles = {
            atom: ['index.ts', '.atom.tsx', '.type.ts'],
            molecule: ['index.ts', '.molecule.tsx', '.type.ts', '.use-case.ts'],
            organism: ['index.ts', '.organism.tsx', '.type.ts', '.use-case.ts'],
            template: ['index.ts', '.template.tsx', '.type.ts'],
            feature: ['index.ts', '.feature.tsx', '.type.ts', '.use-case.ts'],
            layout: ['index.ts', '.layout.tsx', '.type.ts'],
            particle: ['index.ts', '.type.ts'],
            model: ['index.ts', '.type.ts'],
            entity: ['index.ts'],
            util: ['index.ts'],
            gateway: ['index.ts', '.type.ts'],
            repository: ['index.ts', '.type.ts'],
        };
        const layerRequiredFiles = requiredFiles[layer] || ['index.ts'];
        return layerRequiredFiles.some(required => fileName.includes(required));
    }
    /**
     * Generate component preview
     */
    async generatePreview(analysis) {
        try {
            // Quick generation without writing files
            const templateSelection = await this.templateSelector.selectTemplate(analysis);
            const extractionResult = await this.variableExtractor.extractContext(analysis);
            const previewContext = {
                targetDirectory: '/preview',
                componentName: extractionResult.context.name,
                layer: extractionResult.context.layer,
                filesToGenerate: extractionResult.filesToGenerate.map(fileName => ({
                    name: fileName,
                    content: '',
                    relativePath: fileName,
                    required: this.isRequiredFile(fileName, extractionResult.context.layer),
                    metadata: {
                        template: 'preview',
                        generatedAt: new Date(),
                        aiEnhanced: false,
                    },
                })),
                templateContext: extractionResult.context,
            };
            const structure = this.fileGenerator.generateFileStructurePreview(previewContext);
            const files = extractionResult.filesToGenerate;
            return {
                structure,
                files,
                confidence: templateSelection.confidence,
            };
        }
        catch (error) {
            throw new Error(`Preview generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Validate generation requirements
     */
    validateGenerationRequirements(analysis) {
        const issues = [];
        // Check required fields
        if (!analysis.componentName) {
            issues.push('Component name is required');
        }
        if (!analysis.layerType) {
            issues.push('Layer type is required');
        }
        if (analysis.confidence < 0.5) {
            issues.push('Analysis confidence is too low');
        }
        // Layer-specific validations
        if (analysis.layerType === 'feature' || analysis.layerType === 'layout') {
            if (!analysis.componentName?.includes('-')) {
                issues.push(`${analysis.layerType} components require a prefix`);
            }
        }
        return {
            isValid: issues.length === 0,
            issues,
        };
    }
}
exports.CodeGenerator = CodeGenerator;
/**
 * Create default code generator instance
 */
const createCodeGenerator = (aiProvider) => {
    return new CodeGenerator(aiProvider);
};
exports.createCodeGenerator = createCodeGenerator;
/**
 * Default code generator instance
 */
exports.codeGenerator = (0, exports.createCodeGenerator)();
//# sourceMappingURL=code-generator.js.map