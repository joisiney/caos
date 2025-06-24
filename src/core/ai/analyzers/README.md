# 🧠 AI Analyzers

This module provides intelligent analyzers that use AI providers to analyze natural language descriptions, classify components into appropriate layers, suggest naming conventions, analyze dependencies, and validate existing code according to the Khaos architecture.

## 📋 Overview

The AI analyzers are designed to provide intelligent assistance for:

- **Natural Language Analysis**: Convert descriptions in Portuguese/English to structured component specifications
- **Layer Classification**: Automatically determine the appropriate Khaos layer (atom, molecule, organism, etc.)
- **Naming Suggestions**: Generate names following Khaos conventions (dash-case, prefixes, suffixes)
- **Dependency Analysis**: Suggest imports, file structure, and validate architectural dependencies
- **Code Validation**: Analyze existing code for violations and suggest improvements
- **Context Building**: Gather project information to enhance analysis accuracy

## 🏗️ Architecture

```
src/core/ai/analyzers/
├── description-analyzer.ts    # Natural language description analysis
├── layer-classifier.ts        # Layer classification with pattern matching
├── naming-analyzer.ts         # Name suggestion with conventions
├── dependency-analyzer.ts     # Dependency and import analysis
├── code-analyzer.ts          # Code quality and architectural validation
├── context-builder.ts        # Project context gathering
├── index.ts                  # Main exports and factory functions
└── README.md                 # This documentation
```

## 🔧 Core Components

### 1. DescriptionAnalyzer

Analyzes natural language descriptions to determine component structure and requirements.

```typescript
import { DescriptionAnalyzer, ContextBuilder } from './analyzers';

const contextBuilder = new ContextBuilder();
const analyzer = new DescriptionAnalyzer(aiProvider, contextBuilder);

const analysis = await analyzer.analyze(
  'um botão reutilizável com variantes de cor e tamanho'
);

console.log(analysis);
// {
//   layerType: 'atom',
//   componentName: 'button',
//   confidence: 0.95,
//   dependencies: [],
//   reasoning: 'Simple reusable UI element...'
// }
```

**Features:**
- AI-powered natural language processing
- Fallback to rule-based analysis
- Validation and sanitization of results
- Context enrichment with project metadata

### 2. LayerClassifier

Classifies components into appropriate Khaos layers using pattern matching and scoring.

```typescript
import { LayerClassifier } from './analyzers';

const classifier = new LayerClassifier();

const classification = classifier.classify(
  'modal de confirmação que pode ser usado em várias telas',
  ['modal', 'reutilizável', 'confirmação']
);

console.log(classification);
// {
//   primary: { layer: 'molecule', score: 85.2 },
//   alternatives: [
//     { layer: 'organism', score: 72.1 },
//     { layer: 'atom', score: 45.3 }
//   ],
//   confidence: 0.88,
//   reasoning: 'Classified as molecule based on...'
// }
```

**Features:**
- Pattern-based classification with keyword matching
- Confidence scoring and alternative suggestions
- Fallback classification for edge cases
- Support for Portuguese and English descriptions

### 3. NamingAnalyzer

Suggests component names following Khaos naming conventions.

```typescript
import { NamingAnalyzer } from './analyzers';

const namingAnalyzer = new NamingAnalyzer(aiProvider);

const suggestion = await namingAnalyzer.suggestName(
  'formulário de login com validação',
  'molecule'
);

console.log(suggestion);
// {
//   primary: 'login-form',
//   alternatives: ['auth-form', 'signin-form', 'user-form'],
//   reasoning: 'Name chosen based on concepts: login, form...',
//   confidence: 0.92
// }
```

**Features:**
- AI-enhanced concept extraction
- Layer-specific naming patterns
- Validation against naming conventions
- Support for prefixes and suffixes

### 4. DependencyAnalyzer

Analyzes component dependencies and suggests file structure.

```typescript
import { DependencyAnalyzer } from './analyzers';

const dependencyAnalyzer = new DependencyAnalyzer();

const analysis = await dependencyAnalyzer.analyzeDependencies(
  'modal com formulário de validação',
  'molecule',
  ['validation']
);

console.log(analysis);
// {
//   required: ['atom'],
//   optional: ['util'],
//   imports: [
//     { module: 'React', imports: ['FC'], from: 'react', type: 'named' }
//   ],
//   structure: [
//     { filename: 'modal.molecule.tsx', purpose: 'Main component', required: true },
//     { filename: 'modal.use-case.ts', purpose: 'Business logic', required: true }
//   ],
//   hierarchy: { isValid: true, violations: [] }
// }
```

**Features:**
- Hierarchical dependency validation
- Import suggestion based on layer patterns
- File structure recommendations
- Circular dependency detection

### 5. CodeAnalyzer

Analyzes existing code for architectural violations and quality issues.

```typescript
import { CodeAnalyzer } from './analyzers';

const codeAnalyzer = new CodeAnalyzer(aiProvider);

const analysis = await codeAnalyzer.analyzeCode(code, 'atom');

console.log(analysis);
// {
//   isValid: true,
//   score: 87.5,
//   issues: [
//     { type: 'warning', message: 'Line too long', line: 15, severity: 'low' }
//   ],
//   violations: [],
//   metrics: {
//     complexity: 12,
//     maintainability: 85.2,
//     readability: 78.9
//   }
// }
```

**Features:**
- Static code analysis with architectural rules
- AI-powered code quality assessment
- Layer-specific violation detection
- Performance and maintainability metrics

### 6. ContextBuilder

Builds context information for enhanced analysis accuracy.

```typescript
import { ContextBuilder } from './analyzers';

const contextBuilder = new ContextBuilder();

const context = await contextBuilder.build({
  framework: 'react',
  existingComponents: ['button', 'input']
});

console.log(context);
// {
//   projectStructure: ['src/atoms/', 'src/molecules/', ...],
//   existingLayers: ['button', 'input'],
//   framework: 'react',
//   metadata: { buildTime: '2024-01-01T00:00:00Z' }
// }
```

**Features:**
- Project structure detection
- Framework identification
- Existing component inventory
- Layer-specific context building

## 🚀 Quick Start

### Basic Usage

```typescript
import { createAnalyzerSuite, performCompleteAnalysis } from './analyzers';
import { ProviderFactory } from '../providers';

// Create AI provider
const aiProvider = ProviderFactory.getDefaultProvider();

// Option 1: Use individual analyzers
const suite = createAnalyzerSuite(aiProvider);
const analysis = await suite.descriptionAnalyzer.analyze('modal reutilizável');

// Option 2: Complete workflow
const result = await performCompleteAnalysis(
  'modal de confirmação reutilizável',
  aiProvider,
  { framework: 'react' }
);

console.log(result);
// {
//   description: { layerType: 'molecule', componentName: 'modal', ... },
//   layer: { primary: { layer: 'molecule', score: 85 }, ... },
//   naming: { primary: 'confirmation-modal', alternatives: [...] },
//   dependencies: { required: ['atom'], imports: [...] },
//   metadata: { confidence: 0.89, aiProvider: 'openai' }
// }
```

### Without AI Provider

All analyzers work without an AI provider using rule-based fallbacks:

```typescript
import { LayerClassifier, NamingAnalyzer } from './analyzers';

// Works without AI
const classifier = new LayerClassifier();
const classification = classifier.classify('botão simples');

const namingAnalyzer = new NamingAnalyzer(); // No AI provider
const naming = await namingAnalyzer.suggestName('botão', 'atom');
```

## 🎯 Layer-Specific Rules

### Atoms
- **Characteristics**: Simple, reusable UI elements
- **Dependencies**: None
- **Naming**: `component-name.atom.tsx` → `ComponentNameAtom`
- **Examples**: button, input, icon, text

### Molecules
- **Characteristics**: Combination of atoms with local logic
- **Dependencies**: atoms
- **Requirements**: Must have use-case hook
- **Naming**: `component-name.molecule.tsx` → `ComponentNameMolecule`
- **Examples**: modal, card, form, dropdown

### Organisms
- **Characteristics**: Complex compositions with semantic structure
- **Dependencies**: molecules + atoms
- **Requirements**: Must have use-case hook
- **Features**: Can have partials, context, validation schemas
- **Examples**: header, sidebar, navigation, complex sections

### Templates
- **Characteristics**: Visual layouts orchestrating organisms
- **Dependencies**: organisms + molecules + atoms + utils
- **Restrictions**: No use-case, business logic, or state management
- **Focus**: Layout and visual structure only

### Features
- **Characteristics**: Complete application functionality
- **Dependencies**: All layers
- **Requirements**: Must render templates exclusively, module prefix required
- **Naming**: `module-name.feature.tsx` (e.g., `wallet-deposit.feature.tsx`)

### Utilities
- **Characteristics**: Pure functions without side effects
- **Dependencies**: None
- **Restrictions**: Cannot be used in entity, gateway, repository, model layers
- **Examples**: formatters, validators, helpers

## 🔍 Analysis Patterns

### Keyword Patterns

The analyzers use sophisticated keyword matching for classification:

```typescript
const layerPatterns = {
  atom: {
    keywords: ['botão', 'button', 'input', 'ícone', 'icon', 'básico', 'simple'],
    complexity: 'low',
    reusability: 'high'
  },
  molecule: {
    keywords: ['modal', 'card', 'formulário', 'form', 'combinação'],
    complexity: 'medium',
    reusability: 'medium'
  },
  // ... more patterns
};
```

### Confidence Scoring

Confidence is calculated based on:
- Keyword match strength
- Pattern consistency
- Context alignment
- AI provider confidence (when available)

### Fallback Strategies

When AI analysis fails:
1. **Rule-based classification** using keyword patterns
2. **Default naming** following layer conventions
3. **Standard dependencies** based on layer hierarchy
4. **Basic validation** using static analysis

## 🧪 Testing

Comprehensive test suite covering:

```bash
# Run analyzer tests
npm test tests/core/ai/analyzers/

# Test specific analyzer
npm test -- --testNamePattern="LayerClassifier"

# Run with coverage
npm test -- --coverage tests/core/ai/analyzers/
```

Test categories:
- **Unit tests** for individual analyzers
- **Integration tests** for complete workflows
- **Error handling** for AI provider failures
- **Edge cases** for unusual inputs

## 📊 Performance Considerations

### Caching
- AI responses are cached to reduce API calls
- Context building results are memoized
- Pattern matching results are cached

### Optimization
- Lazy loading of AI providers
- Parallel analysis when possible
- Efficient pattern matching algorithms

### Rate Limiting
- Built-in rate limiting for AI providers
- Graceful degradation to rule-based analysis
- Request queuing and retry logic

## 🔧 Configuration

### AI Provider Setup

```typescript
// Environment variables
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=sk-or-...

// Provider selection
const provider = ProviderFactory.createProvider('openai', {
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4',
  temperature: 0.3,
  maxTokens: 1000
});
```

### Custom Patterns

```typescript
// Extend layer patterns
const customClassifier = new LayerClassifier();
customClassifier.addPattern('custom-layer', {
  keywords: ['custom', 'special'],
  complexity: 'medium',
  dependencies: 'atoms'
});
```

## 🚨 Error Handling

The analyzers implement robust error handling:

```typescript
try {
  const analysis = await analyzer.analyze(description);
} catch (error) {
  if (error instanceof AIProviderError) {
    // Fallback to rule-based analysis
    const fallback = classifier.classifyWithFallback(description);
  } else {
    // Handle other errors
    console.error('Analysis failed:', error);
  }
}
```

## 📈 Metrics and Monitoring

Track analyzer performance:

```typescript
const metrics = {
  analysisTime: Date.now() - startTime,
  confidence: result.confidence,
  aiProvider: provider.name,
  fallbackUsed: !aiProvider,
  cacheHit: cacheManager.wasHit(key)
};
```

## 🔮 Future Enhancements

Planned improvements:
- **Machine Learning**: Train custom models on Khaos patterns
- **Multi-language**: Support for more programming languages
- **Visual Analysis**: Analyze component screenshots
- **Real-time**: Live analysis during development
- **Team Learning**: Learn from team patterns and preferences

## 📚 Examples

See [`examples/analyzer-usage-example.ts`](../examples/analyzer-usage-example.ts) for comprehensive usage examples covering all analyzers and scenarios.

## 🤝 Contributing

When contributing to the analyzers:

1. **Follow patterns**: Maintain consistency with existing analyzers
2. **Add tests**: Include comprehensive test coverage
3. **Update docs**: Keep documentation current
4. **Consider fallbacks**: Always provide non-AI alternatives
5. **Validate thoroughly**: Test with various input scenarios

## 📄 License

This module is part of the Khaos CLI project and follows the same license terms.