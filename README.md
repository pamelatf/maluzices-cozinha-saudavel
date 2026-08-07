# API de Pedidos — Cozinha de Comida Saudável

## Contexto

Sistema de controle de pedidos de uma cozinha de comida saudável. Uma
atendente registra o pedido de um cliente e acompanha seu preparo até a
entrega, passando pelos status `RECEBIDO → EM_PREPARO → PRONTO → ENTREGUE`
(ou `CANCELADO`, a qualquer momento antes da entrega).

Esta API expõe exatamente sete endpoints para cobrir esse fluxo: criar
pedido, listar pedidos (com filtro por status), buscar um pedido, avançar ou
retroceder o status de preparo, cancelar um pedido, ver um resumo de
contagem por status, e um health check.

## Stack

- Node 20 + TypeScript (strict)
- Express 4
- Prisma ORM + MySQL 8 (local, sem Docker)
- Zod para validação de entrada
- `swagger-ui-express` servindo o contrato em [`openapi.yaml`](openapi.yaml)

### Arquitetura

```
src/
├─ domain/          regras puras de negócio — sem Express, sem Prisma, sem I/O
├─ repositories/     acesso a dados via Prisma
├─ services/         orquestra domínio + repositório
├─ routes/           Express, validação Zod, tradução para HTTP
├─ errors/           erros de aplicação e middleware de tratamento
└─ server.ts
```

`valorTotal` nunca é confiado quando enviado pelo cliente: é sempre
recalculado no servidor a partir dos itens, usando aritmética em centavos
(nunca `float`) para evitar erros de arredondamento monetário.

## Pré-requisitos

- Node 20 ou superior
- MySQL 8 rodando localmente (sem Docker), com um usuário que possa criar
  bancos e tabelas

## Instalação do zero

### 1. Criar o banco de dados

Com o MySQL local rodando, execute o script de criação do banco:

```bash
mysql -u root -p < scripts/criar-banco.sql
```

Isso cria o banco `cozinha_pedidos` (vazio — as tabelas vêm da migration do
Prisma no passo 4).

### 2. Configurar variáveis de ambiente

Este projeto já vem com um arquivo `.env` (ignorado pelo git) copiado de
[`.env.example`](.env.example). Edite `.env` e troque `SUA_SENHA` pela senha
do seu usuário MySQL local:

```
DATABASE_URL="mysql://root:SUA_SENHA@localhost:3306/cozinha_pedidos"
PORT=2000
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Rodar a migration do Prisma

Cria as tabelas `Pedido` e `ItemPedido` no banco `cozinha_pedidos`:

```bash
npm run db:migrate
```

### 5. Popular o banco com dados de exemplo

Cria 6 pedidos distribuídos entre todos os status, para você já ter dado ao
abrir o Swagger:

```bash
npm run db:seed
```

### 6. Subir a API

```bash
npm run dev
```

A API sobe em `http://localhost:2000` (ou na porta configurada em `PORT`).

### 7. Abrir a documentação interativa

Acesse [`http://localhost:2000/docs`](http://localhost:2000/docs) — o
Swagger UI é servido a partir de `openapi.yaml` e o "Try it out" funciona
direto contra a API local.

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe a API em modo desenvolvimento (watch) |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Roda a versão compilada (`dist/server.js`) |
| `npm run db:migrate` | Aplica migrations do Prisma |
| `npm run db:seed` | Popula o banco com 6 pedidos de exemplo |
| `npm run lint` | Roda o ESLint sobre `src/` |

## Endpoints

| Método | Rota | Sucesso | Erros |
|---|---|---|---|
| `POST` | `/pedidos` | 201 | 400 |
| `GET` | `/pedidos` | 200 (filtro opcional `?status=`) | 400 |
| `GET` | `/pedidos/:id` | 200 | 404 |
| `PATCH` | `/pedidos/:id/status` | 200 | 400, 404, 409 |
| `DELETE` | `/pedidos/:id` | 200 | 404, 409 |
| `GET` | `/pedidos/resumo` | 200 | — |
| `GET` | `/health` | 200 | — |

Detalhes completos de request/response, exemplos e o formato padronizado de
erro estão em [`openapi.yaml`](openapi.yaml) e no Swagger UI em `/docs`.

## Método não permitido e rota inexistente

- Enviar um verbo HTTP não aceito por uma rota que existe responde
  **405 Method Not Allowed**, com o header `Allow` (verbos aceitos naquela
  rota, separados por vírgula) e corpo `ErroResponse` com
  `codigo: METODO_NAO_PERMITIDO`.
- Enviar qualquer verbo para um caminho que não corresponde a nenhuma rota
  responde **404**, com `codigo: ROTA_NAO_ENCONTRADA`.
- `OPTIONS` numa rota existente responde **204** com o header `Allow`
  preenchido. `HEAD` é aceito em qualquer rota que aceite `GET` (espelha o
  `GET`, sem corpo na resposta).
- Esses quatro casos (405, 404, `OPTIONS`, `HEAD`) são resolvidos **antes**
  da verificação de autenticação — nunca exigem `Authorization`, mesmo em
  rotas que normalmente são protegidas. Eles descrevem o recurso, não quem
  está pedindo.

Rotas e verbos aceitos:

| Rota | Verbos aceitos |
|---|---|
| `/auth/login` | `POST` |
| `/pedidos` | `GET`, `POST` |
| `/pedidos/resumo` | `GET` |
| `/pedidos/{id}` | `GET`, `PATCH`, `DELETE` |
| `/pedidos/{id}/status` | `PATCH` |
| `/health` | `GET` |

(`OPTIONS` e, onde houver `GET`, `HEAD` são sempre aceitos além do que está
na tabela.)
