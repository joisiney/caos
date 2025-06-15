"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toKebabCase = toKebabCase;
exports.toPascalCase = toPascalCase;
exports.toCamelCase = toCamelCase;
exports.suggestName = suggestName;
exports.isKhaosProject = isKhaosProject;
exports.findRelatedFiles = findRelatedFiles;
exports.sanitizeName = sanitizeName;
exports.createSpinner = createSpinner;
exports.formatBytes = formatBytes;
exports.isAbsolutePath = isAbsolutePath;
exports.normalizePath = normalizePath;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
/**
 * Converte string para kebab-case
 */
function toKebabCase(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}
/**
 * Converte string para PascalCase
 */
function toPascalCase(str) {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}
/**
 * Converte string para camelCase
 */
function toCamelCase(str) {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
/**
 * Sugere nome baseado na descrição
 */
function suggestName(description) {
    // Remove palavras comuns
    const stopWords = [
        'gerenciar', 'criar', 'para', 'do', 'da', 'dos', 'das', 'de', 'em', 'com', 'por',
        'um', 'uma', 'o', 'a', 'os', 'as', 'e', 'ou', 'que', 'se', 'na', 'no', 'ter',
        'ser', 'estar', 'fazer', 'get', 'post', 'put', 'delete', 'fetch', 'send'
    ];
    let suggested = description
        .toLowerCase()
        .split(/\s+/)
        .filter(word => !stopWords.includes(word))
        .filter(word => word.length > 2)
        .join('-');
    // Se não sobrou nada, usar palavra padrão
    if (!suggested) {
        suggested = 'item';
    }
    return toKebabCase(suggested);
}
/**
 * Verifica se o projeto tem estrutura Khaos
 */
async function isKhaosProject() {
    const indicators = [
        'src/repositories',
        'src/gateways',
        'src/models',
        'src/entities',
        '.tartarusrc.json',
        'tartarus.config.json'
    ];
    for (const indicator of indicators) {
        if (await fs_extra_1.default.pathExists(indicator)) {
            return true;
        }
    }
    return false;
}
/**
 * Encontra arquivos relacionados a um nome
 */
async function findRelatedFiles(name, basePath = 'src') {
    const related = [];
    const dirs = ['repositories', 'gateways', 'models', 'entities'];
    for (const dir of dirs) {
        const dirPath = path_1.default.join(basePath, dir);
        if (!await fs_extra_1.default.pathExists(dirPath))
            continue;
        const files = await fs_extra_1.default.readdir(dirPath);
        for (const file of files) {
            if (file.includes(name) && file.endsWith('.ts')) {
                related.push(path_1.default.join(dirPath, file));
            }
        }
    }
    return related;
}
/**
 * Limpa e valida nome de entrada
 */
function sanitizeName(input) {
    if (!input || input.trim().length === 0) {
        return { name: '', isValid: false, error: 'Nome não pode ser vazio' };
    }
    const cleaned = toKebabCase(input.trim());
    // Validações
    if (cleaned.length < 2) {
        return { name: cleaned, isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
    }
    if (!/^[a-z0-9-]+$/.test(cleaned)) {
        return { name: cleaned, isValid: false, error: 'Use apenas letras minúsculas, números e hífens' };
    }
    if (cleaned.startsWith('-') || cleaned.endsWith('-')) {
        return { name: cleaned, isValid: false, error: 'Nome não pode começar ou terminar com hífen' };
    }
    // Palavras reservadas/problemáticas
    const reserved = ['class', 'function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'try', 'catch', 'finally', 'throw', 'return', 'break', 'continue'];
    if (reserved.includes(cleaned)) {
        return { name: cleaned, isValid: false, error: 'Nome não pode ser uma palavra reservada' };
    }
    return { name: cleaned, isValid: true };
}
/**
 * Cria spinner de loading simples
 */
function createSpinner(text) {
    const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const interval = setInterval(() => {
        process.stdout.write(`\r${frames[i]} ${text}`);
        i = (i + 1) % frames.length;
    }, 100);
    return {
        stop: (finalText) => {
            clearInterval(interval);
            process.stdout.write(`\r${finalText || text}\n`);
        }
    };
}
/**
 * Formata bytes para tamanho legível
 */
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
/**
 * Verifica se string é um caminho absoluto
 */
function isAbsolutePath(filePath) {
    return path_1.default.isAbsolute(filePath);
}
/**
 * Normaliza separadores de caminho
 */
function normalizePath(filePath) {
    return filePath.replace(/\\/g, '/');
}
