import type { AIProviderConfig, LayerConfig } from '@/core/types';
export declare const defaultAIConfig: AIProviderConfig;
export declare const layerConfigs: Record<string, LayerConfig>;
export declare const validationRules: {
    strict: boolean;
    autoFix: boolean;
    ignorePatterns: string[];
    customRules: {
        'enforce-testid': string;
        'enforce-namespace': string;
        'enforce-composition-root': string;
        'restrict-utils-usage': string;
    };
};
export declare const templateConfig: {
    directory: string;
    variables: {
        author: string;
        license: string;
        version: string;
    };
};
//# sourceMappingURL=default.d.ts.map