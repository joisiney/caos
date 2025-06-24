"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DependencyAnalyzer = void 0;
/**
 * Analyzes dependencies and suggests imports and file structure
 */
class DependencyAnalyzer {
    layerHierarchy = {
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
    layerImports = {
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
    async analyzeDependencies(description, layer, features = [], context) {
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
    analyzeRequiredDependencies(description, layer, features) {
        const dependencies = [];
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
    analyzeOptionalDependencies(description, layer, features) {
        const dependencies = [];
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
    generateImportSuggestions(layer, required, optional) {
        const imports = [];
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
    getDependencyImports(dependency, targetLayer) {
        const imports = [];
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
    generateFileStructure(layer, features) {
        const files = [];
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
    validateHierarchy(layer, dependencies) {
        const allowedDependencies = this.layerHierarchy[layer] || [];
        const violations = [];
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
    detectViolations(layer, required, optional, hierarchy) {
        const violations = [];
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
    hasCircularDependency(layer, dependencies) {
        // This is a simplified check - in a real implementation,
        // you'd want to do a proper graph traversal
        return dependencies.includes(layer);
    }
    /**
     * Remove duplicate imports
     */
    deduplicateImports(imports) {
        const seen = new Set();
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
    containsUIElements(description) {
        const uiKeywords = ['botão', 'button', 'input', 'ícone', 'icon', 'texto', 'text'];
        return uiKeywords.some(keyword => description.includes(keyword));
    }
    containsComplexUI(description) {
        const complexKeywords = ['modal', 'formulário', 'form', 'lista', 'list', 'navegação', 'navigation'];
        return complexKeywords.some(keyword => description.includes(keyword));
    }
    containsBusinessLogic(description) {
        const businessKeywords = ['validação', 'validation', 'regra', 'rule', 'lógica', 'logic', 'processo', 'process'];
        return businessKeywords.some(keyword => description.includes(keyword));
    }
    containsAPICall(description) {
        const apiKeywords = ['api', 'buscar', 'fetch', 'carregar', 'load', 'salvar', 'save', 'dados', 'data'];
        return apiKeywords.some(keyword => description.includes(keyword));
    }
    containsDataTransformation(description) {
        const transformKeywords = ['transformar', 'transform', 'converter', 'convert', 'mapear', 'map', 'processar', 'process'];
        return transformKeywords.some(keyword => description.includes(keyword));
    }
    containsFormatting(description) {
        const formatKeywords = ['formatar', 'format', 'formatação', 'formatting', 'máscara', 'mask'];
        return formatKeywords.some(keyword => description.includes(keyword));
    }
    containsSharedState(description) {
        const stateKeywords = ['compartilhado', 'shared', 'global', 'contexto', 'context', 'estado', 'state'];
        return stateKeywords.some(keyword => description.includes(keyword));
    }
    containsValidation(description) {
        const validationKeywords = ['validação', 'validation', 'validar', 'validate', 'verificar', 'verify'];
        return validationKeywords.some(keyword => description.includes(keyword));
    }
    containsSharedServices(description) {
        const serviceKeywords = ['serviço', 'service', 'compartilhado', 'shared', 'reutilizável', 'reusable'];
        return serviceKeywords.some(keyword => description.includes(keyword));
    }
    normalizeText(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^\w\s]/g, ' ') // Replace special chars with spaces
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();
    }
}
exports.DependencyAnalyzer = DependencyAnalyzer;
//# sourceMappingURL=dependency-analyzer.js.map