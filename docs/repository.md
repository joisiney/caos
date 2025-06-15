# 🗂 Repository

* Os repositórios implementam os gateways.

* São **hooks** (começam com `use`) e podem orquestrar múltiplos gateways.

* Nunca devem usar os prefixos `find-one`, `find-many`, `create`, `update`.

* Sempre usar sufixo `repository.ts`.

* O nome deve estar em **dash-case**, mas o nome do arquivo é sempre no formato `nome.repository.ts` (ex: `strategy.repository.ts`).

* Exemplo de nome válido: `strategy.repository.ts`.

* Os repositórios implementam os gateways.

* São **hooks** (começam com `use`) e podem orquestrar múltiplos gateways.

* Sempre usar sufixo `repository.ts`.

## 📄 Exemplo `strategy.repository.ts`

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