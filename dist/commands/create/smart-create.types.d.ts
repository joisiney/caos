import { LayerType } from '../../core/types';
import { LayerAnalysis, GeneratedCode } from '../../core/ai/types';
export interface SmartCreateOptions {
    description?: string;
    layer?: LayerType;
    name?: string;
    features?: string[];
    provider?: 'openai' | 'anthropic' | 'openrouter';
    model?: string;
    interactive?: boolean;
    dryRun?: boolean;
    force?: boolean;
    verbose?: boolean;
    saveAnalysis?: boolean;
}
export interface SmartCreateInput {
    description: string;
    targetDirectory?: string;
    options: SmartCreateOptions;
}
export interface SmartCreateResult {
    success: boolean;
    analysis: LayerAnalysis;
    generated?: GeneratedCode;
    filesCreated: string[];
    errors: string[];
    warnings: string[];
    metadata: {
        executionTime: number;
        provider: string;
        model: string;
        cacheHit: boolean;
        analysisId: string;
    };
}
export interface InteractivePromptConfig {
    description: string;
    analysis: LayerAnalysis;
    options: SmartCreateOptions;
}
export interface InteractivePromptResult {
    confirmed: boolean;
    modifiedAnalysis?: LayerAnalysis;
    modifiedOptions?: SmartCreateOptions;
}
export interface SmartCreateState {
    phase: 'input' | 'analysis' | 'confirmation' | 'generation' | 'complete' | 'error';
    input?: SmartCreateInput;
    analysis?: LayerAnalysis;
    result?: SmartCreateResult;
    error?: Error;
    startTime: number;
}
export interface AnalysisCache {
    key: string;
    analysis: LayerAnalysis;
    timestamp: number;
    expiresAt: number;
}
export interface SmartCreateReport {
    summary: string;
    analysis: {
        layer: LayerType;
        name: string;
        confidence: number;
        reasoning: string;
    };
    generation: {
        filesCreated: number;
        linesOfCode: number;
        validationScore: number;
    };
    performance: {
        analysisTime: number;
        generationTime: number;
        totalTime: number;
        cacheHit: boolean;
    };
    nextSteps: string[];
}
export declare enum SmartCreateMode {
    INTERACTIVE = "interactive",
    DIRECT = "direct",
    BATCH = "batch"
}
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    suggestions: string[];
}
export interface ValidationError {
    type: 'syntax' | 'convention' | 'architecture' | 'dependency';
    message: string;
    file?: string;
    line?: number;
    severity: 'error' | 'warning';
}
export interface ValidationWarning {
    type: 'style' | 'performance' | 'best-practice';
    message: string;
    file?: string;
    line?: number;
    suggestion?: string;
}
export interface SmartCreateConfig {
    defaultProvider: 'openai' | 'anthropic' | 'openrouter';
    aiProvider?: 'openai' | 'anthropic' | 'openrouter';
    cacheEnabled: boolean;
    cacheTTL: number;
    maxRetries: number;
    timeout: number;
    verboseOutput: boolean;
    autoConfirm: boolean;
    backupFiles: boolean;
}
//# sourceMappingURL=smart-create.types.d.ts.map