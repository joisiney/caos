import { AIProvider } from '../providers/ai-provider.interface';
import { ContextBuilder } from './context-builder';
import {
  LayerAnalysis,
  AnalysisContext,
  PropertyDefinition,
  MethodDefinition,
} from '../types';

/**
 * Analyzes natural language descriptions to determine appropriate layer and structure
 */
export class DescriptionAnalyzer {
  constructor(
    private aiProvider: AIProvider,
    private contextBuilder: ContextBuilder
  ) {}

  /**
   * Analyze a description to determine layer, name, and structure
   * @param description - Natural language description
   * @param projectContext - Optional project context
   * @returns Promise with layer analysis result
   */
  async analyze(
    description: string,
    projectContext?: Record<string, any>
  ): Promise<LayerAnalysis> {
    // Build analysis context
    const context = await this.contextBuilder.build(projectContext);
    
    // Perform AI analysis
    const analysis = await this.aiProvider.analyzeDescription(description, context);
    
    // Validate and refine the analysis
    const validatedAnalysis = await this.validateAnalysis(analysis);
    
    // Enrich with additional data
    const enrichedAnalysis = await this.enrichAnalysis(validatedAnalysis, context);
    
    return enrichedAnalysis;
  }

  /**
   * Validate the AI analysis result
   */
  private async validateAnalysis(analysis: LayerAnalysis): Promise<LayerAnalysis> {
    // Validate layer type
    if (!this.isValidLayer(analysis.layerType)) {
      throw new Error(`Invalid layer suggested: ${analysis.layerType}`);
    }

    // Validate component name
    if (!this.isValidName(analysis.componentName)) {
      analysis.componentName = this.sanitizeName(analysis.componentName);
    }

    // Validate dependencies
    analysis.dependencies = await this.validateDependencies(analysis.dependencies);

    // Ensure confidence is within valid range
    analysis.confidence = Math.max(0, Math.min(1, analysis.confidence));

    return analysis;
  }

  /**
   * Enrich analysis with additional context and suggestions
   */
  private async enrichAnalysis(
    analysis: LayerAnalysis,
    context: AnalysisContext
  ): Promise<LayerAnalysis> {
    // Add imports based on layer type and dependencies
    const imports = await this.suggestImports(analysis, context);
    
    // Suggest additional files based on layer conventions
    const additionalFiles = await this.suggestAdditionalFiles(analysis);
    
    // Add layer-specific metadata
    const layerMetadata = this.getLayerMetadata(analysis.layerType);

    return {
      ...analysis,
      metadata: {
        ...analysis.metadata,
        imports,
        additionalFiles,
        layerMetadata,
        projectType: context.framework || 'react',
        existingComponents: context.existingLayers || [],
      },
    };
  }

  /**
   * Check if the suggested layer is valid
   */
  private isValidLayer(layer: string): boolean {
    const validLayers = [
      'atom',
      'molecule',
      'organism',
      'template',
      'feature',
      'layout',
      'particle',
      'model',
      'entity',
      'util',
      'gateway',
      'repository',
    ];
    return validLayers.includes(layer);
  }

  /**
   * Check if the component name follows conventions
   */
  private isValidName(name: string): boolean {
    // Check dash-case convention
    const dashCaseRegex = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
    return dashCaseRegex.test(name);
  }

  /**
   * Sanitize component name to follow conventions
   */
  private sanitizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/-+/g, '-') // Replace multiple dashes with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing dashes
  }

  /**
   * Validate and filter dependencies
   */
  private async validateDependencies(dependencies: string[]): Promise<string[]> {
    return dependencies.filter(dep => {
      // Basic validation - could be enhanced with more sophisticated checks
      return dep && typeof dep === 'string' && dep.length > 0;
    });
  }

  /**
   * Suggest imports based on analysis and context
   */
  private async suggestImports(
    analysis: LayerAnalysis,
    context: AnalysisContext
  ): Promise<string[]> {
    const imports: string[] = [];
    
    // Framework-specific imports
    if (context.framework === 'react' || !context.framework) {
      imports.push('import React, { FC } from \'react\';');
      
      // Add common React imports based on layer
      if (['atom', 'molecule', 'organism'].includes(analysis.layerType)) {
        imports.push('import { TWithTestID } from \'@types/global\';');
      }
    }

    // Layer-specific imports
    switch (analysis.layerType) {
      case 'molecule':
      case 'organism':
      case 'feature':
        imports.push(`import { use${this.toPascalCase(analysis.componentName)}UseCase } from './${analysis.componentName}.use-case';`);
        break;
      
      case 'organism':
        if (analysis.metadata?.['hasValidation']) {
          imports.push(`import { schema } from './${analysis.componentName}.scheme';`);
        }
        break;
    }

    return imports;
  }

  /**
   * Suggest additional files based on layer conventions
   */
  private async suggestAdditionalFiles(analysis: LayerAnalysis): Promise<string[]> {
    const files: string[] = [];
    const baseName = analysis.componentName;
    const layer = analysis.layerType;

    // Core files for all layers
    files.push(`${baseName}.${layer}.tsx`);
    files.push(`${baseName}.type.ts`);
    files.push('index.ts');

    // Layer-specific files
    switch (layer) {
      case 'atom':
        files.push(`${baseName}.stories.tsx`);
        files.push(`${baseName}.spec.ts`);
        break;

      case 'molecule':
        files.push(`${baseName}.use-case.ts`);
        files.push(`${baseName}.stories.tsx`);
        files.push(`${baseName}.spec.ts`);
        break;

      case 'organism':
        files.push(`${baseName}.use-case.ts`);
        files.push(`${baseName}.stories.tsx`);
        files.push(`${baseName}.spec.ts`);
        if (analysis.metadata?.['hasValidation']) {
          files.push(`${baseName}.scheme.ts`);
        }
        break;

      case 'feature':
        files.push(`${baseName}.use-case.ts`);
        break;

      case 'template':
        // Templates have minimal files
        break;

      case 'util':
        files.push(`${baseName}.spec.ts`);
        break;
    }

    return files;
  }

  /**
   * Get layer-specific metadata
   */
  private getLayerMetadata(layer: string): Record<string, any> {
    const metadata: Record<string, any> = {
      layer,
      conventions: this.getLayerConventions(layer),
      restrictions: this.getLayerRestrictions(layer),
    };

    return metadata;
  }

  /**
   * Get conventions for a specific layer
   */
  private getLayerConventions(layer: string): Record<string, any> {
    const conventions: Record<string, any> = {
      atom: {
        suffix: '.atom.tsx',
        exports: ['component', 'types', 'constants'],
        canHave: ['variants', 'stories', 'tests'],
        mustHave: ['index.ts', 'types'],
      },
      molecule: {
        suffix: '.molecule.tsx',
        exports: ['component', 'types', 'use-case'],
        canHave: ['services', 'stories', 'tests'],
        mustHave: ['index.ts', 'types', 'use-case'],
      },
      organism: {
        suffix: '.organism.tsx',
        exports: ['component', 'types', 'use-case'],
        canHave: ['partials', 'services', 'context', 'scheme'],
        mustHave: ['index.ts', 'types', 'use-case'],
      },
      feature: {
        suffix: '.feature.tsx',
        exports: ['component', 'types'],
        canHave: ['use-case', 'services'],
        mustHave: ['index.ts', 'types', 'use-case'],
        prefix: 'layout-name',
      },
      template: {
        suffix: '.template.tsx',
        exports: ['component', 'types'],
        canHave: ['partials'],
        mustHave: ['index.ts', 'types'],
      },
    };

    return conventions[layer] || {};
  }

  /**
   * Get restrictions for a specific layer
   */
  private getLayerRestrictions(layer: string): string[] {
    const restrictions: Record<string, string[]> = {
      atom: [
        'Cannot export variants, stories, or specs in index.ts',
        'Cannot contain use-case, service, partials, or services directories',
      ],
      molecule: [
        'Must implement use-case hook',
        'Cannot contain partials, scheme, or context',
        'Services must be in _services/ directory',
      ],
      organism: [
        'Must implement use-case hook',
        'Can make direct API calls',
        'Partials must be in _partials/ directory',
      ],
      feature: [
        'Must have layout prefix (e.g., wallet-deposit.feature.tsx)',
        'Cannot render atoms, molecules, or organisms directly',
        'Must render exclusively templates',
      ],
      template: [
        'Cannot contain use-case, scheme, mock, context, constant, service files',
        'Focus on visual layout only',
        'Dependencies: Atoms, Molecules, Organisms (not Features), Utils',
      ],
    };

    return restrictions[layer] || [];
  }

  /**
   * Convert string to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }
}