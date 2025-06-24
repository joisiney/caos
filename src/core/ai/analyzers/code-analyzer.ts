import { AIProvider } from '../providers/ai-provider.interface';
import { LayerType } from './layer-classifier';
import { ValidationResult, ValidationIssue } from '../types';

/**
 * Code analysis types
 */
export interface CodeAnalysisResult {
  isValid: boolean;
  score: number;
  issues: CodeIssue[];
  suggestions: CodeSuggestion[];
  metrics: CodeMetrics;
  violations: ArchitecturalViolation[];
}

export interface CodeIssue {
  type: 'error' | 'warning' | 'suggestion' | 'smell';
  category: 'syntax' | 'architecture' | 'convention' | 'performance' | 'maintainability';
  message: string;
  line?: number;
  column?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestion?: string;
  rule?: string;
}

export interface CodeSuggestion {
  type: 'refactor' | 'optimize' | 'convention' | 'architecture';
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  code?: {
    original: string;
    suggested: string;
  };
}

export interface CodeMetrics {
  complexity: number;
  maintainability: number;
  readability: number;
  testability: number;
  reusability: number;
  lines: number;
  functions: number;
  dependencies: number;
}

export interface ArchitecturalViolation {
  rule: string;
  description: string;
  severity: 'error' | 'warning';
  location?: {
    line: number;
    column: number;
  };
  suggestion: string;
}

/**
 * Analyzes existing code for architectural violations and improvements
 */
export class CodeAnalyzer {
  constructor(private aiProvider?: AIProvider) {}

  /**
   * Analyze code for violations and improvements
   * @param code - Code to analyze
   * @param layer - Target layer type
   * @param context - Additional context
   * @returns Code analysis result
   */
  async analyzeCode(
    code: string,
    layer: LayerType,
    context?: Record<string, any>
  ): Promise<CodeAnalysisResult> {
    // Perform static analysis
    const staticAnalysis = await this.performStaticAnalysis(code, layer);
    
    // Perform AI-powered analysis if available
    const aiAnalysis = this.aiProvider 
      ? await this.performAIAnalysis(code, layer, context)
      : null;
    
    // Combine results
    return this.combineAnalysisResults(staticAnalysis, aiAnalysis);
  }

  /**
   * Detect architectural violations
   * @param code - Code to analyze
   * @param layer - Target layer type
   * @returns List of violations
   */
  async detectViolations(code: string, layer: LayerType): Promise<ArchitecturalViolation[]> {
    const violations: ArchitecturalViolation[] = [];
    
    // Layer-specific violation checks
    violations.push(...this.checkLayerSpecificViolations(code, layer));
    
    // General architectural violations
    violations.push(...this.checkGeneralViolations(code));
    
    // Naming convention violations
    violations.push(...this.checkNamingViolations(code, layer));
    
    // Import/export violations
    violations.push(...this.checkImportExportViolations(code, layer));
    
    return violations;
  }

  /**
   * Suggest improvements for existing code
   * @param code - Code to improve
   * @param layer - Target layer type
   * @returns List of suggestions
   */
  async suggestImprovements(code: string, layer: LayerType): Promise<CodeSuggestion[]> {
    const suggestions: CodeSuggestion[] = [];
    
    // Performance improvements
    suggestions.push(...this.suggestPerformanceImprovements(code));
    
    // Maintainability improvements
    suggestions.push(...this.suggestMaintainabilityImprovements(code));
    
    // Convention improvements
    suggestions.push(...this.suggestConventionImprovements(code, layer));
    
    // Architecture improvements
    suggestions.push(...this.suggestArchitectureImprovements(code, layer));
    
    return suggestions;
  }

  /**
   * Perform static code analysis
   */
  private async performStaticAnalysis(code: string, layer: LayerType): Promise<Partial<CodeAnalysisResult>> {
    const issues: CodeIssue[] = [];
    const violations: ArchitecturalViolation[] = [];
    const metrics = this.calculateMetrics(code);
    
    // Check for basic issues
    issues.push(...this.checkBasicIssues(code));
    
    // Check architectural violations
    violations.push(...await this.detectViolations(code, layer));
    
    // Calculate overall score
    const score = this.calculateScore(issues, violations, metrics);
    
    return {
      isValid: violations.filter(v => v.severity === 'error').length === 0,
      score,
      issues,
      violations,
      metrics,
    };
  }

  /**
   * Perform AI-powered analysis
   */
  private async performAIAnalysis(
    code: string,
    layer: LayerType,
    context?: Record<string, any>
  ): Promise<Partial<CodeAnalysisResult>> {
    if (!this.aiProvider) {
      return {};
    }

    try {
      const prompt = this.buildAnalysisPrompt(code, layer, context);
      const result = await this.aiProvider.validateCode(code, {
        layer,
        prompt,
        context,
      });

      return {
        issues: result.issues.map(this.convertValidationIssueToCodeIssue),
        suggestions: this.extractSuggestionsFromAI(result.improvements),
      };
    } catch (error) {
      console.warn('AI analysis failed:', error);
      return {};
    }
  }

  /**
   * Combine static and AI analysis results
   */
  private combineAnalysisResults(
    staticAnalysis: Partial<CodeAnalysisResult>,
    aiAnalysis: Partial<CodeAnalysisResult> | null
  ): CodeAnalysisResult {
    const issues = [
      ...(staticAnalysis.issues || []),
      ...(aiAnalysis?.issues || []),
    ];

    const suggestions = [
      ...(staticAnalysis.suggestions || []),
      ...(aiAnalysis?.suggestions || []),
    ];

    const violations = staticAnalysis.violations || [];
    const metrics = staticAnalysis.metrics || this.getDefaultMetrics();
    const score = staticAnalysis.score || 0;

    return {
      isValid: staticAnalysis.isValid || false,
      score,
      issues: this.deduplicateIssues(issues),
      suggestions: this.deduplicateSuggestions(suggestions),
      metrics,
      violations,
    };
  }

  /**
   * Check layer-specific violations
   */
  private checkLayerSpecificViolations(code: string, layer: LayerType): ArchitecturalViolation[] {
    const violations: ArchitecturalViolation[] = [];

    switch (layer) {
      case 'atom':
        violations.push(...this.checkAtomViolations(code));
        break;
      case 'molecule':
        violations.push(...this.checkMoleculeViolations(code));
        break;
      case 'organism':
        violations.push(...this.checkOrganismViolations(code));
        break;
      case 'feature':
        violations.push(...this.checkFeatureViolations(code));
        break;
      case 'template':
        violations.push(...this.checkTemplateViolations(code));
        break;
      case 'util':
        violations.push(...this.checkUtilViolations(code));
        break;
    }

    return violations;
  }

  /**
   * Check atom-specific violations
   */
  private checkAtomViolations(code: string): ArchitecturalViolation[] {
    const violations: ArchitecturalViolation[] = [];

    // Atoms should not have use-case files
    if (code.includes('use-case') || code.includes('useCase')) {
      violations.push({
        rule: 'atom-no-use-case',
        description: 'Atoms cannot contain use-case logic',
        severity: 'error',
        suggestion: 'Remove use-case logic or move to molecule layer',
      });
    }

    // Atoms should not have complex state management
    if (code.includes('useState') && this.countStateVariables(code) > 2) {
      violations.push({
        rule: 'atom-simple-state',
        description: 'Atoms should have minimal state management',
        severity: 'warning',
        suggestion: 'Consider moving complex state to molecule layer',
      });
    }

    return violations;
  }

  /**
   * Check molecule-specific violations
   */
  private checkMoleculeViolations(code: string): ArchitecturalViolation[] {
    const violations: ArchitecturalViolation[] = [];

    // Molecules must have use-case
    if (!code.includes('use-case') && !code.includes('useCase')) {
      violations.push({
        rule: 'molecule-requires-use-case',
        description: 'Molecules must implement use-case hook',
        severity: 'error',
        suggestion: 'Add use-case hook implementation',
      });
    }

    // Molecules should not have partials
    if (code.includes('_partials') || code.includes('partial')) {
      violations.push({
        rule: 'molecule-no-partials',
        description: 'Molecules cannot contain partials',
        severity: 'error',
        suggestion: 'Move partials to organism layer',
      });
    }

    return violations;
  }

  /**
   * Check organism-specific violations
   */
  private checkOrganismViolations(code: string): ArchitecturalViolation[] {
    const violations: ArchitecturalViolation[] = [];

    // Organisms must have use-case
    if (!code.includes('use-case') && !code.includes('useCase')) {
      violations.push({
        rule: 'organism-requires-use-case',
        description: 'Organisms must implement use-case hook',
        severity: 'error',
        suggestion: 'Add use-case hook implementation',
      });
    }

    return violations;
  }

  /**
   * Check feature-specific violations
   */
  private checkFeatureViolations(code: string): ArchitecturalViolation[] {
    const violations: ArchitecturalViolation[] = [];

    // Features should not render atoms/molecules directly
    if (this.rendersAtomsMoleculesDirectly(code)) {
      violations.push({
        rule: 'feature-template-only',
        description: 'Features must render templates exclusively',
        severity: 'error',
        suggestion: 'Wrap atoms/molecules in templates',
      });
    }

    // Features should have module prefix
    if (!this.hasModulePrefix(code)) {
      violations.push({
        rule: 'feature-module-prefix',
        description: 'Features must have module prefix in name',
        severity: 'error',
        suggestion: 'Add module prefix (e.g., wallet-deposit.feature.tsx)',
      });
    }

    return violations;
  }

  /**
   * Check template-specific violations
   */
  private checkTemplateViolations(code: string): ArchitecturalViolation[] {
    const violations: ArchitecturalViolation[] = [];

    // Templates should not have use-case
    if (code.includes('use-case') || code.includes('useCase')) {
      violations.push({
        rule: 'template-no-use-case',
        description: 'Templates cannot contain use-case logic',
        severity: 'error',
        suggestion: 'Move logic to feature layer',
      });
    }

    // Templates should not have business logic
    if (this.hasBusinessLogic(code)) {
      violations.push({
        rule: 'template-no-business-logic',
        description: 'Templates should focus on layout only',
        severity: 'error',
        suggestion: 'Move business logic to feature layer',
      });
    }

    return violations;
  }

  /**
   * Check util-specific violations
   */
  private checkUtilViolations(code: string): ArchitecturalViolation[] {
    const violations: ArchitecturalViolation[] = [];

    // Utils should be pure functions
    if (this.hasReactDependencies(code)) {
      violations.push({
        rule: 'util-pure-functions',
        description: 'Utils should be pure functions without React dependencies',
        severity: 'error',
        suggestion: 'Remove React dependencies or move to appropriate layer',
      });
    }

    return violations;
  }

  /**
   * Check general violations
   */
  private checkGeneralViolations(code: string): ArchitecturalViolation[] {
    const violations: ArchitecturalViolation[] = [];

    // Check for console.log statements
    if (code.includes('console.log')) {
      violations.push({
        rule: 'no-console-log',
        description: 'Remove console.log statements',
        severity: 'warning',
        suggestion: 'Use proper logging or remove debug statements',
      });
    }

    // Check for any type usage
    if (code.includes(': any') || code.includes('<any>')) {
      violations.push({
        rule: 'no-any-type',
        description: 'Avoid using "any" type',
        severity: 'warning',
        suggestion: 'Use specific types instead of "any"',
      });
    }

    return violations;
  }

  /**
   * Check naming convention violations
   */
  private checkNamingViolations(code: string, layer: LayerType): ArchitecturalViolation[] {
    const violations: ArchitecturalViolation[] = [];

    // Check component naming
    const componentMatch = code.match(/export\s+(?:const|function)\s+(\w+)/);
    if (componentMatch && componentMatch[1]) {
      const componentName = componentMatch[1];
      const expectedSuffix = this.getExpectedComponentSuffix(layer);
      
      if (!componentName.endsWith(expectedSuffix)) {
        violations.push({
          rule: 'component-naming-convention',
          description: `Component should end with ${expectedSuffix}`,
          severity: 'error',
          suggestion: `Rename to ${componentName}${expectedSuffix}`,
        });
      }
    }

    return violations;
  }

  /**
   * Check import/export violations
   */
  private checkImportExportViolations(code: string, layer: LayerType): ArchitecturalViolation[] {
    const violations: ArchitecturalViolation[] = [];

    // Check for invalid imports based on layer hierarchy
    const imports = this.extractImports(code);
    for (const importPath of imports) {
      if (!this.isValidImport(importPath, layer)) {
        violations.push({
          rule: 'invalid-layer-import',
          description: `Invalid import from ${importPath}`,
          severity: 'error',
          suggestion: 'Remove invalid import or restructure dependencies',
        });
      }
    }

    return violations;
  }

  /**
   * Calculate code metrics
   */
  private calculateMetrics(code: string): CodeMetrics {
    const lines = code.split('\n').length;
    const functions = (code.match(/function\s+\w+|const\s+\w+\s*=/g) || []).length;
    const dependencies = (code.match(/import\s+.*from/g) || []).length;
    
    return {
      complexity: this.calculateComplexity(code),
      maintainability: this.calculateMaintainability(code),
      readability: this.calculateReadability(code),
      testability: this.calculateTestability(code),
      reusability: this.calculateReusability(code),
      lines,
      functions,
      dependencies,
    };
  }

  /**
   * Calculate overall score
   */
  private calculateScore(
    issues: CodeIssue[],
    violations: ArchitecturalViolation[],
    metrics: CodeMetrics
  ): number {
    let score = 100;

    // Deduct for issues
    for (const issue of issues) {
      switch (issue.severity) {
        case 'critical': score -= 20; break;
        case 'high': score -= 10; break;
        case 'medium': score -= 5; break;
        case 'low': score -= 2; break;
      }
    }

    // Deduct for violations
    for (const violation of violations) {
      score -= violation.severity === 'error' ? 15 : 5;
    }

    // Factor in metrics
    score = score * (metrics.maintainability / 100);

    return Math.max(0, Math.min(100, score));
  }

  // Helper methods
  private countStateVariables(code: string): number {
    return (code.match(/useState/g) || []).length;
  }

  private rendersAtomsMoleculesDirectly(code: string): boolean {
    return /\<\w+Atom|\<\w+Molecule/.test(code);
  }

  private hasModulePrefix(code: string): boolean {
    return /-/.test(code) && /\w+-\w+/.test(code);
  }

  private hasBusinessLogic(code: string): boolean {
    const businessKeywords = ['useState', 'useEffect', 'api', 'fetch', 'axios'];
    return businessKeywords.some(keyword => code.includes(keyword));
  }

  private hasReactDependencies(code: string): boolean {
    return code.includes('import React') || code.includes('from \'react\'');
  }

  private getExpectedComponentSuffix(layer: LayerType): string {
    const suffixes: Record<LayerType, string> = {
      atom: 'Atom',
      molecule: 'Molecule',
      organism: 'Organism',
      template: 'Template',
      feature: 'Feature',
      layout: 'Layout',
      particle: 'Particle',
      model: 'Model',
      entity: '',
      util: 'Util',
      gateway: 'Gateway',
      repository: 'Repository',
    };
    return suffixes[layer];
  }

  private extractImports(code: string): string[] {
    const importRegex = /import\s+.*from\s+['"]([^'"]+)['"]/g;
    const imports: string[] = [];
    let match;
    
    while ((match = importRegex.exec(code)) !== null) {
      if (match[1]) {
        imports.push(match[1]);
      }
    }
    
    return imports;
  }

  private isValidImport(importPath: string, layer: LayerType): boolean {
    // Simplified validation - in real implementation, check against layer hierarchy
    const allowedPaths = ['react', '@types', 'utils'];
    return allowedPaths.some(path => importPath.includes(path)) || 
           importPath.startsWith('./') || 
           importPath.startsWith('../');
  }

  private calculateComplexity(code: string): number {
    // Simplified complexity calculation
    const cyclomaticKeywords = ['if', 'else', 'for', 'while', 'switch', 'case', '&&', '||'];
    let complexity = 1;
    
    for (const keyword of cyclomaticKeywords) {
      complexity += (code.match(new RegExp(keyword, 'g')) || []).length;
    }
    
    return Math.min(100, complexity * 2);
  }

  private calculateMaintainability(code: string): number {
    const lines = code.split('\n').length;
    const functions = (code.match(/function|=>/g) || []).length;
    
    if (lines === 0) return 100;
    
    const avgFunctionLength = lines / Math.max(1, functions);
    const maintainability = Math.max(0, 100 - avgFunctionLength);
    
    return Math.min(100, maintainability);
  }

  private calculateReadability(code: string): number {
    const lines = code.split('\n');
    const comments = lines.filter(line => line.trim().startsWith('//')).length;
    const commentRatio = comments / lines.length;
    
    return Math.min(100, 50 + (commentRatio * 50));
  }

  private calculateTestability(code: string): number {
    // Higher testability for pure functions and simple components
    const hasComplexState = code.includes('useState') && this.countStateVariables(code) > 3;
    const hasEffects = code.includes('useEffect');
    
    let testability = 100;
    if (hasComplexState) testability -= 30;
    if (hasEffects) testability -= 20;
    
    return Math.max(0, testability);
  }

  private calculateReusability(code: string): number {
    // Higher reusability for components with props and minimal dependencies
    const hasProps = code.includes('Props') || code.includes('props');
    const dependencies = (code.match(/import/g) || []).length;
    
    let reusability = hasProps ? 80 : 40;
    reusability -= Math.min(40, dependencies * 5);
    
    return Math.max(0, reusability);
  }

  private checkBasicIssues(code: string): CodeIssue[] {
    const issues: CodeIssue[] = [];

    // Check for long lines
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      if (line.length > 120) {
        issues.push({
          type: 'warning',
          category: 'convention',
          message: 'Line too long (>120 characters)',
          line: index + 1,
          severity: 'low',
          suggestion: 'Break line into multiple lines',
          rule: 'max-line-length',
        });
      }
    });

    return issues;
  }

  private buildAnalysisPrompt(code: string, layer: LayerType, context?: Record<string, any>): string {
    return `
Analyze this ${layer} layer code for architectural violations and improvements:

\`\`\`typescript
${code}
\`\`\`

Check for:
1. Layer-specific violations
2. Naming conventions
3. Code quality issues
4. Performance problems
5. Maintainability concerns

Return analysis in JSON format with issues and suggestions.
    `;
  }

  private convertValidationIssueToCodeIssue(issue: ValidationIssue): CodeIssue {
    const codeIssue: CodeIssue = {
      type: issue.type as any,
      category: 'architecture',
      message: issue.message,
      severity: issue.type === 'error' ? 'high' : 'medium',
    };

    if (issue.line !== undefined) {
      codeIssue.line = issue.line;
    }

    if (issue.column !== undefined) {
      codeIssue.column = issue.column;
    }

    if (issue.suggestion !== undefined) {
      codeIssue.suggestion = issue.suggestion;
    }

    return codeIssue;
  }

  private extractSuggestionsFromAI(improvements: string[]): CodeSuggestion[] {
    return improvements.map(improvement => ({
      type: 'refactor',
      description: improvement,
      impact: 'medium',
      effort: 'medium',
    }));
  }

  private suggestPerformanceImprovements(code: string): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    if (code.includes('useEffect') && !code.includes('useMemo')) {
      suggestions.push({
        type: 'optimize',
        description: 'Consider using useMemo for expensive calculations',
        impact: 'medium',
        effort: 'low',
      });
    }

    return suggestions;
  }

  private suggestMaintainabilityImprovements(code: string): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    const lines = code.split('\n').length;
    if (lines > 200) {
      suggestions.push({
        type: 'refactor',
        description: 'Component is too large, consider breaking into smaller components',
        impact: 'high',
        effort: 'high',
      });
    }

    return suggestions;
  }

  private suggestConventionImprovements(code: string, layer: LayerType): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    if (!code.includes('testID')) {
      suggestions.push({
        type: 'convention',
        description: 'Add testID prop for testing',
        impact: 'low',
        effort: 'low',
      });
    }

    return suggestions;
  }

  private suggestArchitectureImprovements(code: string, layer: LayerType): CodeSuggestion[] {
    const suggestions: CodeSuggestion[] = [];

    if (layer === 'molecule' && !code.includes('use-case')) {
      suggestions.push({
        type: 'architecture',
        description: 'Add use-case hook for business logic',
        impact: 'high',
        effort: 'medium',
      });
    }

    return suggestions;
  }

  private deduplicateIssues(issues: CodeIssue[]): CodeIssue[] {
    const seen = new Set<string>();
    return issues.filter(issue => {
      const key = `${issue.type}:${issue.message}:${issue.line}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private deduplicateSuggestions(suggestions: CodeSuggestion[]): CodeSuggestion[] {
    const seen = new Set<string>();
    return suggestions.filter(suggestion => {
      const key = `${suggestion.type}:${suggestion.description}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private getDefaultMetrics(): CodeMetrics {
    return {
      complexity: 0,
      maintainability: 0,
      readability: 0,
      testability: 0,
      reusability: 0,
      lines: 0,
      functions: 0,
      dependencies: 0,
    };
  }
}