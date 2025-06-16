# 🧬 Khaos CLI - WIP

O **Khaos CLI** automatiza a criação de átomos seguindo a arquitetura Khaos, baseado exatamente no documento [`atom.md`](docs/layers/atom.md).

## 🚀 Instalação e Uso

### **Pré-requisitos**
- Node.js 18+
- Yarn (recomendado)

### **Instalação Global**
```bash
yarn install
yarn build
yarn global add file:$(pwd)

# Agora você pode usar em qualquer projeto
khaos --help
```

### **Desinstalação Global**
```bash
yarn global remove khaos-cli
```

## 🎮 Comandos

### **Menu Interativo (Recomendado)**
```bash
khaos create
```

O CLI apresentará um menu com opções:
- 🧬 **Átomo** (Elemento básico e reutilizável)
- 🧪 **Molécula** (Combinação de átomos) - *Em desenvolvimento*
- ❌ **Cancelar**

### **Comando Direto para Átomos**
```bash
khaos atom
```

**Fluxo interativo (5 passos):**
1. **📝 Descrever** → "um botão reutilizável"
2. **✏️ Nome sugerido** → IA sugere `button` (dash-case)
3. **🎯 Selecionar arquivos opcionais** → `constant.ts`, `spec.ts` (type.ts é sempre criado)
4. **📁 Visualizar árvore** → Preview da estrutura
5. **✅ Confirmar e commit** → `feat: add button atom`

## 📁 Estrutura Gerada

```
src/atoms/{name}/
├── index.ts                 (sempre)
├── {name}.atom.tsx          (sempre)
├── {name}.type.ts           (sempre - OBRIGATÓRIO)
├── {name}.constant.ts       (opcional)
└── {name}.spec.ts          (opcional)
```

## 🎯 Exemplos de Uso

### **Exemplo 1: Botão Simples**
```bash
khaos create
# Selecionar: Átomo
# Descrição: "um botão reutilizável"
# Nome: button
# Arquivos opcionais: nenhum (apenas .type.ts obrigatório)
```

**Resultado:**
```
src/atoms/button/
├── index.ts
├── button.atom.tsx
└── button.type.ts
```

### **Exemplo 2: Ícone Completo**
```bash
khaos create
# Selecionar: Átomo
# Descrição: "ícone com variações"
# Nome: icon
# Arquivos opcionais: [x] constant.ts [x] spec.ts
```

**Resultado:**
```
src/atoms/icon/
├── index.ts
├── icon.atom.tsx
├── icon.type.ts
├── icon.constant.ts
└── icon.spec.ts
```

## 🧪 Testando o CLI

### **Pasta Example**
```bash
cd example
khaos create
# Teste aqui sem afetar outros projetos
```

### **Scripts de Teste**
```bash
yarn test:example    # Testar na pasta example
yarn clean:example   # Limpar pasta example
```

## 📄 Templates Baseados no atom.md

Todos os templates seguem **exatamente** os exemplos do [`atom.md`](docs/layers/atom.md):

- ✅ **index.ts** → Exportações centralizadas
- ✅ **{name}.type.ts** → Namespace N{Name}Atom com Props (OBRIGATÓRIO)
- ✅ **{name}.atom.tsx** → Componente React com testID
- ✅ **{name}.constant.ts** → Constantes tipadas (opcional)
- ✅ **{name}.spec.ts** → Testes unitários (opcional)

## 🔧 Desenvolvimento

### **Build Local**
```bash
yarn build    # Compila TypeScript + copia templates
yarn dev      # Desenvolvimento com ts-node
```

### **Estrutura do Projeto**
```
khaos-cli/
├── src/
│   ├── index.ts                 # Entry point + menu interativo
│   ├── commands/
│   │   └── create-atom.ts       # Comando principal
│   └── templates/               # Templates EJS
│       ├── atom-index.ejs
│       ├── atom-type.ejs
│       ├── atom-atom.ejs
│       ├── atom-constant.ejs
│       └── atom-spec.ejs
├── example/                     # Pasta para testes
└── docs/layers/atom.md         # Especificação oficial
```

## ✅ Validação

Todos os arquivos gerados seguem:
- ✅ **Nomenclatura:** dash-case obrigatório
- ✅ **Estrutura:** Pastas `src/atoms/{name}/`
- ✅ **Templates:** Baseados exatamente no atom.md
- ✅ **Imports:** Relativos e corretos
- ✅ **Tipos:** TWithTestID importado do global
- ✅ **Arquivo .type.ts:** Sempre criado (obrigatório)

---

**📋 Baseado na especificação:** [`docs/layers/atom.md`](docs/layers/atom.md)

