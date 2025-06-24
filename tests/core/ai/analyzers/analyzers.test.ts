/**
 * Tests for AI analyzers
 */

import {
  DescriptionAnalyzer,
  LayerClassifier,
  NamingAnalyzer,
  DependencyAnalyzer,
  CodeAnalyzer,
  ContextBuilder,
  createAnalyzerSuite,
  performCompleteAnalysis,
} from '../../../../src/core/ai/analyzers';

// Mock AI provider for testing
const mockAIProvider = {
  name: 'mock-provider',
  version: '1.0.0',
  analyzeDescription: jest.fn(),
  generateCode: jest.fn(),
  validateCode: jest.fn(),
  suggestRefactoring: jest.fn(),
  configure: jest.fn(),
  isConfigured: jest.fn().mockReturnValue(true),
  getUsage: jest.fn().mockReturnValue({
    requests: 0,
    tokens: 0,
    cost: 0,
    errors: 0,
    cacheHitRate: 0,
  }),
  resetUsage: jest.fn(),
  test: jest.fn().mockResolvedValue(undefined),
};

describe('ContextBuilder', () => {
  let contextBuilder: ContextBuilder;

  beforeEach(() => {
    contextBuilder = new ContextBuilder();
  });

  test('should build default context', async () => {
    const context = await contextBuilder.build();

    expect(context).toHaveProperty('projectStructure');
    expect(context).toHaveProperty('existingLayers');
    expect(context).toHaveProperty('projectConfig');
    expect(context).toHaveProperty('framework');
    expect(context).toHaveProperty('metadata');

    expect(context.framework).toBe('react');
    expect(context.projectStructure).toContain('src/atoms/');
    expect(context.projectStructure).toContain('src/molecules/');
  });

  test('should build context with custom data', async () => {
    const customContext = {
      framework: 'vue',
      existingLayers: ['button', 'modal'],
    };

    const context = await contextBuilder.build(customContext);

    expect(context.framework).toBe('vue');
    expect(context.existingLayers).toEqual(['button', 'modal']);
  });

  test('should get layer context', async () => {
    const atomContext = await contextBuilder.getLayerContext('atom');

    expect(atomContext['complexity']).toBe('low');
    expect(atomContext['dependencies']).toBe('none');
    expect(atomContext['reusability']).toBe('high');
    expect(atomContext['patterns']).toContain('button');
  });

  test('should get naming conventions', () => {
    const conventions = contextBuilder.getLayerNamingConventions('atom');

    expect(conventions['suffix']).toBe('.atom.tsx');
    expect(conventions['componentSuffix']).toBe('Atom');
    expect(conventions['namePattern']).toBe('dash-case');
  });
});

describe('LayerClassifier', () => {
  let classifier: LayerClassifier;

  beforeEach(() => {
    classifier = new LayerClassifier();
  });

  test('should classify button as atom', () => {
    const result = classifier.classify('um botão simples com ícone');

    expect(result.primary.layer).toBe('atom');
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.reasoning).toContain('atom');
  });

  test('should classify modal as molecule', () => {
    const result = classifier.classify('modal de confirmação reutilizável');

    expect(result.primary.layer).toBe('molecule');
    expect(result.confidence).toBeGreaterThan(0);
  });

  test('should classify header as organism', () => {
    const result = classifier.classify('header complexo com navegação');

    expect(result.primary.layer).toBe('organism');
    expect(result.confidence).toBeGreaterThan(0);
  });

  test('should classify screen as feature', () => {
    const result = classifier.classify('tela de depósito na carteira');

    expect(result.primary.layer).toBe('feature');
    expect(result.confidence).toBeGreaterThan(0);
  });

  test('should provide alternatives', () => {
    const result = classifier.classify('componente complexo');

    expect(result.alternatives).toHaveLength(3);
    expect(result.alternatives[0]).toHaveProperty('layer');
    expect(result.alternatives[0]).toHaveProperty('score');
  });

  test('should handle fallback classification', () => {
    const result = classifier.classifyWithFallback('texto indefinido');

    expect(result).toHaveProperty('primary');
    expect(result).toHaveProperty('confidence');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('NamingAnalyzer', () => {
  let namingAnalyzer: NamingAnalyzer;

  beforeEach(() => {
    namingAnalyzer = new NamingAnalyzer();
  });

  test('should suggest atom names', async () => {
    const result = await namingAnalyzer.suggestName(
      'botão de confirmação',
      'atom'
    );

    expect(result.primary).toMatch(/^[a-z][a-z0-9-]*$/);
    expect(result.alternatives).toHaveLength(4);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.reasoning).toContain('atom');
  });

  test('should suggest feature names with prefix', async () => {
    const result = await namingAnalyzer.suggestName(
      'tela de depósito',
      'feature',
      { prefix: 'wallet-' }
    );

    expect(result.primary.startsWith('wallet-')).toBe(true);
    expect(result.primary).toMatch(/^wallet-[a-z][a-z0-9-]*$/);
  });

  test('should suggest entity names', async () => {
    const result = await namingAnalyzer.suggestName(
      'dados do usuário',
      'entity'
    );

    expect(result.primary).toMatch(/^T[A-Z][a-zA-Z]*Entity$/);
  });

  test('should suggest gateway names', async () => {
    const result = await namingAnalyzer.suggestName(
      'buscar usuário',
      'gateway'
    );

    expect(result.primary).toMatch(/^(find-one|find-many|create|update|delete)-/);
  });

  test('should handle invalid names', async () => {
    const result = await namingAnalyzer.suggestName(
      'nome com caracteres especiais @#$',
      'atom'
    );

    expect(result.primary).toMatch(/^[a-z][a-z0-9-]*$/);
  });
});

describe('DependencyAnalyzer', () => {
  let dependencyAnalyzer: DependencyAnalyzer;

  beforeEach(() => {
    dependencyAnalyzer = new DependencyAnalyzer();
  });

  test('should analyze atom dependencies', async () => {
    const result = await dependencyAnalyzer.analyzeDependencies(
      'botão simples',
      'atom'
    );

    expect(result.required).toEqual([]);
    expect(result.hierarchy.isValid).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  test('should analyze molecule dependencies', async () => {
    const result = await dependencyAnalyzer.analyzeDependencies(
      'modal com botões',
      'molecule'
    );

    expect(result.required).toContain('atom');
    expect(result.hierarchy.isValid).toBe(true);
  });

  test('should analyze feature dependencies', async () => {
    const result = await dependencyAnalyzer.analyzeDependencies(
      'tela de usuário com dados da API',
      'feature',
      ['api', 'data']
    );

    expect(result.required).toContain('template');
    expect(result.required).toContain('gateway');
    expect(result.required).toContain('entity');
  });

  test('should detect hierarchy violations', async () => {
    // This would be a more complex test in real implementation
    const result = await dependencyAnalyzer.analyzeDependencies(
      'átomo complexo',
      'atom'
    );

    expect(result.hierarchy).toHaveProperty('isValid');
    expect(result.hierarchy).toHaveProperty('allowedDependencies');
  });

  test('should suggest imports', async () => {
    const result = await dependencyAnalyzer.analyzeDependencies(
      'componente React',
      'molecule'
    );

    expect(result.imports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: 'react',
          imports: expect.arrayContaining(['FC']),
        }),
      ])
    );
  });

  test('should suggest file structure', async () => {
    const result = await dependencyAnalyzer.analyzeDependencies(
      'molécula com lógica',
      'molecule'
    );

    const filenames = result.structure.map(f => f.filename);
    expect(filenames).toContain('component.molecule.tsx');
    expect(filenames).toContain('component.type.ts');
    expect(filenames).toContain('component.use-case.ts');
    expect(filenames).toContain('index.ts');
  });
});

describe('CodeAnalyzer', () => {
  let codeAnalyzer: CodeAnalyzer;

  beforeEach(() => {
    codeAnalyzer = new CodeAnalyzer();
  });

  test('should analyze valid atom code', async () => {
    const code = `
import React, { FC } from 'react';
import { TWithTestID } from '@types/global';

interface Props extends TWithTestID {
  children: React.ReactNode;
}

export const ButtonAtom: FC<Props> = ({ children, testID }) => (
  <button data-testid={testID}>
    {children}
  </button>
);
    `;

    const result = await codeAnalyzer.analyzeCode(code, 'atom');

    expect(result.isValid).toBe(true);
    expect(result.score).toBeGreaterThan(70);
    expect(result.metrics.lines).toBeGreaterThan(0);
  });

  test('should detect naming violations', async () => {
    const code = `
export const Button = () => <button>Click me</button>;
    `;

    const result = await codeAnalyzer.analyzeCode(code, 'atom');

    const namingViolation = result.violations.find(
      v => v.rule === 'component-naming-convention'
    );
    expect(namingViolation).toBeDefined();
    expect(namingViolation?.description).toContain('Atom');
  });

  test('should detect use-case violations in molecules', async () => {
    const code = `
import React, { FC } from 'react';

export const ModalMolecule: FC = () => (
  <div>Modal without use-case</div>
);
    `;

    const result = await codeAnalyzer.analyzeCode(code, 'molecule');

    const useCaseViolation = result.violations.find(
      v => v.rule === 'molecule-requires-use-case'
    );
    expect(useCaseViolation).toBeDefined();
  });

  test('should detect code quality issues', async () => {
    const code = `
export const BadComponent = ({ onClick, children }: any) => {
  console.log('Debug message');
  const veryLongLineOfCodeThatExceedsTheRecommendedLengthLimitAndShouldBeBrokenIntoMultipleLinesForBetterReadability = true;
  return <button onClick={onClick}>{children}</button>;
};
    `;

    const result = await codeAnalyzer.analyzeCode(code, 'atom');

    expect(result.issues.length).toBeGreaterThan(0);
    
    const anyTypeIssue = result.violations.find(v => v.rule === 'no-any-type');
    const consoleLogIssue = result.violations.find(v => v.rule === 'no-console-log');
    
    expect(anyTypeIssue || consoleLogIssue).toBeDefined();
  });

  test('should calculate metrics', async () => {
    const code = `
import React, { FC, useState } from 'react';

export const ComplexComponent: FC = () => {
  const [state1, setState1] = useState(false);
  const [state2, setState2] = useState('');
  
  const handleClick = () => {
    if (state1) {
      setState2('clicked');
    } else {
      setState2('not clicked');
    }
  };
  
  return (
    <div>
      <button onClick={handleClick}>
        {state2 || 'Click me'}
      </button>
    </div>
  );
};
    `;

    const result = await codeAnalyzer.analyzeCode(code, 'atom');

    expect(result.metrics.complexity).toBeGreaterThan(0);
    expect(result.metrics.maintainability).toBeGreaterThan(0);
    expect(result.metrics.functions).toBeGreaterThan(0);
  });

  test('should suggest improvements', async () => {
    const code = `
import React, { FC, useEffect, useState } from 'react';

export const ComponentWithIssues: FC = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // Expensive calculation without memoization
    const result = heavyCalculation();
    setData(result);
  }, []);
  
  return <div>{data}</div>;
};

function heavyCalculation() {
  return 'result';
}
    `;

    const result = await codeAnalyzer.analyzeCode(code, 'atom');

    expect(result.suggestions.length).toBeGreaterThan(0);
    
    const memoSuggestion = result.suggestions.find(
      s => s.description.includes('useMemo')
    );
    expect(memoSuggestion).toBeDefined();
  });
});

describe('DescriptionAnalyzer', () => {
  let descriptionAnalyzer: DescriptionAnalyzer;
  let contextBuilder: ContextBuilder;

  beforeEach(() => {
    contextBuilder = new ContextBuilder();
    descriptionAnalyzer = new DescriptionAnalyzer(mockAIProvider, contextBuilder);
  });

  test('should analyze description with AI', async () => {
    mockAIProvider.analyzeDescription.mockResolvedValue({
      layerType: 'atom',
      confidence: 0.9,
      componentName: 'button',
      dependencies: [],
      props: [],
      methods: [],
      metadata: {},
      reasoning: 'Simple UI element',
    });

    const result = await descriptionAnalyzer.analyze('um botão simples');

    expect(result.layerType).toBe('atom');
    expect(result.componentName).toBe('button');
    expect(result.confidence).toBe(0.9);
    expect(mockAIProvider.analyzeDescription).toHaveBeenCalled();
  });

  test('should validate and sanitize names', async () => {
    mockAIProvider.analyzeDescription.mockResolvedValue({
      layerType: 'atom',
      confidence: 0.8,
      componentName: 'Button With Spaces',
      dependencies: [],
      props: [],
      methods: [],
      metadata: {},
      reasoning: 'UI element',
    });

    const result = await descriptionAnalyzer.analyze('botão com espaços');

    expect(result.componentName).toBe('button-with-spaces');
  });

  test('should enrich analysis with metadata', async () => {
    mockAIProvider.analyzeDescription.mockResolvedValue({
      layerType: 'molecule',
      confidence: 0.85,
      componentName: 'modal',
      dependencies: ['atom'],
      props: [],
      methods: [],
      metadata: {},
      reasoning: 'Composite component',
    });

    const result = await descriptionAnalyzer.analyze('modal reutilizável');

    expect(result.metadata).toHaveProperty('imports');
    expect(result.metadata).toHaveProperty('additionalFiles');
    expect(result.metadata).toHaveProperty('layerMetadata');
  });
});

describe('Integration Tests', () => {
  test('should create analyzer suite', () => {
    const suite = createAnalyzerSuite(mockAIProvider);

    expect(suite).toHaveProperty('contextBuilder');
    expect(suite).toHaveProperty('descriptionAnalyzer');
    expect(suite).toHaveProperty('layerClassifier');
    expect(suite).toHaveProperty('namingAnalyzer');
    expect(suite).toHaveProperty('dependencyAnalyzer');
    expect(suite).toHaveProperty('codeAnalyzer');
  });

  test('should perform complete analysis', async () => {
    mockAIProvider.analyzeDescription.mockResolvedValue({
      layerType: 'molecule',
      confidence: 0.9,
      componentName: 'modal',
      dependencies: ['atom'],
      props: [],
      methods: [],
      metadata: {},
      reasoning: 'Composite UI component',
    });

    const result = await performCompleteAnalysis(
      'modal de confirmação',
      mockAIProvider
    );

    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('layer');
    expect(result).toHaveProperty('naming');
    expect(result).toHaveProperty('dependencies');
    expect(result).toHaveProperty('metadata');

    expect(result.metadata.aiProvider).toBe('mock-provider');
    expect(result.metadata.confidence).toBeGreaterThan(0);
  });

  test('should handle analysis without AI provider', async () => {
    const result = await performCompleteAnalysis('botão simples');

    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('layer');
    expect(result).toHaveProperty('naming');
    expect(result).toHaveProperty('dependencies');
    expect(result.metadata.aiProvider).toBe('none');
  });
});

describe('Error Handling', () => {
  test('should handle AI provider failures gracefully', async () => {
    const failingProvider = {
      ...mockAIProvider,
      analyzeDescription: jest.fn().mockRejectedValue(new Error('AI failed')),
    };

    const contextBuilder = new ContextBuilder();
    const analyzer = new DescriptionAnalyzer(failingProvider, contextBuilder);

    // Should not throw, but handle gracefully
    await expect(analyzer.analyze('test description')).rejects.toThrow();
  });

  test('should handle invalid layer types', () => {
    const classifier = new LayerClassifier();
    
    // Should still return a valid classification
    const result = classifier.classify('completely unknown description');
    
    expect(result).toHaveProperty('primary');
    expect(result).toHaveProperty('confidence');
    expect(result.confidence).toBeGreaterThan(0);
  });

  test('should handle empty descriptions', async () => {
    const namingAnalyzer = new NamingAnalyzer();
    
    const result = await namingAnalyzer.suggestName('', 'atom');
    
    expect(result.primary).toBeDefined();
    expect(result.primary.length).toBeGreaterThan(0);
  });
});