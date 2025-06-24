# 🧾 Templates

Templates são componentes **visuais, burros e estruturais**, usados para montar a **estrutura de uma página**. Eles **não contêm lógica de negócio**, não usam hooks, nem recebem `ReactNode` — com exceção do padrão **composition root**, que é permitido em casos específicos.

---

## 🧱 Quando usar composition root?

O padrão **composition root** é permitido quando o template representa uma **página completa** que contém **seções com muitas atualizações** (ex: WebSocket, polling, recálculo constante).

Nesse caso, o template:

* Usa `children` como slot;
* Exporta suas `partials` para uso externo;
* Minimiza o re-render do componente pai;
* Mantém a estrutura limpa, previsível e rastreável.

---

### 🔹 Estrutura `src/templates/{name}`

* **Sufixo**: `.template.tsx`
* **Exemplo**: `dashboard.template.tsx` com `DashboardTemplate`
* **Arquivos permitidos**:

  * `index.ts`
  * `{name}.template.tsx`
  * `{name}.types.ts`
  * `_partials/{name}.partial.tsx` // Opcional

> ✅ Os tipos devem estar agrupados na `namespace` no arquivo `.types.ts`
> ❌ Nunca utilizar hooks, lógica de negócio ou ReactNode fora de `children`

---

## 📁 Estrutura sugerida

```text
src/templates/
├── dashboard/
│   ├── index.ts
│   ├── dashboard.template.tsx
│   ├── dashboard.types.ts
│   └── _partials/
│       ├── stats.partial.tsx
│       └── footer.partial.tsx
```

---

## 📄 Exemplo `dashboard.types.ts`

```ts
export namespace NDashboardTemplate {
  export type Props = TWithTestID & {
    title: string;
  };
}
```

---

## 📄 Exemplo `dashboard.template.tsx`

```tsx
import {FC, PropsWithChildren} from 'react';
import {Text, View} from 'react-native';
import type {NDashboardTemplate} from './dashboard.types';

export const DashboardTemplate: FC<PropsWithChildren<NDashboardTemplate.Props>> = ({
  testID,
  title,
  children,
}) => {
  return (
    <View testID={testID} className="p-4 gap-4">
      <Text className="text-xl font-bold">{title}</Text>
      {children}
    </View>
  );
};
```

---

## 📁 Exemplo `stats.partial.tsx`

```tsx
import {FC} from 'react';
import {Text, View} from 'react-native';

export const StatsPartial: FC = () => {
  return (
    <View>
      <Text>Estatísticas</Text>
    </View>
  );
};
```

---

## 📁 Exemplo `footer.partial.tsx`

```tsx
import {FC} from 'react';
import {Text, View} from 'react-native';

export const FooterPartial: FC = () => {
  return (
    <View>
      <Text>Rodapé</Text>
    </View>
  );
};
```

---

## 📄 Exemplo `index.ts` com composition root

```ts
import {DashboardTemplate as Root} from './dashboard.template';
import {StatsPartial} from './_partials/stats.partial';
import {FooterPartial} from './_partials/footer.partial';

export const DashboardTemplate = {
  Root,
  StatsPartial,
  FooterPartial,
};
```

---

## 📄 Exemplo de uso

```tsx
import {DashboardTemplate} from '@/templates/dashboard';

export const Feature = () => {
  return (
    <DashboardTemplate.Root testID="dashboard" title="Painel Principal">
      <DashboardTemplate.StatsPartial />
      <DashboardTemplate.FooterPartial />
    </DashboardTemplate.Root>
  );
};
```

---

## 🔧 CLI Khaos

```bash
khaos create template
khaos check template
khaos delete template
```

---

### ✨ Criar Template

1. Informar o nome do template
2. Definir os dados primitivos obrigatórios
3. (Opcional) Adicionar composição com `children` e `_partials`
4. Estrutura sugerida:

```text
src/templates/
├── {name}/
│   ├── index.ts
│   ├── {name}.template.tsx
│   ├── {name}.types.ts
│   └── _partials/ (opcional)
```

---

### ✅ Commit automático

```bash
✨ feat(template): estrutura base de `dashboard` com partials (wip)
```

---

### 🔍 Validar Template

```bash
khaos check template
```

Exemplo de saída:

```text
Check dos Templates:
- dashboard: ✅ Válido
- home: ❌ Erro: Props usa ReactNode sem ser children
- reports: ❌ Erro: Template com hook useEffect
Resumo: 1/3 templates válidos
```

---

### 🗑️ Remover Template

```bash
🗑️ chore(template): remover template `dashboard`
```

---

## 📚 Boas Práticas

✅ **Pode:**

* Receber apenas tipos primitivos (string, number, boolean, array, object)
* Usar `children` apenas em composition root
* Incluir `_partials/` para otimizar renderizações pesadas
* Aplicar lógica **visual leve** (ex: `if`, `&&`, `?.`, `map()`)
* **Fazer composition root** quando necessário

❌ **Não pode:**

* Usar `ReactNode` como prop (exceto `children`)
* Incluir qualquer `hook` (`useEffect`, `useMemo`, etc)
* Renderizar lógica de negócio
* Exportar `variant.ts`, `mock.ts`, `spec.ts` ou `stories.tsx`

## 🔗 Dependências Corretas

**Templates podem importar de:**
- Atoms, Molecules, Organisms (**não Features**)
- Utils

**Templates NÃO podem importar:**
- Features (isso criaria dependência circular)
- Gateways, Repositories, Models, Entities diretamente

---

## ➡️ Próxima Camada

* [Features](../features/feature.md)
