# API de Pedidos da Cozinha de Comida Saudável

API REST em Node.js com TypeScript, e a suíte de testes de API que a valida,
no mesmo repositório. Os testes são escritos em Mocha, Chai e Supertest, e os
cenários vêm da análise do contrato OpenAPI (`openapi.yaml`) pela heurística
VADER.

O projeto vai além do caminho feliz: cobre validação de contrato, regras de
negócio, autenticação e autorização, verbos não documentados e cenários de
segurança, com cada caso rastreável até uma linha da matriz de testes.

## Sobre o projeto

A aplicação controla os pedidos de uma cozinha de comida saudável. Uma
atendente registra o pedido de um cliente e acompanha o preparo até a entrega,
passando pelos status `RECEBIDO`, `EM_PREPARO`, `PRONTO` e `ENTREGUE`, com
`CANCELADO` disponível a qualquer momento antes da entrega.

São sete endpoints: criar pedido, listar pedidos com filtro por status, buscar
um pedido, avançar ou retroceder o status, cancelar, ver o resumo de contagem
por status e o health check.

Diferente de uma suíte que aponta para uma API de terceiros, aqui a aplicação
e os testes moram juntos. A consequência prática é que o mesmo pull request
carrega a mudança e a evidência de que ela não quebrou nada, e a integração
contínua sobe o ambiente inteiro do zero a cada execução.

O escopo de teste está especificado em `docs/matriz_vader_cozinha_v3.0.csv`:
96 casos priorizados para esta entrega, mais 30 registrados em
`docs/backlog_pos_entrega.csv` para depois dela. Cada caso tem identificador
próprio, critério de aceite, comando de execução e uma issue correspondente no
repositório.

Estado atual da automação:

| Grupo | Endpoint | Arquivo | Casos especificados | Com teste escrito |
|---|---|---|---|---|
| AUTH | `/auth/login` | `test/auth.login.test.js` | 13 | 11 |
| PEDIDOS | `/pedidos` | `test/pedidos.test.js` | 32 | 0 |
| PEDIDO-ID | `/pedidos/{id}` | `test/pedidos.id.test.js` | 19 | 0 |
| RESUMO | `/pedidos/resumo` | `test/pedidos.resumo.test.js` | 6 | 0 |
| STATUS | `/pedidos/{id}/status` | `test/pedidos.status.test.js` | 13 | 0 |
| HEALTH | `/health` | `test/health.test.js` | 7 | 7 |
| GERAL | Todos os endpoints | `test/geral.test.js` | 6 | 0 |
| **Total** | | | **96** | **18** |

## Tecnologias

### Aplicação

- Node.js 20 ou superior e TypeScript em modo estrito
- Express 4
- Prisma ORM sobre MySQL 8
- Zod para validação de entrada
- `swagger-ui-express` servindo o contrato de `openapi.yaml`

### Suíte de testes

- Mocha 11, framework de testes
- Chai 6, biblioteca de asserções
- Supertest 7, cliente HTTP para teste de API
- Mochawesome 8, relatório visual em HTML
- Dotenv, variáveis de ambiente

### Automação e apoio

- GitHub Actions, integração contínua com banco em contêiner de serviço
- Scripts próprios em Node, sem dependência externa, para gerar a matriz, o
  checklist visual e as páginas da wiki

## Estrutura

```
maluzices-cozinha-saudavel/
├── src/                            aplicação
│   ├── domain/                     regras puras de negócio, sem Express e sem Prisma
│   ├── repositories/               acesso a dados via Prisma
│   ├── services/                   orquestra domínio e repositório
│   ├── routes/                     Express, validação Zod e tradução para HTTP
│   ├── routing/                    tabela de rotas e verbos aceitos
│   ├── middlewares/                verbos permitidos, autenticação e erros
│   ├── errors/                     erros de aplicação e middleware de tratamento
│   └── server.ts
├── config/
│   ├── ambiente.js                 instância única do Supertest e resolução da BASE_URL
│   └── config.example.json         template de configuração local, versionado
├── fixtures/
│   └── erros.js                    corpos de erro esperados, por código
├── helpers/
│   └── autenticacao.js             obtenção de token reutilizável
├── test/
│   ├── auth.login.test.js          POST e GET em /auth/login
│   ├── health.test.js              GET /health e verbos não permitidos
│   └── pedidos.test.js             POST e GET em /pedidos
├── prisma/
│   ├── schema.prisma               modelo de dados
│   ├── seed.ts                     pedidos de exemplo
│   └── seedUsuario.ts              usuário de autenticação
├── docs/
│   ├── matriz_vader_cozinha_v3.0.csv     os 96 casos do escopo
│   ├── backlog_pos_entrega.csv           os 30 casos fora do recorte
│   ├── checklist_vader_cozinha_v3.0.html checklist visual de execução
│   ├── mapa_endpoint.md                  mapa de casos por endpoint
│   └── cards-criados.json                ligação entre caso e issue
├── scripts/                        geração da matriz, do checklist e das issues
├── web/                            painel de acompanhamento, em Vite
├── .github/workflows/testes-api.yml
├── openapi.yaml                    contrato da API
├── .env.example                    template das variáveis de ambiente, versionado
└── package.json
```

## Boas práticas aplicadas

Estas são as decisões de organização adotadas no projeto, e explicam por que os
arquivos estão distribuídos dessa forma:

- **Configuração centralizada.** A `BASE_URL` é resolvida em um único lugar,
  `config/ambiente.js`, e exportada como uma instância pronta do Supertest.
  Nenhum arquivo de teste conhece a URL da API, então trocar de ambiente não
  exige tocar em teste algum.

- **Segredos fora do versionamento.** O `.env` e o `config/config.local.json`
  estão no `.gitignore`. O repositório versiona apenas os templates
  `.env.example` e `config/config.example.json`.

- **Credenciais fora do código.** O usuário e a senha válidos vêm do ambiente.
  Nenhum arquivo de teste contém credencial real, e só permanecem literais os
  valores inválidos de propósito, que são o próprio cenário do teste.

- **Fixtures de erro centralizadas.** Os corpos de erro esperados ficam em
  `fixtures/erros.js`, como funções que recebem o que varia. O corpo do 405, por
  exemplo, muda com o verbo e com a rota, então a fixture é
  `metodoNaoPermitido(metodo, rota)` e não um objeto fixo.

- **Testes organizados por endpoint.** Um arquivo por recurso, com `describe`
  aninhado por método HTTP. O relatório do Mochawesome espelha essa hierarquia
  e fica legível sem contexto adicional.

- **Identificador no nome de cada teste.** Todo `it` começa pelo identificador
  do caso, como `AUTH-01`. Isso permite rodar um caso isolado com `--grep`,
  liga o relatório à matriz sem intervenção manual e faz o veredicto ser
  preenchido por script, e não à mão.

- **Cobertura guiada por heurística.** Os cenários derivam da aplicação da
  VADER sobre o contrato OpenAPI, e não de escolha caso a caso. É o que traz os
  cenários negativos, de contrato e de segurança que não apareceriam por
  intuição.

- **Rastreabilidade em três níveis.** Cada caso existe na matriz, tem uma issue
  no repositório e uma linha no checklist visual. O identificador é o mesmo nos
  três, então nada se perde entre a especificação e a execução.

- **Relatório fora do Git.** A pasta `mochawesome-report/` é ignorada. Os
  relatórios de cada execução ficam como artefato da integração contínua.

## Pré-requisitos

- Node.js 20 ou superior
- npm
- MySQL 8 rodando localmente

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/pamelatf/maluzices-cozinha-saudavel.git
cd maluzices-cozinha-saudavel
```

### 2. Criar o banco de dados

```bash
mysql -u root -p < scripts/criar-banco.sql
```

O script cria o banco `cozinha_pedidos` vazio. As tabelas vêm da migration do
Prisma no passo 4.

### 3. Configurar as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com os dados do seu ambiente:

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | Conexão do Prisma com o MySQL local | `mysql://root:senha@localhost:3306/cozinha_pedidos` |
| `PORT` | Porta em que a API sobe | `2000` |
| `JWT_SECRET` | Segredo de assinatura do token | valor aleatório e longo |
| `BASE_URL` | URL da API que a suíte vai testar | `http://localhost:2000` |
| `USUARIO` | Usuário válido usado para autenticar | preencher com o seu |
| `SENHA` | Senha do usuário válido | preencher com a sua |

As três primeiras são da aplicação e as três últimas são da suíte de testes.
Nenhuma delas é versionada. O `.env.example` existe justamente para documentar
quais chaves precisam ser preenchidas.

### 4. Instalar as dependências

```bash
npm install
```

Um `npm install` só. As dependências da aplicação e as da suíte moram no mesmo
`package.json` desde a unificação dos repositórios.

### 5. Criar as tabelas

```bash
npm run db:migrate
```

### 6. Popular o banco

```bash
npm run db:seed
npm run seed
```

O primeiro cria pedidos de exemplo distribuídos entre todos os status. O
segundo cria o usuário usado na autenticação. Sem ele, o login falha e a suíte
inteira cai junto.

### 7. Subir a API

```bash
npm run dev
```

A API sobe em `http://localhost:2000` e a documentação interativa fica em
`http://localhost:2000/docs`, servida a partir do `openapi.yaml`. Deixe esse
terminal aberto, porque é o servidor rodando.

## Execução dos testes

Com a API no ar em um terminal, abra outro terminal na pasta do repositório.

Rodar a suíte inteira:

```bash
npm test
```

Rodar um arquivo específico:

```bash
npx mocha test/auth.login.test.js
```

Rodar um único caso pelo identificador:

```bash
npx mocha --grep "AUTH-01"
```

Rodar um grupo inteiro:

```bash
npx mocha --grep "HEALTH-"
```

Listar o que seria executado, sem executar:

```bash
npx mocha --dry-run
```

O `--grep` funciona porque todo `it` começa pelo identificador do caso. É o
mesmo mecanismo que a coluna Comando da matriz documenta, caso a caso.

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe a API em modo desenvolvimento, com watch |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm start` | Roda a versão compilada |
| `npm test` | Executa a suíte com o relatório Mochawesome |
| `npm run db:migrate` | Aplica as migrations do Prisma |
| `npm run db:seed` | Popula o banco com pedidos de exemplo |
| `npm run seed` | Cria o usuário de autenticação |
| `npm run lint` | Roda o ESLint sobre `src/` |

## Endpoints

| Método | Rota | Sucesso | Erros |
|---|---|---|---|
| `POST` | `/auth/login` | 200 | 400, 401 |
| `POST` | `/pedidos` | 201 | 400, 401 |
| `GET` | `/pedidos` | 200, com filtro opcional `?status=` | 400, 401 |
| `GET` | `/pedidos/resumo` | 200 | 401 |
| `GET` | `/pedidos/{id}` | 200 | 401, 404 |
| `PATCH` | `/pedidos/{id}` | 200 | 400, 401, 404, 409 |
| `PATCH` | `/pedidos/{id}/status` | 200 | 400, 401, 404, 409 |
| `DELETE` | `/pedidos/{id}` | 200 | 401, 404, 409 |
| `GET` | `/health` | 200, 503 | nenhum |

`POST /auth/login` e `GET /health` são públicos. Todos os outros exigem
`Authorization: Bearer <token>`.

### Método não permitido e rota inexistente

- Um verbo não aceito por uma rota existente responde **405**, com o header
  `Allow` listando os verbos aceitos e o corpo padrão com
  `codigo: METODO_NAO_PERMITIDO`.
- Um caminho que não corresponde a rota nenhuma responde **404**, com
  `codigo: ROTA_NAO_ENCONTRADA`.
- `OPTIONS` numa rota existente responde **204** com o `Allow` preenchido, e
  `HEAD` é aceito em qualquer rota que aceite `GET`.
- Esses quatro casos são resolvidos **antes** da verificação de autenticação.
  Nunca exigem `Authorization`, mesmo em rotas protegidas, porque descrevem o
  recurso e não quem está pedindo.

## Integração contínua

O workflow `.github/workflows/testes-api.yml` roda a cada pull request aberto
para a `master`, e também pode ser disparado à mão pela aba Actions.

Ele sobe um ambiente inteiro e descartável: um contêiner de serviço com MySQL 8,
o `.env` montado na hora, a API compilada e no ar, e a espera ativa até o
`/health` responder, em vez de um `sleep` fixo.

O Mocha roda duas vezes no mesmo job, e cada execução grava um relatório com
nome próprio:

| Execução | Comando | O que cobre |
|---|---|---|
| Suíte | `--grep "HEALTH-02" --invert` | Todos os casos, com o banco no ar |
| Banco indisponível | `--grep "HEALTH-02"` | Só o HEALTH-02, depois de um `docker stop` no MySQL |

A separação existe porque o HEALTH-02 verifica a resposta 503 quando a
dependência cai. Com o banco no ar ele falharia por falta da condição que
testa, e não por defeito.

Ao fim, o relatório do Mochawesome e o log da API sobem como artefatos, com 14
dias de retenção, mesmo quando a suíte falha.

## Estado atual da execução

Nem toda falha desta suíte é problema de configuração, e nem todo verde
significa que a API está correta. Vale ler o resultado junto com a matriz.

Última execução registrada, de 11 de agosto de 2026:

| Indicador | Valor |
|---|---|
| Testes executados | 21, mais o HEALTH-02 no job de banco indisponível |
| Verdes | 17 |
| Vermelhos | 4 |
| Casos da matriz com veredicto | 17 de 96 |

As quatro falhas atuais são defeitos da automação, não da API. Em todas, a API
respondeu exatamente o que o critério da matriz pede, e a asserção do teste é
que está incorreta. Estão registradas caso a caso na coluna Observações da
execução da matriz.

Dois pontos que merecem leitura atenta:

- **Verde nem sempre é aprovação.** O AUTH-06 envia uma senha de cem mil
  caracteres e espera 401. Ele passa, e o que isso confirma é a lacuna: o
  contrato não declara tamanho máximo, então a API processa a entrada inteira.
  O teste registra o comportamento atual e serve de evidência do defeito, não
  de aprovação dele.

- **Nem todo caso é automatizável.** O AUTH-11 e o AUTH-12 são verificações de
  inspeção, do contrato e do banco. São executados à mão, e a evidência fica na
  issue correspondente.

## Achados registrados

Achados abertos como issue no repositório, com rastreabilidade até o caso da
matriz que os originou:

| Achado | Tipo | Origem |
|---|---|---|
| Mensagens de validação retornadas em inglês numa API em português | Melhoria | AUTH-02 |
| Header `X-Powered-By` expõe o framework da aplicação | Melhoria | GERAL |
| Contrato do login não declara tamanho máximo para `usuario` e `senha` | Melhoria | AUTH-06 |
| Método não permitido resolvido depois da autenticação em parte das rotas | Bug | STATUS, HEALTH |
| Credencial real publicada como exemplo no contrato | Risco aceito | AUTH-11 |
| Senha gravada em texto puro na tabela de usuários | Risco aceito | AUTH-12 |

Os dois últimos são decisão consciente do projeto, registrados como risco
conhecido, com plano de correção por hash.

## Heurística de teste aplicada

Os cenários deste repositório não foram escritos por intuição. Partiram da
análise do contrato `openapi.yaml` guiada pela VADER, uma heurística de teste
exploratório de API. Cada letra é um ângulo de ataque que se aplica a cada
endpoint, o que reduz a chance de a suíte ficar só no caminho feliz.

| Letra | Dimensão | Como aparece na suíte |
|---|---|---|
| V | Verbo HTTP | Verbos não documentados em cada recurso, esperando 405 com o header `Allow` correto, e o fluxo completo de transição de status |
| A | Autenticação e autorização | Requisição sem `Authorization`, token adulterado, esquema errado, token expirado e enumeração de usuários pela mensagem de erro |
| D | Dados | Campos obrigatórios ausentes, vazios e com tipo errado, bordas de quantidade e de preço, arredondamento monetário e campos calculados pelo servidor enviados pelo cliente |
| E | Erros e exceções | Corpo malformado, recurso inexistente, transição de status inválida, colisão de rota e concorrência |
| R | Respostas | Contrato do corpo devolvido, coerência entre campos, contagens do resumo e ausência de paginação |

A distribuição dos 96 casos do escopo por letra está no checklist visual, em
`docs/checklist_vader_cozinha_v3.0.html`, que abre no navegador sem servidor e
sem dependência.

A heurística POISED também foi estudada durante a especificação, e os casos que
nasceram por ela foram reclassificados em VADER na revisão de escopo, para que
a matriz tivesse uma única chave de leitura.

## Documentação do projeto

| Onde | O que tem |
|---|---|
| [Wiki do repositório](https://github.com/pamelatf/maluzices-cozinha-saudavel/wiki) | Visão da API, regras de negócio, plano de testes, casos no formato da ISO/IEC/IEEE 29119-3 e os mesmos casos em Gherkin |
| `docs/matriz_vader_cozinha_v3.0.csv` | Os 96 casos do escopo, com critério, dados, comando e veredicto |
| `docs/backlog_pos_entrega.csv` | Os 30 casos fora do recorte da entrega |
| `docs/checklist_vader_cozinha_v3.0.html` | Checklist visual de execução, com filtros e exportação de evidências |
| Aba Projects do repositório | Quadro com o andamento de cada caso |
| Aba Issues do repositório | Uma issue por caso, mais as issues de defeito e de melhoria |

## Próximos passos

Backlog de evolução identificado no estado atual do projeto:

- Escrever os testes dos grupos PEDIDOS, PEDIDO-ID, RESUMO, STATUS e GERAL, que
  já estão especificados na matriz e aguardam automação
- Corrigir as quatro asserções incorretas apontadas na última execução
- Cobrir o cenário de força bruta no login, hoje no backlog por depender de
  execução isolada
- Acrescentar o teste de carga em k6 sobre os endpoints de pedidos
- Sanitizar os exemplos do `openapi.yaml`, trocando a credencial real por
  valores fictícios
- Ligar a proteção de branch na `master`, exigindo a suíte verde antes do merge

## Como contribuir

1. Faça um fork do projeto
2. Crie uma branch para a sua mudança (`git checkout -b feature/NomeDaMudanca`)
3. Faça o commit (`git commit -m "feat: descrição da mudança"`)
4. Envie a branch (`git push origin feature/NomeDaMudanca`)
5. Abra um pull request para a `master`

O workflow de testes roda automaticamente na abertura do pull request.

## Licença

Este projeto está sob a licença MIT. O texto completo está em
[`LICENSE`](LICENSE).

## Contato

Autora: Pamela T. F.
GitHub: [@pamelatf](https://github.com/pamelatf)

Versão do contrato: 2.1.0
Última atualização: 2026-08-11