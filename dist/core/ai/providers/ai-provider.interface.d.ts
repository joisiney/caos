import { AnalysisContext, LayerAnalysis, GeneratedCode, ValidationRules, ValidationSuggestions, Template, ProviderConfig, UsageStats, CodeIssue, RefactoringSuggestions } from '../types';
/**
 * Common interface for all AI providers
 * Provides standardized methods for analysis, generation, and validation
 */
export interface AIProvider {
    /** Provider name */
    readonly name: string;
    /** Provider version */
    readonly version: string;
    /**
     * Analyze a description in natural language to determine the appropriate layer
     * @param description - Natural language description of the component
     * @param context - Optional analysis context
     * @returns Promise with layer analysis result
     */
    analyzeDescription(description: string, context?: AnalysisContext): Promise<LayerAnalysis>;
    /**
     * Generate code based on analysis and template
     * @param analysis - Layer analysis result
     * @param template - Template to use for generation
     * @returns Promise with generated code
     */
    generateCode(analysis: LayerAnalysis, template: Template): Promise<GeneratedCode>;
    /**
     * Validate code against rules and suggest improvements
     * @param code - Code to validate
     * @param rules - Validation rules to apply
     * @returns Promise with validation suggestions
     */
    validateCode(code: string, rules: ValidationRules): Promise<ValidationSuggestions>;
    /**
     * Suggest refactoring improvements for existing code
     * @param code - Code to analyze for refactoring
     * @param issues - Known code issues
     * @returns Promise with refactoring suggestions
     */
    suggestRefactoring(code: string, issues: CodeIssue[]): Promise<RefactoringSuggestions>;
    /**
     * Configure the provider with settings
     * @param config - Provider configuration
     */
    configure(config: ProviderConfig): void;
    /**
     * Check if the provider is properly configured
     * @returns True if configured, false otherwise
     */
    isConfigured(): boolean;
    /**
     * Get usage statistics for the provider
     * @returns Current usage statistics
     */
    getUsage(): UsageStats;
    /**
     * Reset usage statistics
     */
    resetUsage(): void;
    /**
     * Test the provider connection and configuration
     * @returns Promise that resolves if test is successful
     */
    test(): Promise<void>;
}
//# sourceMappingURL=ai-provider.interface.d.ts.map