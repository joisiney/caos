# 🌜 Moléculas

Moléculas são **componentes compostos** por um ou mais átomos, encapsulados em uma `View`, e responsáveis por uma **única responsabilidade visual** ou interação de UI. Elas são reutilizáveis e mantêm uma estrutura clara e escalável.

> ❗️Toda molécula **deve importar ao menos um átomo** e obrigatoriamente importar o arquivo `use-case.ts` que orquestra a lógica.

---

### 🔹 Estrutura `src/molecules/{name}`

* **Sufixo**: `.molecule.tsx`
* **Exemplo**: `button.molecule.tsx` com `ButtonMolecule`
* **Arquivos permitidos**:

  * `index.ts`
  * `{name}.molecule.tsx`
  * `{name}.type.ts`
  * `{name}.constant.ts` // Opcional
  * `{name}.variant.ts` // Opcional
  * `{name}.mock.ts` // Opcional
  * `{name}.stories.tsx`
  * `{name}.spec.ts`
  * `{name}.use-case.ts`
  * `_services/{service-name}.service.ts` // Se necessário

> ✅ Todos os tipos devem estar agrupados na `namespace` no arquivo `.type.ts`

---

## 📄 Exemplo `index.ts`

```ts
export * from './button.molecule';
export * from './button.type';
export * from './button.constant'; // Opcional
export * from './button.mock'; // Opcional
```

>  ❌ Nunca exportar `stories.tsx`, `spec.ts` ou `variant.ts`

---

## 📄 Exemplo `button.type.ts`

```ts
import type {VariantProps} from 'class-variance-authority';
import {buttonVariant} from './button.variant'; // Opcional

export namespace NButtonMolecule {
  export type Dto = {
    id: string;
    label: string;
    intent: 'primary' | 'secondary';
  };

  export type Props = TWithTestID & VariantProps<typeof buttonVariant>; // Opcional

  export type ButtonType = keyof typeof BUTTON; // Opcional
}
```

---

## 📄 Exemplo `button.constant.ts` // Opcional

```ts
export const BUTTON = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
} as const;
```

> ✅ Use `as const`, prefira nomes UPPER\_CASE, e exporte objetos nomeados.

---

## 📄 Exemplo `button.variant.ts` // Opcional

```ts
import {cva} from 'class-variance-authority';

export const buttonVariant = cva(
  'px-4 py-2 text-sm rounded',
  {
    variants: {
      intent: {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-black',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  }
);
```

> ❌ Nunca exportar `variant.ts` no `index.ts`

---

## 📄 Exemplo `button.molecule.tsx`

```ts
import {FC} from 'react';
import {View} from 'react-native';
import {NButtonMolecule} from './button.type';
import {buttonVariant} from './button.variant'; // Opcional
import {useUseCase} from './button.use-case';
import {ButtonAtom} from '@/atoms/button';

export const ButtonMolecule: FC<NButtonMolecule.Props> = ({testID, intent, size}) => {
  const {} = useUseCase();

  return (
    <View testID={`${testID}-molecule`} className={buttonVariant({intent, size})}>
      <ButtonAtom testID={testID} intent={intent} size={size} />
    </View>
  );
};
```

---

## 📄 Exemplo `button.use-case.ts`

```ts
// Sem service
export const useUseCase = () => {
  return {};
};

// Com service
import {useAnimationService} from './_services/animation.service';

export const useUseCase = () => {
  const animation = useAnimationService();

  return {
    animation
  };
};
```

> ⚠️ Os services devem ficar em `_services/*` e nunca devem ser importados diretamente no `button.molecule.tsx`

---

## 📄 Exemplo `button.mock.ts` // Opcional

```ts
import {faker} from '@faker-js/faker';
import type {NButtonMolecule} from './button.type';

export const mockButtonDto = (override?: Partial<NButtonMolecule.Dto>): NButtonMolecule.Dto => ({
  id: faker.string.uuid(),
  label: faker.lorem.word(),
  intent: 'primary',
  ...override,
});

export const mockButtonDtos = (
  count = 3,
  override?: Partial<NButtonMolecule.Dto>
): NButtonMolecule.Dto[] => Array.from({length: count}, () => mockButtonDto(override));

export const mockButtonSectionDtos = (
  count = 2,
  override?: Partial<NButtonMolecule.Dto>
): {title: string; date: Date; data: NButtonMolecule.Dto[]}[] =>
  Array.from({length: count}, (_, index) => ({
    title: `Seção ${index + 1}`,
    date: new Date(),
    data: mockButtonDtos(3, override),
  }));
```

---

## 📄 Exemplo `button.stories.tsx`

```tsx
import {Meta, StoryObj} from '@storybook/react';
import {ButtonMolecule} from './button.molecule';
import {mockButtonDto} from './button.mock';

const meta: Meta = {
  title: 'Molecules/Button',
  component: ButtonMolecule,
};

export default meta;

export const Default: StoryObj = {
  args: mockButtonDto(),
};
```

> ✅ Toda story deve usar os mocks como base para seus `args`
> ❌ Nunca exportar `stories.tsx` no `index.ts`

---

## 📄 Exemplo `button.spec.ts`

```ts
import {render, screen} from '@testing-library/react-native';
import {ButtonMolecule} from './button.molecule';
import {Default} from './button.stories';

const HocMount = (props?: Partial<React.ComponentProps<typeof ButtonMolecule>>): JSX.Element => {
  return <ButtonMolecule testID="button-molecule" {...Default.args} {...props} />;
};

describe('Molecule: <ButtonMolecule />', () => {
  it('deve renderizar corretamente', () => {
    render(<HocMount />);
    const sut = screen.getByTestId('button-molecule');
    expect(sut).toBeTruthy();
  });

  it('não deve renderizar corretamente se testID for omitido', () => {
    render(<HocMount testID={undefined} />);
    const sut = screen.queryByTestId('button-molecule');
    expect(sut).toBeNull();
  });
});
```

> ✅ Testes unitários são **obrigatórios**
> ✅ Deve conter **teste positivo e negativo**
> ✅ O componente precisa ter um `testID`
> ✅ **Testes devem utilizar a story como fonte de verdade**
> ✅ O `mock` é utilizado pela `story`, e a `story` é reutilizada pelo teste

---

## 🔧 CLI Khaos

```bash
khaos create molecule
khaos update molecule
khaos check molecule
khaos delete molecule
```

---

### ✨ Criar Molécula

1. Informar o propósito
2. Nome da molécula
3. Selecionar **átomos necessários**
4. Selecionar camadas opcionais:

   * `.constant.ts` // Opcional
   * `.variant.ts` // Opcional
   * `.mock.ts` com ou sem `Dtos` e `SectionDtos` // Opcional
   * `.stories.tsx` obrigatório se houver mock
5. Estrutura sugerida:

   ```text
   src/molecules/
   ├── button/
   │   ├── index.ts
   │   ├── button.molecule.tsx
   │   ├── button.type.ts
   │   ├── button.constant.ts // Opcional
   │   ├── button.variant.ts // Opcional
   │   ├── button.mock.ts // Opcional
   │   ├── button.stories.tsx
   │   ├── button.spec.ts
   │   ├── button.use-case.ts
   │   └── _services/
   │       └── animation.service.ts // Opcional
   ```
6. Commit automático:

   ```bash
   ✨ feat(molecule): estrutura base de `button` (wip)
   ```

---

### ♻️ Atualizar Molécula

```bash
♻️ refactor(molecule): renomear `button` para `icon-button`
```

---

### ✅ Validar Molécula

```bash
khaos check molecule
```

---

### 🚨 Remover Molécula

```bash
🚨 chore(molecule): remover molécula `button`
```

---

## 📚 Boas Práticas

* [Convenções Gerais](../general-conventions.md)
* [Validação Hermes](../validator.md)
* [Estrutura do Projeto](../project-structure.md)
* [Code Smells](../code-smells.md)
* [Início Rápido](../quick-start.md)

---

## ➡️ Próxima Camada

* [Organismo](./organism.md)
