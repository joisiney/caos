# 📘 Khaos CLI (Tartarus)

O nome deste projeto vem da divindade primordial da mitologia grega: **Khaos**, o vazio original, o berço de toda criação. Assim como no mito, aqui também nasce algo do nada — uma arquitetura front-end clara, modular e escalável.

Para invocar **Khaos**, é preciso atravessar as camadas do submundo. É aí que entra o nosso executor abissal: o **Tartarus CLI**.

> 💀 No mito, Tartarus é o abismo mais profundo, abaixo até do Hades.  
> No nosso universo, é o CLI que emerge das profundezas do terminal para invocar o poder criador de Khaos e transformar o vazio do `src/` em ordem arquitetural.

## 🚀 Status da Implementação

### ✅ Funcionalidades Implementadas

- **🔧 `tartarus create <layer>`** - Cria arquivos para qualquer camada da arquitetura
- **📝 `tartarus update <layer>`** - Renomeia arquivos e atualiza dependências
- **🏗 `tartarus init`** - Inicializa projeto com estrutura completa
- **🔍 `tartarus validate`** - Valida estrutura e convenções
- **🤖 Sugestões de nomes** - IA simulada baseada na descrição
- **📦 Templates EJS** - Para geração consistente de código
- **🔄 Commits automáticos** - Com mensagens padronizadas
- **⚙️ Configuração completa** - .tartarusrc.json customizável

### 🎮 Comandos Disponíveis

#### 🏗 Inicializar Projeto
```bash
tartarus init
```
Cria estrutura completa do projeto Khaos com configuração.

#### 🔧 Criar Camadas
```bash
# Todas as camadas suportadas
tartarus create repository    # Camada de dados
tartarus create gateway       # Comunicação com APIs  
tartarus create model         # Modelos de domínio
tartarus create entity        # Tipagens de dados
tartarus create component     # Componentes reutilizáveis
tartarus create feature       # Features da aplicação
tartarus create layout        # Layouts da aplicação
```

**Fluxo universal:**
1. 📝 Descreva o que você quer construir
2. ✏️ Aceite ou modifique o nome sugerido
3. 🎯 Selecione camadas relacionadas (quando aplicável)
4. ✅ Confirme o commit automático

#### 📝 Atualizar Camadas
```bash
tartarus update <layer>
```
Renomeia qualquer camada e atualiza dependências relacionadas.

#### 🔍 Validar Projeto
```bash
tartarus validate
```
Analisa estrutura e convenções do projeto.

## 🛠 Instalação e Uso

### Pré-requisitos
- Node.js 18+
- Git configurado
- Projeto com estrutura `src/` (repositories, gateways, models, entities)

### Instalação Global
```bash
# No diretório do khaos-cli
npm install
npm run build
npm link

# Agora você pode usar em qualquer projeto
tartarus --help
```

### Exemplo de Uso Completo

```bash
# Em um projeto React/React Native com estrutura src/
mkdir -p src/{repositories,gateways,models,entities}
git init

# Criar um repositório de usuários
tartarus create repository
# > Descreva: "gerenciar usuários da aplicação"
# > Nome: user (sugerido)
# > Camadas: [x] gateway [x] model [x] entity
# > Commit: [y] feat: add user repository and related files

# Renomear depois
tartarus update repository  
# > Selecionar: user.repository.ts
# > Novo nome: account
# > Arquivos relacionados: [x] gateway [x] model [x] entity
# > Commit: [y] refactor: rename user to account
```

## 📁 Templates de Todas as Camadas

### 🗂 Repository Template (.ts)
```typescript
import { findOne{Name}Gateway } from '@/gateways/find-one-{name}.gateway';
import { {Name}Model } from '@/models/{name}.model';

export const use{Name}Repository = () => {
  const findOneById = async (id: string) => {
    const data = await findOne{Name}Gateway({ id });
    return new {Name}Model(data);
  };

  return { findOneById };
};
```

### 📡 Gateway Template (.ts)
```typescript
import { httpClient } from './http';
import { T{Name}Entity } from '@/entities/{name}.entity';

export namespace N{Name}Gateway {
  export type FindOneInput = { id: string };
}

export const findOne{Name}Gateway = async ({ id }: N{Name}Gateway.FindOneInput): Promise<T{Name}Entity> => {
  const { data } = await httpClient.get(`/{name}/${id}`);
  return data;
};
```

### 🧬 Model Template (.ts)
```typescript
import { T{Name}Entity } from '@/entities/{name}.entity';

export class {Name}Model {
  constructor(private data: T{Name}Entity) {}
}
```

### 📊 Entity Template (.ts)
```typescript
export type T{Name}Entity = {
  id: string;
  // Adicione outros campos conforme necessário
};
```

### 🧩 Component Template (.tsx)
```tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export interface {Name}ComponentProps {
  children?: React.ReactNode;
  testID?: string;
}

export const {Name}Component: React.FC<{Name}ComponentProps> = ({
  children,
  testID = '{name}-component',
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.title}>{Name} Component</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
});

export default {Name}Component;
```

### 🚀 Feature Template (.tsx)
```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { use{Name}Repository } from '@/repositories/{name}.repository';

export const {Name}Feature: React.FC = () => {
  const {name}Repository = use{Name}Repository();

  const handleAction = async () => {
    // Implementar lógica da feature aqui
  };

  return (
    <View style={styles.container}>
      {/* Implementar UI da feature aqui */}
    </View>
  );
};

export default {Name}Feature;
```

### 🎨 Layout Template (.tsx)
```tsx
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

export interface {Name}LayoutProps {
  children: React.ReactNode;
  testID?: string;
}

export const {Name}Layout: React.FC<{Name}LayoutProps> = ({
  children,
  testID = '{name}-layout',
}) => {
  return (
    <SafeAreaView style={styles.safeArea} testID={testID}>
      <View style={styles.container}>
        {children}
      </View>
    </SafeAreaView>
  );
};

export default {Name}Layout;
```

## 🔮 Próximos Passos (Roadmap)

### 📋 Melhorias Planejadas

- **🤖 Integração com IA** - Substituir sugestões regex por IA (Grok/OpenAI)
- **🏗 Mais Camadas** - Suporte para `layout`, `feature`, `component`
- **🔍 Análise de Código** - Parser AST para atualizações mais inteligentes
- **📏 Validação Avançada** - ESLint rules customizadas
- **📦 NPM Package** - Publicação para instalação via `npm i -g`

### 🎯 Funcionalidades Futuras

```bash
# Comandos Avançados
tartarus migrate <from> <to>         # Migrar entre estruturas
tartarus scaffold <app-name>         # Scaffold app completo
tartarus generate docs              # Gerar documentação automática
tartarus sync                       # Sincronizar dependências
tartarus doctor                     # Diagnóstico completo
tartarus templates list            # Listar templates disponíveis
tartarus templates create          # Criar templates customizados
```

## 🏛 Arquitetura

Essa arquitetura foi inspirada em padrões reconhecidos como a **layered architecture**, aplicando princípios como **SOLID**, **TDD**, **separação de responsabilidades**, e **baixo acoplamento com alta coesão**.

### 📂 Estrutura do Projeto
```
src/
├── commands/           # Comandos do CLI
│   ├── create.ts      # tartarus create
│   └── update.ts      # tartarus update  
├── templates/         # Templates EJS
│   ├── repository.ts.ejs
│   ├── gateway.ts.ejs
│   ├── model.ts.ejs
│   └── entity.ts.ejs
├── utils/            # Utilitários (futuro)
└── index.ts          # Entry point
```

---

## 📋 Menu de Navegação

| 📖 Documentação          | 🔗 Link                                    |
| ------------------------ | ------------------------------------------ |
| 📚 **Arquitetura Khaos** | [README.md](./README.md) ← Você está aqui |
| 🌀 **Tartarus CLI**      | [CLI-README.md](./CLI-README.md)          |
| ✅ **Boas Práticas**     | [docs/boas-praticas.md](./docs/boas-praticas.md) |

---

🎭 **"Do caos nasce a ordem. Do terminal nasce a estrutura."** - Tartarus CLI

