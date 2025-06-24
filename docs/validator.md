# 🔍 Sistema de Validação Khaos

O sistema de validação do Khaos CLI garante **100% de conformidade** com a arquitetura Khaos através de validações rigorosas em múltiplas camadas. Este documento detalha as especificações de validação, regras ESLint customizadas e schemas Zod utilizados.

---

## 🎯 Objetivos da Validação

- **Conformidade Arquitetural**: Garantir que todas as camadas sigam rigorosamente as convenções estabelecidas
- **Detecção Precoce**: Identificar violações antes que cheguem ao repositório
- **Consistência**: Manter padrões uniformes em todo o projeto
- **Qualidade**: Prevenir code smells e más práticas

---

## 📊 Validação por Camada

### 🔹 Validação de Átomos

#### Estrutura de Arquivos Obrigatória
```typescript
interface AtomValidationRules {
  requiredFiles: ['index.ts', '*.atom.tsx', '*.type.ts'];
  optionalFiles: ['*.constant.ts', '*.mock.ts', '*.spec.ts'];
  restrictedFiles: ['*.variant.ts', '*.stories.tsx', '*.use-case.ts', '*.service.ts', '_partials/', '_services/'];
  exportRestrictions: ['*.variant.ts', '*.stories.tsx', '*.spec.ts']; // Não exportar no index.ts
  compositionRoot: true; // Atoms têm composition root
}
```

#### Convenções de Nomenclatura
- **Arquivos**: `dash-case` (ex: `button-icon.atom.tsx`)
- **Componentes**: `PascalCase` + sufixo `Atom` (ex: `ButtonIconAtom`)
- **Namespace**: `N{Name}Atom` (ex: `NButtonIconAtom`)

#### Validações Específicas
- ✅ Props devem incluir `testID?: string`
- ✅ Componente deve usar `testID={`${testID}-atom`}`
- ✅ Exports centralizados em [`index.ts`](index.ts)
- ✅ Namespace obrigatório em [`*.type.ts`](*.type.ts)
- ✅ Composition root implementado
- ❌ Não exportar [`variant.ts`](variant.ts), [`stories.tsx`](stories.tsx), [`spec.ts`](spec.ts) no [`index.ts`](index.ts)
- ❌ Não pode ter lógica complexa ou hooks customizados

---

### 🔹 Validação de Moléculas

#### Estrutura de Arquivos Obrigatória
```typescript
interface MoleculeValidationRules {
  requiredFiles: ['index.ts', '*.molecule.tsx', '*.type.ts', '*.use-case.ts'];
  optionalFiles: ['*.constant.ts', '*.variant.ts', '*.mock.ts', '*.stories.tsx', '*.spec.ts'];
  conditionalFiles: ['_services/*.service.ts'];
  restrictedFiles: ['_partials/', 'mock.ts', 'scheme.ts', 'context.tsx'];
}
```

#### Validações Específicas
- ✅ Deve importar pelo menos um átomo
- ✅ Deve implementar [`*.use-case.ts`](*.use-case.ts)
- ✅ Services devem estar em [`_services/`](_services/)
- ✅ Props devem incluir `testID?: string`
- ❌ Não pode ter partials ou contextos

---

### 🔹 Validação de Organismos

#### Estrutura de Arquivos Obrigatória
```typescript
interface OrganismValidationRules {
  requiredFiles: ['index.ts', '*.organism.tsx', '*.type.ts', '*.use-case.ts'];
  optionalFiles: ['*.constant.ts', '*.variant.ts', '*.mock.ts', '*.stories.tsx', '*.spec.ts'];
  conditionalFiles: ['_partials/*.partial.tsx', '_services/*.service.ts', '*.scheme.ts', '*.context.tsx'];
  compositionRoot: true; // Organisms têm composition root
  canMakeDirectAPICalls: true; // Organisms podem fazer chamadas diretas de API
}
```

#### Validações Específicas
- ✅ Pode ter átomos exclusivos em [`_partials/`](_partials/)
- ✅ Tipos de partials devem estar no [`*.type.ts`](*.type.ts) principal
- ✅ Lógica centralizada no [`use-case.ts`](use-case.ts)
- ✅ Partials devem ser "burros" (sem lógica)
- ✅ Composition root implementado
- ✅ Podem fazer chamadas diretas de API (diferente de outras camadas)

---

### 🔹 Validação de Templates

#### Estrutura de Arquivos Obrigatória
```typescript
interface TemplateValidationRules {
  requiredFiles: ['index.ts', '*.template.tsx', '*.type.ts'];
  optionalFiles: ['_partials/*.partial.tsx'];
  restrictedFiles: ['*.use-case.ts', '*.scheme.ts', '*.mock.ts', '*.context.tsx', '*.constant.ts', '*.service.ts', '*.gateway.ts'];
  compositionRoot: true; // Templates têm composition root
  dependencyRestrictions: ['features']; // Templates não podem depender de Features
  allowedDependencies: ['atoms', 'molecules', 'organisms']; // Templates dependem de componentes
}
```

#### Validações Específicas
- ✅ Foco em layout visual
- ✅ Pode usar padrão de composição com `children`
- ✅ Composition root implementado
- ✅ Dependem de Atoms/Molecules/Organisms (não Features)
- ❌ Não pode ter lógica de negócio
- ❌ Não pode ter use-cases ou services
- ❌ Não pode depender de Features

---

### 🔹 Validação de Features

#### Estrutura de Arquivos Obrigatória
```typescript
interface FeatureValidationRules {
  requiredFiles: ['index.ts', '*.feature.tsx', '*.type.ts', '*.use-case.ts'];
  conditionalFiles: ['_services/*.service.tsx'];
  namingPattern: /^[a-z]+-[a-z-]+\.feature\.tsx$/; // Deve ter prefixo do layout
  renderingRestriction: ['templates']; // Features renderizam exclusivamente templates
  hierarchyPosition: 'top'; // Features estão no topo da hierarquia
}
```

#### Validações Específicas
- ✅ Nome deve ter prefixo do layout (ex: `wallet-deposit.feature.tsx`)
- ✅ Deve ter [`use-case.ts`](use-case.ts) para orquestrar services
- ✅ Services múltiplos devem estar em [`_services/`](_services/)
- ✅ Renderizam exclusivamente templates (não componentes diretamente)
- ✅ Estão no topo da hierarquia de dependências

---

### 🔹 Validação de Layouts

#### Estrutura de Arquivos Obrigatória
```typescript
interface LayoutValidationRules {
  requiredFiles: ['index.ts', '*.layout.tsx', '*.type.ts', '*.use-case.ts'];
  conditionalFiles: ['_services/*.service.tsx'];
}
```

---

### 🔹 Validação de Particles

#### Estrutura de Arquivos Obrigatória
```typescript
interface ParticleValidationRules {
  requiredFiles: ['index.ts', '*.particle.tsx', '*.type.ts'];
  conditionalFiles: ['*.context.tsx', '_services/*.service.tsx'];
}
```

#### Validações Específicas
- ✅ Context deve conter apenas provider (sem elementos gráficos)
- ✅ Serviços compartilháveis entre features

---

### 🔹 Validação de Models

#### Estrutura de Arquivos Obrigatória
```typescript
interface ModelValidationRules {
  requiredFiles: ['*.model.ts'];
  usage: 'exclusive-to-repositories';
}
```

#### Validações Específicas
- ✅ Classes que encapsulam regras de negócio
- ✅ Uso exclusivo para tratar dados de API na camada repository
- ✅ Transformações e validações de dados

---

### 🔹 Validação de Entities

#### Estrutura de Arquivos Obrigatória
```typescript
interface EntityValidationRules {
  requiredFiles: ['*.entity.ts'];
  namingPattern: /^T[A-Z][a-zA-Z]*Entity$/; // Deve começar com T
}
```

#### Validações Específicas
- ✅ Representações puras dos dados da API
- ✅ Nome deve começar com `T` (ex: `TStrategyEntity`)
- ✅ Apenas tipos, sem lógica

---

### 🔹 Validação de Utils

#### Estrutura de Arquivos Obrigatória
```typescript
interface UtilValidationRules {
  requiredFiles: ['*.util.ts'];
  characteristics: 'pure-functions-only';
  usageRestrictions: ['entity', 'gateway', 'repository', 'model']; // Utils não podem ser usados nessas camadas
}
```

#### Validações Específicas
- ✅ Funções utilitárias puras
- ✅ Sem efeitos colaterais
- ✅ Testáveis e reutilizáveis
- ❌ Não podem ser usados em Entity, Gateway, Repository, Model

---

### 🔹 Validação de Gateways

#### Estrutura de Arquivos Obrigatória
```typescript
interface GatewayValidationRules {
  requiredFiles: ['*.gateway.ts'];
  namingPattern: /^(find-one|find-many|create|update|delete)-[a-z-]+\.gateway\.ts$/;
}
```

#### Validações Específicas
- ✅ Nome deve começar com verbo (find-one, find-many, create, update, delete)
- ✅ Acesso a APIs externas
- ✅ Uma responsabilidade por gateway

---

### 🔹 Validação de Repositories

#### Estrutura de Arquivos Obrigatória
```typescript
interface RepositoryValidationRules {
  requiredFiles: ['*.repository.ts'];
  namingPattern: /^[a-z-]+\.repository\.ts$/; // SEM prefixo de verbo
  exportPattern: /^use[A-Z][a-zA-Z]*Repository$/; // Hook pattern
}
```

#### Validações Específicas
- ✅ Nome SEM prefixo de verbo (ex: `strategy.repository.ts`)
- ✅ Export como hook (ex: `useStrategyRepository`)
- ✅ Orquestra múltiplos gateways
- ✅ Combina operações relacionadas

---

## 🛠️ Regras ESLint Customizadas

### Configuração Base
```javascript
// .eslintrc.js
module.exports = {
  extends: ['@khaos/eslint-config'],
  rules: {
    '@khaos/enforce-testid': 'error',
    '@khaos/enforce-namespace': 'error',
    '@khaos/enforce-layer-structure': 'error',
    '@khaos/enforce-naming-convention': 'error',
    '@khaos/no-default-export': 'error',
    '@khaos/enforce-file-structure': 'error',
  }
};
```

### Regras Específicas

#### `@khaos/enforce-testid`
```typescript
// ✅ Correto
interface Props extends TWithTestID {
  title: string;
}

// ❌ Incorreto
interface Props {
  title: string;
  // testID ausente
}
```

#### `@khaos/enforce-namespace`
```typescript
// ✅ Correto
export namespace NButtonAtom {
  export type Props = TWithTestID;
}

// ❌ Incorreto
export type ButtonProps = TWithTestID; // Sem namespace
```

#### `@khaos/enforce-layer-structure`
```typescript
// ✅ Correto - Molécula importando átomo
import { ButtonAtom } from '@/atoms/button';

// ❌ Incorreto - Átomo importando molécula
import { ButtonMolecule } from '@/molecules/button'; // Em um átomo
```

#### `@khaos/enforce-naming-convention`
```typescript
// ✅ Correto
export const ButtonAtom: FC<Props> = ({ testID }) => (
  <View testID={`${testID}-atom`} />
);

// ❌ Incorreto
export const Button: FC<Props> = ({ testID }) => ( // Sem sufixo Atom
  <View testID={testID} /> // Sem sufixo -atom
);
```

#### `@khaos/no-default-export`
```typescript
// ✅ Correto
export const ButtonAtom = () => {};

// ❌ Incorreto
export default ButtonAtom;
```

---

## 📋 Schemas de Validação Zod

### Schema Base para Componentes
```typescript
import { z } from 'zod';

const BaseComponentSchema = z.object({
  testID: z.string().optional(),
});

const FileStructureSchema = z.object({
  'index.ts': z.string(),
  required: z.array(z.string()),
  optional: z.array(z.string()).optional(),
  restricted: z.array(z.string()).optional(),
});
```

### Schema para Átomos
```typescript
export const AtomSchema = z.object({
  name: z.string().regex(/^[a-z]+(-[a-z]+)*$/, 'Must be dash-case'),
  files: z.object({
    'index.ts': z.string(),
    '*.atom.tsx': z.string(),
    '*.type.ts': z.string(),
    '*.constant.ts': z.string().optional(),
    '*.variant.ts': z.string().optional(),
    '*.mock.ts': z.string().optional(),
    '*.stories.tsx': z.string().optional(),
    '*.spec.ts': z.string().optional(),
  }),
  structure: z.object({
    hasTestID: z.boolean(),
    exportsFromIndex: z.boolean(),
    usesNamespace: z.boolean(),
    componentSuffix: z.literal('Atom'),
  }),
  restrictions: z.object({
    noUseCases: z.boolean(),
    noServices: z.boolean(),
    noPartials: z.boolean(),
  }),
});
```

### Schema para Moléculas
```typescript
export const MoleculeSchema = AtomSchema.extend({
  files: z.object({
    'index.ts': z.string(),
    '*.molecule.tsx': z.string(),
    '*.type.ts': z.string(),
    '*.use-case.ts': z.string(), // Obrigatório
    '*.constant.ts': z.string().optional(),
    '*.variant.ts': z.string().optional(),
    '*.mock.ts': z.string().optional(),
    '*.stories.tsx': z.string().optional(),
    '*.spec.ts': z.string().optional(),
    '_services/*.service.ts': z.array(z.string()).optional(),
  }),
  structure: z.object({
    hasTestID: z.boolean(),
    exportsFromIndex: z.boolean(),
    usesNamespace: z.boolean(),
    componentSuffix: z.literal('Molecule'),
    importsAtLeastOneAtom: z.boolean(),
    implementsUseCase: z.boolean(),
  }),
  restrictions: z.object({
    noPartials: z.boolean(),
    noMocks: z.boolean(),
    noSchemes: z.boolean(),
    noContexts: z.boolean(),
  }),
});
```

### Schema para Organismos
```typescript
export const OrganismSchema = AtomSchema.extend({
  files: z.object({
    'index.ts': z.string(),
    '*.organism.tsx': z.string(),
    '*.type.ts': z.string(),
    '*.use-case.ts': z.string(),
    '*.constant.ts': z.string().optional(),
    '*.variant.ts': z.string().optional(),
    '*.mock.ts': z.string().optional(),
    '*.stories.tsx': z.string().optional(),
    '*.spec.ts': z.string().optional(),
    '*.scheme.ts': z.string().optional(),
    '*.context.tsx': z.string().optional(),
    '_partials/*.partial.tsx': z.array(z.string()).optional(),
    '_services/*.service.ts': z.array(z.string()).optional(),
  }),
  structure: z.object({
    hasTestID: z.boolean(),
    exportsFromIndex: z.boolean(),
    usesNamespace: z.boolean(),
    componentSuffix: z.literal('Organism'),
    partialTypesInMainType: z.boolean(),
    logicCentralizedInUseCase: z.boolean(),
  }),
});
```

---

## 🧪 Exemplos de Validações

### ✅ Validações que Passam

#### Átomo Válido
```typescript
// button.atom.tsx
export const ButtonAtom: FC<NButtonAtom.Props> = ({ testID, children }) => (
  <TouchableOpacity testID={`${testID}-atom`}>
    {children}
  </TouchableOpacity>
);

// button.type.ts
export namespace NButtonAtom {
  export type Props = TWithTestID & {
    children: ReactNode;
  };
}

// index.ts
export * from './button.atom';
export * from './button.type';
```

#### Molécula Válida
```typescript
// modal.molecule.tsx
export const ModalMolecule: FC<NModalMolecule.Props> = ({ testID, title }) => {
  const { isVisible, close } = useUseCase();
  
  return (
    <View testID={`${testID}-molecule`}>
      <ButtonAtom testID="close-button" onPress={close} />
    </View>
  );
};

// modal.use-case.ts
export const useUseCase = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  return {
    isVisible,
    close: () => setIsVisible(false),
  };
};
```

### ❌ Validações que Falham

#### Átomo Inválido - Sem testID
```typescript
// ❌ Props sem testID obrigatório
export namespace NButtonAtom {
  export type Props = {
    children: ReactNode; // testID ausente
  };
}
```

#### Molécula Inválida - Sem use-case
```typescript
// ❌ Molécula sem use-case.ts
export const ModalMolecule: FC<Props> = ({ testID }) => {
  const [isVisible, setIsVisible] = useState(false); // Lógica direta no componente
  
  return <View testID={`${testID}-molecule`} />;
};
```

#### Organismo Inválido - Partial com lógica
```typescript
// ❌ Partial com lógica (deve ser "burro")
export const HeaderPartial: FC<Props> = ({ testID }) => {
  const [data, setData] = useState([]); // Lógica não permitida em partial
  
  return <View testID={testID} />;
};
```

#### Repository Inválido - Nome com verbo
```typescript
// ❌ Repository com prefixo de verbo
// find-strategy.repository.ts (incorreto)
export const useFindStrategyRepository = () => {}; // Nome incorreto

// ✅ Correto seria:
// strategy.repository.ts
export const useStrategyRepository = () => {};
```

---

## 🚀 Comandos de Validação

### Validação Completa do Projeto
```bash
khaos validate
# Valida todas as camadas e gera relatório completo
```

### Validação por Camada
```bash
khaos validate --layer=atoms
khaos validate --layer=molecules
khaos validate --layer=organisms
```

### Validação de Arquivo Específico
```bash
khaos validate --file=src/atoms/button/
khaos validate --file=src/molecules/modal/
```

### Validação com Correção Automática
```bash
khaos validate --fix
# Aplica correções automáticas quando possível
```

---

## 📊 Relatório de Validação

### Exemplo de Saída
```
🔍 Validação Khaos CLI
═══════════════════════

📊 Resumo Geral:
├── ✅ Conformidade: 95% (19/20 componentes)
├── ⚠️  Avisos: 3
├── ❌ Erros: 1
└── 🕐 Tempo: 2.3s

📋 Por Camada:
├── Atoms: ✅ 5/5 válidos
├── Molecules: ⚠️ 4/5 válidos (1 aviso)
├── Organisms: ✅ 3/3 válidos
├── Templates: ✅ 2/2 válidos
├── Features: ❌ 4/5 válidos (1 erro)
└── Gateways: ✅ 1/1 válido

❌ Erros Encontrados:
├── src/features/wallet-deposit/
│   └── ❌ wallet-deposit.feature.tsx: Props sem testID obrigatório
│   └── 💡 Sugestão: Adicione 'testID?: string' em NWalletDepositFeature.Props

⚠️ Avisos:
├── src/molecules/modal/
│   └── ⚠️ modal.molecule.tsx: Use-case vazio, considere remover
│   └── 💡 Sugestão: Implemente lógica ou remova use-case desnecessário

🎯 Próximos Passos:
1. Corrigir erro em wallet-deposit.feature.tsx
2. Revisar use-case vazio em modal.molecule.tsx
3. Executar 'khaos validate --fix' para correções automáticas
```

---

## 🔧 Configuração Avançada

### Arquivo de Configuração
```javascript
// khaos.config.js
module.exports = {
  validation: {
    strict: true, // Modo rigoroso
    autoFix: false, // Correção automática
    ignorePatterns: [
      'src/legacy/**', // Ignorar código legado
      '**/*.test.ts', // Ignorar testes
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
};
```

### Integração com CI/CD
```yaml
# .github/workflows/validation.yml
name: Khaos Validation
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run Khaos validation
        run: npx khaos validate --ci
      - name: Upload validation report
        uses: actions/upload-artifact@v3
        with:
          name: validation-report
          path: khaos-validation-report.json
```

---

## 📚 Referências

- [Convenções Gerais](./general-conventions.md)
- [Estrutura do Projeto](./project-structure.md)
- [Code Smells](./code-smells.md)
- [Boas Práticas](./good-practices.md)
- [Resumo das Camadas](./layer-summary.md)