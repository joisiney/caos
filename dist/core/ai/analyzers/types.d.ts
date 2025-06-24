/**
 * Types for AI Analyzers
 */
import { LayerType } from '../../types';
export interface LayerClassification {
    primary: {
        layer: LayerType;
        score: number;
    };
    alternatives: Array<{
        layer: LayerType;
        score: number;
    }>;
    confidence: number;
    reasoning: string;
}
export interface NamingSuggestion {
    primary: string;
    alternatives: string[];
    confidence: number;
    reasoning: string;
}
export interface DependencyAnalysis {
    dependencies: string[];
    imports: ImportSuggestion[];
    files: FileSuggestion[];
    confidence: number;
}
export interface ImportSuggestion {
    what: string;
    from: string;
    type: 'default' | 'named' | 'namespace';
    isType?: boolean;
}
export interface FileSuggestion {
    name: string;
    content: string;
    required: boolean;
}
export interface CodeAnalysisResult {
    issues: CodeIssue[];
    suggestions: CodeSuggestion[];
    score: number;
    confidence: number;
}
export interface CodeIssue {
    type: 'error' | 'warning' | 'suggestion';
    message: string;
    line?: number;
    column?: number;
    severity: 'low' | 'medium' | 'high';
}
export interface CodeSuggestion {
    type: string;
    description: string;
    before: string;
    after: string;
    confidence: number;
}
//# sourceMappingURL=types.d.ts.map