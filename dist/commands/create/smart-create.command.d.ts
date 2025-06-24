import { Command } from 'commander';
export declare class SmartCreateCommand {
    private service;
    private config;
    constructor();
    createCommand(): Command;
    private execute;
    private determineMode;
    private parseOptions;
    private executeInteractive;
    private executeDirect;
    private executeBatch;
    private displayResult;
    private displaySingleResult;
    private displayBatchResults;
    private displayReport;
    private handleError;
    private getErrorSuggestions;
    private getDefaultConfig;
    static register(program: Command): void;
}
//# sourceMappingURL=smart-create.command.d.ts.map