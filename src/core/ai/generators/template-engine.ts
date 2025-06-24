import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs/promises';
import {
  TemplateEngine as ITemplateEngine,
  TemplateContext,
  CompiledTemplate,
  TemplateHelper,
} from '../types';

/**
 * Khaos Template Engine
 * 
 * Custom EJS-based template engine with Khaos-specific helpers and conventions
 */
export class TemplateEngine implements ITemplateEngine {
  private compiledTemplates: Map<string, CompiledTemplate> = new Map();
  private helpers: Map<string, TemplateHelper> = new Map();

  constructor() {
    this.registerDefaultHelpers();
  }

  /**
   * Render a template with the given context
   */
  async render(template: string, context: TemplateContext): Promise<string> {
    try {
      // Create enhanced context with helpers
      const enhancedContext = {
        ...context,
        ...this.createHelperContext(context),
      };

      const result = await ejs.render(template, enhancedContext, {
        async: true,
        strict: true,
      });

      return result;
    } catch (error) {
      throw new Error(`Template rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compile a template for reuse
   */
  async compile(template: string): Promise<CompiledTemplate> {
    const templateHash = this.hashTemplate(template);
    
    if (this.compiledTemplates.has(templateHash)) {
      return this.compiledTemplates.get(templateHash)!;
    }

    try {
      const compiledFn = ejs.compile(template, {
        async: true,
        strict: true,
      });

      const compiled: CompiledTemplate = {
        render: async (context: TemplateContext) => {
          const enhancedContext = {
            ...context,
            ...this.createHelperContext(context),
          };
          return await compiledFn(enhancedContext);
        },
        metadata: {
          compiled: new Date(),
          source: template,
        },
      };

      this.compiledTemplates.set(templateHash, compiled);
      return compiled;
    } catch (error) {
      throw new Error(`Template compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Register a helper function
   */
  registerHelper(name: string, helper: TemplateHelper): void {
    this.helpers.set(name, helper);
  }

  /**
   * Get all registered helpers
   */
  getHelpers(): Record<string, TemplateHelper> {
    return Object.fromEntries(this.helpers);
  }

  /**
   * Register default Khaos helpers
   */
  private registerDefaultHelpers(): void {
    // String transformation helpers
    this.registerHelper('toPascalCase', (context, str: string) => {
      return this.toPascalCase(str || context.name);
    });

    this.registerHelper('toCamelCase', (context, str: string) => {
      return this.toCamelCase(str || context.name);
    });

    this.registerHelper('toKebabCase', (context, str: string) => {
      return this.toKebabCase(str || context.name);
    });

    this.registerHelper('toConstantCase', (context, str: string) => {
      return this.toConstantCase(str || context.name);
    });

    // Layer-specific helpers
    this.registerHelper('layerSuffix', (context) => {
      const suffixes: Record<string, string> = {
        atom: '.atom',
        molecule: '.molecule',
        organism: '.organism',
        template: '.template',
        feature: '.feature',
        layout: '.layout',
        particle: '.particle',
        model: '.model',
        entity: '.entity',
        util: '.util',
        gateway: '.gateway',
        repository: '.repository',
      };
      return suffixes[context.layer] || '';
    });

    this.registerHelper('hasFeature', (context, feature: string) => {
      return context.features.includes(feature).toString();
    });

    this.registerHelper('requiresPrefix', (context) => {
      const prefixLayers = ['feature', 'layout'];
      return prefixLayers.includes(context.layer).toString();
    });

    // Import helpers
    this.registerHelper('formatImport', (context, importDef) => {
      if (importDef.type === 'default') {
        return `import ${importDef.what} from '${importDef.from}';`;
      } else if (importDef.type === 'named') {
        const typePrefix = importDef.isType ? 'type ' : '';
        return `import ${typePrefix}{ ${importDef.what} } from '${importDef.from}';`;
      } else if (importDef.type === 'namespace') {
        return `import * as ${importDef.what} from '${importDef.from}';`;
      }
      return '';
    });

    this.registerHelper('generateImports', (context) => {
      return context.imports
        .map(imp => this.helpers.get('formatImport')!(context, imp))
        .join('\n');
    });

    // Props helpers
    this.registerHelper('formatPropType', (context, prop) => {
      let type = prop.type;
      if (!prop.required) {
        type += '?';
      }
      return `${prop.name}${type}: ${prop.type}`;
    });

    this.registerHelper('generatePropsInterface', (context) => {
      if (!context.props.length) {
        return `export interface ${context.namespace}Props {
  /** Test ID for testing purposes */
  testID?: string;
}`;
      }

      const propsStr = context.props
        .map(prop => {
          const optional = prop.required ? '' : '?';
          const description = prop.description ? `  /** ${prop.description} */\n` : '';
          return `${description}  ${prop.name}${optional}: ${prop.type};`;
        })
        .join('\n');

      return `export interface ${context.namespace}Props {
  /** Test ID for testing purposes */
  testID?: string;
${propsStr}
}`;
    });

    // Methods helpers
    this.registerHelper('formatMethod', (context, method: any) => {
      const params = method.parameters
        .map((param: any) => `${param.name}: ${param.type}`)
        .join(', ');
      
      const asyncKeyword = method.async ? 'async ' : '';
      return `${asyncKeyword}${method.name}(${params}): ${method.returnType}`;
    });

    // Documentation helpers
    this.registerHelper('generateJSDoc', (context, description?: string) => {
      const desc = description || context.description;
      return `/**
 * ${context.pascalName} ${this.capitalizeFirstLetter(context.layer)} Component
 * 
 * @description ${desc}
 * @layer ${context.layer}
 * @namespace ${context.namespace}
 */`;
    });

    // File naming helpers
    this.registerHelper('componentFileName', (context) => {
      return `${context.kebabName}${this.helpers.get('layerSuffix')!(context)}.tsx`;
    });

    this.registerHelper('typeFileName', (context) => {
      return `${context.kebabName}.type.ts`;
    });

    this.registerHelper('variantFileName', (context) => {
      return `${context.kebabName}.variant.ts`;
    });

    this.registerHelper('constantFileName', (context) => {
      return `${context.kebabName}.constant.ts`;
    });

    this.registerHelper('mockFileName', (context) => {
      return `${context.kebabName}.mock.ts`;
    });

    this.registerHelper('storyFileName', (context) => {
      return `${context.kebabName}.stories.tsx`;
    });

    this.registerHelper('specFileName', (context) => {
      return `${context.kebabName}.spec.ts`;
    });

    this.registerHelper('useCaseFileName', (context) => {
      return `${context.kebabName}.use-case.ts`;
    });

    // Conditional rendering helpers
    this.registerHelper('if', (context, condition: boolean, trueValue: string, falseValue: string = '') => {
      return condition ? trueValue : falseValue;
    });

    this.registerHelper('unless', (context, condition: boolean, trueValue: string, falseValue: string = '') => {
      return !condition ? trueValue : falseValue;
    });
  }

  /**
   * Create helper context for template rendering
   */
  private createHelperContext(context: TemplateContext): Record<string, any> {
    const helperContext: Record<string, any> = {};

    // Add all helpers to context
    for (const [name, helper] of this.helpers) {
      helperContext[name] = (...args: any[]) => helper(context, ...args);
    }

    return helperContext;
  }

  /**
   * Generate hash for template caching
   */
  private hashTemplate(template: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(template).digest('hex');
  }

  /**
   * String transformation utilities
   */
  private toPascalCase(str: string): string {
    return str
      .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
      .replace(/^(.)/, char => char.toUpperCase());
  }

  private toCamelCase(str: string): string {
    const pascal = this.toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }

  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  private toConstantCase(str: string): string {
    return this.toKebabCase(str).replace(/-/g, '_').toUpperCase();
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

/**
 * Default template engine instance
 */
export const templateEngine = new TemplateEngine(); 