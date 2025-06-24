# 🚀 Especificações Técnicas do Khaos CLI

Este documento detalha as especificações técnicas completas do Khaos CLI, incluindo arquitetura, comandos, configurações e integração com IA.

---

## 📋 Visão Geral

O **Khaos CLI** é uma ferramenta de linha de comando inteligente que automatiza a criação, validação e manutenção de código seguindo rigorosamente a arquitetura Khaos. O foco principal é garantir **conformidade absoluta** com as convenções estabelecidas através de validação rigorosa e geração inteligente de código.

## 🔄 Modo Interativo vs Linha de Comando

O CLI Khaos oferece duas formas de uso para máxima flexibilidade:

### 🔄 Modo Interativo (Padrão)
Quando executado sem parâmetros completos, o CLI entra em modo interativo com perguntas passo a passo:

```bash
khaos create feature
? Qual é o nome de sua feature? strategy/investors
? Esta página é pública ou autenticada? private
? Posso criar o template também? sim
✅ Feature strategy/investors criada com sucesso!
```

**Vantagens:**
- Guia iniciantes através do processo
- Reduz erros de sintaxe
- Descobre opções disponíveis
- Experiência mais amigável

### ⚡ Modo Linha de Comando (Avançado)
Para usuários experientes que preferem comandos completos:

```bash
khaos create feature strategy/investors --route-type=private --with-template
```

**Vantagens:**
- Execução mais rápida
- Ideal para scripts e automação
- Controle total sobre parâmetros
- Compatível com CI/CD

### 🎯 Objetivos Principais

1. **Validação Rigorosa**: Sistema que garante 100% de conformidade com a arquitetura Khaos
2. **Criação Inteligente**: IA que analisa descrições e gera código apropriado para cada camada
3. **Detecção de Violações**: Identificação automática de code smells e violações arquiteturais
4. **Refatoração Assistida**: Sugestões inteligentes de melhorias baseadas nas boas práticas

---

## 🏗️ Arquitetura Técnica

### 📁 Estrutura de Pastas

```
khaos-cli/
├── src/
│   ├── core/                          # Core do sistema
│   │   ├── ai/                        # Integração com IA
│   │   │   ├── providers/             # OpenAI, Anthropic, etc.
│   │   │   ├── analyzers/             # Análise de código e descrições
│   │   │   └── generators/            # Geração de código inteligente
│   │   ├── validators/                # Sistema de validação
│   │   │   ├── layer-validators/      # Validadores por camada
│   │   │   ├── convention-validators/ # Validadores de convenções
│   │   │   └── architecture-validator.ts
│   │   ├── parsers/                   # Análise de código existente
│   │   └── utils/                     # Utilitários compartilhados
│   ├── commands/                      # Comandos CLI
│   │   ├── create/                    # Comandos de criação
│   │   ├── validate/                  # Comandos de validação
│   │   ├── refactor/                  # Comandos de refatoração
│   │   └── analyze/                   # Comandos de análise
│   ├── templates/                     # Templates por camada
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   │   ├── templates/
│   │   ├── features/
│   │   ├── layouts/
│   │   ├── particles/
│   │   ├── models/
│   │   ├── entities/
│   │   ├── utils/
│   │   ├── gateways/
│   │   └── repositories/
│   ├── schemas/                       # Schemas de validação
│   │   ├── layer-schemas/
│   │   └── convention-schemas/
│   └── config/                        # Configurações
├── docs/                              # Documentação
├── tests/                             # Testes automatizados
└── examples/                          # Exemplos de uso
```

### 🛠️ Stack Tecnológica

```json
{
  "dependencies": {
    "commander": "^12.0.0",           // CLI framework
    "inquirer": "^8.2.6",            // Interface interativa
    "ejs": "^3.1.10",                // Templates
    "fs-extra": "^11.3.0",           // Sistema de arquivos
    "openai": "^4.0.0",              // OpenAI API
    "@anthropic-ai/sdk": "^0.20.0",  // Anthropic API
    "zod": "^3.22.0",                // Validação de schemas
    "typescript": "^5.8.3",          // TypeScript
    "chalk": "^5.3.0",               // Cores no terminal
    "ora": "^7.0.1",                 // Loading spinners
    "glob": "^10.3.0",               // Pattern matching
    "ast-types": "^0.16.1",          // AST parsing
    "@typescript-eslint/parser": "^6.0.0", // TypeScript AST
    "prettier": "^3.0.0",            // Code formatting
    "@tanstack/react-query": "^5.0.0" // React Query para repositories
  }
}
```

---

## 🎮 Comandos CLI

### 📦 Comandos de Criação

#### `khaos create`
Comando principal para criação de componentes com IA integrada.

```bash
# Criação inteligente com descrição em linguagem natural
khaos create --smart "um botão reutilizável com variantes de cor"

# Criação específica por camada
khaos create atom button
khaos create molecule modal --with-atoms=button,icon
khaos create organism header --with-molecules=logo,navigation
khaos create template dashboard --with-organisms=header,sidebar

# Criação de features com rotas automáticas
khaos create feature strategy/investors --route-type=private
khaos create feature auth/login --route-type=public
khaos create feature dashboard/overview --route-type=private --route-path=dashboard/overview

# Criação de layouts baseado em diretório
khaos create layout (app)/(private)/strategy --type=stack
khaos create layout (app)/(public)/auth --type=tabs
khaos create layout (app)/(private)/dashboard/settings --type=drawer

# Outras camadas
khaos create particle theme-provider
khaos create model strategy
khaos create entity strategy
khaos create util format-date
khaos create gateway find-one-strategy
khaos create repository strategy

# Opções avançadas
khaos create atom button --with-tests --with-stories --with-mocks
khaos create molecule modal --ai-provider=openai --template=custom
khaos create layout (app)/(private)/strategy --type=stack --with-expo-router
```

#### Fluxos Interativos por Camada

**Molécula:**
```bash
khaos create molecule
? Qual é o nome da molécula? LoginForm
? Incluir hooks customizados? sim
? Adicionar utilitários específicos? não
? Incluir arquivos de teste? sim
? Usar validação de formulário? sim
✅ Molécula LoginForm criada com sucesso!
```

**Organismo:**
```bash
khaos create organism
? Qual é o nome do organismo? Header
? Incluir sub-componentes? sim
? Adicionar hooks customizados? sim
? Incluir utilitários específicos? não
? Incluir arquivos de teste? sim
? Tipo de organismo: Navigation, Content ou Layout? navigation
✅ Organismo Header criado com sucesso!
```

**Template:**
```bash
khaos create template
? Qual é o nome do template? Dashboard
? Incluir sub-componentes? sim
? Adicionar hooks customizados? não
? Incluir arquivos de teste? sim
? Quais componentes usar: Atoms, Molecules, Organisms? atoms,molecules,organisms
✅ Template Dashboard criado com sucesso!
```

**Flags Disponíveis:**
- `--smart`: Criação inteligente com IA
- `--with-tests`: Incluir arquivos de teste
- `--with-stories`: Incluir Storybook stories
- `--with-mocks`: Incluir arquivos de mock
- `--with-variants`: Incluir arquivo de variantes (CVA)
- `--with-constants`: Incluir arquivo de constantes
- `--with-hooks`: Incluir hooks customizados
- `--with-utils`: Incluir utilitários específicos
- `--with-components`: Incluir sub-componentes
- `--type`: Tipo específico (component|constant|type|util para atoms; stack|tabs|drawer para layouts)
- `--route-type`: Tipo de rota para features (public|private)
- `--route-path`: Caminho da rota no app (ex: strategy/investors)
- `--with-template`: Criar template associado (para features)
- `--with-layout`: Criar layout específico (para features)
- `--with-navigation`: Incluir componentes de navegação (para layouts)
- `--with-sidebar`: Incluir sidebar (para layouts)
- `--with-expo-router`: Usar padrões Expo Router (padrão: true)
- `--ai-provider`: Escolher provider de IA (openai|anthropic|openrouter)
- `--template`: Template customizado
- `--dry-run`: Simular sem criar arquivos

### 🔍 Comandos de Validação

#### `khaos validate`
Sistema completo de validação arquitetural.

```bash
# Validação completa do projeto
khaos validate

# Validação por camada específica
khaos validate --layer=atoms
khaos validate --layer=molecules
khaos validate --layer=organisms

# Validação de arquivo/diretório específico
khaos validate --file=src/atoms/button/
khaos validate --path=src/features/

# Validação com correção automática
khaos validate --fix

# Validação rigorosa (modo CI)
khaos validate --strict --ci

# Validação com relatório detalhado
khaos validate --report --output=validation-report.json
```

**Flags Disponíveis:**
- `--layer`: Validar camada específica
- `--file`: Validar arquivo específico
- `--path`: Validar diretório específico
- `--fix`: Aplicar correções automáticas
- `--strict`: Modo rigoroso (falha em warnings)
- `--ci`: Modo CI/CD (output otimizado)
- `--report`: Gerar relatório detalhado
- `--output`: Arquivo de saída do relatório

### 🔬 Comandos de Análise

#### `khaos analyze`
Análise avançada de código e métricas.

```bash
# Detectar code smells
khaos analyze --smells

# Métricas de qualidade
khaos analyze --metrics

# Análise de dependências
khaos analyze --dependencies

# Análise de complexidade
khaos analyze --complexity

# Análise de cobertura arquitetural
khaos analyze --coverage

# Dashboard de saúde do projeto
khaos analyze --dashboard
```

**Flags Disponíveis:**
- `--smells`: Detectar code smells
- `--metrics`: Calcular métricas de qualidade
- `--dependencies`: Analisar dependências
- `--complexity`: Medir complexidade ciclomática
- `--coverage`: Cobertura arquitetural
- `--dashboard`: Dashboard interativo

### ♻️ Comandos de Refatoração

#### `khaos refactor`
Refatoração assistida por IA.

```bash
# Sugestões de refatoração
khaos refactor --suggest

# Aplicar refatorações específicas
khaos refactor --apply=extract-component,rename-variable

# Preview das mudanças
khaos refactor --preview

# Refatoração automática de code smells
khaos refactor --auto-fix-smells

# Migração entre versões da arquitetura
khaos refactor --migrate-to=v2.0
```

**Flags Disponíveis:**
- `--suggest`: Sugerir refatorações
- `--apply`: Aplicar refatorações específicas
- `--preview`: Preview das mudanças
- `--auto-fix-smells`: Corrigir code smells automaticamente
- `--migrate-to`: Migrar para versão específica

### ⚙️ Comandos de Configuração

#### `khaos config`
Gerenciamento de configurações.

```bash
# Inicializar projeto
khaos init

# Configurar provider de IA
khaos config ai --provider=openai
khaos config ai --provider=anthropic
khaos config ai --provider=openrouter

# Configurar chaves de API
khaos config ai --openai-key=sk-...
khaos config ai --anthropic-key=sk-ant-...
khaos config ai --openrouter-key=sk-or-...

# Configurar modelos específicos
khaos config ai --openai-model=gpt-4
khaos config ai --anthropic-model=claude-3-sonnet
khaos config ai --openrouter-model=anthropic/claude-3.5-sonnet

# Configurar fallback para OpenRouter
khaos config ai --openrouter-fallback="openai/gpt-4,meta-llama/llama-3.1-70b"

# Configurar templates customizados
khaos config --templates=./custom-templates

# Configurar regras de validação
khaos config --rules=strict

# Exportar/importar configurações
khaos config --export=khaos.config.json
khaos config --import=khaos.config.json

# Comandos específicos do OpenRouter
khaos config ai --list-openrouter-models
khaos config ai --compare-pricing
khaos config ai --openrouter-daily-limit=5.00
```

### 📊 Comandos de Relatórios

#### `khaos report`
Geração de relatórios e métricas.

```bash
# Relatório de conformidade
khaos report --conformity

# Relatório de qualidade
khaos report --quality

# Relatório de evolução
khaos report --evolution --since=30d

# Relatório customizado
khaos report --template=custom-report.ejs
```

---

## 🤖 Sistema de IA

### 🔌 Providers Suportados

#### OpenAI Integration
```typescript
interface OpenAIConfig {
  apiKey: string;
  model: 'gpt-4' | 'gpt-3.5-turbo';
  temperature: number;
  maxTokens: number;
}
```

#### Anthropic Integration
```typescript
interface AnthropicConfig {
  apiKey: string;
  model: 'claude-3-opus' | 'claude-3-sonnet';
  temperature: number;
  maxTokens: number;
}
```

#### OpenRouter Integration
```typescript
interface OpenRouterConfig {
  apiKey: string;
  model: string; // Qualquer modelo disponível no OpenRouter
  temperature: number;
  maxTokens: number;
  appUrl?: string;
  fallbackModels?: string[];
}
```

##### 🌐 Modelos Disponíveis no OpenRouter
- **OpenAI**: `openai/gpt-4`, `openai/gpt-4-turbo`, `openai/gpt-3.5-turbo`
- **Anthropic**: `anthropic/claude-3.5-sonnet`, `anthropic/claude-3-opus`, `anthropic/claude-3-haiku`
- **Meta**: `meta-llama/llama-3.1-405b`, `meta-llama/llama-3.1-70b`, `meta-llama/llama-3.1-8b`
- **Google**: `google/gemini-pro`, `google/gemini-flash`
- **Especializados**: `deepseek/deepseek-coder`, `codellama/codellama-70b`

##### 💰 Vantagens do OpenRouter
1. **Acesso Unificado**: Uma única API key para múltiplos modelos
2. **Preços Competitivos**: Até 50% mais barato que APIs diretas
3. **Flexibilidade**: Troca de modelos sem mudança de código
4. **Fallback Inteligente**: Mudança automática se um modelo falha
5. **Ideal para Desenvolvimento**: Teste diferentes modelos facilmente

### 🧠 Análise Inteligente

#### Classificação de Camadas
```typescript
interface LayerAnalysis {
  intent: string;                    // "criar um botão reutilizável"
  suggestedLayer: LayerType;         // "atom"
  confidence: number;                // 0.95
  suggestedName: string;             // "button"
  requiredFeatures: string[];        // ["clickable", "styled"]
  optionalFeatures: string[];        // ["variants", "icons"]
  dependencies: string[];            // ["react", "react-native"]
}
```

#### Geração de Código
```typescript
interface CodeGeneration {
  files: Record<string, string>;     // Arquivos gerados
  validation: ValidationResult;      // Resultado da validação
  metadata: {
    layer: LayerType;
    name: string;
    generatedAt: Date;
    aiProvider: string;
    confidence: number;
  };
}
```

---

## 📋 Sistema de Validação

### 🔍 Validadores por Camada

#### Configuração de Validação
```typescript
interface ValidationConfig {
  atoms: {
    requiredFiles: ['index.ts', '*.atom.tsx', '*.type.ts'];
    optionalFiles: ['*.constant.ts', '*.mock.ts', '*.spec.ts'];
    restrictedFiles: ['*.variant.ts', '*.stories.tsx', '*.use-case.ts', '_services/'];
    namingConventions: NamingRules;
    structureRules: StructureRules;
    compositionRoot: true; // Atoms têm composition root
  };
  molecules: {
    requiredFiles: string[];
    mustImportAtoms: boolean;
    mustHaveUseCase: boolean;
    restrictedFiles: string[];
    compositionRoot: true; // Molecules têm composition root
  };
  organisms: {
    requiredFiles: string[];
    canMakeDirectAPICalls: true; // Organisms podem fazer chamadas diretas de API
    compositionRoot: true; // Organisms têm composition root
  };
  templates: {
    requiredFiles: string[];
    dependsOn: ['atoms', 'molecules', 'organisms']; // Templates dependem de componentes, não Features
    restrictedDependencies: ['features'];
    compositionRoot: true; // Templates têm composition root
  };
  features: {
    requiredFiles: string[];
    renderExclusively: ['templates']; // Features renderizam exclusivamente templates
    hierarchyPosition: 'top'; // Features estão no topo da hierarquia
  };
  layouts: {
    requiredFiles: ['_layout.tsx'];
    optionalFiles: ['index.ts', '*.type.ts', '*.constant.ts', '*.spec.ts', '*.tsx'];
    restrictedFiles: ['*.stories.tsx', '*.variant.ts', '*.mock.ts', '*.use-case.ts', '_services/'];
    mustUseExpoRouter: true;
    validLayoutTypes: ['Stack', 'Tabs', 'Drawer'];
    mustExportDefault: true;
    fileSystemRouting: true;
    routesMustExportFeatures: true;
    layoutsAreNavigationOnly: true;
    directoryBased: true;
    pathToLayoutGeneration: true;
  };
  repositories: {
    requiredFiles: string[];
    mustUseReactQuery: boolean;
    mustHaveQueryKeys: boolean;
    mustReturnHooks: boolean;
    queryKeyPattern: RegExp;
    restrictedFiles: string[];
  };
  utils: {
    restrictedUsage: ['entity', 'gateway', 'repository', 'model']; // Utils não podem ser usados nessas camadas
    pureFunctionsOnly: true;
  };
  // Hierarquia corrigida: App → Feature → Template → Components
  hierarchy: {
    order: ['app', 'feature', 'template', 'organism', 'molecule', 'atom'];
    dependencies: {
      app: ['feature'],
      feature: ['template'],
      template: ['organism', 'molecule', 'atom'],
      organism: ['molecule', 'atom'],
      molecule: ['atom'],
      atom: []
    };
  };
}
```

#### Schemas Zod
```typescript
export const AtomSchema = z.object({
  name: z.string().regex(/^[a-z]+(-[a-z]+)*$/, 'Must be dash-case'),
  files: z.object({
    'index.ts': z.string(),
    '*.atom.tsx': z.string(),
    '*.type.ts': z.string(),
    '*.constant.ts': z.string().optional(),
    '*.mock.ts': z.string().optional(),
    '*.spec.ts': z.string().optional(),
  }),
  structure: z.object({
    hasTestID: z.boolean(),
    exportsFromIndex: z.boolean(),
    usesNamespace: z.boolean(),
    hasCompositionRoot: z.boolean(), // Atoms têm composition root
  }),
  restrictions: z.object({
    noVariantExport: z.boolean(), // variant.ts não exportado no index.ts
    noStoriesExport: z.boolean(), // stories.tsx não exportado no index.ts
    noSpecExport: z.boolean(), // spec.ts não exportado no index.ts
  }),
});

export const LayoutSchema = z.object({
  name: z.string().regex(/^[a-z]+(-[a-z]+)*$/, 'Must be dash-case'),
  files: z.object({
    '_layout.tsx': z.string(),
    'index.ts': z.string().optional(),
    '*.type.ts': z.string().optional(),
    '*.constant.ts': z.string().optional(),
    '*.spec.ts': z.string().optional(),
  }),
  structure: z.object({
    usesExpoRouter: z.boolean(),
    hasDefaultExport: z.boolean(),
    isNavigationOnly: z.boolean(),
    hasNoBusinessLogic: z.boolean(),
    hasNoRestrictedFiles: z.boolean(),
  }),
  expoRouter: z.object({
    layoutType: z.enum(['Stack', 'Tabs', 'Drawer']),
    hasScreenOptions: z.boolean(),
    hasScreens: z.boolean(),
    usesFileSystemRouting: z.boolean(),
    routesExportFeatures: z.boolean(),
  }),
  routes: z.array(z.object({
    file: z.string(),
    exportsFeature: z.boolean(),
    hasDefaultExport: z.boolean(),
    isSimpleExport: z.boolean(),
  })).optional(),
});

export const RepositorySchema = z.object({
  name: z.string().regex(/^[a-z]+(-[a-z]+)*$/, 'Must be dash-case'),
  files: z.object({
    'index.ts': z.string(),
    '*.repository.ts': z.string(),
    '*.repository.spec.ts': z.string().optional(),
  }),
  structure: z.object({
    usesReactQuery: z.boolean(),
    hasQueryKeys: z.boolean(),
    returnsHooks: z.boolean(),
    queryKeysHierarchical: z.boolean(),
    exportsFromIndex: z.boolean(),
  }),
  reactQuery: z.object({
    hasUseQuery: z.boolean(),
    hasUseMutation: z.boolean(),
    hasQueryClient: z.boolean(),
    hasInvalidation: z.boolean(),
    queryKeysPattern: z.string().regex(/^\[.*\]$/, 'Query keys must be arrays'),
  }),
  restrictions: z.object({
    noUtilsUsage: z.boolean(), // Utils não podem ser usados em repositories
  }),
});

export const OrganismSchema = z.object({
  name: z.string().regex(/^[a-z]+(-[a-z]+)*$/, 'Must be dash-case'),
  files: z.object({
    'index.ts': z.string(),
    '*.organism.tsx': z.string(),
    '*.type.ts': z.string(),
    '*.use-case.ts': z.string(),
  }),
  structure: z.object({
    hasTestID: z.boolean(),
    exportsFromIndex: z.boolean(),
    usesNamespace: z.boolean(),
    hasCompositionRoot: z.boolean(), // Organisms têm composition root
    canMakeDirectAPICalls: z.boolean(), // Organisms podem fazer chamadas diretas de API
  }),
});

export const TemplateSchema = z.object({
  name: z.string().regex(/^[a-z]+(-[a-z]+)*$/, 'Must be dash-case'),
  files: z.object({
    'index.ts': z.string(),
    '*.template.tsx': z.string(),
    '*.type.ts': z.string(),
  }),
  structure: z.object({
    hasTestID: z.boolean(),
    exportsFromIndex: z.boolean(),
    usesNamespace: z.boolean(),
    hasCompositionRoot: z.boolean(), // Templates têm composition root
  }),
  dependencies: z.object({
    canDependOn: z.array(z.enum(['atom', 'molecule', 'organism'])),
    cannotDependOn: z.array(z.enum(['feature'])), // Templates não dependem de Features
  }),
});

export const FeatureSchema = z.object({
  name: z.string().regex(/^[a-z]+(-[a-z]+)*$/, 'Must be dash-case'),
  files: z.object({
    'index.ts': z.string(),
    '*.feature.tsx': z.string(),
    '*.type.ts': z.string(),
    '*.use-case.ts': z.string(),
  }),
  structure: z.object({
    hasTestID: z.boolean(),
    exportsFromIndex: z.boolean(),
    usesNamespace: z.boolean(),
    renderExclusively: z.array(z.enum(['template'])), // Features renderizam exclusivamente templates
  }),
  hierarchy: z.object({
    isTopLevel: z.boolean(), // Features estão no topo da hierarquia
    dependsOn: z.array(z.enum(['template'])),
  }),
});
```

### 🔍 Exemplos de Validação por Camada

#### Validação de Layouts
```bash
khaos validate --layer=layouts
```

**Output de Validação:**
```text
🔍 Validando Layouts...

✅ src/app/(app)/(private)/strategy/
├── _layout.tsx: ✅ Válido (Stack Layout)
│   ├── ✅ Usa Stack do Expo Router
│   ├── ✅ Exporta StrategyLayout como default
│   ├── ✅ Configura screens corretamente
│   └── ✅ Sem lógica de negócio
├── index.tsx: ✅ Válido
│   ├── ✅ Exporta StrategyFeature como default
│   └── ✅ Import simples de feature
├── investors.tsx: ✅ Válido
│   ├── ✅ Exporta StrategyInvestorsFeature como default
│   └── ✅ Import simples de feature
└── overview.tsx: ✅ Válido
    ├── ✅ Exporta StrategyOverviewFeature como default
    └── ✅ Import simples de feature

❌ src/app/(app)/(public)/auth/
├── _layout.tsx: ✅ Válido (Tabs Layout)
├── auth.stories.tsx: ❌ ERRO - Layouts não devem ter stories
├── auth.use-case.ts: ❌ ERRO - Layouts não devem ter use-cases
├── _services/: ❌ ERRO - Layouts não devem ter services
└── auth.mock.ts: ❌ ERRO - Layouts não devem ter mocks

⚠️ src/app/(app)/(private)/dashboard/
├── ❌ ERRO - _layout.tsx ausente (obrigatório)
├── index.tsx: ⚠️ AVISO - Não exporta feature
└── settings.tsx: ⚠️ AVISO - Contém lógica de negócio

📊 Resumo da Validação:
- ✅ Layouts válidos: 1/3 (33%)
- ❌ Layouts com erros: 2/3 (67%)
- 🔧 Correções automáticas disponíveis: 3
```

#### Validação Específica de Expo Router
```bash
khaos validate --layer=layouts --expo-router
```

**Verificações Específicas:**
- ✅ Usa Stack/Tabs/Drawer do Expo Router
- ✅ File-system routing implementado
- ✅ Screens configuradas corretamente
- ✅ Rotas exportam features como default
- ❌ Não contém lógica de negócio
- ❌ Não tem arquivos proibidos

### � Métricas de Qualidade

```typescript
interface QualityMetrics {
  conformity: {
    overall: number;              // 0.95 (95% conforme)
    byLayer: Record<LayerType, number>;
    violations: ViolationReport[];
  };
  
  codeQuality: {
    codeSmells: number;
    duplicatedCode: number;
    testCoverage: number;
    maintainabilityIndex: number;
  };
  
  architecture: {
    layerDistribution: Record<LayerType, number>;
    dependencyGraph: DependencyNode[];
    circularDependencies: string[];
  };
}
```

---

## 📝 Templates

### 🎨 Sistema de Templates

#### Template Engine (EJS)
```typescript
interface TemplateContext {
  name: string;
  layer: LayerType;
  pascalName: string;
  camelName: string;
  namespace: string;
  imports: string[];
  exports: string[];
  features: string[];
  metadata: Record<string, any>;
}
```

#### Template por Camada
```
templates/
├── atoms/
│   ├── component.atom.tsx.ejs
│   ├── types.ts.ejs
│   ├── index.ts.ejs
│   ├── stories.tsx.ejs
│   └── spec.ts.ejs
├── molecules/
│   ├── component.molecule.tsx.ejs
│   ├── use-case.ts.ejs
│   └── service.ts.ejs
├── layouts/
│   ├── _layout.stack.tsx.ejs
│   ├── _layout.tabs.tsx.ejs
│   ├── _layout.drawer.tsx.ejs
│   ├── route.tsx.ejs
│   ├── types.ts.ejs
│   ├── constants.ts.ejs
│   ├── index.ts.ejs
│   └── spec.ts.ejs
└── ...
```

### 🔧 Templates Customizáveis

#### Configuração de Templates
```javascript
// khaos.config.js
module.exports = {
  templates: {
    directory: './custom-templates',
    atoms: {
      component: './templates/custom-atom.ejs',
      types: './templates/custom-types.ejs',
    },
    variables: {
      author: 'Team Name',
      license: 'MIT',
      version: '1.0.0',
    },
  },
};
```

---

## ⚙️ Configuração

### 📄 Arquivo de Configuração

#### `khaos.config.js`
```javascript
module.exports = {
  // Configurações de IA
  ai: {
    provider: 'openrouter', // 'openai' | 'anthropic' | 'openrouter'
    apiKey: process.env.OPENROUTER_API_KEY,
    model: 'anthropic/claude-3.5-sonnet',
    temperature: 0.7,
    maxTokens: 2000,
    fallback: {
      enabled: true,
      provider: 'openai',
      models: ['openai/gpt-4-turbo', 'meta-llama/llama-3.1-70b'],
    },
    // Configurações específicas do OpenRouter
    openrouter: {
      appUrl: 'https://khaos-cli.dev',
      dailyLimit: 10.00,
      perRequestLimit: 0.50,
      fallbackModels: [
        'anthropic/claude-3.5-sonnet',
        'openai/gpt-4-turbo',
        'meta-llama/llama-3.1-70b',
        'openai/gpt-3.5-turbo'
      ],
    },
  },

  // Configurações de validação
  validation: {
    strict: false,
    autoFix: true,
    ignorePatterns: [
      'src/legacy/**',
      '**/*.test.ts',
    ],
    customRules: {
      'enforce-testid': 'error',
      'enforce-namespace': 'warn',
    },
    layers: {
      atoms: {
        maxComplexity: 5,
        requireTests: true,
      },
      molecules: {
        maxComplexity: 10,
        requireUseCase: true,
      },
    },
  },

  // Configurações de templates
  templates: {
    directory: './templates',
    variables: {
      author: 'Development Team',
      license: 'MIT',
    },
  },

  // Configurações de relatórios
  reports: {
    outputDir: './reports',
    formats: ['json', 'html', 'markdown'],
    includeMetrics: true,
    includeTrends: true,
  },

  // Configurações de integração
  integrations: {
    git: {
      autoCommit: true,
      commitMessage: '✨ feat({layer}): add {name} component',
      hooks: {
        preCommit: 'khaos validate',
      },
    },
    eslint: {
      configPath: '.eslintrc.js',
      autoFix: true,
    },
    prettier: {
      configPath: '.prettierrc',
      autoFormat: true,
    },
  },
};
```

### 🌍 Variáveis de Ambiente

```bash
# IA Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=sk-or-v1-...

# Configurações
KHAOS_CONFIG_PATH=./khaos.config.js
KHAOS_TEMPLATES_DIR=./templates
KHAOS_CACHE_DIR=./.khaos-cache

# Configurações específicas do OpenRouter
OPENROUTER_APP_URL=https://khaos-cli.dev
OPENROUTER_DAILY_LIMIT=10.00
OPENROUTER_DEFAULT_MODEL=anthropic/claude-3.5-sonnet

# Modo de execução
KHAOS_MODE=development # development | production
KHAOS_LOG_LEVEL=info   # error | warn | info | debug
```

---

## 🔄 Integração com Git

### 📝 Conventional Commits

```bash
# Padrões de commit automáticos
✨ feat(atom): add button component
♻️ refactor(molecule): rename modal to dialog
🐛 fix(organism): correct header navigation
🗑️ chore(util): remove unused format-date utility
📝 docs(layer): update atom documentation
```

### 🪝 Git Hooks

#### Pre-commit Hook
```bash
#!/bin/sh
# .git/hooks/pre-commit
khaos validate --strict
if [ $? -ne 0 ]; then
  echo "❌ Validation failed. Commit aborted."
  exit 1
fi
```

#### Pre-push Hook
```bash
#!/bin/sh
# .git/hooks/pre-push
khaos analyze --smells --ci
khaos report --conformity --ci
```

---

## 🧪 Testes

### 🔬 Estratégia de Testes

#### Testes Unitários
```typescript
// Teste de validador
describe('AtomValidator', () => {
  it('should validate correct atom structure', () => {
    const validator = new AtomValidator();
    const result = validator.validate(validAtomCode);
    expect(result.valid).toBe(true);
  });
});
```

#### Testes de Integração
```typescript
// Teste de fluxo completo
describe('Smart Create Flow', () => {
  it('should create valid atom from description', async () => {
    const cli = new KhaosCLI();
    const result = await cli.smartCreate({
      description: 'um botão reutilizável',
      layer: 'atom'
    });
    
    expect(result.success).toBe(true);
    expect(result.files).toHaveProperty('button.atom.tsx');
  });
});
```

#### Testes de Conformidade
```typescript
// Teste de conformidade com documentação
describe('Documentation Conformity', () => {
  it('should generate code matching atom.md examples', () => {
    const examples = loadExamplesFromDocs('atom.md');
    examples.forEach(example => {
      const generated = generator.generate(example.input);
      expect(generated).toMatchStructure(example.expected);
    });
  });
});
```

---

## 📊 Performance

### ⚡ Otimizações

#### Cache Inteligente
```typescript
interface CacheConfig {
  validation: {
    ttl: 300000, // 5 minutos
    maxSize: 1000,
  },
  ai: {
    ttl: 3600000, // 1 hora
    maxSize: 100,
  },
  templates: {
    precompile: true,
    watch: true,
  },
}
```

#### Processamento Paralelo
```typescript
// Validação paralela por camada
const validationPromises = layers.map(layer => 
  validateLayer(layer)
);
const results = await Promise.all(validationPromises);
```

### 📈 Métricas de Performance

- **Validação de projeto médio**: < 5 segundos
- **Geração de código**: < 3 segundos
- **Análise de dependências**: < 10 segundos
- **Taxa de erro**: < 1% em operações normais

---

## 🚀 Deployment

### 📦 Distribuição

#### NPM Package
```bash
npm install -g @khaos/cli
```

#### Binários Standalone
```bash
# Download direto
curl -L https://github.com/khaos/cli/releases/latest/download/khaos-linux -o khaos
chmod +x khaos
```

### 🔄 Atualizações

#### Auto-update
```bash
khaos update
khaos update --check
khaos update --beta
```

---

## 📚 Documentação

### 📖 Help System

```bash
# Help geral
khaos --help

# Help de comando específico
khaos create --help
khaos validate --help

# Exemplos interativos
khaos examples
khaos examples create atom
```

### 🎓 Tutoriais Interativos

```bash
# Tutorial guiado
khaos tutorial

# Tutorial específico
khaos tutorial create-first-atom
khaos tutorial setup-project
```

---

## 🔮 Roadmap

### 📅 Fases de Desenvolvimento

#### **FASE 1: Fundação e Validação** ✅
- Sistema de validação core
- Parser de código existente
- Comando de validação

#### **FASE 2: Integração com IA** 🚧
- Providers de IA (OpenAI, Anthropic)
- Analisadores inteligentes
- Geradores de código

#### **FASE 3: Criação Inteligente** 📋
- Templates avançados
- Comandos de criação inteligente
- Sistema de dependências

#### **FASE 4: Análise e Refatoração** 📋
- Detecção de code smells
- Sugestões de refatoração
- Métricas e relatórios

#### **FASE 5: Funcionalidades Avançadas** 📋
- Integração com Git
- Configuração e personalização
- Performance e otimização

---

## 🤝 Contribuição

### 🛠️ Setup de Desenvolvimento

```bash
git clone https://github.com/khaos/cli.git
cd khaos-cli
npm install
npm run build
npm link
```

### 🧪 Executar Testes

```bash
npm test
npm run test:watch
npm run test:coverage
```

### 📝 Padrões de Código

- **TypeScript** rigoroso
- **ESLint** + **Prettier**
- **Conventional Commits**
- **100% test coverage** para core features

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

## 🆘 Suporte

- **Documentação**: [docs.khaos.dev](https://docs.khaos.dev)
- **Issues**: [GitHub Issues](https://github.com/khaos/cli/issues)
- **Discussões**: [GitHub Discussions](https://github.com/khaos/cli/discussions)
- **Discord**: [Khaos Community](https://discord.gg/khaos)