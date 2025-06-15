export interface TartarusConfig {
    templates: {
        repository: string;
        gateway: string;
        model: string;
        entity: string;
    };
    directories: {
        repositories: string;
        gateways: string;
        models: string;
        entities: string;
    };
    naming: {
        caseStyle: 'kebab-case' | 'camelCase' | 'PascalCase';
        suffixes: {
            repository: string;
            gateway: string;
            model: string;
            entity: string;
        };
    };
    git: {
        autoCommit: boolean;
        commitTemplate: string;
    };
}
export declare function loadConfig(): Promise<TartarusConfig>;
export declare function createDefaultConfig(): Promise<void>;
//# sourceMappingURL=config.d.ts.map