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
export declare class DependencyAnalyzer {
    private readonly layerHierarchy;
    private readonly layerImports;
    /**
     * Analyze dependencies for a component
     * @param description - Component description
     * @param layer - Target layer
     * @param features - Component features
     * @param context - Additional context
     * @returns Dependency analysis result
     */
    analyzeDependencies(description: string, layer: LayerType, features?: string[], context?: Record<string, any>): Promise<DependencyAnalysis>;
    /**
     * Analyze required dependencies based on description and layer
     */
    private analyzeRequiredDependencies;
    /**
     * Analyze optional dependencies
     */
    private analyzeOptionalDependencies;
    /**
     * Generate import suggestions based on dependencies
     */
    private generateImportSuggestions;
    /**
     * Get imports for a specific dependency
     */
    private getDependencyImports;
    /**
     * Generate file structure suggestions
     */
    private generateFileStructure;
    /**
     * Validate dependency hierarchy
     */
    private validateHierarchy;
    /**
     * Detect dependency violations
     */
    private detectViolations;
    /**
     * Check for circular dependencies (simplified)
     */
    private hasCircularDependency;
    /**
     * Remove duplicate imports
     */
    private deduplicateImports;
    private containsUIElements;
    private containsComplexUI;
    private containsBusinessLogic;
    private containsAPICall;
    private containsDataTransformation;
    private containsFormatting;
    private containsSharedState;
    private containsValidation;
    private containsSharedServices;
    private normalizeText;
}
//# sourceMappingURL=dependency-analyzer.d.ts.map