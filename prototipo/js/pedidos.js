/**
 * Painel de pedidos.
 *
 * Portado do antigo web/painel-maluzices.html para dentro da aplicação, como
 * uma seção a mais do menu lateral.
 *
 * As regras de situação seguem o contrato da API (openapi.json): o pedido
 * anda de RECEBIDO até ENTREGUE, e pode ser CANCELADO a partir de qualquer
 * situação que não seja final. Entregue e cancelado são finais: não voltam,
 * não avançam e não são editados.
 *
 * Ao integrar com a API: trocar as funções de estado por chamadas a
 * POST /pedidos, PATCH /pedidos/:id, PATCH /pedidos/:id/status e
 * POST /pedidos/:id/cancelar.
 */

const ORDEM = ['RECEBIDO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE'];
const FINAIS = ['ENTREGUE', 'CANCELADO'];

const COLUNAS = [
  { status: 'RECEBIDO', nome: 'Recebido', icone: 'i-comanda' },
  { status: 'EM_PREPARO', nome: 'Em preparo', icone: 'i-panela' },
  { status: 'PRONTO', nome: 'Pronto', icone: 'i-cloche' },
  { status: 'ENTREGUE', nome: 'Entregue', icone: 'i-sacola' },
  { status: 'CANCELADO', nome: 'Cancelado', icone: 'i-x' }
];

const ROTULO_SITUACAO = {
  RECEBIDO: 'recebido',
  EM_PREPARO: 'em preparo',
  PRONTO: 'pronto para retirada',
  ENTREGUE: 'entregue',
  CANCELADO: 'cancelado'
};

let proximoId = 7;

export const pedidosIniciais = [
  { id: 1, cliente: 'Ana Beatriz', telefone: '46999180422', status: 'RECEBIDO', hora: 'há 4 min', obs: 'sem cebola no bowl',
    itens: [{ nome: 'Bowl de frango grelhado', qtd: 2, preco: 34.0 }, { nome: 'Suco verde 300ml', qtd: 1, preco: 14.0 }] },
  { id: 2, cliente: 'Rafael Antunes', telefone: '', status: 'RECEBIDO', hora: 'há 9 min', obs: '',
    itens: [{ nome: 'Wrap de atum', qtd: 1, preco: 28.0 }, { nome: 'Cookie de cacau', qtd: 2, preco: 9.5 }] },
  { id: 3, cliente: 'Juliana Moraes', telefone: '4699712 3344', status: 'EM_PREPARO', hora: 'há 18 min', obs: 'entregar até 12h30, por favor',
    itens: [{ nome: 'Marmita fit salmão', qtd: 3, preco: 42.0 }] },
  { id: 4, cliente: 'Marcos Vinícius', telefone: '', status: 'EM_PREPARO', hora: 'há 23 min', obs: '',
    itens: [{ nome: 'Salada de quinoa', qtd: 1, preco: 31.0 }, { nome: 'Água de coco', qtd: 1, preco: 8.0 }] },
  { id: 5, cliente: 'Camila Ribeiro', telefone: '46998887766', status: 'PRONTO', hora: 'há 31 min', obs: 'embalar separado',
    itens: [{ nome: 'Panqueca de banana', qtd: 2, preco: 22.0 }, { nome: 'Cookie de cacau', qtd: 3, preco: 9.5 }] },
  { id: 6, cliente: 'Escritório 4º andar', telefone: '4633334455', status: 'ENTREGUE', hora: 'há 1 h', obs: '',
    itens: [{ nome: 'Marmita fit frango', qtd: 6, preco: 38.0 }, { nome: 'Suco verde 300ml', qtd: 6, preco: 14.0 }] }
];

const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const svg = (id, cls = 'icone') => `<svg class="${cls}"><use href="#${id}"/></svg>`;

export const totalDoPedido = (p) => p.itens.reduce((s, i) => s + i.qtd * i.preco, 0);
export const ehFinal = (status) => FINAIS.includes(status);
export const rotuloSituacao = (status) => ROTULO_SITUACAO[status] || status;

/** Faturamento conta só o que foi entregue. Pedido em aberto ainda pode cair. */
export const faturamentoEntregue = (pedidos) =>
  pedidos.filter((p) => p.status === 'ENTREGUE').reduce((s, p) => s + totalDoPedido(p), 0);

export const valorEmAberto = (pedidos) =>
  pedidos.filter((p) => !ehFinal(p.status)).reduce((s, p) => s + totalDoPedido(p), 0);

/* ------------------------------------------------------------------
   Telefone e WhatsApp
------------------------------------------------------------------ */
export const digitosDoTelefone = (texto) => String(texto || '').replace(/\D/g, '');

/**
 * Aceita fixo com 10 dígitos e celular com 11, sempre com DDD.
 * Nenhum DDD brasileiro tem 0 nas duas posições, e celular começa com 9.
 */
export function telefoneValido(texto) {
  const d = digitosDoTelefone(texto);
  if (d.length === 11) return /^[1-9][1-9]9\d{8}$/.test(d);
  if (d.length === 10) return /^[1-9][1-9][2-5]\d{7}$/.test(d);
  return false;
}

export function formatarTelefone(texto) {
  const d = digitosDoTelefone(texto);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return String(texto || '');
}

/** Troca os marcadores do modelo pelos dados do pedido. */
export function montarMensagem(modelo, pedido) {
  const trocas = {
    '{cliente}': pedido.cliente || '',
    '{total}': brl(totalDoPedido(pedido)),
    '{situacao}': rotuloSituacao(pedido.status),
    '{itens}': pedido.itens.map((i) => `${i.qtd}x ${i.nome}`).join(', ')
  };
  return Object.keys(trocas).reduce((texto, chave) => texto.split(chave).join(trocas[chave]), String(modelo || ''));
}

/**
 * wa.me é o endereço oficial e decide sozinho entre WhatsApp Web e aplicativo.
 * Devolve null quando o número não serve, para a tela saber desabilitar o link.
 */
export function linkWhatsapp(telefone, mensagem) {
  if (!telefoneValido(telefone)) return null;
  const numero = `55${digitosDoTelefone(telefone)}`;
  return mensagem
    ? `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
    : `https://wa.me/${numero}`;
}

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
  <symbol id="i-conversa" viewBox="0 0 24 24">
    <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.7 8.7 0 0 1-3.9-.9L3.5 20.5l1.6-4.9a8.1 8.1 0 0 1-1.1-4.1A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>
  </symbol>
  <symbol id="i-mais" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>
  <symbol id="i-dir" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></symbol>
  <symbol id="i-esq" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="M4.5 12.5l5 5 10-11"/></symbol>
</svg>`;

/**
 * O cartão inteiro abre o pedido. Os botões param a propagação do clique,
 * para avançar um pedido não abrir a tela de edição junto.
 */
function cartao(p, mensagemModelo) {
  const final = ehFinal(p.status);
  const posicao = ORDEM.indexOf(p.status);
  const zap = linkWhatsapp(p.telefone, montarMensagem(mensagemModelo, p));

  const selo = p.status === 'ENTREGUE'
    ? `<span class="concluido">${svg('i-check')} concluído</span>`
    : `<span class="cancelado">${svg('i-x')} cancelado</span>`;

  const botoes = `
    <div class="cartao-acoes">
      <button class="acao destrutiva" data-pedido="cancelar" aria-label="Cancelar pedido de ${esc(p.cliente)}">Cancelar</button>
      <div class="acoes-andar">
        <button class="acao" data-pedido="voltar" ${posicao === 0 ? 'disabled' : ''}>${svg('i-esq')} Retroceder</button>
        <button class="acao principal" data-pedido="avancar">Avançar ${svg('i-dir')}</button>
      </div>
    </div>`;

  return `
  <article class="cartao${final ? ' cartao-final' : ''}" data-id="${p.id}" tabindex="0" role="button"
           aria-label="Abrir pedido de ${esc(p.cliente)}">
    <div class="cartao-topo">
      <span class="cliente">${esc(p.cliente)}</span>
      <span class="hora">${esc(p.hora)}</span>
    </div>
    <ul class="itens">
      ${p.itens.map((i) => `<li><span class="qtd">${i.qtd}×</span> ${esc(i.nome)}</li>`).join('')}
    </ul>
    ${p.obs ? `<p class="obs">“${esc(p.obs)}”</p>` : ''}
    <div class="cartao-base">
      <span class="total">${brl(totalDoPedido(p))}</span>
      ${zap
        ? `<a class="zap" href="${zap}" target="_blank" rel="noopener" data-pedido="zap"
              aria-label="Falar com ${esc(p.cliente)} no WhatsApp"
              title="Abrir conversa com ${esc(formatarTelefone(p.telefone))}"><img src="img/whatsapp.png" alt=""></a>`
        : ''}
      ${final ? selo : ''}
    </div>
    ${final ? '' : botoes}
  </article>`;
}

export function telaPedidos(pedidos, opcoes = {}) {
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  const mensagem = opcoes.mensagemWhatsapp || '';
  const entregues = faturamentoEntregue(pedidos);
  const emAberto = valorEmAberto(pedidos);
  const ativos = pedidos.filter((p) => p.status !== 'CANCELADO');

  const colunas = COLUNAS.map((c) => {
    const desta = pedidos.filter((p) => p.status === c.status);
    return `
      <section class="coluna" data-status="${c.status}">
        <div class="col-topo">${svg(c.icone)}<h2 class="col-nome">${c.nome}</h2><span class="col-cont">${desta.length}</span></div>
        <div class="lista">${desta.length ? desta.map((p) => cartao(p, mensagem)).join('') : '<p class="vazio">nada por aqui</p>'}</div>
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
        <div class="ind"><div class="ind-icone">${svg('i-comanda')}</div><div><div class="ind-num">${ativos.length}</div><div class="ind-rot">Pedidos hoje</div></div></div>
        <div class="ind"><div class="ind-icone">${svg('i-panela')}</div><div><div class="ind-num">${pedidos.filter((p) => p.status === 'EM_PREPARO').length}</div><div class="ind-rot">Na cozinha</div></div></div>
        <div class="ind"><div class="ind-icone">${svg('i-cloche')}</div><div><div class="ind-num">${pedidos.filter((p) => p.status === 'PRONTO').length}</div><div class="ind-rot">Aguardando retirada</div></div></div>
        <div class="ind"><div class="ind-icone">${svg('i-real')}</div><div><div class="ind-num">${brl(entregues)}</div><div class="ind-rot">Faturamento do dia</div></div></div>
        <div class="ind"><div class="ind-icone">${svg('i-folha')}</div><div><div class="ind-num">${brl(emAberto)}</div><div class="ind-rot">Em aberto</div></div></div>
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
            <div class="dupla">
              <div>
                <label for="campoCliente">Cliente</label>
                <input id="campoCliente" maxlength="120" placeholder="Nome de quem pediu" autocomplete="off">
              </div>
              <div>
                <label for="campoTelefone">Telefone <span class="opcional">opcional</span></label>
                <div class="campo-zap">
                  <input id="campoTelefone" maxlength="20" placeholder="(46) 99999-0000" autocomplete="off" inputmode="tel">
                  <span class="zap-botao" id="zapBotao"></span>
                </div>
              </div>
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
            <button class="btn-primario" id="botaoSalvarPedido" data-pedido="salvar">Registrar pedido</button>
          </div>
        </div>
      </div>
    </div>`;
}

/**
 * Move o pedido entre as situações, com as mesmas regras da API.
 * Situação final não se move, e cancelar é transição, não exclusão.
 */
export function aplicarAcaoNoPedido(pedidos, id, acao) {
  const pedido = pedidos.find((p) => p.id === id);
  if (!pedido || ehFinal(pedido.status)) return pedidos;
  const posicao = ORDEM.indexOf(pedido.status);
  if (acao === 'avancar' && posicao < ORDEM.length - 1) pedido.status = ORDEM[posicao + 1];
  if (acao === 'voltar' && posicao > 0) pedido.status = ORDEM[posicao - 1];
  if (acao === 'cancelar') pedido.status = 'CANCELADO';
  return pedidos;
}

export function validarPedido(cliente, itens, telefone) {
  const erros = [];
  if (!cliente) erros.push('informe o nome do cliente');
  if (!itens.length) erros.push('adicione pelo menos um item');
  if (itens.some((i) => i.qtd < 1)) erros.push('quantidade mínima é 1');
  if (itens.some((i) => i.preco <= 0)) erros.push('preço precisa ser maior que zero');
  if (telefone && !telefoneValido(telefone)) erros.push('telefone precisa ter DDD e 10 ou 11 dígitos');
  return erros;
}

export function criarPedido(cliente, itens, obs, telefone) {
  return { id: proximoId++, cliente, telefone: telefone || '', status: 'RECEBIDO', hora: 'agora', obs, itens };
}
