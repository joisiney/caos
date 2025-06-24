import { FileGenerationContext, GeneratedFile, TemplateContext } from '../types';
/**
 * File Generator for Khaos CLI
 *
 * Manages file and directory creation for generated components
 */
export declare class FileGenerator {
    /**
     * Generate files for a component
     */
    generateFiles(context: FileGenerationContext): Promise<void>;
    /**
     * Generate a single file
     */
    private generateFile;
    /**
     * Create subdirectories based on layer structure
     */
    private createSubdirectories;
    /**
     * Get subdirectories needed for a layer
     */
    private getSubdirectoriesForLayer;
    /**
     * Ensure directory exists
     */
    private ensureDirectory;
    /**
     * Generate component directory name
     */
    generateComponentDirectoryName(context: TemplateContext): string;
    /**
     * Get target directory path for component
     */
    getTargetDirectoryPath(baseDirectory: string, layer: string, componentName: string, context: TemplateContext): string;
    /**
     * Check if file already exists
     */
    fileExists(filePath: string): Promise<boolean>;
    /**
     * Create backup of existing file
     */
    createBackup(filePath: string): Promise<string>;
    /**
     * Generate file structure preview
     */
    generateFileStructurePreview(context: FileGenerationContext): string;
    /**
     * Validate file generation context
     */
    validateContext(context: FileGenerationContext): {
        isValid: boolean;
        issues: string[];
    };
    /**
     * Clean up generated files (for rollback)
     */
    cleanupFiles(context: FileGenerationContext): Promise<void>;
    /**
     * Remove empty directories
     */
    private removeEmptyDirectories;
    /**
     * Calculate file statistics
     */
    calculateFileStatistics(files: GeneratedFile[]): {
        totalFiles: number;
        requiredFiles: number;
        optionalFiles: number;
        totalSize: number;
        averageSize: number;
    };
}
/**
 * Default file generator instance
 */
export declare const fileGenerator: FileGenerator;
//# sourceMappingURL=file-generator.d.ts.map