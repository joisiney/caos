import { AIProvider } from './ai-provider.interface';
import { AnalysisContext, LayerAnalysis, GeneratedCode, ValidationRules, ValidationSuggestions, Template, ProviderConfig, UsageStats, CodeIssue, RefactoringSuggestions } from '../types';
/**
 * OpenRouter provider implementation for AI-powered code analysis and generation
 * Provides access to multiple AI models through a unified API
 */
export declare class OpenRouterProvider implements AIProvider {
    readonly name = "openrouter";
    readonly version = "1.0.0";
    private client;
    private config;
    private usage;
    /**
     * Configure the OpenRouter provider
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
     * Analyze description to determine appropriate layer with fallback support
     */
    analyzeDescription(description: string, context?: AnalysisContext): Promise<LayerAnalysis>;
    /**
     * Generate code based on analysis and template with fallback support
     */
    generateCode(analysis: LayerAnalysis, template: Template): Promise<GeneratedCode>;
    /**
     * Validate code and provide suggestions with fallback support
     */
    validateCode(code: string, rules: ValidationRules): Promise<ValidationSuggestions>;
    /**
     * Suggest refactoring improvements with fallback support
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
     * Analyze description with specific model
     */
    private analyzeWithModel;
    /**
     * Generate code with specific model
     */
    private generateWithModel;
    /**
     * Validate code with specific model
     */
    private validateWithModel;
    /**
     * Suggest refactoring with specific model
     */
    private refactorWithModel;
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
     * Parse analysis response
     */
    private parseAnalysisResponse;
    /**
     * Parse generation response
     */
    private parseGenerationResponse;
    /**
     * Parse validation response
     */
    private parseValidationResponse;
    /**
     * Parse refactoring response
     */
    private parseRefactoringResponse;
    /**
     * Update usage statistics
     */
    private updateUsage;
}
//# sourceMappingURL=openrouter-provider.d.ts.map