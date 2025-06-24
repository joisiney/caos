## 🧬 Sufixos e Nomenclatura por layer

Cada layer possui uma função clara dentro da arquitetura e deve seguir convenções rigorosas de sufixo e estrutura.

### 🔹 `src/atoms/*`

* **Descrição**: Elementos básicos e reutilizáveis da interface.
* **Sufixo**: `.atom.tsx`
* **Exemplo**: `button.atom.tsx` com `ButtonAtom`
* **Arquivos permitidos**: `index.ts`, `*.atom.tsx`, `*.type.ts`, `*.constant.ts` (opcional), `*.variant.ts` (opcional), `*.mock.ts` (opcional), `*.stories.tsx`, `*.spec.ts`
* **📌 Observação**:
  - *index.ts:* deve exportar `*.atom.tsx`, `*.type.ts`, `*.constant.ts` (opcional), `*.mock.ts` (opcional)
  - **.type.ts:* deve exportar namespace `N{Name}Atom` com `Props` e se tiver constants deve exportar as `keys`
  - Todos os tipos devem estar agrupados na `namespace` no arquivo `.type.ts`
* **⚠️ Restrição**:
  - *Não pode conter:* `*.use-case.ts`, `*.service.ts`, `_partials/`, `_services/`

---

### 🔹 `src/molecules/*`

* **Descrição**: Composições de atoms com possível lógica local.
* **Sufixo**: `.molecule.tsx`
* **Exemplo**: `modal.molecule.tsx` com `ModalMolecule`
* **Arquivos permitidos**: `index.ts`, `*.molecule.tsx`, `*.type.ts`, `*.constant.ts` (opcional), `*.variant.ts` (opcional), `*.mock.ts` (opcional), `*.stories.tsx`, `*.spec.ts`, `*.use-case.ts`, `_services/*.service.ts` (opcional)
* **📌 Observação**:
  - *index.ts:* deve exportar `*.molecule.tsx`, `*.type.ts`, `*.constant.ts` (opcional), `*.mock.ts` (opcional)
  - ***.type.ts:* deve exportar namespace `N{Name}Molecule` com `Props` e se tiver constants deve exportar as `keys`
  - ***.molecule.tsx:* deve implementar obrigatoriamente o hook `*.use-case.ts`
  - Deve importar pelo menos um átomo
  - Services devem estar em `_services/` e nunca importados diretamente no componente
* **⚠️ Restrição**:
  - *Não pode conter:* `_partials/`, `mock.ts`, `scheme.ts`, `context.tsx`

---

### 🔹 `src/organisms/*`

* **Descrição**: Composições de moléculas e/ou átomos com estrutura semântica.
* **Sufixo**: `.organism.tsx`
* **Exemplo**: `profile-header.organism.tsx` com `ProfileHeaderOrganism`
* **Arquivos permitidos**: `index.ts`, `*.organism.tsx`, `*.type.ts`, `*.constant.ts` (opcional), `*.variant.ts` (opcional), `*.mock.ts` (opcional), `*.stories.tsx`, `*.spec.ts`, `*.use-case.ts`, `*.scheme.ts` (opcional), `*.context.tsx` (opcional), `_partials/*.partial.tsx` (opcional), `_services/*.service.ts` (opcional)
* **📌 Observação**:
  - *index.ts:* deve exportar `*.organism.tsx`, `*.type.ts`, `*.constant.ts` (opcional), `*.mock.ts` (opcional)
  - ***.type.ts:* deve exportar namespace `N{Name}Organism` com `Props` e tipos de partials
  - ***.organism.tsx:* deve implementar obrigatoriamente o hook `*.use-case.ts`
  - Pode ter átomos exclusivos em `_partials/` que devem ser "burros" (sem lógica)
  - Lógica deve ser centralizada no `use-case.ts`

---

### 🔹 `src/templates/*`

* **Descrição**: Layouts visuais que orquestram todas as rotas que por sua vez orquestra a exibição de dados e interação das features.
* **Sufixo**: `.template.tsx`
* **Exemplo**: `strategy.template.tsx` com `StrategyTemplate`
* **Arquivos permitidos**: `index.ts`, `*.template.tsx`, `*.type.ts`, `_partials/*.partial.tsx` (opcional)
* **📌 Observação**:
  - *index.ts:* deve exportar `*.template.tsx`, `*.type.ts`
  - ***.type.ts:* deve exportar namespace `N{Name}Template` com `Props`
  - Foco em layout visual, orquestra organismos de header, navigation e footer
  - Em features complexas pode usar padrão de composição com `children`
  - Pode exportar `_partials/*.partial.tsx` no index quando necessário
* **⚠️ Restrição**:
  - *Não pode conter:* `use-case.ts`, `scheme.ts`, `mock.ts`, `context.tsx`, `constant.ts`, `service.ts` e `gateway.ts`

---

### 🔹 `src/features/*`

* **Descrição**: Representa uma funcionalidade completa da aplicação.
* **Sufixo**: `.feature.tsx`
* **Exemplo**: `wallet-deposit.feature.tsx` com `WalletDepositFeature`
* **Arquivos permitidos**: `index.ts`, `*.feature.tsx`, `*.type.ts`, `*.use-case.ts`, `_services/*.service.tsx`
* **📌 Observação**:
  - *index.ts:* deve exportar `*.feature.tsx`, `*.type.ts`
  - ***.type.ts:* deve exportar namespace `N{Name}Feature` com `Props`
  - ***.feature.tsx:* deve implementar obrigatoriamente o hook `*.use-case.ts`
  - Deve sempre ter como prefixo o **nome do layout/módulo** a que pertence (ex: `wallet-deposit.feature.tsx`)
  - Representa uma funcionalidade completa da aplicação
  - Use-case orquestra múltiplos services em `_services/`

---

### 🔹 `src/layouts/*`

* **Descrição**: Configurações de navegação usando Expo Router file-system routing. Layouts são apenas configurações de Stack, Tabs ou Drawer.
* **Arquivo principal**: `_layout.tsx` (padrão Expo Router)
* **Exemplo**: `wallet/_layout.tsx` com `WalletLayout`
* **Arquivos obrigatórios**: `_layout.tsx`
* **Arquivos opcionais**: `index.ts`, `*.tsx` (rotas), `*.type.ts`, `*.constant.ts`, `*.spec.ts`
* **📌 Observação**:
  - *_layout.tsx:* implementa apenas Stack, Tabs ou Drawer do Expo Router
  - *Rotas (*.tsx):* são arquivos simples que exportam features: `export {FeatureName as default} from 'features/feature-name'`
  - Define file-system routing baseado na hierarquia de pastas
  - Layouts são apenas configurações de navegação, sem lógica de negócio
  - **NÃO devem ter**: `stories.tsx`, `variant.ts`, `mock.ts`, `use-case.ts`, `_services/`

---

### 🔹 `src/particles/*`

* **Descrição**: Serviços, constantes e contextos compartilháveis entre features.
* **Sufixo**: `.particle.tsx`
* **Exemplo**: `scroll-button.particle.tsx` com `ScrollButtonParticle`
* **Arquivos permitidos**: `index.ts`, `*.particle.tsx`, `*.type.ts`, `*.context.tsx` (opcional), `*.constant.ts` (opcional), `*.mock.ts` (opcional), `*.stories.tsx`, `*.spec.ts`, `_services/*.service.ts` (opcional)
* **📌 Observação**:
  - *index.ts:* deve exportar `*.particle.tsx`, `*.type.ts`, `*.context.tsx` (opcional), `*.constant.ts` (opcional), `*.mock.ts` (opcional)
  - ***.type.ts:* deve exportar namespace `N{Name}Particle` com `Props`
  - Context deve conter apenas provider (sem elementos gráficos)
  - Serviços, constantes e contextos compartilháveis entre features
  - Devem ser stateless quando possível

---

### 🔹 `src/models/*`

* **Descrição**: Classes que encapsulam regras de negócio e transformações, deve ser de uso exclusivo para tratar dados recebidos de API na layer de `repository`.
* **Sufixo**: `.model.ts`
* **Exemplo**: `strategy.model.ts` com `StrategyModel`

---

### 🔹 `src/entities/*`

* **Descrição**: Representações puras dos dados (tipos) recebidos da API.
* **Sufixo**: `.entity.ts`
* **Exemplo**: `strategy.entity.ts` com `TStrategyEntity`
* **📝 Convenção**: Deve sempre começar com a letra `T`

---

### 🔹 `src/utils/*`

* **Descrição**: Funções utilitárias puras.
* **Sufixo**: `.util.ts`
* **Exemplo**: `format-date.util.ts` com `formatDateUtil`

---

### 🔹 `src/gateways/*`

* **Descrição**: layer de acesso a APIs externas.
* **Sufixo**: `.gateway.ts`
* **Exemplo**: `find-one-strategy.gateway.ts` com `findOneStrategyGateway`
* **📝 Convenção**: Sempre começa com um verbo (`find-one`, `find-many`, `create`, `update`)

---

### 🔹 `src/repositories/*`

* **Descrição**: Orquestradores que combinam múltiplos gateways (hooks).
* **Sufixo**: `.repository.ts`
* **Exemplo**: `strategy.repository.ts` com `useStrategyRepository`
* **⚠️ Restrição**:
  - 📌 Importante: O nome de `repository` **não deve ser prefixado com verbos** como `find-one`, pois ele pode combinar diversos gateways com diferentes operações. 📌 Features devem sempre deixar explícito seu módulo (layout) através do prefixo, como `wallet-deposit.feature.tsx`, onde `wallet` é o nome do layout.

## Exemplo de Estrutura Completa

```bash
NAME/
├── NAME.LAYER.tsx
├── NAME.type.ts
├── index.ts
├── NAME.test.ts (opcional)
├── NAME.mock.ts (opcional)
├── NAME.use-case.ts (opcional / condicional)
├── NAME.service.ts (opcional / condicional)
├── NAME.scheme.ts (opcional)
├── NAME.context.tsx (opcional)
├── NAME.constant.ts (opcional)
├── partials/
│   └── NAME.partial.tsx (opcional)
├── _services/
│   └── NAME.service.ts (opcional)
```

> ✅ Arquivos marcados como (opcional) podem ser incluídos conforme a complexidade da interface.
> 🟨 Arquivos marcados como (condicional) são criados apenas se houver necessidade de lógica específica, validação ou orquestração de múltiplos serviços. são criados apenas se um `use-case` ou `scheme` for necessário.
>
> ⚠️ **IMPORTANTE - Restrições por layer**:
> - **Molecules**: Devem ter `use-case.ts` obrigatório + `_services/` opcionais. Não podem ter `_partials/`, `scheme.ts`, `context.tsx`.
> - **Templates**: Só podem ter a estrutura básica + `_partials/`. Não podem ter `use-case.ts`, `scheme.ts`, `mock.ts`, `context.tsx`, `constant.ts`, `service.ts`.
> - **Particles**: Context deve conter apenas provider (sem elementos gráficos).
> - **Features**: Devem ter prefixo do layout (ex: `wallet-deposit.feature.tsx`).
> - **Repositories**: Nome SEM prefixo de verbo, export como hook (ex: `useStrategyRepository`).

```bash
src/
├── atoms/
├── molecules/
├── organisms/
├── templates/
├── features/
│   └── wallet-deposit/
│       └── wallet-deposit.feature.tsx
├── layouts/
├── particles/
├── models/
├── entities/
├── utils/
│   ├── format-date.util.ts
│   ├── format-date.util.spec.ts
│   └── index.ts
├── gateways/
│   ├── gateway.ts
│   ├── http.ts
│   ├── types.ts
│   └── index.ts
├── repositories/
│   └── strategy.repository.ts
├── config/
│   ├── env/
│   ├── http/
│   ├── tailwind/
│   └── index.ts
├── schemas/
├── @types/
│   └── global.d.ts
├── test-resources/
│   ├── mocks/
│   ├── libs/
│   └── others/
```

## Exemplos de Implementação

### 📄 Exemplo `modal.type.ts`

```ts
import { schema } from './modal.scheme';
import { useUseCase } from './modal.use-case';

export namespace NModalMolecule {
  export type UseCase = ReturnType<typeof useUseCase>;
  export type Schema = z.infer<typeof schema>; // Tipagem do `schema` caso seja necessário ter validações
  export type Props = TWithTestID;
  export type HeaderProps = TWithTestID & { title: string }; // Tipagem do `partial` caso exista
}
```

### 📄 Exemplo `modal-header.partial.tsx`

```tsx
export const HeaderPartial: FC<NModal.HeaderProps> = ({ testID, title }) => (
  <Text testID={`${testID}-header-partial`}>{title}</Text>
);
```

### 📄 Exemplo de esquema `modal.scheme.ts`

```ts
import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(1),
});
``` 