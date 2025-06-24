/**
 * AI Analyzers - Intelligent analysis components for Khaos CLI
 *
 * This module provides intelligent analyzers that use AI providers to:
 * - Analyze natural language descriptions
 * - Classify components into appropriate layers
 * - Suggest naming conventions
 * - Analyze dependencies and imports
 * - Validate existing code
 * - Build context for AI operations
 */

import { AIProvider } from '../providers/ai-provider.interface';
import { LayerAnalysis, AnalysisContext } from '../types';

// Re-export analyzer classes (main exports)
export { DescriptionAnalyzer } from './description-analyzer';
export { LayerClassifier } from './layer-classifier';
export { NamingAnalyzer } from './naming-analyzer';
export { DependencyAnalyzer } from './dependency-analyzer';
export { CodeAnalyzer } from './code-analyzer';
export { ContextBuilder } from './context-builder';

// Re-export types from local types file - commented out due to missing file
// export type {
//   LayerClassification,
//   NamingSuggestion,
//   DependencyAnalysis,
//   CodeAnalysisResult,
//   ImportSuggestion,
//   FileSuggestion,
//   CodeIssue,
//   CodeSuggestion,
// } from './types';

// Types from layer classifier
export type {
  LayerPattern,
  LayerScore,
} from './layer-classifier';

// Types from naming analyzer
export type {
  NamingContext,
} from './naming-analyzer';

// Types from dependency analyzer
export type {
  DependencyViolation,
  HierarchyValidation,
} from './dependency-analyzer';

// Types from code analyzer
export type {
  CodeMetrics,
  ArchitecturalViolation,
} from './code-analyzer';

// Types from description analyzer - commented out due to missing export
// export type {
//   ContextualAnalysis,
// } from './description-analyzer';

/**
 * Create analyzer suite with AI provider
 */
export function createAnalyzerSuite(aiProvider?: AIProvider) {
  // Import classes locally to avoid conflicts
  const { DescriptionAnalyzer } = require('./description-analyzer');
  const { LayerClassifier } = require('./layer-classifier');
  const { NamingAnalyzer } = require('./naming-analyzer');
  const { DependencyAnalyzer } = require('./dependency-analyzer');
  const { CodeAnalyzer } = require('./code-analyzer');
  const { ContextBuilder } = require('./context-builder');

  const contextBuilder = new ContextBuilder();
  const descriptionAnalyzer = new DescriptionAnalyzer(aiProvider, contextBuilder);
  const layerClassifier = new LayerClassifier();
  const namingAnalyzer = new NamingAnalyzer(aiProvider);
  const dependencyAnalyzer = new DependencyAnalyzer();
  const codeAnalyzer = new CodeAnalyzer(aiProvider);

  return {
    contextBuilder,
    descriptionAnalyzer,
    layerClassifier,
    namingAnalyzer,
    dependencyAnalyzer,
    codeAnalyzer,
  };
}

/**
 * Analyzer suite interface
 */
export interface AnalyzerSuite {
  contextBuilder: any;
  descriptionAnalyzer: any;
  layerClassifier: any;
  namingAnalyzer: any;
  dependencyAnalyzer: any;
  codeAnalyzer: any;
}

/**
 * Comprehensive analysis result - commented out due to missing types
 */
// export interface ComprehensiveAnalysis {
//   description: LayerAnalysis;
//   layer: LayerClassification;
//   naming: NamingSuggestion;
//   dependencies: DependencyAnalysis;
//   code?: CodeAnalysisResult;
// }

/**
 * Perform comprehensive analysis
 */
export async function performComprehensiveAnalysis(
  description: string,
  aiProvider?: AIProvider,
  context?: AnalysisContext
): Promise<any> {
  const suite = createAnalyzerSuite(aiProvider);
  
  // Primary description analysis
  const descriptionAnalysis = await suite.descriptionAnalyzer.analyze(description, context);
  
  // Layer classification
  const layerAnalysis = suite.layerClassifier.classify(
    description,
    descriptionAnalysis.layerType,
    []
  );
  
  // Naming suggestions
  const namingAnalysis = await suite.namingAnalyzer.suggestName(
    description,
    descriptionAnalysis.layerType,
    context
  );
  
  // Dependency analysis
  const dependencyAnalysis = suite.dependencyAnalyzer.analyzeDependencies(
    descriptionAnalysis.layerType,
    []
  );

  return {
    description: descriptionAnalysis,
    layer: layerAnalysis,
    naming: namingAnalysis,
    dependencies: dependencyAnalysis,
  };
}