/**
 * Core types for AI integration in Khaos CLI
 */

export interface AnalysisContext {
  /** Current project structure */
  projectStructure?: string[];
  /** Existing layer types in the project */
  existingLayers?: string[];
  /** Project configuration */
  projectConfig?: Record<string, any>;
  /** Target framework (React, Vue, Angular, etc.) */
  framework?: string;
  /** Additional context information */
  metadata?: Record<string, any>;
}

export interface LayerAnalysis {
  /** Identified layer type */
  layerType: string;
  /** Confidence score (0-1) */
  confidence: number;
  /** Suggested component name */
  componentName: string;
  /** Identified dependencies */
  dependencies: string[];
  /** Suggested props/parameters */
  props: PropertyDefinition[];
  /** Suggested methods/functions */
  methods: MethodDefinition[];
  /** Additional metadata */
  metadata: Record<string, any>;
  /** Reasoning for the analysis */
  reasoning: string;
}

export interface PropertyDefinition {
  /** Property name */
  name: string;
  /** Property type */
  type: string;
  /** Whether the property is required */
  required: boolean;
  /** Default value if any */
  defaultValue?: any;
  /** Property description */
  description?: string;
}

export interface MethodDefinition {
  /** Method name */
  name: string;
  /** Method parameters */
  parameters: PropertyDefinition[];
  /** Return type */
  returnType: string;
  /** Method description */
  description?: string;
  /** Whether the method is async */
  async?: boolean;
}

export interface GeneratedCode {
  /** Generated files with their content */
  files: Record<string, string>;
  /** Validation result */
  validation?: ValidationResult;
  /** Generation metadata */
  metadata: {
    layer: string;
    name: string;
    generatedAt: Date;
    aiProvider: string;
    confidence: number;
  };
}

export interface ValidationResult {
  /** Whether the code is valid */
  isValid: boolean;
  /** List of validation errors */
  errors: ValidationIssue[];
  /** List of validation warnings */
  warnings: ValidationIssue[];
  /** Overall quality score */
  score: number;
  /** Suggested improvements */
  improvements: string[];
}

export interface ValidationIssue {
  /** Issue type */
  type: 'error' | 'warning' | 'suggestion';
  /** Issue message */
  message: string;
  /** Line number where the issue occurs */
  line?: number;
  /** Column number where the issue occurs */
  column?: number;
  /** Suggestion for fixing the issue */
  suggestion?: string;
}

export interface ValidationRules {
  /** Layer type being validated */
  layer: string;
  /** Validation prompt */
  prompt: string;
  /** Additional context */
  context?: any;
}

export interface ValidationSuggestions {
  /** Whether the code is valid */
  isValid: boolean;
  /** List of issues found */
  issues: ValidationIssue[];
  /** Overall quality score (0-1) */
  score: number;
  /** List of improvement suggestions */
  improvements: string[];
}

export interface Template {
  /** Template name */
  name: string;
  /** Template content */
  content: string;
  /** Template description */
  description?: string;
  /** Template variables */
  variables?: Record<string, any>;
}

export interface ProviderConfig {
  /** API key for the provider */
  apiKey: string;
  /** Model to use */
  model: string;
  /** Temperature for generation */
  temperature: number;
  /** Maximum tokens */
  maxTokens: number;
  /** Request timeout */
  timeout: number;
}

export interface OpenAIConfig extends ProviderConfig {
  /** OpenAI specific model */
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'gpt-4-turbo';
}

export interface AnthropicConfig extends ProviderConfig {
  /** Anthropic specific model */
  model: 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307' | 'claude-3-5-sonnet-20241022';
}

export interface OpenRouterConfig extends ProviderConfig {
  /** OpenRouter specific model (any available model) */
  model: string;
  /** App URL for tracking */
  appUrl?: string;
  /** Fallback models */
  fallbackModels?: string[];
  /** Daily spending limit */
  dailyLimit?: number;
  /** Per-request spending limit */
  perRequestLimit?: number;
}

export interface UsageStats {
  /** Total requests made */
  requests: number;
  /** Total tokens used */
  tokens: number;
  /** Total cost */
  cost: number;
  /** Number of errors */
  errors: number;
  /** Cache hit rate */
  cacheHitRate: number;
}

export interface CodeIssue {
  /** Issue type */
  type: string;
  /** Issue description */
  description: string;
  /** File where the issue occurs */
  file: string;
  /** Line number */
  line?: number;
  /** Severity level */
  severity: 'low' | 'medium' | 'high';
}

export interface RefactoringSuggestions {
  /** List of refactoring suggestions */
  suggestions: RefactoringSuggestion[];
  /** Overall confidence score */
  confidence: number;
  /** Estimated impact */
  impact: 'low' | 'medium' | 'high';
}

export interface RefactoringSuggestion {
  /** Type of refactoring */
  type: string;
  /** Description of the suggestion */
  description: string;
  /** Code changes to apply */
  changes: CodeChange[];
  /** Confidence score for this suggestion */
  confidence: number;
}

export interface CodeChange {
  /** File to modify */
  file: string;
  /** Original code */
  original: string;
  /** Replacement code */
  replacement: string;
  /** Line number */
  line?: number;
}

export type CacheType = 'analysis' | 'generation' | 'validation';

export interface CacheEntry {
  /** Cached data */
  data: any;
  /** Timestamp when cached */
  timestamp: number;
  /** Cache type */
  type: CacheType;
}