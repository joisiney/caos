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
import { AnalysisContext } from '../types';
export { DescriptionAnalyzer } from './description-analyzer';
export { LayerClassifier } from './layer-classifier';
export { NamingAnalyzer } from './naming-analyzer';
export { DependencyAnalyzer } from './dependency-analyzer';
export { CodeAnalyzer } from './code-analyzer';
export { ContextBuilder } from './context-builder';
export type { LayerPattern, LayerScore, } from './layer-classifier';
export type { NamingContext, } from './naming-analyzer';
export type { DependencyViolation, HierarchyValidation, } from './dependency-analyzer';
export type { CodeMetrics, ArchitecturalViolation, } from './code-analyzer';
/**
 * Create analyzer suite with AI provider
 */
export declare function createAnalyzerSuite(aiProvider?: AIProvider): {
    contextBuilder: any;
    descriptionAnalyzer: any;
    layerClassifier: any;
    namingAnalyzer: any;
    dependencyAnalyzer: any;
    codeAnalyzer: any;
};
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
/**
 * Perform comprehensive analysis
 */
export declare function performComprehensiveAnalysis(description: string, aiProvider?: AIProvider, context?: AnalysisContext): Promise<any>;
//# sourceMappingURL=index.d.ts.map