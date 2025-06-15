## 🧬 Sufixos e Nomenclatura por layer

Cada layer possui uma função clara dentro da arquitetura e deve seguir convenções rigorosas de sufixo e estrutura.

### 🔹 `atoms/`

* **Descrição**: Elementos básicos e reutilizáveis da interface.
* **Sufixo**: `.atom.tsx`
* **Exemplo**: `button.atom.tsx` com `ButtonAtom`
* **Arquivos permitidos**: `index.ts`, `*.atom.tsx`, `*.types.ts`, `*.constant.ts` (opcional)
* **📌 Observação**:
  - *index.ts:* deve exportar `*.atom.tsx`, `*.types.ts`, `*.constant.ts` (opcional)
  - *.types.ts:* deve exportar `Props` e se tiver constants deve exportar as `keys`

---

### 🔹 `molecules/`

* **Descrição**: Composições de atoms com possível lógica local.
* **Sufixo**: `.molecule.tsx`
* **Exemplo**: `modal.molecule.tsx` com `ModalMolecule`
* **Arquivos permitidos**: `index.ts`, `*.molecule.tsx`, `*.types.ts`, `*.constant.ts`, `*.service.ts`
* **📌 Observação**:
  - *index.ts:* deve exportar `*.molecule.tsx`, `*.types.ts`, `*.constant.ts` (opcional)
  - *.types.ts:* deve exportar `Props` e se tiver constants deve exportar as `keys`
  - *.molecule.tsx:* deve implementar o hook `*.service.ts`
* **⚠️ Restrição**:
  - *Não pode conter:* `partials/`, `mock.ts`, `scheme.ts`, `use-case.ts`, `context.tsx`

---

### 🔹 `organisms/`

* **Descrição**: Composições de moléculas e/ou átomos com estrutura semântica.
* **Sufixo**: `.organism.tsx`
* **Exemplo**: `profile-header.organism.tsx` com `ProfileHeaderOrganism`
* **Arquivos permitidos**: `index.ts`, `*.organism.tsx`, `*.types.ts`, `*.test.ts`, `*.mock.ts` (opcional), `use-case.ts` (opcional), `service.ts` (opcional), `scheme.ts` (opcional), `context.tsx` (opcional), `_partials/*.partial.tsx` (opcional), `_services/*.service.tsx` (opcional)
* **📌 Observação**:
  - `use-case.ts`  e `service.ts` são comutáveis, ou seja se existir um `service.ts` no root não deve existir um `use-case.ts`, e se existir o `use-case.ts` deve existir obrigatoriamente um `_services/*.service.tsx`
  - *index.ts:* deve exportar `*.organism.tsx`, `*.types.ts`, `*.constant.ts` (opcional)

---

### 🔹 `templates/`

* **Descrição**: Layouts visuais que orquestram todas as rotas que por sua vez orquestra a exibição de dados e interação das features.
* **Sufixo**: `.template.tsx`
* **Exemplo**: `strategy.template.tsx` com `StrategyTemplate`
* **Arquivos permitidos**: `index.ts`, `*.template.tsx`, `*.types.ts`, `partials/`
* **📌 Observação**:
  Em features mais complexar que possuem alto nível de atualização com socket ou mudança de estado, você pode utilizar o index para exportar os `_partials/*.partial.tsx` e transformar o `strategy.template.tsx` em um root, usando o padrão de composição neste cenário o `strategy.template.tsx` deve receber obrigatoriamente um `children` para que possa receber os elementos `Partial`
* **⚠️ Restrição**:
  - *Não pode conter:* `use-case.ts`, `scheme.ts`, `mock.ts`, `context.tsx`, `constant.ts`, `service.ts` e `gateway.ts`

---

### 🔹 `features/`

* **Descrição**: Representa uma funcionalidade completa da aplicação.
* **Sufixo**: `.feature.tsx`
* **Exemplo**: `wallet-deposit.feature.tsx` com `WalletDepositFeature`
* **Arquivos permitidos**: `index.ts`, `*.feature.tsx`, `*.types.ts`, `use-case.ts`, `_services/*.service.tsx`
ℹ️ **Observação**:
  - Deve sempre ter como prefixo o **nome do layout/módulo** a que pertence (ex: `wallet-...`)
  - Uma `features` pode conter um `*.use-case.ts` que orquestra múltiplos `services`, ou conter apenas um `*.service.ts` na raiz para lógica mais simples. Se houver múltiplos serviços, o uso de `*.use-case.ts` é obrigatório.

---

### 🔹 `layouts/`

* **Descrição**: Define a navegação e estrutura dos módulos da aplicação.
* **Sufixo**: `.layout.tsx`
* **Exemplo**: `wallet.layout.tsx` com `WalletLayout`
* **Arquivos permitidos**: `index.ts`, `*.layout.tsx`, `*.types.ts`, `use-case.ts`, `_services/*.service.tsx`

---

### 🔹 `particles/`

* **Descrição**: Serviços, constantes e contextos compartilháveis entre features.
* **Sufixo**: `.particle.tsx`
* **Exemplo**: `scroll-button.particle.tsx` com `ScrollButtonParticle`
* **Arquivos permitidos**: `index.ts`, `*.context.tsx`, `*.types.ts`, `_services/*.service.tsx`
* **📌 Observação**:
  - Não deve conter elementos gráficos no `context` deve haver apenas o `provider`

---

### 🔹 `models/`

* **Descrição**: Classes que encapsulam regras de negócio e transformações, deve ser de uso exclusivo para tratar dados recebidos de API na layer de `repository`.
* **Sufixo**: `.model.ts`
* **Exemplo**: `strategy.model.ts` com `StrategyModel`

---

### 🔹 `entities/`

* **Descrição**: Representações puras dos dados (tipos) recebidos da API.
* **Sufixo**: `.entity.ts`
* **Exemplo**: `strategy.entity.ts` com `TStrategyEntity`
* **📝 Convenção**: Deve sempre começar com a letra `T`

---

### 🔹 `utils/`

* **Descrição**: Funções utilitárias puras.
* **Sufixo**: `.util.ts`
* **Exemplo**: `format-date.util.ts` com `formatDateUtil`

---

### 🔹 `gateways/`

* **Descrição**: layer de acesso a APIs externas.
* **Sufixo**: `.gateway.ts`
* **Exemplo**: `find-one-strategy.gateway.ts` com `findOneStrategyGateway`
* **📝 Convenção**: Sempre começa com um verbo (`find-one`, `find-many`, `create`, `update`)

---

### 🔹 `repositories/`

* **Descrição**: Orquestradores que combinam múltiplos gateways (hooks).
* **Sufixo**: `.repository.ts`
* **Exemplo**: `strategy.repository.ts` com `useStrategyRepository`
* **⚠️ Restrição**:
  - 📌 Importante: O nome de `repository` **não deve ser prefixado com verbos** como `find-one`, pois ele pode combinar diversos gateways com diferentes operações. 📌 Features devem sempre deixar explícito seu módulo (layout) através do prefixo, como `wallet-deposit.feature.tsx`, onde `wallet` é o nome do layout.

## Exemplo de Estrutura Completa

```bash
NAME/
├── NAME.LAYER.tsx
├── NAME.types.ts
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
> - **Molecules**: Só podem ter a estrutura básica + `service.ts` e `constant.ts`. Não podem ter partials, use-case, scheme, mock ou context.
> - **Templates**: Só podem ter a estrutura básica + `partials/`. Não podem ter use-case, scheme, mock, context, constant ou service.

```bash
src/
├── atoms/
├── molecules/
├── organisms/
├── templates/
├── features/
│   └── wallet/
│       └── wallet.feature.tsx
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

### 📄 Exemplo `modal.types.ts`

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