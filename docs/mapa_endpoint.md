# Casos de teste por endpoint — mapa de identificadores

Gerado por `scripts/reagruparPorEndpoint.js`. O prefixo é o endpoint, e diz em qual arquivo o cenário mora.
A numeração segue a operação, começando pela principal da rota, para os `describe` de cada arquivo saírem contíguos.

| Prefixo | Endpoint | Arquivo | Escopo | Backlog |
|---|---|---|---|---|
| **AUTH** | `/auth/login` | `test/auth.login.test.js` | 13 | 2 |
| **PEDIDOS** | `/pedidos` | `test/pedidos.test.js` | 32 | 10 |
| **PEDIDO-ID** | `/pedidos/{id}` | `test/pedidos.id.test.js` | 19 | 5 |
| **RESUMO** | `/pedidos/resumo` | `test/pedidos.resumo.test.js` | 6 | 1 |
| **STATUS** | `/pedidos/{id}/status` | `test/pedidos.status.test.js` | 13 | 2 |
| **HEALTH** | `/health` | `test/health.test.js` | 7 | 1 |
| **GERAL** | `Todos os endpoints` | `test/geral.test.js` | 6 | 6 |
| **CARGA** | `Carga e concorrência` | `k6/carga.js` | 0 | 3 |

## AUTH — `/auth/login`

Arquivo: `test/auth.login.test.js` · 13 no escopo, 2 no backlog

| Identificador | Anterior | Original | Método | VADER | Severidade | Título |
|---|---|---|---|---|---|---|
| **AUTH-01** | — | CRIT-41 | POST | V | Crítica | Login válido devolve token utilizável, sem exigir header de autenticação |
| **AUTH-02** | — | CRIT-42.1 | POST | D | Alta | Campo obrigatório ausente no login |
| **AUTH-03** | — | CRIT-42.3 | POST | D | Alta | Campo obrigatório vazio no login |
| **AUTH-04** | — | CRIT-42.5 | POST | D | Alta | Campos de login ausentes, vazios e com tipo incorreto — usuario com tipo incorreto |
| **AUTH-05** | — | CRIT-42.6 | POST | D | Alta | Campos de login ausentes, vazios e com tipo incorreto — corpo vazio |
| **AUTH-06** | — | CRIT-42.7 | POST | D | Alta | Campos de login ausentes, vazios e com tipo incorreto — senha sem limite de tamanho |
| **AUTH-07** | — | CRIT-43.1 | POST | A | Crítica | Enumeração de usuários pela mensagem de erro — usuário inexistente |
| **AUTH-08** | — | CRIT-43.2 | POST | A | Crítica | Enumeração de usuários pela mensagem de erro — senha incorreta de usuário existente |
| **AUTH-09** | — | CRIT-46 | POST | A | Crítica | Ausência de proteção contra tentativas repetidas no login |
| **AUTH-10** | — | CRIT-48 | POST | R | Alta | Coerência entre expiraEm e o claim exp do token |
| **AUTH-11** | — | CRIT-49.1 | POST | R | Alta | Credencial e token reais publicados como exemplo no contrato |
| **AUTH-12** | — | CRIT-49.2 | POST | A | Alta | Exposição da credencial no contrato e no tráfego — senha em texto puro no banco |
| **AUTH-13** | SIST-01 | CRIT-33.7 | GET | V | Crítica | Verbos não documentados em cada recurso — GET em /auth/login |
| **AUTH-14** _(backlog)_ | — | CRIT-47.2 | POST | A | Média | Endpoints públicos continuam acessíveis sem token — login ignora token inválido |
| **AUTH-15** _(backlog)_ | — | CRIT-61.1 | OTHER | R | Média | Header Allow correto na rota de login |

## PEDIDOS — `/pedidos`

Arquivo: `test/pedidos.test.js` · 32 no escopo, 10 no backlog

| Identificador | Anterior | Original | Método | VADER | Severidade | Título |
|---|---|---|---|---|---|---|
| **PEDIDOS-01** | AUTH-13 | CRIT-35.1 | POST | A | Crítica | Endpoints protegidos recusam requisição sem token |
| **PEDIDOS-02** | CRIA-01 | CRIT-01 | POST | V | Alta | Criação válida com múltiplos itens nasce em RECEBIDO |
| **PEDIDOS-03** | CRIA-02 | CRIT-02 | POST | D | Crítica | valorTotal enviado no corpo precisa ser ignorado pelo servidor |
| **PEDIDOS-04** | CRIA-03 | CRIT-03.1 | POST | D | Alta | Campos obrigatórios ausentes em pedido e em item — campo cliente ausente |
| **PEDIDOS-05** | CRIA-04 | CRIT-03.2 | POST | D | Alta | Campos obrigatórios ausentes em pedido e em item — campo itens ausente |
| **PEDIDOS-06** | CRIA-05 | CRIT-03.3 | POST | D | Alta | Campo obrigatório ausente no item do pedido |
| **PEDIDOS-07** | CRIA-06 | CRIT-04.1 | POST | D | Alta | Valores de borda de quantidade — quantidade no limite mínimo |
| **PEDIDOS-08** | CRIA-07 | CRIT-04.2 | POST | D | Alta | Quantidade fora do domínio válido |
| **PEDIDOS-09** | CRIA-08 | CRIT-04.5 | POST | D | Alta | Valores de borda de quantidade — quantidade extrema |
| **PEDIDOS-10** | CRIA-09 | CRIT-05.1 | POST | D | Alta | Valores de borda de precoUnitario e arredondamento monetário — preço mínimo aceitável |
| **PEDIDOS-11** | CRIA-10 | CRIT-05.2 | POST | D | Alta | Preço unitário fora do domínio válido |
| **PEDIDOS-12** | CRIA-11 | CRIT-05.4 | POST | D | Alta | Arredondamento monetário acima de duas casas decimais |
| **PEDIDOS-13** | CRIA-12 | CRIT-07.1 | POST | D | Alta | Array de itens vazio e ausência de limite superior — array de itens vazio |
| **PEDIDOS-14** | CRIA-13 | CRIT-07.2 | POST | D | Alta | Ausência de limite superior de itens no pedido |
| **PEDIDOS-15** | CRIA-14 | CRIT-09.1 | POST | D | Crítica | Campos gerados pelo servidor enviados no corpo da criação |
| **PEDIDOS-16** | CRIA-15 | CRIT-09.2 | POST | D | Crítica | Campos calculados pelo servidor enviados no corpo — status enviado no corpo |
| **PEDIDOS-17** | CRIA-16 | CRIT-10.1 | POST | E | Alta | Corpo malformado, ausente e nulo na criação |
| **PEDIDOS-18** | CRIA-17 | CRIT-11 | POST | E | Alta | Idempotência na criação do pedido |
| **PEDIDOS-19** | CRIA-18 | CRIT-12.1 | POST | D | Alta | Precisão do valorTotal em ponto flutuante |
| **PEDIDOS-20** | CRIA-19 | CRIT-14.1 | POST | D | Alta | Acentuação, emoji e conteúdo malicioso em campos de texto — acentuação completa |
| **PEDIDOS-21** | CRIA-20 | CRIT-14.2 | POST | D | Alta | Acentuação, emoji e conteúdo malicioso em campos de texto — emoji na observação |
| **PEDIDOS-22** | CRIA-21 | CRIT-14.3 | POST | D | Alta | Conteúdo malicioso em campos de texto livre |
| **PEDIDOS-23** | CONS-01 | CRIT-15.1 | GET | D | Alta | Filtro status com valores fora do enum e variações de caixa — status fora do enum |
| **PEDIDOS-24** | CONS-02 | CRIT-15.2 | GET | D | Alta | Filtro status com valores fora do enum e variações de caixa — status em caixa baixa |
| **PEDIDOS-25** | CONS-03 | CRIT-15.3 | GET | D | Alta | Filtro status com valores fora do enum e variações de caixa — status com espaço extra |
| **PEDIDOS-26** | CONS-04 | CRIT-15.4 | GET | D | Alta | Filtro status com valores fora do enum e variações de caixa — status vazio |
| **PEDIDOS-27** | CONS-05 | CRIT-15.5 | GET | D | Alta | Filtro status com valores fora do enum e variações de caixa — status repetido |
| **PEDIDOS-28** | CONS-06 | CRIT-16.1 | GET | R | Alta | Contrato da listagem e coerência do filtro por status — listagem sem filtro |
| **PEDIDOS-29** | CONS-07 | CRIT-16.2 | GET | R | Alta | Filtro por cada status do enum devolve o subconjunto correto |
| **PEDIDOS-30** | CONS-08 | CRIT-17 | GET | R | Alta | Ausência de paginação na listagem de pedidos |
| **PEDIDOS-31** | SIST-02 | CRIT-33.1 | PUT | V | Alta | Verbos de escrita não documentados na coleção de pedidos |
| **PEDIDOS-32** | METO-01 | CRIT-60.1 | PUT | V | Alta | Método não permitido resolvido antes da autenticação — PUT em /pedidos |
| **PEDIDOS-33** _(backlog)_ | — | CRIT-06.1 | POST | D | Média | Campos de texto exatamente no limite de tamanho |
| **PEDIDOS-34** _(backlog)_ | — | CRIT-06.2 | POST | D | Média | Campos de texto um caractere acima do limite |
| **PEDIDOS-35** _(backlog)_ | — | CRIT-06.7 | POST | D | Média | Limites de tamanho de cliente, observacao e nome do item — cliente como string vazia |
| **PEDIDOS-36** _(backlog)_ | — | CRIT-06.8 | POST | D | Média | Limites de tamanho de cliente, observacao e nome do item — cliente apenas com espaços |
| **PEDIDOS-37** _(backlog)_ | — | CRIT-08.1 | POST | D | Média | Tipos incorretos nos campos do pedido |
| **PEDIDOS-38** _(backlog)_ | — | CRIT-08.2 | POST | D | Média | Tipos incorretos nos campos do pedido — preço com vírgula decimal |
| **PEDIDOS-39** _(backlog)_ | — | CRIT-13.1 | POST | — | Média | Media type não suportado no corpo |
| **PEDIDOS-40** _(backlog)_ | — | CRIT-13.3 | POST | — | Média | Content-Type não suportado, ausente e Accept divergente — Content-Type ausente |
| **PEDIDOS-41** _(backlog)_ | — | CRIT-13.4 | POST | — | Média | Content-Type não suportado, ausente e Accept divergente — Accept incompatível |
| **PEDIDOS-42** _(backlog)_ | — | CRIT-61.2 | OTHER | R | Média | Header Allow correto na coleção de pedidos |

## PEDIDO-ID — `/pedidos/{id}`

Arquivo: `test/pedidos.id.test.js` · 19 no escopo, 5 no backlog

| Identificador | Anterior | Original | Método | VADER | Severidade | Título |
|---|---|---|---|---|---|---|
| **PEDIDO-ID-01** | CONS-13 | CRIT-18.1 | GET | E | Alta | Busca por id inexistente e por valores de borda do path — pedido inexistente |
| **PEDIDO-ID-02** | CONS-14 | CRIT-18.2 | GET | E | Alta | Busca por id fora da faixa válida |
| **PEDIDO-ID-03** | CONS-15 | CRIT-18.4 | GET | E | Alta | Busca por id com tipo inválido |
| **PEDIDO-ID-04** | EDIC-01 | CRIT-50.1 | PATCH | V | Alta | Edição parcial altera apenas o campo enviado |
| **PEDIDO-ID-05** | EDIC-02 | CRIT-51 | PATCH | D | Crítica | Substituição de itens recalcula o valorTotal no servidor |
| **PEDIDO-ID-06** | EDIC-03 | CRIT-52.1 | PATCH | D | Alta | Corpo vazio e corpo apenas com campos ignorados — corpo vazio |
| **PEDIDO-ID-07** | EDIC-04 | CRIT-52.2 | PATCH | D | Alta | Corpo contendo apenas campos que o contrato manda ignorar |
| **PEDIDO-ID-08** | EDIC-05 | CRIT-53 | PATCH | D | Crítica | Campos de servidor não podem escapar pelo endpoint de edição |
| **PEDIDO-ID-09** | EDIC-06 | CRIT-54.1 | PATCH | E | Crítica | Edição bloqueada nos status não permitidos |
| **PEDIDO-ID-10** | EDIC-07 | CRIT-55.1 | PATCH | D | Alta | Bordas de quantidade no PATCH espelhando o POST |
| **PEDIDO-ID-11** | EDIC-08 | CRIT-55.3 | PATCH | D | Alta | Bordas de preço no PATCH espelhando o POST |
| **PEDIDO-ID-12** | EDIC-09 | CRIT-55.5 | PATCH | D | Alta | Limites de tamanho no PATCH espelhando o POST |
| **PEDIDO-ID-13** | EDIC-10 | CRIT-55.7 | PATCH | D | Alta | Validações do POST espelhadas no PATCH — itens vazio no PATCH |
| **PEDIDO-ID-14** | CANC-01 | CRIT-29.1 | DELETE | V | Crítica | Cancelamento a partir de cada status ativo |
| **PEDIDO-ID-15** | CANC-02 | CRIT-30.1 | DELETE | E | Crítica | Cancelamento bloqueado em ENTREGUE e cancelamento repetido — cancelamento de pedido ENTREGUE |
| **PEDIDO-ID-16** | CANC-03 | CRIT-30.2 | DELETE | E | Crítica | Cancelamento bloqueado em ENTREGUE e cancelamento repetido — cancelamento repetido |
| **PEDIDO-ID-17** | CANC-04 | CRIT-32 | DELETE | R | Alta | Cancelamento é lógico e permanece rastreável |
| **PEDIDO-ID-18** | SIST-04 | CRIT-33.3 | PUT | V | Alta | Verbos não documentados em cada recurso — PUT em /pedidos/{id} |
| **PEDIDO-ID-19** | METO-02 | CRIT-60.2 | PUT | V | Alta | Método não permitido resolvido antes da autenticação — PUT em /pedidos/{id} |
| **PEDIDO-ID-22** _(backlog)_ | — | CRIT-31.1 | DELETE | E | Média | Cancelamento com id inexistente ou inválido |
| **PEDIDO-ID-20** _(backlog)_ | — | CRIT-56.1 | PATCH | D | Média | Semântica de observacao vazia ou nula no PATCH |
| **PEDIDO-ID-21** _(backlog)_ | — | CRIT-57.1 | PATCH | E | Média | Edição com id inexistente ou inválido |
| **PEDIDO-ID-24** _(backlog)_ | — | CRIT-61.4 | OTHER | R | Média | Header Allow correto no recurso de pedido |
| **PEDIDO-ID-23** _(backlog)_ | — | CRIT-64.3 | PUT | E | Média | Precedência entre método não permitido e recurso inexistente |

## RESUMO — `/pedidos/resumo`

Arquivo: `test/pedidos.resumo.test.js` · 6 no escopo, 1 no backlog

| Identificador | Anterior | Original | Método | VADER | Severidade | Título |
|---|---|---|---|---|---|---|
| **RESUMO-01** | CONS-09 | CRIT-19.1 | GET | E | Crítica | Colisão de rota entre /pedidos/resumo e /pedidos/{id} — rota literal do resumo |
| **RESUMO-02** | CONS-10 | CRIT-19.3 | GET | E | Crítica | Colisão de rota entre /pedidos/resumo e /pedidos/{id} — resumo com barra final |
| **RESUMO-03** | CONS-11 | CRIT-20.1 | GET | R | Alta | Coerência do resumo com a listagem e status sem ocorrência — coerência com a listagem filtrada |
| **RESUMO-04** | CONS-12 | CRIT-20.2 | GET | R | Alta | Coerência do resumo com a listagem e status sem ocorrência — base sem nenhum pedido |
| **RESUMO-05** | SIST-03 | CRIT-33.5 | DELETE | V | Alta | Verbos não documentados em cada recurso — DELETE em /pedidos/resumo |
| **RESUMO-06** | METO-04 | CRIT-60.4 | DELETE | V | Alta | Método não permitido resolvido antes da autenticação — DELETE em /pedidos/resumo |
| **RESUMO-07** _(backlog)_ | — | CRIT-61.3 | OTHER | R | Média | Header Allow correto no resumo |

## STATUS — `/pedidos/{id}/status`

Arquivo: `test/pedidos.status.test.js` · 13 no escopo, 2 no backlog

| Identificador | Anterior | Original | Método | VADER | Severidade | Título |
|---|---|---|---|---|---|---|
| **STATUS-01** | STAT-01 | CRIT-21.1 | PATCH | D | Alta | Ação fora do enum, ausente e com variação de caixa — ação fora do enum |
| **STATUS-02** | STAT-02 | CRIT-21.2 | PATCH | D | Alta | Ação fora do enum, ausente e com variação de caixa — ação em caixa baixa |
| **STATUS-03** | STAT-03 | CRIT-21.3 | PATCH | D | Alta | Ação vazia, nula, com tipo errado e corpo ausente |
| **STATUS-04** | STAT-04 | CRIT-22.1 | PATCH | V | Crítica | Fluxo completo de avanço e retrocesso do pedido — avanço completo até ENTREGUE |
| **STATUS-05** | STAT-05 | CRIT-22.2 | PATCH | V | Crítica | Fluxo completo de avanço e retrocesso do pedido — retrocesso de PRONTO até RECEBIDO |
| **STATUS-06** | STAT-06 | CRIT-23.1 | PATCH | E | Crítica | ENTREGUE como estado final nos dois sentidos |
| **STATUS-07** | STAT-07 | CRIT-24 | PATCH | E | Alta | Retrocesso a partir de RECEBIDO, o primeiro estado |
| **STATUS-08** | STAT-08 | CRIT-25.1 | PATCH | E | Crítica | Transição de status em pedido CANCELADO nos dois sentidos |
| **STATUS-09** | STAT-09 | CRIT-26 | PATCH | E | Alta | Concorrência no avanço de status do mesmo pedido |
| **STATUS-10** | STAT-10 | CRIT-28 | PATCH | R | Alta | Integridade dos dados do pedido após a transição |
| **STATUS-11** | SIST-05 | CRIT-33.4 | POST | V | Alta | Verbos não documentados em cada recurso — POST em /pedidos/{id}/status |
| **STATUS-12** | METO-03 | CRIT-60.3 | PUT | V | Crítica | Método não permitido resolvido antes da autenticação — PUT em /pedidos/{id}/status |
| **STATUS-13** | METO-05 | CRIT-61.5 | OTHER | R | Alta | Header Allow correto na rota de status |
| **STATUS-14** _(backlog)_ | — | CRIT-27.1 | PATCH | E | Média | Transição em pedido inexistente e precedência entre 400 e 404 — pedido inexistente com ação válida |
| **STATUS-15** _(backlog)_ | — | CRIT-27.2 | PATCH | E | Média | Transição em pedido inexistente e precedência entre 400 e 404 — pedido inexistente com ação inválida |

## HEALTH — `/health`

Arquivo: `test/health.test.js` · 7 no escopo, 1 no backlog

| Identificador | Anterior | Original | Método | VADER | Severidade | Título |
|---|---|---|---|---|---|---|
| **HEALTH-04** | SIST-06 | CRIT-33.6 | POST | V | Média | Verbo não permitido no health check — POST em /health |
| **HEALTH-05** | SIST-07 | CRIT-33.8 | PATCH | V | Média | Verbo não permitido no health check — PATCH em /health |
| **HEALTH-06** | SIST-08 | CRIT-33.9 | PUT | V | Média | Verbo não permitido no health check — PUT em /health |
| **HEALTH-07** | SIST-09 | CRIT-33.10 | DELETE | V | Média | Verbo não permitido no health check — DELETE em /health |
| **HEALTH-01** | SIST-10 | CRIT-34.1 | GET | R | Alta | Health check com banco disponível, sem exigir token |
| **HEALTH-02** | SIST-11 | CRIT-34.2 | GET | R | Alta | Health check com dependência indisponível ou fora do tempo limite |
| **HEALTH-03** | SIST-12 | CRIT-47.4 | GET | A | Média | Endpoints públicos continuam acessíveis sem token — health ignora token inválido |
| **HEALTH-08** _(backlog)_ | — | CRIT-61.6 | OTHER | R | Baixa | Header Allow correto no health check |

## GERAL — `Todos os endpoints`

Arquivo: `test/geral.test.js` · 6 no escopo, 6 no backlog

| Identificador | Anterior | Original | Método | VADER | Severidade | Título |
|---|---|---|---|---|---|---|
| **GERAL-01** | AUTH-14 | CRIT-44.1 | OTHER | A | Crítica | Header Authorization malformado |
| **GERAL-02** | AUTH-15 | CRIT-44.2 | OTHER | A | Crítica | Token malformado, adulterado e com esquema errado — assinatura adulterada |
| **GERAL-03** | AUTH-16 | CRIT-45 | OTHER | A | Alta | Token expirado após a janela de 1 hora |
| **GERAL-04** | SIST-13 | CRIT-36.1 | OTHER | E | Alta | Exposição de dados e ausência de proteção em trânsito — mensagens de erro sem vazamento |
| **GERAL-05** | SIST-14 | CRIT-36.2 | OTHER | A | Alta | Ausência de proteção em trânsito |
| **GERAL-06** | SIST-15 | CRIT-63.1 | GET | E | Alta | Rota inexistente responde 404 sem exigir autenticação |
| **GERAL-07** _(backlog)_ | — | CRIT-62.1 | OPTIONS | V | Média | OPTIONS responde 204 com Allow em todas as rotas, sem token |
| **GERAL-08** _(backlog)_ | — | CRIT-62.2 | HEAD | V | Média | HEAD espelha o GET da mesma rota, sem corpo |
| **GERAL-09** _(backlog)_ | — | CRIT-63.2 | OTHER | E | Média | Precedência entre rota inexistente e método não permitido |
| **GERAL-10** _(backlog)_ | — | CRIT-63.3 | GET | E | Média | Rota inexistente responde igual com e sem token |
| **GERAL-11** _(backlog)_ | — | CRIT-64.1 | OTHER | R | Média | Corpo do 405 adere ao ErroResponse |
| **GERAL-12** _(backlog)_ | — | CRIT-64.2 | OTHER | R | Média | Catálogo de códigos de erro após a 2.1.0 |

## CARGA — `Carga e concorrência`

Arquivo: `k6/carga.js` · 0 no escopo, 3 no backlog

| Identificador | Anterior | Original | Método | VADER | Severidade | Título |
|---|---|---|---|---|---|---|
| **CARGA-01** _(backlog)_ | — | PERF-02 | POST | — | Crítica | Pico de criação de pedidos no horário do almoço |
| **CARGA-02** _(backlog)_ | — | PERF-07.1 | GET | — | Média | Custo da autenticação sob carga — custo da verificação de token |
| **CARGA-03** _(backlog)_ | — | PERF-03 | GET | — | Alta | Agregação do resumo sob concorrência de escrita |
