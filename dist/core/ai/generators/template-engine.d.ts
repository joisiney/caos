import { TemplateEngine as ITemplateEngine, TemplateContext, CompiledTemplate, TemplateHelper } from '../types';
/**
 * Khaos Template Engine
 *
 * Custom EJS-based template engine with Khaos-specific helpers and conventions
 */
export declare class TemplateEngine implements ITemplateEngine {
    private compiledTemplates;
    private helpers;
    constructor();
    /**
     * Render a template with the given context
     */
    render(template: string, context: TemplateContext): Promise<string>;
    /**
     * Compile a template for reuse
     */
    compile(template: string): Promise<CompiledTemplate>;
    /**
     * Register a helper function
     */
    registerHelper(name: string, helper: TemplateHelper): void;
    /**
     * Get all registered helpers
     */
    getHelpers(): Record<string, TemplateHelper>;
    /**
     * Register default Khaos helpers
     */
    private registerDefaultHelpers;
    /**
     * Create helper context for template rendering
     */
    private createHelperContext;
    /**
     * Generate hash for template caching
     */
    private hashTemplate;
    /**
     * String transformation utilities
     */
    private toPascalCase;
    private toCamelCase;
    private toKebabCase;
    private toConstantCase;
    private capitalizeFirstLetter;
}
/**
 * Default template engine instance
 */
export declare const templateEngine: TemplateEngine;
//# sourceMappingURL=template-engine.d.ts.map