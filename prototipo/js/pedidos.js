/**
 * Painel de pedidos.
 *
 * Portado do antigo web/painel-maluzices.html para dentro da aplicação, como
 * uma seção a mais do menu lateral. A marcação e os estilos são os mesmos; o
 * cabeçalho próprio saiu, porque agora quem navega é o menu.
 *
 * Ao integrar com a API: trocar as funções de estado por chamadas a
 * POST /pedidos, PATCH /pedidos/:id/status e DELETE /pedidos/:id.
 */

const ORDEM = ['RECEBIDO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE'];

const COLUNAS = [
  { status: 'RECEBIDO', nome: 'Recebido', icone: 'i-comanda' },
  { status: 'EM_PREPARO', nome: 'Em preparo', icone: 'i-panela' },
  { status: 'PRONTO', nome: 'Pronto', icone: 'i-cloche' },
  { status: 'ENTREGUE', nome: 'Entregue', icone: 'i-sacola' }
];

let proximoId = 7;

export const pedidosIniciais = [
  { id: 1, cliente: 'Ana Beatriz', status: 'RECEBIDO', hora: 'há 4 min', obs: 'sem cebola no bowl',
    itens: [{ nome: 'Bowl de frango grelhado', qtd: 2, preco: 34.0 }, { nome: 'Suco verde 300ml', qtd: 1, preco: 14.0 }] },
  { id: 2, cliente: 'Rafael Antunes', status: 'RECEBIDO', hora: 'há 9 min', obs: '',
    itens: [{ nome: 'Wrap de atum', qtd: 1, preco: 28.0 }, { nome: 'Cookie de cacau', qtd: 2, preco: 9.5 }] },
  { id: 3, cliente: 'Juliana Moraes', status: 'EM_PREPARO', hora: 'há 18 min', obs: 'entregar até 12h30, por favor',
    itens: [{ nome: 'Marmita fit salmão', qtd: 3, preco: 42.0 }] },
  { id: 4, cliente: 'Marcos Vinícius', status: 'EM_PREPARO', hora: 'há 23 min', obs: '',
    itens: [{ nome: 'Salada de quinoa', qtd: 1, preco: 31.0 }, { nome: 'Água de coco', qtd: 1, preco: 8.0 }] },
  { id: 5, cliente: 'Camila Ribeiro', status: 'PRONTO', hora: 'há 31 min', obs: 'embalar separado',
    itens: [{ nome: 'Panqueca de banana', qtd: 2, preco: 22.0 }, { nome: 'Cookie de cacau', qtd: 3, preco: 9.5 }] },
  { id: 6, cliente: 'Escritório 4º andar', status: 'ENTREGUE', hora: 'há 1 h', obs: '',
    itens: [{ nome: 'Marmita fit frango', qtd: 6, preco: 38.0 }, { nome: 'Suco verde 300ml', qtd: 6, preco: 14.0 }] }
];

const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const totalDoPedido = (p) => p.itens.reduce((s, i) => s + i.qtd * i.preco, 0);
const svg = (id, cls = 'icone') => `<svg class="${cls}"><use href="#${id}"/></svg>`;

export const SPRITE = `<svg style="display:none" aria-hidden="true">
  <symbol id="i-colher" viewBox="0 0 24 24">
    <ellipse cx="12" cy="6.2" rx="3.3" ry="4.3"/><path d="M12 10.6V20.5"/>
  </symbol>
  <symbol id="i-comanda" viewBox="0 0 24 24">
    <path d="M6 3.5h12v17l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5v-17z"/><path d="M9.5 8.5h5M9.5 12.5h5"/>
  </symbol>
  <symbol id="i-panela" viewBox="0 0 24 24">
    <path d="M4 9.5h16v4.8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9.5z"/>
    <path d="M4 11.6H2.2M20 11.6h1.8"/>
    <path d="M9.5 6.6c0-1.1 1-1.1 1-2.2s-1-1.1-1-2.2M14.5 6.6c0-1.1 1-1.1 1-2.2s-1-1.1-1-2.2"/>
  </symbol>
  <symbol id="i-cloche" viewBox="0 0 24 24">
    <path d="M2.8 18.5h18.4"/><path d="M4.8 18.5a7.2 7.2 0 0 1 14.4 0"/>
    <path d="M12 7.2V5.9"/><circle cx="12" cy="4.5" r="1.3"/>
  </symbol>
  <symbol id="i-sacola" viewBox="0 0 24 24">
    <path d="M5 8h14l-1.1 12.5H6.1L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>
  </symbol>
  <symbol id="i-folha" viewBox="0 0 24 24">
    <path d="M20 4c0 9-5.5 13-11 13a5.5 5.5 0 0 1 0-11c4 0 7-2 11-2z"/><path d="M4 20c2-5 5.5-8 9-9.5"/>
  </symbol>
  <symbol id="i-real" viewBox="0 0 24 24">
    <rect x="2.5" y="6" width="19" height="12" rx="2.2"/>
    <circle cx="12" cy="12" r="2.6"/>
    <path d="M5.8 9.4v5.2M18.2 9.4v5.2"/>
  </symbol>
  <symbol id="i-mais" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>
  <symbol id="i-dir" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></symbol>
  <symbol id="i-esq" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="M4.5 12.5l5 5 10-11"/></symbol>
</svg>`;

function cartao(p) {
  const fim = p.status === 'ENTREGUE';
  const posicao = ORDEM.indexOf(p.status);
  return `
  <article class="cartao" data-id="${p.id}">
    <div class="cartao-topo">
      <span class="cliente">${p.cliente}</span>
      <span class="hora">${p.hora}</span>
    </div>
    <ul class="itens">
      ${p.itens.map((i) => `<li><span class="qtd">${i.qtd}×</span> ${i.nome}</li>`).join('')}
    </ul>
    ${p.obs ? `<p class="obs">“${p.obs}”</p>` : ''}
    <div class="cartao-base">
      <span class="total">${brl(totalDoPedido(p))}</span>
      ${fim
        ? `<span class="concluido">${svg('i-check')} concluído</span>`
        : `<div class="acoes">
             <button class="acao perigo" data-pedido="cancelar" aria-label="Cancelar pedido de ${p.cliente}">${svg('i-x')}</button>
             <button class="acao" data-pedido="voltar" aria-label="Retroceder situação" ${posicao === 0 ? 'disabled' : ''}>${svg('i-esq')}</button>
             <button class="acao principal" data-pedido="avancar">Avançar ${svg('i-dir')}</button>
           </div>`}
    </div>
  </article>`;
}

export function telaPedidos(pedidos) {
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  const faturamento = pedidos.reduce((s, p) => s + totalDoPedido(p), 0);

  const colunas = COLUNAS.map((c) => {
    const desta = pedidos.filter((p) => p.status === c.status);
    return `
      <section class="coluna" data-status="${c.status}">
        <div class="col-topo">${svg(c.icone)}<h2 class="col-nome">${c.nome}</h2><span class="col-cont">${desta.length}</span></div>
        <div class="lista">${desta.length ? desta.map(cartao).join('') : '<p class="vazio">nada por aqui</p>'}</div>
      </section>`;
  }).join('');

  return `
    <div class="cabecalho">
      <div>
        <h1 class="titulo">Painel de pedidos</h1>
        <p class="subtitulo">${hoje}</p>
      </div>
      <button class="botao" data-pedido="novo">Novo pedido</button>
    </div>

    <div class="pedidos-escopo">
      ${SPRITE}
      <section class="indicadores" aria-label="Resumo do dia">
        <div class="ind"><div class="ind-icone">${svg('i-comanda')}</div><div><div class="ind-num">${pedidos.length}</div><div class="ind-rot">Pedidos hoje</div></div></div>
        <div class="ind"><div class="ind-icone">${svg('i-panela')}</div><div><div class="ind-num">${pedidos.filter((p) => p.status === 'EM_PREPARO').length}</div><div class="ind-rot">Na cozinha</div></div></div>
        <div class="ind"><div class="ind-icone">${svg('i-cloche')}</div><div><div class="ind-num">${pedidos.filter((p) => p.status === 'PRONTO').length}</div><div class="ind-rot">Aguardando retirada</div></div></div>
        <div class="ind"><div class="ind-icone">${svg('i-real')}</div><div><div class="ind-num">${brl(faturamento)}</div><div class="ind-rot">Faturamento do dia</div></div></div>
      </section>

      <main class="quadro">${colunas}</main>

      <div class="fundo-modal" id="fundoModal">
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="tituloModal">
    <div class="modal-topo">
      <svg class="icone"><use href="#i-colher"/></svg>
      <h2 id="tituloModal">Novo pedido</h2>
      <button class="fechar" data-pedido="fechar" aria-label="Fechar"><svg class="icone"><use href="#i-x"/></svg></button>
    </div>
    <div class="modal-corpo">
      <div>
        <label for="campoCliente">Cliente</label>
        <input id="campoCliente" maxlength="120" placeholder="Nome de quem pediu" autocomplete="off">
      </div>
      <div>
        <label>Itens</label>
        <div class="cabec-itens"><span>Item</span><span>Qtd</span><span>Preço un.</span><span></span></div>
        <div id="listaItens"></div>
        <button class="add-item" data-pedido="adicionar-item"><svg class="icone"><use href="#i-mais"/></svg> adicionar item</button>
      </div>
      <div>
        <label for="campoObs">Observação</label>
        <textarea id="campoObs" maxlength="280" placeholder="ex.: sem cebola, embalar separado"></textarea>
      </div>
      <div class="aviso" id="aviso"></div>
    </div>
    <div class="modal-base">
      <div class="total-previa"><span>Total</span><strong id="previaTotal">R$ 0,00</strong></div>
      <button class="btn-secundario" data-pedido="fechar">Cancelar</button>
      <button class="btn-primario" data-pedido="salvar">Registrar pedido</button>
    </div>
  </div>
</div>
    </div>`;
}

/** Move o pedido entre as situações, com as mesmas regras da API. */
export function aplicarAcaoNoPedido(pedidos, id, acao) {
  const pedido = pedidos.find((p) => p.id === id);
  if (!pedido) return pedidos;
  const posicao = ORDEM.indexOf(pedido.status);
  if (acao === 'avancar' && posicao < ORDEM.length - 1) pedido.status = ORDEM[posicao + 1];
  if (acao === 'voltar' && posicao > 0) pedido.status = ORDEM[posicao - 1];
  if (acao === 'cancelar' && pedido.status !== 'ENTREGUE') return pedidos.filter((p) => p.id !== id);
  return pedidos;
}

export function validarPedido(cliente, itens) {
  const erros = [];
  if (!cliente) erros.push('informe o nome do cliente');
  if (!itens.length) erros.push('adicione pelo menos um item');
  if (itens.some((i) => i.qtd < 1)) erros.push('quantidade mínima é 1');
  if (itens.some((i) => i.preco <= 0)) erros.push('preço precisa ser maior que zero');
  return erros;
}

export function criarPedido(cliente, itens, obs) {
  return { id: proximoId++, cliente, status: 'RECEBIDO', hora: 'agora', obs, itens };
}
