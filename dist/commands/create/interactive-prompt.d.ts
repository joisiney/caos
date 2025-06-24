import { InteractivePromptConfig, InteractivePromptResult, SmartCreateOptions } from './smart-create.types';
export declare class InteractivePrompt {
    collectInput(): Promise<{
        description: string;
        options: SmartCreateOptions;
    }>;
    confirmAnalysis(config: InteractivePromptConfig): Promise<InteractivePromptResult>;
    private editAnalysis;
    private displayAnalysis;
    private getLayerChoices;
    private getFeatureChoices;
    showProgress(message: string): Promise<void>;
    showSuccess(message: string): Promise<void>;
    showError(message: string, error?: Error): Promise<void>;
    showWarning(message: string): Promise<void>;
    askRetry(message: string): Promise<boolean>;
}
//# sourceMappingURL=interactive-prompt.d.ts.map