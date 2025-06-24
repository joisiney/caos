import { AIProvider } from './ai-provider.interface';
import { ProviderConfig } from '../types';
/**
 * Factory for creating AI provider instances
 */
export declare class ProviderFactory {
    private static providers;
    /**
     * Create or get an AI provider instance
     * @param type - Provider type ('openai', 'anthropic', 'openrouter')
     * @param config - Provider configuration
     * @returns Configured AI provider instance
     */
    static createProvider(type: 'openai' | 'anthropic' | 'openrouter', config: ProviderConfig): AIProvider;
    /**
     * Create provider from environment variables
     * @param type - Provider type
     * @returns Configured AI provider instance
     */
    static createFromEnvironment(type: 'openai' | 'anthropic' | 'openrouter'): AIProvider;
    /**
     * Get default provider based on available environment variables
     * @returns Default AI provider instance
     */
    static getDefaultProvider(): AIProvider;
    /**
     * List available providers based on environment variables
     * @returns Array of available provider types
     */
    static getAvailableProviders(): string[];
    /**
     * Test all available providers
     * @returns Map of provider test results
     */
    static testAllProviders(): Promise<Map<string, boolean>>;
    /**
     * Clear provider cache
     */
    static clearCache(): void;
    /**
     * Get provider configuration from environment variables
     */
    private static getConfigFromEnvironment;
    /**
     * Generate a hash for the configuration to use as cache key
     */
    private static hashConfig;
}
/**
 * Available OpenRouter models with descriptions
 */
export declare const OPENROUTER_MODELS: {
    readonly 'openai/gpt-4': "GPT-4 - Best overall quality";
    readonly 'openai/gpt-4-turbo': "GPT-4 Turbo - Faster and cheaper";
    readonly 'openai/gpt-3.5-turbo': "GPT-3.5 Turbo - Economical";
    readonly 'anthropic/claude-3-5-sonnet': "Claude 3.5 Sonnet - Excellent for code";
    readonly 'anthropic/claude-3-opus': "Claude 3 Opus - Maximum quality";
    readonly 'anthropic/claude-3-haiku': "Claude 3 Haiku - Fastest";
    readonly 'meta-llama/llama-3.1-405b': "Llama 3.1 405B - Premium open source";
    readonly 'meta-llama/llama-3.1-70b': "Llama 3.1 70B - Balanced";
    readonly 'meta-llama/llama-3.1-8b': "Llama 3.1 8B - Economical";
    readonly 'google/gemini-pro': "Gemini Pro - Multimodal";
    readonly 'google/gemini-flash': "Gemini Flash - Fast";
    readonly 'deepseek/deepseek-coder': "DeepSeek Coder - Code specialized";
    readonly 'codellama/codellama-70b': "Code Llama 70B - Code generation";
};
/**
 * Get recommended models for different tasks
 */
export declare const getRecommendedModels: () => {
    analysis: string[];
    generation: string[];
    validation: string[];
    refactoring: string[];
};
/**
 * Get cost-effective model configurations
 */
export declare const getCostEffectiveConfigs: () => {
    development: {
        primary: string;
        fallback: string[];
        dailyLimit: number;
    };
    production: {
        primary: string;
        fallback: string[];
        dailyLimit: number;
    };
    premium: {
        primary: string;
        fallback: string[];
        dailyLimit: number;
    };
};
//# sourceMappingURL=provider-factory.d.ts.map