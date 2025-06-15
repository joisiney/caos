# ✅ Boas Práticas que Queremos no Nosso Projeto

Estas são as regras do nosso projeto para garantir que o código seja claro, fácil de manter e um prazer de trabalhar. Adotar essas boas práticas é o nosso jeito de construir algo que a equipe possa se orgulhar. Vamos ao que importa:

| Prática                           | Descrição                                                                                          |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Retorno antecipado (Early Return)** | Saia de uma função assim que souber o resultado. Evite aninhar condições desnecessariamente. |
| **Nomes descritivos**             | Use nomes que explicam o propósito de variáveis, funções e classes. Nada de `temp` ou `x`. |
| **Funções pequenas e focadas**    | Cada função deve fazer uma coisa só e fazer bem. Se está grande, divida em funções menores. |
| **Encapsulamento de lógica**      | Agrupe lógica relacionada em funções, classes ou módulos. Evite espalhar regras pelo código. |
| **Uso de tipos próprios**         | Crie modelos ou entidades em vez de usar tipos primitivos soltos. Isso dá mais contexto ao código. |
| **Imutabilidade de estado**       | Evite mudar estados diretamente. Use cópias ou setters para manter o controle e evitar surpresas. |
| **Testes unitários completos**    | Escreva testes para cobrir os casos principais. Isso dá confiança pra refatorar sem medo. |
| **Separação de camadas**          | Mantenha lógica de negócio, interface e acesso a dados em camadas separadas. Nada de misturar tudo. |
| **Evitar condicionais complexos** | Substitua *ifs* e *switchs* complicados por mapas, polimorfismo ou funções específicas. |
| **Reutilização de componentes**   | Crie componentes ou funções reutilizáveis para evitar duplicação e facilitar manutenção. |
| **Validação de entrada**          | Sempre valide dados de entrada em funções ou APIs para evitar erros inesperados. |
| **Documentação mínima e clara**   | Documente apenas o que não é óbvio no código. Prefira código autoexplicativo a comentários longos. |
| **Uso de padrões de projeto**     | Aplique padrões como Factory, Strategy ou Observer quando fizerem sentido, mas sem exageros. |
| **Controle de erros robusto**     | Trate erros de forma consistente, com mensagens claras e recuperação quando possível. |
| **Formatação consistente**        | Siga as regras de formatação do projeto (use linters!). Código bem formatado é mais fácil de ler. |
| **Evitar dependências excessivas** | Reduza o acoplamento entre módulos. Injete dependências ou use interfaces para flexibilidade. |
| **Revisão de código regular**     | Faça code reviews em equipe. Um par de olhos extra sempre ajuda a melhorar a qualidade. |
| **Performance consciente**        | Otimize apenas onde necessário, mas sempre pense no impacto de loops ou operações pesadas. |

**Inspiração**: Essas regras foram inspiradas pelas ideias do [*Refactoring Guru*](https://refactoring.guru/pt-br/refactoring/smells), que nos ajudou a pensar em como manter o código mais limpo e organizado. Mas aqui, elas são nossas, adaptadas pro que faz sentido no nosso projeto!

Esta arquitetura é altamente indicada para projetos de **médio a grande porte**, com múltiplos módulos, times ou squads. Sua estrutura detalhada promove **consistência, escalabilidade e manutenibilidade** ao longo do tempo. 