import {
  LayerAnalysis,
  TemplateContext,
  VariableExtractionResult,
  ImportDefinition,
  ValidationIssue,
} from '../types';

/**
 * Variable Extractor for Khaos CLI
 * 
 * Extracts variables from analysis and context to create template variables
 */
export class VariableExtractor {
  /**
   * Extract template context from layer analysis
   */
  async extractContext(
    analysis: LayerAnalysis,
    options: {
      targetDirectory?: string;
      prefix?: string;
      features?: string[];
    } = {}
  ): Promise<VariableExtractionResult> {
    try {
      const context = await this.buildTemplateContext(analysis, options);
      const filesToGenerate = this.determineFilesToGenerate(context);
      const validation = this.validateContext(context);

      return {
        context,
        filesToGenerate,
        validation,
      };
    } catch (error) {
      throw new Error(`Variable extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build template context from analysis
   */
  private async buildTemplateContext(
    analysis: LayerAnalysis,
    options: {
      targetDirectory?: string;
      prefix?: string;
      features?: string[];
    }
  ): Promise<TemplateContext> {
    const rawName = analysis.componentName;
    const layer = analysis.layerType || 'atom';
    
    // Apply prefix if required
    const nameWithPrefix = this.applyPrefix(rawName || 'component', layer, options.prefix);
    
    // Generate name variations
    const names = this.generateNameVariations(nameWithPrefix);
    
    // Generate namespace
    const namespace = this.generateNamespace(names.pascalName, layer);
    
    // Extract features
    const features = this.extractFeatures(analysis, options.features);
    
    // Generate imports
    const imports = await this.generateImports(analysis, layer);
    
    // Build context
    const context: TemplateContext = {
      name: nameWithPrefix,
      kebabName: names.kebabName,
      pascalName: names.pascalName,
      camelName: names.camelName,
      namespace,
      description: this.sanitizeDescription(analysis.reasoning || `A ${layer} component`),
      layer,
      props: analysis.props || [],
      methods: analysis.methods || [],
      features,
      dependencies: analysis.dependencies || [],
      imports,
      metadata: {
        ...analysis.metadata,
        originalName: rawName,
        confidence: analysis.confidence,
        targetDirectory: options.targetDirectory,
      },
    };

    return context;
  }

  /**
   * Apply prefix based on layer requirements
   */
  private applyPrefix(name: string, layer: string, customPrefix?: string): string {
    const prefixRequiredLayers = ['feature', 'layout'];
    
    if (!prefixRequiredLayers.includes(layer)) {
      return name;
    }

    if (customPrefix) {
      return `${customPrefix}-${name}`;
    }

    // Extract potential prefix from existing name
    const parts = name.split('-');
    if (parts.length > 1 && this.isValidPrefix(parts[0])) {
      return name; // Already has prefix
    }

    // Default prefixes for layers
    const defaultPrefixes: Record<string, string> = {
      feature: 'app',
      layout: 'app',
    };

    const defaultPrefix = defaultPrefixes[layer];
    return defaultPrefix ? `${defaultPrefix}-${name}` : name;
  }

  /**
   * Check if a string is a valid prefix
   */
  private isValidPrefix(prefix: string): boolean {
    const validPrefixes = [
      'app', 'web', 'auth', 'profile', 'settings', 'market', 'trade',
      'wallet', 'dashboard', 'admin', 'user', 'api', 'common'
    ];
    return validPrefixes.includes(prefix);
  }

  /**
   * Generate name variations
   */
  private generateNameVariations(name: string): {
    kebabName: string;
    pascalName: string;
    camelName: string;
  } {
    const kebabName = this.toKebabCase(name);
    const pascalName = this.toPascalCase(name);
    const camelName = this.toCamelCase(name);

    return { kebabName, pascalName, camelName };
  }

  /**
   * Generate namespace for component
   */
  private generateNamespace(pascalName: string, layer: string): string {
    const layerSuffixes: Record<string, string> = {
      atom: 'Atom',
      molecule: 'Molecule',
      organism: 'Organism',
      template: 'Template',
      feature: 'Feature',
      layout: 'Layout',
      particle: 'Particle',
    };

    const suffix = layerSuffixes[layer] || '';
    return `${pascalName}${suffix}`;
  }

  /**
   * Extract features from analysis
   */
  private extractFeatures(analysis: LayerAnalysis, additionalFeatures?: string[]): string[] {
    const features = new Set<string>();
    
    // Extract from metadata
    if (analysis.metadata['requiredFeatures']) {
      analysis.metadata['requiredFeatures'].forEach((f: string) => features.add(f));
    }
    
    if (analysis.metadata['optionalFeatures']) {
      analysis.metadata['optionalFeatures'].forEach((f: string) => features.add(f));
    }

    // Add additional features
    if (additionalFeatures) {
      additionalFeatures.forEach(f => features.add(f));
    }

    // Infer features from props and methods
    if (analysis.props?.some(p => p.name.includes('variant'))) {
      features.add('variants');
    }

    if (analysis.props?.some(p => p.name.includes('onClick') || p.name.includes('onPress'))) {
      features.add('clickable');
    }

    if (analysis.methods?.some(m => m.name.includes('validate'))) {
      features.add('validation');
    }

    return Array.from(features);
  }

  /**
   * Generate imports based on analysis and layer
   */
  private async generateImports(analysis: LayerAnalysis, layer: string): Promise<ImportDefinition[]> {
    const imports: ImportDefinition[] = [];

    // React import (for React components)
    if (this.isReactComponent(layer)) {
      imports.push({
        what: 'React',
        from: 'react',
        type: 'default',
      });

      // Props interface import
      const propsImport = this.generatePropsImport(analysis.componentName, layer);
      if (propsImport) {
        imports.push(propsImport);
      }
    }

    // CVA import for variants
    if (this.hasVariants(analysis)) {
      imports.push({
        what: 'cva',
        from: 'class-variance-authority',
        type: 'named',
      });
    }

    // Utility imports
    if (this.needsUtilityImports(analysis)) {
      imports.push({
        what: 'cn',
        from: '@/lib/utils',
        type: 'named',
      });
    }

    // Layer-specific imports
    const layerImports = this.generateLayerSpecificImports(layer, analysis);
    imports.push(...layerImports);

    return imports;
  }

  /**
   * Check if layer generates React components
   */
  private isReactComponent(layer: string): boolean {
    const reactLayers = ['atom', 'molecule', 'organism', 'template', 'feature', 'layout'];
    return reactLayers.includes(layer);
  }

  /**
   * Generate props interface import
   */
  private generatePropsImport(componentName: string, layer: string): ImportDefinition | null {
    if (!this.isReactComponent(layer)) {
      return null;
    }

    const kebabName = this.toKebabCase(componentName);
    const namespace = this.generateNamespace(this.toPascalCase(componentName), layer);

    return {
      what: `${namespace}Props`,
      from: `./${kebabName}.type`,
      type: 'named',
      isType: true,
    };
  }

  /**
   * Check if component has variants
   */
  private hasVariants(analysis: LayerAnalysis): boolean {
    return analysis.props?.some(p => p.name.includes('variant')) || 
           analysis.metadata['features']?.includes('variants');
  }

  /**
   * Check if component needs utility imports
   */
  private needsUtilityImports(analysis: LayerAnalysis): boolean {
    return analysis.metadata['features']?.includes('styled') || 
           this.hasVariants(analysis);
  }

  /**
   * Generate layer-specific imports
   */
  private generateLayerSpecificImports(layer: string, analysis: LayerAnalysis): ImportDefinition[] {
    const imports: ImportDefinition[] = [];

    switch (layer) {
      case 'molecule':
      case 'organism':
        // Import atoms/molecules if needed
        if (analysis.dependencies?.length) {
          analysis.dependencies.forEach(dep => {
            imports.push({
              what: this.toPascalCase(dep),
              from: `@/components/atoms/${this.toKebabCase(dep)}`,
              type: 'named',
            });
          });
        }
        break;

      case 'feature':
        // Import use-case
        const kebabName = this.toKebabCase(analysis.componentName);
        imports.push({
          what: `use${this.toPascalCase(analysis.componentName)}`,
          from: `./${kebabName}.use-case`,
          type: 'named',
        });
        break;

      case 'particle':
        // Context-related imports
        if (analysis.metadata['features']?.includes('context')) {
          imports.push({
            what: 'createContext, useContext',
            from: 'react',
            type: 'named',
          });
        }
        break;
    }

    return imports;
  }

  /**
   * Determine which files should be generated
   */
  private determineFilesToGenerate(context: TemplateContext): string[] {
    const files: string[] = [];
    const { layer, features } = context;

    // Base files for each layer
    const baseFiles = this.getBaseFilesForLayer(layer);
    files.push(...baseFiles);

    // Feature-specific files
    if (features.includes('variants')) {
      files.push(`${context.kebabName}.variant.ts`);
    }

    if (features.includes('constants')) {
      files.push(`${context.kebabName}.constant.ts`);
    }

    if (features.includes('mock')) {
      files.push(`${context.kebabName}.mock.ts`);
    }

    if (features.includes('stories')) {
      files.push(`${context.kebabName}.stories.tsx`);
    }

    if (features.includes('tests')) {
      files.push(`${context.kebabName}.spec.ts`);
    }

    // Layer-specific conditional files
    if (layer === 'molecule' || layer === 'organism' || layer === 'feature') {
      files.push(`${context.kebabName}.use-case.ts`);
    }

    return files;
  }

  /**
   * Get base files for each layer
   */
  private getBaseFilesForLayer(layer: string): string[] {
    const baseFiles: Record<string, string[]> = {
      atom: ['component.tsx', 'type.ts', 'index.ts'],
      molecule: ['component.tsx', 'type.ts', 'index.ts'],
      organism: ['component.tsx', 'type.ts', 'index.ts'],
      template: ['component.tsx', 'type.ts', 'index.ts'],
      feature: ['component.tsx', 'type.ts', 'index.ts'],
      layout: ['component.tsx', 'type.ts', 'index.ts'],
      particle: ['index.ts', 'type.ts'],
      model: ['index.ts', 'type.ts'],
      entity: ['index.ts'],
      util: ['index.ts', 'type.ts'],
      gateway: ['index.ts', 'type.ts'],
      repository: ['index.ts', 'type.ts'],
    };

    return baseFiles[layer] || ['index.ts'];
  }

  /**
   * Validate the generated context
   */
  private validateContext(context: TemplateContext): {
    isValid: boolean;
    issues: ValidationIssue[];
  } {
    const issues: ValidationIssue[] = [];

    // Validate name
    if (!context.name || context.name.trim().length === 0) {
      issues.push({
        type: 'error',
        message: 'Component name cannot be empty',
        suggestion: 'Provide a valid component name',
      });
    }

    // Validate kebab case
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(context.kebabName)) {
      issues.push({
        type: 'error',
        message: 'Invalid kebab-case name format',
        suggestion: 'Use lowercase letters, numbers, and hyphens only',
      });
    }

    // Validate prefix for required layers
    if (context.layer === 'feature' || context.layer === 'layout') {
      if (!context.kebabName.includes('-')) {
        issues.push({
          type: 'error',
          message: `${context.layer} components require a prefix`,
          suggestion: 'Add a prefix like "app-" or "web-"',
        });
      }
    }

    // Validate props
    context.props.forEach((prop, index) => {
      if (!prop.name || !prop.type) {
        issues.push({
          type: 'error',
          message: `Invalid prop at index ${index}`,
          suggestion: 'Ensure all props have name and type',
        });
      }
    });

    return {
      isValid: issues.filter(i => i.type === 'error').length === 0,
      issues,
    };
  }

  /**
   * Sanitize description text
   */
  private sanitizeDescription(description: string): string {
    return description
      .replace(/[^\w\s\-.,!?()]/g, '')
      .trim()
      .replace(/\s+/g, ' ');
  }

  /**
   * String transformation utilities
   */
  private toPascalCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
      .replace(/^(.)/, char => char.toUpperCase());
  }

  private toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }
}

/**
 * Default variable extractor instance
 */
export const variableExtractor = new VariableExtractor(); 