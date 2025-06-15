/**
 * Converte string para kebab-case
 */
export declare function toKebabCase(str: string): string;
/**
 * Converte string para PascalCase
 */
export declare function toPascalCase(str: string): string;
/**
 * Converte string para camelCase
 */
export declare function toCamelCase(str: string): string;
/**
 * Sugere nome baseado na descrição
 */
export declare function suggestName(description: string): string;
/**
 * Verifica se o projeto tem estrutura Khaos
 */
export declare function isKhaosProject(): Promise<boolean>;
/**
 * Encontra arquivos relacionados a um nome
 */
export declare function findRelatedFiles(name: string, basePath?: string): Promise<string[]>;
/**
 * Limpa e valida nome de entrada
 */
export declare function sanitizeName(input: string): {
    name: string;
    isValid: boolean;
    error?: string;
};
/**
 * Cria spinner de loading simples
 */
export declare function createSpinner(text: string): {
    stop: (finalText?: string) => void;
};
/**
 * Formata bytes para tamanho legível
 */
export declare function formatBytes(bytes: number): string;
/**
 * Verifica se string é um caminho absoluto
 */
export declare function isAbsolutePath(filePath: string): boolean;
/**
 * Normaliza separadores de caminho
 */
export declare function normalizePath(filePath: string): string;
//# sourceMappingURL=helpers.d.ts.map