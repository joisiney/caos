import { CodeGenerator } from '../../core/ai/generators/code-generator';
import { InteractivePrompt } from './interactive-prompt';
import { SmartCreateInput, SmartCreateResult, SmartCreateState, SmartCreateReport, SmartCreateConfig } from './smart-create.types';
export declare class SmartCreateService {
    private cache;
    private state;
    private config;
    private interactivePrompt;
    private codeGenerator;
    private aiProvider;
    constructor(config: SmartCreateConfig, codeGenerator: CodeGenerator, interactivePrompt?: InteractivePrompt);
    /**
     * Create initial state for the service
     */
    private createInitialState;
    /**
     * Initialize AI provider based on configuration or environment
     */
    private initializeAIProvider;
    execute(input: SmartCreateInput): Promise<SmartCreateResult>;
    executeInteractive(): Promise<SmartCreateResult>;
    executeBatch(descriptions: string[], options: any): Promise<SmartCreateResult[]>;
    private analyzeDescription;
    /**
     * Perform real AI analysis using configured provider
     */
    private performAIAnalysis;
    /**
     * Perform heuristic analysis as fallback
     */
    private performHeuristicAnalysis;
    private classifyLayerHeuristic;
    private extractNameHeuristic;
    private extractFeaturesHeuristic;
    private getRequiredFiles;
    private confirmWithUser;
    private generateCode;
    private createDryRunResult;
    private createSuccessResult;
    private createErrorResult;
    private createCancelledResult;
    private transitionTo;
    private cacheAnalysis;
    private getCachedAnalysis;
    private generateCacheKey;
    generateReport(result: SmartCreateResult): SmartCreateReport;
    private countLinesOfCode;
    private generateNextSteps;
    getState(): SmartCreateState;
    clearCache(): void;
}
//# sourceMappingURL=smart-create.service.d.ts.map