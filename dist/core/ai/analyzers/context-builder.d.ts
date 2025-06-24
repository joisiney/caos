import { AnalysisContext } from '../types';
/**
 * Builds context for AI analysis operations
 */
export declare class ContextBuilder {
    /**
     * Build analysis context from project information
     * @param projectContext - Optional project context data
     * @returns Promise with built analysis context
     */
    build(projectContext?: Record<string, any>): Promise<AnalysisContext>;
    /**
     * Get project structure information
     */
    private getProjectStructure;
    /**
     * Get existing layers in the project
     */
    private getExistingLayers;
    /**
     * Get project configuration
     */
    private getProjectConfig;
    /**
     * Detect the framework being used
     */
    private detectFramework;
    /**
     * Build additional metadata
     */
    private buildMetadata;
    /**
     * Get context for specific layer type
     */
    getLayerContext(layerType: string): Promise<Record<string, any>>;
    /**
     * Get naming conventions for layer
     */
    getLayerNamingConventions(layerType: string): Record<string, any>;
}
//# sourceMappingURL=context-builder.d.ts.map