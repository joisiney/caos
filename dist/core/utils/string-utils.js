"use strict";
/**
 * String utility functions for Khaos CLI
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPascalCase = toPascalCase;
exports.toCamelCase = toCamelCase;
exports.toKebabCase = toKebabCase;
exports.toSnakeCase = toSnakeCase;
exports.toConstantCase = toConstantCase;
exports.capitalize = capitalize;
exports.pluralize = pluralize;
exports.singularize = singularize;
exports.validateNaming = validateNaming;
exports.sanitizeFileName = sanitizeFileName;
exports.extractNamespace = extractNamespace;
exports.extractBaseName = extractBaseName;
exports.createNamespace = createNamespace;
function toPascalCase(str) {
    return str
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}
function toCamelCase(str) {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
function toSnakeCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase();
}
function toConstantCase(str) {
    return toSnakeCase(str).toUpperCase();
}
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function pluralize(str) {
    if (str.endsWith('y')) {
        return str.slice(0, -1) + 'ies';
    }
    if (str.endsWith('s') || str.endsWith('sh') || str.endsWith('ch') || str.endsWith('x') || str.endsWith('z')) {
        return str + 'es';
    }
    return str + 's';
}
function singularize(str) {
    if (str.endsWith('ies')) {
        return str.slice(0, -3) + 'y';
    }
    if (str.endsWith('es')) {
        return str.slice(0, -2);
    }
    if (str.endsWith('s') && !str.endsWith('ss')) {
        return str.slice(0, -1);
    }
    return str;
}
function validateNaming(name, pattern) {
    return pattern.test(name);
}
function sanitizeFileName(name) {
    return name
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();
}
function extractNamespace(name) {
    const parts = name.split('/');
    return parts.length > 1 ? parts[0] ?? '' : '';
}
function extractBaseName(name) {
    const parts = name.split('/');
    return parts[parts.length - 1] ?? '';
}
function createNamespace(baseName, layer) {
    return `${capitalize(toPascalCase(baseName))}${capitalize(layer)}`;
}
//# sourceMappingURL=string-utils.js.map