# 🤖 AI Providers System

This module implements the AI integration system for Khaos CLI, providing intelligent code analysis, generation, and validation capabilities.

## 🏗️ Architecture

The AI system is built around a common interface that supports multiple AI providers:

- **OpenAI Provider**: GPT-4, GPT-3.5-turbo models
- **Anthropic Provider**: Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **OpenRouter Provider**: Unified access to multiple models with fallback support

## 🚀 Quick Start

### Basic Usage

```typescript
import { ProviderFactory } from './providers';

// Get default provider (based on environment variables)
const provider = ProviderFactory.getDefaultProvider();

// Analyze a description
const analysis = await provider.analyzeDescription(
  'um botão reutilizável com variantes de cor'
);

console.log(analysis.layerType); // 'atom'
console.log(analysis.componentName); // 'button'
```

### Using Specific Provider

```typescript
import { ProviderFactory } from './providers';

// Create OpenRouter provider with fallback
const provider = ProviderFactory.createProvider('openrouter', {
  apiKey: 'your-api-key',
  model: 'anthropic/claude-3-5-sonnet',
  temperature: 0.3,
  maxTokens: 1000,
  timeout: 30000,
  fallbackModels: ['openai/gpt-4', 'meta-llama/llama-3.1-70b'],
});
```

## 🔧 Configuration

### Environment Variables

```bash
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.3
OPENAI_MAX_TOKENS=1000

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_TEMPERATURE=0.3
ANTHROPIC_MAX_TOKENS=1000

# OpenRouter
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=anthropic/claude-3-5-sonnet
OPENROUTER_FALLBACK_MODELS=openai/gpt-4,meta-llama/llama-3.1-70b
OPENROUTER_APP_URL=https://khaos-cli.dev
OPENROUTER_DAILY_LIMIT=10.00
```

### Provider Priority

The system automatically selects providers in this order:
1. **OpenRouter** (most flexible, multiple models)
2. **OpenAI** (reliable, good performance)
3. **Anthropic** (excellent for code analysis)

## 🎯 Core Features

### 1. Layer Analysis

Analyze natural language descriptions to determine the appropriate Khaos architecture layer:

```typescript
const analysis = await provider.analyzeDescription(
  'modal de confirmação que pode ser usado em várias telas',
  {
    projectStructure: ['src/atoms/', 'src/molecules/'],
    framework: 'react',
  }
);

// Returns: { layerType: 'molecule', componentName: 'confirmation-modal', ... }
```

### 2. Code Generation

Generate code based on analysis and templates:

```typescript
const template = {
  name: 'atom-template',
  content: 'export const <%= componentName %> = () => {};',
};

const generated = await provider.generateCode(analysis, template);
console.log(generated.files); // { 'button.atom.tsx': '...' }
```

### 3. Code Validation

Validate existing code against Khaos architecture rules:

```typescript
const validation = await provider.validateCode(code, {
  layer: 'atom',
  prompt: 'Validate this atom component',
});

console.log(validation.isValid); // true/false
console.log(validation.issues); // Array of issues
console.log(validation.score); // 0-1 quality score
```

### 4. Refactoring Suggestions

Get intelligent refactoring suggestions:

```typescript
const suggestions = await provider.suggestRefactoring(code, issues);
console.log(suggestions.suggestions); // Array of refactoring suggestions
```

## 🌐 OpenRouter Integration

OpenRouter provides access to multiple AI models through a single API:

### Available Models

```typescript
import { OPENROUTER_MODELS } from './providers';

console.log(OPENROUTER_MODELS);
// {
//   'openai/gpt-4': 'GPT-4 - Best overall quality',
//   'anthropic/claude-3-5-sonnet': 'Claude 3.5 Sonnet - Excellent for code',
//   'meta-llama/llama-3.1-70b': 'Llama 3.1 70B - Balanced',
//   ...
// }
```

### Recommended Models by Task

```typescript
import { getRecommendedModels } from './providers';

const recommended = getRecommendedModels();
console.log(recommended.analysis); // ['anthropic/claude-3-5-sonnet', ...]
console.log(recommended.generation); // ['openai/gpt-4-turbo', ...]
```

### Cost-Effective Configurations

```typescript
import { getCostEffectiveConfigs } from './providers';

const configs = getCostEffectiveConfigs();
console.log(configs.development); // Economical setup for development
console.log(configs.production); // Balanced setup for production
console.log(configs.premium); // High-quality setup
```

## 🔄 Fallback System

OpenRouter provider supports automatic fallback between models:

```typescript
const provider = ProviderFactory.createProvider('openrouter', {
  apiKey: 'your-key',
  model: 'anthropic/claude-3-5-sonnet', // Primary model
  fallbackModels: [
    'openai/gpt-4-turbo',
    'meta-llama/llama-3.1-70b',
    'openai/gpt-3.5-turbo'
  ],
});

// If primary model fails, automatically tries fallback models
```

## 📊 Usage Statistics

Track usage across all providers:

```typescript
const usage = provider.getUsage();
console.log(usage);
// {
//   requests: 42,
//   tokens: 15000,
//   cost: 0.75,
//   errors: 1,
//   cacheHitRate: 0.8
// }
```

## 🧪 Testing

Test provider connectivity:

```typescript
// Test single provider
await provider.test();

// Test all available providers
const results = await ProviderFactory.testAllProviders();
console.log(results); // Map<string, boolean>
```

## 🎨 Examples

See [`examples/usage-example.ts`](./examples/usage-example.ts) for comprehensive usage examples.

## 🔒 Security

- API keys are never logged or exposed
- All requests use HTTPS
- Rate limiting and cost controls supported
- Environment variable based configuration

## 🚀 Performance

- Provider instances are cached for reuse
- Automatic retry with exponential backoff
- Configurable timeouts and limits
- Efficient token usage tracking

## 🛠️ Development

### Adding New Providers

1. Implement the `AIProvider` interface
2. Add to `ProviderFactory`
3. Update environment configuration
4. Add tests

### Running Tests

```bash
npm test src/core/ai/
```

### Type Safety

All providers are fully typed with TypeScript, ensuring compile-time safety and excellent IDE support.

## 📚 API Reference

### AIProvider Interface

```typescript
interface AIProvider {
  readonly name: string;
  readonly version: string;
  
  analyzeDescription(description: string, context?: AnalysisContext): Promise<LayerAnalysis>;
  generateCode(analysis: LayerAnalysis, template: Template): Promise<GeneratedCode>;
  validateCode(code: string, rules: ValidationRules): Promise<ValidationSuggestions>;
  suggestRefactoring(code: string, issues: CodeIssue[]): Promise<RefactoringSuggestions>;
  
  configure(config: ProviderConfig): void;
  isConfigured(): boolean;
  getUsage(): UsageStats;
  test(): Promise<void>;
}
```

### Key Types

- `LayerAnalysis`: Result of analyzing a description
- `GeneratedCode`: Generated code files and metadata
- `ValidationSuggestions`: Code validation results
- `AnalysisContext`: Additional context for analysis
- `ProviderConfig`: Provider configuration options

## 🤝 Contributing

1. Follow the existing code patterns
2. Add comprehensive tests
3. Update documentation
4. Ensure TypeScript compliance
5. Test with multiple providers

## 📄 License

MIT License - see project root for details.