import { AnalysisContext } from '../types';

/**
 * Builds context for AI analysis operations
 */
export class ContextBuilder {
  /**
   * Build analysis context from project information
   * @param projectContext - Optional project context data
   * @returns Promise with built analysis context
   */
  async build(projectContext?: Record<string, any>): Promise<AnalysisContext> {
    const context: AnalysisContext = {
      projectStructure: await this.getProjectStructure(projectContext),
      existingLayers: await this.getExistingLayers(projectContext),
      projectConfig: await this.getProjectConfig(projectContext),
      framework: this.detectFramework(projectContext),
      metadata: await this.buildMetadata(projectContext),
    };

    return context;
  }

  /**
   * Get project structure information
   */
  private async getProjectStructure(
    projectContext?: Record<string, any>
  ): Promise<string[]> {
    if (projectContext?.['projectStructure']) {
      return projectContext['projectStructure'];
    }

    // Default Khaos structure
    return [
      'src/atoms/',
      'src/molecules/',
      'src/organisms/',
      'src/templates/',
      'src/features/',
      'src/layouts/',
      'src/particles/',
      'src/models/',
      'src/entities/',
      'src/utils/',
      'src/gateways/',
      'src/repositories/',
    ];
  }

  /**
   * Get existing layers in the project
   */
  private async getExistingLayers(
    projectContext?: Record<string, any>
  ): Promise<string[]> {
    if (projectContext?.['existingLayers']) {
      return projectContext['existingLayers'];
    }

    // Could be enhanced to scan actual project files
    return [];
  }

  /**
   * Get project configuration
   */
  private async getProjectConfig(
    projectContext?: Record<string, any>
  ): Promise<Record<string, any>> {
    if (projectContext?.['projectConfig']) {
      return projectContext['projectConfig'];
    }

    // Default Khaos configuration
    return {
      architecture: 'khaos',
      framework: 'react',
      typescript: true,
      testing: 'jest',
      styling: 'tailwind',
      storybook: true,
    };
  }

  /**
   * Detect the framework being used
   */
  private detectFramework(projectContext?: Record<string, any>): string {
    if (projectContext?.['framework']) {
      return projectContext['framework'];
    }

    // Default to React for Khaos architecture
    return 'react';
  }

  /**
   * Build additional metadata
   */
  private async buildMetadata(
    projectContext?: Record<string, any>
  ): Promise<Record<string, any>> {
    const metadata: Record<string, any> = {
      buildTime: new Date().toISOString(),
      version: '1.0.0',
    };

    if (projectContext?.['metadata']) {
      Object.assign(metadata, projectContext['metadata']);
    }

    return metadata;
  }

  /**
   * Get context for specific layer type
   */
  async getLayerContext(layerType: string): Promise<Record<string, any>> {
    const layerContexts: Record<string, Record<string, any>> = {
      atom: {
        complexity: 'low',
        dependencies: 'none',
        reusability: 'high',
        patterns: ['button', 'input', 'icon', 'text', 'image'],
      },
      molecule: {
        complexity: 'medium',
        dependencies: 'atoms',
        reusability: 'medium',
        patterns: ['modal', 'card', 'form', 'list', 'dropdown'],
      },
      organism: {
        complexity: 'high',
        dependencies: 'molecules+atoms',
        reusability: 'medium',
        patterns: ['header', 'sidebar', 'navigation', 'section'],
      },
      template: {
        complexity: 'medium',
        dependencies: 'organisms+molecules+atoms',
        reusability: 'low',
        patterns: ['layout', 'page-structure', 'grid'],
      },
      feature: {
        complexity: 'high',
        dependencies: 'all',
        reusability: 'low',
        patterns: ['screen', 'page', 'functionality', 'flow'],
      },
    };

    return layerContexts[layerType] || {};
  }

  /**
   * Get naming conventions for layer
   */
  getLayerNamingConventions(layerType: string): Record<string, any> {
    const conventions: Record<string, Record<string, any>> = {
      atom: {
        suffix: '.atom.tsx',
        componentSuffix: 'Atom',
        namePattern: 'dash-case',
        examples: ['button', 'input', 'icon'],
      },
      molecule: {
        suffix: '.molecule.tsx',
        componentSuffix: 'Molecule',
        namePattern: 'dash-case',
        examples: ['modal', 'card', 'form'],
      },
      organism: {
        suffix: '.organism.tsx',
        componentSuffix: 'Organism',
        namePattern: 'dash-case',
        examples: ['header', 'sidebar', 'navigation'],
      },
      feature: {
        suffix: '.feature.tsx',
        componentSuffix: 'Feature',
        namePattern: 'prefix-name',
        examples: ['wallet-deposit', 'user-profile'],
        requiresPrefix: true,
      },
    };

    return conventions[layerType] || {};
  }
}