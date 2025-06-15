# 🧱 Convenções Gerais (Globais)

* Arquivos e pastas devem estar em **dash-case**
* Nenhum nome pode conter **letra maiúscula** ou **caracteres especiais**
* Todos os arquivos `index.ts` servem **exclusivamente para expor elementos reutilizáveis** da camada
  * Nunca implemente lógica ou declare tipos dentro deles
  * Eles funcionam como **interface pública do módulo**
* Tipos globais ficam em `@types/`, com sufixo `.d.ts`, e **não devem ser exportados**
  * O `tsconfig` deve estar configurado para carregá-los automaticamente
* Todos os `Props` devem incluir obrigatoriamente `testID?: string`
* Regras globais aplicam-se a todas as camadas do projeto
