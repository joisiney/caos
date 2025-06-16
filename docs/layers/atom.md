# 🧬 Átomos

Átomos são os **menores blocos de construção da interface** do usuário, projetados para serem **reutilizáveis**, **simples** e **independentes**. Eles representam elementos básicos, como botões, ícones, inputs ou divisores, sem lógica complexa ou dependências externas.

### 🔹 `src/atoms/*`

- **Descrição**: Elementos básicos e reutilizáveis da interface.
- **Sufixo**: `.atom.tsx`
- **Exemplo**: `button.atom.tsx` com `ButtonAtom`
- **Arquivos Permitidos**:
  - `index.ts`
  - `{name}.atom.tsx`
  - `{name}.spec.ts`
  - `{name}.type.ts`
  - `{name}.constant.ts` (opcional, para constantes)
* **📌 Observação**:
  - *index.ts:* deve exportar `{name}.atom.tsx`, `{name}.type.ts`, `{name}.constant.ts` (opcional)
  - *.type.ts:* deve exportar `Props` e se tiver constants deve exportar as `{NAME}`
  

## 📄 Exemplo `src/atoms/{name}/index.ts`

```ts
export * from "./{name}.type";
export type {N{Name}Atom} from "./{name}.type";
export * from "./{name}.constant";
``` 

## 📄 Exemplo `src/atoms/{name}/{name}.type.ts`

```ts
import {{NAME}} from './{name}.constant';

export namespace N{Name}Atom {
  export type Props = TWithTestID;
  export type {Name}Type = keyof typeof {NAME};
}
``` 

## 📄 Exemplo `src/atoms/{name}.constant.ts`

```ts
export const {NAME} = {NAME:'NAME'} as const;
``` 

## 📄 Exemplo `src/atoms/{name}.atom.tsx`

```ts
import {FC, PropsWithChildren} from 'react';
import {View} from 'react-native';
import {{N{Name}Atom}} from './{name}.type';

export const {Name}Atom: FC<N{Name}Atom.Props> = ({testID}) => {
    return (
        <View
            testID={`${testID}-atom`}
            className="w-10 h-10 bg-purple-400"
        />
    );
};
``` 

## 🔧 CLI Khaos

O CLI **Khaos** automatiza a criação, atualização e remoção de átomos com os comandos `create atom`, `update atom` e `delete atom`. Ele segue as convenções do projeto, valida nomenclaturas (dash-case, testID) e realiza commits automáticos no padrão **Conventional Commits**.

### Comandos
```bash
khaos create atom
khaos update atom
khaos delete atom
```

### Fluxo: Criar Átomo
1. **Descrever o átomo**: Informe o propósito (ex.: "um botão reutilizável").
2. **Aceitar ou modificar nome**: A IA sugere um nome em dash-case (ex.: `button`). O usuário pode aceitar ou alterar (ex.: `icon-button`).
3. **Selecionar camadas**: Escolha arquivos relacionados (ex.: `button.type.ts`, `button.constant.ts`).
4. **Visualizar árvore de arquivos**:
   ```
   src/atoms/
   ├── button/
   │   ├── index.ts
   │   ├── button.atom.tsx
   │   ├── button.type.ts
   │   └── button.constant.ts
   ```
5. **Confirmar e commit**: Confirme a criação e realize um commit automático (ex.: `feat: add button atom`).

### Fluxo: Atualizar Átomo
1. **Listar átomos**: Selecione um átomo existente (ex.: `button.atom.tsx`).
2. **Informar novo nome**: Digite o novo nome (ex.: `icon-button`).
3. **Visualizar árvore de arquivos**:
   ```
   src/atoms/
   ├── button/
   │   ├── index.ts
   │   ├── button.atom.tsx
   │   ├── button.type.ts
   │   └── button.constant.ts
   ```
5. **Confirmar e commit**: Confirme a atualização e realize um commit (ex.: `refactor: rename button to icon-button`).

### Fluxo: Remover Átomo
1. **Listar átomos**: Selecione um átomo para remover (ex.: `button.atom.tsx`).
2. **Visualizar árvore de arquivos**:
   ```
   src/atoms/
   ├── button/
   │   ├── index.ts
   │   ├── button.atom.tsx
   │   ├── button.type.ts
   │   └── button.constant.ts
   ```
3. **Confirmar e commit**: Confirme a remoção e realize um commit (ex.: `chore: remove button atom`).

#### Fluxo: Validação
1. **Executar comando**:
   ```bash
   khaos hermes atom
   ```
2. **Listar átomos**: O CLI escaneia `src/atoms/*` e identifica todos os átomos (ex.: `button`, `icon`).
3. **Validar estrutura**:
   - Verifica cada átomo contra as regras acima.
   - Usa **ESLint** para validações de código (ex.: nomenclatura, exportações).
4. **Exibir relatório**:
   ```
   Validação de Átomos:
   - button: ✅ Válido
   - icon: ❌ Erro: Falta testID em icon.type.ts
   - divider: ❌ Erro: index.ts contém lógica
   Resumo: 1/3 átomos válidos
   ```

## 📚 Boas Práticas
- [Convenções Gerais](../general-conventions.md)
- [Validar estrutura](../validator.md)
- [Estrutura do Projeto](../project-structure.md)
- [Convenções de Parceiros](../partner-principles.md)
- [Boas Práticas](../good-practices.md)
- [Code Smells](../code-smells.md)
- [Recomendação Final](../final-recommendation.md)
- [Início Rápido](../quick-start.md)

## ➡️ Próxima Camada
- [Moléculas](./molecule.md)