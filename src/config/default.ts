import type { AIProviderConfig, LayerConfig } from '@/core/types';

export const defaultAIConfig: AIProviderConfig = {
  provider: 'openrouter',
  apiKey: process.env['OPENROUTER_API_KEY'] ?? '',
  model: 'anthropic/claude-3.5-sonnet',
  temperature: 0.7,
  maxTokens: 2000,
  fallback: {
    enabled: true,
    provider: 'openai',
    models: ['openai/gpt-4-turbo', 'meta-llama/llama-3.1-70b'],
  },
};

export const layerConfigs: Record<string, LayerConfig> = {
  atom: {
    name: 'atom',
    layer: 'atom',
    requiredFiles: ['index.ts', '*.atom.tsx', '*.type.ts'],
    optionalFiles: ['*.constant.ts', '*.mock.ts', '*.spec.ts'],
    restrictedFiles: ['*.variant.ts', '*.stories.tsx', '*.use-case.ts', '_services/'],
    namingConventions: {
      pattern: /^[a-z]+(-[a-z]+)*$/,
      examples: ['button', 'input-field', 'loading-spinner'],
      description: 'Must be dash-case',
    },
    structureRules: {
      hasTestID: true,
      exportsFromIndex: true,
      usesNamespace: true,
      hasCompositionRoot: true,
      maxComplexity: 5,
    },
    dependencies: {
      canDependOn: [],
      cannotDependOn: ['molecule', 'organism', 'template', 'feature', 'layout'],
      mustImport: ['react'],
    },
  },
  molecule: {
    name: 'molecule',
    layer: 'molecule',
    requiredFiles: ['index.ts', '*.molecule.tsx', '*.type.ts', '*.use-case.ts'],
    optionalFiles: ['*.constant.ts', '*.mock.ts', '*.spec.ts'],
    restrictedFiles: ['*.variant.ts', '*.stories.tsx'],
    namingConventions: {
      pattern: /^[a-z]+(-[a-z]+)*$/,
      examples: ['login-form', 'search-bar', 'user-card'],
      description: 'Must be dash-case',
    },
    structureRules: {
      hasTestID: true,
      exportsFromIndex: true,
      usesNamespace: true,
      hasCompositionRoot: true,
      maxComplexity: 10,
    },
    dependencies: {
      canDependOn: ['atom'],
      cannotDependOn: ['organism', 'template', 'feature', 'layout'],
      mustImport: ['react'],
    },
  },
  organism: {
    name: 'organism',
    layer: 'organism',
    requiredFiles: ['index.ts', '*.organism.tsx', '*.type.ts', '*.use-case.ts'],
    optionalFiles: ['*.constant.ts', '*.mock.ts', '*.spec.ts'],
    restrictedFiles: ['*.variant.ts', '*.stories.tsx'],
    namingConventions: {
      pattern: /^[a-z]+(-[a-z]+)*$/,
      examples: ['header', 'sidebar', 'product-list'],
      description: 'Must be dash-case',
    },
    structureRules: {
      hasTestID: true,
      exportsFromIndex: true,
      usesNamespace: true,
      hasCompositionRoot: true,
      maxComplexity: 15,
    },
    dependencies: {
      canDependOn: ['atom', 'molecule'],
      cannotDependOn: ['template', 'feature', 'layout'],
      mustImport: ['react'],
    },
  },
  template: {
    name: 'template',
    layer: 'template',
    requiredFiles: ['index.ts', '*.template.tsx', '*.type.ts'],
    optionalFiles: ['*.constant.ts', '*.mock.ts', '*.spec.ts'],
    restrictedFiles: ['*.variant.ts', '*.stories.tsx', '*.use-case.ts'],
    namingConventions: {
      pattern: /^[a-z]+(-[a-z]+)*$/,
      examples: ['dashboard', 'profile-page', 'settings-layout'],
      description: 'Must be dash-case',
    },
    structureRules: {
      hasTestID: true,
      exportsFromIndex: true,
      usesNamespace: true,
      hasCompositionRoot: true,
      maxComplexity: 20,
    },
    dependencies: {
      canDependOn: ['atom', 'molecule', 'organism'],
      cannotDependOn: ['feature', 'layout'],
      mustImport: ['react'],
    },
  },
  feature: {
    name: 'feature',
    layer: 'feature',
    requiredFiles: ['index.ts', '*.feature.tsx', '*.type.ts', '*.use-case.ts'],
    optionalFiles: ['*.constant.ts', '*.mock.ts', '*.spec.ts'],
    restrictedFiles: ['*.variant.ts', '*.stories.tsx'],
    namingConventions: {
      pattern: /^[a-z]+(-[a-z]+)*$/,
      examples: ['strategy-investors', 'auth-login', 'dashboard-overview'],
      description: 'Must be dash-case',
    },
    structureRules: {
      hasTestID: true,
      exportsFromIndex: true,
      usesNamespace: true,
      maxComplexity: 25,
    },
    dependencies: {
      canDependOn: ['template'],
      cannotDependOn: ['atom', 'molecule', 'organism', 'layout'],
      mustImport: ['react'],
    },
  },
  layout: {
    name: 'layout',
    layer: 'layout',
    requiredFiles: ['_layout.tsx'],
    optionalFiles: ['index.ts', '*.type.ts', '*.constant.ts', '*.spec.ts', '*.tsx'],
    restrictedFiles: ['*.stories.tsx', '*.variant.ts', '*.mock.ts', '*.use-case.ts', '_services/'],
    namingConventions: {
      pattern: /^[a-z]+(-[a-z]+)*$/,
      examples: ['strategy', 'auth', 'dashboard-settings'],
      description: 'Must be dash-case and directory-based',
    },
    structureRules: {
      hasTestID: false,
      exportsFromIndex: false,
      usesNamespace: false,
      maxComplexity: 5,
    },
    dependencies: {
      canDependOn: ['feature'],
      cannotDependOn: ['atom', 'molecule', 'organism', 'template'],
      mustImport: ['expo-router'],
    },
  },
};

export const validationRules = {
  strict: false,
  autoFix: true,
  ignorePatterns: [
    'src/legacy/**',
    '**/*.test.ts',
    '**/*.spec.ts',
    'node_modules/**',
    'dist/**',
  ],
  customRules: {
    'enforce-testid': 'error',
    'enforce-namespace': 'warn',
    'enforce-composition-root': 'error',
    'restrict-utils-usage': 'error',
  },
};

export const templateConfig = {
  directory: './src/templates',
  variables: {
    author: 'Development Team',
    license: 'MIT',
    version: '1.0.0',
  },
};