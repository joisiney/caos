# 📘 Caos

O nome do projeto é **Caos**, inspirado na divindade primordial da mitologia grega que representava o estado original do universo — um espaço indefinido de onde tudo surgiu. Assim como o mito, este projeto nasce da desordem para estabelecer uma estrutura clara, escalável e sustentável no desenvolvimento frontend.

Nosso objetivo é transformar o caos do início de um projeto em uma arquitetura bem definida, que favoreça consistência, reuso, modularidade e legibilidade de código. A proposta é permitir que times múltiplos desenvolvam em paralelo com fluidez e previsibilidade, respeitando convenções rígidas, separação de responsabilidades e boas práticas reconhecidas no ecossistema React.


## 🧱 Convenções Gerais

* Arquivos `index.ts` servem exclusivamente para **expor publicamente os elementos reutilizáveis** da camada (molecule, feature, etc.)

  * Nunca implemente lógica ou declare tipos dentro desses arquivos
  * Eles funcionam como uma interface pública do módulo para consumo externo

* Arquivos e pastas em **dash-case**

* Nenhum nome pode conter letra maiúscula

* Toda camada tem sufixo obrigatório em:

  * Nome do arquivo
  * Nome da função/componente/classe

* Arquivos de exportação pública se chamam apenas `index.ts`

* Tipos globais ficam em `@types/global.d.ts`

* Todos os `Props` incluem `testID?: string`

* O `types.ts` sempre importa `scheme.ts` e `use-case.ts` no topo

* `scheme.ts` usa `zod`, e seu tipo é inferido como `Schema`

* Regras globais aplicam-se a todas as camadas do projeto

---

## 📂 Estrutura de Pastas

```txt
src/
├── atoms/
├── molecules/
├── organisms/
├── templates/
├── features/
├── layout/
├── particles/
├── models/
├── entities/
├── utils/
├── gateways/
├── config/
│   ├── http/
│   ├── envs/
│   ├── tailwind/
│   └── lingui/
├── schema/
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

| Camada     | Arquivo                           | Conteúdo interno            |
| ---------- | --------------------------------- | --------------------------- |
| Atom       | `button.atom.tsx`                 | `ButtonAtom`                |
| Molecule   | `modal.molecule.tsx`              | `ModalMolecule`             |
| Organism   | `profile-header.organism.tsx`     | `ProfileHeaderOrganism`     |
| Template   | `strategy.template.tsx`           | `StrategyTemplate`          |
| Feature    | `wallet-deposit.feature.tsx`      | `WalletDepositFeature`      |
| Layout     | `dashboard.layout.tsx`            | `DashboardLayout`           |
| Particle   | `scroll-button.particle.tsx`      | `ScrollButtonParticle`      |
| Model      | `strategy.model.ts`               | `StrategyModel`             |
| Entity     | `strategy.entity.ts`              | `TStrategyEntity`           |
| Util       | `format-date.util.ts`             | `formatDateUtil`            |
| Gateway    | `find-one-strategy.gateway.ts`    | `findOneStrategyGateway`    |
| Repository | `find-one-strategy.repository.ts` | `findOneStrategyRepository` |

---

## 🧩 Exemplo de Molecule Completa

### 📁 Estrutura

```
modal/
├── modal.molecule.tsx
├── modal.types.ts
├── index.ts
├── modal.test.ts
├── modal.mock.ts
├── modal.use-case.ts
├── modal.scheme.ts
├── modal.context.tsx
├── modal.constant.ts
├── partials/
│   └── modal-header.partial.tsx
├── _services/
│   └── close-modal.service.ts
```

### 📄 Exemplo `modal.types.ts`

```ts
import { schema } from './modal.scheme';
import { useUseCase } from './modal.use-case';

export namespace NModal {
  export type UseCase = ReturnType<typeof useUseCase>;
  export type Schema = z.infer<typeof schema>;
  export type Props = TWithTestID & UseCase;
  export type ModalHeaderProps = { title: string };
}
```

### 📄 Exemplo `modal-header.partial.tsx`

```tsx
export const ModalHeaderPartial: FC<NModal.ModalHeaderProps> = ({ title }) => (
  <Text>{title}</Text>
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

* O nome deve estar em **dash-case**, mas o nome do arquivo é sempre no formato `use-nome.repository.ts` (ex: `use-strategy.repository.ts`).

* Exemplo de nome válido: `use-strategy.repository.ts`.

* Os repositórios implementam os gateways.

* São **hooks** (começam com `use`) e podem orquestrar múltiplos gateways.

* Nunca devem usar os prefixos `find-one`, `find-many`, `create`, `update`.

* Sempre usar sufixo `repository.ts`.

*

* Os repositórios implementam os gateways.

* Não é necessário prefixar com verbo.

* Sempre usar sufixo `repository.ts`.

* Exemplo de nome válido: `strategy.repository.ts`.

### 📄 Exemplo `strategy.repository.ts`

```ts
import { findOneStrategyGateway } from '@/gateways/find-one-strategy.gateway';
import { StrategyModel } from '@/models/strategy.model';

export const findOneStrategyRepository = async (id: string) => {
  const data = await findOneStrategyGateway(id);
  return new StrategyModel(data);
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

Para aproveitar ao máximo os benefícios e evitar sobrecarga operacional, recomenda-se:

1. **Automatizar a criação de arquivos**

   * Crie uma CLI ou use IA para gerar estruturas completas seguindo os padrões
   * Isso reduz erros manuais e acelera a produção

2. **Enforce com linting e CI**

   * Utilize `ESLint` com regras customizadas
   * Use `husky` ou `lint-staged` para checagens antes do commit

3. **Documentar o propósito de cada camada**

   * Crie `README.md` explicativo dentro de cada pasta raiz

4. **Padronizar revisões com checklist**

   * Verificar se todos os arquivos obrigatórios foram criados (`types.ts`, `index.ts`, `test.ts`, `mock.ts`, etc.)

5. **Promover boas práticas com exemplos**

   * Mantenha um repositório de exemplos como referência viva

---
