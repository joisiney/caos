"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCostEffectiveConfigs = exports.getRecommendedModels = exports.OPENROUTER_MODELS = exports.ProviderFactory = void 0;
const openai_provider_1 = require("./openai-provider");
const anthropic_provider_1 = require("./anthropic-provider");
const openrouter_provider_1 = require("./openrouter-provider");
/**
 * Factory for creating AI provider instances
 */
class ProviderFactory {
    static providers = new Map();
    /**
     * Create or get an AI provider instance
     * @param type - Provider type ('openai', 'anthropic', 'openrouter')
     * @param config - Provider configuration
     * @returns Configured AI provider instance
     */
    static createProvider(type, config) {
        const key = `${type}-${this.hashConfig(config)}`;
        if (this.providers.has(key)) {
            return this.providers.get(key);
        }
        let provider;
        switch (type) {
            case 'openai':
                provider = new openai_provider_1.OpenAIProvider();
                provider.configure(config);
                break;
            case 'anthropic':
                provider = new anthropic_provider_1.AnthropicProvider();
                provider.configure(config);
                break;
            case 'openrouter':
                provider = new openrouter_provider_1.OpenRouterProvider();
                provider.configure(config);
                break;
            default:
                throw new Error(`Unsupported provider type: ${type}`);
        }
        this.providers.set(key, provider);
        return provider;
    }
    /**
     * Create provider from environment variables
     * @param type - Provider type
     * @returns Configured AI provider instance
     */
    static createFromEnvironment(type) {
        const config = this.getConfigFromEnvironment(type);
        return this.createProvider(type, config);
    }
    /**
     * Get default provider based on available environment variables
     * @returns Default AI provider instance
     */
    static getDefaultProvider() {
        // Check for OpenRouter first (most flexible)
        if (process.env['OPENROUTER_API_KEY']) {
            return this.createFromEnvironment('openrouter');
        }
        // Check for OpenAI
        if (process.env['OPENAI_API_KEY']) {
            return this.createFromEnvironment('openai');
        }
        // Check for Anthropic
        if (process.env['ANTHROPIC_API_KEY']) {
            return this.createFromEnvironment('anthropic');
        }
        throw new Error('No AI provider configured. Please set OPENAI_API_KEY, ANTHROPIC_API_KEY, or OPENROUTER_API_KEY environment variable.');
    }
    /**
     * List available providers based on environment variables
     * @returns Array of available provider types
     */
    static getAvailableProviders() {
        const available = [];
        if (process.env['OPENAI_API_KEY']) {
            available.push('openai');
        }
        if (process.env['ANTHROPIC_API_KEY']) {
            available.push('anthropic');
        }
        if (process.env['OPENROUTER_API_KEY']) {
            available.push('openrouter');
        }
        return available;
    }
    /**
     * Test all available providers
     * @returns Map of provider test results
     */
    static async testAllProviders() {
        const results = new Map();
        const available = this.getAvailableProviders();
        for (const providerType of available) {
            try {
                const provider = this.createFromEnvironment(providerType);
                await provider.test();
                results.set(providerType, true);
            }
            catch (error) {
                console.warn(`Provider ${providerType} test failed:`, error);
                results.set(providerType, false);
            }
        }
        return results;
    }
    /**
     * Clear provider cache
     */
    static clearCache() {
        this.providers.clear();
    }
    /**
     * Get provider configuration from environment variables
     */
    static getConfigFromEnvironment(type) {
        switch (type) {
            case 'openai':
                return {
                    apiKey: process.env['OPENAI_API_KEY'] || '',
                    model: process.env['OPENAI_MODEL'] || 'gpt-4',
                    temperature: parseFloat(process.env['OPENAI_TEMPERATURE'] || '0.3'),
                    maxTokens: parseInt(process.env['OPENAI_MAX_TOKENS'] || '1000'),
                    timeout: parseInt(process.env['OPENAI_TIMEOUT'] || '30000'),
                };
            case 'anthropic':
                return {
                    apiKey: process.env['ANTHROPIC_API_KEY'] || '',
                    model: process.env['ANTHROPIC_MODEL'] || 'claude-3-5-sonnet-20241022',
                    temperature: parseFloat(process.env['ANTHROPIC_TEMPERATURE'] || '0.3'),
                    maxTokens: parseInt(process.env['ANTHROPIC_MAX_TOKENS'] || '1000'),
                    timeout: parseInt(process.env['ANTHROPIC_TIMEOUT'] || '30000'),
                };
            case 'openrouter':
                const fallbackModels = process.env['OPENROUTER_FALLBACK_MODELS']
                    ? process.env['OPENROUTER_FALLBACK_MODELS'].split(',').map(m => m.trim())
                    : [
                        'anthropic/claude-3-5-sonnet',
                        'openai/gpt-4-turbo',
                        'meta-llama/llama-3.1-70b',
                        'openai/gpt-3.5-turbo'
                    ];
                return {
                    apiKey: process.env['OPENROUTER_API_KEY'] || '',
                    model: process.env['OPENROUTER_MODEL'] || 'anthropic/claude-3-5-sonnet',
                    temperature: parseFloat(process.env['OPENROUTER_TEMPERATURE'] || '0.3'),
                    maxTokens: parseInt(process.env['OPENROUTER_MAX_TOKENS'] || '1000'),
                    timeout: parseInt(process.env['OPENROUTER_TIMEOUT'] || '30000'),
                    appUrl: process.env['OPENROUTER_APP_URL'] || 'https://khaos-cli.dev',
                    fallbackModels,
                    dailyLimit: parseFloat(process.env['OPENROUTER_DAILY_LIMIT'] || '10.00'),
                    perRequestLimit: parseFloat(process.env['OPENROUTER_PER_REQUEST_LIMIT'] || '0.50'),
                };
            default:
                throw new Error(`Unsupported provider type: ${type}`);
        }
    }
    /**
     * Generate a hash for the configuration to use as cache key
     */
    static hashConfig(config) {
        // Simple hash based on key properties (excluding sensitive data like API keys)
        const hashData = {
            model: config.model,
            temperature: config.temperature,
            maxTokens: config.maxTokens,
        };
        return Buffer.from(JSON.stringify(hashData)).toString('base64').slice(0, 8);
    }
}
exports.ProviderFactory = ProviderFactory;
/**
 * Available OpenRouter models with descriptions
 */
exports.OPENROUTER_MODELS = {
    // OpenAI Models
    'openai/gpt-4': 'GPT-4 - Best overall quality',
    'openai/gpt-4-turbo': 'GPT-4 Turbo - Faster and cheaper',
    'openai/gpt-3.5-turbo': 'GPT-3.5 Turbo - Economical',
    // Anthropic Models
    'anthropic/claude-3-5-sonnet': 'Claude 3.5 Sonnet - Excellent for code',
    'anthropic/claude-3-opus': 'Claude 3 Opus - Maximum quality',
    'anthropic/claude-3-haiku': 'Claude 3 Haiku - Fastest',
    // Meta Models
    'meta-llama/llama-3.1-405b': 'Llama 3.1 405B - Premium open source',
    'meta-llama/llama-3.1-70b': 'Llama 3.1 70B - Balanced',
    'meta-llama/llama-3.1-8b': 'Llama 3.1 8B - Economical',
    // Google Models
    'google/gemini-pro': 'Gemini Pro - Multimodal',
    'google/gemini-flash': 'Gemini Flash - Fast',
    // Specialized Models
    'deepseek/deepseek-coder': 'DeepSeek Coder - Code specialized',
    'codellama/codellama-70b': 'Code Llama 70B - Code generation',
};
/**
 * Get recommended models for different tasks
 */
const getRecommendedModels = () => ({
    analysis: [
        'anthropic/claude-3-5-sonnet',
        'openai/gpt-4',
        'deepseek/deepseek-coder',
    ],
    generation: [
        'openai/gpt-4-turbo',
        'anthropic/claude-3-5-sonnet',
        'codellama/codellama-70b',
    ],
    validation: [
        'anthropic/claude-3-5-sonnet',
        'openai/gpt-4',
        'meta-llama/llama-3.1-70b',
    ],
    refactoring: [
        'openai/gpt-4',
        'anthropic/claude-3-opus',
        'deepseek/deepseek-coder',
    ],
});
exports.getRecommendedModels = getRecommendedModels;
/**
 * Get cost-effective model configurations
 */
const getCostEffectiveConfigs = () => ({
    development: {
        primary: 'meta-llama/llama-3.1-8b',
        fallback: ['openai/gpt-3.5-turbo', 'anthropic/claude-3-haiku'],
        dailyLimit: 2.00,
    },
    production: {
        primary: 'anthropic/claude-3-5-sonnet',
        fallback: ['openai/gpt-4', 'meta-llama/llama-3.1-70b'],
        dailyLimit: 50.00,
    },
    premium: {
        primary: 'openai/gpt-4',
        fallback: ['anthropic/claude-3-opus', 'anthropic/claude-3-5-sonnet'],
        dailyLimit: 100.00,
    },
});
exports.getCostEffectiveConfigs = getCostEffectiveConfigs;
//# sourceMappingURL=provider-factory.js.map