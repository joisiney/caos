/**
 * String utility functions for Khaos CLI
 */
export declare function toPascalCase(str: string): string;
export declare function toCamelCase(str: string): string;
export declare function toKebabCase(str: string): string;
export declare function toSnakeCase(str: string): string;
export declare function toConstantCase(str: string): string;
export declare function capitalize(str: string): string;
export declare function pluralize(str: string): string;
export declare function singularize(str: string): string;
export declare function validateNaming(name: string, pattern: RegExp): boolean;
export declare function sanitizeFileName(name: string): string;
export declare function extractNamespace(name: string): string;
export declare function extractBaseName(name: string): string;
export declare function createNamespace(baseName: string, layer: string): string;
//# sourceMappingURL=string-utils.d.ts.map