import * as fs from 'fs/promises';
import * as path from 'path';
import {
  LayerAnalysis,
  GeneratedCode,
  GenerationOptions,
  FileGenerationContext,
  TemplateContext,
  GeneratedFile,
} from '../types';
import { AIProvider } from '../providers/ai-provider.interface';
import { TemplateEngine } from './template-engine';
import { TemplateSelector, DefaultTemplateRegistry } from './template-selector';
import { VariableExtractor } from './variable-extractor';
import { ValidationGenerator } from './validation-generator';
import { FileGenerator } from './file-generator';

/**
 * Code Generator for Khaos CLI
 * 
 * Main orchestrator for intelligent code generation
 */
export class CodeGenerator {
  private aiProvider?: AIProvider;
  private templateEngine: TemplateEngine;
  private templateSelector: TemplateSelector;
  private variableExtractor: VariableExtractor;
  private validationGenerator: ValidationGenerator;
  private fileGenerator: FileGenerator;

  constructor(
    aiProvider?: AIProvider,
    templateEngine?: TemplateEngine,
    templateSelector?: TemplateSelector,
    variableExtractor?: VariableExtractor,
    validationGenerator?: ValidationGenerator,
    fileGenerator?: FileGenerator
  ) {
    this.aiProvider = aiProvider;
    this.templateEngine = templateEngine || new TemplateEngine();
    this.templateSelector = templateSelector || new TemplateSelector(new DefaultTemplateRegistry(), aiProvider);
    this.variableExtractor = variableExtractor || new VariableExtractor();
    this.validationGenerator = validationGenerator || new ValidationGenerator(aiProvider);
    this.fileGenerator = fileGenerator || new FileGenerator();
  }

  /**
   * Generate complete component from analysis
   */
  async generateComponent(
    analysis: LayerAnalysis,
    options: GenerationOptions = {
      useAIEnhancement: true,
      validateCode: true,
      autoFix: true,
    }
  ): Promise<GeneratedCode> {
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
      const generatedCode = await this.validationGenerator.generateWithValidation(
        analysis,
        templateContext,
        baseFiles,
        options
      );
      console.log(`✅ Code validation completed (score: ${generatedCode.validation?.score || 0})`);

      // Step 5: Prepare file generation context
      const fileContext = this.createFileGenerationContext(
        templateContext,
        generatedCode.files,
        options.targetDirectory
      );

      // Step 6: Generate files to disk if target directory is provided
      if (options.targetDirectory) {
        console.log('💾 Writing files to disk...');
        await this.fileGenerator.generateFiles(fileContext);
        console.log('✅ Files written successfully');
      }

      console.log(`🎉 Code generation completed for ${analysis.componentName}!`);
      return generatedCode;

    } catch (error) {
      console.error('❌ Code generation failed:', error);
      throw new Error(`Code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate base code from template
   */
  private async generateBaseCode(
    template: any,
    context: TemplateContext
  ): Promise<Record<string, string>> {
    const generatedFiles: Record<string, string> = {};

    // Load template files from disk
    const templateFiles = await this.loadTemplateFiles(template.layer, template.name);

    for (const templateFile of templateFiles) {
      try {
        const renderedContent = await this.templateEngine.render(templateFile.content, context);
        const fileName = this.generateFileName(templateFile.name, context);
        generatedFiles[fileName] = renderedContent;
      } catch (error) {
        console.warn(`Failed to render template ${templateFile.name}:`, error);
        // Continue with other files
      }
    }

    return generatedFiles;
  }

  /**
   * Load template files from disk
   */
  private async loadTemplateFiles(layer: string, templateName: string = 'default'): Promise<Array<{
    name: string;
    content: string;
  }>> {
    const templateFiles: Array<{ name: string; content: string }> = [];
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
    } catch (error) {
      console.warn(`Failed to load templates for layer ${layer}:`, error);
      // Return default templates
      return this.getDefaultTemplates(layer);
    }

    return templateFiles;
  }

  /**
   * Get default templates when files can't be loaded
   */
  private getDefaultTemplates(layer: string): Array<{ name: string; content: string }> {
    const templates: Array<{ name: string; content: string }> = [];

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
  private generateFileName(templateName: string, context: TemplateContext): string {
    const { kebabName, layer } = context;
    
    // Map template names to actual file names
    const fileNameMappings: Record<string, string> = {
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
  private createFileGenerationContext(
    templateContext: TemplateContext,
    files: Record<string, string>,
    targetDirectory?: string
  ): FileGenerationContext {
    const filesToGenerate: GeneratedFile[] = [];

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
      this.fileGenerator.getTargetDirectoryPath(
        process.cwd(),
        templateContext.layer,
        templateContext.name,
        templateContext
      );

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
  private isRequiredFile(fileName: string, layer: string): boolean {
    const requiredFiles: Record<string, string[]> = {
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
  async generatePreview(analysis: LayerAnalysis): Promise<{
    structure: string;
    files: string[];
    confidence: number;
  }> {
    try {
      // Quick generation without writing files
      const templateSelection = await this.templateSelector.selectTemplate(analysis);
      const extractionResult = await this.variableExtractor.extractContext(analysis);
      
      const previewContext: FileGenerationContext = {
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
    } catch (error) {
      throw new Error(`Preview generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate generation requirements
   */
  validateGenerationRequirements(analysis: LayerAnalysis): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];

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

/**
 * Create default code generator instance
 */
export const createCodeGenerator = (aiProvider?: AIProvider): CodeGenerator => {
  return new CodeGenerator(aiProvider);
};

/**
 * Default code generator instance
 */
export const codeGenerator = createCodeGenerator(); 