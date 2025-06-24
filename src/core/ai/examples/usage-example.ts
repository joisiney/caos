/**
 * Example usage of AI providers in Khaos CLI
 * This file demonstrates how to use the AI providers for analysis, generation, and validation
 */

import { ProviderFactory, AIProvider, LayerAnalysis, GeneratedCode } from '../index';

/**
 * Example: Basic AI provider usage
 */
export async function basicUsageExample() {
  try {
    // Get the default provider (based on environment variables)
    const provider = ProviderFactory.getDefaultProvider();
    
    console.log(`Using provider: ${provider.name} v${provider.version}`);
    
    // Test the connection
    await provider.test();
    console.log('✅ Provider connection successful');
    
    // Analyze a description
    const analysis = await provider.analyzeDescription(
      'um botão reutilizável com variantes de cor e tamanho'
    );
    
    console.log('📊 Analysis result:', {
      layer: analysis.layerType,
      name: analysis.componentName,
      confidence: analysis.confidence,
      reasoning: analysis.reasoning,
    });
    
    // Generate code based on analysis
    const template = {
      name: 'atom-template',
      content: `
import React from 'react';

export interface <%= namespace %>.Props {
  children: React.ReactNode;
  testID?: string;
}

export const <%= componentName %> = ({ children, testID }: <%= namespace %>.Props) => {
  return (
    <div data-testid={testID}>
      {children}
    </div>
  );
};
      `.trim(),
    };
    
    const generatedCode = await provider.generateCode(analysis, template);
    
    const fileNames = Object.keys(generatedCode.files);
    console.log('🎨 Generated files:', fileNames);
    
    const firstFileName = fileNames[0];
    if (firstFileName) {
      const firstFileContent = generatedCode.files[firstFileName];
      console.log('📝 Sample code:', firstFileContent?.substring(0, 200) + '...');
      
      // Validate the generated code
      const validationResult = await provider.validateCode(
        firstFileContent || '',
        {
          layer: analysis.layerType,
          prompt: `Validate this ${analysis.layerType} component`,
        }
      );
    
      console.log('✅ Validation result:', {
        isValid: validationResult.isValid,
        score: validationResult.score,
        issuesCount: validationResult.issues.length,
      });
    }
    
    // Get usage statistics
    const usage = provider.getUsage();
    console.log('📈 Usage statistics:', usage);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

/**
 * Example: Using specific provider
 */
export async function specificProviderExample() {
  try {
    // Create a specific OpenRouter provider
    const provider = ProviderFactory.createProvider('openrouter', {
      apiKey: process.env['OPENROUTER_API_KEY'] || '',
      model: 'anthropic/claude-3-5-sonnet',
      temperature: 0.3,
      maxTokens: 1000,
      timeout: 30000,
      appUrl: 'https://khaos-cli.dev',
      fallbackModels: [
        'openai/gpt-4-turbo',
        'meta-llama/llama-3.1-70b',
      ],
      dailyLimit: 10.00,
      perRequestLimit: 0.50,
    } as any);
    
    console.log(`Using specific provider: ${provider.name}`);
    
    // Analyze with context
    const analysis = await provider.analyzeDescription(
      'modal de confirmação que pode ser usado em várias telas',
      {
        projectStructure: ['src/atoms/', 'src/molecules/', 'src/organisms/'],
        existingLayers: ['atom', 'molecule'],
        framework: 'react',
        metadata: {
          projectType: 'web-app',
          hasDesignSystem: true,
        },
      }
    );
    
    console.log('📊 Contextual analysis:', {
      layer: analysis.layerType,
      name: analysis.componentName,
      confidence: analysis.confidence,
      dependencies: analysis.dependencies,
    });
    
  } catch (error) {
    console.error('❌ Error with specific provider:', error);
  }
}

/**
 * Example: Testing all available providers
 */
export async function testAllProvidersExample() {
  try {
    console.log('🔍 Available providers:', ProviderFactory.getAvailableProviders());
    
    const testResults = await ProviderFactory.testAllProviders();
    
    console.log('🧪 Provider test results:');
    for (const [provider, success] of testResults.entries()) {
      console.log(`  ${provider}: ${success ? '✅ Pass' : '❌ Fail'}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing providers:', error);
  }
}

/**
 * Example: Code validation and refactoring
 */
export async function validationAndRefactoringExample() {
  try {
    const provider = ProviderFactory.getDefaultProvider();
    
    // Sample code with issues
    const problematicCode = `
export const badButton = (props) => {
  return <button onClick={props.onClick}>{props.children}</button>;
};
    `;
    
    // Validate the code
    const validation = await provider.validateCode(problematicCode, {
      layer: 'atom',
      prompt: 'Validate this atom component for Khaos architecture compliance',
    });
    
    console.log('🔍 Validation issues:', validation.issues);
    console.log('💡 Improvement suggestions:', validation.improvements);
    
    // Suggest refactoring
    const refactoring = await provider.suggestRefactoring(problematicCode, [
      {
        type: 'naming-convention',
        description: 'Component name should follow PascalCase and include layer suffix',
        file: 'button.atom.tsx',
        severity: 'medium',
      },
      {
        type: 'missing-types',
        description: 'Missing TypeScript types and namespace',
        file: 'button.atom.tsx',
        severity: 'high',
      },
    ]);
    
    console.log('🔧 Refactoring suggestions:', refactoring.suggestions.length);
    console.log('📊 Refactoring confidence:', refactoring.confidence);
    
  } catch (error) {
    console.error('❌ Error in validation/refactoring:', error);
  }
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('🚀 Starting AI Providers Examples\n');
  
  console.log('1️⃣ Basic Usage Example');
  await basicUsageExample();
  console.log('\n');
  
  console.log('2️⃣ Specific Provider Example');
  await specificProviderExample();
  console.log('\n');
  
  console.log('3️⃣ Test All Providers Example');
  await testAllProvidersExample();
  console.log('\n');
  
  console.log('4️⃣ Validation and Refactoring Example');
  await validationAndRefactoringExample();
  console.log('\n');
  
  console.log('✅ All examples completed!');
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}