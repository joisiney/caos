"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextBuilder = void 0;
/**
 * Builds context for AI analysis operations
 */
class ContextBuilder {
    /**
     * Build analysis context from project information
     * @param projectContext - Optional project context data
     * @returns Promise with built analysis context
     */
    async build(projectContext) {
        const context = {
            projectStructure: await this.getProjectStructure(projectContext),
            existingLayers: await this.getExistingLayers(projectContext),
            projectConfig: await this.getProjectConfig(projectContext),
            framework: this.detectFramework(projectContext),
            metadata: await this.buildMetadata(projectContext),
        };
        return context;
    }
    /**
     * Get project structure information
     */
    async getProjectStructure(projectContext) {
        if (projectContext?.['projectStructure']) {
            return projectContext['projectStructure'];
        }
        // Default Khaos structure
        return [
            'src/atoms/',
            'src/molecules/',
            'src/organisms/',
            'src/templates/',
            'src/features/',
            'src/layouts/',
            'src/particles/',
            'src/models/',
            'src/entities/',
            'src/utils/',
            'src/gateways/',
            'src/repositories/',
        ];
    }
    /**
     * Get existing layers in the project
     */
    async getExistingLayers(projectContext) {
        if (projectContext?.['existingLayers']) {
            return projectContext['existingLayers'];
        }
        // Could be enhanced to scan actual project files
        return [];
    }
    /**
     * Get project configuration
     */
    async getProjectConfig(projectContext) {
        if (projectContext?.['projectConfig']) {
            return projectContext['projectConfig'];
        }
        // Default Khaos configuration
        return {
            architecture: 'khaos',
            framework: 'react',
            typescript: true,
            testing: 'jest',
            styling: 'tailwind',
            storybook: true,
        };
    }
    /**
     * Detect the framework being used
     */
    detectFramework(projectContext) {
        if (projectContext?.['framework']) {
            return projectContext['framework'];
        }
        // Default to React for Khaos architecture
        return 'react';
    }
    /**
     * Build additional metadata
     */
    async buildMetadata(projectContext) {
        const metadata = {
            buildTime: new Date().toISOString(),
            version: '1.0.0',
        };
        if (projectContext?.['metadata']) {
            Object.assign(metadata, projectContext['metadata']);
        }
        return metadata;
    }
    /**
     * Get context for specific layer type
     */
    async getLayerContext(layerType) {
        const layerContexts = {
            atom: {
                complexity: 'low',
                dependencies: 'none',
                reusability: 'high',
                patterns: ['button', 'input', 'icon', 'text', 'image'],
            },
            molecule: {
                complexity: 'medium',
                dependencies: 'atoms',
                reusability: 'medium',
                patterns: ['modal', 'card', 'form', 'list', 'dropdown'],
            },
            organism: {
                complexity: 'high',
                dependencies: 'molecules+atoms',
                reusability: 'medium',
                patterns: ['header', 'sidebar', 'navigation', 'section'],
            },
            template: {
                complexity: 'medium',
                dependencies: 'organisms+molecules+atoms',
                reusability: 'low',
                patterns: ['layout', 'page-structure', 'grid'],
            },
            feature: {
                complexity: 'high',
                dependencies: 'all',
                reusability: 'low',
                patterns: ['screen', 'page', 'functionality', 'flow'],
            },
        };
        return layerContexts[layerType] || {};
    }
    /**
     * Get naming conventions for layer
     */
    getLayerNamingConventions(layerType) {
        const conventions = {
            atom: {
                suffix: '.atom.tsx',
                componentSuffix: 'Atom',
                namePattern: 'dash-case',
                examples: ['button', 'input', 'icon'],
            },
            molecule: {
                suffix: '.molecule.tsx',
                componentSuffix: 'Molecule',
                namePattern: 'dash-case',
                examples: ['modal', 'card', 'form'],
            },
            organism: {
                suffix: '.organism.tsx',
                componentSuffix: 'Organism',
                namePattern: 'dash-case',
                examples: ['header', 'sidebar', 'navigation'],
            },
            feature: {
                suffix: '.feature.tsx',
                componentSuffix: 'Feature',
                namePattern: 'prefix-name',
                examples: ['wallet-deposit', 'user-profile'],
                requiresPrefix: true,
            },
        };
        return conventions[layerType] || {};
    }
}
exports.ContextBuilder = ContextBuilder;
//# sourceMappingURL=context-builder.js.map