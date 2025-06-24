# 🏗️ Layouts com Expo Router

Layouts são **configurações de navegação** que seguem o padrão Expo Router file-system routing. Eles definem apenas a estrutura de navegação (Stack, Tabs, Drawer) e exportam rotas baseadas na hierarquia de pastas. Rotas são arquivos simples que exportam features específicas.

> ❗️Layouts seguem exatamente o padrão oficial do Expo Router: https://docs.expo.dev/versions/latest/sdk/router/

---

## 🔹 Estrutura Baseada em Diretório

* **Arquivo principal**: `_layout.tsx` (padrão Expo Router)
* **Criação**: CLI pergunta o diretório/caminho onde criar o layout
* **Geração**: CLI pega o caminho do diretório para gerar o arquivo `_layout.tsx`
* **Exemplo**: diretório `(app)/(private)/strategy` gera `src/app/(app)/(private)/strategy/_layout.tsx`
* **Arquivos obrigatórios**:
  * `_layout.tsx` // Configuração de navegação do Expo Router
* **Arquivos opcionais**:
  * `index.ts` // Re-export do layout (opcional)
  * `{directory-name}.type.ts` // Tipos para opções de navegação (opcional)
  * `{directory-name}.constant.ts` // Constantes de navegação (opcional)
  * `{directory-name}.spec.ts` // Testes (opcional)

> ✅ Layouts são apenas configurações de navegação - NÃO devem ter: `stories.tsx`, `variant.ts`, `mock.ts`, `use-case.ts`, `_services/`
> ✅ Rotas são arquivos simples que exportam features: `export {WalletFeature as default} from 'features/wallet'`

---

## 📄 Exemplo `index.ts`

```ts
export * from './_layout';
export * from './wallet.type';
export * from './wallet.constant'; // Opcional
```

> ❌ Nunca exportar `spec.ts` ou arquivos de desenvolvimento

---

## 📄 Exemplo `wallet.type.ts`

```ts
import type { ReactNode } from 'react';

export namespace NWalletLayout {
  export type Props = TWithTestID & {
    children: ReactNode;
  };

  export type StackOptions = {
    title?: string;
    headerShown?: boolean;
    presentation?: 'modal' | 'card';
  };

  export type TabOptions = {
    title?: string;
    tabBarIcon?: ({ focused, color, size }: {
      focused: boolean;
      color: string;
      size: number;
    }) => ReactNode;
    href?: string;
  };

  export type DrawerOptions = {
    title?: string;
    drawerIcon?: ({ focused, color, size }: {
      focused: boolean;
      color: string;
      size: number;
    }) => ReactNode;
  };
}
```

---

## 📄 Exemplo `wallet.constant.ts` // Opcional

```ts
export const WALLET_STACK_OPTIONS = {
  DEFAULT: {
    headerShown: true,
    title: 'Carteira',
  },
  MODAL: {
    presentation: 'modal' as const,
    headerShown: true,
  },
} as const;

export const WALLET_TAB_OPTIONS = {
  DEPOSIT: {
    title: 'Depósito',
    href: '/wallet/deposit',
  },
  WITHDRAW: {
    title: 'Saque', 
    href: '/wallet/withdraw',
  },
  HISTORY: {
    title: 'Histórico',
    href: '/wallet/history',
  },
  SETTINGS: {
    title: 'Configurações',
    href: '/wallet/settings',
  },
} as const;

export const WALLET_DRAWER_OPTIONS = {
  DEFAULT: {
    title: 'Menu Carteira',
  },
} as const;
```

> ✅ Use `as const`, prefira nomes UPPER_CASE, e exporte objetos nomeados.

---

## 📄 Exemplo `_layout.tsx` (Stack Layout)

```tsx
import { Stack } from 'expo-router';
import { FC } from 'react';
import { NWalletLayout } from './wallet.type';
import { WALLET_STACK_OPTIONS } from './wallet.constant';

export const WalletLayout: FC<NWalletLayout.Props> = ({ testID, children }) => {
  return (
    <Stack
      testID={`${testID}-stack-layout`}
      screenOptions={{
        ...WALLET_STACK_OPTIONS.DEFAULT,
        headerStyle: {
          backgroundColor: '#f8fafc',
        },
        headerTintColor: '#1f2937',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Carteira Principal' 
        }} 
      />
      <Stack.Screen 
        name="deposit" 
        options={{ 
          title: 'Depósito',
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="withdraw" 
        options={{ 
          title: 'Saque',
          presentation: 'modal',
        }} 
      />
      <Stack.Screen 
        name="history" 
        options={{ 
          title: 'Histórico' 
        }} 
      />
      <Stack.Screen 
        name="settings" 
        options={{ 
          title: 'Configurações' 
        }} 
      />
      {children}
    </Stack>
  );
};

export default WalletLayout;
```

## 📄 Exemplo `_layout.tsx` (Tabs Layout)

```tsx
import { Tabs } from 'expo-router';
import { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NWalletLayout } from './wallet.type';

export const WalletTabsLayout: FC<NWalletLayout.Props> = ({ testID, children }) => {
  return (
    <Tabs
      testID={`${testID}-tabs-layout`}
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="deposit"
        options={{
          title: 'Depósito',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="withdraw"
        options={{
          title: 'Saque',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="remove-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configurações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      {children}
    </Tabs>
  );
};

export default WalletTabsLayout;
```

## 📄 Exemplo `_layout.tsx` (Drawer Layout)

```tsx
import { Drawer } from 'expo-router/drawer';
import { FC } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { NWalletLayout } from './wallet.type';

export const WalletDrawerLayout: FC<NWalletLayout.Props> = ({ testID, children }) => {
  return (
    <Drawer
      testID={`${testID}-drawer-layout`}
      screenOptions={{
        drawerActiveTintColor: '#3b82f6',
        drawerInactiveTintColor: '#6b7280',
        headerShown: true,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Carteira Principal',
          title: 'Carteira',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="wallet" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="deposit"
        options={{
          drawerLabel: 'Depósito',
          title: 'Depósito',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="withdraw"
        options={{
          drawerLabel: 'Saque',
          title: 'Saque',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="remove-circle" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="history"
        options={{
          drawerLabel: 'Histórico',
          title: 'Histórico',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Configurações',
          title: 'Configurações',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      {children}
    </Drawer>
  );
};

export default WalletDrawerLayout;
```

---

## 🗂️ Estrutura de Pastas com File-System Routing

### Hierarquia de Rotas com App Router

O Khaos CLI agora gera rotas automaticamente ao criar features, seguindo a estrutura do App Router:

```text
src/app/
├── (app)/                   # Grupo de rotas da aplicação
│   ├── (private)/           # Rotas privadas (requer autenticação)
│   │   ├── _layout.tsx      # Layout para rotas privadas
│   │   ├── dashboard/
│   │   │   ├── index.tsx    # /dashboard - exporta DashboardFeature
│   │   │   └── overview.tsx # /dashboard/overview - exporta DashboardOverviewFeature
│   │   ├── strategy/
│   │   │   ├── index.tsx    # /strategy - exporta StrategyFeature
│   │   │   └── investors.tsx # /strategy/investors - exporta StrategyInvestorsFeature
│   │   └── wallet/
│   │       ├── index.tsx    # /wallet - exporta WalletFeature
│   │       ├── deposit.tsx  # /wallet/deposit - exporta WalletDepositFeature
│   │       └── withdraw.tsx # /wallet/withdraw - exporta WalletWithdrawFeature
│   └── (public)/            # Rotas públicas (sem autenticação)
│       ├── _layout.tsx      # Layout para rotas públicas
│       ├── auth/
│       │   ├── login.tsx    # /auth/login - exporta AuthLoginFeature
│       │   └── register.tsx # /auth/register - exporta AuthRegisterFeature
│       └── landing/
│           └── index.tsx    # /landing - exporta LandingFeature
└── _layout.tsx              # Layout raiz da aplicação
```

### Layouts Tradicionais (Opcional)

Layouts tradicionais ainda são suportados para casos específicos:

```text
src/layouts/wallet/
├── _layout.tsx              # Layout de navegação (Stack/Tabs/Drawer)
├── index.tsx                # Rota: /wallet - exporta WalletFeature
├── deposit.tsx              # Rota: /wallet/deposit - exporta WalletDepositFeature
├── withdraw.tsx             # Rota: /wallet/withdraw - exporta WalletWithdrawFeature
├── wallet.type.ts           # Tipos para navegação (opcional)
├── wallet.constant.ts       # Constantes de navegação (opcional)
└── wallet.spec.ts           # Testes do layout (opcional)
```

### Como Rotas Exportam Features

Rotas são arquivos simples que exportam features como default export:

```tsx
// src/app/(app)/(private)/strategy/investors.tsx
export { StrategyInvestorsFeature as default } from '@/features/strategy-investors';

// src/app/(app)/(public)/auth/login.tsx
export { AuthLoginFeature as default } from '@/features/auth-login';

// src/app/(app)/(private)/dashboard/overview.tsx
export { DashboardOverviewFeature as default } from '@/features/dashboard-overview';
```

### Layouts para Rotas Públicas vs Privadas

```tsx
// src/app/(app)/(private)/_layout.tsx - Layout para rotas privadas
import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'expo-router';

export default function PrivateLayout() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }
  
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#f8fafc' },
      }}
    />
  );
}

// src/app/(app)/(public)/_layout.tsx - Layout para rotas públicas
import { Stack } from 'expo-router';

export default function PublicLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
```

> ✅ Rotas são apenas re-exports de features - mantém a separação de responsabilidades
> ✅ Features contêm toda a lógica de negócio e interface
> ✅ Estrutura `(app)/(private)` e `(app)/(public)` organiza rotas por tipo de acesso

---

## 📄 Exemplo `wallet.spec.ts`

```ts
import { render, screen } from '@testing-library/react-native';
import { WalletLayout } from './_layout';
import { Text } from 'react-native';

const HocMount = (props?: Partial<React.ComponentProps<typeof WalletLayout>>): JSX.Element => {
  return (
    <WalletLayout testID="wallet-layout" {...props}>
      <Text>Test Content</Text>
    </WalletLayout>
  );
};

describe('Layout: <WalletLayout />', () => {
  it('deve renderizar Stack layout corretamente', () => {
    render(<HocMount />);
    const sut = screen.getByTestId('wallet-layout-stack-layout');
    expect(sut).toBeTruthy();
  });

  it('deve renderizar o conteúdo children', () => {
    render(<HocMount />);
    const content = screen.getByText('Test Content');
    expect(content).toBeTruthy();
  });

  it('deve configurar screens do Stack corretamente', () => {
    render(<HocMount />);
    const stackLayout = screen.getByTestId('wallet-layout-stack-layout');
    expect(stackLayout).toBeTruthy();
    // Verificar se as screens estão configuradas
  });

  it('não deve renderizar se testID for omitido', () => {
    render(<HocMount testID={undefined} />);
    const sut = screen.queryByTestId('wallet-layout-stack-layout');
    expect(sut).toBeNull();
  });
});
```

---

## 🔧 CLI Khaos

### Modo Interativo
Quando executado sem parâmetros completos, o CLI guia através de perguntas:

```bash
khaos create layout
? Qual diretório para o layout? (app)/(private)/strategy
? Tipo de layout: Stack, Tabs ou Drawer? stack
? Incluir componentes de navegação? sim
? Adicionar sidebar? não
✅ Layout criado em (app)/(private)/strategy!
```

**Fluxo de Perguntas:**
1. **Diretório do layout**: Caminho onde será criado (ex: `(auth)`, `(private)/dashboard`)
2. **Tipo de layout**: `stack`, `tabs`, ou `drawer`
3. **Componentes de navegação**: Se deve incluir header, breadcrumbs, etc.
4. **Sidebar**: Se deve incluir barra lateral
5. **Configurações extras**: Responsividade, temas, etc.

### Modo Linha de Comando
Para usuários avançados que preferem comandos completos:

```bash
# Layout de autenticação
khaos create layout (auth) --type=stack

# Layout privado com sidebar
khaos create layout (private)/dashboard --type=stack --with-sidebar

# Layout com tabs
khaos create layout (public)/tabs --type=tabs

# Outros comandos
khaos update layout
khaos check layout
khaos delete layout
```

### Exemplos Comparativos

**Modo Interativo:**
```bash
khaos create layout
? Qual diretório para o layout? (private)/dashboard
? Tipo de layout: Stack, Tabs ou Drawer? stack
? Incluir componentes de navegação? sim
? Adicionar sidebar? sim
```

**Equivalente em Linha de Comando:**
```bash
khaos create layout (private)/dashboard --type=stack --with-navigation --with-sidebar
```

---

## ✨ Criar Layout Baseado em Diretório

1. **Informar o diretório/caminho**: CLI pergunta onde criar o layout
2. **Selecionar tipo de layout**: Após escolher diretório, CLI pergunta o tipo (Stack, Tabs, Drawer)
3. **Geração automática**: CLI pega o caminho do diretório para gerar `_layout.tsx`
4. **Estrutura automática**: Layout segue as regras já estabelecidas do Expo Router

### 📋 Fluxo de Criação

```bash
# Comando base
khaos create layout

# CLI pergunta o diretório/caminho
? Qual diretório para o layout? (app)/(private)/strategy

# CLI pergunta o tipo
? Tipo de layout: Stack, Tabs ou Drawer? Stack

# Resultado: src/app/(app)/(private)/strategy/_layout.tsx
```

### 🎯 Exemplos de Geração

```bash
# Exemplo 1: Layout privado
Diretório: (app)/(private)/strategy
Gera: src/app/(app)/(private)/strategy/_layout.tsx

# Exemplo 2: Layout público
Diretório: (app)/(public)/auth
Gera: src/app/(app)/(public)/auth/_layout.tsx

# Exemplo 3: Layout aninhado
Diretório: (app)/(private)/dashboard/settings
Gera: src/app/(app)/(private)/dashboard/settings/_layout.tsx
```

### 📁 Estrutura Gerada

```text
src/app/(app)/(private)/strategy/
├── _layout.tsx              # Layout Stack/Tabs/Drawer
├── index.tsx                # Rota: /strategy (opcional)
├── investors.tsx            # Rota: /strategy/investors (opcional)
├── strategy.type.ts         # Tipos para navegação (opcional)
├── strategy.constant.ts     # Constantes de navegação (opcional)
└── strategy.spec.ts         # Testes do layout (opcional)
```

### 🔄 Commit Automático

```bash
✨ feat(layout): add layout for (app)/(private)/strategy with Stack navigation
```

---

## ♻️ Atualizar Layout

```bash
♻️ refactor(layout): migrar `wallet` para Expo Router
```

---

## ✅ Validar Layout

```bash
khaos check layout
```

```text
Check dos Layouts:
- wallet: ✅ Válido (Expo Router)
- dashboard: ❌ Erro: _layout.tsx ausente
- profile: ⚠️ Aviso: Usando padrão antigo, migrar para Expo Router
Resumo: 1/3 layouts válidos
```

---

## 🗑️ Remover Layout

```bash
🗑️ chore(layout): remover layout `wallet`
```

---

## 📋 Responsabilidades dos Layouts com Expo Router

### ✅ O que Layouts DEVEM fazer:
- **Configurar navegação** usando Stack, Tabs ou Drawer do Expo Router
- **Definir screens** e suas opções de navegação
- **Implementar file-system routing** seguindo padrões oficiais do Expo Router
- **Centralizar configurações** de navegação no `_layout.tsx`
- **Prover tipagem** para opções de navegação (opcional)

### ❌ O que Layouts NÃO devem fazer:
- **Conter elementos visuais** (apenas configuração de navegação)
- **Gerenciar estado de dados** (apenas estrutura de navegação)
- **Ter arquivos desnecessários** como use-cases, services
- **❌ Não pode ter arquivos: stories.tsx e variant.ts**

**REGRA IMPORTANTE:** Layouts **NÃO** podem ter arquivos `stories.tsx` e `variant.ts`.

### 🎯 Foco Principal:
Layouts são **apenas configurações de navegação**. Toda a lógica de interface e negócio fica nas features que são exportadas pelas rotas.

---

## 🔄 Relacionamento com Features

### Prefixo Obrigatório
Todas as features que pertencem a um layout devem usar o nome do layout como prefixo:

```text
src/layouts/wallet/          # Layout de navegação
src/features/
├── wallet/                  # Feature principal do wallet
├── wallet-deposit/          # Feature de depósito
├── wallet-withdraw/         # Feature de saque
├── wallet-history/          # Feature de histórico
└── wallet-settings/         # Feature de configurações
```

### Exemplo de Uso com Expo Router
```tsx
// src/layouts/wallet/deposit.tsx - Rota simples
export { WalletDepositFeature as default } from '@/features/wallet-deposit';

// src/features/wallet-deposit/wallet-deposit.feature.tsx - Feature completa
export const WalletDepositFeature: FC<NWalletDepositFeature.Props> = ({ testID }) => {
  const { handleDeposit, isLoading } = useWalletDepositUseCase();
  
  return (
    <DepositTemplate testID={testID}>
      {/* Toda a lógica e interface aqui */}
    </DepositTemplate>
  );
};
```

> ✅ Separação clara: Layout = navegação, Feature = lógica + interface

---

## 🌐 Integração com Expo Router

### File-System Routing
- **`_layout.tsx`**: Define o layout de navegação
- **`index.tsx`**: Página principal da rota
- **`[id].tsx`**: Rotas dinâmicas
- **`(tabs)/`**: Grupos de rotas para tabs
- **`+not-found.tsx`**: Página 404

### Navegação Programática
```tsx
import { router } from 'expo-router';

// Navegar para rota
router.push('/wallet/deposit');

// Navegar com parâmetros
router.push('/wallet/history?filter=recent');

// Voltar
router.back();

// Substituir rota atual
router.replace('/wallet');
```

### Hooks de Navegação
```tsx
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function WalletPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const handleNavigate = () => {
    router.push('/wallet/deposit');
  };
  
  return (
    // JSX
  );
}
```

---

## 📚 Boas Práticas

### Navegação
- Use **file-system routing** para estruturar rotas
- Implemente **navegação programática** através de hooks do Expo Router
- Mantenha **configurações de screen** centralizadas no `_layout.tsx`
- Use **grupos de rotas** para organizar navegação complexa

### Performance
- Implemente **lazy loading** para rotas pesadas
- Use **React.memo** em componentes de layout
- Otimize **re-renders** com useCallback
- Considere **code splitting** por módulo

### Acessibilidade
- Adicione **labels** apropriados para navegação
- Implemente **navegação por teclado**
- Use **semantic roles** corretos
- Teste com **screen readers**

### Testes
- Teste **configuração de screens** no layout
- Mock **hooks de navegação** do Expo Router
- Valide **renderização de rotas**
- Teste **integração** com features

---

## 📚 Referências

* [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
* [Convenções Gerais](../general-conventions.md)
* [Validação Hermes](../validator.md)
* [Estrutura do Projeto](../project-structure.md)
* [Code Smells](../code-smells.md)
* [Features](./feature.md)
* [Organismos](./organism.md)

---

## ➡️ Próxima Camada

* [Features](./feature.md)