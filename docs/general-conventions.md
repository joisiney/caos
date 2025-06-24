# 🧱 Convenções Gerais (Globais)

- Arquivos e pastas devem estar em **dash-case**.
- Nenhum nome pode conter **letras maiúsculas** ou **caracteres especiais**.
- Arquivos com extensão `*.tsx` devem usar o padrão de conteúdo **UpperCamelCase**, ex.: `UserAtom`.
- Arquivos com extensão `*.ts` devem usar o padrão de conteúdo **camelCase**, ex.: `userConstant`.
- Nunca utilize `export default`.
- É obrigatório utilizar **Tailwind CSS** para estilização.
- É obrigatório utilizar **Zod** como biblioteca padrão para validação de esquemas.
- É obrigatório utilizar **react-hook-form** para gerenciamento de formulários em componentes React.
- É obrigatório utilizar **React Query (TanStack Query)** para gerenciamento de estado servidor em repositories.
- Evite exportar funções declaradas; priorize **arrow functions**.
- Todos os arquivos `index.ts` servem **exclusivamente para expor elementos reutilizáveis** da camada:
  - Nunca implemente lógica ou declare tipos dentro deles.
  - Eles funcionam como **interface pública do módulo**.
- Tipos globais devem ser definidos em `@types/`, com sufixo `.d.ts`, e **não devem ser exportados**:
  - O `tsconfig.json` deve estar configurado para carregá-los automaticamente.
- Todos os `Props` de componentes devem incluir obrigatoriamente `testID?: string`.
- **Query Keys** devem seguir padrão hierárquico: `[entity, operation, ...params]`
- **Repository hooks** devem usar prefixo `use{Name}Repository` e retornar hooks do React Query
- Estas regras globais aplicam-se a todas as camadas do projeto.

## 🏗️ Convenções para Rotas Automáticas

### 📁 Estrutura de Rotas Automáticas
- **Rotas Privadas**: `src/app/(app)/(private)/caminho/da/rota.tsx`
- **Rotas Públicas**: `src/app/(app)/(public)/caminho/da/rota.tsx`
- **Nomenclatura**: Pastas e arquivos em **dash-case**
- **Componentes**: Features em **PascalCase** com sufixo `Feature`

### 🛣️ File-System Routing
- **Rotas estáticas**: `strategy/investors.tsx` → `/strategy/investors`
- **Rotas dinâmicas**: `[id].tsx` → `/strategy/123`
- **Rotas de grupo**: `(private)/` e `(public)/` para separar por tipo de acesso
- **Layout aninhado**: `_layout.tsx` em cada nível de pasta
- **Página 404**: `+not-found.tsx` para rotas não encontradas

### 📋 Padrões de Nomenclatura para Rotas Automáticas
- **Caminho da rota**: `strategy/investors` → **Arquivo**: `strategy/investors.tsx`
- **Nome do componente**: `strategy/investors` → **Componente**: `StrategyInvestorsFeature`
- **Nome da feature**: `strategy/investors` → **Feature**: `strategy-investors`
- **Conversão**: `/` vira `-` no nome da feature, PascalCase no componente

### 🎯 Exemplos de Conversão
- `auth/login` → Feature: `auth-login` → Componente: `AuthLoginFeature`
- `dashboard/overview` → Feature: `dashboard-overview` → Componente: `DashboardOverviewFeature`
- `strategy/investors` → Feature: `strategy-investors` → Componente: `StrategyInvestorsFeature`
- `wallet/deposit` → Feature: `wallet-deposit` → Componente: `WalletDepositFeature`

### 🔗 Navegação
- **Hooks**: `useRouter()`, `useLocalSearchParams()`
- **Navegação programática**: `router.push()`, `router.replace()`
- **Links**: `<Link href="/path">` para navegação declarativa

### 📄 Padrão de Rotas Automáticas
- **Rotas são arquivos simples**: `export {FeatureName as default} from '@/features/feature-name'`
- **Features contêm a lógica**: Toda interface e lógica de negócio fica nas features
- **Geração automática**: CLI cria rota automaticamente ao criar feature
- **Separação clara**: Rota = export, Feature = implementação

### 🏗️ Convenções para Layouts Baseados em Diretório

### 📁 Estrutura de Arquivos
- **Criação**: CLI pergunta o diretório/caminho onde criar o layout
- **Geração**: CLI pega o caminho do diretório para gerar `_layout.tsx`
- **Arquivo principal**: `_layout.tsx` (configuração de navegação)
- **Rotas**: `index.tsx`, `[id].tsx`, `{name}.tsx` (exportam features)
- **Nomenclatura**: Pastas e arquivos em **dash-case**
- **Componentes**: Exports nomeados em **PascalCase**

### 📋 Padrões de Nomenclatura para Layouts
- **Diretório especificado**: `(app)/(private)/strategy` → **Arquivo**: `src/app/(app)/(private)/strategy/_layout.tsx`
- **Layouts**: `{DirectoryName}Layout` (ex: `StrategyLayout`)
- **Rotas**: Arquivos simples que exportam features como default
- **Tipos**: `N{DirectoryName}Layout` namespace (opcional)
- **Constantes**: `{DIRECTORY_NAME}_OPTIONS` em UPPER_CASE (opcional)

### 🎯 Exemplos de Conversão para Layouts
- `(app)/(private)/strategy` → Layout: `StrategyLayout` → Arquivo: `strategy/_layout.tsx`
- `(app)/(public)/auth` → Layout: `AuthLayout` → Arquivo: `auth/_layout.tsx`
- `(app)/(private)/dashboard/settings` → Layout: `SettingsLayout` → Arquivo: `settings/_layout.tsx`

### 📄 Padrão de Estrutura: `diretório/_layout.tsx`
- **Estrutura base**: Diretório especificado + `/_layout.tsx`
- **Após selecionar diretório**: CLI pergunta o tipo (stack, tabs, drawer)
- **Geração automática**: Layout segue as regras já estabelecidas do Expo Router

## 🔄 Convenções React Query

### 📋 Query Keys
- **Padrão hierárquico**: `[entity, operation, ...params]`
- **Exemplos**:
  - `['strategy', 'list']` - Lista de estratégias
  - `['strategy', 'list', { filters }]` - Lista com filtros
  - `['strategy', 'detail', id]` - Detalhes de uma estratégia
  - `['user', 'profile', userId]` - Perfil do usuário

### 🎣 Repository Hooks
- **Nomenclatura**: `use{Name}Repository()` retorna objeto com hooks do React Query
- **Estrutura padrão**:
  ```ts
  export const useStrategyRepository = () => ({
    useFindMany: (filters?) => useQuery(...),
    useFindOne: (id) => useQuery(...),
    useCreate: () => useMutation(...),
    useUpdate: () => useMutation(...),
    useRemove: () => useMutation(...),
    utils: { invalidateAll, prefetch, ... },
    keys: strategyKeys,
  });
  ```

### 🔧 Configurações Padrão
- **Stale Time**: 5 minutos para listas, 10 minutos para detalhes
- **Cache Time**: 30 minutos (padrão React Query)
- **Retry**: 3 tentativas para queries, 0 para mutations
- **Refetch**: `onWindowFocus: false` para melhor UX

### Validação
- O CLI usa **ESLint** para garantir:
  - Nomenclatura correta (dash-case, UpperCamelCase).
  - Presença de `testID?: string` em `Props`.
  - Uso de **Tailwind CSS** e **Zod** (quando aplicável).
- Commits seguem o padrão **Conventional Commits**:
  - Criação: `feat: add <name> atom`
  - Atualização: `refactor: rename <old-name> to <new-name>`
  - Remoção: `chore: remove <name> atom`