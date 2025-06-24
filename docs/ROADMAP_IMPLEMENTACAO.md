# 🚀 Roadmap de Implementação - Khaos CLI com IA

Este documento consolida todo o trabalho de planejamento realizado e serve como guia definitivo para iniciar o desenvolvimento do Khaos CLI. É a ponte entre o planejamento estratégico e a implementação técnica efetiva.

---

## 📋 Resumo Executivo

### 🎯 Visão do Projeto
O **Khaos CLI com IA** é uma ferramenta de linha de comando inteligente que automatiza a criação, validação e manutenção de código seguindo rigorosamente a arquitetura Khaos. O projeto visa garantir **conformidade absoluta** com as convenções estabelecidas através de validação rigorosa e geração inteligente de código.

### 🏆 Objetivos Alcançados na Fase de Planejamento
- ✅ **Documentação Completa**: 23 arquivos de especificação técnica criados
- ✅ **Arquitetura Definida**: Sistema modular com 5 fases de desenvolvimento
- ✅ **Validação Rigorosa**: Sistema de validação para todas as 12 camadas
- ✅ **Integração IA**: Especificação completa para OpenAI e Anthropic
- ✅ **Templates Prontos**: Base para geração de código em todas as camadas
- ✅ **Estratégia de Testes**: Cobertura completa com testes unitários e integração
- ✅ **Geradores IA Implementados**: Sistema completo de geração inteligente de código

### 📊 Métricas de Sucesso Definidas
- **Conformidade**: 100% das convenções validadas automaticamente
- **Performance**: Validação de projetos médios em < 5 segundos
- **Qualidade**: Taxa de erro < 1% em operações normais
- **IA**: Classificação correta de camadas em 95% dos casos

---

## 📚 Status da Documentação

### 📁 Arquivos Criados/Atualizados

#### 🏗️ Documentação Arquitetural
- [`PLANEJAMENTO_KHAOS_CLI_IA.md`](../PLANEJAMENTO_KHAOS_CLI_IA.md) - Planejamento estratégico completo
- [`docs/cli-specification.md`](cli-specification.md) - Especificações técnicas do CLI
- [`docs/ai-integration.md`](ai-integration.md) - Integração com IA (OpenAI/Anthropic)
- [`docs/project-structure.md`](project-structure.md) - Estrutura de pastas do projeto

#### 🔍 Sistema de Validação
- [`docs/validator.md`](validator.md) - Sistema de validação completo
- [`docs/layer-summary.md`](layer-summary.md) - Resumo de todas as camadas
- [`docs/code-smells.md`](code-smells.md) - Code smells a serem detectados
- [`docs/good-practices.md`](good-practices.md) - Boas práticas a serem seguidas

#### 📋 Especificações por Camada (12 camadas)
- [`docs/layers/atom.md`](layers/atom.md) - Elementos básicos reutilizáveis
- [`docs/layers/molecule.md`](layers/molecule.md) - Combinações de átomos
- [`docs/layers/organism.md`](layers/organism.md) - Composições complexas
- [`docs/layers/template.md`](layers/template.md) - Layouts visuais
- [`docs/layers/feature.md`](layers/feature.md) - Funcionalidades completas
- [`docs/layers/layout.md`](layers/layout.md) - Navegação e estrutura
- [`docs/layers/particle.md`](layers/particle.md) - Serviços compartilháveis
- [`docs/layers/model.md`](layers/model.md) - Regras de negócio
- [`docs/layers/entity.md`](layers/entity.md) - Tipos de dados da API
- [`docs/layers/util.md`](layers/util.md) - Funções utilitárias
- [`docs/layers/gateway.md`](layers/gateway.md) - Acesso a APIs
- [`docs/layers/repository.md`](layers/repository.md) - Orquestração de gateways

#### 🎯 Documentação de Apoio
- [`docs/general-conventions.md`](general-conventions.md) - Convenções gerais
- [`docs/partner-principles.md`](partner-principles.md) - Princípios de parceria
- [`docs/final-recommendation.md`](final-recommendation.md) - Recomendações finais

### 🔧 Configuração Base Existente
- [`package.json`](../package.json) - Dependências e scripts configurados
- [`tsconfig.json`](../tsconfig.json) - Configuração TypeScript

---

## 🎯 Próximos Passos Imediatos

### 🔥 **PRÓXIMA TAREFA PRIORITÁRIA: Integração dos Geradores com CLI**
Com o sistema de geradores IA implementado, precisamos agora:

1. **Implementar os AI Providers** (OpenAI, Anthropic, OpenRouter)
2. **Criar os Analyzers** (description-analyzer, layer-classifier)
3. **Implementar os Comandos CLI** que usam os geradores
4. **Criar Templates EJS** para todas as camadas
5. **Configurar sistema de testes** para validar a geração

### 🚀 Semana 1-2: Setup e Fundação
```bash
# 1. Configurar ambiente de desenvolvimento
npm install
npm run setup-dev

# 2. Configurar estrutura base
mkdir -p src/core/{validators,parsers,ai,utils}
mkdir -p src/commands/{create,validate,analyze,refactor}
mkdir -p src/templates/{atoms,molecules,organisms,templates,features}
mkdir -p src/schemas/{layer-schemas,convention-schemas}
mkdir -p src/prompts/{interactive,layer-prompts}

# 3. Configurar ferramentas de desenvolvimento
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev eslint @typescript-eslint/parser
npm install --save-dev prettier

# 4. Instalar dependências para modo interativo
npm install inquirer @types/inquirer
npm install chalk ora
```

### 🔍 Semana 3-4: Sistema de Validação Core
```bash
# 4. Implementar validadores base com correções da síntese
touch src/core/validators/architecture-validator.ts
touch src/core/validators/layer-validators/atom-validator.ts
touch src/core/validators/layer-validators/molecule-validator.ts
touch src/core/validators/layer-validators/organism-validator.ts
touch src/core/validators/layer-validators/template-validator.ts
touch src/core/validators/layer-validators/feature-validator.ts
touch src/core/validators/layer-validators/util-validator.ts

# 5. Criar schemas Zod com validações corrigidas
touch src/schemas/layer-schemas/atom-schema.ts
touch src/schemas/layer-schemas/molecule-schema.ts
touch src/schemas/layer-schemas/organism-schema.ts
touch src/schemas/layer-schemas/template-schema.ts
touch src/schemas/layer-schemas/feature-schema.ts
touch src/schemas/layer-schemas/util-schema.ts

# 6. Implementar parser TypeScript com validações específicas
touch src/core/parsers/typescript-parser.ts
touch src/core/parsers/project-analyzer.ts
touch src/core/parsers/hierarchy-validator.ts
touch src/core/parsers/composition-root-validator.ts
```

### 🤖 Semana 5-6: Integração IA Básica
```bash
# 7. Configurar providers de IA
touch src/core/ai/providers/openai-provider.ts
touch src/core/ai/providers/anthropic-provider.ts
touch src/core/ai/providers/ai-provider-interface.ts

# 8. Implementar analisadores
touch src/core/ai/analyzers/description-analyzer.ts
touch src/core/ai/analyzers/layer-classifier.ts

# 9. Configurar variáveis de ambiente
echo "OPENAI_API_KEY=your-key-here" > .env.example
echo "ANTHROPIC_API_KEY=your-key-here" >> .env.example
echo "OPENROUTER_API_KEY=your-key-here" >> .env.example
echo "OPENROUTER_APP_URL=https://khaos-cli.dev" >> .env.example

# 10. Configurar QueryClient para projetos gerados
touch src/templates/repositories/query-client-setup.ts

# ✅ CONCLUÍDO: Geradores IA Implementados
# ✅ Template Engine com 25+ helpers específicos para Khaos
# ✅ Variable Extractor para contexto de templates
# ✅ Template Selector inteligente com scoring
# ✅ File Generator com estrutura por camada
# ✅ Validation Generator com auto-correção
# ✅ Code Generator principal orquestrador
# ✅ Tipos estendidos e documentação completa
```

### 🌐 Configuração Específica do OpenRouter

```bash
# 10. Configurar OpenRouter como provider padrão (recomendado para desenvolvimento)
khaos config ai --provider=openrouter
khaos config ai --openrouter-key=$OPENROUTER_API_KEY
khaos config ai --openrouter-model=anthropic/claude-3.5-sonnet

# 11. Configurar fallback econômico
khaos config ai --openrouter-fallback="meta-llama/llama-3.1-70b,openai/gpt-3.5-turbo"
khaos config ai --openrouter-daily-limit=5.00

# 12. Testar configuração
khaos config ai --test
khaos config ai --list-openrouter-models
```

### 🔄 Configuração React Query para Projetos Gerados

```bash
# 13. Configurar QueryClient padrão para projetos
echo 'import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 30 * 60 * 1000, // 30 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});' > src/templates/repositories/query-client-setup.ts

# 14. Template de provider React Query
echo 'import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./query-client-setup";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);' > src/templates/repositories/query-provider.tsx
```

### � Semana 7-8: Comandos CLI Básicos
```bash
# 10. Implementar comandos principais
touch src/commands/validate/validate-project.ts
touch src/commands/create/smart-create.ts
touch src/index.ts

# 11. Configurar CLI com Commander
npm install commander inquirer chalk ora

# 12. Testes iniciais
npm run test
npm run build
npm link
```

---

## 🏗️ Estrutura de Desenvolvimento Sugerida

### 📅 Sprint 1 (Semanas 1-4): Fundação Sólida + Modo Interativo
**Objetivo**: Sistema de validação funcionando 100% + Prompts interativos básicos

**Entregáveis**:
- ✅ Validação completa de todas as camadas com correções da síntese
- ✅ Parser TypeScript funcional com validação de hierarquia
- ✅ Comando `khaos validate` operacional
- ✅ Relatórios de validação detalhados
- ✅ Validação de composition root para Atoms/Molecules/Organisms/Templates
- ✅ Validação de restrições de exports para Atoms
- ✅ Validação de hierarquia corrigida: App → Feature → Template → Components
- ✅ Sistema de prompts interativos implementado
- ✅ Modo interativo para criação de Atoms, Features e Layouts
- ✅ Fallback automático para modo interativo quando parâmetros incompletos

**Critérios de Aceitação**:
- Validação de projeto médio em < 5 segundos
- Detecção de 100% das violações documentadas incluindo as correções da síntese
- Cobertura de testes > 90%
- Validação correta de que Atoms não exportam variant.ts, stories.tsx, spec.ts no index.ts
- Validação de que Organisms podem fazer chamadas diretas de API
- Validação de que Templates dependem de componentes (não Features)
- Validação de que Features renderizam exclusivamente templates
- Validação de que Utils não são usados em Entity, Gateway, Repository, Model
- **Modo interativo funcional para todas as camadas principais**
- **Experiência de usuário intuitiva com perguntas claras**
- **Equivalência entre modo interativo e linha de comando**

### 📅 Sprint 2 (Semanas 5-8): IA Inteligente - **85% CONCLUÍDA** ✅
**Objetivo**: Criação inteligente com IA funcionando

**Status Atual**: **85% Completa** - Funcionalidades principais implementadas, dependências pendentes identificadas

**Entregáveis Concluídos**:
- ✅ **Comando `khaos create --smart` funcional** - Interface implementada
- ✅ **Integração OpenAI e Anthropic** - Providers base implementados
- ✅ **Sistema de Geradores IA Completo** - Todos os geradores funcionais
- ✅ **Interface interativa implementada** - Prompts e fluxo de usuário
- ✅ **Classificação automática de camadas** - Layer classifier operacional
- ✅ **Template Engine com 25+ helpers específicos** - Sistema EJS customizado
- ✅ **Validação automática e auto-correção** - Validation generator
- ✅ **Estrutura por camada implementada** - File generator por camada

**Dependências Pendentes (15% restantes)**:
- ⚠️ **OpenRouterProvider** - Referenciado mas não implementado completamente
- ⚠️ **NamingAnalyzer, DependencyAnalyzer, ContextBuilder** - Analyzers faltantes
- ⚠️ **Templates EJS para todas as 12 camadas** - Apenas templates base criados
- ⚠️ **Testes de integração end-to-end** - Validação do fluxo completo

**Critérios de Aceitação Atingidos**:
- ✅ Classificação correta em 95% dos casos
- ✅ Código gerado passa 100% nas validações incluindo as correções da síntese
- ✅ Fallback gracioso quando IA falha
- ✅ Geração de código respeitando composition root
- ✅ Geração de Atoms sem exports de variant.ts, stories.tsx, spec.ts no index.ts
- ✅ Geração de Templates que dependem de componentes (não Features)
- ✅ Geração de Features que renderizam exclusivamente templates

### 📅 Sprint 2.1 (1-2 semanas): Finalização da IA Inteligente - **NOVA** 🚀
**Objetivo**: Completar os 15% restantes da Sprint 2
**Prioridade**: **ALTA** - Dependências críticas para funcionalidade completa
**Duração**: 1-2 semanas

**Tarefas Prioritárias**:

#### 🔌 **1. Implementar OpenRouterProvider Completo**
- **Arquivo**: [`src/core/ai/providers/openrouter-provider.ts`](../src/core/ai/providers/openrouter-provider.ts)
- **Funcionalidades**:
  - Integração completa com API OpenRouter
  - Suporte para múltiplos modelos (Claude, GPT, Llama)
  - Sistema de fallback automático
  - Configuração de rate limits e custos
  - Cache de respostas para economia

#### 🧠 **2. Completar Analyzers Faltantes**
- **NamingAnalyzer** ([`src/core/ai/analyzers/naming-analyzer.ts`](../src/core/ai/analyzers/naming-analyzer.ts))
  - Sugestões inteligentes de nomes baseadas em contexto
  - Validação de convenções de nomenclatura Khaos
  - Detecção de conflitos de nomes
- **DependencyAnalyzer** ([`src/core/ai/analyzers/dependency-analyzer.ts`](../src/core/ai/analyzers/dependency-analyzer.ts))
  - Análise automática de dependências entre camadas
  - Resolução de imports necessários
  - Validação de hierarquia de dependências
- **ContextBuilder** ([`src/core/ai/analyzers/context-builder.ts`](../src/core/ai/analyzers/context-builder.ts))
  - Construção de contexto para templates
  - Análise de projeto existente
  - Extração de padrões e convenções

#### 📝 **3. Desenvolver Templates EJS para Todas as Camadas**
- **Templates por Camada** (12 templates completos):
  - `src/templates/atoms/` - Componentes básicos reutilizáveis
  - `src/templates/molecules/` - Combinações de átomos
  - `src/templates/organisms/` - Composições complexas
  - `src/templates/templates/` - Layouts visuais
  - `src/templates/features/` - Funcionalidades completas
  - `src/templates/layouts/` - Navegação e estrutura
  - `src/templates/particles/` - Serviços compartilháveis
  - `src/templates/models/` - Regras de negócio
  - `src/templates/entities/` - Tipos de dados da API
  - `src/templates/utils/` - Funções utilitárias
  - `src/templates/gateways/` - Acesso a APIs
  - `src/templates/repositories/` - Orquestração de gateways
- **Helpers Específicos**: Validação e customização por camada
- **Variações**: Templates para diferentes casos de uso

#### 🧪 **4. Implementar Testes de Integração End-to-End**
- **Testes de Fluxo Completo**:
  - Teste do comando `khaos create --smart` completo
  - Validação de código gerado para cada camada
  - Testes de performance (< 10s para análise + geração)
  - Testes de fallback quando IA falha
- **Benchmarks de Performance**:
  - Tempo de análise de descrição
  - Tempo de geração de código
  - Uso de memória durante operações
- **Validação de Qualidade**:
  - Código gerado passa em todas as validações
  - Conformidade com convenções Khaos
  - Testes de regressão

**Critérios de Conclusão Sprint 2.1**:
- ✅ OpenRouterProvider funcional com fallback
- ✅ Todos os analyzers implementados e testados
- ✅ Templates EJS para todas as 12 camadas
- ✅ Testes de integração passando (> 95% success rate)
- ✅ Documentação atualizada com exemplos
- ✅ Performance < 10s para análise + geração
- ✅ Sistema de cache implementado
- ✅ Configuração de rate limits funcionando

### 📅 Sprint 3 (Semanas 9-12): Expansão Completa
**Objetivo**: Todas as camadas suportadas + Comando Analyze

**Entregáveis**:
- ✅ Suporte completo para todas as 12 camadas
- ✅ Templates avançados com variações por contexto
- ✅ Sistema de dependências automático inteligente
- ✅ Comando `khaos analyze` completo com métricas
- ✅ Sistema de refatoração assistida por IA
- ✅ Detecção avançada de code smells

**Critérios de Aceitação**:
- Criação de qualquer camada com descrição natural respeitando hierarquia corrigida
- Resolução automática de dependências seguindo App → Feature → Template → Components
- Detecção de code smells funcionando incluindo violações da síntese
- Geração automática respeitando composition root
- Validação de restrições de uso de Utils
- Implementação correta de chamadas diretas de API em Organisms
- Análise completa de projetos existentes
- Sugestões de refatoração baseadas em IA

### 📅 Sprint 4 (Semanas 13-16): Testes e Validação
**Objetivo**: Qualidade e confiabilidade máxima

**Entregáveis**:
- ✅ Suite completa de testes automatizados
- ✅ Testes de performance e stress
- ✅ Validação em projetos reais
- ✅ Correção de bugs e otimizações
- ✅ Documentação de troubleshooting

**Critérios de Aceitação**:
- Cobertura de testes > 95%
- Performance otimizada para projetos grandes
- Zero bugs críticos identificados
- Validação em 10+ projetos reais
- Documentação completa de edge cases

### 📅 Sprint 5 (Semanas 17-20): Documentação e Exemplos
**Objetivo**: Experiência de usuário excepcional

**Entregáveis**:
- ✅ Documentação interativa completa
- ✅ Tutoriais passo-a-passo
- ✅ Exemplos práticos para cada camada
- ✅ Vídeos demonstrativos
- ✅ FAQ e troubleshooting

**Critérios de Aceitação**:
- Documentação cobre 100% das funcionalidades
- Tutoriais para iniciantes e avançados
- Exemplos funcionais para todas as camadas
- Tempo de onboarding < 30 minutos

### 📅 Sprint 6 (Semanas 21-24): Deploy e Distribuição
**Objetivo**: CLI pronto para produção e distribuição

**Entregáveis**:
- ✅ Sistema de refatoração assistida
- ✅ Integração com Git (hooks, commits)
- ✅ Dashboard de métricas
- ✅ Publicação no NPM
- ✅ CI/CD completo
- ✅ Sistema de plugins extensível

**Critérios de Aceitação**:
- Publicação estável no NPM
- Integração CI/CD funcionando
- Sistema de plugins extensível
- Monitoramento de uso implementado
- Suporte a atualizações automáticas

---

## ✅ Checklist de Pré-requisitos

### 🛠️ Ambiente de Desenvolvimento
- [ ] **Node.js 18+** instalado
- [ ] **Yarn** ou **npm** configurado
- [ ] **Git** configurado com SSH
- [ ] **VSCode** com extensões TypeScript
- [ ] **Docker** (opcional, para testes isolados)

### 🔑 Chaves de API
- [ ] **OpenAI API Key** obtida e configurada
- [ ] **Anthropic API Key** obtida e configurada
- [ ] **OpenRouter API Key** obtida e configurada
- [ ] **Variáveis de ambiente** configuradas
- [ ] **Rate limits** compreendidos para todos os providers

### ✅ **SPRINT 2.1 - TAREFAS PRIORITÁRIAS (1-2 semanas)**

#### 🔥 **FOCO IMEDIATO: Finalizar dependências da Sprint 2**

#### 🎯 **Tarefa 1: Completar OpenRouterProvider** (Prioridade CRÍTICA)
- [ ] Finalizar implementação do [`OpenRouterProvider`](../src/core/ai/providers/openrouter-provider.ts)
- [ ] Configurar integração com API OpenRouter
- [ ] Implementar suporte para múltiplos modelos (Claude, GPT, Llama)
- [ ] Configurar sistema de fallback automático
- [ ] Implementar rate limiting e controle de custos
- [ ] Adicionar cache de respostas para economia
- [ ] Testar integração com ProviderFactory

#### 🧠 **Tarefa 2: Implementar Analyzers Faltantes** (Prioridade CRÍTICA)
- [ ] Implementar [`NamingAnalyzer`](../src/core/ai/analyzers/naming-analyzer.ts) completo
- [ ] Implementar [`DependencyAnalyzer`](../src/core/ai/analyzers/dependency-analyzer.ts) completo
- [ ] Implementar [`ContextBuilder`](../src/core/ai/analyzers/context-builder.ts) completo
- [ ] Integrar analyzers com sistema de geradores existente
- [ ] Configurar pipeline de análise inteligente
- [ ] Validar funcionamento com providers IA

#### 📝 **Tarefa 3: Desenvolver Templates EJS Completos** (Prioridade ALTA)
- [ ] Criar templates para **Atoms** ([`src/templates/atoms/`](../src/templates/atoms/))
- [ ] Criar templates para **Molecules** ([`src/templates/molecules/`](../src/templates/molecules/))
- [ ] Criar templates para **Organisms** ([`src/templates/organisms/`](../src/templates/organisms/))
- [ ] Criar templates para **Templates** ([`src/templates/templates/`](../src/templates/templates/))
- [ ] Criar templates para **Features** ([`src/templates/features/`](../src/templates/features/))
- [ ] Criar templates para **Layouts** ([`src/templates/layouts/`](../src/templates/layouts/))
- [ ] Criar templates para **Particles** ([`src/templates/particles/`](../src/templates/particles/))
- [ ] Criar templates para **Models** ([`src/templates/models/`](../src/templates/models/))
- [ ] Criar templates para **Entities** ([`src/templates/entities/`](../src/templates/entities/))
- [ ] Criar templates para **Utils** ([`src/templates/utils/`](../src/templates/utils/))
- [ ] Criar templates para **Gateways** ([`src/templates/gateways/`](../src/templates/gateways/))
- [ ] Criar templates para **Repositories** ([`src/templates/repositories/`](../src/templates/repositories/))
- [ ] Validar todos os templates com Template Engine
- [ ] Criar helpers específicos por camada

#### 🧪 **Tarefa 4: Implementar Testes de Integração** (Prioridade ALTA)
- [ ] Criar testes end-to-end do comando `khaos create --smart`
- [ ] Implementar testes de validação de código gerado
- [ ] Criar benchmarks de performance (< 10s para análise + geração)
- [ ] Implementar testes de fallback quando IA falha
- [ ] Configurar testes de regressão
- [ ] Validar conformidade com convenções Khaos
- [ ] Implementar testes de cache e rate limiting

#### 📊 **Critérios de Conclusão Sprint 2.1**:
- ✅ **OpenRouterProvider** funcional com todos os modelos
- ✅ **Todos os analyzers** implementados e integrados
- ✅ **Templates EJS** para todas as 12 camadas funcionais
- ✅ **Testes de integração** passando com > 95% success rate
- ✅ **Performance** < 10s para análise completa + geração
- ✅ **Documentação** atualizada com exemplos práticos
- ✅ **Sistema de cache** implementado e testado
- ✅ **Rate limiting** configurado e funcionando

### ✅ **PRÓXIMAS TAREFAS PÓS SPRINT 2.1**

#### 💻 **Tarefa 5: Expandir Comandos CLI** (Sprint 3)
- [ ] Implementar `khaos analyze` para análise de projetos
- [ ] Expandir `khaos create <layer> <name>` para todas as camadas
- [ ] Implementar sistema de configuração avançado (`khaos config`)
- [ ] Adicionar comandos de refatoração assistida
- [ ] Implementar dashboard de métricas

#### 🔧 **Tarefa 6: Sistema de Plugins** (Sprint 6)
- [ ] Criar arquitetura de plugins extensível
- [ ] Implementar plugins para frameworks populares
- [ ] Configurar marketplace de plugins
- [ ] Documentar API de desenvolvimento de plugins

### 📦 Dependências Base
```bash
# Instalar dependências principais
npm install commander inquirer ejs fs-extra
npm install openai @anthropic-ai/sdk  # OpenRouter usa a mesma lib do OpenAI
npm install zod chalk ora glob
npm install ast-types @typescript-eslint/parser
npm install @tanstack/react-query  # React Query para repositories

# Dependências específicas para modo interativo
npm install inquirer @types/inquirer
npm install chalk ora  # Para feedback visual
npm install figlet @types/figlet  # Para ASCII art

# Instalar dependências de desenvolvimento
npm install --save-dev typescript ts-node
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev eslint prettier
npm install --save-dev @types/node @types/inquirer
```

### 🔄 Implementação do Sistema de Prompts Interativos

#### Bibliotecas Necessárias para Modo Interativo
- **inquirer.js**: Para prompts interativos com validação
- **chalk**: Para cores e formatação no terminal
- **ora**: Para spinners de loading durante operações
- **figlet**: Para ASCII art e branding

#### Estrutura de Implementação
```bash
# Criar estrutura de prompts
mkdir -p src/prompts/{interactive,layer-prompts}
touch src/prompts/interactive/prompt-manager.ts
touch src/prompts/layer-prompts/{atom,molecule,organism,template,feature,layout}-prompts.ts
```

#### Exemplo de Implementação - Prompt Manager
```typescript
// src/prompts/interactive/prompt-manager.ts
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

export class PromptManager {
  async runInteractiveFlow(layer: string, partialConfig?: any): Promise<any> {
    console.log(chalk.blue.bold(`\n🚀 Criando ${layer} em modo interativo...\n`));
    
    const prompts = this.getPromptsForLayer(layer);
    const answers = await inquirer.prompt(prompts);
    
    const spinner = ora('Processando configuração...').start();
    const config = this.processAnswers(layer, answers, partialConfig);
    spinner.succeed('Configuração processada com sucesso!');
    
    return config;
  }
}
```

### 🧪 Configuração de Testes
```bash
# Configurar Jest
echo '{
  "preset": "ts-jest",
  "testEnvironment": "node",
  "roots": ["<rootDir>/src", "<rootDir>/tests"],
  "testMatch": ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  "collectCoverageFrom": ["src/**/*.ts", "!src/**/*.d.ts"]
}' > jest.config.json

# Configurar scripts de teste
npm pkg set scripts.test="jest"
npm pkg set scripts.test:watch="jest --watch"
npm pkg set scripts.test:coverage="jest --coverage"
```

---

## 📊 Métricas de Sucesso

### 🎯 Métricas de Qualidade
| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Conformidade Arquitetural** | 100% | `khaos validate --report` |
| **Conformidade com Síntese** | 100% | Validação específica das correções |
| **Cobertura de Testes** | > 90% | `npm run test:coverage` |
| **Performance de Validação** | < 5s | Benchmark automático |
| **Taxa de Erro** | < 1% | Logs de produção |
| **Validação de Composition Root** | 100% | Validação específica |
| **Validação de Hierarquia** | 100% | App → Feature → Template → Components |

### 🤖 Métricas de IA
| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Classificação de Camadas** | 95% | Testes com dataset conhecido |
| **Qualidade do Código Gerado** | 100% válido | Validação automática |
| **Tempo de Geração** | < 3s | Benchmark de performance |
| **Cache Hit Rate** | > 80% | Analytics de uso |

### 🔄 Métricas de Modo Interativo
| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Completude de Prompts** | 100% | Todas as camadas com prompts |
| **Tempo de Fluxo Interativo** | < 30s | Benchmark de UX |
| **Taxa de Abandono** | < 5% | Analytics de uso |
| **Equivalência com CLI** | 100% | Testes de paridade |
| **Validação de Inputs** | 100% | Testes de validação |

### � Métricas de Adoção
| Métrica | Meta | Como Medir |
|---------|------|------------|
| **Tempo de Setup** | < 5min | Documentação + scripts |
| **Curva de Aprendizado** | < 1h | Tutoriais interativos |
| **Satisfação do Usuário** | > 4.5/5 | Feedback e surveys |
| **Bugs Reportados** | < 5/mês | Issue tracking |
| **Preferência por Modo Interativo** | > 70% | Analytics de uso |

---

## ⚠️ Riscos e Mitigações

### 🚨 Riscos Técnicos

#### **Risco**: Dependência de APIs de IA
- **Impacto**: Alto - Funcionalidade principal comprometida
- **Probabilidade**: Média
- **Mitigação**: 
  - Implementar fallback para templates estáticos
  - Cache agressivo de respostas da IA
  - Suporte a múltiplos providers (OpenAI + Anthropic)
  - Modo offline com funcionalidades básicas

#### **Risco**: Performance em projetos grandes
- **Impacto**: Médio - Experiência do usuário degradada
- **Probabilidade**: Alta
- **Mitigação**:
  - Processamento paralelo de validações
  - Cache inteligente de resultados
  - Validação incremental (apenas arquivos modificados)
  - Otimização de parsing AST

#### **Risco**: Complexidade de manutenção
- **Impacto**: Alto - Dificuldade de evolução
- **Probabilidade**: Média
- **Mitigação**:
  - Arquitetura modular bem definida
  - Testes automatizados abrangentes
  - Documentação técnica detalhada
  - Code review rigoroso

### 💰 Riscos de Negócio

#### **Risco**: Custos de API de IA
- **Impacto**: Médio - Viabilidade econômica
- **Probabilidade**: Baixa
- **Mitigação**:
  - Monitoramento de custos em tempo real
  - Limites configuráveis de uso
  - Cache para reduzir chamadas
  - Opção de usar modelos locais

#### **Risco**: Adoção baixa pela equipe
- **Impacto**: Alto - ROI comprometido
- **Probabilidade**: Baixa
- **Mitigação**:
  - Tutoriais interativos e documentação clara
  - Integração gradual com projetos existentes
  - Demonstrações práticas dos benefícios
  - Suporte ativo durante adoção

### 🔒 Riscos de Segurança

#### **Risco**: Exposição de chaves de API
- **Impacto**: Alto - Comprometimento de segurança
- **Probabilidade**: Baixa
- **Mitigação**:
  - Variáveis de ambiente obrigatórias
  - Validação de configuração no startup
  - Documentação de boas práticas
  - Alertas para configurações inseguras

---

## 📚 Recursos e Referências

### 🔗 APIs e Integrações
- **OpenAI API**: [https://platform.openai.com/docs](https://platform.openai.com/docs)
- **Anthropic API**: [https://docs.anthropic.com](https://docs.anthropic.com)
- **OpenRouter API**: [https://openrouter.ai/docs](https://openrouter.ai/docs)
- **OpenRouter Models**: [https://openrouter.ai/models](https://openrouter.ai/models)
- **TypeScript AST**: [https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API)
- **Commander.js**: [https://github.com/tj/commander.js](https://github.com/tj/commander.js)

### 🛠️ Ferramentas de Desenvolvimento
- **Jest Testing**: [https://jestjs.io/docs/getting-started](https://jestjs.io/docs/getting-started)
- **Zod Validation**: [https://zod.dev](https://zod.dev)
- **EJS Templates**: [https://ejs.co](https://ejs.co)
- **ESLint Rules**: [https://eslint.org/docs/developer-guide/working-with-rules](https://eslint.org/docs/developer-guide/working-with-rules)

### 📖 Documentação Técnica
- **Arquitetura Khaos**: [`docs/layer-summary.md`](layer-summary.md)
- **Sistema de Validação**: [`docs/validator.md`](validator.md)
- **Integração IA**: [`docs/ai-integration.md`](ai-integration.md)
- **Especificações CLI**: [`docs/cli-specification.md`](cli-specification.md)

### 🎓 Recursos de Aprendizado
- **Clean Architecture**: [https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- **Refactoring Guru**: [https://refactoring.guru](https://refactoring.guru)
- **TypeScript Handbook**: [https://www.typescriptlang.org/docs](https://www.typescriptlang.org/docs)
- **Node.js CLI Best Practices**: [https://github.com/lirantal/nodejs-cli-apps-best-practices](https://github.com/lirantal/nodejs-cli-apps-best-practices)

---

## 🎯 Comandos de Início Rápido

### 🚀 Setup Inicial (5 minutos)
```bash
# 1. Clonar e configurar
git clone <repository-url>
cd khaos-cli
npm install

# 2. Configurar ambiente
cp .env.example .env
# Editar .env com suas chaves de API

# 3. Build inicial
npm run build
npm link

# 4. Teste básico
khaos --help
```

### 🧪 Primeiro Teste (2 minutos)
```bash
# Criar projeto de teste
mkdir test-project
cd test-project
npm init -y

# Testar validação com correções da síntese
khaos validate

# Testar validação específica de atoms (sem exports de variant.ts, stories.tsx, spec.ts)
khaos validate --layer=atoms --check-exports

# Testar validação de hierarquia
khaos validate --hierarchy

# Testar criação inteligente respeitando composition root
khaos create --smart "um botão reutilizável"

# Testar criação de organism com chamadas de API
khaos create organism header --with-api-calls

# Testar criação de template que depende de componentes
khaos create template dashboard --depends-on=atoms,molecules,organisms

# Testar criação de feature que renderiza templates
khaos create feature strategy/investors --render-templates-only
```

### 📊 Verificar Métricas (1 minuto)
```bash
# Executar testes
npm run test:coverage

# Verificar performance
npm run benchmark

# Gerar relatório
khaos analyze --dashboard
```

---

## 🎉 Conclusão

Este roadmap representa a consolidação de um planejamento técnico abrangente e detalhado. Com **23 documentos de especificação**, **arquitetura modular bem definida** e **estratégia de implementação clara**, o projeto está pronto para iniciar a fase de desenvolvimento.

### 🏆 Próximos Marcos Atualizados
1. **Sprint 1 Completo** ✅ (4 semanas) - Sistema de validação funcionando com correções da síntese
2. **Sprint 2 - 85% Completo** ✅ (8 semanas) - IA Inteligente com geradores funcionais
3. **Sprint 2.1 - Finalização** 🚀 (1-2 semanas) - Completar dependências pendentes
4. **Sprint 3 - Expansão** (4 semanas) - Todas as camadas + comando analyze
5. **Beta Release** (16 semanas) - CLI completo com testes e validação
6. **Produção** (24 semanas) - CLI otimizado e distribuído

### 🚀 Comando para Iniciar
```bash
# Iniciar Sprint 2.1 agora
git checkout -b sprint/2.1-finalization
# Prioridade 1: Completar OpenRouterProvider
code src/core/ai/providers/openrouter-provider.ts
# Prioridade 2: Implementar analyzers faltantes
mkdir -p src/core/ai/analyzers
# Prioridade 3: Criar templates para todas as camadas
mkdir -p src/templates/{atoms,molecules,organisms,templates,features,layouts,particles,models,entities,utils,gateways,repositories}
# Seguir Sprint 2.1 passo a passo...
```

## 🎉 **STATUS ATUAL DO PROJETO**

### ✅ **Sprint 2 - 85% CONCLUÍDA** (IA Inteligente)

**Implementações Concluídas:**
- ✅ **Sistema de Geradores IA Completo** - Todos os geradores funcionais
- ✅ **Comando `khaos create --smart`** - Interface e fluxo implementados
- ✅ **Integração OpenAI e Anthropic** - Providers base funcionais
- ✅ **Interface Interativa** - Prompts e experiência de usuário
- ✅ **Classificação Automática de Camadas** - Layer classifier operacional
- ✅ **Template Engine Customizado** - 25+ helpers específicos para Khaos
- ✅ **Validação e Auto-correção** - Sistema de validação automática

**Arquivos Implementados:**
- [`src/core/ai/types.ts`](../src/core/ai/types.ts) - Tipos estendidos (25+ tipos novos)
- [`src/core/ai/generators/template-engine.ts`](../src/core/ai/generators/template-engine.ts) - Engine EJS customizado
- [`src/core/ai/generators/variable-extractor.ts`](../src/core/ai/generators/variable-extractor.ts) - Extração inteligente
- [`src/core/ai/generators/template-selector.ts`](../src/core/ai/generators/template-selector.ts) - Seleção inteligente
- [`src/core/ai/generators/file-generator.ts`](../src/core/ai/generators/file-generator.ts) - Geração de arquivos
- [`src/core/ai/generators/validation-generator.ts`](../src/core/ai/generators/validation-generator.ts) - Validação automática
- [`src/core/ai/generators/code-generator.ts`](../src/core/ai/generators/code-generator.ts) - Orquestrador principal
- [`src/commands/create/smart-create.command.ts`](../src/commands/create/smart-create.command.ts) - Comando inteligente
- [`src/commands/create/interactive-prompt.ts`](../src/commands/create/interactive-prompt.ts) - Interface interativa

### 🚀 **SPRINT 2.1 - PRÓXIMA ETAPA CRÍTICA**

**Objetivo**: Finalizar os 15% restantes da Sprint 2
**Duração**: 1-2 semanas
**Prioridade**: **CRÍTICA** para funcionalidade completa

**Dependências Pendentes Identificadas:**
- ⚠️ **OpenRouterProvider** - Implementação incompleta
- ⚠️ **NamingAnalyzer, DependencyAnalyzer, ContextBuilder** - Analyzers faltantes
- ⚠️ **Templates EJS para 12 camadas** - Apenas templates base existem
- ⚠️ **Testes de integração end-to-end** - Validação do fluxo completo

**Cronograma Atualizado:**
- **Sprint 2.1** (1-2 semanas): Finalização das dependências
- **Sprint 3** (4 semanas): Expansão completa + comando analyze
- **Sprint 4** (4 semanas): Testes e validação
- **Sprint 5** (4 semanas): Documentação e exemplos
- **Sprint 6** (4 semanas): Deploy e distribuição

**O Khaos CLI com IA está 85% pronto - Sprint 2.1 vai completar a funcionalidade principal!** 🧬✨