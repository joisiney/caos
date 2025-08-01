import * as fs from 'fs/promises';
import * as path from 'path';
import {
  LayerAnalysis,
  LayerTemplate,
  TemplateSelection,
  TemplateFile,
  TemplateRegistry,
  LayerStructure,
} from '../types';
import { AIProvider } from '../providers/ai-provider.interface';

/**
 * Template Selector for Khaos CLI
 * 
 * Selects appropriate templates based on layer analysis
 */
export class TemplateSelector {
  private templateRegistry: TemplateRegistry;
  private aiProvider?: AIProvider;

  constructor(templateRegistry: TemplateRegistry, aiProvider?: AIProvider) {
    this.templateRegistry = templateRegistry;
    this.aiProvider = aiProvider;
  }

  /**
   * Select the best template for the given analysis
   */
  async selectTemplate(analysis: LayerAnalysis): Promise<TemplateSelection> {
    try {
      const availableTemplates = this.templateRegistry.getTemplatesForLayer(analysis.layerType || 'atom');
      
      if (availableTemplates.length === 0) {
        throw new Error(`No templates found for layer: ${analysis.layerType}`);
      }

      if (availableTemplates.length === 1) {
        return {
          template: availableTemplates[0],
          confidence: 1.0,
          reasoning: 'Only one template available for this layer',
          alternatives: [],
        };
      }

      // Use AI to select the best template if available
      if (this.aiProvider) {
        return await this.selectWithAI(analysis, availableTemplates);
      }

      // Fallback to rule-based selection
      return this.selectWithRules(analysis, availableTemplates);
    } catch (error) {
      throw new Error(`Template selection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Select template using AI
   */
  private async selectWithAI(
    analysis: LayerAnalysis,
    templates: LayerTemplate[]
  ): Promise<TemplateSelection> {
    const prompt = this.buildSelectionPrompt(analysis, templates);
    
    try {
      const response = await this.aiProvider!.analyzeDescription(prompt);
      return this.parseAIResponse(response, templates);
    } catch (error) {
      console.warn('AI template selection failed, falling back to rules:', error);
      return this.selectWithRules(analysis, templates);
    }
  }

  /**
   * Select template using rules
   */
  private selectWithRules(
    analysis: LayerAnalysis,
    templates: LayerTemplate[]
  ): TemplateSelection {
    const scores = templates.map(template => ({
      template,
      score: this.calculateTemplateScore(analysis, template),
    }));

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    const bestTemplate = scores[0];
    const alternatives = scores.slice(1, 3).map(s => s.template);

    return {
      template: bestTemplate.template,
      confidence: bestTemplate.score,
      reasoning: this.generateReasoning(analysis, bestTemplate.template),
      alternatives,
    };
  }

  /**
   * Calculate template score based on analysis
   */
  private calculateTemplateScore(analysis: LayerAnalysis, template: LayerTemplate): number {
    let score = 0;

    // Feature matching
    const analysisFeatures = this.extractFeaturesFromAnalysis(analysis);
    const templateFeatures = template.supportedFeatures || [];
    
    const matchingFeatures = analysisFeatures.filter(f => templateFeatures.includes(f));
    score += matchingFeatures.length * 0.3;

    // Required features
    const requiredFeatures = template.requiredFeatures || [];
    const hasAllRequired = requiredFeatures.every(f => analysisFeatures.includes(f));
    if (hasAllRequired) {
      score += 0.4;
    } else {
      score -= 0.2;
    }

    // Complexity matching
    const analysisComplexity = this.estimateComplexity(analysis);
    const templateComplexity = this.estimateTemplateComplexity(template);
    
    if (analysisComplexity === templateComplexity) {
      score += 0.3;
    } else if (Math.abs(analysisComplexity - templateComplexity) === 1) {
      score += 0.1;
    }

    // Ensure score is between 0 and 1
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Extract features from analysis
   */
  private extractFeaturesFromAnalysis(analysis: LayerAnalysis): string[] {
    const features: string[] = [];
    
    // From metadata
    if (analysis.metadata['requiredFeatures']) {
      features.push(...analysis.metadata['requiredFeatures']);
    }
    
    if (analysis.metadata['optionalFeatures']) {
      features.push(...analysis.metadata['optionalFeatures']);
    }

    // Infer from props
    if (analysis.props?.some(p => p.name.includes('variant'))) {
      features.push('variants');
    }

    if (analysis.props?.some(p => p.name.includes('onClick') || p.name.includes('onPress'))) {
      features.push('interactive');
    }

    if (analysis.props?.some(p => p.name.includes('loading') || p.name.includes('disabled'))) {
      features.push('states');
    }

    // Infer from methods
    if (analysis.methods?.some(m => m.name.includes('validate'))) {
      features.push('validation');
    }

    if (analysis.methods?.some(m => m.name.includes('submit'))) {
      features.push('form');
    }

    return features;
  }

  /**
   * Estimate complexity of analysis
   */
  private estimateComplexity(analysis: LayerAnalysis): number {
    let complexity = 1;

    // Props complexity
    complexity += (analysis.props?.length || 0) * 0.1;

    // Methods complexity
    complexity += (analysis.methods?.length || 0) * 0.2;

    // Dependencies complexity
    complexity += (analysis.dependencies?.length || 0) * 0.15;

    return Math.min(3, Math.max(1, Math.round(complexity)));
  }

  /**
   * Estimate template complexity
   */
  private estimateTemplateComplexity(template: LayerTemplate): number {
    let complexity = 1;

    // File count
    complexity += template.files.length * 0.1;

    // Required features
    complexity += (template.requiredFeatures?.length || 0) * 0.2;

    // Supported features
    complexity += (template.supportedFeatures?.length || 0) * 0.1;

    return Math.min(3, Math.max(1, Math.round(complexity)));
  }

  /**
   * Build AI selection prompt
   */
  private buildSelectionPrompt(analysis: LayerAnalysis, templates: LayerTemplate[]): string {
    return `
Selecione o melhor template para o seguinte componente:

ANÁLISE DO COMPONENTE:
- Camada: ${analysis.layerType}
- Nome: ${analysis.componentName}
- Confiança: ${analysis.confidence}
- Props: ${analysis.props?.length || 0}
- Métodos: ${analysis.methods?.length || 0}
- Dependências: ${analysis.dependencies?.join(', ') || 'nenhuma'}
- Justificativa: ${analysis.reasoning}

TEMPLATES DISPONÍVEIS:
${templates.map(t => `
- ${t.name}: ${t.description}
  - Recursos Obrigatórios: ${t.requiredFeatures?.join(', ') || 'nenhum'}
  - Recursos Suportados: ${t.supportedFeatures?.join(', ') || 'nenhum'}
  - Arquivos: ${t.files.length}
`).join('\n')}

RESPONDA EM JSON:
{
  "templateName": "nome-do-template-selecionado",
  "confidence": 0.95,
  "reasoning": "explicação detalhada da escolha"
}
    `;
  }

  /**
   * Parse AI response
   */
  private parseAIResponse(response: any, templates: LayerTemplate[]): TemplateSelection {
    try {
      // Assuming response contains the JSON data
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      
      const selectedTemplate = templates.find(t => t.name === data.templateName);
      if (!selectedTemplate) {
        throw new Error(`Template not found: ${data.templateName}`);
      }

      const alternatives = templates.filter(t => t.name !== data.templateName);

      return {
        template: selectedTemplate,
        confidence: data.confidence || 0.5,
        reasoning: data.reasoning || 'AI selection',
        alternatives,
      };
    } catch (error) {
      // Fallback to first template if parsing fails
      return {
        template: templates[0],
        confidence: 0.5,
        reasoning: 'AI response parsing failed, using first template',
        alternatives: templates.slice(1),
      };
    }
  }

  /**
   * Generate reasoning for template selection
   */
  private generateReasoning(analysis: LayerAnalysis, template: LayerTemplate): string {
    const reasons: string[] = [];

    // Feature matching
    const analysisFeatures = this.extractFeaturesFromAnalysis(analysis);
    const templateFeatures = template.supportedFeatures || [];
    const matchingFeatures = analysisFeatures.filter(f => templateFeatures.includes(f));
    
    if (matchingFeatures.length > 0) {
      reasons.push(`Suporta recursos necessários: ${matchingFeatures.join(', ')}`);
    }

    // Required features
    const requiredFeatures = template.requiredFeatures || [];
    const hasAllRequired = requiredFeatures.every(f => analysisFeatures.includes(f));
    if (hasAllRequired && requiredFeatures.length > 0) {
      reasons.push(`Atende todos os recursos obrigatórios: ${requiredFeatures.join(', ')}`);
    }

    // Complexity matching
    const analysisComplexity = this.estimateComplexity(analysis);
    const templateComplexity = this.estimateTemplateComplexity(template);
    
    if (analysisComplexity === templateComplexity) {
      reasons.push(`Complexidade apropriada (${templateComplexity})`);
    }

    if (reasons.length === 0) {
      reasons.push('Template padrão para a camada');
    }

    return reasons.join('; ');
  }

  /**
   * Get custom template by name
   */
  async getCustomTemplate(templateName: string, layer: string): Promise<LayerTemplate | null> {
    return this.templateRegistry.getTemplate(layer, templateName);
  }

  /**
   * Register a custom template
   */
  registerCustomTemplate(template: LayerTemplate): void {
    this.templateRegistry.registerTemplate(template);
  }
}

/**
 * Default Template Registry Implementation
 */
export class DefaultTemplateRegistry implements TemplateRegistry {
  private templates: Map<string, LayerTemplate[]> = new Map();
  private layerStructures: Map<string, LayerStructure> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
    this.initializeLayerStructures();
  }

  getTemplatesForLayer(layer: string): LayerTemplate[] {
    return this.templates.get(layer) || [];
  }

  getTemplate(layer: string, name: string): LayerTemplate | null {
    const templates = this.templates.get(layer) || [];
    return templates.find(t => t.name === name) || null;
  }

  registerTemplate(template: LayerTemplate): void {
    if (!this.templates.has(template.layer)) {
      this.templates.set(template.layer, []);
    }
    
    const layerTemplates = this.templates.get(template.layer)!;
    const existingIndex = layerTemplates.findIndex(t => t.name === template.name);
    
    if (existingIndex >= 0) {
      layerTemplates[existingIndex] = template;
    } else {
      layerTemplates.push(template);
    }
  }

  getLayerStructure(layer: string): LayerStructure | null {
    return this.layerStructures.get(layer) || null;
  }

  private initializeDefaultTemplates(): void {
    // Atom templates
    this.registerTemplate({
      layer: 'atom',
      name: 'default',
      description: 'Basic atom component',
      files: [
        {
          name: 'component',
          content: '',
          relativePath: 'component.atom.tsx',
          required: true,
        },
        {
          name: 'types',
          content: '',
          relativePath: 'type.ts',
          required: true,
        },
        {
          name: 'index',
          content: '',
          relativePath: 'index.ts',
          required: true,
        },
      ],
      supportedFeatures: ['basic', 'props', 'testid'],
    });

    // Similar for other layers...
    this.registerTemplate({
      layer: 'molecule',
      name: 'default',
      description: 'Basic molecule component',
      files: [
        {
          name: 'component',
          content: '',
          relativePath: 'component.molecule.tsx',
          required: true,
        },
        {
          name: 'types',
          content: '',
          relativePath: 'type.ts',
          required: true,
        },
        {
          name: 'usecase',
          content: '',
          relativePath: 'use-case.ts',
          required: true,
        },
        {
          name: 'index',
          content: '',
          relativePath: 'index.ts',
          required: true,
        },
      ],
      supportedFeatures: ['basic', 'props', 'testid', 'usecase'],
    });
  }

  private initializeLayerStructures(): void {
    // Define layer structures
    this.layerStructures.set('atom', {
      layer: 'atom',
      requiredFiles: ['component.tsx', 'type.ts', 'index.ts'],
      optionalFiles: ['variant.ts', 'constant.ts', 'mock.ts', 'stories.tsx', 'spec.ts'],
      prefixRequired: false,
      directories: {
        main: '.',
      },
    });

    this.layerStructures.set('molecule', {
      layer: 'molecule',
      requiredFiles: ['component.tsx', 'type.ts', 'use-case.ts', 'index.ts'],
      optionalFiles: ['variant.ts', 'constant.ts', 'mock.ts', 'stories.tsx', 'spec.ts'],
      prefixRequired: false,
      directories: {
        main: '.',
        services: '_services',
      },
    });

    this.layerStructures.set('feature', {
      layer: 'feature',
      requiredFiles: ['component.tsx', 'type.ts', 'use-case.ts', 'index.ts'],
      optionalFiles: ['variant.ts', 'constant.ts', 'mock.ts', 'stories.tsx', 'spec.ts'],
      prefixRequired: true,
      defaultPrefix: 'app',
      directories: {
        main: '.',
        services: '_services',
      },
    });

    // Add other layer structures...
  }
}

/**
 * Default template selector instance
 */
export const createTemplateSelector = (aiProvider?: AIProvider): TemplateSelector => {
  const registry = new DefaultTemplateRegistry();
  return new TemplateSelector(registry, aiProvider);
}; 