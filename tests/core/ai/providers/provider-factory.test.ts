import { ProviderFactory, OPENROUTER_MODELS, getRecommendedModels, getCostEffectiveConfigs } from '../../../../src/core/ai/providers/provider-factory';
import { OpenAIProvider } from '../../../../src/core/ai/providers/openai-provider';
import { AnthropicProvider } from '../../../../src/core/ai/providers/anthropic-provider';
import { OpenRouterProvider } from '../../../../src/core/ai/providers/openrouter-provider';

// Mock the providers
jest.mock('../../../../src/core/ai/providers/openai-provider');
jest.mock('../../../../src/core/ai/providers/anthropic-provider');
jest.mock('../../../../src/core/ai/providers/openrouter-provider');

describe('ProviderFactory', () => {
  beforeEach(() => {
    // Clear provider cache before each test
    ProviderFactory.clearCache();
    jest.clearAllMocks();
  });

  describe('createProvider', () => {
    it('should create OpenAI provider', () => {
      const config = {
        apiKey: 'test-key',
        model: 'gpt-4',
        temperature: 0.3,
        maxTokens: 1000,
        timeout: 30000,
      };

      const provider = ProviderFactory.createProvider('openai', config);
      
      expect(OpenAIProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(OpenAIProvider);
    });

    it('should create Anthropic provider', () => {
      const config = {
        apiKey: 'test-key',
        model: 'claude-3-5-sonnet-20241022',
        temperature: 0.3,
        maxTokens: 1000,
        timeout: 30000,
      };

      const provider = ProviderFactory.createProvider('anthropic', config);
      
      expect(AnthropicProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(AnthropicProvider);
    });

    it('should create OpenRouter provider', () => {
      const config = {
        apiKey: 'test-key',
        model: 'anthropic/claude-3-5-sonnet',
        temperature: 0.3,
        maxTokens: 1000,
        timeout: 30000,
        appUrl: 'https://test.com',
        fallbackModels: ['openai/gpt-4'],
      };

      const provider = ProviderFactory.createProvider('openrouter', config);
      
      expect(OpenRouterProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(OpenRouterProvider);
    });

    it('should throw error for unsupported provider type', () => {
      const config = {
        apiKey: 'test-key',
        model: 'test-model',
        temperature: 0.3,
        maxTokens: 1000,
        timeout: 30000,
      };

      expect(() => {
        ProviderFactory.createProvider('unsupported' as any, config);
      }).toThrow('Unsupported provider type: unsupported');
    });

    it('should cache providers', () => {
      const config = {
        apiKey: 'test-key',
        model: 'gpt-4',
        temperature: 0.3,
        maxTokens: 1000,
        timeout: 30000,
      };

      const provider1 = ProviderFactory.createProvider('openai', config);
      const provider2 = ProviderFactory.createProvider('openai', config);
      
      expect(provider1).toBe(provider2);
      expect(OpenAIProvider).toHaveBeenCalledTimes(1);
    });
  });

  describe('createFromEnvironment', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should create OpenAI provider from environment', () => {
      process.env['OPENAI_API_KEY'] = 'test-openai-key';
      process.env['OPENAI_MODEL'] = 'gpt-4';
      process.env['OPENAI_TEMPERATURE'] = '0.5';

      const provider = ProviderFactory.createFromEnvironment('openai');
      
      expect(OpenAIProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(OpenAIProvider);
    });

    it('should create Anthropic provider from environment', () => {
      process.env['ANTHROPIC_API_KEY'] = 'test-anthropic-key';
      process.env['ANTHROPIC_MODEL'] = 'claude-3-opus-20240229';

      const provider = ProviderFactory.createFromEnvironment('anthropic');
      
      expect(AnthropicProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(AnthropicProvider);
    });

    it('should create OpenRouter provider from environment', () => {
      process.env['OPENROUTER_API_KEY'] = 'test-openrouter-key';
      process.env['OPENROUTER_MODEL'] = 'anthropic/claude-3-5-sonnet';
      process.env['OPENROUTER_FALLBACK_MODELS'] = 'openai/gpt-4,meta-llama/llama-3.1-70b';

      const provider = ProviderFactory.createFromEnvironment('openrouter');
      
      expect(OpenRouterProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(OpenRouterProvider);
    });
  });

  describe('getDefaultProvider', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
      // Clear all AI-related env vars
      delete process.env['OPENAI_API_KEY'];
      delete process.env['ANTHROPIC_API_KEY'];
      delete process.env['OPENROUTER_API_KEY'];
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should prefer OpenRouter when available', () => {
      process.env['OPENROUTER_API_KEY'] = 'test-openrouter-key';
      process.env['OPENAI_API_KEY'] = 'test-openai-key';
      process.env['ANTHROPIC_API_KEY'] = 'test-anthropic-key';

      const provider = ProviderFactory.getDefaultProvider();
      
      expect(OpenRouterProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(OpenRouterProvider);
    });

    it('should use OpenAI when OpenRouter not available', () => {
      process.env['OPENAI_API_KEY'] = 'test-openai-key';
      process.env['ANTHROPIC_API_KEY'] = 'test-anthropic-key';

      const provider = ProviderFactory.getDefaultProvider();
      
      expect(OpenAIProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(OpenAIProvider);
    });

    it('should use Anthropic when only Anthropic available', () => {
      process.env['ANTHROPIC_API_KEY'] = 'test-anthropic-key';

      const provider = ProviderFactory.getDefaultProvider();
      
      expect(AnthropicProvider).toHaveBeenCalled();
      expect(provider).toBeInstanceOf(AnthropicProvider);
    });

    it('should throw error when no providers available', () => {
      expect(() => {
        ProviderFactory.getDefaultProvider();
      }).toThrow('No AI provider configured');
    });
  });

  describe('getAvailableProviders', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
      // Clear all AI-related env vars
      delete process.env['OPENAI_API_KEY'];
      delete process.env['ANTHROPIC_API_KEY'];
      delete process.env['OPENROUTER_API_KEY'];
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return empty array when no providers configured', () => {
      const available = ProviderFactory.getAvailableProviders();
      expect(available).toEqual([]);
    });

    it('should return all available providers', () => {
      process.env['OPENAI_API_KEY'] = 'test-openai-key';
      process.env['ANTHROPIC_API_KEY'] = 'test-anthropic-key';
      process.env['OPENROUTER_API_KEY'] = 'test-openrouter-key';

      const available = ProviderFactory.getAvailableProviders();
      expect(available).toContain('openai');
      expect(available).toContain('anthropic');
      expect(available).toContain('openrouter');
    });

    it('should return only configured providers', () => {
      process.env['OPENAI_API_KEY'] = 'test-openai-key';

      const available = ProviderFactory.getAvailableProviders();
      expect(available).toEqual(['openai']);
    });
  });

  describe('testAllProviders', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
      process.env['OPENAI_API_KEY'] = 'test-openai-key';
      process.env['ANTHROPIC_API_KEY'] = 'test-anthropic-key';
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should test all available providers', async () => {
      // Mock successful tests
      const mockTest = jest.fn().mockResolvedValue(undefined);
      (OpenAIProvider as jest.MockedClass<typeof OpenAIProvider>).mockImplementation(() => ({
        test: mockTest,
        configure: jest.fn(),
      } as any));
      (AnthropicProvider as jest.MockedClass<typeof AnthropicProvider>).mockImplementation(() => ({
        test: mockTest,
        configure: jest.fn(),
      } as any));

      const results = await ProviderFactory.testAllProviders();
      
      expect(results.get('openai')).toBe(true);
      expect(results.get('anthropic')).toBe(true);
      expect(mockTest).toHaveBeenCalledTimes(2);
    });

    it('should handle test failures', async () => {
      // Mock failed test
      const mockTest = jest.fn().mockRejectedValue(new Error('Test failed'));
      (OpenAIProvider as jest.MockedClass<typeof OpenAIProvider>).mockImplementation(() => ({
        test: mockTest,
        configure: jest.fn(),
      } as any));

      const results = await ProviderFactory.testAllProviders();
      
      expect(results.get('openai')).toBe(false);
    });
  });

  describe('constants and utilities', () => {
    it('should export OpenRouter models', () => {
      expect(OPENROUTER_MODELS).toBeDefined();
      expect(OPENROUTER_MODELS['openai/gpt-4']).toBe('GPT-4 - Best overall quality');
      expect(OPENROUTER_MODELS['anthropic/claude-3-5-sonnet']).toBe('Claude 3.5 Sonnet - Excellent for code');
    });

    it('should provide recommended models', () => {
      const recommended = getRecommendedModels();
      
      expect(recommended.analysis).toContain('anthropic/claude-3-5-sonnet');
      expect(recommended.generation).toContain('openai/gpt-4-turbo');
      expect(recommended.validation).toContain('anthropic/claude-3-5-sonnet');
      expect(recommended.refactoring).toContain('openai/gpt-4');
    });

    it('should provide cost-effective configurations', () => {
      const configs = getCostEffectiveConfigs();
      
      expect(configs.development.primary).toBe('meta-llama/llama-3.1-8b');
      expect(configs.development.dailyLimit).toBe(2.00);
      
      expect(configs.production.primary).toBe('anthropic/claude-3-5-sonnet');
      expect(configs.production.dailyLimit).toBe(50.00);
      
      expect(configs.premium.primary).toBe('openai/gpt-4');
      expect(configs.premium.dailyLimit).toBe(100.00);
    });
  });

  describe('clearCache', () => {
    it('should clear provider cache', () => {
      const config = {
        apiKey: 'test-key',
        model: 'gpt-4',
        temperature: 0.3,
        maxTokens: 1000,
        timeout: 30000,
      };

      // Create a provider to populate cache
      ProviderFactory.createProvider('openai', config);
      expect(OpenAIProvider).toHaveBeenCalledTimes(1);

      // Clear cache and create again
      ProviderFactory.clearCache();
      ProviderFactory.createProvider('openai', config);
      
      // Should create a new instance
      expect(OpenAIProvider).toHaveBeenCalledTimes(2);
    });
  });
});