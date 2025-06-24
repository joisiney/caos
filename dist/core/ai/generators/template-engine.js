"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateEngine = exports.TemplateEngine = void 0;
const ejs = __importStar(require("ejs"));
/**
 * Khaos Template Engine
 *
 * Custom EJS-based template engine with Khaos-specific helpers and conventions
 */
class TemplateEngine {
    compiledTemplates = new Map();
    helpers = new Map();
    constructor() {
        this.registerDefaultHelpers();
    }
    /**
     * Render a template with the given context
     */
    async render(template, context) {
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
        }
        catch (error) {
            throw new Error(`Template rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Compile a template for reuse
     */
    async compile(template) {
        const templateHash = this.hashTemplate(template);
        if (this.compiledTemplates.has(templateHash)) {
            return this.compiledTemplates.get(templateHash);
        }
        try {
            const compiledFn = ejs.compile(template, {
                async: true,
                strict: true,
            });
            const compiled = {
                render: async (context) => {
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
        }
        catch (error) {
            throw new Error(`Template compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Register a helper function
     */
    registerHelper(name, helper) {
        this.helpers.set(name, helper);
    }
    /**
     * Get all registered helpers
     */
    getHelpers() {
        return Object.fromEntries(this.helpers);
    }
    /**
     * Register default Khaos helpers
     */
    registerDefaultHelpers() {
        // String transformation helpers
        this.registerHelper('toPascalCase', (context, str) => {
            return this.toPascalCase(str || context.name);
        });
        this.registerHelper('toCamelCase', (context, str) => {
            return this.toCamelCase(str || context.name);
        });
        this.registerHelper('toKebabCase', (context, str) => {
            return this.toKebabCase(str || context.name);
        });
        this.registerHelper('toConstantCase', (context, str) => {
            return this.toConstantCase(str || context.name);
        });
        // Layer-specific helpers
        this.registerHelper('layerSuffix', (context) => {
            const suffixes = {
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
        this.registerHelper('hasFeature', (context, feature) => {
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
            }
            else if (importDef.type === 'named') {
                const typePrefix = importDef.isType ? 'type ' : '';
                return `import ${typePrefix}{ ${importDef.what} } from '${importDef.from}';`;
            }
            else if (importDef.type === 'namespace') {
                return `import * as ${importDef.what} from '${importDef.from}';`;
            }
            return '';
        });
        this.registerHelper('generateImports', (context) => {
            return context.imports
                .map(imp => this.helpers.get('formatImport')(context, imp))
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
        this.registerHelper('formatMethod', (context, method) => {
            const params = method.parameters
                .map((param) => `${param.name}: ${param.type}`)
                .join(', ');
            const asyncKeyword = method.async ? 'async ' : '';
            return `${asyncKeyword}${method.name}(${params}): ${method.returnType}`;
        });
        // Documentation helpers
        this.registerHelper('generateJSDoc', (context, description) => {
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
            return `${context.kebabName}${this.helpers.get('layerSuffix')(context)}.tsx`;
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
        this.registerHelper('if', (context, condition, trueValue, falseValue = '') => {
            return condition ? trueValue : falseValue;
        });
        this.registerHelper('unless', (context, condition, trueValue, falseValue = '') => {
            return !condition ? trueValue : falseValue;
        });
    }
    /**
     * Create helper context for template rendering
     */
    createHelperContext(context) {
        const helperContext = {};
        // Add all helpers to context
        for (const [name, helper] of this.helpers) {
            helperContext[name] = (...args) => helper(context, ...args);
        }
        return helperContext;
    }
    /**
     * Generate hash for template caching
     */
    hashTemplate(template) {
        const crypto = require('crypto');
        return crypto.createHash('md5').update(template).digest('hex');
    }
    /**
     * String transformation utilities
     */
    toPascalCase(str) {
        return str
            .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
            .replace(/^(.)/, char => char.toUpperCase());
    }
    toCamelCase(str) {
        const pascal = this.toPascalCase(str);
        return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    }
    toKebabCase(str) {
        return str
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[\s_]+/g, '-')
            .toLowerCase();
    }
    toConstantCase(str) {
        return this.toKebabCase(str).replace(/-/g, '_').toUpperCase();
    }
    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
exports.TemplateEngine = TemplateEngine;
/**
 * Default template engine instance
 */
exports.templateEngine = new TemplateEngine();
//# sourceMappingURL=template-engine.js.map