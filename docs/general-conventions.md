# 🧱 Convenções Gerais (Globais)

- Arquivos e pastas devem estar em **dash-case**.
- Nenhum nome pode conter **letras maiúsculas** ou **caracteres especiais**.
- Arquivos com extensão `*.tsx` devem usar o padrão de conteúdo **UpperCamelCase**, ex.: `UserAtom`.
- Arquivos com extensão `*.ts` devem usar o padrão de conteúdo **camelCase**, ex.: `userConstant`.
- Nunca utilize `export default`.
- É obrigatório utilizar **Tailwind CSS** para estilização.
- É obrigatório utilizar **Zod** como biblioteca padrão para validação de esquemas.
- É obrigatório utilizar **react-hook-form** para gerenciamento de formulários em componentes React.
- Evite exportar funções declaradas; priorize **arrow functions**.
- Todos os arquivos `index.ts` servem **exclusivamente para expor elementos reutilizáveis** da camada:
  - Nunca implemente lógica ou declare tipos dentro deles.
  - Eles funcionam como **interface pública do módulo**.
- Tipos globais devem ser definidos em `@types/`, com sufixo `.d.ts`, e **não devem ser exportados**:
  - O `tsconfig.json` deve estar configurado para carregá-los automaticamente.
- Todos os `Props` de componentes devem incluir obrigatoriamente `testID?: string`.
- Estas regras globais aplicam-se a todas as camadas do projeto.

### Validação
- O CLI usa **ESLint** para garantir:
  - Nomenclatura correta (dash-case, UpperCamelCase).
  - Presença de `testID?: string` em `Props`.
  - Uso de **Tailwind CSS** e **Zod** (quando aplicável).
- Commits seguem o padrão **Conventional Commits**:
  - Criação: `feat: add <name> atom`
  - Atualização: `refactor: rename <old-name> to <new-name>`
  - Remoção: `chore: remove <name> atom`