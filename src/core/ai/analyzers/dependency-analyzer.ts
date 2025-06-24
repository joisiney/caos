import { LayerType } from './layer-classifier';

/**
 * Dependency analysis types
 */
export interface DependencyAnalysis {
  required: string[];
  optional: string[];
  imports: ImportSuggestion[];
  structure: FileSuggestion[];
  violations: DependencyViolation[];
  hierarchy: HierarchyValidation;
}

export interface ImportSuggestion {
  module: string;
  imports: string[];
  from: string;
  type: 'default' | 'named' | 'namespace';
  required: boolean;
}

export interface FileSuggestion {
  filename: string;
  purpose: string;
  required: boolean;
  template?: string;
}

export interface DependencyViolation {
  type: 'circular' | 'invalid-layer' | 'missing-dependency';
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

export interface HierarchyValidation {
  isValid: boolean;
  violations: string[];
  allowedDependencies: string[];
}

/**
 * Analyzes dependencies and suggests imports and file structure
 */
export class DependencyAnalyzer {
  private readonly layerHierarchy: Record<LayerType, string[]> = {
    // Each layer can depend on layers listed in its array
    atom: [],
    molecule: ['atom'],
    organism: ['molecule', 'atom'],
    template: ['organism', 'molecule', 'atom', 'util'],
    feature: ['template', 'organism', 'molecule', 'atom', 'util', 'model', 'entity', 'gateway', 'repository'],
    layout: ['feature'],
    particle: ['util'],
    model: ['entity'],
    entity: [],
    util: [],
    gateway: ['entity'],
    repository: ['gateway', 'model', 'entity'],
  };

  private readonly layerImports: Record<LayerType, ImportSuggestion[]> = {
    atom: [
      { module: 'React', imports: ['FC'], from: 'react', type: 'named', required: true },
      { module: 'TWithTestID', imports: ['TWithTestID'], from: '@types/global', type: 'named', required: true },
    ],
    molecule: [
      { module: 'React', imports: ['FC'], from: 'react', type: 'named', required: true },
      { module: 'TWithTestID', imports: ['TWithTestID'], from: '@types/global', type: 'named', required: true },
    ],
    organism: [
      { module: 'React', imports: ['FC'], from: 'react', type: 'named', required: true },
      { module: 'TWithTestID', imports: ['TWithTestID'], from: '@types/global', type: 'named', required: true },
    ],
    template: [
      { module: 'React', imports: ['FC'], from: 'react', type: 'named', required: true },
      { module: 'TWithTestID', imports: ['TWithTestID'], from: '@types/global', type: 'named', required: true },
    ],
    feature: [
      { module: 'React', imports: ['FC'], from: 'react', type: 'named', required: true },
      { module: 'TWithTestID', imports: ['TWithTestID'], from: '@types/global', type: 'named', required: true },
    ],
    layout: [
      { module: 'React', imports: ['FC'], from: 'react', type: 'named', required: true },
    ],
    particle: [
      { module: 'React', imports: ['FC'], from: 'react', type: 'named', required: true },
    ],
    model: [],
    entity: [],
    util: [],
    gateway: [],
    repository: [
      { module: 'React', imports: ['useCallback', 'useMemo'], from: 'react', type: 'named', required: true },
    ],
  };

  /**
   * Analyze dependencies for a component
   * @param description - Component description
   * @param layer - Target layer
   * @param features - Component features
   * @param context - Additional context
   * @returns Dependency analysis result
   */
  async analyzeDependencies(
    description: string,
    layer: LayerType,
    features: string[] = [],
    context?: Record<string, any>
  ): Promise<DependencyAnalysis> {
    // Analyze required dependencies
    const required = this.analyzeRequiredDependencies(description, layer, features);
    
    // Analyze optional dependencies
    const optional = this.analyzeOptionalDependencies(description, layer, features);
    
    // Generate import suggestions
    const imports = this.generateImportSuggestions(layer, required, optional);
    
    // Generate file structure suggestions
    const structure = this.generateFileStructure(layer, features);
    
    // Validate hierarchy
    const hierarchy = this.validateHierarchy(layer, [...required, ...optional]);
    
    // Check for violations
    const violations = this.detectViolations(layer, required, optional, hierarchy);

    return {
      required,
      optional,
      imports,
      structure,
      violations,
      hierarchy,
    };
  }

  /**
   * Analyze required dependencies based on description and layer
   */
  private analyzeRequiredDependencies(
    description: string,
    layer: LayerType,
    features: string[]
  ): string[] {
    const dependencies: string[] = [];
    const normalizedDesc = this.normalizeText(description);

    // Layer-specific required dependencies
    switch (layer) {
      case 'molecule':
        // Molecules must use atoms
        if (this.containsUIElements(normalizedDesc)) {
          dependencies.push('atom');
        }
        break;

      case 'organism':
        // Organisms typically use molecules and atoms
        if (this.containsComplexUI(normalizedDesc)) {
          dependencies.push('molecule', 'atom');
        }
        break;

      case 'template':
        // Templates orchestrate organisms
        dependencies.push('organism', 'molecule', 'atom');
        break;

      case 'feature':
        // Features use templates and business logic
        dependencies.push('template');
        if (this.containsBusinessLogic(normalizedDesc)) {
          dependencies.push('model', 'repository');
        }
        if (this.containsAPICall(normalizedDesc)) {
          dependencies.push('gateway', 'entity');
        }
        break;

      case 'repository':
        // Repositories orchestrate gateways
        dependencies.push('gateway');
        if (this.containsDataTransformation(normalizedDesc)) {
          dependencies.push('model');
        }
        dependencies.push('entity');
        break;

      case 'gateway':
        // Gateways work with entities
        dependencies.push('entity');
        break;

      case 'model':
        // Models work with entities
        dependencies.push('entity');
        break;
    }

    // Feature-based dependencies
    if (features.includes('validation')) {
      dependencies.push('util');
    }
    if (features.includes('formatting')) {
      dependencies.push('util');
    }
    if (features.includes('state-management')) {
      dependencies.push('particle');
    }

    return [...new Set(dependencies)];
  }

  /**
   * Analyze optional dependencies
   */
  private analyzeOptionalDependencies(
    description: string,
    layer: LayerType,
    features: string[]
  ): string[] {
    const dependencies: string[] = [];
    const normalizedDesc = this.normalizeText(description);

    // Optional utilities
    if (this.containsFormatting(normalizedDesc)) {
      dependencies.push('util');
    }

    // Optional particles for shared state
    if (this.containsSharedState(normalizedDesc)) {
      dependencies.push('particle');
    }

    // Layer-specific optional dependencies
    switch (layer) {
      case 'organism':
        if (this.containsValidation(normalizedDesc)) {
          dependencies.push('util');
        }
        break;

      case 'feature':
        if (this.containsSharedServices(normalizedDesc)) {
          dependencies.push('particle');
        }
        break;
    }

    return [...new Set(dependencies)];
  }

  /**
   * Generate import suggestions based on dependencies
   */
  private generateImportSuggestions(
    layer: LayerType,
    required: string[],
    optional: string[]
  ): ImportSuggestion[] {
    const imports: ImportSuggestion[] = [];

    // Add base layer imports
    const baseImports = this.layerImports[layer] || [];
    imports.push(...baseImports);

    // Add dependency-based imports
    const allDeps = [...required, ...optional];
    
    for (const dep of allDeps) {
      const depImports = this.getDependencyImports(dep, layer);
      imports.push(...depImports);
    }

    // Remove duplicates
    return this.deduplicateImports(imports);
  }

  /**
   * Get imports for a specific dependency
   */
  private getDependencyImports(dependency: string, targetLayer: LayerType): ImportSuggestion[] {
    const imports: ImportSuggestion[] = [];

    switch (dependency) {
      case 'atom':
        imports.push({
          module: 'ButtonAtom',
          imports: ['ButtonAtom'],
          from: 'atoms/button',
          type: 'named',
          required: false,
        });
        break;

      case 'molecule':
        imports.push({
          module: 'ModalMolecule',
          imports: ['ModalMolecule'],
          from: 'molecules/modal',
          type: 'named',
          required: false,
        });
        break;

      case 'util':
        imports.push({
          module: 'formatDateUtil',
          imports: ['formatDateUtil'],
          from: 'utils/format-date',
          type: 'named',
          required: false,
        });
        break;

      case 'entity':
        imports.push({
          module: 'TUserEntity',
          imports: ['TUserEntity'],
          from: 'entities/user',
          type: 'named',
          required: false,
        });
        break;

      case 'gateway':
        imports.push({
          module: 'findOneUserGateway',
          imports: ['findOneUserGateway'],
          from: 'gateways/find-one-user',
          type: 'named',
          required: false,
        });
        break;

      case 'repository':
        imports.push({
          module: 'useUserRepository',
          imports: ['useUserRepository'],
          from: 'repositories/user',
          type: 'named',
          required: false,
        });
        break;
    }

    return imports;
  }

  /**
   * Generate file structure suggestions
   */
  private generateFileStructure(layer: LayerType, features: string[]): FileSuggestion[] {
    const files: FileSuggestion[] = [];
    const baseName = 'component'; // This would be replaced with actual name

    // Core files for all layers
    files.push({
      filename: `${baseName}.${layer}.tsx`,
      purpose: 'Main component file',
      required: true,
    });

    files.push({
      filename: `${baseName}.type.ts`,
      purpose: 'Type definitions',
      required: true,
    });

    files.push({
      filename: 'index.ts',
      purpose: 'Export barrel',
      required: true,
    });

    // Layer-specific files
    switch (layer) {
      case 'atom':
        files.push({
          filename: `${baseName}.stories.tsx`,
          purpose: 'Storybook stories',
          required: false,
        });
        files.push({
          filename: `${baseName}.spec.ts`,
          purpose: 'Unit tests',
          required: false,
        });
        break;

      case 'molecule':
      case 'organism':
      case 'feature':
        files.push({
          filename: `${baseName}.use-case.ts`,
          purpose: 'Business logic hook',
          required: true,
        });
        files.push({
          filename: `${baseName}.stories.tsx`,
          purpose: 'Storybook stories',
          required: false,
        });
        files.push({
          filename: `${baseName}.spec.ts`,
          purpose: 'Unit tests',
          required: false,
        });
        break;

      case 'organism':
        if (features.includes('validation')) {
          files.push({
            filename: `${baseName}.scheme.ts`,
            purpose: 'Validation schema',
            required: false,
          });
        }
        break;

      case 'util':
        files.push({
          filename: `${baseName}.spec.ts`,
          purpose: 'Unit tests',
          required: true,
        });
        break;
    }

    return files;
  }

  /**
   * Validate dependency hierarchy
   */
  private validateHierarchy(layer: LayerType, dependencies: string[]): HierarchyValidation {
    const allowedDependencies = this.layerHierarchy[layer] || [];
    const violations: string[] = [];

    for (const dep of dependencies) {
      if (!allowedDependencies.includes(dep)) {
        violations.push(`Layer '${layer}' cannot depend on '${dep}'`);
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
      allowedDependencies,
    };
  }

  /**
   * Detect dependency violations
   */
  private detectViolations(
    layer: LayerType,
    required: string[],
    optional: string[],
    hierarchy: HierarchyValidation
  ): DependencyViolation[] {
    const violations: DependencyViolation[] = [];

    // Hierarchy violations
    for (const violation of hierarchy.violations) {
      violations.push({
        type: 'invalid-layer',
        message: violation,
        severity: 'error',
        suggestion: `Remove dependency or restructure component`,
      });
    }

    // Missing required dependencies for specific layers
    if (layer === 'molecule' && !required.includes('atom')) {
      violations.push({
        type: 'missing-dependency',
        message: 'Molecules should typically use atoms',
        severity: 'warning',
        suggestion: 'Consider using atomic components',
      });
    }

    if (layer === 'feature' && !required.includes('template')) {
      violations.push({
        type: 'missing-dependency',
        message: 'Features must render templates exclusively',
        severity: 'error',
        suggestion: 'Add template dependency',
      });
    }

    // Circular dependency detection (basic)
    const allDeps = [...required, ...optional];
    if (this.hasCircularDependency(layer, allDeps)) {
      violations.push({
        type: 'circular',
        message: 'Potential circular dependency detected',
        severity: 'error',
        suggestion: 'Restructure dependencies to avoid cycles',
      });
    }

    return violations;
  }

  /**
   * Check for circular dependencies (simplified)
   */
  private hasCircularDependency(layer: LayerType, dependencies: string[]): boolean {
    // This is a simplified check - in a real implementation,
    // you'd want to do a proper graph traversal
    return dependencies.includes(layer);
  }

  /**
   * Remove duplicate imports
   */
  private deduplicateImports(imports: ImportSuggestion[]): ImportSuggestion[] {
    const seen = new Set<string>();
    return imports.filter(imp => {
      const key = `${imp.from}:${imp.imports.join(',')}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // Helper methods for content analysis
  private containsUIElements(description: string): boolean {
    const uiKeywords = ['botão', 'button', 'input', 'ícone', 'icon', 'texto', 'text'];
    return uiKeywords.some(keyword => description.includes(keyword));
  }

  private containsComplexUI(description: string): boolean {
    const complexKeywords = ['modal', 'formulário', 'form', 'lista', 'list', 'navegação', 'navigation'];
    return complexKeywords.some(keyword => description.includes(keyword));
  }

  private containsBusinessLogic(description: string): boolean {
    const businessKeywords = ['validação', 'validation', 'regra', 'rule', 'lógica', 'logic', 'processo', 'process'];
    return businessKeywords.some(keyword => description.includes(keyword));
  }

  private containsAPICall(description: string): boolean {
    const apiKeywords = ['api', 'buscar', 'fetch', 'carregar', 'load', 'salvar', 'save', 'dados', 'data'];
    return apiKeywords.some(keyword => description.includes(keyword));
  }

  private containsDataTransformation(description: string): boolean {
    const transformKeywords = ['transformar', 'transform', 'converter', 'convert', 'mapear', 'map', 'processar', 'process'];
    return transformKeywords.some(keyword => description.includes(keyword));
  }

  private containsFormatting(description: string): boolean {
    const formatKeywords = ['formatar', 'format', 'formatação', 'formatting', 'máscara', 'mask'];
    return formatKeywords.some(keyword => description.includes(keyword));
  }

  private containsSharedState(description: string): boolean {
    const stateKeywords = ['compartilhado', 'shared', 'global', 'contexto', 'context', 'estado', 'state'];
    return stateKeywords.some(keyword => description.includes(keyword));
  }

  private containsValidation(description: string): boolean {
    const validationKeywords = ['validação', 'validation', 'validar', 'validate', 'verificar', 'verify'];
    return validationKeywords.some(keyword => description.includes(keyword));
  }

  private containsSharedServices(description: string): boolean {
    const serviceKeywords = ['serviço', 'service', 'compartilhado', 'shared', 'reutilizável', 'reusable'];
    return serviceKeywords.some(keyword => description.includes(keyword));
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s]/g, ' ') // Replace special chars with spaces
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }
}