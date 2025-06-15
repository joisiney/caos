# 📘 Caos

O nome do projeto é **Caos**, inspirado na divindade primordial da mitologia grega que representava o estado original do universo — um espaço indefinido de onde tudo surgiu. Assim como o mito, este projeto nasce da desordem para estabelecer uma estrutura clara, escalável e sustentável no desenvolvimento frontend.

Nosso objetivo é transformar o caos do início de um projeto em uma arquitetura bem definida, que favoreça consistência, reuso, modularidade e legibilidade de código. A proposta é permitir que times múltiplos desenvolvam em paralelo com fluidez e previsibilidade, respeitando convenções rígidas, separação de responsabilidades e boas práticas reconhecidas no ecossistema React.


## 🧱 Convenções Gerais

* Arquivos `index.ts` servem exclusivamente para **expor publicamente os elementos reutilizáveis** da camada (molecule, feature, etc.)

  * Nunca implemente lógica ou declare tipos dentro desses arquivos
  * Eles funcionam como uma interface pública do módulo para consumo externo

* Arquivos e pastas em **dash-case**

* Nenhum nome pode conter letra maiúscula ou caracteres especiais.

* Toda camada tem sufixo obrigatório em:

  * Nome do arquivo
  * Nome da função/componente/classe

* Todos os `index.ts` existem apenas para expor publicamente os módulos daquela camada.

* Tipos globais ficam em `@types/global.d.ts`

* Todos os `Props` incluem `testID?: string`

* O `types.ts` sempre importa `scheme.ts` e `use-case.ts` no topo, **caso existam.**

* O tipo `Props` deve estender `TWithTestID`, salvo exceções descritas em `layouts` e `features`.

* `scheme.ts` usa `zod`, e seu tipo é inferido como `Schema`

* Todos os componentes podem conter uma pasta `partials/`, com arquivos sufixados `.partial`

* Regras globais aplicam-se a todas as camadas do projeto

---

## 📏 Princípios de Design

Adotamos os seguintes princípios para garantir a qualidade do código:

### ✅ SOLID

1. **S**ingle Responsibility Principle — Cada módulo ou classe deve ter uma única responsabilidade bem definida.
2. **O**pen/Closed Principle — Deve ser aberto para extensão, mas fechado para modificação.
3. **L**iskov Substitution Principle — Subtipos devem poder substituir seus tipos base sem quebrar o comportamento.
4. **I**nterface Segregation Principle — Muitas interfaces específicas são melhores que uma interface genérica.
5. **D**ependency Inversion Principle — Dependa de abstrações, nunca de implementações concretas.

### ✅ KISS (Keep It Simple, Stupid)

* Evite complexidade desnecessária. Prefira soluções simples e diretas.

### ✅ YAGNI (You Aren’t Gonna Need It)

* Só implemente o que for **realmente necessário** agora. Evite criar funcionalidades "por precaução".

---

## 🚫 Code Smells a Serem Evitados

Com base nas definições do Refactoring Guru, seguem outros *code smells* que devem ser evitados:

| Smell                        | Descrição                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| **Código morto (Dead Code)** | Código que nunca é executado ou que não é mais utilizado.                                        |
| **Data Clumps**              | Agrupamentos frequentes dos mesmos parâmetros — devem ser encapsulados em objetos.               |
| **Divergent Change**         | Quando múltiplas mudanças em um único módulo afetam várias responsabilidades diferentes.         |
| **Shotgun Surgery**          | Uma pequena alteração exige modificações em vários lugares.                                      |
| **Feature Envy**             | Um módulo acessa excessivamente os dados de outro em vez de pedir que ele mesmo faça o trabalho. |
| **Inappropriate Intimacy**   | Classes que acessam os detalhes internos umas das outras com muita frequência.                   |
| **Speculative Generality**   | Código criado "por precaução" para algo que nunca será necessário.                               |
| **Temporary Field**          | Campos que só são usados em situações muito específicas.                                         |
| **Primitive Obsession**      | Uso excessivo de tipos primitivos ao invés de criar tipos próprios (models, entities).           |
| **Message Chains**           | Acesso profundo a métodos em cadeia, como `obj.a().b().c()`.                                     |
| **Middle Man**               | Classes que apenas delegam chamadas para outros objetos.                                         |

| Smell                                      | Descrição                                                             |
| ------------------------------------------ | --------------------------------------------------------------------- |
| **Funções muito longas**                   | Divida funções com muitas responsabilidades em funções menores.       |
| **Código duplicado**                       | Extraia trechos comuns em funções utilitárias.                        |
| **Lógica acoplada à UI**                   | Toda lógica deve estar em `use-case.ts`, fora da camada visual.       |
| **Nomes genéricos**                        | Evite nomes como `data`, `info`, `result`. Prefira nomes descritivos. |
| **Comentários explicando código complexo** | Prefira simplificar o código do que explicá-lo.                       |
| **Switch ou ifs com muitos casos**         | Tente quebrar em múltiplas funções ou usar objetos como mapa.         |
| **Funções com muitos parâmetros**          | Agrupe em objetos de configuração se necessário.                      |
| **Acesso direto ao DOM**                   | Nunca manipule o DOM diretamente. Use sempre o React.                 |
| **Mutação de estado direto**               | Use sempre os setters dos hooks ou métodos do estado.                 |

Esta arquitetura é altamente indicada para projetos de **médio a grande porte**, com múltiplos módulos, times ou squads. Sua estrutura detalhada promove **consistência, escalabilidade e manutenibilidade** ao longo do tempo.

---

## 📂 Estrutura de Pastas

```bash
src/
├── atoms/
├── molecules/
├── organisms/
├── templates/
├── features/
├── layouts/
├── particles/
├── models/
├── entities/
├── utils/
├── gateways/
├── configs/
│   ├── http/
│   ├── envs/
│   ├── tailwind/
│   └── lingui/
├── schemas/
├── test-resources/
│   ├── mocks/
│   ├── libs/
│   └── others/
├── regexp-constants/
├── @types/
│   └── global.d.ts
```

---

## 🧬 Sufixos e Nomenclatura por Camada

Cada camada possui uma função clara dentro da arquitetura. A seguir, são descritas com seus respectivos sufixos obrigatórios e exemplos de uso.

| Camada        | Descrição                                                                                                           | Arquivo                        | Conteúdo interno         |
| ------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------ |
| atoms/        | Elementos básicos e reutilizáveis da interface.                                                                     | `button.atom.tsx`              | `ButtonAtom`             |
| molecules/    | Composições de atoms com possível lógica local.                                                                     | `modal.molecule.tsx`           | `ModalMolecule`          |
| organisms/    | Composições de moléculas com estrutura semântica.                                                                   | `profile-header.organism.tsx`  | `ProfileHeaderOrganism`  |
| templates/    | Layouts de exibição visual e interação para features.                                                               | `strategy.template.tsx`        | `StrategyTemplate`       |
| features/     | Representa uma funcionalidade completa. Deve ser prefixada com o módulo (layout).                                   | `wallet-deposit.feature.tsx`   | `WalletDepositFeature`   |
| layouts/      | Define a navegação e os módulos da aplicação.                                                                       | `wallet.layout.tsx`            | `WalletLayout`           |
| particles/    | Services, constants, context e utilitários que podem ser compartilhados entre features.                             | `scroll-button.particle.tsx`   | `ScrollButtonParticle`   |
| models/       | Classes que encapsulam entidades e lógica.                                                                          | `strategy.model.ts`            | `StrategyModel`          |
| entities/     | Tipagens puras de dados, sempre iniciadas com `T`.                                                                  | `strategy.entity.ts`           | `TStrategyEntity`        |
| utils/        | Funções utilitárias puras.                                                                                          | `format-date.util.ts`          | `formatDateUtil`         |
| gateways/     | Acesso a APIs externas. Sempre começa com `find-one`, `find-many`, `create` ou `update` e termina com `gateway.ts`. | `find-one-strategy.gateway.ts` | `findOneStrategyGateway` |
| repositories/ | Hook que orquestra múltiplos gateways. Nunca usar verbos no nome.                                                   | `strategy.repository.ts`       | `useStrategyRepository`  |

> 📌 Importante: O nome de `repository` **não deve ser prefixado com verbos** como `find-one`, pois ele pode combinar diversos gateways com diferentes operações. 📌 Features devem sempre deixar explícito seu módulo (layout) através do prefixo, como `wallet-deposit.feature.tsx`, onde `wallet` é o nome do layout.

---

```bash
modal/
├── modal.molecule.tsx
├── modal.types.ts
├── index.ts
├── modal.test.ts
├── modal.mock.ts (opcional)
├── modal.use-case.ts (opcional / condicional)
├── modal.service.ts (opcional / condicional)
├── modal.scheme.ts (opcional)
├── modal.context.tsx (opcional)
├── modal.constant.ts (opcional)
├── partials/
│   └── modal-header.partial.tsx (opcional)
├── _services/
│   └── close-modal.service.ts (opcional)
```

> ℹ️ **Observação**: Uma `molecule` pode conter um `use-case` que orquestra múltiplos `services`, ou conter apenas um `modal.service.ts` na raiz para lógica mais simples. Se houver múltiplos serviços, o uso de `use-case` é obrigatório.
>
> ✅ Arquivos marcados como (opcional) podem ser incluídos conforme a complexidade da interface.
> 🟨 Arquivos marcados como (condicional) são criados apenas se houver necessidade de lógica específica, validação ou orquestração de múltiplos serviços.são criados apenas se um `use-case` ou `scheme` for necessário.

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

---


### 📄 Exemplo `modal.types.ts`


```ts
import { schema } from './modal.scheme';
import { useUseCase } from './modal.use-case';

export namespace NModalMolecule {
  export type UseCase = ReturnType<typeof useUseCase>;
  export type Schema = z.infer<typeof schema>; // Typagem do `schema` caso seja necessário ter validações
  export type Props = TWithTestID;
  export type HeaderProps = TWithTestID & { title: string }; // Typagem do `partial` caso exista
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

---

## 📡 Gateway

* Os gateways devem ter prefixo com verbo obrigatório.
* Os verbos permitidos são: `find-one`, `find-many`, `create`, `update`.
* Sempre usar sufixo `gateway.ts`.
* Exemplo de nome válido: `find-one-strategy.gateway.ts`.

### 📄 Exemplo `find-one-strategy.gateway.ts`

```ts
import { httpClient } from './http';
import { TStrategyEntity } from '@/entities/strategy.entity';

export const findOneStrategyGateway = async (id: string): Promise<TStrategyEntity> => {
  const { data } = await httpClient.get(`/strategy/${id}`);
  return data;
};
```

---

## 🗂 Repository

* Os repositórios implementam os gateways.

* São **hooks** (começam com `use`) e podem orquestrar múltiplos gateways.

* Nunca devem usar os prefixos `find-one`, `find-many`, `create`, `update`.

* Sempre usar sufixo `repository.ts`.

* O nome deve estar em **dash-case**, mas o nome do arquivo é sempre no formato `nome.repository.ts` (ex: `strategy.repository.ts`).

* Exemplo de nome válido: `strategy.repository.ts`.

* Os repositórios implementam os gateways.

* São **hooks** (começam com `use`) e podem orquestrar múltiplos gateways.

* Sempre usar sufixo `repository.ts`.

---

### 📄 Exemplo `strategy.repository.ts`

```ts
import { findOneStrategyGateway } from '@/gateways/find-one-strategy.gateway';
import { StrategyModel } from '@/models/strategy.model';

export const useStrategyRepository = () => {

 const findOneById = (id: string) => {
   const data = await findOneStrategyGateway(id);
   return new StrategyModel(data);
 };

 return {
  findOneById
 }
};
```

---

## 🧪 Testes

### 📄 Modelo de teste

```ts
const HocTemplate = (): React.JSX.Element => <Template testID="template" />;

describe('Page: <Template/>', () => {
  it('deve renderizar', async () => {
    render(<HocTemplate />);
    await act(async () => {
      const sut = screen.getByTestId('template');
      expect(sut).toBeTruthy();
    });
  });
});
```

---

## 🧭 Recomendação Final

Use esta documentação como base para todas as decisões arquiteturais do projeto.
Respeitar a estrutura proposta ajuda na escalabilidade, manutenibilidade e produtividade do time.

Caso uma exceção precise ser feita, **documente** o motivo e compartilhe com o time.

