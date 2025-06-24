import { LayerAnalysis, LayerTemplate, TemplateSelection, TemplateRegistry, LayerStructure } from '../types';
import { AIProvider } from '../providers/ai-provider.interface';
/**
 * Template Selector for Khaos CLI
 *
 * Selects appropriate templates based on layer analysis
 */
export declare class TemplateSelector {
    private templateRegistry;
    private aiProvider?;
    constructor(templateRegistry: TemplateRegistry, aiProvider?: AIProvider);
    /**
     * Select the best template for the given analysis
     */
    selectTemplate(analysis: LayerAnalysis): Promise<TemplateSelection>;
    /**
     * Select template using AI
     */
    private selectWithAI;
    /**
     * Select template using rules
     */
    private selectWithRules;
    /**
     * Calculate template score based on analysis
     */
    private calculateTemplateScore;
    /**
     * Extract features from analysis
     */
    private extractFeaturesFromAnalysis;
    /**
     * Estimate complexity of analysis
     */
    private estimateComplexity;
    /**
     * Estimate template complexity
     */
    private estimateTemplateComplexity;
    /**
     * Build AI selection prompt
     */
    private buildSelectionPrompt;
    /**
     * Parse AI response
     */
    private parseAIResponse;
    /**
     * Generate reasoning for template selection
     */
    private generateReasoning;
    /**
     * Get custom template by name
     */
    getCustomTemplate(templateName: string, layer: string): Promise<LayerTemplate | null>;
    /**
     * Register a custom template
     */
    registerCustomTemplate(template: LayerTemplate): void;
}
/**
 * Default Template Registry Implementation
 */
export declare class DefaultTemplateRegistry implements TemplateRegistry {
    private templates;
    private layerStructures;
    constructor();
    getTemplatesForLayer(layer: string): LayerTemplate[];
    getTemplate(layer: string, name: string): LayerTemplate | null;
    registerTemplate(template: LayerTemplate): void;
    getLayerStructure(layer: string): LayerStructure | null;
    private initializeDefaultTemplates;
    private initializeLayerStructures;
}
/**
 * Default template selector instance
 */
export declare const createTemplateSelector: (aiProvider?: AIProvider) => TemplateSelector;
//# sourceMappingURL=template-selector.d.ts.map