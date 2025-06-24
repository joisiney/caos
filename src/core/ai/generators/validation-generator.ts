import {
  LayerAnalysis,
  TemplateContext,
  GeneratedCode,
  ValidationResult,
  ValidationIssue,
  CodeEnhancement,
  GenerationOptions,
} from '../types';
import { AIProvider } from '../providers/ai-provider.interface';

/**
 * Validation Generator for Khaos CLI
 * 
 * Generates code with automatic validation and correction
 */
export class ValidationGenerator {
  private aiProvider?: AIProvider;

  constructor(aiProvider?: AIProvider) {
    this.aiProvider = aiProvider;
  }

  /**
   * Generate code with validation
   */
  async generateWithValidation(
    analysis: LayerAnalysis,
    templateContext: TemplateContext,
    generatedFiles: Record<string, string>,
    options: GenerationOptions = {
      useAIEnhancement: true,
      validateCode: true,
      autoFix: true,
    }
  ): Promise<GeneratedCode> {
    try {
      let finalFiles = { ...generatedFiles };
      const enhancements: CodeEnhancement[] = [];
      
      // Step 1: Basic validation
      const validation = await this.validateGeneratedCode(finalFiles, analysis.layerType || 'atom');
      
      // Step 2: Auto-fix critical errors if enabled
      if (options.autoFix && validation.errors.length > 0) {
        const fixedFiles = await this.autoFixErrors(finalFiles, validation.errors, templateContext);
        finalFiles = { ...finalFiles, ...fixedFiles.files };
        enhancements.push(...fixedFiles.enhancements);
      }
      
      // Step 3: AI enhancement if enabled and provider available
      if (options.useAIEnhancement && this.aiProvider) {
        const enhancedFiles = await this.enhanceWithAI(finalFiles, templateContext);
        finalFiles = { ...finalFiles, ...enhancedFiles.files };
        enhancements.push(...enhancedFiles.enhancements);
      }
      
      // Step 4: Final validation
      const finalValidation = await this.validateGeneratedCode(finalFiles, analysis.layerType || 'atom');
      
      return {
        files: finalFiles,
        validation: finalValidation,
        metadata: {
          layer: analysis.layerType || 'atom',
          name: analysis.componentName || 'component',
          generatedAt: new Date(),
          aiProvider: this.aiProvider?.name || 'none',
          confidence: analysis.confidence,
        },
      };
    } catch (error) {
      throw new Error(`Validation generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate generated code
   */
  private async validateGeneratedCode(
    files: Record<string, string>,
    layer: string
  ): Promise<ValidationResult> {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    let score = 1.0;

    for (const [fileName, content] of Object.entries(files)) {
      const fileValidation = await this.validateFile(fileName, content, layer);
      errors.push(...fileValidation.errors);
      warnings.push(...fileValidation.warnings);
      score = Math.min(score, fileValidation.score);
    }

    // Generate improvements based on validation results
    const improvements = this.generateImprovements(errors, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
      improvements,
    };
  }

  /**
   * Validate a single file
   */
  private async validateFile(
    fileName: string,
    content: string,
    layer: string
  ): Promise<ValidationResult> {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    let score = 1.0;

    // Basic syntax validation
    const syntaxValidation = this.validateSyntax(fileName, content);
    errors.push(...syntaxValidation.errors);
    warnings.push(...syntaxValidation.warnings);
    score *= syntaxValidation.score;

    // Layer-specific validation
    const layerValidation = this.validateLayerConventions(fileName, content, layer);
    errors.push(...layerValidation.errors);
    warnings.push(...layerValidation.warnings);
    score *= layerValidation.score;

    // Import validation
    const importValidation = this.validateImports(fileName, content);
    errors.push(...importValidation.errors);
    warnings.push(...importValidation.warnings);
    score *= importValidation.score;

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
      improvements: [],
    };
  }

  /**
   * Validate syntax
   */
  private validateSyntax(fileName: string, content: string): ValidationResult {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    let score = 1.0;

    // Check for basic TypeScript/React syntax issues
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      // Check for missing semicolons (basic check)
      if (line.trim().endsWith(')') && !line.trim().endsWith(');') && 
          (line.includes('import') || line.includes('export'))) {
        warnings.push({
          type: 'warning',
          message: 'Missing semicolon',
          line: lineNumber,
          suggestion: 'Add semicolon at end of statement',
        });
        score *= 0.98;
      }

      // Check for console.log (should not be in production code)
      if (line.includes('console.log')) {
        warnings.push({
          type: 'warning',
          message: 'Console.log found in code',
          line: lineNumber,
          suggestion: 'Remove console.log or use proper logging',
        });
        score *= 0.95;
      }

      // Check for TODO/FIXME comments
      if (line.includes('TODO') || line.includes('FIXME')) {
        warnings.push({
          type: 'suggestion',
          message: 'Unresolved TODO/FIXME comment',
          line: lineNumber,
          suggestion: 'Implement or document the required changes',
        });
        score *= 0.99;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
      improvements: [],
    };
  }

  /**
   * Validate layer conventions
   */
  private validateLayerConventions(fileName: string, content: string, layer: string): ValidationResult {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    let score = 1.0;

    // Layer-specific validations
    switch (layer) {
      case 'atom':
        this.validateAtomConventions(fileName, content, errors, warnings);
        break;
      case 'molecule':
        this.validateMoleculeConventions(fileName, content, errors, warnings);
        break;
      case 'organism':
        this.validateOrganismConventions(fileName, content, errors, warnings);
        break;
      case 'feature':
        this.validateFeatureConventions(fileName, content, errors, warnings);
        break;
    }

    // Common React component validations
    if (fileName.endsWith('.tsx')) {
      this.validateReactConventions(fileName, content, errors, warnings);
    }

    // TypeScript validations
    if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
      this.validateTypeScriptConventions(fileName, content, errors, warnings);
    }

    // Adjust score based on issues
    score -= errors.length * 0.1;
    score -= warnings.length * 0.05;
    score = Math.max(0, Math.min(1, score));

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
      improvements: [],
    };
  }

  /**
   * Validate atom conventions
   */
  private validateAtomConventions(
    fileName: string,
    content: string,
    errors: ValidationIssue[],
    warnings: ValidationIssue[]
  ): void {
    // Check for displayName
    if (fileName.includes('.atom.tsx') && !content.includes('.displayName')) {
      warnings.push({
        type: 'warning',
        message: 'Missing displayName for atom component',
        suggestion: 'Add displayName to the component for better debugging',
      });
    }

    // Check for testID prop support
    if (fileName.includes('.atom.tsx') && !content.includes('testID')) {
      warnings.push({
        type: 'warning',
        message: 'Missing testID prop support',
        suggestion: 'Add testID prop for testing purposes',
      });
    }
  }

  /**
   * Validate molecule conventions
   */
  private validateMoleculeConventions(
    fileName: string,
    content: string,
    errors: ValidationIssue[],
    warnings: ValidationIssue[]
  ): void {
    // Check for use-case import
    if (fileName.includes('.molecule.tsx') && !content.includes('.use-case')) {
      errors.push({
        type: 'error',
        message: 'Molecule must import its use-case',
        suggestion: 'Import and use the corresponding use-case hook',
      });
    }
  }

  /**
   * Validate organism conventions
   */
  private validateOrganismConventions(
    fileName: string,
    content: string,
    errors: ValidationIssue[],
    warnings: ValidationIssue[]
  ): void {
    // Similar validations for organisms
    if (fileName.includes('.organism.tsx') && !content.includes('.use-case')) {
      errors.push({
        type: 'error',
        message: 'Organism must import its use-case',
        suggestion: 'Import and use the corresponding use-case hook',
      });
    }
  }

  /**
   * Validate feature conventions
   */
  private validateFeatureConventions(
    fileName: string,
    content: string,
    errors: ValidationIssue[],
    warnings: ValidationIssue[]
  ): void {
    // Check for prefix requirement
    if (fileName.includes('.feature.tsx') && !fileName.includes('-')) {
      errors.push({
        type: 'error',
        message: 'Feature components must have a prefix',
        suggestion: 'Add a prefix like "app-" or "web-" to the component name',
      });
    }

    // Check for use-case import
    if (fileName.includes('.feature.tsx') && !content.includes('.use-case')) {
      errors.push({
        type: 'error',
        message: 'Feature must import its use-case',
        suggestion: 'Import and use the corresponding use-case hook',
      });
    }
  }

  /**
   * Validate React conventions
   */
  private validateReactConventions(
    fileName: string,
    content: string,
    errors: ValidationIssue[],
    warnings: ValidationIssue[]
  ): void {
    // Check for React import
    if (content.includes('React.') && !content.includes("import React from 'react'")) {
      errors.push({
        type: 'error',
        message: 'Missing React import',
        suggestion: "Add 'import React from \"react\"' at the top of the file",
      });
    }

    // Check for proper function component definition
    if (!content.includes('function ') && !content.includes('const ') && !content.includes('export function')) {
      warnings.push({
        type: 'warning',
        message: 'No React component found in TSX file',
        suggestion: 'Ensure the file exports a React component',
      });
    }
  }

  /**
   * Validate TypeScript conventions
   */
  private validateTypeScriptConventions(
    fileName: string,
    content: string,
    errors: ValidationIssue[],
    warnings: ValidationIssue[]
  ): void {
    // Check for proper type imports
    if (content.includes('type ') && content.includes('import ') && 
        !content.includes('import type')) {
      warnings.push({
        type: 'suggestion',
        message: 'Consider using type-only imports',
        suggestion: 'Use "import type" for importing types',
      });
    }
  }

  /**
   * Validate imports
   */
  private validateImports(fileName: string, content: string): ValidationResult {
    const errors: ValidationIssue[] = [];
    const warnings: ValidationIssue[] = [];
    let score = 1.0;

    const lines = content.split('\n');
    const importLines = lines.filter(line => line.trim().startsWith('import'));

    // Check for proper import ordering
    let hasReactImport = false;
    let hasTypeImport = false;
    let hasRelativeImport = false;

    for (const line of importLines) {
      if (line.includes("'react'")) {
        hasReactImport = true;
      }
      if (line.includes('import type')) {
        hasTypeImport = true;
      }
      if (line.includes("'./") || line.includes("'../")) {
        hasRelativeImport = true;
      }
    }

    // Validate import structure for React components
    if (fileName.endsWith('.tsx') && content.includes('React.') && !hasReactImport) {
      errors.push({
        type: 'error',
        message: 'Missing React import',
        suggestion: 'Add React import at the top of the file',
      });
      score *= 0.8;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score,
      improvements: [],
    };
  }

  /**
   * Auto-fix errors
   */
  private async autoFixErrors(
    files: Record<string, string>,
    errors: ValidationIssue[],
    context: TemplateContext
  ): Promise<{
    files: Record<string, string>;
    enhancements: CodeEnhancement[];
  }> {
    const fixedFiles: Record<string, string> = {};
    const enhancements: CodeEnhancement[] = [];

    for (const [fileName, content] of Object.entries(files)) {
      let fixedContent = content;
      const fileErrors = errors.filter(error => 
        error.line !== undefined || error.message.includes(fileName)
      );

      if (fileErrors.length > 0) {
        const fixResult = await this.fixFileErrors(fileName, fixedContent, fileErrors, context);
        fixedContent = fixResult.content;
        enhancements.push(...fixResult.enhancements);
      }

      fixedFiles[fileName] = fixedContent;
    }

    return { files: fixedFiles, enhancements };
  }

  /**
   * Fix errors in a single file
   */
  private async fixFileErrors(
    fileName: string,
    content: string,
    errors: ValidationIssue[],
    context: TemplateContext
  ): Promise<{
    content: string;
    enhancements: CodeEnhancement[];
  }> {
    let fixedContent = content;
    const enhancements: CodeEnhancement[] = [];

    for (const error of errors) {
      const fixResult = await this.applyAutoFix(fileName, fixedContent, error, context);
      if (fixResult.fixed) {
        enhancements.push({
          original: fixedContent,
          enhanced: fixResult.content,
          type: 'validation-fix',
          changes: [error.suggestion || 'Auto-fix applied'],
          confidence: 0.8,
        });
        fixedContent = fixResult.content;
      }
    }

    return { content: fixedContent, enhancements };
  }

  /**
   * Apply auto-fix for a specific error
   */
  private async applyAutoFix(
    fileName: string,
    content: string,
    error: ValidationIssue,
    context: TemplateContext
  ): Promise<{ content: string; fixed: boolean }> {
    let fixedContent = content;
    let fixed = false;

    // Apply specific fixes based on error type
    if (error.message.includes('Missing React import')) {
      if (!content.includes("import React from 'react'")) {
        fixedContent = `import React from 'react';\n${content}`;
        fixed = true;
      }
    }

    if (error.message.includes('Missing displayName')) {
      const componentName = context.pascalName;
      if (!content.includes('.displayName')) {
        fixedContent = fixedContent.replace(
          /export function (\w+)/,
          `export function $1`
        ) + `\n\n${componentName}.displayName = '${context.namespace}';`;
        fixed = true;
      }
    }

    if (error.message.includes('Missing semicolon') && error.line) {
      const lines = fixedContent.split('\n');
      if (lines[error.line - 1] && !lines[error.line - 1].trim().endsWith(';')) {
        lines[error.line - 1] += ';';
        fixedContent = lines.join('\n');
        fixed = true;
      }
    }

    return { content: fixedContent, fixed };
  }

  /**
   * Enhance code with AI
   */
  private async enhanceWithAI(
    files: Record<string, string>,
    context: TemplateContext
  ): Promise<{
    files: Record<string, string>;
    enhancements: CodeEnhancement[];
  }> {
    if (!this.aiProvider) {
      return { files, enhancements: [] };
    }

    const enhancedFiles: Record<string, string> = {};
    const enhancements: CodeEnhancement[] = [];

    for (const [fileName, content] of Object.entries(files)) {
      try {
        const enhancement = await this.enhanceFileWithAI(fileName, content, context);
        enhancedFiles[fileName] = enhancement.enhanced;
        enhancements.push(enhancement);
      } catch (error) {
        console.warn(`AI enhancement failed for ${fileName}:`, error);
        enhancedFiles[fileName] = content; // Keep original on failure
      }
    }

    return { files: enhancedFiles, enhancements };
  }

  /**
   * Enhance a single file with AI
   */
  private async enhanceFileWithAI(
    fileName: string,
    content: string,
    context: TemplateContext
  ): Promise<CodeEnhancement> {
    const prompt = `
Melhore o seguinte código TypeScript/React seguindo rigorosamente a arquitetura Khaos:

ARQUIVO: ${fileName}
CAMADA: ${context.layer}
CONTEXTO: ${JSON.stringify(context, null, 2)}

CÓDIGO ATUAL:
\`\`\`typescript
${content}
\`\`\`

MELHORIAS NECESSÁRIAS:
1. Garantir conformidade com convenções de nomenclatura
2. Adicionar tipos TypeScript rigorosos
3. Implementar boas práticas da camada ${context.layer}
4. Adicionar comentários JSDoc quando apropriado
5. Otimizar imports e exports
6. Corrigir problemas de sintaxe

RETORNE APENAS O CÓDIGO MELHORADO, SEM EXPLICAÇÕES.
    `;

    try {
      const response = await this.aiProvider!.analyzeDescription(prompt);
      const enhancedContent = this.extractCodeFromResponse(response);

      return {
        original: content,
        enhanced: enhancedContent,
        type: 'ai-improvement',
        changes: ['AI code enhancement applied'],
        confidence: 0.7,
      };
    } catch (error) {
      throw new Error(`AI enhancement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract code from AI response
   */
  private extractCodeFromResponse(response: any): string {
    const responseText = typeof response === 'string' ? response : JSON.stringify(response);
    
    // Try to extract code from markdown code blocks
    const codeBlockMatch = responseText.match(/```(?:typescript|tsx|ts)?\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1];
    }

    // If no code block found, return the response as-is
    return responseText;
  }

  /**
   * Generate improvements based on validation results
   */
  private generateImprovements(errors: ValidationIssue[], warnings: ValidationIssue[]): string[] {
    const improvements: string[] = [];

    // Group improvements by type
    const errorTypes = new Set(errors.map(e => e.type));
    const warningTypes = new Set(warnings.map(w => w.type));

    if (errorTypes.has('error')) {
      improvements.push('Corrigir erros críticos de validação');
    }

    if (warningTypes.has('warning')) {
      improvements.push('Resolver avisos de qualidade de código');
    }

    if (errors.some(e => e.message.includes('import'))) {
      improvements.push('Otimizar estrutura de imports');
    }

    if (warnings.some(w => w.message.includes('console.log'))) {
      improvements.push('Remover logs de debug');
    }

    return improvements;
  }
}

/**
 * Default validation generator instance
 */
export const createValidationGenerator = (aiProvider?: AIProvider): ValidationGenerator => {
  return new ValidationGenerator(aiProvider);
}; 