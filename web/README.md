# Painel de Pedidos — Front-end

Versão em React + TypeScript do painel de pedidos da Maluzices, portada
1:1 a partir do protótipo estático [`painel-maluzices.html`](painel-maluzices.html)
(mantido no repositório como referência visual — abra-o diretamente no
navegador para comparar lado a lado com a versão em React).

## Stack

- Vite + React 18 + TypeScript (strict)
- `fetch` nativo (sem Axios, sem React Query)
- Estado local com `useState`/`useEffect` (sem Redux/Zustand/Context)

## Fidelidade visual

`src/estilos.css` é uma cópia exata do bloco `<style>` do protótipo — sem
nenhuma alteração de cor, espaçamento, raio, sombra, transição ou animação.
`src/componentes/SpriteIcones.tsx` reproduz o sprite `<symbol>` de ícones tal
como está, sem substituir por biblioteca de ícones.

## Pré-requisitos

- Node 20 ou superior
- A API rodando localmente (veja o [README da API](../README.md)) — hoje em
  `http://localhost:2000`

## Como rodar

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar a URL da API

O arquivo `.env` já vem com:

```
VITE_API_URL=/api
```

Chamadas para `/api/*` são redirecionadas pelo proxy do Vite
([`vite.config.ts`](vite.config.ts)) para `http://localhost:2000`, evitando
problemas de CORS. Se a API rodar em outra porta, ajuste o `target` do proxy
em `vite.config.ts`.

### 3. Subir o front

Com a API já rodando (`npm run dev` na raiz do repositório):

```bash
npm run dev
```

Acesse `http://localhost:5173`.

## Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe o front em modo desenvolvimento |
| `npm run build` | Type-check (`tsc -b`) e build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |

## Estrutura

```
src/
├─ api/pedidos.ts          chamadas HTTP: GET, POST, PATCH .../status, DELETE
├─ tipos.ts                tipos do domínio (espelham o contrato da API)
├─ componentes/
│  ├─ SpriteIcones.tsx     sprite de ícones do protótipo
│  ├─ Topo.tsx             cabeçalho, data e botão "Novo pedido"
│  ├─ Indicadores.tsx      faixa de indicadores do dia
│  ├─ Quadro.tsx           distribui os pedidos nas 4 colunas
│  ├─ Coluna.tsx           uma coluna de status
│  ├─ Cartao.tsx           um pedido, com ações de avançar/retroceder/cancelar
│  └─ ModalNovoPedido.tsx  formulário de novo pedido
├─ utils/formato.ts        brl() e tempoRelativo()
├─ estilos.css             CSS copiado do protótipo, sem alterações
├─ App.tsx                 estado dos pedidos e orquestração das chamadas à API
└─ main.tsx
```

## Notas sobre a integração com a API real

- `valorTotal` e `total` de cada pedido **nunca são recalculados no front** —
  vêm prontos da API.
- Pedidos com status `CANCELADO` são filtrados e não aparecem no quadro (o
  cancelamento é um soft delete no servidor).
- A hora relativa de cada cartão ("há 4 min") é recalculada a cada 60s a
  partir de `criadoEm`.
- Falhas em avançar/retroceder/cancelar (ex.: 409 num pedido já `ENTREGUE`)
  são reportadas com `alert()` nativo do navegador, sem alterar o estado
  local — o protótipo original não previa um elemento visual para esse caso.
