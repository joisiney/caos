# 🧩 Features

Features são a **camada final de apresentação** de uma funcionalidade. Ela **não possui layout próprio** e deve obrigatoriamente **usar um `Template`** para estruturar sua renderização.

> ❗ Toda feature **usa um `template`** e **nunca** renderiza elementos HTML diretamente. A lógica da feature é isolada via `useUseCase`, com possível orquestração de repositórios e serviços.

---

### 🔹 Estrutura `src/features/{name}`

* **Sufixo**: `.feature.tsx`
* **Exemplo**: `strategy-overview.feature.tsx` com `StrategyOverviewFeature`
* **Arquivos permitidos**:

  * `index.ts`
  * `{name}.feature.tsx`
  * `{name}.types.ts`
  * `{name}.use-case.ts`
  * `_services/{service-name}.service.ts` // Se houver mais de uma responsabilidade
  * `_repositories/{name}.repository.ts` // Obrigatório

> ✅ Todos os tipos devem estar agrupados na `namespace` no arquivo `.types.ts`

---

## 📁 Estrutura sugerida

```text
src/features/
├── strategy-overview/
│   ├── index.ts
│   ├── strategy-overview.feature.tsx
│   ├── strategy-overview.types.ts
│   ├── strategy-overview.use-case.ts
│   ├── _repositories/
│   │   └── strategy.repository.ts
│   └── _services/
│       └── animation.service.ts // Opcional
```

---

## 📄 Exemplo `strategy-overview.feature.tsx`

```tsx
import {FC} from 'react';
import {StrategyTemplate} from '@/templates/strategy';
import {useUseCase} from './strategy-overview.use-case';
import type {NStrategyOverviewFeature} from './strategy-overview.types';

export const StrategyOverviewFeature: FC<NStrategyOverviewFeature.Props> = (props) => {
  const useCase = useUseCase();

  return <StrategyTemplate.Root {...props} {...useCase} />;
};
```

---

## 📄 Exemplo `strategy-overview.use-case.ts`

```ts
import {useStrategyRepository} from './_repositories/strategy.repository';

export const useUseCase = () => {
  const {findOneById} = useStrategyRepository();

  const strategy = await findOneById('abc');

  return {
    strategy
  };
};
```

> ✅ Se houver mais de uma responsabilidade, use serviços em `_services/*` e orquestre aqui.

---

## 📄 Exemplo `strategy.repository.ts`

```ts
import {findOneStrategyGateway} from '@/gateways/find-one-strategy.gateway';
import {StrategyModel} from '@/models/strategy.model';

export const useStrategyRepository = () => {
  const findOneById = async (id: string) => {
    const data = await findOneStrategyGateway(id);
    return new StrategyModel(data);
  };

  return {
    findOneById,
  };
};
```

---

## 📄 Exemplo `index.ts`

```ts
export * from './strategy-overview.feature';
export * from './strategy-overview.types';
```

---

## 🔧 CLI Khaos

### Modo Interativo
Quando executado sem parâmetros completos, o CLI guia através de perguntas:

```bash
khaos create feature
? Qual é o nome de sua feature? strategy/investors
? Esta página é pública ou autenticada? private
? Posso criar o template também? sim
? Precisa de layout específico? não
✅ Feature strategy/investors criada com sucesso!
```

**Fluxo de Perguntas:**
1. **Nome da feature**: Caminho completo (ex: `auth/login`, `dashboard/analytics`)
2. **Tipo de rota**: `public`, `private`, ou `auth`
3. **Template associado**: Se deve criar template junto
4. **Layout específico**: Se precisa de layout customizado
5. **Componentes extras**: Hooks, utils, types específicos

### Modo Linha de Comando
Para usuários avançados que preferem comandos completos:

```bash
# Criar feature com rota privada
khaos create feature strategy/investors --route-type=private --with-template

# Criar feature com rota pública
khaos create feature auth/login --route-type=public

# Validar features
khaos check feature

# Remover feature
khaos delete feature
```

### Exemplos Comparativos

**Modo Interativo:**
```bash
khaos create feature
? Qual é o nome de sua feature? auth/login
? Esta página é pública ou autenticada? public
? Posso criar o template também? não
? Precisa de layout específico? não
```

**Equivalente em Linha de Comando:**
```bash
khaos create feature auth/login --route-type=public
```

---

### ✨ Criar Feature com Rota Automática

Ao criar uma feature, uma **rota é automaticamente gerada** seguindo o padrão Expo Router:

1. **Informar o caminho da feature**: `strategy/investors`
2. **CLI pergunta o tipo de rota**: Pública ou privada
3. **CLI pergunta o caminho no app**: Confirma ou permite editar
4. **Geração automática**:
   - Feature: `src/features/strategy-investors/`
   - Rota: `src/app/(app)/(private)/strategy/investors.tsx`
   - Componente: `StrategyInvestorsFeature`

#### Flags Disponíveis:
- `--route-type=public|private`: Define se a rota é pública ou privada
- `--route-path=strategy/investors`: Define o caminho da rota no app
- `--with-template`: Criar template associado
- `--with-layout`: Criar layout específico

#### Estrutura Gerada:

**Feature:**
```text
src/features/strategy-investors/
├── index.ts
├── strategy-investors.feature.tsx
├── strategy-investors.types.ts
├── strategy-investors.use-case.ts
├── _repositories/
│   └── strategy-investors.repository.ts
└── _services/ (opcional)
```

**Rota Automática:**
```text
src/app/(app)/(private)/strategy/investors.tsx
```

**Conteúdo da Rota:**
```tsx
// src/app/(app)/(private)/strategy/investors.tsx
export { StrategyInvestorsFeature as default } from '@/features/strategy-investors';
```

#### Estrutura de Pastas para Rotas:
- **Rotas Privadas**: `src/app/(app)/(private)/caminho/da/rota.tsx`
- **Rotas Públicas**: `src/app/(app)/(public)/caminho/da/rota.tsx`

#### Padrão de Nomenclatura:
- **Caminho**: `strategy/investors` → **Componente**: `StrategyInvestorsFeature`
- **Caminho**: `auth/login` → **Componente**: `AuthLoginFeature`
- **Caminho**: `dashboard/overview` → **Componente**: `DashboardOverviewFeature`

---

### ✅ Commit automático

```bash
✨ feat(feature): add strategy-investors feature with private route
```

---

### 🔍 Validar Feature

```bash
khaos check feature
```

Exemplo de saída:

```text
Check das Features:
- strategy-overview: ✅ Válida
- wallet-chart: ❌ Erro: implementa JSX direto
- dashboard: ❌ Erro: sem repositório
Resumo: 1/3 features válidas
```

---

## 📚 Boas Práticas

✅ **Pode:**

* Orquestrar `repositories` e `services` via `useUseCase`
* Utilizar `Template` como renderização
* Implementar composition root via `template.Root` com `partials`

❌ **Não pode:**

* Usar JSX/HTML direto (View, Text, etc)
* **Renderizar átomos, moléculas ou organismos diretamente. Renderiza exclusivamente template.**
* Incluir qualquer `mock`, `story`, `spec`, `variant`, etc
* Importar gateways diretamente (deve usar `repository`)

**REGRA IMPORTANTE:** Features **NÃO** podem renderizar átomos, moléculas ou organismos diretamente. Elas devem renderizar **exclusivamente templates**.

---

## ➕ Relacionado

* [Templates](../templates/template.md)
* [Molecules](../molecules/molecule.md)
* [Gateways](../gateways/gateway.md)
* [Models](../models/model.md)
* [Entities](../entities/entity.md)
