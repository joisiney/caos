/**
 * Core types for Khaos CLI
 */
export type LayerType = 'atom' | 'molecule' | 'organism' | 'template' | 'feature' | 'layout' | 'particle' | 'model' | 'entity' | 'util' | 'gateway' | 'repository';
export interface ProjectConfig {
    name: string;
    version: string;
    framework: 'react' | 'vue' | 'angular';
    typescript: boolean;
    layers: LayerType[];
    conventions: ConventionConfig;
}
export interface ConventionConfig {
    naming: 'kebab-case' | 'camelCase' | 'PascalCase';
    fileExtensions: {
        component: '.tsx' | '.jsx' | '.vue';
        style: '.css' | '.scss' | '.module.css';
        test: '.test.ts' | '.spec.ts';
    };
    directories: {
        components: string;
        styles: string;
        tests: string;
    };
}
export interface ComponentInfo {
    name: string;
    layer: LayerType;
    path: string;
    files: string[];
    dependencies: string[];
}
export interface ValidationError {
    type: 'error' | 'warning' | 'info';
    message: string;
    file?: string;
    line?: number;
    column?: number;
    rule?: string;
}
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
    info: ValidationError[];
}
export interface ValidationWarning {
    code: string;
    message: string;
    file: string;
    line?: number;
    column?: number;
    suggestion?: string;
}
export interface ValidationMetadata {
    layer: LayerType;
    name: string;
    validatedAt: Date;
    duration: number;
    rulesApplied: string[];
}
export interface LayerConfig {
    name: string;
    layer: LayerType;
    requiredFiles: string[];
    optionalFiles: string[];
    restrictedFiles: string[];
    namingConventions: NamingRules;
    structureRules: StructureRules;
    dependencies: DependencyRules;
}
export interface NamingRules {
    pattern: RegExp;
    examples: string[];
    description: string;
}
export interface StructureRules {
    hasTestID: boolean;
    exportsFromIndex: boolean;
    usesNamespace: boolean;
    hasCompositionRoot?: boolean;
    maxComplexity?: number;
}
export interface DependencyRules {
    canDependOn: LayerType[];
    cannotDependOn: LayerType[];
    mustImport?: string[];
    cannotImport?: string[];
}
export interface AIProviderConfig {
    provider: 'openai' | 'anthropic' | 'openrouter';
    apiKey: string;
    model: string;
    temperature: number;
    maxTokens: number;
    fallback?: {
        enabled: boolean;
        provider: string;
        models: string[];
    };
}
export interface TemplateContext {
    name: string;
    layer: LayerType;
    pascalName: string;
    camelName: string;
    kebabName: string;
    namespace: string;
    imports: string[];
    exports: string[];
    features: string[];
    metadata: Record<string, unknown>;
}
export interface CodeGenerationResult {
    files: Record<string, string>;
    validation: ValidationResult;
    metadata: {
        layer: LayerType;
        name: string;
        generatedAt: Date;
        aiProvider: string;
        confidence: number;
    };
}
export interface LayerAnalysis {
    intent: string;
    suggestedLayer: LayerType;
    confidence: number;
    suggestedName: string;
    requiredFeatures: string[];
    optionalFeatures: string[];
    dependencies: string[];
}
//# sourceMappingURL=types.d.ts.map