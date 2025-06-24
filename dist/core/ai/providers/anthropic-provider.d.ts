import { AIProvider } from './ai-provider.interface';
import { AnalysisContext, LayerAnalysis, GeneratedCode, ValidationRules, ValidationSuggestions, Template, ProviderConfig, UsageStats, CodeIssue, RefactoringSuggestions } from '../types';
/**
 * Anthropic provider implementation for AI-powered code analysis and generation
 */
export declare class AnthropicProvider implements AIProvider {
    readonly name = "anthropic";
    readonly version = "1.0.0";
    private client;
    private config;
    private usage;
    /**
     * Configure the Anthropic provider
     */
    configure(config: ProviderConfig): void;
    /**
     * Check if the provider is configured
     */
    isConfigured(): boolean;
    /**
     * Test the provider connection
     */
    test(): Promise<void>;
    /**
     * Analyze description to determine appropriate layer
     */
    analyzeDescription(description: string, context?: AnalysisContext): Promise<LayerAnalysis>;
    /**
     * Generate code based on analysis and template
     */
    generateCode(analysis: LayerAnalysis, template: Template): Promise<GeneratedCode>;
    /**
     * Validate code and provide suggestions
     */
    validateCode(code: string, rules: ValidationRules): Promise<ValidationSuggestions>;
    /**
     * Suggest refactoring improvements
     */
    suggestRefactoring(code: string, issues: CodeIssue[]): Promise<RefactoringSuggestions>;
    /**
     * Get usage statistics
     */
    getUsage(): UsageStats;
    /**
     * Reset usage statistics
     */
    resetUsage(): void;
    /**
     * Build analysis prompt for layer classification
     */
    private buildAnalysisPrompt;
    /**
     * Build generation prompt for code creation
     */
    private buildGenerationPrompt;
    /**
     * Build validation prompt for code analysis
     */
    private buildValidationPrompt;
    /**
     * Build refactoring prompt
     */
    private buildRefactoringPrompt;
    /**
     * Get Khaos architecture system prompt
     */
    private getKhaosArchitectureSystemPrompt;
    /**
     * Get code generation system prompt
     */
    private getKhaosCodeGenerationSystemPrompt;
    /**
     * Get validation system prompt
     */
    private getKhaosValidationSystemPrompt;
    /**
     * Get refactoring system prompt
     */
    private getKhaosRefactoringSystemPrompt;
    /**
     * Parse analysis response from Anthropic
     */
    private parseAnalysisResponse;
    /**
     * Parse generation response from Anthropic
     */
    private parseGenerationResponse;
    /**
     * Parse validation response from Anthropic
     */
    private parseValidationResponse;
    /**
     * Parse refactoring response from Anthropic
     */
    private parseRefactoringResponse;
    /**
     * Update usage statistics
     */
    private updateUsage;
}
//# sourceMappingURL=anthropic-provider.d.ts.map