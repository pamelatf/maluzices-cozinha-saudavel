# Regras de negócio — API de Pedidos

Documento único consolidando as regras que hoje estão espalhadas entre o
código (`src/domain/`, `src/errors/`, `src/routes/schemas.ts`) e as
descrições do [`openapi.yaml`](openapi.yaml). Serve como referência para
quem for testar a API sem precisar ler TypeScript.

## Modelo de dados

- Só existem duas tabelas: `Pedido` e `ItemPedido` (ver
  [`prisma/schema.prisma`](prisma/schema.prisma)).
- **Não há tabela de clientes.** `cliente` é um texto solto (`VarChar(120)`)
  dentro da própria linha do pedido — dois pedidos com o mesmo nome de
  cliente não são a mesma entidade, não há vínculo entre eles.
- **Não há tabela/catálogo de itens ou cardápio.** `nome`, `quantidade` e
  `precoUnitario` de cada item também são valores soltos, digitados a cada
  pedido — não há reaproveitamento nem referência a um item "mestre".
- Cada pedido nasce sempre com status `RECEBIDO`.

## Máquina de estados do `status`

Ordem de preparo: `RECEBIDO → EM_PREPARO → PRONTO → ENTREGUE`.

| Regra | Comportamento |
|---|---|
| Avançar (`AVANCAR`) | Move **uma casa** para frente na ordem acima. Pular etapa não é possível (não existe "avançar 2x de uma vez"). |
| Retroceder (`RETROCEDER`) | Move uma casa para trás. Em `RECEBIDO` (primeira posição), retroceder é inválido. |
| `ENTREGUE` | Estado final do fluxo de preparo. Não avança nem retrocede — qualquer tentativa dá **409 `TRANSICAO_INVALIDA`**. |
| Cancelar (`DELETE`) | Move o pedido para `CANCELADO`, a partir de **qualquer status exceto `ENTREGUE`**. |
| Cancelar um pedido `ENTREGUE` | **409 `TRANSICAO_INVALIDA`** — pedido já entregue não pode ser cancelado. |
| Cancelar um pedido já `CANCELADO` | **409 `TRANSICAO_INVALIDA`** — não transiciona de novo. |
| `CANCELADO` | Também é estado final: não avança, não retrocede, não cancela de novo. |

Implementado em [`src/domain/statusPedido.ts`](src/domain/statusPedido.ts).

## Cálculo de `valorTotal`

- **Sempre calculado no servidor**, nunca confiado no que vem do cliente.
  Se o body do `POST /pedidos` incluir `valorTotal`, esse campo é
  silenciosamente ignorado (nem gera erro de validação).
- Fórmula: soma de `quantidade × precoUnitario` de todos os itens do pedido.
- A conta é feita em **centavos** (`Math.round(preco * 100)` por item, depois
  somado como inteiro) para nunca depender de aritmética de ponto flutuante
  em dinheiro. Implementado em
  [`src/domain/valorPedido.ts`](src/domain/valorPedido.ts).
- Da mesma forma, o `valorTotal` de um pedido **nunca é recalculado depois**
  — avançar/retroceder/cancelar status não muda o valor.

## Validações de entrada (`POST /pedidos`)

Todas verificadas de uma vez — um payload inválido retorna **todos** os
erros encontrados em `erro.detalhes`, não só o primeiro.

| Campo | Regra | Erro se violar |
|---|---|---|
| `cliente` | Obrigatório, não pode ser vazio nem só espaços (é `trim()`ado antes de validar), máximo 120 caracteres | 400 |
| `observacao` | Opcional, máximo 280 caracteres | 400 |
| `itens` | Mínimo 1 item | 400 |
| `itens[].nome` | Obrigatório, máximo 120 caracteres | 400 |
| `itens[].quantidade` | Inteiro, mínimo 1 | 400 |
| `itens[].precoUnitario` | Número, deve ser maior que 0 (zero não é aceito) | 400 |

Ver [`src/routes/schemas.ts`](src/routes/schemas.ts).

## Filtro de status (`GET /pedidos?status=`)

- Valores aceitos: `RECEBIDO`, `EM_PREPARO`, `PRONTO`, `ENTREGUE`,
  `CANCELADO`.
- Qualquer outro valor → **400 `STATUS_INVALIDO`**.

## Pedidos `CANCELADO` — atenção, pegadinha comum

- **A API não esconde pedidos `CANCELADO`.** `GET /pedidos` sem filtro
  devolve todos os pedidos, inclusive os cancelados. `GET
  /pedidos?status=CANCELADO` também funciona normalmente.
- Quem esconde os pedidos cancelados é **o front-end** (filtro em
  `App.tsx` do projeto `web/`), não a API.
- Ou seja: se você testar só a API (via `curl`/Postman/Swagger) e esperar
  que um pedido cancelado suma do `GET /pedidos`, isso **não é bug** — é o
  front que decide não exibir, a API continua retornando tudo.

## `id` inexistente

- Qualquer operação (`GET`, `PATCH`, `DELETE`) em um `id` que não existe no
  banco → **404 `PEDIDO_NAO_ENCONTRADO`**.
- Um `id` que não é um número inteiro positivo (ex: `/pedidos/abc`) →
  **400 `VALIDACAO`**, nem chega a consultar o banco.

## Formato de erro (sempre o mesmo, em qualquer endpoint)

```json
{
  "erro": {
    "codigo": "PEDIDO_NAO_ENCONTRADO",
    "mensagem": "Pedido 42 não existe.",
    "detalhes": []
  }
}
```

`detalhes` só é preenchido em erros de validação, como
`[{ "campo": "cliente", "problema": "Campo obrigatório." }]`.

### Tabela de códigos de erro

| Código | HTTP | Quando acontece |
|---|---|---|
| `VALIDACAO` | 400 | Payload ou `id` de rota inválido |
| `STATUS_INVALIDO` | 400 | `?status=` com valor fora do enum |
| `PEDIDO_NAO_ENCONTRADO` | 404 | `id` não existe |
| `TRANSICAO_INVALIDA` | 409 | Avançar/retroceder além do permitido, ou cancelar `ENTREGUE`/`CANCELADO` |
| `ROTA_NAO_ENCONTRADA` | 404 | Caminho fora dos 7 endpoints existentes |
| `ERRO_INTERNO` | 500 | Qualquer erro não tratado |

Ver [`src/errors/AppError.ts`](src/errors/AppError.ts) e
[`src/errors/middleware.ts`](src/errors/middleware.ts).
