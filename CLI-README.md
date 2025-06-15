# 🌀 Tartarus CLI

O **Tartarus CLI** é um gerador de arquivos baseado na arquitetura do projeto **Khaos**. Ele automatiza a criação de componentes, estruturas e arquivos seguindo as convenções rígidas estabelecidas no projeto.

## 📦 Instalação

```bash
npm install
npm run build
# ou para desenvolvimento
npm run dev
```

## 🚀 Uso

### Comando Principal

```bash
# Usando npm
npm run dev generate
# ou
npm run dev g

# Após build
./dist/index.js generate
```

### Comandos Disponíveis

- `generate` ou `g`: Gera componentes e estruturas da arquitetura Khaos
- `create` ou `c`: Alias para o comando generate

## 🎯 Funcionalidades

### ✅ Verificação Automática de Tipos Globais

O CLI **sempre** verifica se existe o arquivo `@types/global.d.ts` e o cria automaticamente se não existir, garantindo que o tipo `TWithTestID` esteja sempre disponível.

### 🧱 Camadas Suportadas

| Camada | Emoji | Descrição | Restrições |
|--------|-------|-----------|------------|
| Molecule | 🧩 | Composições de atoms com lógica local | **Apenas service.ts e constant.ts** |
| Atom | ⚛️ | Elementos básicos reutilizáveis | Todos os opcionais |
| Organism | 🦠 | Composições de moléculas com estrutura semântica | Todos os opcionais |
| Template | 📄 | Layouts de exibição visual | **Apenas partials/** |
| Feature | 🚀 | Funcionalidade completa (precisa especificar módulo) | Todos os opcionais |
| Layout | 🏗️ | Define navegação e módulos | Todos os opcionais |
| Particle | ⚡ | Services, constants, context compartilhados | Todos os opcionais |
| Model | 🏷️ | Classes que encapsulam entidades | Todos os opcionais |
| Entity | 📊 | Tipagens puras de dados | Todos os opcionais |
| Util | 🔧 | Funções utilitárias puras | Todos os opcionais |
| Gateway | 🌐 | Acesso a APIs externas | Todos os opcionais |
| Repository | 📦 | Hook que orquestra múltiplos gateways | Todos os opcionais |

### 📝 Arquivos Gerados

#### Arquivos Obrigatórios
- **Arquivo principal**: `{nome}.{camada}.tsx` ou `.ts`
- **Types**: `{nome}.types.ts` com namespace
- **Teste**: `{nome}.test.ts` com estrutura de teste
- **Index**: `index.ts` para exportação pública

#### Arquivos Opcionais (selecionáveis)
- **use-case.ts**: Lógica de orquestração
- **scheme.ts**: Validações com Zod
- **mock.ts**: Dados de mock para testes
- **context.tsx**: Context API do React
- **constant.ts**: Constantes específicas
- **service.ts**: Serviços auxiliares
- **partials/**: Pasta com componentes parciais

> **⚠️ Restrições por Camada**:
> - **Templates**: Só podem ter `partials/`
> - **Molecules**: Só podem ter `service.ts` e `constant.ts`
> - **Outras camadas**: Podem ter todos os arquivos opcionais

## 🎮 Exemplo de Uso

```bash
$ npm run dev generate

🌀 Bem-vindo ao Tartarus CLI!

? O que você deseja criar? 🧩 Molecule
? Digite o nome do molecule: modal
? Selecione os arquivos opcionais para molecule: service.ts, constant.ts

✅ molecule "modal" gerado com sucesso.
├── modal.molecule.tsx
├── modal.types.ts
├── modal.test.ts
├── index.ts
├── modal.service.ts
└── modal.constant.ts

📁 Localização: /projeto/src/molecules/modal
```

## 🏗️ Estrutura Gerada

### Para Componentes (Atom, Molecule, Organism, Template, Feature, Layout, Particle)

```typescript
// modal.molecule.tsx
import { FC } from 'react';
import { View } from 'react-native';
import { NModalMolecule } from './modal.types';

export const ModalMolecule: FC<NModalMolecule.Props> = ({ testID }) => {
  return (
    <View testID={testID}>
      {/* TODO: Implementar molecule modal */}
    </View>
  );
};
```

```typescript
// modal.types.ts
export namespace NModalMolecule {
  export type Props = TWithTestID;
}
```

### Para Molecules (estrutura restrita)

Molecules têm opções limitadas conforme arquitetura Khaos:

```bash
? O que você deseja criar? 🧩 Molecule
? Digite o nome do molecule: modal
? Selecione os arquivos opcionais para molecule: service.ts, constant.ts

✅ molecule "modal" gerado com sucesso.
├── modal.molecule.tsx
├── modal.types.ts
├── modal.test.ts
├── index.ts
├── modal.service.ts (se selecionado)
└── modal.constant.ts (se selecionado)
```

### Para Templates (estrutura restrita)

Templates têm opções limitadas conforme arquitetura Khaos:

```bash
? O que você deseja criar? 📄 Template
? Digite o nome do template: dashboard
? Selecione os arquivos opcionais para template: pasta partials/

✅ template "dashboard" gerado com sucesso.
├── dashboard.template.tsx
├── dashboard.types.ts
├── dashboard.test.ts
├── index.ts
└── partials/dashboard-header.partial.tsx (se selecionado)
```

### Para Features (com módulo)

As features sempre perguntam o módulo/layout ao qual pertencem:

```bash
? Digite o nome da feature: deposit
? A qual módulo (layout) pertence esta feature? wallet
```

Resultado: `src/features/wallet-deposit/`

### Para Gateways (com verbo obrigatório `find-one`, `find-many`, `create` ou `update`)

```typescript
import { httpClient } from './http';
import { TUserEntity } from '../entities/user.entity';

export const findOneUserGateway = async (id: string): Promise<TUserEntity> => {
  const { data } = await httpClient.get(`/user/${id}`);
  return data;
};
```

## 🔧 Configuração

### Estrutura de Pastas Criadas

```
src/
├── @types/
│   └── global.d.ts ← Criado automaticamente
├── atoms/{nome}/
├── molecules/{nome}/
├── organisms/{nome}/
├── templates/{nome}/
├── features/{modulo|layouts}-{nome}/
├── layouts/{nome}/
├── particles/{nome}/
├── models/
├── entities/
├── utils/
├── gateways/
└── repositories/
```

### Convenções Automáticas

- ✅ **Nomes em dash-case**: `user-profile` → `UserProfileMolecule`
- ✅ **Sufixos obrigatórios**: `.molecule.tsx`, `.atom.tsx`, etc.
- ✅ **Namespaces**: `NUserProfileMolecule`
- ✅ **TestID**: Todos os Props incluem `testID?: string`
- ✅ **Exports**: Index.ts para exposição pública

## 🚨 Validações

- ❌ **Nomes vazios**: Não permite nomes em branco
- ❌ **Caracteres especiais**: Remove automaticamente
- ❌ **Módulo obrigatório**: Features precisam especificar o layout
- ✅ **Kebab-case**: Converte automaticamente para o formato correto

## 📚 Arquitetura Suportada

Este CLI implementa 100% das convenções da arquitetura **Khaos**:

- **SOLID**: Princípios de design aplicados
- **KISS**: Simplicidade mantida
- **YAGNI**: Só gera o que é necessário
- **Separação de responsabilidades**: Cada camada tem seu propósito
- **Nomenclatura consistente**: Convenções rígidas seguidas

## 🔄 Desenvolvimento

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Testar comandos
npm run dev generate
```

## 🎯 Próximos Passos

- [ ] Adicionar template customizáveis
- [ ] Suporte a múltiplos layouts existentes
- [ ] Detecção automática de módulos existentes
- [ ] Integração com linters
- [ ] Testes automatizados do CLI

---

**Tartarus CLI** - Transformando o Khaos em ordem, um componente de cada vez! 🌀 