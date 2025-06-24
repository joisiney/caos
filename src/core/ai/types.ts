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

/**
 * Generator-specific types
 */

export interface TemplateContext {
  /** Component name in different cases */
  name: string;
  kebabName: string;
  pascalName: string;
  camelName: string;
  /** Component namespace */
  namespace: string;
  /** Component description */
  description: string;
  /** Layer type */
  layer: string;
  /** Props definitions */
  props: PropertyDefinition[];
  /** Methods definitions */
  methods: MethodDefinition[];
  /** Features enabled */
  features: string[];
  /** Dependencies */
  dependencies: string[];
  /** Imports needed */
  imports: ImportDefinition[];
  /** Additional context data */
  metadata: Record<string, any>;
}

export interface ImportDefinition {
  /** What to import */
  what: string;
  /** From where to import */
  from: string;
  /** Import type (default, named, namespace) */
  type: 'default' | 'named' | 'namespace';
  /** Is it a type import */
  isType?: boolean;
}

export interface TemplateFile {
  /** Template name/identifier */
  name: string;
  /** Template content */
  content: string;
  /** File path relative to component directory */
  relativePath: string;
  /** Whether this file is required */
  required: boolean;
  /** Conditions for including this file */
  conditions?: string[];
}

export interface LayerTemplate {
  /** Layer type */
  layer: string;
  /** Template name */
  name: string;
  /** Template description */
  description: string;
  /** Template files */
  files: TemplateFile[];
  /** Required features for this template */
  requiredFeatures?: string[];
  /** Optional features this template supports */
  supportedFeatures?: string[];
}

export interface FileGenerationContext {
  /** Target directory */
  targetDirectory: string;
  /** Component name */
  componentName: string;
  /** Layer type */
  layer: string;
  /** Files to generate */
  filesToGenerate: GeneratedFile[];
  /** Template context */
  templateContext: TemplateContext;
}

export interface GeneratedFile {
  /** File name */
  name: string;
  /** File content */
  content: string;
  /** File path relative to component directory */
  relativePath: string;
  /** Whether this file was required */
  required: boolean;
  /** Generation metadata */
  metadata: {
    template: string;
    generatedAt: Date;
    aiEnhanced: boolean;
  };
}

export interface TemplateSelection {
  /** Selected template */
  template: LayerTemplate;
  /** Confidence in the selection */
  confidence: number;
  /** Reasoning for the selection */
  reasoning: string;
  /** Alternative templates considered */
  alternatives: LayerTemplate[];
}

export interface VariableExtractionResult {
  /** Extracted template context */
  context: TemplateContext;
  /** Files that should be generated */
  filesToGenerate: string[];
  /** Validation results */
  validation: {
    isValid: boolean;
    issues: ValidationIssue[];
  };
}

export interface CodeEnhancement {
  /** Original code */
  original: string;
  /** Enhanced code */
  enhanced: string;
  /** Enhancement type */
  type: 'ai-improvement' | 'validation-fix' | 'convention-fix';
  /** Changes made */
  changes: string[];
  /** Confidence in enhancement */
  confidence: number;
}

export interface GenerationOptions {
  /** Whether to use AI enhancement */
  useAIEnhancement: boolean;
  /** Whether to validate generated code */
  validateCode: boolean;
  /** Whether to auto-fix validation errors */
  autoFix: boolean;
  /** Custom template to use */
  customTemplate?: string;
  /** Additional features to enable */
  features?: string[];
  /** Target directory override */
  targetDirectory?: string;
}

export interface LayerStructure {
  /** Layer type */
  layer: string;
  /** Required files for this layer */
  requiredFiles: string[];
  /** Optional files for this layer */
  optionalFiles: string[];
  /** Prefix requirements */
  prefixRequired: boolean;
  /** Default prefix for the layer */
  defaultPrefix?: string;
  /** Directory structure */
  directories: {
    /** Main component directory */
    main: string;
    /** Services subdirectory (if applicable) */
    services?: string;
    /** Partials subdirectory (if applicable) */
    partials?: string;
  };
}

export interface TemplateEngine {
  /** Render a template with context */
  render(template: string, context: TemplateContext): Promise<string>;
  /** Compile a template for reuse */
  compile(template: string): Promise<CompiledTemplate>;
  /** Register a helper function */
  registerHelper(name: string, helper: TemplateHelper): void;
  /** Get available helpers */
  getHelpers(): Record<string, TemplateHelper>;
}

export interface CompiledTemplate {
  /** Render the compiled template */
  render(context: TemplateContext): Promise<string>;
  /** Template metadata */
  metadata: {
    compiled: Date;
    source: string;
  };
}

export type TemplateHelper = (context: TemplateContext, ...args: any[]) => string | Promise<string>;

export interface TemplateRegistry {
  /** Get all templates for a layer */
  getTemplatesForLayer(layer: string): LayerTemplate[];
  /** Get a specific template */
  getTemplate(layer: string, name: string): LayerTemplate | null;
  /** Register a new template */
  registerTemplate(template: LayerTemplate): void;
  /** Get layer structure */
  getLayerStructure(layer: string): LayerStructure | null;
}