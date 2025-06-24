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

// Import the AI provider interface
import { AIProvider } from '../providers/ai-provider.interface';

// Core analyzers
export { DescriptionAnalyzer } from './description-analyzer';
export { LayerClassifier } from './layer-classifier';
export { NamingAnalyzer } from './naming-analyzer';
export { DependencyAnalyzer } from './dependency-analyzer';
export { CodeAnalyzer } from './code-analyzer';
export { ContextBuilder } from './context-builder';

// Types from layer classifier
export type {
  LayerPattern,
  LayerScore,
  LayerClassification,
  LayerType,
} from './layer-classifier';

// Types from naming analyzer
export type {
  NamingSuggestion,
  NamingContext,
} from './naming-analyzer';

// Types from dependency analyzer
export type {
  DependencyAnalysis,
  ImportSuggestion,
  FileSuggestion,
  DependencyViolation,
  HierarchyValidation,
} from './dependency-analyzer';

// Types from code analyzer
export type {
  CodeAnalysisResult,
  CodeIssue,
  CodeSuggestion,
  CodeMetrics,
  ArchitecturalViolation,
} from './code-analyzer';

/**
 * Factory function to create a complete analyzer suite
 * @param aiProvider - AI provider instance
 * @returns Object with all analyzers configured
 */
export function createAnalyzerSuite(aiProvider?: AIProvider) {
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
  contextBuilder: ContextBuilder;
  descriptionAnalyzer: DescriptionAnalyzer;
  layerClassifier: LayerClassifier;
  namingAnalyzer: NamingAnalyzer;
  dependencyAnalyzer: DependencyAnalyzer;
  codeAnalyzer: CodeAnalyzer;
}

/**
 * Complete analysis workflow
 * @param description - Natural language description
 * @param aiProvider - AI provider instance
 * @param context - Optional context
 * @returns Complete analysis result
 */
export async function performCompleteAnalysis(
  description: string,
  aiProvider?: AIProvider,
  context?: Record<string, any>
) {
  const suite = createAnalyzerSuite(aiProvider);

  // Step 1: Analyze description
  const descriptionAnalysis = await suite.descriptionAnalyzer.analyze(description, context);

  // Step 2: Classify layer (fallback if AI fails)
  const layerClassification = suite.layerClassifier.classify(description);

  // Step 3: Suggest naming
  const namingSuggestion = await suite.namingAnalyzer.suggestName(
    description,
    descriptionAnalysis.layerType as LayerType,
    context
  );

  // Step 4: Analyze dependencies
  const dependencyAnalysis = await suite.dependencyAnalyzer.analyzeDependencies(
    description,
    descriptionAnalysis.layerType as LayerType,
    [],
    context
  );

  return {
    description: descriptionAnalysis,
    layer: layerClassification,
    naming: namingSuggestion,
    dependencies: dependencyAnalysis,
    metadata: {
      analyzedAt: new Date().toISOString(),
      aiProvider: aiProvider?.name || 'none',
      confidence: Math.min(
        descriptionAnalysis.confidence,
        layerClassification.confidence,
        namingSuggestion.confidence
      ),
    },
  };
}

/**
 * Complete analysis result type
 */
export interface CompleteAnalysisResult {
  description: any; // LayerAnalysis from types.ts
  layer: LayerClassification;
  naming: NamingSuggestion;
  dependencies: DependencyAnalysis;
  metadata: {
    analyzedAt: string;
    aiProvider: string;
    confidence: number;
  };
}