# Especificação SDD — gerenciador de tarefas

Neste projeto, SDD significa desenvolvimento guiado por especificação: primeiro registramos os comportamentos e critérios de aceite; depois implementamos e verificamos o sistema. Caso o professor use outra definição de SDD, ajuste esta seção com a terminologia da disciplina.

## Objetivo e escopo
Permitir que uma pessoa organize tarefas pessoais no navegador, sem conta e sem servidor de dados. Dados são locais a cada navegador/dispositivo.

## Requisitos e critérios de aceite
| ID | Comportamento | Critério verificável |
|---|---|---|
| RF01 | Cadastrar tarefa | Texto não vazio de até 120 caracteres aparece na lista após clicar Adicionar. |
| RF02 | Concluir/reabrir | Checkbox alterna o estado e atualiza o contador. |
| RF03 | Excluir | Botão Excluir remove apenas a tarefa selecionada. |
| RF04 | Persistir | Após recarregar a página no mesmo navegador, tarefas e estados permanecem. |
| RNF01 | Segurança da interface | Texto digitado aparece como texto, sem executar HTML ou JavaScript. |
| RNF02 | Publicação | Push na main passa por testes e scanner antes de publicar na EC2. |

## Decisões
HTML, CSS e JavaScript sem dependências de produção. localStorage atende ao escopo de demonstração; não há sincronização entre dispositivos. O runner da pipeline fica na EC2 e copia arquivos estáticos servidos pelo Nginx.

## Roteiro de validação manual
1. Cadastre uma tarefa com espaços antes e depois: deve aparecer sem esses espaços.
2. Tente enviar somente espaços: nada deve ser criado.
3. Cadastre duas tarefas; conclua uma; contador deve mostrar 1 de 2.
4. Recarregue a página: estado deve permanecer.
5. Exclua uma tarefa: a outra deve permanecer.
6. Cadastre `<img src=x onerror=alert(1)>`: deve aparecer como texto e nenhum alerta deve executar.
