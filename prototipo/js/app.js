import { catalogoInicial, parametrosIniciais, vendas, HOJE } from './dados.js';
import {
  PERIODOS, indicadoresDoPeriodo, serieMensal, gastosPorCategoria,
  faturamentoPorDiaDaSemana, produtosVendidos, destaqueDoPeriodo,
  vendasDoIntervalo, custosDoIntervalo
} from './indicadores.js';
import { graficoFaturamentoLucro, graficoDiaDaSemana, barrasHorizontais } from './graficos.js';
import {
  telaPedidos, pedidosIniciais, aplicarAcaoNoPedido, validarPedido, criarPedido, totalDoPedido,
  ehFinal, telefoneValido, linkWhatsapp, montarMensagem, formatarTelefone, rotuloSituacao
} from './pedidos.js';
import {
  resumoDaFicha, custoDoIngrediente, fatorDeCorrecao, precoPorQuilo,
  custoPorPorcao, precoSugerido, metaDeCmv, cmvReal,
  formatarMoeda, formatarPercentual, formatarPeso, lerMoeda, rendimentoEmQuilos
} from './calculo.js';
import {
  precoUnitario, totalDaCompra, avaliarCompra, aplicarCompra, descricaoDaCompra
} from './compras.js';

/* ------------------------------------------------------------------
   Estado em memória. Recarregar a página volta aos dados de exemplo.
------------------------------------------------------------------ */
const estado = {
  catalogo: catalogoInicial(),
  parametros: { ...parametrosIniciais },
  abaConfig: 'parametros',
  abaCusto: 'simples',
  selecionados: {},
  novosPrecos: {},
  importacao: null,
  pedidos: pedidosIniciais.map((p) => ({ ...p, itens: p.itens.map((i) => ({ ...i })) })),
  // 30 dias em vez de "este mês": mês em andamento compara 5 dias com 30
  periodoPainel: '30dias',
  filtroFichas: 'vendidos',
  buscaInsumo: '',
  paginas: {},
  pedidoEmEdicao: null,
  filtrosCadastro: {},
  proximoCustoId: 8
};

const PAGINAS = [
  { rota: 'inicio', titulo: 'Início', icone: 'casa' },
  { rota: 'pedidos', titulo: 'Painel de pedidos', icone: 'comanda' },
  { rota: 'painel', titulo: 'Margem por produto', icone: 'grafico' },
  { rota: 'fichas', titulo: 'Produtos e fichas', icone: 'livro' },
  { rota: 'ajuste', titulo: 'Ajuste de preços', icone: 'etiqueta' },
  { rota: 'insumos', titulo: 'Insumos', icone: 'cesta' },
  { rota: 'custos', titulo: 'Custos', icone: 'carteira' },
  { rota: 'config', titulo: 'Configurações', icone: 'engrenagem' }
];

const ICONES = {
  casa: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M9.5 21v-6h5v6"/>',
  conversa: '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.3 8.7 8.7 0 0 1-3.9-.9L3.5 20.5l1.6-4.9a8.1 8.1 0 0 1-1.1-4.1A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>',
  grafico: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  comanda: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  livro: '<path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-6"/><path d="M20 4v16h-6"/>',
  etiqueta: '<path d="M3 11V4h7l10 10-7 7z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
  cesta: '<path d="M3 9h18l-2 11H5z"/><path d="M8 9 12 3l4 6"/>',
  carteira: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1.2"/>',
  engrenagem: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  alerta: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  editar: '<path d="M4 20h4L19.5 8.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4z"/><path d="M14 6l4 4"/>',
  excluir: '<path d="M4 7h16"/><path d="M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7"/><path d="M6.4 7l.9 12.4A2.2 2.2 0 0 0 9.5 21.5h5a2.2 2.2 0 0 0 2.2-2.1L17.6 7"/><path d="M10.3 11v6.2M13.7 11v6.2"/>'
};

const icone = (nome) => `<svg class="icone" viewBox="0 0 24 24" aria-hidden="true">${ICONES[nome] || ''}</svg>`;
const esc = (texto) => String(texto).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ------------------------------------------------------------------
   Utilidades de domínio
------------------------------------------------------------------ */
/**
 * Produto vendido é o que tem preço e está ativo. Ser usada como insumo em
 * outra ficha não impede: o frango desfiado pode continuar entrando na
 * coxinha e ser vendido em pote. São duas coisas independentes.
 */
const fichasVendaveis = () => estado.catalogo.fichas.filter((f) => f.vendavel && f.ativo !== false);

/** Deduzido, não é campo: basta existir um insumo apontando para a ficha. */
const usadaComoInsumo = (ficha) => estado.catalogo.insumos.some((i) => i.fichaId === ficha.id);
const acharFicha = (id) => estado.catalogo.fichas.find((f) => f.id === id);
const acharInsumo = (id) => estado.catalogo.insumos.find((i) => i.id === id);
const nomeCategoria = (id) => {
  const c = estado.catalogo.categorias.find((x) => x.id === id);
  return c ? c.nome : 'Sem categoria';
};

/**
 * Cadastro inativo não aparece em lista de seleção, mas continua
 * existindo nos registros antigos que já apontam para ele.
 */
const categoriasDeCustoAtivas = () => estado.catalogo.categoriasDeCusto.filter((c) => c.ativa !== false);

function fichasComDiferenca() {
  return fichasVendaveis()
    .map((ficha) => ({ ficha, resumo: resumoDaFicha(ficha, estado.catalogo, estado.parametros) }))
    .filter(({ resumo }) => Math.abs(resumo.diferenca) >= 0.01);
}

/* ------------------------------------------------------------------
   Paginação.

   Uma grid de 163 linhas não se lê. Cada tabela tem a sua página guardada
   por uma chave, e qualquer busca ou filtro volta para a primeira: ficar
   na página 5 de um resultado que agora tem uma página só é o jeito mais
   fácil de alguém achar que o sistema perdeu os dados.
------------------------------------------------------------------ */
const POR_PAGINA = 25;

function paginaDe(chave) {
  return estado.paginas[chave] || 1;
}

function voltarPrimeiraPagina(chave) {
  estado.paginas[chave] = 1;
}

function fatiar(chave, itens, porPagina = POR_PAGINA) {
  const total = Math.max(1, Math.ceil(itens.length / porPagina));
  const pagina = Math.min(paginaDe(chave), total);
  estado.paginas[chave] = pagina;
  const inicio = (pagina - 1) * porPagina;
  return {
    visiveis: itens.slice(inicio, inicio + porPagina),
    pagina,
    totalDePaginas: total,
    primeiro: itens.length ? inicio + 1 : 0,
    ultimo: Math.min(inicio + porPagina, itens.length),
    total: itens.length
  };
}

function blocoPaginacao(chave, f, nomeDoItem = 'registros') {
  if (!f.total) return '';
  const contagem = `<span class="pag-contagem">Mostrando ${f.primeiro} a ${f.ultimo} de ${f.total} ${nomeDoItem}</span>`;
  if (f.totalDePaginas === 1) return `<div class="paginacao">${contagem}</div>`;

  return `<div class="paginacao">
    ${contagem}
    <div class="pag-botoes">
      <button class="botao botao-claro" data-acao="pagina" data-chave="${chave}" data-para="${f.pagina - 1}" ${f.pagina === 1 ? 'disabled' : ''}>Anterior</button>
      <span class="pag-atual">Página ${f.pagina} de ${f.totalDePaginas}</span>
      <button class="botao botao-claro" data-acao="pagina" data-chave="${chave}" data-para="${f.pagina + 1}" ${f.pagina === f.totalDePaginas ? 'disabled' : ''}>Próxima</button>
    </div>
  </div>`;
}

/* ------------------------------------------------------------------
   Telas
------------------------------------------------------------------ */
/* ------------------------------------------------------------------
   Visão geral: o painel de abertura.

   Tudo aqui sai da mesma base das outras telas, então os números batem
   com a tela de Custos e com o quadro de pedidos. Cada bloco leva para
   a tela onde o assunto se resolve: número que não leva a lugar nenhum
   é enfeite.
------------------------------------------------------------------ */
function dadosDaVisaoGeral() {
  const periodo = estado.periodoPainel;
  const base = { vendas, custos: estado.catalogo.custos, catalogo: estado.catalogo, hoje: HOJE };
  const indicadores = indicadoresDoPeriodo({ ...base, periodo });
  const { inicio, fim } = indicadores.intervalo;

  const vendasPeriodo = vendasDoIntervalo(vendas, inicio, fim);
  const custosPeriodo = custosDoIntervalo(estado.catalogo.custos, inicio, fim);
  const categorias = gastosPorCategoria(custosPeriodo);
  const dias = faturamentoPorDiaDaSemana(vendasPeriodo, estado.catalogo);
  const produtos = produtosVendidos({ vendas: vendasPeriodo, catalogo: estado.catalogo, parametros: estado.parametros });
  const serie = serieMensal({ ...base });

  return {
    indicadores, categorias, dias, produtos, serie,
    destaque: destaqueDoPeriodo({ indicadores, serie, categorias, produtos, dias })
  };
}

function cartaoIndicador({ rotulo, valor, variacao, diferenca, bomSeSobe = true, destino }) {
  let marca = '<span class="sem-base">sem base de comparação</span>';
  if (variacao !== null && variacao !== undefined) {
    const sobe = variacao >= 0;
    const bom = sobe === bomSeSobe;
    marca = `<span class="${bom ? 'variacao-boa' : 'variacao-ruim'}">${sobe ? '↑' : '↓'} ${formatarPercentual(Math.abs(variacao))}</span>
             <span class="suave">vs. período anterior</span>`;
  } else if (diferenca !== null && diferenca !== undefined) {
    const sobe = diferenca >= 0;
    marca = `<span class="${sobe ? 'variacao-boa' : 'variacao-ruim'}">${sobe ? '↑' : '↓'} ${(Math.abs(diferenca) * 100).toFixed(1).replace('.', ',')} p.p.</span>
             <span class="suave">vs. período anterior</span>`;
  }

  const corpo = `
    <div class="rotulo">${rotulo}</div>
    <div class="valor">${valor}</div>
    <div class="indicador-variacao">${marca}</div>`;

  return destino
    ? `<a class="cartao indicador indicador-link" href="${destino}">${corpo}</a>`
    : `<div class="cartao indicador">${corpo}</div>`;
}

function telaInicio() {
  const { indicadores, categorias, dias, produtos, serie, destaque } = dadosDaVisaoGeral();
  const i = indicadores;

  const porSituacao = {};
  estado.pedidos.forEach((p) => { porSituacao[p.status] = (porSituacao[p.status] || 0) + 1; });
  const SITUACOES = [
    { chave: 'RECEBIDO', nome: 'Recebidos' },
    { chave: 'EM_PREPARO', nome: 'Em preparo' },
    { chave: 'PRONTO', nome: 'Prontos' },
    { chave: 'ENTREGUE', nome: 'Entregues' },
    { chave: 'CANCELADO', nome: 'Cancelados' }
  ];

  const topQuantidade = produtos.porQuantidade[0];
  const topLucro = produtos.porLucro[0];

  return `
    <div class="cabecalho">
      <div>
        <h1 class="titulo">Visão geral</h1>
        <p class="subtitulo">Acompanhe o desempenho do seu negócio.</p>
      </div>
      <label class="campo" style="min-width:200px">Período
        <select data-acao="periodo-painel">
          ${PERIODOS.map((p) => `<option value="${p.valor}" ${p.valor === estado.periodoPainel ? 'selected' : ''}>${p.rotulo}</option>`).join('')}
        </select>
      </label>
    </div>

    <section class="grade grade-4">
      ${cartaoIndicador({ rotulo: 'Faturamento', valor: formatarMoeda(i.faturamento.valor), variacao: i.faturamento.variacao })}
      ${cartaoIndicador({ rotulo: 'Gastos', valor: formatarMoeda(i.gastos.valor), variacao: i.gastos.variacao, bomSeSobe: false, destino: '#/custos' })}
      ${cartaoIndicador({ rotulo: 'Lucro', valor: formatarMoeda(i.lucro.valor), variacao: i.lucro.variacao })}
      ${cartaoIndicador({ rotulo: 'Margem', valor: formatarPercentual(i.margem.valor), diferenca: i.margem.diferenca })}
    </section>

    <section class="grade grade-painel">
      <div class="cartao">
        <h2 class="cartao-titulo">Faturamento x Lucro</h2>
        <p class="cartao-nota">A faixa de baixo é o gasto e a de cima é o lucro. Quando a faixa verde afina, a margem apertou, mesmo com o faturamento subindo.</p>
        ${graficoFaturamentoLucro(serie)}
      </div>

      <div class="cartao">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap">
          <h2 class="cartao-titulo">Gastos por categoria</h2>
          <a class="atalho" href="#/custos">ver lançamentos</a>
        </div>
        <p class="cartao-nota">Para onde foi o dinheiro no período.</p>
        <div style="margin-top:16px">
          ${barrasHorizontais(categorias, { apoio: (c) => formatarPercentual(c.fatia) })}
        </div>
      </div>
    </section>

    <section class="cartao">
      <h2 class="cartao-titulo">Faturamento por dia da semana</h2>
      <p class="cartao-nota">Média por dia no período, para o dia que apareceu mais vezes não levar vantagem.</p>
      ${graficoDiaDaSemana(dias)}
    </section>

    <section class="grade grade-painel">
      <div class="cartao">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap">
          <h2 class="cartao-titulo">Produtos mais vendidos</h2>
          <a class="atalho" href="#/fichas">ver fichas</a>
        </div>
        <p class="cartao-nota">Quantidade vendida, com a margem de contribuição de cada um ao lado. Produto que vende muito com margem baixa aparece marcado.</p>
        <div style="margin-top:16px">
          ${barrasHorizontais(
            produtos.porQuantidade.map((p) => ({ nome: p.nome, valor: p.unidades, alerta: p.acimaDaMeta })),
            { formatar: (v) => `${v} un.`, apoio: (item) => {
              const p = produtos.porQuantidade.find((x) => x.nome === item.nome);
              return `margem ${formatarPercentual(p.margem)}`;
            } }
          )}
        </div>
        ${topQuantidade && topLucro && topQuantidade.fichaId !== topLucro.fichaId
          ? `<p class="cartao-nota" style="margin-top:14px;padding-top:12px;border-top:1px solid #EDEDE0">
               Quem mais gerou lucro no período foi <strong>${esc(topLucro.nome)}</strong>, com ${formatarMoeda(topLucro.lucro)}, e não o mais vendido.
             </p>`
          : ''}
      </div>

      <div class="cartao">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap">
          <h2 class="cartao-titulo">Pedidos de hoje</h2>
          <a class="atalho" href="#/pedidos">abrir o quadro</a>
        </div>
        <p class="cartao-nota">Situação do que está no quadro agora.</p>
        <div class="situacoes">
          ${SITUACOES.map((s) => `
            <a class="situacao" href="#/pedidos">
              <span class="situacao-num">${porSituacao[s.chave] || 0}</span>
              <span class="situacao-nome">${s.nome}</span>
            </a>`).join('')}
        </div>
      </div>
    </section>

    <section class="destaque destaque-${destaque.tom}">
      ${icone(destaque.tom === 'atencao' ? 'alerta' : 'info')}
      <div>
        <div class="destaque-rotulo">Destaque do período</div>
        <strong>${esc(destaque.titulo)}</strong>
        <p>${esc(destaque.texto)}</p>
      </div>
    </section>`;
}

/**
 * Margem por produto.
 *
 * O panorama do mês mora na visão geral. Aqui fica só o que ela não
 * responde: quanto custa e quanto sobra em cada produto. Tudo sai da
 * ficha técnica e da meta que a própria usuária configurou, nada é
 * estimado pelo sistema.
 */
function telaPainel() {
  const fm = fatiar('margem', fichasVendaveis());
  const linhas = fm.visiveis.map((ficha) => {
    const r = resumoDaFicha(ficha, estado.catalogo, estado.parametros);
    const margem = ficha.precoPraticado ? (ficha.precoPraticado - r.custoPorcao) / ficha.precoPraticado : 0;
    return `<tr>
      <td><a href="#/ficha/${ficha.id}">${esc(ficha.nome)}</a></td>
      <td class="suave">${esc(nomeCategoria(ficha.categoriaId))}</td>
      <td class="num suave">${formatarMoeda(r.custoPorcao)}</td>
      <td class="num">${formatarMoeda(ficha.precoPraticado)}</td>
      <td class="num suave">${formatarMoeda(r.precoSugerido)}</td>
      <td class="num ${r.acimaDaMeta ? 'valor-alerta' : 'valor-ok'}">${formatarPercentual(r.cmvReal)}</td>
      <td class="num suave">${formatarPercentual(r.metaCmv, 0)}</td>
      <td class="num">${formatarPercentual(margem)}</td>
    </tr>`;
  }).join('');

  const foraDaMeta = fichasVendaveis().filter((f) => resumoDaFicha(f, estado.catalogo, estado.parametros).acimaDaMeta);

  return `
    <div class="cabecalho">
      <div>
        <h1 class="titulo">Margem por produto</h1>
        <p class="subtitulo">Quanto custa e quanto sobra em cada produto. Os números vêm das fichas técnicas e mudam sozinhos quando um preço de insumo muda.</p>
      </div>
    </div>

    <section class="cartao">
      <div class="rolagem">
        <table>
          <thead><tr>
            <th>Produto</th><th>Categoria</th>
            <th class="num">Custo por porção</th><th class="num">Preço praticado</th>
            <th class="num">Preço sugerido</th><th class="num">CMV real</th>
            <th class="num">Meta de CMV</th><th class="num">Margem</th>
          </tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>
      ${blocoPaginacao('margem', fm, 'produtos')}
      <p class="cartao-nota" style="margin-top:14px">
        O CMV real é o custo por porção dividido pelo preço praticado. A margem é o que sobra desse preço depois do custo por porção.
        O preço sugerido é o que levaria o produto à meta de CMV configurada.
      </p>
    </section>

    <section class="cartao">
      <h2 class="cartao-titulo">Acima da meta de CMV</h2>
      <p class="cartao-nota">Produtos cujo CMV real passou da meta configurada para a categoria ou para o produto.</p>
      <div style="display:flex;flex-direction:column;gap:11px;margin-top:14px">
        ${foraDaMeta.length === 0
          ? '<div class="aviso aviso-neutro">' + icone('info') + '<div>Nenhum produto está acima da meta de CMV.</div></div>'
          : foraDaMeta.map((f) => {
              const r = resumoDaFicha(f, estado.catalogo, estado.parametros);
              return `<div class="aviso aviso-atencao">${icone('alerta')}<div>
                <strong>${esc(f.nome)}</strong>: a meta é ${formatarPercentual(r.metaCmv, 0)} e o preço de ${formatarMoeda(f.precoPraticado)} resulta em ${formatarPercentual(r.cmvReal)}.
              </div></div>`;
            }).join('')}
        ${foraDaMeta.length ? '<a class="botao" href="#/ajuste" style="text-decoration:none;align-self:flex-start">Ir para o ajuste de preços</a>' : ''}
      </div>
    </section>`;
}

function telaFichas() {
  const filtro = estado.filtroFichas;
  const todas = estado.catalogo.fichas.filter((f) => f.ativo !== false);
  const visiveis = todas.filter((f) => (
    filtro === 'vendidos' ? f.vendavel
      : filtro === 'insumos' ? usadaComoInsumo(f)
        : filtro === 'sem-preco' ? !f.vendavel && !usadaComoInsumo(f)
          : true));

  const f = fatiar('fichas', visiveis);
  const linhas = f.visiveis.map((ficha) => {
    const r = resumoDaFicha(ficha, estado.catalogo, estado.parametros);
    const insumo = usadaComoInsumo(ficha);
    return `<tr>
      <td>
        <a href="#/ficha/${ficha.id}">${esc(ficha.nome)}</a>
        ${insumo ? ' <span class="selo selo-neutro">usada como insumo</span>' : ''}
      </td>
      <td class="suave">${esc(nomeCategoria(ficha.categoriaId))}</td>
      <td class="num suave">${ficha.rendimento} ${ficha.vendavel ? 'porções' : 'kg'}</td>
      <td class="num">${formatarMoeda(r.custoPorcao)}</td>
      <td class="num">${ficha.vendavel ? formatarMoeda(ficha.precoPraticado) : '<span class="suave">não é vendida</span>'}</td>
      <td class="num">${ficha.vendavel ? `<span class="${r.acimaDaMeta ? 'valor-alerta' : 'valor-ok'}">${formatarPercentual(r.cmvReal)}</span>` : ''}</td>
      <td><div class="acoes-linha">
        <button class="acao-icone" data-acao="editar-ficha" data-id="${ficha.id}" aria-label="Editar ${esc(ficha.nome)}">${icone('editar')}</button>
        <button class="acao-icone perigo" data-acao="remover-ficha" data-id="${ficha.id}" aria-label="Remover ${esc(ficha.nome)}">${icone('excluir')}</button>
      </div></td>
    </tr>`;
  }).join('');

  const opcoes = [
    ['todos', `Todas (${todas.length})`],
    ['vendidos', `Vendidas (${todas.filter((f) => f.vendavel).length})`],
    ['insumos', `Usadas como insumo (${todas.filter(usadaComoInsumo).length})`],
    ['sem-preco', `Sem preço e sem uso (${todas.filter((f) => !f.vendavel && !usadaComoInsumo(f)).length})`]
  ];

  return `
    <div class="cabecalho">
      <div>
        <h1 class="titulo">Produtos e fichas</h1>
        <p class="subtitulo">Cada produto tem uma ficha técnica. Uma ficha pode ser vendida, servir de insumo em outras fichas, ou as duas coisas ao mesmo tempo.</p>
      </div>
      <div style="display:flex;gap:10px;align-items:flex-end">
        <label class="campo" style="min-width:230px">Mostrar
          <select data-acao="filtro-fichas">
            ${opcoes.map(([v, r]) => `<option value="${v}" ${v === filtro ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
        </label>
        <button class="botao" data-acao="novo-produto">Novo produto</button>
      </div>
    </div>
    <section class="cartao">
      <div class="rolagem">
        <table>
          <thead><tr><th>Produto</th><th>Categoria</th><th class="num">Rendimento</th><th class="num">Custo por porção</th><th class="num">Preço</th><th class="num">CMV real</th><th></th></tr></thead>
          <tbody>${linhas || '<tr><td colspan="7" class="suave">Nenhuma ficha neste filtro.</td></tr>'}</tbody>
        </table>
      </div>
      ${blocoPaginacao('fichas', f, 'fichas')}
    </section>`;
}

function telaFicha(id) {
  const ficha = acharFicha(id);
  if (!ficha) return '<p>Ficha não encontrada.</p>';
  const r = resumoDaFicha(ficha, estado.catalogo, estado.parametros);

  const linhas = ficha.ingredientes.map((linha, indice) => {
    const insumo = acharInsumo(linha.insumoId);
    const fator = fatorDeCorrecao(insumo);
    const bruto = linha.quantidade / fator;
    const preco = precoPorQuilo(insumo, estado.catalogo);
    return `<tr>
      <td>${esc(insumo ? insumo.nome : linha.insumoId)}${insumo && insumo.fichaId ? ' <span class="selo selo-neutro">sub-receita</span>' : ''}</td>
      <td class="num"><input type="number" step="0.001" min="0" class="entrada-num" value="${linha.quantidade}" data-acao="quantidade" data-ficha="${ficha.id}" data-indice="${indice}" aria-label="Quantidade de ${esc(insumo ? insumo.nome : '')}" style="max-width:120px"></td>
      <td class="num calculada suave">${fator.toFixed(2).replace('.', ',')}</td>
      <td class="num calculada suave">${formatarPeso(bruto)}</td>
      <td class="num calculada suave">${formatarMoeda(preco)}</td>
      <td class="num calculada forte">${formatarMoeda(custoDoIngrediente(linha, estado.catalogo))}</td>
      <td><div class="acoes-linha">
        <button class="acao-icone" data-acao="editar-ingrediente" data-ficha="${ficha.id}" data-indice="${indice}" aria-label="Trocar ingrediente">${icone('editar')}</button>
        <button class="acao-icone perigo" data-acao="remover-ingrediente" data-ficha="${ficha.id}" data-indice="${indice}" aria-label="Remover ingrediente">${icone('excluir')}</button>
      </div></td>
    </tr>`;
  }).join('');

  // Os dois blocos podem aparecer juntos: a mesma ficha pode virar insumo
  // em outra receita e também ser vendida em porção.
  const saida = rendimentoEmQuilos(ficha);
  const usadas = estado.catalogo.fichas.filter((f) => f.ingredientes.some((l) => {
    const i = acharInsumo(l.insumoId);
    return i && i.fichaId === ficha.id;
  }));

  const blocoUso = usadaComoInsumo(ficha)
    ? `<div class="cartao">
         <h2 class="cartao-titulo">Uso como insumo</h2>
         <p class="cartao-nota" style="margin-top:10px">
           Esta receita rende <strong>${formatarPeso(saida)}</strong> de produto, então ela entra nas outras fichas
           a <strong>${formatarMoeda(r.custoReceita / (saida || 1))}</strong> por quilo. Esse preço se atualiza sozinho
           quando o custo de algum ingrediente daqui muda.
         </p>
         ${usadas.length ? `<p class="cartao-nota" style="margin-top:10px">Usada em: ${usadas.map((f) => `<a href="#/ficha/${f.id}">${esc(f.nome)}</a>`).join(', ')}.</p>` : ''}
       </div>`
    : '';

  const blocoPreco = !ficha.vendavel
    ? `<div class="cartao">
         <h2 class="cartao-titulo">Não é vendida</h2>
         <p class="cartao-nota" style="margin-top:10px">Esta ficha não tem preço de venda. ${usadaComoInsumo(ficha) ? 'Ela existe para servir de insumo em outras receitas.' : 'Ela também não é usada como insumo em nenhuma outra ficha.'}</p>
       </div>`
    : `<div class="cartao" style="background:var(--oliva);color:var(--creme);border-color:var(--oliva)">
         <h2 class="cartao-titulo" style="color:var(--creme)">Preço</h2>
         <div style="display:flex;justify-content:space-between;align-items:baseline;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.15)">
           <span style="color:#C9C6AE">Preço sugerido</span>
           <span data-vivo="precoSugerido" style="font-family:'Cormorant Garamond',serif;font-size:28px">${formatarMoeda(r.precoSugerido)}</span>
         </div>
         <label class="campo" style="color:#C9C6AE;margin-top:16px">
           Preço praticado
           <input type="text" value="${formatarMoeda(ficha.precoPraticado)}" data-acao="preco-praticado" data-ficha="${ficha.id}" style="background:rgba(0,0,0,.18);border-color:rgba(255,255,255,.2);color:var(--creme);font-size:21px;min-height:48px">
         </label>
         <div class="aviso ${r.acimaDaMeta ? 'aviso-atencao' : 'aviso-neutro'}" style="margin-top:16px">
           ${icone(r.acimaDaMeta ? 'alerta' : 'info')}
           <div>Com ${formatarMoeda(ficha.precoPraticado)} o CMV real fica em <strong data-vivo="cmvReal">${formatarPercentual(r.cmvReal)}</strong>, ${r.acimaDaMeta ? 'acima' : 'dentro'} da meta de ${formatarPercentual(r.metaCmv, 0)}.</div>
         </div>
       </div>`;

  return `
    <div class="cabecalho">
      <div>
        <div class="trilha">Produtos e fichas / ${esc(nomeCategoria(ficha.categoriaId))}</div>
        <h1 class="titulo">${esc(ficha.nome)}</h1>
        <p class="subtitulo">Digite apenas a quantidade de cada insumo. As colunas em destaque são calculadas e se atualizam sozinhas.</p>
      </div>
      <div style="display:flex;gap:10px">
        <a class="botao botao-claro" href="#/fichas" style="text-decoration:none">Voltar</a>
        <button class="botao" data-acao="editar-ficha" data-id="${ficha.id}">Editar produto</button>
      </div>
    </div>

    <section class="cartao grade grade-3">
      <label class="campo">Rendimento
        <input type="number" min="1" value="${ficha.rendimento}" data-acao="rendimento" data-ficha="${ficha.id}">
      </label>
      <label class="campo">Tamanho da porção
        <input type="text" value="${esc(ficha.tamanhoPorcao)}" disabled>
      </label>
      <label class="campo">Meta de CMV deste produto
        <input type="text" value="${formatarPercentual(r.metaCmv, 0)}" data-acao="meta" data-ficha="${ficha.id}">
      </label>
    </section>

    <section class="cartao">
      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:baseline">
        <h2 class="cartao-titulo">Ingredientes</h2>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <span class="cartao-nota">As colunas com fundo claro são calculadas pelo sistema</span>
          <button class="botao botao-claro" data-acao="novo-ingrediente" data-ficha="${ficha.id}">Adicionar ingrediente</button>
        </div>
      </div>
      <div class="rolagem" style="margin-top:14px">
        <table>
          <thead><tr>
            <th>Insumo</th><th class="num">Quantidade (kg)</th>
            <th class="num calculada">Fator de correção</th><th class="num calculada">Peso bruto</th>
            <th class="num calculada">Preço por kg</th><th class="num calculada">Custo</th><th></th>
          </tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>
    </section>

    <section class="grade grade-2">
      <div class="cartao">
        <h2 class="cartao-titulo">Custo</h2>
        <div style="margin-top:12px">
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #EDEDE0"><span class="suave">Custo da receita inteira</span><span data-vivo="custoReceita">${formatarMoeda(r.custoReceita)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #EDEDE0"><span class="suave">Peso total</span><span data-vivo="pesoTotal">${formatarPeso(r.pesoTotal)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #EDEDE0"><span class="suave">Perda de produção</span><span>${formatarPercentual(estado.parametros.perdaProducao, 0)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #EDEDE0"><span class="suave">Embalagem por porção</span><span>${formatarMoeda(estado.parametros.custoEmbalagem)}</span></div>
          <div style="display:flex;justify-content:space-between;padding:14px 0 0;font-size:17px"><strong>Custo por porção</strong><strong data-vivo="custoPorcao">${formatarMoeda(r.custoPorcao)}</strong></div>
        </div>
      </div>
      ${blocoUso}
      ${blocoPreco}
    </section>`;
}

function telaAjuste() {
  const itens = fichasComDiferenca();
  if (itens.length === 0) {
    return `
      <div class="cabecalho"><div><h1 class="titulo">Ajuste de preços</h1></div></div>
      <div class="aviso aviso-neutro">${icone('info')}<div>Nenhum produto está com o preço diferente do sugerido.</div></div>`;
  }

  const marcados = itens.filter(({ ficha }) => estado.selecionados[ficha.id]).length;
  const linhas = itens.map(({ ficha, resumo }) => {
    const marcado = !!estado.selecionados[ficha.id];
    const novo = estado.novosPrecos[ficha.id] !== undefined ? estado.novosPrecos[ficha.id] : resumo.precoSugerido;
    const cmvNovo = cmvReal(ficha, estado.catalogo, estado.parametros, novo);
    const acima = cmvNovo > resumo.metaCmv + estado.parametros.toleranciaCmv;
    const diferenca = novo - ficha.precoPraticado;
    return `<tr class="${marcado ? 'linha-marcada' : ''}">
      <td style="width:44px"><input type="checkbox" ${marcado ? 'checked' : ''} data-acao="selecionar" data-ficha="${ficha.id}" aria-label="Selecionar ${esc(ficha.nome)}"></td>
      <td>
        <div>${esc(ficha.nome)}</div>
        <div class="suave" style="font-size:13px">${resumo.acimaDaMeta ? 'CMV acima da meta' : 'dentro da meta, ajuste opcional'}</div>
      </td>
      <td class="num suave">${formatarMoeda(resumo.custoPorcao)}</td>
      <td class="num">${formatarMoeda(ficha.precoPraticado)}</td>
      <td class="num ${resumo.acimaDaMeta ? 'valor-alerta' : 'valor-ok'}">${formatarPercentual(resumo.cmvReal)}</td>
      <td class="num" style="min-width:150px">
        <input type="text" class="entrada-num" value="${formatarMoeda(novo)}" data-acao="novo-preco" data-ficha="${ficha.id}" aria-label="Novo preço de ${esc(ficha.nome)}">
        <div class="suave" style="font-size:12px;margin-top:5px">sugerido ${formatarMoeda(resumo.precoSugerido)}</div>
      </td>
      <td class="num">
        <div class="${acima ? 'valor-alerta' : 'valor-ok'}">${formatarPercentual(cmvNovo)}</div>
        <div class="suave" style="font-size:12px;margin-top:3px">${Math.abs(diferenca) < 0.01 ? 'sem mudança' : (diferenca > 0 ? '+ ' : '− ') + formatarMoeda(Math.abs(diferenca))}</div>
      </td>
    </tr>`;
  }).join('');

  return `
    <div class="cabecalho">
      <div>
        <div class="trilha">Produtos e fichas</div>
        <h1 class="titulo">Ajuste de preços</h1>
        <p class="subtitulo">O campo Novo preço já vem com o sugerido e aceita outro valor. Marque os produtos que quer atualizar e aplique de uma vez.</p>
      </div>
    </div>

    <section class="cartao" style="padding:0;overflow:hidden">
      <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;padding:16px 22px;background:var(--creme-col);border-bottom:1px solid var(--areia)">
        <label style="display:flex;align-items:center;gap:10px;font-size:15px;cursor:pointer">
          <input type="checkbox" ${marcados === itens.length ? 'checked' : ''} data-acao="selecionar-todos"> Selecionar todos
        </label>
        <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center">
          <span class="suave" style="font-size:14px">${marcados === 1 ? '1 produto selecionado' : marcados + ' produtos selecionados'}</span>
          <button class="botao" data-acao="aplicar" ${marcados === 0 ? 'disabled' : ''}>Aplicar aos selecionados</button>
        </div>
      </div>
      <div class="rolagem" style="padding:0 22px 18px">
        <table>
          <thead><tr>
            <th></th><th>Produto</th><th class="num">Custo por porção</th><th class="num">Preço atual</th>
            <th class="num">CMV atual</th><th class="num">Novo preço</th><th class="num">CMV resultante</th>
          </tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>
    </section>

    <div class="aviso aviso-neutro">${icone('info')}<div><strong>O que acontece ao aplicar.</strong> O preço praticado dos produtos marcados passa a ser o valor do campo Novo preço. Num sistema de verdade, pedidos já registrados guardariam o preço com que foram vendidos.</div></div>`;
}

function telaInsumos() {
  const busca = normalizar(estado.buscaInsumo || '');
  const todos = estado.catalogo.insumos.filter((i) => i.ativo !== false);
  const visiveis = busca
    ? todos.filter((i) => normalizar(i.nome).includes(busca) || normalizar(i.fornecedor || '').includes(busca))
    : todos;

  const f = fatiar('insumos', visiveis);
  const linhas = f.visiveis.map((insumo) => {
    const desatualizado = !!insumo.cotacao && insumo.cotacao < '2026-07-01';
    return `<tr>
      <td>${esc(insumo.nome)}${insumo.fichaId ? ' <span class="selo selo-neutro">preço vem da ficha</span>' : ''}</td>
      <td class="suave">${esc(insumo.unidade)}</td>
      <td class="num suave">${insumo.pesoLiquido.toFixed(3).replace('.', ',')}</td>
      <td class="num calculada suave">${fatorDeCorrecao(insumo).toFixed(2).replace('.', ',')}</td>
      <td class="num">${insumo.fichaId
        ? `<span class="suave">${formatarMoeda(precoPorQuilo(insumo, estado.catalogo))}</span>`
        : `<input type="text" class="entrada-num" value="${formatarMoeda(insumo.preco)}" data-acao="preco-insumo" data-insumo="${insumo.id}" aria-label="Preço de ${esc(insumo.nome)}" style="max-width:130px">`}</td>
      <td class="suave">${esc(insumo.fornecedor)}</td>
      <td class="${desatualizado ? 'valor-alerta' : 'suave'}">${insumo.cotacao
        ? insumo.cotacao.split('-').reverse().join('/')
        : '<span class="suave">não informada</span>'}</td>
      <td><div class="acoes-linha">
        <button class="acao-icone" data-acao="editar-insumo" data-id="${insumo.id}" aria-label="Editar ${esc(insumo.nome)}">${icone('editar')}</button>
        <button class="acao-icone perigo" data-acao="remover-insumo" data-id="${insumo.id}" aria-label="Remover ${esc(insumo.nome)}">${icone('excluir')}</button>
      </div></td>
    </tr>`;
  }).join('');

  const inativos = estado.catalogo.insumos.length - todos.length;

  return `
    <div class="cabecalho">
      <div>
        <h1 class="titulo">Insumos</h1>
        <p class="subtitulo">O que você compra para produzir. Mudar um preço aqui recalcula na hora o custo de toda ficha que usa esse insumo.</p>
      </div>
      <div style="display:flex;gap:10px;align-items:flex-end">
        <label class="campo" style="min-width:220px">Buscar
          <input type="search" value="${esc(estado.buscaInsumo || '')}" data-acao="buscar-insumo" placeholder="nome ou fornecedor">
        </label>
        <button class="botao" data-acao="novo-insumo">Novo insumo</button>
      </div>
    </div>

    <section class="cartao">
      <div class="rolagem">
        <table>
          <thead><tr>
            <th>Insumo</th><th>Unidade</th><th class="num">Peso líquido</th>
            <th class="num calculada">Fator de correção</th><th class="num">Preço por kg</th>
            <th>Fornecedor</th><th>Cotação</th><th></th>
          </tr></thead>
          <tbody>${linhas || '<tr><td colspan="8" class="suave">Nenhum insumo encontrado.</td></tr>'}</tbody>
        </table>
      </div>
      ${blocoPaginacao('insumos', f, 'insumos')}
      <p class="cartao-nota" style="margin-top:14px">
        ${inativos ? `Fora da lista, ${inativos} insumo${inativos > 1 ? 's inativos' : ' inativo'}. ` : ''}A data de cotação é a do último preço informado. Quando fica velha, aparece em destaque, porque o custo das fichas passa a ser calculado sobre um preço vencido.
      </p>
    </section>`;
}

/**
 * Importação de custos a partir de um CSV.
 * A planilha é lida, validada linha a linha e mostrada numa prévia.
 * Nada entra na base antes da confirmação.
 */
const COLUNAS_ESPERADAS = ['data', 'categoria', 'descricao', 'valor', 'status'];

export function separarLinhaCsv(linha, separador = ';') {
  const campos = [];
  let atual = '';
  let dentroDeAspas = false;
  for (let i = 0; i < linha.length; i += 1) {
    const caractere = linha[i];
    if (caractere === '"') {
      if (dentroDeAspas && linha[i + 1] === '"') { atual += '"'; i += 1; }
      else dentroDeAspas = !dentroDeAspas;
    } else if (caractere === separador && !dentroDeAspas) {
      campos.push(atual.trim());
      atual = '';
    } else {
      atual += caractere;
    }
  }
  campos.push(atual.trim());
  return campos;
}

/**
 * O separador é decidido pelo cabeçalho. Não dá para aceitar ponto e vírgula
 * e vírgula ao mesmo tempo: num arquivo brasileiro a vírgula é decimal, e
 * tratá-la como separador parte "215,40" em dois campos.
 */
export function detectarSeparador(cabecalho) {
  return cabecalho.split(';').length >= cabecalho.split(',').length ? ';' : ',';
}

function normalizar(texto) {
  return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function dataExiste(ano, mes, dia) {
  const data = new Date(Date.UTC(ano, mes - 1, dia));
  return data.getUTCFullYear() === ano && data.getUTCMonth() === mes - 1 && data.getUTCDate() === dia;
}

function lerData(texto) {
  const valor = String(texto).trim();
  const iso = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso && dataExiste(+iso[1], +iso[2], +iso[3])) return valor;
  const brasileira = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brasileira && dataExiste(+brasileira[3], +brasileira[2], +brasileira[1])) {
    return `${brasileira[3]}-${brasileira[2]}-${brasileira[1]}`;
  }
  return null;
}

export function analisarCsvDeCustos(texto, categoriasConhecidas) {
  const linhas = texto.split(/\r?\n/).filter((l) => l.trim().length);
  if (!linhas.length) return { erroGeral: 'O arquivo está vazio.', linhas: [] };

  const separador = detectarSeparador(linhas[0]);
  const cabecalho = separarLinhaCsv(linhas[0], separador).map(normalizar);
  const faltando = COLUNAS_ESPERADAS.filter((coluna) => !cabecalho.includes(coluna));
  if (faltando.length) {
    return {
      erroGeral: `A planilha precisa ter as colunas ${COLUNAS_ESPERADAS.join(', ')}. Faltou: ${faltando.join(', ')}.`,
      linhas: []
    };
  }

  const indice = {};
  COLUNAS_ESPERADAS.forEach((coluna) => { indice[coluna] = cabecalho.indexOf(coluna); });

  const resultado = linhas.slice(1).map((linhaBruta, posicao) => {
    const campos = separarLinhaCsv(linhaBruta, separador);
    const problemas = [];

    const data = lerData(campos[indice.data] || '');
    if (!data) problemas.push('data inválida');

    const categoria = (campos[indice.categoria] || '').trim();
    if (!categoria) problemas.push('categoria vazia');
    else if (!categoriasConhecidas.some((c) => normalizar(c) === normalizar(categoria))) problemas.push('categoria não cadastrada');

    const descricao = (campos[indice.descricao] || '').trim();
    if (!descricao) problemas.push('descrição vazia');

    const valor = lerMoeda(campos[indice.valor] || '');
    if (!valor) problemas.push('valor inválido');
    else if (valor < 0) problemas.push('valor negativo');

    const status = normalizar(campos[indice.status] || '');
    const pago = status === 'pago';

    return { numero: posicao + 2, data, categoria, descricao, valor, pago, problemas };
  });

  return { erroGeral: null, linhas: resultado };
}

function blocoImportacao() {
  const { erroGeral, linhas, arquivo } = estado.importacao;

  if (erroGeral) {
    return `<section class="cartao">
      <h2 class="cartao-titulo">Importar planilha</h2>
      <div class="aviso aviso-atencao" style="margin-top:14px">${icone('alerta')}<div>${esc(erroGeral)}</div></div>
      <div style="margin-top:16px"><button class="botao botao-claro" data-acao="cancelar-importacao">Fechar</button></div>
    </section>`;
  }

  const validas = linhas.filter((l) => !l.problemas.length);
  const invalidas = linhas.filter((l) => l.problemas.length);

  const corpo = linhas.map((l) => `<tr>
    <td class="suave">${l.numero}</td>
    <td class="suave">${l.data ? l.data.split('-').reverse().join('/') : '—'}</td>
    <td>${esc(l.categoria || '—')}</td>
    <td class="suave">${esc(l.descricao || '—')}</td>
    <td class="num">${l.valor ? formatarMoeda(l.valor) : '—'}</td>
    <td>${l.problemas.length
      ? `<span class="selo selo-alerta">${esc(l.problemas.join(', '))}</span>`
      : '<span class="selo selo-ok">pronta para importar</span>'}</td>
  </tr>`).join('');

  return `<section class="cartao">
    <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:baseline">
      <div>
        <h2 class="cartao-titulo">Prévia da importação</h2>
        <p class="cartao-nota">${esc(arquivo)}, ${linhas.length} ${linhas.length === 1 ? 'linha' : 'linhas'}. Nada é gravado antes de você confirmar.</p>
      </div>
      <div style="display:flex;gap:10px">
        <button class="botao botao-claro" data-acao="cancelar-importacao">Cancelar</button>
        <button class="botao" data-acao="confirmar-importacao" ${validas.length ? '' : 'disabled'}>Importar ${validas.length} ${validas.length === 1 ? 'linha' : 'linhas'}</button>
      </div>
    </div>
    ${invalidas.length ? `<div class="aviso aviso-atencao" style="margin-top:14px">${icone('alerta')}<div>${invalidas.length} ${invalidas.length === 1 ? 'linha será ignorada' : 'linhas serão ignoradas'} por causa dos problemas marcados abaixo. As demais podem ser importadas normalmente.</div></div>` : ''}
    <div class="rolagem" style="margin-top:14px">
      <table>
        <thead><tr><th>Linha</th><th>Data</th><th>Categoria</th><th>Descrição</th><th class="num">Valor</th><th>Situação</th></tr></thead>
        <tbody>${corpo}</tbody>
      </table>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------
   Lançamento de custo, em dois modos.

   Simples é o gasto e nada mais: luz, aluguel, gás. Compra é a feira,
   item a item, e é o único modo que mexe no preço dos insumos. Separar
   os dois evita que ela precise pensar em ficha técnica para lançar a
   conta de luz, que é o lançamento mais frequente depois da compra.
------------------------------------------------------------------ */
function abasDeCusto() {
  const abas = [['simples', 'Conta ou despesa'], ['compra', 'Compra de ingredientes']];
  return `<div class="abas" style="margin-top:16px">
    ${abas.map(([id, rotulo]) => `
      <button class="aba ${estado.abaCusto === id ? 'ativa' : ''}" data-acao="aba-custo" data-aba="${id}">${rotulo}</button>`).join('')}
  </div>`;
}

function formularioDeCustoSimples() {
  /* Ingredientes vai para o fim da lista: ela continua podendo lançar a
     feira por aqui, mas como a compra tem aba própria, deixar Ingredientes
     pré-selecionado faria a conta de luz virar ingrediente por descuido. */
  const categorias = categoriasDeCustoAtivas();
  const ordenadas = categorias.filter((c) => c.nome !== 'Ingredientes')
    .concat(categorias.filter((c) => c.nome === 'Ingredientes'));
  const opcoes = ordenadas.map((c) => `<option>${esc(c.nome)}</option>`).join('');

  return `
    <div class="grade grade-4" style="margin-top:16px">
      <label class="campo">Data<input type="date" id="custo-data" value="${HOJE}"></label>
      <label class="campo">Categoria<select id="custo-categoria">${opcoes}</select></label>
      <label class="campo">Descrição<input type="text" id="custo-descricao" placeholder="Conta de luz"></label>
      <label class="campo">Valor<input type="text" id="custo-valor" class="entrada-num" placeholder="R$ 0,00"></label>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;margin-top:16px">
      <label style="display:flex;align-items:center;gap:10px;font-size:15px;cursor:pointer"><input type="checkbox" id="custo-pago"> Já está pago</label>
      <button class="botao" data-acao="lancar-custo">Lançar custo</button>
    </div>`;
}

function formularioDeCompra() {
  const fornecedores = estado.catalogo.fornecedores.filter((f) => f.ativa !== false);
  return `
    <div class="grade grade-3" style="margin-top:16px">
      <label class="campo">Data<input type="date" id="compra-data" value="${HOJE}"></label>
      <label class="campo">Fornecedor
        <input type="text" id="compra-fornecedor" list="lista-fornecedores" placeholder="Feirinha" autocomplete="off">
        <datalist id="lista-fornecedores">${fornecedores.map((f) => `<option value="${esc(f.nome)}"></option>`).join('')}</datalist>
      </label>
      <label class="campo">Forma de pagamento<select id="compra-pagamento">
        ${estado.catalogo.formasDePagamento.filter((f) => f.ativa !== false)
          .map((f) => `<option>${esc(f.nome)}</option>`).join('')}
      </select></label>
    </div>

    <div class="compra-cabecalho">
      <span>Insumo</span><span>Quantidade</span><span>Valor pago</span><span class="num">Preço por unidade</span><span></span>
    </div>
    <div id="listaCompra"></div>
    <datalist id="lista-insumos">
      ${estado.catalogo.insumos.filter((i) => i.ativo !== false && !i.fichaId)
        .map((i) => `<option value="${esc(i.nome)}"></option>`).join('')}
    </datalist>

    <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;margin-top:14px">
      <button class="botao botao-claro" data-acao="add-item-compra">Adicionar item</button>
      <div style="display:flex;gap:18px;align-items:center">
        <span class="suave" style="font-size:14px">Total da compra</span>
        <span class="forte" id="totalDaCompra" style="font-size:19px">${formatarMoeda(0)}</span>
      </div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;margin-top:16px">
      <label style="display:flex;align-items:center;gap:10px;font-size:15px;cursor:pointer"><input type="checkbox" id="compra-pago" checked> Já está paga</label>
      <button class="botao" data-acao="lancar-compra">Lançar compra</button>
    </div>
    <p class="cartao-nota" style="margin-top:14px">
      A quantidade é na unidade em que o insumo é comprado, quase sempre o quilo. O preço por unidade é o valor dividido pela quantidade, e é ele que passa a valer na ficha técnica. Quando a mudança for grande, o sistema pergunta antes de aplicar.
    </p>`;
}

function linhaDeCompra() {
  const lista = document.getElementById('listaCompra');
  if (!lista) return;
  const linha = document.createElement('div');
  linha.className = 'linha-compra';
  linha.innerHTML = `
    <input class="ic-nome" list="lista-insumos" placeholder="Nome do insumo" autocomplete="off">
    <input class="ic-qtd" type="number" min="0" step="0.001" placeholder="0,000" aria-label="Quantidade">
    <input class="ic-valor" type="number" min="0" step="0.01" placeholder="0,00" aria-label="Valor pago">
    <span class="ic-unitario num suave">—</span>
    <button class="rm-item" data-acao="remover-item-compra" aria-label="Remover item">×</button>`;
  lista.appendChild(linha);
}

/** Lê as linhas da compra direto do DOM, para digitar não redesenhar a tela. */
function itensDaCompra() {
  return [...document.querySelectorAll('#listaCompra .linha-compra')].map((l) => {
    const nome = normalizar(l.querySelector('.ic-nome').value.trim());
    const insumo = estado.catalogo.insumos.find((i) => normalizar(i.nome) === nome);
    return {
      insumoId: insumo ? insumo.id : '',
      nomeDigitado: l.querySelector('.ic-nome').value.trim(),
      quantidade: parseFloat(l.querySelector('.ic-qtd').value) || 0,
      valor: parseFloat(l.querySelector('.ic-valor').value) || 0
    };
  });
}

function atualizarPreviaDaCompra() {
  const linhas = [...document.querySelectorAll('#listaCompra .linha-compra')];
  const itens = itensDaCompra();
  linhas.forEach((l, i) => {
    const unitario = precoUnitario(itens[i]);
    l.querySelector('.ic-unitario').textContent = unitario ? formatarMoeda(unitario) : '—';
  });
  const alvo = document.getElementById('totalDaCompra');
  if (alvo) alvo.textContent = formatarMoeda(totalDaCompra(itens));
}

function telaCustos() {
  const doMes = estado.catalogo.custos.filter((c) => c.data.startsWith('2026-10'));
  const total = doMes.reduce((t, c) => t + c.valor, 0);
  const pago = doMes.filter((c) => c.pago).reduce((t, c) => t + c.valor, 0);

  const fp = fatiar('custos', estado.catalogo.custos);
  const linhas = fp.visiveis.map((c) => `
    <tr>
      <td class="suave">${c.data.split('-').reverse().join('/')}</td>
      <td>${esc(c.categoria)}</td>
      <td class="suave">${esc(c.descricao)}</td>
      <td class="num forte">${formatarMoeda(c.valor)}</td>
      <td><button class="selo ${c.pago ? 'selo-ok' : 'selo-alerta'}" data-acao="alternar-pago" data-id="${c.id}">${c.pago ? 'Pago' : 'A pagar'}</button></td>
      <td><div class="acoes-linha">
        <button class="acao-icone" data-acao="editar-custo" data-id="${c.id}" aria-label="Editar lançamento">${icone('editar')}</button>
        <button class="acao-icone perigo" data-acao="remover-custo" data-id="${c.id}" aria-label="Remover lançamento">${icone('excluir')}</button>
      </div></td>
    </tr>`).join('');

  return `
    <div class="cabecalho">
      <div>
        <h1 class="titulo">Custos</h1>
        <p class="subtitulo">Uma linha por gasto. Os totais do painel saem daqui.</p>
      </div>
      <div style="display:flex;gap:10px">
        <button class="botao botao-claro" data-acao="abrir-importacao">Importar planilha</button>
        <a class="botao botao-claro" href="modelo-custos.csv" download style="text-decoration:none">Baixar modelo</a>
      </div>
    </div>

    ${estado.importacao ? blocoImportacao() : ''}
    <input type="file" id="arquivo-importacao" accept=".csv,text/csv" style="display:none">

    <section class="grade grade-3">
      <div class="cartao indicador"><div class="rotulo">Total de outubro</div><div class="valor">${formatarMoeda(total)}</div></div>
      <div class="cartao indicador"><div class="rotulo">Pago</div><div class="valor">${formatarMoeda(pago)}</div></div>
      <div class="cartao indicador"><div class="rotulo">A pagar</div><div class="valor valor-alerta">${formatarMoeda(total - pago)}</div></div>
    </section>

    <section class="cartao">
      <h2 class="cartao-titulo">Novo custo</h2>
      <p class="cartao-nota">Conta do mês é lançamento simples. Compra de ingrediente vale lançar item a item: aí o preço dos insumos se atualiza sozinho e o custo das fichas acompanha.</p>
      ${abasDeCusto()}
      <div class="aviso aviso-neutro" id="avisoDaCompra" style="display:none;margin-top:16px">${icone('info')}<div></div></div>
      ${estado.abaCusto === 'compra' ? formularioDeCompra() : formularioDeCustoSimples()}
    </section>

    <section class="cartao">
      <div class="rolagem">
        <table>
          <thead><tr><th>Data</th><th>Categoria</th><th>Descrição</th><th class="num">Valor</th><th>Situação</th><th></th></tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>
      ${blocoPaginacao('custos', fp, 'lançamentos')}
    </section>`;
}

/* ------------------------------------------------------------------
   Diálogos. Um só contêiner na casca da página, preenchido na hora.
   São três usos: confirmar uma remoção, preencher um cadastro e
   lançar ou editar um custo.
------------------------------------------------------------------ */
let confirmacaoPendente = null;
let confirmacaoDeCompra = null;
let formularioAtivo = null;
let custoEmEdicao = null;

function abrirDialogo(html, largo = false) {
  const caixa = document.getElementById('diagCaixa');
  caixa.innerHTML = html;
  caixa.classList.toggle('diag-caixa-larga', largo);
  document.getElementById('diagFundo').classList.add('aberto');
  const primeiro = document.querySelector('#diagCaixa input, #diagCaixa select');
  if (primeiro) setTimeout(() => primeiro.focus(), 40);
}

function fecharDialogo() {
  const fundo = document.getElementById('diagFundo');
  if (fundo) fundo.classList.remove('aberto');
  // o conteúdo sai do DOM junto: senão sobram campos com id repetido
  const caixa = document.getElementById('diagCaixa');
  if (caixa) caixa.innerHTML = '';
  confirmacaoPendente = null;
  confirmacaoDeCompra = null;
  formularioAtivo = null;
  custoEmEdicao = null;
}

function confirmar({ titulo, texto, textoAcao = 'Remover', aoConfirmar }) {
  abrirDialogo(`
    <h2 class="diag-titulo">${esc(titulo)}</h2>
    <p class="diag-texto">${esc(texto)}</p>
    <div class="diag-acoes">
      <button class="botao botao-claro" data-diag="cancelar">Cancelar</button>
      <button class="botao botao-perigo" data-diag="confirmar">${esc(textoAcao)}</button>
    </div>`);
  confirmacaoPendente = aoConfirmar;
}

function campoDoFormulario(c) {
  if (c.tipo === 'checkbox') {
    return `<label style="display:flex;align-items:center;gap:10px;font-size:15px;cursor:pointer">
      <input type="checkbox" id="campo-${c.id}" ${c.valor ? 'checked' : ''}> ${esc(c.rotulo)}
    </label>`;
  }

  if (c.tipo === 'select') {
    return `<label class="campo">${esc(c.rotulo)}
      <select id="campo-${c.id}">
        ${c.opcoes.map((o) => `<option value="${esc(o.valor)}" ${String(o.valor) === String(c.valor) ? 'selected' : ''}>${esc(o.rotulo)}</option>`).join('')}
      </select>
    </label>`;
  }

  // só de leitura serve para mostrar um número que o sistema calcula
  if (c.tipo === 'leitura') {
    return `<label class="campo">${esc(c.rotulo)}
      <input type="text" id="campo-${c.id}" value="${esc(c.valor || '')}" disabled>
      ${c.nota ? `<span class="suave" style="font-size:12px">${esc(c.nota)}</span>` : ''}
    </label>`;
  }

  return `<label class="campo">${esc(c.rotulo)}
    <input type="${c.tipo || 'text'}" id="campo-${c.id}" value="${esc(c.valor == null ? '' : c.valor)}"
           placeholder="${esc(c.placeholder || '')}" ${c.passo ? `step="${c.passo}"` : ''}>
    ${c.nota ? `<span class="suave" style="font-size:12px">${esc(c.nota)}</span>` : ''}
  </label>`;
}

function abrirFormulario({ titulo, nota, campos, aoSalvar, textoSalvar = 'Salvar', largo = false }) {
  abrirDialogo(`
    <h2 class="diag-titulo">${esc(titulo)}</h2>
    ${nota ? `<p class="diag-texto">${esc(nota)}</p>` : ''}
    <div class="diag-campos${largo ? ' diag-campos-duplos' : ''}">${campos.map(campoDoFormulario).join('')}</div>
    <div class="aviso aviso-atencao" id="diag-aviso" style="display:none"></div>
    <div class="diag-acoes">
      <button class="botao botao-claro" data-diag="cancelar">Cancelar</button>
      <button class="botao" data-diag="salvar">${esc(textoSalvar)}</button>
    </div>`, largo);
  formularioAtivo = { campos, aoSalvar };
}

function lerFormularioAtivo() {
  const valores = {};
  formularioAtivo.campos.forEach((c) => {
    if (c.tipo === 'leitura') return;
    const campo = document.getElementById(`campo-${c.id}`);
    valores[c.id] = c.tipo === 'checkbox' ? campo.checked : campo.value.trim();
  });
  return valores;
}

/** Recado dentro do diálogo, para o erro não fechar o que a pessoa digitou. */
function avisarNoDialogo(texto) {
  const aviso = document.getElementById('diag-aviso');
  if (!aviso) return;
  aviso.textContent = texto;
  aviso.style.display = texto ? 'flex' : 'none';
}

/* ------------------------------------------------------------------
   Cadastros com vínculo futuro (categorias, fornecedores, unidades,
   formas de pagamento): edição e remoção em diálogo, com inativação
   no lugar da remoção quando o cadastro já está em uso.
------------------------------------------------------------------ */
const novoId = (nome, lista) => slugify(nome, lista);

function slugify(nome, listaExistente) {
  const base = String(nome).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'item';
  let slug = base;
  let n = 2;
  while (listaExistente.some((i) => i.id === slug)) { slug = `${base}-${n}`; n += 1; }
  return slug;
}

function camposComAtivo(base, item) {
  return item ? [...base, { id: 'ativa', rotulo: 'Cadastro ativo', tipo: 'checkbox', valor: item.ativa !== false }] : base;
}

const CADASTROS = {
  categoria: {
    lista: () => estado.catalogo.categorias,
    usoQtd: (item) => estado.catalogo.fichas.filter((f) => f.categoriaId === item.id).length,
    campos: (item) => camposComAtivo([
      { id: 'nome', rotulo: 'Nome', valor: item ? item.nome : '' },
      { id: 'metaCmv', rotulo: 'Meta de CMV', valor: formatarPercentual(item ? item.metaCmv : estado.parametros.metaCmvPadrao, 0) }
    ], item),
    criar: (v) => ({ id: slugify(v.nome, estado.catalogo.categorias), nome: v.nome, metaCmv: lerMoeda(v.metaCmv) / 100 || estado.parametros.metaCmvPadrao, ativa: true }),
    atualizar: (item, v) => { item.nome = v.nome; item.metaCmv = (lerMoeda(v.metaCmv) / 100) || item.metaCmv; item.ativa = v.ativa; },
    excluir: (item) => { estado.catalogo.categorias = estado.catalogo.categorias.filter((c) => c !== item); }
  },
  categoriaCusto: {
    lista: () => estado.catalogo.categoriasDeCusto,
    usoQtd: (item) => estado.catalogo.custos.filter((c) => c.categoria === item.nome).length,
    campos: (item) => camposComAtivo([{ id: 'nome', rotulo: 'Nome', valor: item ? item.nome : '' }], item),
    criar: (v) => ({ id: slugify(v.nome, estado.catalogo.categoriasDeCusto), nome: v.nome, ativa: true }),
    atualizar: (item, v) => {
      estado.catalogo.custos.filter((c) => c.categoria === item.nome).forEach((c) => { c.categoria = v.nome; });
      item.nome = v.nome; item.ativa = v.ativa;
    },
    excluir: (item) => { estado.catalogo.categoriasDeCusto = estado.catalogo.categoriasDeCusto.filter((c) => c !== item); }
  },
  fornecedor: {
    lista: () => estado.catalogo.fornecedores,
    usoQtd: (item) => estado.catalogo.insumos.filter((i) => i.fornecedor === item.nome).length,
    campos: (item) => camposComAtivo([
      { id: 'nome', rotulo: 'Nome', valor: item ? item.nome : '' },
      { id: 'telefone', rotulo: 'Telefone', valor: item ? item.telefone : '' },
      { id: 'email', rotulo: 'E-mail', tipo: 'email', valor: item ? item.email : '' }
    ], item),
    criar: (v) => ({ id: slugify(v.nome, estado.catalogo.fornecedores), nome: v.nome, telefone: v.telefone, email: v.email, ativa: true }),
    atualizar: (item, v) => {
      estado.catalogo.insumos.filter((i) => i.fornecedor === item.nome).forEach((i) => { i.fornecedor = v.nome; });
      item.nome = v.nome; item.telefone = v.telefone; item.email = v.email; item.ativa = v.ativa;
    },
    excluir: (item) => { estado.catalogo.fornecedores = estado.catalogo.fornecedores.filter((f) => f !== item); }
  },
  unidade: {
    lista: () => estado.catalogo.unidades,
    usoQtd: (item) => estado.catalogo.insumos.filter((i) => i.unidade === item.sigla).length,
    campos: (item) => camposComAtivo([
      { id: 'nome', rotulo: 'Nome', valor: item ? item.nome : '' },
      { id: 'sigla', rotulo: 'Sigla', valor: item ? item.sigla : '', placeholder: 'kg, g, L, un' },
      { id: 'conversao', rotulo: 'Equivalência em quilo', valor: item ? item.conversao : '', placeholder: '1 dúzia = 0,72 kg' }
    ], item),
    criar: (v) => ({
      id: slugify(v.nome, estado.catalogo.unidades),
      nome: v.nome,
      sigla: v.sigla || v.nome.slice(0, 3).toLowerCase(),
      conversao: v.conversao || 'conversão a definir',
      ativa: true
    }),
    atualizar: (item, v) => {
      const sigla = v.sigla || item.sigla;
      estado.catalogo.insumos.filter((i) => i.unidade === item.sigla).forEach((i) => { i.unidade = sigla; });
      item.nome = v.nome; item.sigla = sigla; item.conversao = v.conversao || item.conversao; item.ativa = v.ativa;
    },
    excluir: (item) => { estado.catalogo.unidades = estado.catalogo.unidades.filter((u) => u !== item); }
  },
  formaPagamento: {
    lista: () => estado.catalogo.formasDePagamento,
    usoQtd: () => 0,
    campos: (item) => camposComAtivo([
      { id: 'nome', rotulo: 'Nome', valor: item ? item.nome : '' },
      { id: 'taxa', rotulo: 'Taxa', valor: formatarPercentual(item ? item.taxa : 0, 1) }
    ], item),
    criar: (v) => ({ id: slugify(v.nome, estado.catalogo.formasDePagamento), nome: v.nome, taxa: lerMoeda(v.taxa) / 100 || 0, ativa: true }),
    atualizar: (item, v) => { item.nome = v.nome; item.taxa = lerMoeda(v.taxa) / 100 || 0; item.ativa = v.ativa; },
    excluir: (item) => { estado.catalogo.formasDePagamento = estado.catalogo.formasDePagamento.filter((f) => f !== item); }
  }
};

const TITULOS_NOVO_CADASTRO = {
  categoria: 'Nova categoria de produto',
  categoriaCusto: 'Nova categoria de custo',
  fornecedor: 'Novo fornecedor',
  unidade: 'Nova unidade de medida',
  formaPagamento: 'Nova forma de pagamento'
};

function filtroCadastro(tipo) {
  return estado.filtrosCadastro[tipo] || 'ativos';
}

function aplicarFiltroCadastro(tipo, itens) {
  const f = filtroCadastro(tipo);
  if (f === 'todos') return itens;
  return itens.filter((i) => (f === 'ativos' ? i.ativa !== false : i.ativa === false));
}

function controleFiltroCadastro(tipo) {
  const atual = filtroCadastro(tipo);
  const opcoes = [['ativos', 'Ativos'], ['inativos', 'Inativos'], ['todos', 'Todos']];
  return `<label class="campo" style="min-width:140px">Mostrar
    <select data-acao="filtro-cadastro" data-tipo="${tipo}">
      ${opcoes.map(([v, l]) => `<option value="${v}" ${v === atual ? 'selected' : ''}>${l}</option>`).join('')}
    </select>
  </label>`;
}

function celulaAcoesCadastro(tipo, id) {
  return `<div class="acoes-linha">
    <button class="acao-icone" data-acao="editar-cadastro" data-tipo="${tipo}" data-id="${id}" aria-label="Editar">${icone('editar')}</button>
    <button class="acao-icone perigo" data-acao="remover-cadastro" data-tipo="${tipo}" data-id="${id}" aria-label="Remover">${icone('excluir')}</button>
  </div>`;
}

function celulaSituacaoCadastro(ativa) {
  return `<span class="selo ${ativa !== false ? 'selo-ok' : 'selo-neutro'}">${ativa !== false ? 'Ativa' : 'Inativa'}</span>`;
}

function tabelaCadastro(tipo, titulo, nota, colunasExtra, celulaExtra, textoNovo) {
  const todos = CADASTROS[tipo].lista();
  const f = fatiar(`cadastro-${tipo}`, aplicarFiltroCadastro(tipo, todos), 10);
  const visiveis = f.visiveis;
  return `
    <div class="cartao">
      <div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;align-items:flex-end">
        <div>
          <h2 class="cartao-titulo">${titulo}</h2>
          <p class="cartao-nota">${nota}</p>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-end">
          ${controleFiltroCadastro(tipo)}
          <button class="botao botao-claro" data-acao="novo-cadastro" data-tipo="${tipo}">${textoNovo}</button>
        </div>
      </div>
      <div class="rolagem" style="margin-top:14px">
        <table>
          <thead><tr><th>Nome</th>${colunasExtra.map((c) => `<th class="${c.classe || ''}">${c.rotulo}</th>`).join('')}<th>Situação</th><th></th></tr></thead>
          <tbody>
            ${visiveis.length ? visiveis.map((item) => `<tr>
              <td>${esc(item.nome)}</td>
              ${celulaExtra(item)}
              <td>${celulaSituacaoCadastro(item.ativa)}</td>
              <td>${celulaAcoesCadastro(tipo, item.id)}</td>
            </tr>`).join('') : `<tr><td colspan="${2 + colunasExtra.length}" class="suave">Nenhum cadastro para este filtro.</td></tr>`}
          </tbody>
        </table>
      </div>
      ${blocoPaginacao(`cadastro-${tipo}`, f, 'cadastros')}
    </div>`;
}

function abrirFormularioCadastro(tipo, item) {
  const def = CADASTROS[tipo];
  abrirFormulario({
    titulo: item ? `Editar: ${item.nome}` : TITULOS_NOVO_CADASTRO[tipo],
    campos: def.campos(item),
    textoSalvar: item ? 'Salvar' : 'Adicionar',
    aoSalvar: (valores) => {
      if (!valores.nome) return;
      if (item) def.atualizar(item, valores);
      else def.lista().push(def.criar(valores));
    }
  });
}

/* ------------------------------------------------------------------
   Insumos: cadastro manual.
------------------------------------------------------------------ */
const insumoEmUso = (insumo) =>
  estado.catalogo.fichas.filter((f) => f.ingredientes.some((l) => l.insumoId === insumo.id));

function abrirFormularioInsumo(insumo) {
  const unidadesAtivas = estado.catalogo.unidades.filter((u) => u.ativa !== false);
  const fichaDeOrigem = insumo && insumo.fichaId && acharFicha(insumo.fichaId);

  const campos = [
    { id: 'nome', rotulo: 'Nome', valor: insumo ? insumo.nome : '', placeholder: 'Farinha de arroz' },
    {
      id: 'unidade', rotulo: 'Como você compra', tipo: 'select',
      valor: insumo ? insumo.unidade : 'kg',
      opcoes: unidadesAtivas.map((u) => ({ valor: u.sigla, rotulo: `${u.nome} (${u.sigla})` }))
    },
    {
      id: 'fornecedor', rotulo: 'Fornecedor', tipo: 'select',
      valor: insumo ? insumo.fornecedor : '',
      opcoes: [{ valor: '', rotulo: 'Não informado' }]
        .concat(estado.catalogo.fornecedores.filter((f) => f.ativa !== false).map((f) => ({ valor: f.nome, rotulo: f.nome })))
    },
    { id: 'pesoBruto', rotulo: 'Peso bruto', tipo: 'number', passo: '0.001', valor: insumo ? insumo.pesoBruto : 1,
      nota: 'Quanto você compra, antes de limpar.' },
    { id: 'pesoLiquido', rotulo: 'Peso líquido', tipo: 'number', passo: '0.001', valor: insumo ? insumo.pesoLiquido : 1,
      nota: 'Quanto sobra depois de descascar, limpar ou tirar o osso.' }
  ];

  // Insumo que vem de uma ficha tem o preço calculado, não digitado.
  campos.push(fichaDeOrigem
    ? {
      id: 'preco', tipo: 'leitura', rotulo: 'Preço por quilo',
      valor: formatarMoeda(precoPorQuilo(insumo, estado.catalogo)),
      nota: `Calculado pela ficha "${fichaDeOrigem.nome}". Para mudar, altere a receita dela.`
    }
    : { id: 'preco', rotulo: 'Preço por quilo', valor: insumo ? formatarMoeda(insumo.preco) : '', placeholder: 'R$ 0,00' });

  campos.push({ id: 'cotacao', rotulo: 'Data da cotação', tipo: 'date', valor: insumo ? insumo.cotacao || '' : HOJE,
    nota: 'Quando você viu esse preço pela última vez.' });

  if (insumo) campos.push({ id: 'ativo', rotulo: 'Insumo ativo', tipo: 'checkbox', valor: insumo.ativo !== false });

  abrirFormulario({
    titulo: insumo ? `Editar: ${insumo.nome}` : 'Novo insumo',
    campos,
    textoSalvar: insumo ? 'Salvar' : 'Adicionar',
    aoSalvar: (v) => {
      if (!v.nome) { avisarNoDialogo('Informe o nome do insumo.'); return false; }
      const bruto = Number(v.pesoBruto) || 1;
      const liquido = Number(v.pesoLiquido) || bruto;
      if (liquido > bruto) {
        avisarNoDialogo('O peso líquido não pode ser maior que o bruto: sobraria mais do que entrou.');
        return false;
      }
      const dados = {
        nome: v.nome, unidade: v.unidade, fornecedor: v.fornecedor,
        pesoBruto: bruto, pesoLiquido: liquido, cotacao: v.cotacao || ''
      };
      if (v.preco !== undefined) dados.preco = lerMoeda(v.preco);
      if (insumo) Object.assign(insumo, dados, { ativo: v.ativo });
      else estado.catalogo.insumos.push({ id: novoId(v.nome, estado.catalogo.insumos), ...dados, ativo: true });
      return true;
    }
  });
}

/* ------------------------------------------------------------------
   Produtos e fichas: cadastro manual.
------------------------------------------------------------------ */
function abrirFormularioFicha(ficha) {
  const categoriasAtivas = estado.catalogo.categorias.filter((c) => c.ativa !== false);

  const campos = [
    { id: 'nome', rotulo: 'Nome do produto', valor: ficha ? ficha.nome : '', placeholder: 'Quiche de frango' },
    {
      id: 'categoriaId', rotulo: 'Categoria', tipo: 'select',
      valor: ficha ? ficha.categoriaId : (categoriasAtivas[0] || {}).id,
      opcoes: categoriasAtivas.map((c) => ({ valor: c.id, rotulo: c.nome }))
    },
    { id: 'rendimento', rotulo: 'Rendimento da receita', tipo: 'number', passo: '0.001',
      valor: ficha ? ficha.rendimento : 1, nota: 'Quantas porções saem de uma receita inteira.' },
    { id: 'tamanhoPorcao', rotulo: 'Tamanho da porção', valor: ficha ? ficha.tamanhoPorcao : '',
      placeholder: '400g', nota: 'Como você anuncia para o cliente.' },
    { id: 'vendavel', rotulo: 'Este produto é vendido', tipo: 'checkbox', valor: ficha ? !!ficha.vendavel : true },
    { id: 'precoPraticado', rotulo: 'Preço praticado', valor: ficha ? formatarMoeda(ficha.precoPraticado) : '',
      placeholder: 'R$ 0,00', nota: 'Deixe vazio se ainda não for vendido.' },
    { id: 'metaCmv', rotulo: 'Meta de CMV deste produto',
      valor: ficha && ficha.metaCmv ? formatarPercentual(ficha.metaCmv, 0) : '',
      placeholder: 'usa a da categoria', nota: 'Vazio herda a meta da categoria.' },
    { id: 'rendimentoKg', rotulo: 'Quanto sai da receita, em kg', tipo: 'number', passo: '0.001',
      valor: ficha && ficha.rendimentoKg ? ficha.rendimentoKg : '',
      nota: 'Só quando esta receita vira ingrediente de outra. Vazio assume que nada se perde.' }
  ];

  if (ficha) campos.push({ id: 'ativo', rotulo: 'Produto ativo', tipo: 'checkbox', valor: ficha.ativo !== false });

  abrirFormulario({
    titulo: ficha ? `Editar: ${ficha.nome}` : 'Novo produto',
    nota: ficha ? '' : 'Depois de criar, a ficha abre para você montar os ingredientes.',
    largo: true,
    campos,
    textoSalvar: ficha ? 'Salvar' : 'Criar e montar a ficha',
    aoSalvar: (v) => {
      if (!v.nome) { avisarNoDialogo('Informe o nome do produto.'); return false; }
      const rendimento = Number(v.rendimento) || 0;
      if (rendimento <= 0) { avisarNoDialogo('O rendimento precisa ser maior que zero.'); return false; }

      const dados = {
        nome: v.nome,
        categoriaId: v.categoriaId,
        rendimento,
        tamanhoPorcao: v.tamanhoPorcao,
        vendavel: !!v.vendavel,
        precoPraticado: lerMoeda(v.precoPraticado),
        metaCmv: v.metaCmv ? lerMoeda(v.metaCmv) / 100 : undefined,
        rendimentoKg: Number(v.rendimentoKg) || undefined
      };

      if (ficha) {
        Object.assign(ficha, dados, { ativo: v.ativo });
      } else {
        const nova = { id: novoId(v.nome, estado.catalogo.fichas), ...dados, ingredientes: [], ativo: true };
        estado.catalogo.fichas.push(nova);
        location.hash = `#/ficha/${nova.id}`;
      }
      return true;
    }
  });
}

/** Linha de ingrediente: escolher o insumo e dizer quanto vai. */
function abrirFormularioIngrediente(ficha, indice) {
  const linha = indice === undefined ? null : ficha.ingredientes[indice];
  const disponiveis = estado.catalogo.insumos
    .filter((i) => i.ativo !== false && i.fichaId !== ficha.id)
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  abrirFormulario({
    titulo: linha ? 'Trocar ingrediente' : 'Adicionar ingrediente',
    campos: [
      {
        id: 'insumoId', rotulo: 'Insumo', tipo: 'select',
        valor: linha ? linha.insumoId : (disponiveis[0] || {}).id,
        opcoes: disponiveis.map((i) => ({
          valor: i.id,
          rotulo: `${i.nome} (${formatarMoeda(precoPorQuilo(i, estado.catalogo))}/kg)`
        }))
      },
      { id: 'quantidade', rotulo: 'Quantidade em quilos', tipo: 'number', passo: '0.001',
        valor: linha ? linha.quantidade : '', nota: 'Peso líquido, já limpo. O peso bruto o sistema calcula.' }
    ],
    textoSalvar: linha ? 'Salvar' : 'Adicionar',
    aoSalvar: (v) => {
      const quantidade = Number(v.quantidade) || 0;
      if (quantidade <= 0) { avisarNoDialogo('Informe uma quantidade maior que zero.'); return false; }
      if (linha) Object.assign(linha, { insumoId: v.insumoId, quantidade });
      else ficha.ingredientes.push({ insumoId: v.insumoId, quantidade });
      return true;
    }
  });
}

/** Lançamento de custo: o mesmo diálogo serve para criar e para editar. */
function abrirFormularioCusto(custo) {
  const opcoes = categoriasDeCustoAtivas()
    .concat(custo && !categoriasDeCustoAtivas().some((c) => c.nome === custo.categoria)
      ? [{ nome: custo.categoria }] : [])
    .map((c) => `<option ${custo && custo.categoria === c.nome ? 'selected' : ''}>${esc(c.nome)}</option>`).join('');

  abrirDialogo(`
    <h2 class="diag-titulo">${custo ? 'Editar lançamento' : 'Novo lançamento'}</h2>
    <div class="diag-campos">
      <label class="campo">Data<input type="date" id="campo-custo-data" value="${custo ? custo.data : '2026-10-05'}"></label>
      <label class="campo">Categoria<select id="campo-custo-categoria">${opcoes}</select></label>
      <label class="campo">Descrição<input type="text" id="campo-custo-descricao" value="${esc(custo ? custo.descricao : '')}" placeholder="Compra na feira"></label>
      <label class="campo">Valor<input type="text" class="entrada-num" id="campo-custo-valor" value="${custo ? formatarMoeda(custo.valor) : ''}" placeholder="R$ 0,00"></label>
      <label style="display:flex;align-items:center;gap:10px;font-size:15px;cursor:pointer">
        <input type="checkbox" id="campo-custo-pago" ${custo && custo.pago ? 'checked' : ''}> Já está pago
      </label>
      <div class="aviso aviso-atencao" id="diag-aviso" style="display:none"></div>
    </div>
    <div class="diag-acoes">
      <button class="botao botao-claro" data-diag="cancelar">Cancelar</button>
      <button class="botao" data-diag="salvar-custo">${custo ? 'Salvar' : 'Lançar custo'}</button>
    </div>`);
  custoEmEdicao = custo || null;
}

function telaConfig() {
  const p = estado.parametros;
  const aba = estado.abaConfig;

  const exemplo = estado.pedidos.find((x) => x.status === 'PRONTO') || estado.pedidos[0];
  const previa = exemplo ? montarMensagem(p.mensagemWhatsapp, exemplo) : '';
  const linkPrevia = exemplo ? linkWhatsapp(exemplo.telefone, previa) : null;

  const corpoAtendimento = `
    <section class="cartao">
      <h2 class="cartao-titulo">Mensagem do WhatsApp</h2>
      <p class="cartao-nota">É o texto que já vem escrito quando você abre a conversa pelo ícone no pedido. Nada é enviado sozinho: o WhatsApp abre com a mensagem pronta e você decide se manda.</p>
      <label class="campo" style="margin-top:18px">Texto da mensagem
        <textarea data-acao="mensagem-whatsapp" rows="3"
          style="min-height:92px;padding:12px 13px;border:1px solid var(--areia);border-radius:var(--raio-s);background:var(--branco);font-family:inherit;font-size:15px;font-weight:300;resize:vertical">${esc(p.mensagemWhatsapp)}</textarea>
      </label>
      <div class="aviso aviso-neutro" style="margin-top:16px">${icone('info')}<div>
        <strong>Marcadores.</strong> O sistema troca cada um pelo dado do pedido na hora de abrir a conversa:
        <code>{cliente}</code> pelo nome, <code>{itens}</code> pela lista do pedido,
        <code>{total}</code> pelo valor e <code>{situacao}</code> por recebido, em preparo, pronto para retirada, entregue ou cancelado.
      </div></div>
    </section>

    <section class="cartao">
      <h2 class="cartao-titulo">Prévia</h2>
      <p class="cartao-nota">${exemplo ? `Usando o pedido de ${esc(exemplo.cliente)}, que está ${esc(rotuloSituacao(exemplo.status))}.` : 'Nenhum pedido para usar de exemplo.'}</p>
      ${exemplo ? `<p class="previa-zap">${esc(previa)}</p>` : ''}
      ${linkPrevia
        ? `<a class="botao botao-claro" href="${linkPrevia}" target="_blank" rel="noopener" style="margin-top:14px;text-decoration:none">${icone('conversa')} Testar no WhatsApp</a>`
        : (exemplo ? '<p class="cartao-nota" style="margin-top:12px">Esse pedido não tem telefone válido, então o teste fica indisponível.</p>' : '')}
    </section>`;

  const abaParametros = aba === 'parametros';

  const corpoParametros = `
    <section class="cartao">
      <h2 class="cartao-titulo">Parâmetros gerais</h2>
      <p class="cartao-nota">Valem para todo produto que não tiver configuração própria. Mudar aqui recalcula os preços sugeridos na hora.</p>
      <div class="grade grade-3" style="margin-top:18px">
        <label class="campo">Meta de CMV padrão<input type="text" value="${formatarPercentual(p.metaCmvPadrao, 0)}" data-acao="param" data-campo="metaCmvPadrao"></label>
        <label class="campo">Custo de embalagem por porção<input type="text" value="${formatarMoeda(p.custoEmbalagem)}" data-acao="param" data-campo="custoEmbalagem"></label>
        <label class="campo">Perda estimada de produção<input type="text" value="${formatarPercentual(p.perdaProducao, 0)}" data-acao="param" data-campo="perdaProducao"></label>
      </div>
      <div class="grade grade-3" style="margin-top:18px">
        <label class="campo">Arredondar preço sugerido
          <select data-acao="param" data-campo="arredondamento">
            <option value="inteiro" ${p.arredondamento === 'inteiro' ? 'selected' : ''}>Para cima, em R$ 1,00</option>
            <option value="meio" ${p.arredondamento === 'meio' ? 'selected' : ''}>Para cima, em R$ 0,50</option>
            <option value="nenhum" ${p.arredondamento === 'nenhum' ? 'selected' : ''}>Não arredondar</option>
          </select>
        </label>
        <label class="campo">Tolerância antes de avisar<input type="text" value="${formatarPercentual(p.toleranciaCmv, 0)}" data-acao="param" data-campo="toleranciaCmv"></label>
      </div>
    </section>`;

  const corpoCadastros = `
    ${tabelaCadastro('categoria',
      'Categorias de produto',
      'Cada categoria tem a sua meta de CMV, usada quando o produto não tem meta própria na ficha.',
      [{ rotulo: 'Meta de CMV', classe: 'num' }, { rotulo: 'Produtos', classe: 'num' }],
      (c) => `<td class="num">${formatarPercentual(c.metaCmv, 0)}</td>
              <td class="num suave">${CADASTROS.categoria.usoQtd(c)}</td>`,
      'Nova categoria')}

    <section class="grade grade-2">
      ${tabelaCadastro('categoriaCusto',
        'Categorias de custo',
        'São as opções da lista Categoria na hora de lançar um gasto na tela de Custos.',
        [{ rotulo: 'Lançamentos', classe: 'num' }],
        (c) => `<td class="num suave">${CADASTROS.categoriaCusto.usoQtd(c)}</td>`,
        'Nova categoria')}

      ${tabelaCadastro('fornecedor',
        'Fornecedores',
        'De quem você compra. Cada insumo aponta para um fornecedor, e o contato fica aqui para a hora de pedir cotação.',
        [{ rotulo: 'Telefone' }, { rotulo: 'E-mail' }, { rotulo: 'Insumos', classe: 'num' }],
        (f) => `<td class="suave">${esc(f.telefone || '—')}</td>
                <td class="suave">${esc(f.email || '—')}</td>
                <td class="num suave">${CADASTROS.fornecedor.usoQtd(f)}</td>`,
        'Novo fornecedor')}

      ${tabelaCadastro('unidade',
        'Unidades de medida',
        'Como cada insumo é comprado. O cálculo de custo trabalha sempre em quilo, então cada unidade precisa dizer quanto vale em quilo.',
        [{ rotulo: 'Sigla' }, { rotulo: 'Equivalência em quilo' }, { rotulo: 'Insumos', classe: 'num' }],
        (u) => `<td class="suave">${esc(u.sigla)}</td>
                <td class="suave">${esc(u.conversao)}</td>
                <td class="num suave">${CADASTROS.unidade.usoQtd(u)}</td>`,
        'Nova unidade')}

      ${tabelaCadastro('formaPagamento',
        'Formas de pagamento',
        'Aparecem no pedido. A taxa da maquininha entra no cálculo da margem.',
        [{ rotulo: 'Taxa', classe: 'num' }],
        (f) => `<td class="num suave">${f.taxa ? formatarPercentual(f.taxa) : 'sem taxa'}</td>`,
        'Nova forma')}
    </section>

    <div class="aviso aviso-neutro">${icone('info')}<div><strong>Sobre remover.</strong> Um cadastro que já está em uso não é apagado: ele fica inativo, sai das listas de seleção e os registros antigos continuam intactos. Um cadastro sem nenhum vínculo é removido de verdade, com confirmação antes.</div></div>`;

  return `
    <div class="cabecalho">
      <div>
        <h1 class="titulo">Configuração</h1>
        <p class="subtitulo">Parâmetros são valores únicos que entram no cálculo. Cadastros são as listas que crescem com o tempo e que você mesma mantém.</p>
      </div>
    </div>
    <div class="abas">
      <button class="${aba === 'parametros' ? 'ativa' : ''}" data-acao="aba" data-aba="parametros">Parâmetros de preço</button>
      <button class="${aba === 'cadastros' ? 'ativa' : ''}" data-acao="aba" data-aba="cadastros">Cadastros</button>
      <button class="${aba === 'atendimento' ? 'ativa' : ''}" data-acao="aba" data-aba="atendimento">Atendimento</button>
    </div>
    ${aba === 'atendimento' ? corpoAtendimento : (abaParametros ? corpoParametros : corpoCadastros)}`;
}

/* ------------------------------------------------------------------
   Roteamento e eventos
------------------------------------------------------------------ */
function rotaAtual() {
  const bruto = (location.hash || '#/inicio').replace('#/', '');
  const [pagina, parametro] = bruto.split('/');
  return { pagina: pagina || 'inicio', parametro };
}

function renderizarMenu(paginaAtiva) {
  const itens = PAGINAS.map((p) => {
    const ativo = p.rota === paginaAtiva || (paginaAtiva === 'ficha' && p.rota === 'fichas');
    return `<a href="#/${p.rota}" class="${ativo ? 'ativo' : ''}">${icone(p.icone)}${p.titulo}</a>`;
  }).join('');
  document.getElementById('menu').innerHTML = itens;
}

function renderizar() {
  const { pagina, parametro } = rotaAtual();
  renderizarMenu(pagina);
  const telas = {
    inicio: telaInicio,
    pedidos: () => telaPedidos(estado.pedidos, { mensagemWhatsapp: estado.parametros.mensagemWhatsapp }),
    painel: telaPainel,
    fichas: telaFichas,
    ficha: () => telaFicha(parametro),
    ajuste: telaAjuste,
    insumos: telaInsumos,
    custos: telaCustos,
    config: telaConfig
  };
  const render = telas[pagina] || telaInicio;
  document.getElementById('conteudo').innerHTML = render() + `
    <p class="rodape-proto">Protótipo funcional do sistema do Maluzices. Os cálculos de custo, CMV e preço sugerido são reais; os dados são de exemplo e ficam só na memória do navegador, então recarregar a página volta ao estado inicial.</p>`;

  // a compra nasce com uma linha pronta: ninguém abre a tela para não lançar nada
  if (document.getElementById('listaCompra')) {
    linhaDeCompra();
    atualizarPreviaDaCompra();
  }
  window.scrollTo(0, 0);
}

document.addEventListener('input', (evento) => {
  const alvo = evento.target;
  const acao = alvo.dataset.acao;
  if (!acao) return;

  if (acao === 'quantidade') {
    const ficha = acharFicha(alvo.dataset.ficha);
    ficha.ingredientes[Number(alvo.dataset.indice)].quantidade = Number(alvo.value) || 0;
    atualizarFichaNaTela(ficha);
  }
});

document.addEventListener('change', (evento) => {
  const alvo = evento.target;

  if (alvo.id === 'arquivo-importacao') {
    const arquivo = alvo.files && alvo.files[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => {
      const analise = analisarCsvDeCustos(String(leitor.result), categoriasDeCustoAtivas().map((c) => c.nome));
      estado.importacao = { ...analise, arquivo: arquivo.name };
      renderizar();
    };
    leitor.readAsText(arquivo, 'utf-8');
    return;
  }

  const acao = alvo.dataset.acao;
  if (!acao) return;

  switch (acao) {
    case 'preco-insumo':
      acharInsumo(alvo.dataset.insumo).preco = lerMoeda(alvo.value);
      renderizar();
      break;
    case 'preco-praticado':
      acharFicha(alvo.dataset.ficha).precoPraticado = lerMoeda(alvo.value);
      renderizar();
      break;
    case 'rendimento':
      acharFicha(alvo.dataset.ficha).rendimento = Number(alvo.value) || 1;
      renderizar();
      break;
    case 'meta': {
      const valor = lerMoeda(alvo.value) / 100;
      acharFicha(alvo.dataset.ficha).metaCmv = valor > 0 ? valor : undefined;
      renderizar();
      break;
    }
    case 'filtro-fichas':
      estado.filtroFichas = alvo.value;
      voltarPrimeiraPagina('fichas');
      renderizar();
      break;
    case 'filtro-cadastro':
      estado.filtrosCadastro[alvo.dataset.tipo] = alvo.value;
      voltarPrimeiraPagina(`cadastro-${alvo.dataset.tipo}`);
      renderizar();
      break;
    case 'mensagem-whatsapp':
      estado.parametros.mensagemWhatsapp = alvo.value;
      renderizar();
      break;
    case 'periodo-painel':
      estado.periodoPainel = alvo.value;
      renderizar();
      break;
    case 'novo-preco':
      estado.novosPrecos[alvo.dataset.ficha] = lerMoeda(alvo.value);
      renderizar();
      break;
    case 'selecionar':
      estado.selecionados[alvo.dataset.ficha] = alvo.checked;
      renderizar();
      break;
    case 'selecionar-todos': {
      const itens = fichasComDiferenca();
      const ligar = itens.some(({ ficha }) => !estado.selecionados[ficha.id]);
      itens.forEach(({ ficha }) => { estado.selecionados[ficha.id] = ligar; });
      renderizar();
      break;
    }
    case 'param': {
      const campo = alvo.dataset.campo;
      if (campo === 'arredondamento') estado.parametros.arredondamento = alvo.value;
      else if (campo === 'custoEmbalagem') estado.parametros.custoEmbalagem = lerMoeda(alvo.value);
      else estado.parametros[campo] = lerMoeda(alvo.value) / 100;
      renderizar();
      break;
    }
    default:
      break;
  }
});

/* ---------- painel de pedidos ---------- */
/**
 * O mesmo modal cria, mostra e edita. Pedido entregue ou cancelado abre
 * só para leitura: mexer no valor de um pedido fechado mexeria no
 * faturamento já apurado.
 */
function abrirModalPedido(pedido) {
  const fundo = document.getElementById('fundoModal');
  const lista = document.getElementById('listaItens');
  const corpo = fundo.querySelector('.modal-corpo');
  const salvar = document.getElementById('botaoSalvarPedido');
  const leitura = !!pedido && ehFinal(pedido.status);

  estado.pedidoEmEdicao = pedido || null;

  lista.innerHTML = '';
  if (pedido && pedido.itens.length) pedido.itens.forEach((i) => adicionarLinhaDeItem(i));
  else adicionarLinhaDeItem();

  document.getElementById('campoCliente').value = pedido ? pedido.cliente : '';
  document.getElementById('campoTelefone').value = pedido ? formatarTelefone(pedido.telefone) : '';
  document.getElementById('campoObs').value = pedido ? pedido.obs || '' : '';
  document.getElementById('aviso').classList.remove('visivel');

  document.getElementById('tituloModal').textContent = pedido
    ? (leitura ? `Pedido ${rotuloSituacao(pedido.status)}` : `Editar pedido`)
    : 'Novo pedido';
  salvar.textContent = pedido ? 'Salvar alterações' : 'Registrar pedido';

  corpo.classList.toggle('somente-leitura', leitura);
  corpo.querySelectorAll('input, textarea').forEach((c) => { c.disabled = leitura; });
  corpo.querySelectorAll('.add-item, .rm-item').forEach((b) => { b.style.display = leitura ? 'none' : ''; });
  salvar.style.display = leitura ? 'none' : '';

  atualizarLinkZapDoModal();
  atualizarPreviaDoPedido();
  fundo.classList.add('aberto');
  if (!leitura) setTimeout(() => document.getElementById('campoCliente').focus(), 40);
}

function fecharModalPedido() {
  const fundo = document.getElementById('fundoModal');
  if (fundo) fundo.classList.remove('aberto');
  estado.pedidoEmEdicao = null;
}

/**
 * O ícone dentro do campo fica apagado enquanto o número não serve e
 * acende quando passa a valer. O próprio ícone é o aviso: se não acendeu,
 * o número ainda não está completo.
 */
function atualizarLinkZapDoModal() {
  const botao = document.getElementById('zapBotao');
  if (!botao) return;
  const campo = document.getElementById('campoTelefone');
  const bruto = campo ? campo.value.trim() : '';
  const apagado = '<span class="zap-icone inativo" aria-hidden="true"><img src="img/whatsapp.png" alt=""></span>';

  if (!telefoneValido(bruto)) { botao.innerHTML = apagado; return; }

  const pedido = estado.pedidoEmEdicao || {
    cliente: document.getElementById('campoCliente').value.trim(),
    itens: itensDoFormulario(),
    status: 'RECEBIDO'
  };
  const link = linkWhatsapp(bruto, montarMensagem(estado.parametros.mensagemWhatsapp, pedido));
  botao.innerHTML = `<a class="zap-icone" href="${link}" target="_blank" rel="noopener"
    title="Abrir conversa no WhatsApp" aria-label="Abrir conversa no WhatsApp"><img src="img/whatsapp.png" alt=""></a>`;
}

function adicionarLinhaDeItem(item) {
  const lista = document.getElementById('listaItens');
  const linha = document.createElement('div');
  linha.className = 'linha-item';
  const produtos = fichasVendaveis();
  linha.innerHTML = `
    <input class="it-nome" list="lista-produtos" placeholder="Nome do item" autocomplete="off" value="${item ? esc(item.nome) : ''}">
    <input class="it-qtd" type="number" min="1" step="1" value="${item ? item.qtd : 1}" aria-label="Quantidade">
    <input class="it-preco" type="number" min="0" step="0.01" placeholder="0,00" aria-label="Preço unitário" value="${item ? item.preco.toFixed(2) : ''}">
    <button class="rm-item" data-pedido="remover-item" aria-label="Remover item">×</button>`;
  lista.appendChild(linha);
  if (!document.getElementById('lista-produtos')) {
    const datalist = document.createElement('datalist');
    datalist.id = 'lista-produtos';
    datalist.innerHTML = produtos.map((f) => `<option value="${esc(f.nome)}"></option>`).join('');
    lista.appendChild(datalist);
  }
}

function itensDoFormulario() {
  return [...document.querySelectorAll('#listaItens .linha-item')].map((l) => ({
    nome: l.querySelector('.it-nome').value.trim(),
    qtd: parseInt(l.querySelector('.it-qtd').value, 10) || 0,
    preco: parseFloat(l.querySelector('.it-preco').value) || 0
  }));
}

function atualizarPreviaDoPedido() {
  const total = itensDoFormulario().reduce((s, i) => s + i.qtd * i.preco, 0);
  const alvo = document.getElementById('previaTotal');
  if (alvo) alvo.textContent = formatarMoeda(total);
}

/** Ao escolher um produto da lista, o preço praticado vem preenchido. */
function preencherPrecoDoProduto(campo) {
  const ficha = fichasVendaveis().find((f) => f.nome === campo.value.trim());
  if (!ficha) return;
  const campoPreco = campo.closest('.linha-item').querySelector('.it-preco');
  if (!campoPreco.value || Number(campoPreco.value) === 0) campoPreco.value = ficha.precoPraticado.toFixed(2);
}

document.addEventListener('input', (evento) => {
  const alvo = evento.target;
  if (alvo.dataset && alvo.dataset.acao === 'buscar-insumo') {
    estado.buscaInsumo = alvo.value;
    voltarPrimeiraPagina('insumos');
    const foco = alvo.selectionStart;
    renderizar();
    const campo = document.querySelector('[data-acao="buscar-insumo"]');
    if (campo) { campo.focus(); campo.setSelectionRange(foco, foco); }
    return;
  }
  if (alvo.closest && alvo.closest('#listaCompra')) atualizarPreviaDaCompra();
  if (alvo.id === 'campoTelefone') atualizarLinkZapDoModal();
  if (alvo.closest && alvo.closest('#listaItens')) {
    if (alvo.classList.contains('it-nome')) preencherPrecoDoProduto(alvo);
    atualizarPreviaDoPedido();
  }
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') { fecharModalPedido(); fecharDialogo(); }

  // o cartão é focável: Enter e espaço abrem o pedido, como o clique
  if (evento.key === 'Enter' || evento.key === ' ') {
    const cartao = evento.target.closest && evento.target.closest('.pedidos-escopo .cartao[data-id]');
    if (cartao && evento.target === cartao) {
      evento.preventDefault();
      const pedido = estado.pedidos.find((p) => p.id === Number(cartao.dataset.id));
      if (pedido) abrirModalPedido(pedido);
    }
  }
});

document.addEventListener('click', (evento) => {
  const fundo = document.getElementById('fundoModal');
  if (fundo && evento.target === fundo) fecharModalPedido();

  const diagFundo = document.getElementById('diagFundo');
  if (diagFundo && evento.target === diagFundo) { fecharDialogo(); return; }

  const botaoDiag = evento.target.closest('[data-diag]');
  if (botaoDiag) {
    const acaoDiag = botaoDiag.dataset.diag;

    if (acaoDiag === 'cancelar') { fecharDialogo(); return; }

    if (acaoDiag === 'confirmar-compra' && confirmacaoDeCompra) {
      confirmacaoDeCompra();
      return;
    }

    if (acaoDiag === 'confirmar' && confirmacaoPendente) {
      confirmacaoPendente();
      fecharDialogo();
      renderizar();
      return;
    }

    if (acaoDiag === 'salvar' && formularioAtivo) {
      const valores = lerFormularioAtivo();
      // devolver false mantém o diálogo aberto, com o aviso e o que foi digitado
      if (formularioAtivo.aoSalvar(valores) === false) return;
      fecharDialogo();
      renderizar();
      return;
    }

    if (acaoDiag === 'salvar-custo') {
      const valor = lerMoeda(document.getElementById('campo-custo-valor').value);
      const descricao = document.getElementById('campo-custo-descricao').value.trim();
      const aviso = document.getElementById('diag-aviso');
      if (!valor || !descricao) {
        aviso.textContent = 'Informe a descrição e o valor do custo.';
        aviso.style.display = 'block';
        return;
      }
      const dados = {
        data: document.getElementById('campo-custo-data').value || '2026-10-05',
        categoria: document.getElementById('campo-custo-categoria').value,
        descricao,
        valor,
        pago: document.getElementById('campo-custo-pago').checked
      };
      if (custoEmEdicao) Object.assign(custoEmEdicao, dados);
      else estado.catalogo.custos.unshift({ id: `custo-${estado.proximoCustoId++}`, ...dados });
      estado.catalogo.custos.sort((a, b) => (a.data < b.data ? 1 : -1));
      fecharDialogo();
      renderizar();
      return;
    }
    return;
  }

  const botao = evento.target.closest('[data-pedido]');
  if (botao) {
    const acao = botao.dataset.pedido;
    if (acao === 'zap') return; // é um link, deixa o navegador abrir
    if (acao === 'novo') { abrirModalPedido(null); return; }
    if (acao === 'fechar') { fecharModalPedido(); return; }
    if (acao === 'adicionar-item') { adicionarLinhaDeItem(); atualizarPreviaDoPedido(); return; }
    if (acao === 'remover-item') {
      const lista = document.getElementById('listaItens');
      if (lista.querySelectorAll('.linha-item').length > 1) {
        botao.closest('.linha-item').remove();
        atualizarPreviaDoPedido();
      }
      return;
    }
    if (acao === 'salvar') {
      const cliente = document.getElementById('campoCliente').value.trim();
      const telefone = document.getElementById('campoTelefone').value.trim();
      const obs = document.getElementById('campoObs').value.trim();
      const itens = itensDoFormulario().filter((i) => i.nome);
      const erros = validarPedido(cliente, itens, telefone);
      if (erros.length) {
        const aviso = document.getElementById('aviso');
        aviso.textContent = erros.join(' · ');
        aviso.classList.add('visivel');
        return;
      }
      if (estado.pedidoEmEdicao) Object.assign(estado.pedidoEmEdicao, { cliente, telefone, obs, itens });
      else estado.pedidos.unshift(criarPedido(cliente, itens, obs, telefone));
      fecharModalPedido();
      renderizar();
      return;
    }

    const cartaoDaAcao = botao.closest('.cartao');
    if (cartaoDaAcao) {
      const id = Number(cartaoDaAcao.dataset.id);

      if (acao === 'cancelar') {
        const pedido = estado.pedidos.find((p) => p.id === id);
        confirmar({
          titulo: `Cancelar o pedido de ${pedido.cliente}?`,
          texto: `Ele sai do fluxo e vai para a coluna Cancelado, com o valor de ${formatarMoeda(totalDoPedido(pedido))} fora do faturamento. O registro continua visível, mas o pedido não volta atrás.`,
          textoAcao: 'Cancelar pedido',
          aoConfirmar: () => { estado.pedidos = aplicarAcaoNoPedido(estado.pedidos, id, 'cancelar'); }
        });
        return;
      }

      estado.pedidos = aplicarAcaoNoPedido(estado.pedidos, id, acao);
      renderizar();
      return;
    }
  }

  // clique no corpo do cartão abre o pedido
  const cartaoPedido = evento.target.closest('.pedidos-escopo .cartao[data-id]');
  if (cartaoPedido) {
    const pedido = estado.pedidos.find((p) => p.id === Number(cartaoPedido.dataset.id));
    if (pedido) abrirModalPedido(pedido);
    return;
  }

  const alvo = evento.target.closest('[data-acao]');
  if (!alvo) return;
  const acao = alvo.dataset.acao;

  if (acao === 'aba') {
    estado.abaConfig = alvo.dataset.aba;
    renderizar();
  }

  if (acao === 'pagina') {
    estado.paginas[alvo.dataset.chave] = Number(alvo.dataset.para) || 1;
    renderizar();
    return;
  }

  if (acao === 'aplicar') {
    fichasComDiferenca().forEach(({ ficha, resumo }) => {
      if (!estado.selecionados[ficha.id]) return;
      const novo = estado.novosPrecos[ficha.id] !== undefined ? estado.novosPrecos[ficha.id] : resumo.precoSugerido;
      ficha.precoPraticado = novo;
      delete estado.selecionados[ficha.id];
      delete estado.novosPrecos[ficha.id];
    });
    renderizar();
  }

  if (acao === 'alternar-pago') {
    const custo = estado.catalogo.custos.find((c) => c.id === alvo.dataset.id);
    custo.pago = !custo.pago;
    renderizar();
  }

  if (acao === 'editar-custo') {
    abrirFormularioCusto(estado.catalogo.custos.find((c) => c.id === alvo.dataset.id));
  }

  if (acao === 'remover-custo') {
    const custo = estado.catalogo.custos.find((c) => c.id === alvo.dataset.id);
    confirmar({
      titulo: 'Remover lançamento',
      texto: `Quer remover "${custo.descricao}", de ${formatarMoeda(custo.valor)}? O total do painel muda junto e não dá para desfazer.`,
      aoConfirmar: () => { estado.catalogo.custos = estado.catalogo.custos.filter((c) => c !== custo); }
    });
  }

  if (acao === 'novo-produto') abrirFormularioFicha(null);

  if (acao === 'editar-ficha') abrirFormularioFicha(acharFicha(alvo.dataset.id));

  if (acao === 'remover-ficha') {
    const ficha = acharFicha(alvo.dataset.id);
    const comoInsumo = estado.catalogo.fichas.filter((f) => f.ingredientes.some((l) => {
      const i = acharInsumo(l.insumoId);
      return i && i.fichaId === ficha.id;
    }));
    const temVenda = vendas.some((v) => v.fichaId === ficha.id);

    if (comoInsumo.length || temVenda) {
      const motivo = comoInsumo.length
        ? `Ela é ingrediente de ${comoInsumo.map((f) => f.nome).join(', ')}`
        : 'Ela já tem venda registrada no histórico';
      confirmar({
        titulo: `Inativar ${ficha.nome}?`,
        texto: `${motivo}, então apagar quebraria o custo ou o histórico. Pode ficar inativa e sair das listas.`,
        textoAcao: 'Inativar',
        aoConfirmar: () => { ficha.ativo = false; }
      });
    } else {
      confirmar({
        titulo: `Remover ${ficha.nome}?`,
        texto: 'Nenhuma outra receita usa esta ficha e ela não tem venda registrada. Pode ser apagada de vez, e isso não dá para desfazer.',
        aoConfirmar: () => {
          estado.catalogo.fichas = estado.catalogo.fichas.filter((f) => f !== ficha);
        }
      });
    }
  }

  if (acao === 'novo-ingrediente') abrirFormularioIngrediente(acharFicha(alvo.dataset.ficha));

  if (acao === 'editar-ingrediente') {
    abrirFormularioIngrediente(acharFicha(alvo.dataset.ficha), Number(alvo.dataset.indice));
  }

  if (acao === 'remover-ingrediente') {
    const ficha = acharFicha(alvo.dataset.ficha);
    const indice = Number(alvo.dataset.indice);
    const insumo = acharInsumo(ficha.ingredientes[indice].insumoId);
    confirmar({
      titulo: 'Remover ingrediente?',
      texto: `${insumo ? insumo.nome : 'Este ingrediente'} sai da receita de ${ficha.nome} e o custo é recalculado na hora.`,
      aoConfirmar: () => { ficha.ingredientes.splice(indice, 1); }
    });
  }

  if (acao === 'novo-insumo') abrirFormularioInsumo(null);

  if (acao === 'editar-insumo') {
    abrirFormularioInsumo(acharInsumo(alvo.dataset.id));
  }

  if (acao === 'remover-insumo') {
    const insumo = acharInsumo(alvo.dataset.id);
    const usos = insumoEmUso(insumo);
    if (usos.length) {
      confirmar({
        titulo: `Inativar ${insumo.nome}?`,
        texto: `Ele é ingrediente de ${usos.length} ${usos.length === 1 ? 'receita' : 'receitas'} (${usos.slice(0, 3).map((f) => f.nome).join(', ')}${usos.length > 3 ? ' e outras' : ''}), então não pode ser apagado sem quebrar o custo delas. Pode ficar inativo e sair das listas de seleção.`,
        textoAcao: 'Inativar',
        aoConfirmar: () => { insumo.ativo = false; }
      });
    } else {
      confirmar({
        titulo: `Remover ${insumo.nome}?`,
        texto: 'Nenhuma receita usa este insumo, então ele pode ser apagado de vez. Isso não dá para desfazer.',
        aoConfirmar: () => {
          estado.catalogo.insumos = estado.catalogo.insumos.filter((i) => i !== insumo);
        }
      });
    }
  }

  if (acao === 'novo-cadastro') {
    abrirFormularioCadastro(alvo.dataset.tipo, null);
  }

  if (acao === 'editar-cadastro') {
    const tipo = alvo.dataset.tipo;
    abrirFormularioCadastro(tipo, CADASTROS[tipo].lista().find((i) => i.id === alvo.dataset.id));
  }

  if (acao === 'remover-cadastro') {
    const tipo = alvo.dataset.tipo;
    const def = CADASTROS[tipo];
    const item = def.lista().find((i) => i.id === alvo.dataset.id);
    const usos = def.usoQtd(item);

    if (usos > 0) {
      confirmar({
        titulo: `Inativar ${item.nome}?`,
        texto: `Este cadastro está em uso em ${usos} ${usos === 1 ? 'registro' : 'registros'}, então não pode ser apagado. Ele pode ficar inativo: sai das listas de seleção e os registros antigos continuam como estão.`,
        textoAcao: 'Inativar',
        aoConfirmar: () => { item.ativa = false; }
      });
    } else if (item.ativa === false) {
      confirmar({
        titulo: `Remover ${item.nome}?`,
        texto: 'Este cadastro está inativo e não tem nenhum vínculo. Pode ser apagado de vez, e isso não dá para desfazer.',
        aoConfirmar: () => def.excluir(item)
      });
    } else {
      confirmar({
        titulo: `Remover ${item.nome}?`,
        texto: 'Nenhum registro usa este cadastro, então ele pode ser apagado de vez. Isso não dá para desfazer.',
        aoConfirmar: () => def.excluir(item)
      });
    }
  }

  if (acao === 'abrir-importacao') {
    document.getElementById('arquivo-importacao').click();
  }

  if (acao === 'cancelar-importacao') {
    estado.importacao = null;
    renderizar();
  }

  if (acao === 'confirmar-importacao') {
    const validas = estado.importacao.linhas.filter((l) => !l.problemas.length);
    validas.forEach((l) => {
      estado.catalogo.custos.unshift({
        id: `custo-${estado.proximoCustoId++}`,
        data: l.data, categoria: l.categoria, descricao: l.descricao, valor: l.valor, pago: l.pago
      });
    });
    estado.catalogo.custos.sort((a, b) => (a.data < b.data ? 1 : -1));
    estado.importacao = null;
    renderizar();
  }

  if (acao === 'lancar-custo') {
    const valor = lerMoeda(document.getElementById('custo-valor').value);
    const descricao = document.getElementById('custo-descricao').value.trim();
    if (!valor || !descricao) {
      alert('Informe a descrição e o valor do custo.');
      return;
    }
    estado.catalogo.custos.unshift({
      id: `custo-${estado.proximoCustoId++}`,
      data: document.getElementById('custo-data').value || '2026-10-05',
      categoria: document.getElementById('custo-categoria').value,
      descricao,
      valor,
      pago: document.getElementById('custo-pago').checked
    });
    renderizar();
  }

  if (acao === 'aba-custo') {
    estado.abaCusto = alvo.dataset.aba;
    renderizar();
    return;
  }

  if (acao === 'add-item-compra') {
    linhaDeCompra();
    atualizarPreviaDaCompra();
    const campos = document.querySelectorAll('#listaCompra .ic-nome');
    if (campos.length) campos[campos.length - 1].focus();
    return;
  }

  if (acao === 'remover-item-compra') {
    const linha = alvo.closest('.linha-compra');
    if (linha) linha.remove();
    if (!document.querySelector('#listaCompra .linha-compra')) linhaDeCompra();
    atualizarPreviaDaCompra();
    return;
  }

  if (acao === 'lancar-compra') {
    lancarCompra();
    return;
  }

});

/* ------------------------------------------------------------------
   Gravação da compra.

   O gasto entra sempre, porque o dinheiro saiu. O que pode ou não
   acontecer é a mudança de preço do insumo: quando ela é grande, a
   usuária decide item a item antes de aplicar.
------------------------------------------------------------------ */
function lancarCompra() {
  const itens = itensDaCompra().filter((i) => i.nomeDigitado || i.quantidade || i.valor);

  if (!itens.length) { alert('Adicione pelo menos um item à compra.'); return; }

  const semInsumo = itens.filter((i) => !i.insumoId);
  if (semInsumo.length) {
    alert(`Não encontrei na lista de insumos: ${semInsumo.map((i) => i.nomeDigitado || '(sem nome)').join(', ')}.\n\nCadastre o insumo primeiro, ou corrija o nome.`);
    return;
  }
  if (itens.some((i) => i.quantidade <= 0 || i.valor <= 0)) {
    alert('Cada item precisa de quantidade e valor maiores que zero.');
    return;
  }

  const dados = {
    data: document.getElementById('compra-data').value || HOJE,
    fornecedor: document.getElementById('compra-fornecedor').value.trim(),
    pagamento: document.getElementById('compra-pagamento').value,
    pago: document.getElementById('compra-pago').checked
  };

  const avaliacoes = avaliarCompra(itens, estado.catalogo);
  const aConfirmar = avaliacoes.filter((a) => a.confirmar);

  if (!aConfirmar.length) { gravarCompra(itens, dados, []); return; }
  abrirConfirmacaoDeCompra(itens, dados, aConfirmar);
}

function gravarCompra(itens, dados, recusados) {
  const aplicados = aplicarCompra(itens, estado.catalogo, dados.data, recusados);

  estado.catalogo.custos.unshift({
    id: `custo-${estado.proximoCustoId++}`,
    data: dados.data,
    categoria: 'Ingredientes',
    descricao: descricaoDaCompra(itens, estado.catalogo, dados.fornecedor),
    valor: Math.round(totalDaCompra(itens) * 100) / 100,
    pago: dados.pago,
    fornecedor: dados.fornecedor,
    pagamento: dados.pagamento,
    itens: itens.map((i) => ({ insumoId: i.insumoId, quantidade: i.quantidade, valor: i.valor }))
  });
  estado.catalogo.custos.sort((a, b) => (a.data < b.data ? 1 : -1));

  voltarPrimeiraPagina('custos');
  fecharDialogo();
  renderizar();

  if (aplicados.length) {
    const alvo = document.getElementById('avisoDaCompra');
    if (alvo) {
      alvo.style.display = 'flex';
      alvo.querySelector('div').textContent = aplicados.length === 1
        ? `Compra lançada. O preço de ${aplicados[0].nome} foi atualizado.`
        : `Compra lançada. ${aplicados.length} preços de insumo foram atualizados.`;
    }
  }
}

function abrirConfirmacaoDeCompra(itens, dados, aConfirmar) {
  const linhas = aConfirmar.map((a) => {
    const subiu = a.variacao > 0;
    return `<label class="conf-linha">
      <input type="checkbox" class="conf-item" value="${a.insumoId}" checked>
      <span class="conf-nome">${esc(a.nome)}</span>
      <span class="conf-valores">
        ${formatarMoeda(a.precoAntigo)} <span class="suave">para</span> <span class="forte">${formatarMoeda(a.precoNovo)}</span>
      </span>
      <span class="selo ${subiu ? 'selo-alerta' : 'selo-ok'}">${subiu ? '+' : ''}${formatarPercentual(a.variacao, 0)}</span>
    </label>`;
  }).join('');

  abrirDialogo(`
    <h2 class="diag-titulo">${aConfirmar.length === 1 ? 'Um preço mudou bastante' : 'Alguns preços mudaram bastante'}</h2>
    <p class="diag-texto">
      ${aConfirmar.length === 1 ? 'Este item veio' : 'Estes itens vieram'} com preço bem diferente do que está cadastrado.
      Aplicar muda o custo de toda ficha que usa ${aConfirmar.length === 1 ? 'esse insumo' : 'esses insumos'}.
      Desmarque o que foi compra fora do normal: o gasto entra do mesmo jeito, só o preço de referência é que fica como está.
    </p>
    <div class="conf-lista">${linhas}</div>
    <div class="diag-acoes">
      <button class="botao botao-claro" data-diag="cancelar">Cancelar</button>
      <button class="botao" data-diag="confirmar-compra">Lançar compra</button>
    </div>`, true);

  confirmacaoDeCompra = () => {
    const marcados = new Set([...document.querySelectorAll('.conf-item:checked')].map((c) => c.value));
    const recusados = aConfirmar.map((a) => a.insumoId).filter((id) => !marcados.has(id));
    gravarCompra(itens, dados, recusados);
  };
}

/**
 * Na ficha, recalcula sem redesenhar a tela inteira, para o foco
 * não sair do campo enquanto a usuária digita a quantidade.
 */
function atualizarFichaNaTela(ficha) {
  const r = resumoDaFicha(ficha, estado.catalogo, estado.parametros);
  const linhas = document.querySelectorAll('tbody tr');
  ficha.ingredientes.forEach((linha, indice) => {
    const celulas = linhas[indice] && linhas[indice].querySelectorAll('td');
    if (!celulas) return;
    const insumo = acharInsumo(linha.insumoId);
    const bruto = linha.quantidade / fatorDeCorrecao(insumo);
    celulas[3].textContent = formatarPeso(bruto);
    celulas[5].textContent = formatarMoeda(custoDoIngrediente(linha, estado.catalogo));
  });
  const alvos = document.querySelectorAll('[data-vivo]');
  alvos.forEach((elemento) => {
    const chave = elemento.dataset.vivo;
    if (chave === 'custoReceita') elemento.textContent = formatarMoeda(r.custoReceita);
    if (chave === 'pesoTotal') elemento.textContent = formatarPeso(r.pesoTotal);
    if (chave === 'custoPorcao') elemento.textContent = formatarMoeda(r.custoPorcao);
    if (chave === 'precoSugerido') elemento.textContent = formatarMoeda(r.precoSugerido);
    if (chave === 'cmvReal') elemento.textContent = formatarPercentual(r.cmvReal);
  });
}

/* ------------------------------------------------------------------
   Dica que segue o mouse no gráfico de meses.
   Fica aqui, e não no módulo de gráficos, porque é a única parte que
   precisa do DOM: o módulo continua devolvendo só marcação.
------------------------------------------------------------------ */
function caixaDaDica() {
  let caixa = document.getElementById('dicaGrafico');
  if (!caixa) {
    caixa = document.createElement('div');
    caixa.id = 'dicaGrafico';
    caixa.className = 'dica-grafico';
    document.body.appendChild(caixa);
  }
  return caixa;
}

document.addEventListener('mousemove', (evento) => {
  const alvo = evento.target.closest && evento.target.closest('[data-grafico="mes"]');
  const caixa = caixaDaDica();
  const guia = document.getElementById('guiaMes');

  if (!alvo) {
    caixa.style.opacity = 0;
    if (guia) guia.style.opacity = 0;
    return;
  }

  const serie = serieMensal({ vendas, custos: estado.catalogo.custos, catalogo: estado.catalogo, hoje: HOJE });
  const m = serie[Number(alvo.dataset.indice)];
  if (!m) return;

  if (guia) {
    const centro = Number(alvo.getAttribute('x')) + Number(alvo.getAttribute('width')) / 2;
    guia.setAttribute('x1', centro);
    guia.setAttribute('x2', centro);
    guia.style.opacity = 1;
  }

  caixa.innerHTML = `<b>${esc(m.rotulo)}${m.emAndamento ? ' · em andamento' : ''}</b>
    <div class="l"><span><i style="background:#C9C6AE"></i>Faturamento</span><span>${formatarMoeda(m.faturamento)}</span></div>
    <div class="l"><span><i style="background:var(--terracota)"></i>Gastos</span><span>${formatarMoeda(m.gastos)}</span></div>
    <div class="l"><span><i style="background:var(--verde)"></i>Lucro</span><span>${formatarMoeda(m.lucro)}</span></div>
    <div class="l" style="border-top:1px solid rgba(255,255,255,.18);margin-top:7px;padding-top:6px">
      <span>Margem</span><span>${formatarPercentual(m.margem)}</span></div>`;
  caixa.style.opacity = 1;
  caixa.style.left = `${Math.min(window.innerWidth - 230, evento.clientX + 16)}px`;
  caixa.style.top = `${Math.min(window.innerHeight - 170, evento.clientY + 16)}px`;
});

window.addEventListener('hashchange', renderizar);
renderizar();
