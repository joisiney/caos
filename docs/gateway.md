# 📡 Gateway

* Os gateways devem ter prefixo com verbo obrigatório.
* Os verbos permitidos são: `find-one`, `find-many`, `create`, `update`.
* Sempre usar sufixo `gateway.ts`.
* Exemplo de nome válido: `find-one-strategy.gateway.ts`.

## 📄 Exemplo `find-one-strategy.gateway.ts`

```ts
import { httpClient } from './http';
import { TStrategyEntity } from '@/entities/strategy.entity';

export namespace NStrategyGateway {
  export type FindOneInput = {
    id:string
  }
}

export const findOneStrategyGateway = async (id: NStrategyGateway.FindOneInput): Promise<TStrategyEntity> => {
  const { data } = await httpClient.get(`/strategy/${id}`);
  return data;
};
``` 