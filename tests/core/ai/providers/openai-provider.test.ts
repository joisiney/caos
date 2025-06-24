import { OpenAIProvider } from '../../../../src/core/ai/providers/openai-provider';
import { OpenAIConfig } from '../../../../src/core/ai/types';

// Mock OpenAI
jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    })),
  };
});

describe('OpenAIProvider', () => {
  let provider: OpenAIProvider;
  let mockConfig: OpenAIConfig;

  beforeEach(() => {
    provider = new OpenAIProvider();
    mockConfig = {
      apiKey: 'test-api-key',
      model: 'gpt-4',
      temperature: 0.3,
      maxTokens: 1000,
      timeout: 30000,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('configuration', () => {
    it('should configure the provider correctly', () => {
      provider.configure(mockConfig);
      expect(provider.isConfigured()).toBe(true);
    });

    it('should not be configured initially', () => {
      expect(provider.isConfigured()).toBe(false);
    });

    it('should have correct name and version', () => {
      expect(provider.name).toBe('openai');
      expect(provider.version).toBe('1.0.0');
    });
  });

  describe('usage statistics', () => {
    beforeEach(() => {
      provider.configure(mockConfig);
    });

    it('should initialize usage statistics', () => {
      const usage = provider.getUsage();
      expect(usage.requests).toBe(0);
      expect(usage.tokens).toBe(0);
      expect(usage.cost).toBe(0);
      expect(usage.errors).toBe(0);
      expect(usage.cacheHitRate).toBe(0);
    });

    it('should reset usage statistics', () => {
      // Simulate some usage
      (provider as any).usage.requests = 5;
      (provider as any).usage.tokens = 100;
      
      provider.resetUsage();
      
      const usage = provider.getUsage();
      expect(usage.requests).toBe(0);
      expect(usage.tokens).toBe(0);
    });
  });

  describe('analyzeDescription', () => {
    beforeEach(() => {
      provider.configure(mockConfig);
    });

    it('should throw error when not configured', async () => {
      const unconfiguredProvider = new OpenAIProvider();
      
      await expect(
        unconfiguredProvider.analyzeDescription('test description')
      ).rejects.toThrow('OpenAI provider is not configured');
    });

    it('should analyze description successfully', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              layerType: 'atom',
              confidence: 0.95,
              componentName: 'button',
              reasoning: 'Simple reusable component',
              dependencies: [],
              props: [],
              methods: [],
              metadata: {},
            }),
          },
        }],
        usage: { total_tokens: 100 },
      };

      const mockCreate = jest.fn().mockResolvedValue(mockResponse);
      (provider as any).client = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      const result = await provider.analyzeDescription('a simple button');

      expect(result.layerType).toBe('atom');
      expect(result.confidence).toBe(0.95);
      expect(result.componentName).toBe('button');
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4',
          temperature: 0.3,
          max_tokens: 1000,
          response_format: { type: 'json_object' },
        })
      );
    });

    it('should handle API errors', async () => {
      const mockCreate = jest.fn().mockRejectedValue(new Error('API Error'));
      (provider as any).client = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      await expect(
        provider.analyzeDescription('test description')
      ).rejects.toThrow('OpenAI analysis failed: Error: API Error');

      const usage = provider.getUsage();
      expect(usage.errors).toBe(1);
    });
  });

  describe('generateCode', () => {
    beforeEach(() => {
      provider.configure(mockConfig);
    });

    it('should generate code successfully', async () => {
      const mockAnalysis = {
        layerType: 'atom',
        confidence: 0.95,
        componentName: 'button',
        reasoning: 'Simple reusable component',
        dependencies: [],
        props: [],
        methods: [],
        metadata: {},
      };

      const mockTemplate = {
        name: 'atom-template',
        content: 'export const <%= name %> = () => {};',
      };

      const mockResponse = {
        choices: [{
          message: {
            content: 'export const ButtonAtom = () => {};',
          },
        }],
        usage: { total_tokens: 150 },
      };

      const mockCreate = jest.fn().mockResolvedValue(mockResponse);
      (provider as any).client = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      const result = await provider.generateCode(mockAnalysis, mockTemplate);

      expect(result.files).toHaveProperty('button.atom.tsx');
      expect(result.metadata.layer).toBe('atom');
      expect(result.metadata.name).toBe('button');
      expect(result.metadata.aiProvider).toBe('openai');
    });
  });

  describe('validateCode', () => {
    beforeEach(() => {
      provider.configure(mockConfig);
    });

    it('should validate code successfully', async () => {
      const mockRules = {
        layer: 'atom',
        prompt: 'Validate this atom',
      };

      const mockResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              isValid: true,
              issues: [],
              score: 0.95,
              improvements: [],
            }),
          },
        }],
        usage: { total_tokens: 80 },
      };

      const mockCreate = jest.fn().mockResolvedValue(mockResponse);
      (provider as any).client = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      const result = await provider.validateCode('const test = 1;', mockRules);

      expect(result.isValid).toBe(true);
      expect(result.score).toBe(0.95);
      expect(result.issues).toHaveLength(0);
    });
  });

  describe('test connection', () => {
    beforeEach(() => {
      provider.configure(mockConfig);
    });

    it('should test connection successfully', async () => {
      const mockCreate = jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'test' } }],
      });
      (provider as any).client = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      await expect(provider.test()).resolves.not.toThrow();
    });

    it('should handle test connection failure', async () => {
      const mockCreate = jest.fn().mockRejectedValue(new Error('Connection failed'));
      (provider as any).client = {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      };

      await expect(provider.test()).rejects.toThrow('OpenAI provider test failed');
    });
  });
});