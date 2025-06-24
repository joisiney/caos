"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextBuilder = exports.CodeAnalyzer = exports.DependencyAnalyzer = exports.NamingAnalyzer = exports.LayerClassifier = exports.DescriptionAnalyzer = void 0;
exports.createAnalyzerSuite = createAnalyzerSuite;
exports.performComprehensiveAnalysis = performComprehensiveAnalysis;
// Re-export analyzer classes (main exports)
var description_analyzer_1 = require("./description-analyzer");
Object.defineProperty(exports, "DescriptionAnalyzer", { enumerable: true, get: function () { return description_analyzer_1.DescriptionAnalyzer; } });
var layer_classifier_1 = require("./layer-classifier");
Object.defineProperty(exports, "LayerClassifier", { enumerable: true, get: function () { return layer_classifier_1.LayerClassifier; } });
var naming_analyzer_1 = require("./naming-analyzer");
Object.defineProperty(exports, "NamingAnalyzer", { enumerable: true, get: function () { return naming_analyzer_1.NamingAnalyzer; } });
var dependency_analyzer_1 = require("./dependency-analyzer");
Object.defineProperty(exports, "DependencyAnalyzer", { enumerable: true, get: function () { return dependency_analyzer_1.DependencyAnalyzer; } });
var code_analyzer_1 = require("./code-analyzer");
Object.defineProperty(exports, "CodeAnalyzer", { enumerable: true, get: function () { return code_analyzer_1.CodeAnalyzer; } });
var context_builder_1 = require("./context-builder");
Object.defineProperty(exports, "ContextBuilder", { enumerable: true, get: function () { return context_builder_1.ContextBuilder; } });
// Types from description analyzer - commented out due to missing export
// export type {
//   ContextualAnalysis,
// } from './description-analyzer';
/**
 * Create analyzer suite with AI provider
 */
function createAnalyzerSuite(aiProvider) {
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
async function performComprehensiveAnalysis(description, aiProvider, context) {
    const suite = createAnalyzerSuite(aiProvider);
    // Primary description analysis
    const descriptionAnalysis = await suite.descriptionAnalyzer.analyze(description, context);
    // Layer classification
    const layerAnalysis = suite.layerClassifier.classify(description, descriptionAnalysis.layerType, []);
    // Naming suggestions
    const namingAnalysis = await suite.namingAnalyzer.suggestName(description, descriptionAnalysis.layerType, context);
    // Dependency analysis
    const dependencyAnalysis = suite.dependencyAnalyzer.analyzeDependencies(descriptionAnalysis.layerType, []);
    return {
        description: descriptionAnalysis,
        layer: layerAnalysis,
        naming: namingAnalysis,
        dependencies: dependencyAnalysis,
    };
}
//# sourceMappingURL=index.js.map