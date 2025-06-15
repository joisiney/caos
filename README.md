# 📘 Khaos CLI (Tartarus)

O nome deste projeto vem da divindade primordial da mitologia grega: **Khaos**, o vazio original, o berço de toda criação. Assim como no mito, aqui também nasce algo do nada — uma arquitetura front-end clara, modular e escalável.

Para invocar **Khaos**, é preciso atravessar as camadas do submundo. É aí que entra o nosso executor abissal: o **Tartarus CLI**.

> 💀 No mito, Tartarus é o abismo mais profundo, abaixo até do Hades.  
> No nosso universo, é o CLI que emerge das profundezas do terminal para invocar o poder criador de Khaos e transformar o vazio do `src/` em ordem arquitetural.

## 🚀 Status da Implementação

### ✅ Funcionalidades Implementadas

- **🔧 `tartarus create repository`** - Cria arquivos de repositório com sugestões inteligentes
- **📝 `tartarus update repository`** - Renomeia repositórios e atualiza dependências  
- **🤖 Sugestões de nomes** - Baseado na descrição fornecida
- **📦 Templates EJS** - Para geração consistente de código
- **🔄 Commits automáticos** - Com mensagens padronizadas
- **🎯 Seleção de camadas** - Gateway, Model, Entity opcionais

### 🎮 Comandos Disponíveis

#### Criar Repositório
```bash
tartarus create repository
```

**Fluxo de uso:**
1. Descreva o que você quer construir (ex: "gerenciar usuários")
2. Aceite ou modifique o nome sugerido (ex: "user")
3. Selecione as camadas relacionadas (gateway, model, entity)
4. Confirme o commit automático

**Arquivos gerados:**
- `src/repositories/{nome}.repository.ts`
- `src/gateways/find-one-{nome}.gateway.ts` (opcional)
- `src/models/{nome}.model.ts` (opcional) 
- `src/entities/{nome}.entity.ts` (opcional)

#### Atualizar Repositório
```bash
tartarus update repository
```

**Fluxo de uso:**
1. Selecione o repositório existente
2. Digite o novo nome
3. Escolha quais arquivos relacionados renomear
4. Confirme o commit automático

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

## 📁 Templates Gerado

### Repository Template
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

### Gateway Template
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

## 🔮 Próximos Passos (Roadmap)

### 📋 Melhorias Planejadas

- **🤖 Integração com IA** - Substituir sugestões regex por IA (Grok/OpenAI)
- **🏗 Mais Camadas** - Suporte para `layout`, `feature`, `component`
- **🔍 Análise de Código** - Parser AST para atualizações mais inteligentes
- **📏 Validação Avançada** - ESLint rules customizadas
- **📦 NPM Package** - Publicação para instalação via `npm i -g`

### 🎯 Funcionalidades Futuras

```bash
tartarus create feature auth         # Gerar feature completa
tartarus create component button     # Gerar componente reutilizável  
tartarus migrate repository         # Migrar estrutura antiga
tartarus validate project           # Validar convenções
tartarus generate docs              # Gerar documentação automática
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

