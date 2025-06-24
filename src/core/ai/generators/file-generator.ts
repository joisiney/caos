import * as fs from 'fs/promises';
import * as path from 'path';
import {
  FileGenerationContext,
  GeneratedFile,
  TemplateContext,
  LayerStructure,
} from '../types';

/**
 * File Generator for Khaos CLI
 * 
 * Manages file and directory creation for generated components
 */
export class FileGenerator {
  /**
   * Generate files for a component
   */
  async generateFiles(context: FileGenerationContext): Promise<void> {
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
    } catch (error) {
      throw new Error(`File generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a single file
   */
  private async generateFile(context: FileGenerationContext, file: GeneratedFile): Promise<void> {
    const filePath = path.join(context.targetDirectory, file.relativePath);
    
    try {
      // Ensure parent directory exists
      const parentDir = path.dirname(filePath);
      await this.ensureDirectory(parentDir);
      
      // Write file content
      await fs.writeFile(filePath, file.content, 'utf8');
      
      console.log(`📄 Generated: ${file.relativePath}`);
    } catch (error) {
      throw new Error(`Failed to generate file ${file.relativePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create subdirectories based on layer structure
   */
  private async createSubdirectories(context: FileGenerationContext): Promise<void> {
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
  private getSubdirectoriesForLayer(layer: string): string[] {
    const subdirectories: string[] = [];
    
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
  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Generate component directory name
   */
  generateComponentDirectoryName(context: TemplateContext): string {
    const { kebabName, layer } = context;
    
    // Add layer suffix for certain layers
    const layerSuffixes: Record<string, string> = {
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
  getTargetDirectoryPath(
    baseDirectory: string,
    layer: string,
    componentName: string,
    context: TemplateContext
  ): string {
    const layerPaths: Record<string, string> = {
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
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Create backup of existing file
   */
  async createBackup(filePath: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup-${timestamp}`;
    
    try {
      await fs.copyFile(filePath, backupPath);
      return backupPath;
    } catch (error) {
      throw new Error(`Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate file structure preview
   */
  generateFileStructurePreview(context: FileGenerationContext): string {
    const { componentName, filesToGenerate, targetDirectory } = context;
    
    const lines: string[] = [];
    lines.push(`📁 ${path.basename(targetDirectory)}/`);
    
    // Group files by directory
    const filesByDir: Record<string, GeneratedFile[]> = {};
    
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
  validateContext(context: FileGenerationContext): {
    isValid: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
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
  async cleanupFiles(context: FileGenerationContext): Promise<void> {
    try {
      for (const file of context.filesToGenerate) {
        const filePath = path.join(context.targetDirectory, file.relativePath);
        
        try {
          await fs.unlink(filePath);
        } catch {
          // Ignore errors - file might not exist
        }
      }
      
      // Try to remove empty directories
      await this.removeEmptyDirectories(context.targetDirectory);
    } catch (error) {
      console.warn('Failed to cleanup files:', error);
    }
  }

  /**
   * Remove empty directories
   */
  private async removeEmptyDirectories(dirPath: string): Promise<void> {
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
    } catch {
      // Ignore errors - directory might not be empty or might not exist
    }
  }

  /**
   * Calculate file statistics
   */
  calculateFileStatistics(files: GeneratedFile[]): {
    totalFiles: number;
    requiredFiles: number;
    optionalFiles: number;
    totalSize: number;
    averageSize: number;
  } {
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

/**
 * Default file generator instance
 */
export const fileGenerator = new FileGenerator(); 