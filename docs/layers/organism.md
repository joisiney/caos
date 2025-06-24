# 🧬 Organismos

Organismos são componentes de UI compostos por **nenhuma, uma ou mais moléculas**, encapsuladas em uma `View`. Eles representam blocos visuais mais complexos e, eventualmente, podem possuir átomos exclusivos, que não são reutilizados em outras partes da aplicação.

> ❗️Todo organismo deve importar obrigatoriamente o arquivo `use-case.ts`, que orquestra sua lógica interna.

---

### 🔹 Estrutura `src/organisms/{name}`

* **Sufixo**: `.organism.tsx`
* **Exemplo**: `profile-header.organism.tsx` com `ProfileHeaderOrganism`
* **Arquivos permitidos**:

  * `index.ts`
  * `{name}.organism.tsx`
  * `{name}.type.ts`
  * `{name}.constant.ts` // Opcional
  * `{name}.variant.ts` // Opcional
  * `{name}.mock.ts` // Opcional
  * `{name}.stories.tsx`
  * `{name}.spec.ts`
  * `{name}.use-case.ts`
  * `_partial/{name}.partial.tsx` // Atomos exclusivos, se necessário
  * `_services/{service-name}.service.ts` // Se necessário

> ✅ Todos os tipos devem estar agrupados na `namespace` no arquivo `.type.ts`, inclusive os dos `_partial`

---

## 📄 Exemplo `index.ts`

```ts
export * from './profile-header.organism';
export * from './profile-header.type';
export * from './profile-header.constant'; // Opcional
export * from './profile-header.mock'; // Opcional
```

> ❌ Nunca exportar `stories.tsx`, `spec.ts`, `variant.ts`, ou arquivos da pasta `_partial`

---

## 📄 Exemplo `_partial/avatar.partial.tsx`

```tsx
import {FC} from 'react';
import {Image, View} from 'react-native';
import type {AvatarProps} from '../profile-header.type';

export const Avatar: FC<AvatarProps> = ({src, size, testID}) => {
  return (
    <View testID={testID}>
      <Image source={{uri: src}} style={{width: size, height: size, borderRadius: size / 2}} />
    </View>
  );
};
```

---

## 📄 Tipagem no `profile-header.type.ts`

```ts
export namespace NProfileHeaderOrganism {
  export type Props = TWithTestID & {
    username: string;
    avatar: string;
  };

  export type AvatarProps = {
    src: string;
    size: number;
    testID?: string;
  };
}
```

---

## 📄 Exemplo `profile-header.organism.tsx`

```tsx
import {FC} from 'react';
import {View} from 'react-native';
import {useUseCase} from './profile-header.use-case';
import {Avatar} from './_partial/avatar.partial';
import {UsernameMolecule} from '@/molecules/username';
import {NProfileHeaderOrganism} from './profile-header.type';

export const ProfileHeaderOrganism: FC<NProfileHeaderOrganism.Props> = ({testID, username, avatar}) => {
  const {} = useUseCase();

  return (
    <View testID={`${testID}-organism`} className="flex-row items-center">
      <Avatar src={avatar} size={40} testID="avatar" />
      <UsernameMolecule testID="username" name={username} />
    </View>
  );
};
```

---

## 📄 Exemplo `profile-header.use-case.ts`

```ts
// Sem service
export const useUseCase = () => {
  return {};
};

// Com service
import {useTrackingService} from './_services/tracking.service';

export const useUseCase = () => {
  const tracking = useTrackingService();

  return {
    tracking
  };
};
```

> ⚠️ Hooks dos `_partial` devem ser orquestrados aqui, não diretamente nos `.partial.tsx`

---

## 📄 Exemplo `profile-header.mock.ts`

```ts
import {faker} from '@faker-js/faker';
import type {NProfileHeaderOrganism} from './profile-header.type';

export const mockProfileHeaderDto = (override?: Partial<NProfileHeaderOrganism.Props>): NProfileHeaderOrganism.Props => ({
  testID: 'profile-header',
  username: faker.internet.userName(),
  avatar: faker.image.avatar(),
  ...override,
});
```

---

## 📄 Exemplo `profile-header.stories.tsx`

```tsx
import {Meta, StoryObj} from '@storybook/react';
import {ProfileHeaderOrganism} from './profile-header.organism';
import {mockProfileHeaderDto} from './profile-header.mock';

const meta: Meta = {
  title: 'Organisms/ProfileHeader',
  component: ProfileHeaderOrganism,
};

export default meta;

export const Default: StoryObj = {
  args: mockProfileHeaderDto(),
};
```

---

## 📄 Exemplo `profile-header.spec.ts`

```ts
import {render, screen} from '@testing-library/react-native';
import {Default} from './profile-header.stories';
import {ProfileHeaderOrganism} from './profile-header.organism';

const HocMount = (props?: Partial<React.ComponentProps<typeof ProfileHeaderOrganism>>): JSX.Element => {
  return <ProfileHeaderOrganism {...Default.args} {...props} />;
};

describe('Organism: <ProfileHeaderOrganism />', () => {
  it('deve renderizar corretamente', () => {
    render(<HocMount />);
    const sut = screen.getByTestId('profile-header-organism');
    expect(sut).toBeTruthy();
  });

  it('não deve renderizar se testID for omitido', () => {
    render(<HocMount testID={undefined} />);
    const sut = screen.queryByTestId('profile-header-organism');
    expect(sut).toBeNull();
  });
});
```

---

## 🔧 CLI Khaos

```bash
khaos create organism
khaos update organism
khaos check organism
khaos delete organism
```

---

### ✨ Criar Organismo

1. Informar o propósito

2. Nome do organismo

3. Selecionar moléculas (ou nenhuma)

4. Adicionar átomos exclusivos dentro de `_partial` (opcional)

5. Selecionar camadas opcionais:

   * `.constant.ts`, `.variant.ts`
   * `.mock.ts` com `Dto`
   * `.stories.tsx` obrigatório se houver mock

6. Estrutura sugerida:

   ```text
   src/organisms/
   ├── profile-header/
   │   ├── index.ts
   │   ├── profile-header.organism.tsx
   │   ├── profile-header.type.ts
   │   ├── profile-header.constant.ts // Opcional
   │   ├── profile-header.variant.ts // Opcional
   │   ├── profile-header.mock.ts // Opcional
   │   ├── profile-header.stories.tsx
   │   ├── profile-header.spec.ts
   │   ├── profile-header.use-case.ts
   │   ├── _partial/
   │   │   └── avatar.partial.tsx
   │   └── _services/
   │       └── tracking.service.ts // Opcional
   ```

---

### 📌 Boas Práticas

* Todos os `_partial` devem ser "burros" (sem lógica).
* Qualquer lógica deve ser centralizada no `use-case`.
* Os tipos de `_partial` devem estar definidos dentro de `type.ts`.
