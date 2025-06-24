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
exports.fileGenerator = exports.FileGenerator = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
/**
 * File Generator for Khaos CLI
 *
 * Manages file and directory creation for generated components
 */
class FileGenerator {
    /**
     * Generate files for a component
     */
    async generateFiles(context) {
        try {
            // Create main directory
            await this.ensureDirectory(context.targetDirectory);
            // Create subdirectories if needed
            await this.createSubdirectories(context);
            // Generate all files
            for (const file of context.filesToGenerate) {
                await this.generateFile(context, file);
            }
            console.log(`✅ Generated ${context.filesToGenerate.length} files for ${context.componentName}`);
        }
        catch (error) {
            throw new Error(`File generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Generate a single file
     */
    async generateFile(context, file) {
        const filePath = path.join(context.targetDirectory, file.relativePath);
        try {
            // Ensure parent directory exists
            const parentDir = path.dirname(filePath);
            await this.ensureDirectory(parentDir);
            // Write file content
            await fs.writeFile(filePath, file.content, 'utf8');
            console.log(`📄 Generated: ${file.relativePath}`);
        }
        catch (error) {
            throw new Error(`Failed to generate file ${file.relativePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Create subdirectories based on layer structure
     */
    async createSubdirectories(context) {
        const { layer, targetDirectory } = context;
        // Create layer-specific subdirectories
        const subdirectories = this.getSubdirectoriesForLayer(layer);
        for (const subdir of subdirectories) {
            const subdirPath = path.join(targetDirectory, subdir);
            await this.ensureDirectory(subdirPath);
        }
    }
    /**
     * Get subdirectories needed for a layer
     */
    getSubdirectoriesForLayer(layer) {
        const subdirectories = [];
        switch (layer) {
            case 'molecule':
            case 'organism':
                // These layers might need _services subdirectory
                subdirectories.push('_services');
                break;
            case 'feature':
                // Features need _services and might need _partials
                subdirectories.push('_services');
                break;
            case 'organism':
                // Organisms might need _partials
                subdirectories.push('_partials');
                break;
        }
        return subdirectories;
    }
    /**
     * Ensure directory exists
     */
    async ensureDirectory(dirPath) {
        try {
            await fs.access(dirPath);
        }
        catch {
            await fs.mkdir(dirPath, { recursive: true });
        }
    }
    /**
     * Generate component directory name
     */
    generateComponentDirectoryName(context) {
        const { kebabName, layer } = context;
        // Add layer suffix for certain layers
        const layerSuffixes = {
            atom: '',
            molecule: '',
            organism: '',
            template: '',
            feature: '',
            layout: '',
            particle: '-particle',
            model: '-model',
            entity: '-entity',
            util: '-util',
            gateway: '-gateway',
            repository: '-repository',
        };
        const suffix = layerSuffixes[layer] || '';
        return `${kebabName}${suffix}`;
    }
    /**
     * Get target directory path for component
     */
    getTargetDirectoryPath(baseDirectory, layer, componentName, context) {
        const layerPaths = {
            atom: 'components/atoms',
            molecule: 'components/molecules',
            organism: 'components/organisms',
            template: 'components/templates',
            feature: 'components/features',
            layout: 'components/layouts',
            particle: 'components/particles',
            model: 'core/application/domain/models',
            entity: 'core/application/domain/entities',
            util: 'core/utils',
            gateway: 'core/infra/gateways',
            repository: 'core/infra/repositories',
        };
        const layerPath = layerPaths[layer] || 'components/misc';
        const dirName = this.generateComponentDirectoryName(context);
        return path.join(baseDirectory, layerPath, dirName);
    }
    /**
     * Check if file already exists
     */
    async fileExists(filePath) {
        try {
            await fs.access(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Create backup of existing file
     */
    async createBackup(filePath) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = `${filePath}.backup-${timestamp}`;
        try {
            await fs.copyFile(filePath, backupPath);
            return backupPath;
        }
        catch (error) {
            throw new Error(`Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Generate file structure preview
     */
    generateFileStructurePreview(context) {
        const { componentName, filesToGenerate, targetDirectory } = context;
        const lines = [];
        lines.push(`📁 ${path.basename(targetDirectory)}/`);
        // Group files by directory
        const filesByDir = {};
        for (const file of filesToGenerate) {
            const dir = path.dirname(file.relativePath);
            if (!filesByDir[dir]) {
                filesByDir[dir] = [];
            }
            filesByDir[dir].push(file);
        }
        // Sort directories
        const sortedDirs = Object.keys(filesByDir).sort();
        for (const dir of sortedDirs) {
            if (dir !== '.') {
                lines.push(`  📁 ${dir}/`);
            }
            const files = filesByDir[dir].sort((a, b) => a.name.localeCompare(b.name));
            for (const file of files) {
                const indent = dir === '.' ? '  ' : '    ';
                const icon = file.required ? '📄' : '📋';
                const requiredText = file.required ? '' : ' (optional)';
                lines.push(`${indent}${icon} ${path.basename(file.relativePath)}${requiredText}`);
            }
        }
        return lines.join('\n');
    }
    /**
     * Validate file generation context
     */
    validateContext(context) {
        const issues = [];
        // Validate target directory
        if (!context.targetDirectory || context.targetDirectory.trim().length === 0) {
            issues.push('Target directory cannot be empty');
        }
        // Validate component name
        if (!context.componentName || context.componentName.trim().length === 0) {
            issues.push('Component name cannot be empty');
        }
        // Validate files to generate
        if (!context.filesToGenerate || context.filesToGenerate.length === 0) {
            issues.push('No files to generate');
        }
        // Validate each file
        context.filesToGenerate.forEach((file, index) => {
            if (!file.name || file.name.trim().length === 0) {
                issues.push(`File ${index} has empty name`);
            }
            if (!file.relativePath || file.relativePath.trim().length === 0) {
                issues.push(`File ${index} has empty relative path`);
            }
            if (file.content === undefined || file.content === null) {
                issues.push(`File ${index} has undefined content`);
            }
        });
        return {
            isValid: issues.length === 0,
            issues,
        };
    }
    /**
     * Clean up generated files (for rollback)
     */
    async cleanupFiles(context) {
        try {
            for (const file of context.filesToGenerate) {
                const filePath = path.join(context.targetDirectory, file.relativePath);
                try {
                    await fs.unlink(filePath);
                }
                catch {
                    // Ignore errors - file might not exist
                }
            }
            // Try to remove empty directories
            await this.removeEmptyDirectories(context.targetDirectory);
        }
        catch (error) {
            console.warn('Failed to cleanup files:', error);
        }
    }
    /**
     * Remove empty directories
     */
    async removeEmptyDirectories(dirPath) {
        try {
            const entries = await fs.readdir(dirPath);
            if (entries.length === 0) {
                await fs.rmdir(dirPath);
                // Recursively try to remove parent if it becomes empty
                const parentDir = path.dirname(dirPath);
                if (parentDir !== dirPath) {
                    await this.removeEmptyDirectories(parentDir);
                }
            }
        }
        catch {
            // Ignore errors - directory might not be empty or might not exist
        }
    }
    /**
     * Calculate file statistics
     */
    calculateFileStatistics(files) {
        const totalFiles = files.length;
        const requiredFiles = files.filter(f => f.required).length;
        const optionalFiles = files.filter(f => !f.required).length;
        const totalSize = files.reduce((sum, f) => sum + f.content.length, 0);
        const averageSize = totalFiles > 0 ? Math.round(totalSize / totalFiles) : 0;
        return {
            totalFiles,
            requiredFiles,
            optionalFiles,
            totalSize,
            averageSize,
        };
    }
}
exports.FileGenerator = FileGenerator;
/**
 * Default file generator instance
 */
exports.fileGenerator = new FileGenerator();
//# sourceMappingURL=file-generator.js.map