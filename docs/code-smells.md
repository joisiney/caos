# 🚫 Code Smells que Não Queremos no Nosso Projeto

Estas são as regras do nosso projeto para manter o código limpo, organizado e fácil de dar manutenção. Evitar esses *code smells* é o nosso compromisso para garantir que o projeto cresça de forma saudável e que todos na equipe consigam trabalhar com prazer. Vamos direto ao ponto:

| Smell                              | Descrição                                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Acesso direto ao DOM**           | Não mexa diretamente no DOM. Use o React (ou o framework que adotamos) para cuidar da interface. Isso mantém tudo consistente. |
| **Classe grande**                  | Classes que fazem de tudo viram um monstro. Divida em classes menores, cada uma com um propósito claro. |
| **Código duplicado**               | Código repetido é um convite pra erros. Extraia o que se repete em funções ou componentes reutilizáveis. |
| **Código morto**                   | Aquele trecho que ninguém usa? Jogue fora. Não precisamos de bagagem extra no projeto. |
| **Comentários explicando código complexo** | Se o código precisa de um parágrafo pra explicar, é hora de simplificar. Código claro não precisa de legenda. |
| **Conjuntos de dados**             | Parâmetros que sempre andam juntos? Junte eles num objeto. Fica mais fácil de entender e usar. |
| **Função longa**                   | Funções que parecem um livro? Divida em pedaços menores. Cada função deve fazer uma coisa só, bem feita. |
| **Funções com muitos parâmetros**  | Função com uma lista enorme de parâmetros é confusa. Agrupe eles num objeto de configuração. |
| **Inveja de funcionalidade**       | Uma classe fuçando muito nos dados de outra? Deixe a outra fazer o trabalho. Cada um no seu quadrado. |
| **Intimidade inadequada**          | Classes que sabem demais sobre as outras criam dependências chatas. Reduza essa proximidade. |
| **Lógica acoplada à UI**           | Lógica de negócio não pertence à camada visual. Coloque ela em arquivos como `use-case.ts`. |
| **Mudança divergente**             | Um módulo que muda por mil motivos diferentes está errado. Separe por responsabilidade. |
| **Mutação de estado direto**       | Não altere o estado diretamente. Use os setters dos hooks ou métodos de gerenciamento de estado. |
| **Nomes genéricos**                | Nomes como `data` ou `info` não dizem nada. Escolha nomes que mostrem exatamente o que a variável faz. |
| **Obsessão por primitivos**        | Usar só strings e números pra tudo? Crie tipos próprios (como models) pra dar mais significado ao código. |
| **Cadeias de mensagens**           | Evite coisas como `obj.a().b().c()`. Isso é frágil. Delegue ou encapsule melhor. |
| **Homem do meio**                  | Classes que só passam recado pra outras não servem pra nada. Corte o intermediário. |
| **Cirurgia de espingarda**         | Uma mudança pequena que te obriga a mexer em mil lugares? Isso é sinal de acoplamento. Refatore. |
| **Generalidade especulativa**      | Não crie código "pra caso um dia precise". Foque no que realmente usamos agora. |
| **Switch ou ifs com muitos casos** | Condicionais gigantes são difíceis de manter. Use mapas de objetos ou funções específicas. |
| **Campo temporário**               | Variáveis que só aparecem em casos muito específicos? Repense se elas pertencem ali. |
| **Método longo**                   | Métodos que vão longe demais precisam ser divididos. Cada método deve ter um foco claro. |
| **Acoplamento excessivo**          | Módulos que dependem demais uns dos outros travam o projeto. Reduza essas amarras. |
| **Falta de testes unitários**      | Sem testes, qualquer mudança é um salto no escuro. Escreva testes pra garantir que tudo funciona. |

**Inspiração**: Essas práticas foram inspiradas pelas ideias do [*Refactoring Guru*](https://refactoring.guru/pt-br/refactoring/smells), que nos guiou para escrever código mais limpo e organizado. Adaptamos tudo para o que funciona melhor no nosso projeto! 