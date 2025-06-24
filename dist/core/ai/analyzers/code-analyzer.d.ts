import { AIProvider } from '../providers/ai-provider.interface';
import { LayerType } from './layer-classifier';
/**
 * Code analysis types
 */
export interface CodeAnalysisResult {
    isValid: boolean;
    score: number;
    issues: CodeIssue[];
    suggestions: CodeSuggestion[];
    metrics: CodeMetrics;
    violations: ArchitecturalViolation[];
}
export interface CodeIssue {
    type: 'error' | 'warning' | 'suggestion' | 'smell';
    category: 'syntax' | 'architecture' | 'convention' | 'performance' | 'maintainability';
    message: string;
    line?: number;
    column?: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    suggestion?: string;
    rule?: string;
}
export interface CodeSuggestion {
    type: 'refactor' | 'optimize' | 'convention' | 'architecture';
    description: string;
    impact: 'low' | 'medium' | 'high';
    effort: 'low' | 'medium' | 'high';
    code?: {
        original: string;
        suggested: string;
    };
}
export interface CodeMetrics {
    complexity: number;
    maintainability: number;
    readability: number;
    testability: number;
    reusability: number;
    lines: number;
    functions: number;
    dependencies: number;
}
export interface ArchitecturalViolation {
    rule: string;
    description: string;
    severity: 'error' | 'warning';
    location?: {
        line: number;
        column: number;
    };
    suggestion: string;
}
/**
 * Analyzes existing code for architectural violations and improvements
 */
export declare class CodeAnalyzer {
    private aiProvider?;
    constructor(aiProvider?: AIProvider | undefined);
    /**
     * Analyze code for violations and improvements
     * @param code - Code to analyze
     * @param layer - Target layer type
     * @param context - Additional context
     * @returns Code analysis result
     */
    analyzeCode(code: string, layer: LayerType, context?: Record<string, any>): Promise<CodeAnalysisResult>;
    /**
     * Detect architectural violations
     * @param code - Code to analyze
     * @param layer - Target layer type
     * @returns List of violations
     */
    detectViolations(code: string, layer: LayerType): Promise<ArchitecturalViolation[]>;
    /**
     * Suggest improvements for existing code
     * @param code - Code to improve
     * @param layer - Target layer type
     * @returns List of suggestions
     */
    suggestImprovements(code: string, layer: LayerType): Promise<CodeSuggestion[]>;
    /**
     * Perform static code analysis
     */
    private performStaticAnalysis;
    /**
     * Perform AI-powered analysis
     */
    private performAIAnalysis;
    /**
     * Combine static and AI analysis results
     */
    private combineAnalysisResults;
    /**
     * Check layer-specific violations
     */
    private checkLayerSpecificViolations;
    /**
     * Check atom-specific violations
     */
    private checkAtomViolations;
    /**
     * Check molecule-specific violations
     */
    private checkMoleculeViolations;
    /**
     * Check organism-specific violations
     */
    private checkOrganismViolations;
    /**
     * Check feature-specific violations
     */
    private checkFeatureViolations;
    /**
     * Check template-specific violations
     */
    private checkTemplateViolations;
    /**
     * Check util-specific violations
     */
    private checkUtilViolations;
    /**
     * Check general violations
     */
    private checkGeneralViolations;
    /**
     * Check naming convention violations
     */
    private checkNamingViolations;
    /**
     * Check import/export violations
     */
    private checkImportExportViolations;
    /**
     * Calculate code metrics
     */
    private calculateMetrics;
    /**
     * Calculate overall score
     */
    private calculateScore;
    private countStateVariables;
    private rendersAtomsMoleculesDirectly;
    private hasModulePrefix;
    private hasBusinessLogic;
    private hasReactDependencies;
    private getExpectedComponentSuffix;
    private extractImports;
    private isValidImport;
    private calculateComplexity;
    private calculateMaintainability;
    private calculateReadability;
    private calculateTestability;
    private calculateReusability;
    private checkBasicIssues;
    private buildAnalysisPrompt;
    private convertValidationIssueToCodeIssue;
    private extractSuggestionsFromAI;
    private suggestPerformanceImprovements;
    private suggestMaintainabilityImprovements;
    private suggestConventionImprovements;
    private suggestArchitectureImprovements;
    private deduplicateIssues;
    private deduplicateSuggestions;
    private getDefaultMetrics;
}
//# sourceMappingURL=code-analyzer.d.ts.map