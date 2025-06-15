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

## 🚫 Code Smells que Não Queremos no Nosso Projeto

Estas são as regras do nosso projeto para manter o código limpo, organizado e fácil de dar manutenção. Evitar esses *code smells* é o nosso compromisso para garantir que o projeto cresça de forma saudável e que todos na equipe consigam trabalhar com prazer. Vamos direto ao ponto:

| Smell                              | Descrição                                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Acesso direto ao DOM**           | Não mexa diretamente no DOM. Use o React (ou o framework que adotamos) para cuidar da interface. Isso mantém tudo consistente. |
| **Classe grande**                  | Classes que fazem de tudo viram um monstro. Divida em classes menores, cada uma com um propósito claro. |
| **Código duplicado**               | Código repetido é um convite pra erros. Extraia o que se repete em funções ou componentes reutilizáveis. |
| **Código morto**                   | Aquele trecho que ninguém usa? Jogue fora. Não precisamos de bagagem extra no projeto. |
| **Comentários explicando código complexo** | Se o código precisa de um parágrafo pra explicar, é hora de simplificar. Código claro não precisa de legenda. |
| **Conjuntos de dados**             | Parâmetros que sempre andam juntos? Junte eles num objeto. Fica mais fácil de entender e usar. |
| **Função longa**                   | Funções que parecem um livro? Divida em pedaços menores. Cada função deve fazer uma coisa só, bem feita. |
| **Funções com muitos parâmetros**  | Função com uma lista enorme de parâmetros é confusa. Agrupe eles num objeto de configuração. |
| **Inveja de funcionalidade**       | Uma classe fuçando muito nos dados de outra? Deixe a outra fazer o trabalho. Cada um no seu quadrado. |
| **Intimidade inadequada**          | Classes que sabem demais sobre as outras criam dependências chatas. Reduza essa proximidade. |
| **Lógica acoplada à UI**           | Lógica de negócio não pertence à camada visual. Coloque ela em arquivos como `use-case.ts`. |
| **Mudança divergente**             | Um módulo que muda por mil motivos diferentes está errado. Separe por responsabilidade. |
| **Mutação de estado direto**       | Não altere o estado diretamente. Use os setters dos hooks ou métodos de gerenciamento de estado. |
| **Nomes genéricos**                | Nomes como `data` ou `info` não dizem nada. Escolha nomes que mostrem exatamente o que a variável faz. |
| **Obsessão por primitivos**        | Usar só strings e números pra tudo? Crie tipos próprios (como models) pra dar mais significado ao código. |
| **Cadeias de mensagens**           | Evite coisas como `obj.a().b().c()`. Isso é frágil. Delegue ou encapsule melhor. |
| **Homem do meio**                  | Classes que só passam recado pra outras não servem pra nada. Corte o intermediário. |
| **Cirurgia de espingarda**         | Uma mudança pequena que te obriga a mexer em mil lugares? Isso é sinal de acoplamento. Refatore. |
| **Generalidade especulativa**      | Não crie código "pra caso um dia precise". Foque no que realmente usamos agora. |
| **Switch ou ifs com muitos casos** | Condicionais gigantes são difíceis de manter. Use mapas de objetos ou funções específicas. |
| **Campo temporário**               | Variáveis que só aparecem em casos muito específicos? Repense se elas pertencem ali. |
| **Método longo**                   | Métodos que vão longe demais precisam ser divididos. Cada método deve ter um foco claro. |
| **Acoplamento excessivo**          | Módulos que dependem demais uns dos outros travam o projeto. Reduza essas amarras. |
| **Falta de testes unitários**      | Sem testes, qualquer mudança é um salto no escuro. Escreva testes pra garantir que tudo funciona. |

**Inspiração**: Essas práticas foram inspiradas pelas ideias do [*Refactoring Guru*](https://refactoring.guru/pt-br/refactoring/smells), que nos guiou para escrever código mais limpo e organizado. Adaptamos tudo para o que funciona melhor no nosso projeto!

## ✅ Boas Práticas que Queremos no Nosso Projeto

Estas são as regras do nosso projeto para garantir que o código seja claro, fácil de manter e um prazer de trabalhar. Adotar essas boas práticas é o nosso jeito de construir algo que a equipe possa se orgulhar. Vamos ao que importa:

| Prática                           | Descrição                                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Retorno antecipado (Early Return)** | Saia de uma função assim que souber o resultado. Evite aninhar condições desnecessariamente. |
| **Nomes descritivos**             | Use nomes que explicam o propósito de variáveis, funções e classes. Nada de `temp` ou `x`. |
| **Funções pequenas e focadas**    | Cada função deve fazer uma coisa só e fazer bem. Se está grande, divida em funções menores. |
| **Encapsulamento de lógica**      | Agrupe lógica relacionada em funções, classes ou módulos. Evite espalhar regras pelo código. |
| **Uso de tipos próprios**         | Crie modelos ou entidades em vez de usar tipos primitivos soltos. Isso dá mais contexto ao código. |
| **Imutabilidade de estado**       | Evite mudar estados diretamente. Use cópias ou setters para manter o controle e evitar surpresas. |
| **Testes unitários completos**    | Escreva testes para cobrir os casos principais. Isso dá confiança pra refatorar sem medo. |
| **Separação de camadas**          | Mantenha lógica de negócio, interface e acesso a dados em camadas separadas. Nada de misturar tudo. |
| **Evitar condicionais complexos** | Substitua *ifs* e *switchs* complicados por mapas, polimorfismo ou funções específicas. |
| **Reutilização de componentes**   | Crie componentes ou funções reutilizáveis para evitar duplicação e facilitar manutenção. |
| **Validação de entrada**          | Sempre valide dados de entrada em funções ou APIs para evitar erros inesperados. |
| **Documentação mínima e clara**   | Documente apenas o que não é óbvio no código. Prefira código autoexplicativo a comentários longos. |
| **Uso de padrões de projeto**     | Aplique padrões como Factory, Strategy ou Observer quando fizerem sentido, mas sem exageros. |
| **Controle de erros robusto**     | Trate erros de forma consistente, com mensagens claras e recuperação quando possível. |
| **Formatação consistente**        | Siga as regras de formatação do projeto (use linters!). Código bem formatado é mais fácil de ler. |
| **Evitar dependências excessivas** | Reduza o acoplamento entre módulos. Injete dependências ou use interfaces para flexibilidade. |
| **Revisão de código regular**     | Faça code reviews em equipe. Um par de olhos extra sempre ajuda a melhorar a qualidade. |
| **Performance consciente**        | Otimize apenas onde necessário, mas sempre pense no impacto de loops ou operações pesadas. |

**Inspiração**: Essas regras foram inspiradas pelas ideias do [*Refactoring Guru*](https://refactoring.guru/pt-br/refactoring/smells), que nos ajudou a pensar em como manter o código mais limpo e organizado. Mas aqui, elas são nossas, adaptadas pro que faz sentido no nosso projeto!

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

