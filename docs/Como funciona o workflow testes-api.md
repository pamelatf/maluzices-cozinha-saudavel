# Como funciona o workflow de testes

Documento de apoio do arquivo `.github/workflows/testes-api.yml`, do repositório
`cozinha-tests`.


## A ideia em uma imagem

A cada pull request, o GitHub **monta uma cozinha nova, do zero, vazia**.

Bancada limpa, nenhum ingrediente, nenhum aparelho ligado. O workflow é a receita
colada na parede dessa cozinha. Ela diz o que trazer, em que ordem preparar e o
que guardar no final. Quando termina, a cozinha inteira é jogada fora. Na próxima
vez, tudo começa vazio de novo.

Esse "começa vazio" é o ponto mais importante. É o que torna o resultado
confiável: nenhum teste passa por acidente porque sobrou alguma coisa da execução
anterior.


## Onde isso acontece

Não é no seu computador.

O workflow roda em um servidor da Microsoft, alugado pelo GitHub, que existe por
alguns minutos e depois é destruído. Sua máquina pode estar desligada. A sua API
local pode estar parada. Não muda nada.

O que confunde é o endereço `localhost:2000` que aparece na configuração.
`localhost` não é um lugar fixo no mundo: quer dizer "aqui mesmo, nesta máquina".
No seu computador, é o seu computador. Naquele servidor, é aquele servidor. É como
a palavra "aqui", que depende de quem fala.

Por isso o workflow tem um passo que **liga a própria cópia da API**. Ele não
procura a sua, ele baixa o código e sobe uma nova ali dentro.


## Dois mundos que nunca se tocam

| | Na sua máquina | No GitHub |
|---|---|---|
| Configuração | arquivo `.env` que você criou | variáveis e secrets do repositório |
| Banco | o MySQL que você instalou | um MySQL vazio criado na hora |
| API | você liga na mão | o workflow liga sozinho |
| O que sobra depois | tudo | nada |

O que liga os dois mundos é só o código que você empurra. Foi assim que o CI
descobriu que a API publicada respondia diferente do que a suíte esperava.


## Quando ele roda

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [main]
  workflow_dispatch:
```

Três momentos automáticos: quando um pull request é aberto, quando você empurra um
commit novo dentro de um pull request já aberto, e quando alguém reabre um que
tinha sido fechado. Sempre que o destino for a branch `main`.

O `workflow_dispatch` é o botão manual, na aba Actions. Sem ele, a única forma de
testar o workflow seria abrindo um pull request de verdade.


## As três regras gerais

**Não fazer trabalho jogado fora.**

```yaml
concurrency:
  cancel-in-progress: true
```

Se você empurrar dois commits com um minuto de diferença, a execução antiga é
cancelada. O resultado dela já não interessa. É como cancelar um pedido que ainda
não saiu da cozinha quando o cliente muda de ideia.

**Pedir só o acesso necessário.**

```yaml
permissions:
  contents: read
```

Todo workflow recebe um crachá automático. Essa linha diz que o crachá só abre a
porta da leitura. Se um dia alguém conseguir injetar um comando malicioso ali, o
estrago fica limitado ao que o crachá permite.

**Ter hora para acabar.**

```yaml
timeout-minutes: 15
```

Se algo travar, o job é interrompido em quinze minutos em vez de ficar rodando e
consumindo cota.


## Os 16 passos, em cinco blocos

### Bloco 1: trazer os ingredientes (passos 1 a 3)

Baixa o `cozinha-tests` para uma pasta chamada `testes`. Baixa o
`maluzices-cozinha-saudavel` para uma pasta chamada `api`. Instala o Node.

Os dois repositórios ficam lado a lado na mesma máquina. O da API é privado, então
esse passo usa um token de leitura guardado nos secrets.

### Bloco 2: preparar a API (passos 4 a 7)

Instala as dependências, cria o arquivo `.env`, compila e prepara o banco.

Três detalhes que custaram uma execução cada até serem descobertos:

- Quase todos os scripts da API usam `--env-file=.env`, e o Node derruba o
  processo se esse arquivo não existir. Como o `.env` de verdade não vai para o
  repositório, o workflow **monta um descartável** na hora, com os valores daquele
  ambiente. O arquivo continua fora do Git, como deve ser.
- O comando `start` aponta para `dist/server.js`, que só existe depois do
  TypeScript ser compilado. Por isso o `npm run build` antes.
- Existem **dois** seeds, e eles fazem coisas diferentes: `db:seed` cria os
  pedidos, `seed` cria a usuária de teste. Rodando só o primeiro, o banco fica sem
  usuária e todos os testes de login falham com 401 sem motivo aparente. Um banco
  preenchido pela metade engana mais que um banco vazio.

### Bloco 3: ligar e esperar (passos 8 e 9)

```
nohup npm start > ../api.log 2>&1 &
```

Cada pedaço:

- `npm start` sobe a API.
- O `&` no fim manda ela para segundo plano, para o workflow poder seguir. Sem
  isso, ele ficaria parado esperando a API terminar, e API não termina.
- `> ../api.log 2>&1` desvia tudo que a API escreveria na tela para um arquivo.
- `nohup` evita que ela seja desligada quando o passo acaba.

Depois vem a espera. Ligar não é instantâneo, e se os testes começarem antes, todos
falham por conexão recusada, com uma mensagem que não deixa claro que o problema
foi pressa.

O passo tenta trinta vezes, com dois segundos entre uma e outra, chamando o
`/health` e perguntando "você está de pé?". Assim que a API responder, ele segue
na hora. Se em sessenta segundos ela não responder, ele imprime o log e para.

Repare no que aconteceu aqui: **o endpoint que você estava testando virou a
ferramenta que garante que os testes começam na hora certa.** É para isso que um
endpoint de saúde existe.

E note por que isso é melhor que um `sleep 30` fixo: se a API subir em quatro
segundos, o passo segue em quatro segundos.

### Bloco 4: rodar os testes (passos 10 a 14)

Aqui o `mocha` roda duas vezes, e a razão é interessante.

```yaml
npm test -- --grep "CRIT-34.2" --invert     # todos, menos um
docker stop ...                             # derruba o banco
npm test -- --grep "CRIT-34.2"              # só aquele um
docker start ...                            # levanta de novo
```

O CRIT-34.2 verifica que a API responde 503 quando o banco não responde. Ele não
pode rodar junto com os outros: naquele momento o banco está saudável, e a API
responde 200, que é o certo. O teste falharia por falta da condição que ele testa.

A solução é **provocar a falha de propósito**. O banco é um contêiner Docker que o
próprio GitHub subiu, e o job tem acesso ao Docker, então dá para pará-lo por
comando. É o equivalente exato de parar o serviço do MySQL no Windows, só que
automatizado.

O `--invert` inverte o filtro do `--grep`: "rode todos os que **não** casam com
esse texto".

### Bloco 5: guardar as evidências (passos 15 e 16)

Anexam o relatório do mochawesome e o log da API ao resultado da execução, para
download depois.

```yaml
if: always()
```

Essa linha significa "faça isso aconteça o que acontecer". Sem ela, um passo só
roda quando tudo antes dele deu certo, e você perderia o relatório justamente
quando algum teste quebrou, que é quando ele importa.

Como o `mocha` roda duas vezes, cada execução grava com um nome próprio,
`suite.html` e `banco-indisponivel.html`. Sem isso a segunda apagaria a primeira.


## Por que o workflow está vermelho hoje

Oito testes falham, todos com a mesma mensagem:

```
AssertionError: expected 401 to equal 404
```

Não é defeito da suíte nem do workflow. É um achado real, e os testes estão
fazendo o trabalho deles.

O que acontece: um POST em `/health` entra no roteador de saúde, não encontra POST
registrado ali, e **segue adiante** em vez de parar. O próximo da fila é o
middleware de autenticação, que barra por falta de credencial. O tratador de rota
inexistente fica depois dele e nunca é alcançado.

```javascript
app.use('/health', rotasHealth);   // aqui só existe GET
app.use(autenticacao);             // barra o que passou direto
app.use(rotasPedidos);
app.use(rotaNaoEncontrada);        // nunca alcançado por esses casos
```

O resultado é uma API que responde sobre credencial numa pergunta que era sobre
recurso. O comportamento esperado seria 405, que quer dizer "este endereço existe,
mas não aceita essa ação".

A decisão tomada: **não corrigir agora, registrar como bug.** Quem testa reporta,
quem desenvolve corrige. Os testes ficam falhando porque o defeito existe.

Consequência a ter em mente: enquanto isso durar, esse check não deve ser marcado
como obrigatório em Settings, Branches. Um check sempre vermelho não serve como
portão, porque uma quebra nova passaria despercebida no meio do vermelho de
sempre.


## Como ler uma execução que falhou

1. Abra a aba **Actions** e clique na execução.
2. Clique no nome do job. Os passos aparecem em lista, com sinal verde nos que
   passaram e vermelho no que parou.
3. Clique no passo vermelho para abrir a saída dele.
4. Procure a linha que começa com `##[error]`. É a mensagem que derrubou o passo.
5. Se o passo foi o de subir a API, o log dela vem impresso logo abaixo, no
   `cat api.log`.
6. Para o relatório completo dos testes, desça até o fim da página da execução, na
   seção **Artifacts**, e baixe o `relatorio-mochawesome`.

Uma coisa que ajuda a não se assustar: o log é imenso e a maior parte dele é o
GitHub narrando o que está fazendo. O que interessa são as linhas de `##[error]`,
as de `##[warning]` e a saída do `mocha`.


## O que ainda falta

- Registrar os achados como issues, com passos para reproduzir e referência ao ID
  da matriz.
- Escrever as suítes dos demais endpoints, começando pelo login.
- Depois que os achados forem corrigidos, marcar este check como obrigatório em
  Settings, Branches, para que um pull request com teste quebrado fique bloqueado.
- Fazer o repositório da API avisar o de testes quando mudar, com o gatilho
  `repository_dispatch`. Hoje só um pull request no `cozinha-tests` dispara o
  workflow.
