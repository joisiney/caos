/**
 * Example usage of the AI analyzers
 * This file demonstrates how to use the intelligent analyzers for layer classification,
 * naming suggestions, dependency analysis, and code validation.
 */

import { ProviderFactory } from '../providers/provider-factory';
import {
  createAnalyzerSuite,
  performComprehensiveAnalysis,
  DescriptionAnalyzer,
  LayerClassifier,
  NamingAnalyzer,
  DependencyAnalyzer,
  CodeAnalyzer,
  ContextBuilder,
} from '../analyzers';

/**
 * Example 1: Basic description analysis
 */
async function exampleBasicAnalysis() {
  console.log('=== Example 1: Basic Description Analysis ===');
  
  try {
    // Get AI provider (will use environment variables)
    const aiProvider = ProviderFactory.getDefaultProvider();
    
    // Create analyzer suite
    const suite = createAnalyzerSuite(aiProvider);
    
    // Analyze a description
    const description = 'um botão reutilizável com variantes de cor e tamanho';
    const analysis = await suite.descriptionAnalyzer.analyze(description);
    
    console.log('Description:', description);
    console.log('Analysis Result:', {
      layerType: analysis.layerType,
      componentName: analysis.componentName,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning,
      dependencies: analysis.dependencies,
    });
    
  } catch (error) {
    console.error('Analysis failed:', error);
  }
}

/**
 * Example 2: Layer classification without AI
 */
function exampleLayerClassification() {
  console.log('\n=== Example 2: Layer Classification (No AI) ===');
  
  const classifier = new LayerClassifier();
  
  const testCases = [
    'um botão simples com ícone',
    'modal de confirmação que pode ser usado em várias telas',
    'header complexo com navegação e busca',
    'tela de depósito na carteira com validação',
    'função utilitária para formatar datas',
  ];
  
  testCases.forEach(description => {
    const classification = classifier.classify(description);
    console.log(`\nDescription: "${description}"`);
    console.log(`Primary: ${classification.primary.layer} (score: ${classification.primary.score.toFixed(2)})`);
    console.log(`Confidence: ${(classification.confidence * 100).toFixed(1)}%`);
    console.log(`Reasoning: ${classification.reasoning}`);
  });
}

/**
 * Example 3: Naming suggestions
 */
async function exampleNamingSuggestions() {
  console.log('\n=== Example 3: Naming Suggestions ===');
  
  try {
    // Try with AI provider first, fallback to rule-based
    let aiProvider;
    try {
      aiProvider = ProviderFactory.getDefaultProvider();
    } catch {
      console.log('No AI provider available, using rule-based naming');
    }
    
    const namingAnalyzer = new NamingAnalyzer(aiProvider);
    
    const testCases = [
      { description: 'botão de confirmação', layer: 'atom' as const },
      { description: 'modal de edição de usuário', layer: 'molecule' as const },
      { description: 'header principal da aplicação', layer: 'organism' as const },
      { description: 'tela de depósito na carteira', layer: 'feature' as const, context: { prefix: 'wallet' } },
      { description: 'função para formatar moeda', layer: 'util' as const },
    ];
    
    for (const testCase of testCases) {
      const suggestion = await namingAnalyzer.suggestName(
        testCase.description,
        testCase.layer,
        testCase.context
      );
      
      console.log(`\nDescription: "${testCase.description}" (${testCase.layer})`);
      console.log(`Primary: ${suggestion.primary}`);
      console.log(`Alternatives: ${suggestion.alternatives.join(', ')}`);
      console.log(`Confidence: ${(suggestion.confidence * 100).toFixed(1)}%`);
      console.log(`Reasoning: ${suggestion.reasoning}`);
    }
    
  } catch (error) {
    console.error('Naming analysis failed:', error);
  }
}

/**
 * Example 4: Dependency analysis
 */
async function exampleDependencyAnalysis() {
  console.log('\n=== Example 4: Dependency Analysis ===');
  
  const dependencyAnalyzer = new DependencyAnalyzer();
  
  const testCases = [
    { description: 'modal com formulário de validação', layer: 'molecule' as const, features: ['validation'] },
    { description: 'tela de usuário com dados da API', layer: 'feature' as const, features: ['api', 'data'] },
    { description: 'header com navegação complexa', layer: 'organism' as const, features: ['navigation'] },
  ];
  
  for (const testCase of testCases) {
    const analysis = await dependencyAnalyzer.analyzeDependencies(
      testCase.description,
      testCase.layer,
      testCase.features
    );
    
    console.log(`\nDescription: "${testCase.description}" (${testCase.layer})`);
    console.log('Required dependencies:', analysis.required);
    console.log('Optional dependencies:', analysis.optional);
    console.log('Suggested imports:', analysis.imports.map(imp => `${imp.imports.join(', ')} from '${imp.from}'`));
    console.log('File structure:', analysis.structure.map(file => file.filename));
    console.log('Hierarchy valid:', analysis.hierarchy.isValid);
    
    if (analysis.violations.length > 0) {
      console.log('Violations:', analysis.violations.map(v => v.message));
    }
  }
}

/**
 * Example 5: Code analysis
 */
async function exampleCodeAnalysis() {
  console.log('\n=== Example 5: Code Analysis ===');
  
  try {
    let aiProvider;
    try {
      aiProvider = ProviderFactory.getDefaultProvider();
    } catch {
      console.log('No AI provider available, using static analysis only');
    }
    
    const codeAnalyzer = new CodeAnalyzer(aiProvider);
    
    // Example code with some issues
    const sampleCode = `
import React, { FC, useState } from 'react';

export const Button = ({ onClick, children }: any) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  console.log('Button rendered');
  
  const handleClick = () => {
    setLoading(true);
    // Very long line that exceeds the recommended length limit and should be broken into multiple lines for better readability
    onClick && onClick();
    setLoading(false);
  };
  
  return (
    <button onClick={handleClick}>
      {loading ? 'Loading...' : children}
    </button>
  );
};
    `;
    
    const analysis = await codeAnalyzer.analyzeCode(sampleCode, 'atom');
    
    console.log('Code Analysis Results:');
    console.log(`Overall Score: ${analysis.score.toFixed(1)}/100`);
    console.log(`Valid: ${analysis.isValid}`);
    
    console.log('\nMetrics:');
    console.log(`- Complexity: ${analysis.metrics.complexity}`);
    console.log(`- Maintainability: ${analysis.metrics.maintainability.toFixed(1)}`);
    console.log(`- Readability: ${analysis.metrics.readability.toFixed(1)}`);
    console.log(`- Lines: ${analysis.metrics.lines}`);
    
    if (analysis.issues.length > 0) {
      console.log('\nIssues found:');
      analysis.issues.forEach(issue => {
        console.log(`- [${issue.severity}] ${issue.message} (line ${issue.line || 'unknown'})`);
      });
    }
    
    if (analysis.violations.length > 0) {
      console.log('\nArchitectural violations:');
      analysis.violations.forEach(violation => {
        console.log(`- [${violation.severity}] ${violation.description}`);
        console.log(`  Suggestion: ${violation.suggestion}`);
      });
    }
    
    if (analysis.suggestions.length > 0) {
      console.log('\nImprovement suggestions:');
      analysis.suggestions.forEach(suggestion => {
        console.log(`- [${suggestion.impact} impact] ${suggestion.description}`);
      });
    }
    
  } catch (error) {
    console.error('Code analysis failed:', error);
  }
}

/**
 * Example 6: Complete analysis workflow
 */
async function exampleCompleteWorkflow() {
  console.log('\n=== Example 6: Complete Analysis Workflow ===');
  
  try {
    let aiProvider;
    try {
      aiProvider = ProviderFactory.getDefaultProvider();
      console.log(`Using AI Provider: ${aiProvider.name}`);
    } catch {
      console.log('No AI provider available, using fallback methods');
    }
    
    const description = 'modal de confirmação reutilizável com botões de ação';
    const context = {
      projectType: 'react',
      framework: 'react',
      existingComponents: ['button', 'icon'],
    };
    
    console.log(`Analyzing: "${description}"`);
    
    const result = await performComprehensiveAnalysis(description, aiProvider, context);
    
    console.log('\nComplete Analysis Result:');
    console.log('='.repeat(50));
    
    console.log('\n📝 Description Analysis:');
    console.log(`- Layer: ${result.description.layerType}`);
    console.log(`- Component Name: ${result.description.componentName}`);
    console.log(`- Confidence: ${(result.description.confidence * 100).toFixed(1)}%`);
    
    console.log('\n🏷️ Layer Classification:');
    console.log(`- Primary: ${result.layer.primary.layer} (${result.layer.primary.score.toFixed(1)})`);
    console.log(`- Alternatives: ${result.layer.alternatives.map((alt: any) => alt.layer).join(', ')}`);
    
    console.log('\n📛 Naming Suggestions:');
    console.log(`- Primary: ${result.naming.primary}`);
    console.log(`- Alternatives: ${result.naming.alternatives.join(', ')}`);
    
    console.log('\n🔗 Dependencies:');
    console.log(`- Required: ${result.dependencies.required.join(', ') || 'none'}`);
    console.log(`- Optional: ${result.dependencies.optional.join(', ') || 'none'}`);
    console.log(`- Files: ${result.dependencies.structure.map((f: any) => f.filename).join(', ')}`);
    
    console.log('\n📊 Metadata:');
    console.log(`- Analyzed at: ${result.metadata.analyzedAt}`);
    console.log(`- AI Provider: ${result.metadata.aiProvider}`);
    console.log(`- Overall Confidence: ${(result.metadata.confidence * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('Complete analysis failed:', error);
  }
}

/**
 * Example 7: Context building
 */
async function exampleContextBuilding() {
  console.log('\n=== Example 7: Context Building ===');
  
  const contextBuilder = new ContextBuilder();
  
  const projectContext = {
    framework: 'react',
    projectType: 'web-app',
    existingComponents: ['button', 'input', 'modal'],
    conventions: {
      naming: 'dash-case',
      testing: 'jest',
    },
  };
  
  const context = await contextBuilder.build(projectContext);
  
  console.log('Built Context:');
  console.log(`- Framework: ${context.framework}`);
  console.log(`- Project Structure: ${context.projectStructure?.slice(0, 3).join(', ')}...`);
  console.log(`- Existing Layers: ${context.existingLayers?.join(', ') || 'none detected'}`);
  console.log(`- Project Config:`, context.projectConfig);
  
  // Get layer-specific context
  const atomContext = await contextBuilder.getLayerContext('atom');
  console.log('\nAtom Layer Context:');
  console.log(`- Complexity: ${atomContext['complexity']}`);
  console.log(`- Dependencies: ${atomContext['dependencies']}`);
  console.log(`- Patterns: ${atomContext['patterns']?.join(', ')}`);
  
  // Get naming conventions
  const namingConventions = contextBuilder.getLayerNamingConventions('molecule');
  console.log('\nMolecule Naming Conventions:');
  console.log(`- Suffix: ${namingConventions['suffix']}`);
  console.log(`- Component Suffix: ${namingConventions['componentSuffix']}`);
  console.log(`- Examples: ${namingConventions['examples']?.join(', ')}`);
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('🤖 AI Analyzers Usage Examples');
  console.log('=' .repeat(60));
  
  try {
    await exampleBasicAnalysis();
    exampleLayerClassification();
    await exampleNamingSuggestions();
    await exampleDependencyAnalysis();
    await exampleCodeAnalysis();
    await exampleCompleteWorkflow();
    await exampleContextBuilding();
    
    console.log('\n✅ All examples completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Examples failed:', error);
  }
}

// Export examples for individual testing
export {
  exampleBasicAnalysis,
  exampleLayerClassification,
  exampleNamingSuggestions,
  exampleDependencyAnalysis,
  exampleCodeAnalysis,
  exampleCompleteWorkflow,
  exampleContextBuilding,
  runAllExamples,
};

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}