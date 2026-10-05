import { catalogoInicial, parametrosIniciais, faturamentoMensal, historicoCastanha } from './dados.js';
import {
  resumoDaFicha, custoDoIngrediente, fatorDeCorrecao, precoPorQuilo,
  custoPorPorcao, precoSugerido, metaDeCmv, cmvReal,
  formatarMoeda, formatarPercentual, formatarPeso, lerMoeda
} from './calculo.js';

/* ------------------------------------------------------------------
   Estado em memória. Recarregar a página volta aos dados de exemplo.
------------------------------------------------------------------ */
const estado = {
  catalogo: catalogoInicial(),
  parametros: { ...parametrosIniciais },
  abaConfig: 'parametros',
  selecionados: {},
  novosPrecos: {}
};

const PAGINAS = [
  { rota: 'painel', titulo: 'Painel', icone: 'grafico' },
  { rota: 'fichas', titulo: 'Produtos e fichas', icone: 'livro' },
  { rota: 'ajuste', titulo: 'Ajuste de preços', icone: 'etiqueta' },
  { rota: 'insumos', titulo: 'Insumos', icone: 'cesta' },
  { rota: 'custos', titulo: 'Custos', icone: 'carteira' },
  { rota: 'config', titulo: 'Configuração', icone: 'engrenagem' }
];

const ICONES = {
  grafico: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  livro: '<path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4zM20 4h-6"/><path d="M20 4v16h-6"/>',
  etiqueta: '<path d="M3 11V4h7l10 10-7 7z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
  cesta: '<path d="M3 9h18l-2 11H5z"/><path d="M8 9 12 3l4 6"/>',
  carteira: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="17" cy="14.5" r="1.2"/>',
  engrenagem: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
  alerta: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'
};

const icone = (nome) => `<svg class="icone" viewBox="0 0 24 24" aria-hidden="true">${ICONES[nome] || ''}</svg>`;
const esc = (texto) => String(texto).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ------------------------------------------------------------------
   Utilidades de domínio
------------------------------------------------------------------ */
const fichasVendaveis = () => estado.catalogo.fichas.filter((f) => !f.subReceita);
const acharFicha = (id) => estado.catalogo.fichas.find((f) => f.id === id);
const acharInsumo = (id) => estado.catalogo.insumos.find((i) => i.id === id);
const nomeCategoria = (id) => {
  const c = estado.catalogo.categorias.find((x) => x.id === id);
  return c ? c.nome : 'Sem categoria';
};

function fichasComDiferenca() {
  return fichasVendaveis()
    .map((ficha) => ({ ficha, resumo: resumoDaFicha(ficha, estado.catalogo, estado.parametros) }))
    .filter(({ resumo }) => Math.abs(resumo.diferenca) >= 0.01);
}

/* ------------------------------------------------------------------
   Telas
------------------------------------------------------------------ */
function telaPainel() {
  const faturamento = 3200;
  const custoMes = estado.catalogo.custos
    .filter((c) => c.data.startsWith('2026-10'))
    .reduce((t, c) => t + c.valor, 0);
  const lucro = faturamento - custoMes;
  const aReceber = 740;

  const maior = Math.max(...faturamentoMensal.map((m) => m.faturamento));
  const barras = faturamentoMensal.map((m) => `
    <div class="coluna">
      <div class="par">
        <div class="barra barra-a" style="height:${(m.faturamento / maior) * 100}%"></div>
        <div class="barra barra-b" style="height:${(m.custo / maior) * 100}%"></div>
      </div>
      <div class="rotulo">${m.mes}</div>
    </div>`).join('');

  const margens = fichasVendaveis().map((ficha) => {
    const r = resumoDaFicha(ficha, estado.catalogo, estado.parametros);
    return `<tr>
      <td>${esc(ficha.nome)}</td>
      <td class="num suave">${formatarMoeda(r.custoPorcao)}</td>
      <td class="num">${formatarMoeda(ficha.precoPraticado)}</td>
      <td class="num ${r.acimaDaMeta ? 'valor-alerta' : 'valor-ok'}">${formatarPercentual(r.cmvReal)}</td>
    </tr>`;
  }).join('');

  const foraDaMeta = fichasVendaveis().filter((f) => resumoDaFicha(f, estado.catalogo, estado.parametros).acimaDaMeta);
  const porCategoria = {};
  estado.catalogo.custos.filter((c) => c.data.startsWith('2026-10')).forEach((c) => {
    porCategoria[c.categoria] = (porCategoria[c.categoria] || 0) + c.valor;
  });
  const maiorCusto = Math.max(...Object.values(porCategoria), 1);
  const linhasCusto = Object.entries(porCategoria)
    .sort((a, b) => b[1] - a[1])
    .map(([nome, valor]) => `
      <div>
        <div style="display:flex;justify-content:space-between;font-size:14.5px">
          <span>${esc(nome)}</span><span class="suave">${formatarMoeda(valor)}</span>
        </div>
        <div class="trilho"><div style="width:${(valor / maiorCusto) * 100}%"></div></div>
      </div>`).join('');

  return `
    <div class="cabecalho">
      <div>
        <h1 class="titulo">Painel financeiro</h1>
        <p class="subtitulo">Outubro de 2026. Os números de margem vêm das fichas técnicas e mudam quando um preço de insumo muda.</p>
      </div>
    </div>

    <section class="grade grade-4">
      <div class="cartao indicador"><div class="rotulo">Faturamento</div><div class="valor">${formatarMoeda(faturamento)}</div><div class="apoio">23% acima de setembro</div></div>
      <div class="cartao indicador"><div class="rotulo">Custos</div><div class="valor">${formatarMoeda(custoMes)}</div><div class="apoio">lançados na tela de custos</div></div>
      <div class="cartao indicador"><div class="rotulo">Lucro</div><div class="valor">${formatarMoeda(lucro)}</div><div class="apoio">margem de ${formatarPercentual(lucro / faturamento)}</div></div>
      <div class="cartao indicador"><div class="rotulo">A receber</div><div class="valor">${formatarMoeda(aReceber)}</div><div class="apoio">3 pedidos em atraso</div></div>
    </section>

    <section class="cartao">
      <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:baseline">
        <h2 class="cartao-titulo">Faturamento e custo</h2>
        <div class="legenda">
          <span><i style="background:var(--oliva)"></i>Faturamento</span>
          <span><i style="background:var(--areia)"></i>Custo</span>
        </div>
      </div>
      <div class="barras">${barras}</div>
    </section>

    <section class="grade grade-2">
      <div class="cartao">
        <h2 class="cartao-titulo">Margem por produto</h2>
        <p class="cartao-nota">CMV real, calculado sobre o preço que está sendo praticado</p>
        <div class="rolagem" style="margin-top:14px">
          <table>
            <thead><tr><th>Produto</th><th class="num">Custo</th><th class="num">Preço</th><th class="num">CMV</th></tr></thead>
            <tbody>${margens}</tbody>
          </table>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="cartao">
          <h2 class="cartao-titulo">Precisam de atenção</h2>
          <div style="display:flex;flex-direction:column;gap:11px;margin-top:14px">
            ${foraDaMeta.length === 0
              ? '<div class="aviso aviso-neutro">' + icone('info') + '<div>Todos os produtos estão dentro da meta de CMV.</div></div>'
              : foraDaMeta.map((f) => {
                  const r = resumoDaFicha(f, estado.catalogo, estado.parametros);
                  return `<div class="aviso aviso-atencao">${icone('alerta')}<div><strong>${esc(f.nome)} está acima da meta.</strong> A meta é ${formatarPercentual(r.metaCmv, 0)} e o preço de ${formatarMoeda(f.precoPraticado)} resulta em ${formatarPercentual(r.cmvReal)}. O sugerido é ${formatarMoeda(r.precoSugerido)}.</div></div>`;
                }).join('')}
            ${foraDaMeta.length ? '<a class="botao" href="#/ajuste" style="text-decoration:none">Ajustar preços</a>' : ''}
          </div>
        </div>

        <div class="cartao">
          <h2 class="cartao-titulo">Para onde vai o dinheiro</h2>
          <div style="display:flex;flex-direction:column;gap:13px;margin-top:14px">${linhasCusto}</div>
        </div>
      </div>
    </section>`;
}

function telaFichas() {
  const linhas = estado.catalogo.fichas.map((ficha) => {
    const r = resumoDaFicha(ficha, estado.catalogo, estado.parametros);
    return `<tr>
      <td><a href="#/ficha/${ficha.id}">${esc(ficha.nome)}</a>${ficha.subReceita ? ' <span class="selo selo-neutro">sub-receita</span>' : ''}</td>
      <td class="suave">${esc(nomeCategoria(ficha.categoriaId))}</td>
      <td class="num suave">${ficha.rendimento} ${ficha.subReceita ? 'kg' : 'porções'}</td>
      <td class="num">${formatarMoeda(r.custoPorcao)}</td>
      <td class="num">${ficha.subReceita ? '<span class="suave">não é vendida</span>' : formatarMoeda(ficha.precoPraticado)}</td>
      <td class="num">${ficha.subReceita ? '' : `<span class="${r.acimaDaMeta ? 'valor-alerta' : 'valor-ok'}">${formatarPercentual(r.cmvReal)}</span>`}</td>
    </tr>`;
  }).join('');

  return `
    <div class="cabecalho">
      <div>
        <h1 class="titulo">Produtos e fichas</h1>
        <p class="subtitulo">Cada produto tem uma ficha técnica. Sub-receitas, como o frango desfiado, entram como insumo em outras fichas.</p>
      </div>
    </div>
    <section class="cartao">
      <div class="rolagem">
        <table>
          <thead><tr><th>Produto</th><th>Categoria</th><th class="num">Rendimento</th><th class="num">Custo por porção</th><th class="num">Preço</th><th class="num">CMV real</th></tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>
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
    </tr>`;
  }).join('');

  const blocoPreco = ficha.subReceita
    ? `<div class="cartao">
         <h2 class="cartao-titulo">Uso</h2>
         <p class="cartao-nota" style="margin-top:10px">Esta ficha não é vendida direto. Ela vira insumo com custo de ${formatarMoeda(r.custoReceita / r.pesoTotal)} por quilo, usado automaticamente nas fichas que a incluem.</p>
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
      <a class="botao botao-claro" href="#/fichas" style="text-decoration:none">Voltar</a>
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
        <span class="cartao-nota">As colunas com fundo claro são calculadas pelo sistema</span>
      </div>
      <div class="rolagem" style="margin-top:14px">
        <table>
          <thead><tr>
            <th>Insumo</th><th class="num">Quantidade (kg)</th>
            <th class="num calculada">Fator de correção</th><th class="num calculada">Peso bruto</th>
            <th class="num calculada">Preço por kg</th><th class="num calculada">Custo</th>
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
  const linhas = estado.catalogo.insumos.map((insumo) => {
    const desatualizado = insumo.cotacao < '2026-07-01';
    return `<tr>
      <td>${esc(insumo.nome)}${insumo.fichaId ? ' <span class="selo selo-neutro">preço vem da ficha</span>' : ''}</td>
      <td class="suave">${esc(insumo.unidade)}</td>
      <td class="num suave">${insumo.pesoLiquido.toFixed(3).replace('.', ',')}</td>
      <td class="num calculada suave">${fatorDeCorrecao(insumo).toFixed(2).replace('.', ',')}</td>
      <td class="num">${insumo.fichaId
        ? `<span class="suave">${formatarMoeda(precoPorQuilo(insumo, estado.catalogo))}</span>`
        : `<input type="text" class="entrada-num" value="${formatarMoeda(insumo.preco)}" data-acao="preco-insumo" data-insumo="${insumo.id}" aria-label="Preço de ${esc(insumo.nome)}" style="max-width:130px">`}</td>
      <td class="suave">${esc(insumo.fornecedor)}</td>
      <td class="${desatualizado ? 'valor-alerta' : 'suave'}">${insumo.cotacao.split('-').reverse().join('/')}</td>
    </tr>`;
  }).join('');

  const maior = Math.max(...historicoCastanha.map((h) => h.preco));
  const menor = Math.min(...historicoCastanha.map((h) => h.preco));
  const barras = historicoCastanha.map((h) => `
    <div class="coluna">
      <div class="par"><div class="barra barra-a" style="width:70%;height:${20 + ((h.preco - menor) / (maior - menor || 1)) * 80}%"></div></div>
      <div class="rotulo">${h.mes}</div>
    </div>`).join('');
  const variacao = (historicoCastanha[historicoCastanha.length - 1].preco / historicoCastanha[0].preco) - 1;

  return `
    <div class="cabecalho">
      <div>
        <h1 class="titulo">Insumos</h1>
        <p class="subtitulo">O preço é informado por você, como na planilha. Alterar um preço aqui recalcula na hora o custo de toda ficha que usa esse insumo.</p>
      </div>
    </div>

    <section class="cartao">
      <div class="rolagem">
        <table>
          <thead><tr>
            <th>Insumo</th><th>Unidade</th><th class="num">Peso líquido</th>
            <th class="num calculada">Fator de correção</th><th class="num">Preço por kg</th>
            <th>Fornecedor</th><th>Cotação</th>
          </tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>
    </section>

    <section class="cartao grade grade-2">
      <div>
        <h2 class="cartao-titulo">Histórico de preço</h2>
        <p class="cartao-nota">Castanha de caju inteira, últimos seis meses</p>
        <div class="barras" style="height:170px">${barras}</div>
      </div>
      <div style="background:var(--creme-col);border-radius:var(--raio);padding:20px">
        <div class="suave" style="font-size:14px">Variação no período</div>
        <div class="valor-alerta" style="font-family:'Cormorant Garamond',serif;font-size:31px;margin-top:4px">+${formatarPercentual(variacao)}</div>
        <p class="suave" style="font-size:14px;line-height:1.5;margin-top:12px">Esse insumo entra no creme de castanha. Experimente mudar o preço dele na tabela acima e abrir a ficha: o custo e o preço sugerido mudam junto.</p>
      </div>
    </section>`;
}

function telaCustos() {
  const doMes = estado.catalogo.custos.filter((c) => c.data.startsWith('2026-10'));
  const total = doMes.reduce((t, c) => t + c.valor, 0);
  const pago = doMes.filter((c) => c.pago).reduce((t, c) => t + c.valor, 0);

  const linhas = estado.catalogo.custos.map((c, indice) => `
    <tr>
      <td class="suave">${c.data.split('-').reverse().join('/')}</td>
      <td>${esc(c.categoria)}</td>
      <td class="suave">${esc(c.descricao)}</td>
      <td class="num forte">${formatarMoeda(c.valor)}</td>
      <td><button class="selo ${c.pago ? 'selo-ok' : 'selo-alerta'}" data-acao="alternar-pago" data-indice="${indice}">${c.pago ? 'Pago' : 'A pagar'}</button></td>
    </tr>`).join('');

  const opcoes = estado.catalogo.categoriasDeCusto.map((c) => `<option>${esc(c)}</option>`).join('');

  return `
    <div class="cabecalho">
      <div>
        <h1 class="titulo">Custos</h1>
        <p class="subtitulo">Uma linha por gasto. Os totais do painel saem daqui.</p>
      </div>
    </div>

    <section class="grade grade-3">
      <div class="cartao indicador"><div class="rotulo">Total de outubro</div><div class="valor">${formatarMoeda(total)}</div></div>
      <div class="cartao indicador"><div class="rotulo">Pago</div><div class="valor">${formatarMoeda(pago)}</div></div>
      <div class="cartao indicador"><div class="rotulo">A pagar</div><div class="valor valor-alerta">${formatarMoeda(total - pago)}</div></div>
    </section>

    <section class="cartao">
      <h2 class="cartao-titulo">Novo custo</h2>
      <div class="grade grade-4" style="margin-top:16px">
        <label class="campo">Data<input type="date" id="custo-data" value="2026-10-05"></label>
        <label class="campo">Categoria<select id="custo-categoria">${opcoes}</select></label>
        <label class="campo">Descrição<input type="text" id="custo-descricao" placeholder="Compra na feira"></label>
        <label class="campo">Valor<input type="text" id="custo-valor" class="entrada-num" placeholder="R$ 0,00"></label>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;margin-top:16px">
        <label style="display:flex;align-items:center;gap:10px;font-size:15px;cursor:pointer"><input type="checkbox" id="custo-pago"> Já está pago</label>
        <button class="botao" data-acao="lancar-custo">Lançar custo</button>
      </div>
    </section>

    <section class="cartao">
      <div class="rolagem">
        <table>
          <thead><tr><th>Data</th><th>Categoria</th><th>Descrição</th><th class="num">Valor</th><th>Situação</th></tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>
    </section>`;
}

function telaConfig() {
  const p = estado.parametros;
  const abaParametros = estado.abaConfig === 'parametros';

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

  const listaSimples = (titulo, nota, itens, acao, textoBotao) => `
    <div class="cartao">
      <h2 class="cartao-titulo">${titulo}</h2>
      <p class="cartao-nota">${nota}</p>
      <div style="margin-top:14px">
        ${itens.map((i) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-top:1px solid #EDEDE0;font-size:14.5px"><span>${esc(i.nome)}</span><span class="suave" style="font-size:13px">${esc(i.apoio)}</span></div>`).join('')}
      </div>
      <div style="display:flex;gap:10px;margin-top:16px">
        <input type="text" placeholder="${textoBotao}" data-campo-novo="${acao}">
        <button class="botao" data-acao="${acao}">Adicionar</button>
      </div>
    </div>`;

  const corpoCadastros = `
    <section class="cartao">
      <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:baseline">
        <div>
          <h2 class="cartao-titulo">Categorias de produto</h2>
          <p class="cartao-nota">Cada categoria tem a sua meta de CMV. Um produto pode ter meta própria na ficha.</p>
        </div>
      </div>
      <div class="rolagem" style="margin-top:14px">
        <table>
          <thead><tr><th>Categoria</th><th class="num">Meta de CMV</th><th class="num">Produtos</th><th>Situação</th></tr></thead>
          <tbody>
            ${estado.catalogo.categorias.map((c) => `<tr>
              <td>${esc(c.nome)}</td>
              <td class="num"><input type="text" class="entrada-num" value="${formatarPercentual(c.metaCmv, 0)}" data-acao="meta-categoria" data-categoria="${c.id}" style="max-width:100px"></td>
              <td class="num suave">${estado.catalogo.fichas.filter((f) => f.categoriaId === c.id).length}</td>
              <td><span class="selo ${c.ativa ? 'selo-ok' : 'selo-neutro'}">${c.ativa ? 'Ativa' : 'Inativa'}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div style="display:flex;gap:10px;margin-top:16px">
        <input type="text" placeholder="Nome da categoria" data-campo-novo="nova-categoria">
        <button class="botao" data-acao="nova-categoria">Adicionar</button>
      </div>
    </section>

    <section class="grade grade-2">
      ${listaSimples('Categorias de custo', 'Aparecem na hora de lançar um gasto.',
        estado.catalogo.categoriasDeCusto.map((c) => ({ nome: c, apoio: `${estado.catalogo.custos.filter((x) => x.categoria === c).length} lançamentos` })),
        'nova-categoria-custo', 'Nome da categoria')}
      ${listaSimples('Fornecedores', 'Usados no cadastro de insumo e na cotação.',
        estado.catalogo.fornecedores.map((f) => ({ nome: f, apoio: `${estado.catalogo.insumos.filter((i) => i.fornecedor === f).length} insumos` })),
        'novo-fornecedor', 'Nome do fornecedor')}
      ${listaSimples('Unidades de medida', 'Cada unidade tem a conversão para quilo, que é a base do custo.',
        estado.catalogo.unidades.map((u) => ({ nome: u.nome, apoio: u.conversao })),
        'nova-unidade', 'Unidade')}
      ${listaSimples('Formas de pagamento', 'Aparecem no pedido. A taxa entra no cálculo da margem.',
        estado.catalogo.formasDePagamento.map((f) => ({ nome: f.nome, apoio: f.taxa ? `taxa de ${formatarPercentual(f.taxa)}` : 'sem taxa' })),
        'nova-forma-pagamento', 'Forma de pagamento')}
    </section>

    <div class="aviso aviso-neutro">${icone('info')}<div><strong>Sobre apagar.</strong> Uma categoria, fornecedor ou unidade que já está em uso não seria apagada, e sim marcada como inativa, para não quebrar os registros antigos.</div></div>`;

  return `
    <div class="cabecalho">
      <div>
        <h1 class="titulo">Configuração</h1>
        <p class="subtitulo">Parâmetros são valores únicos que entram no cálculo. Cadastros são as listas que crescem com o tempo e que você mesma mantém.</p>
      </div>
    </div>
    <div class="abas">
      <button class="${abaParametros ? 'ativa' : ''}" data-acao="aba" data-aba="parametros">Parâmetros de preço</button>
      <button class="${!abaParametros ? 'ativa' : ''}" data-acao="aba" data-aba="cadastros">Cadastros</button>
    </div>
    ${abaParametros ? corpoParametros : corpoCadastros}`;
}

/* ------------------------------------------------------------------
   Roteamento e eventos
------------------------------------------------------------------ */
function rotaAtual() {
  const bruto = (location.hash || '#/painel').replace('#/', '');
  const [pagina, parametro] = bruto.split('/');
  return { pagina: pagina || 'painel', parametro };
}

function renderizarMenu(paginaAtiva) {
  document.getElementById('menu').innerHTML = PAGINAS.map((p) => {
    const ativo = p.rota === paginaAtiva || (paginaAtiva === 'ficha' && p.rota === 'fichas');
    return `<a href="#/${p.rota}" class="${ativo ? 'ativo' : ''}">${icone(p.icone)}${p.titulo}</a>`;
  }).join('');
}

function renderizar() {
  const { pagina, parametro } = rotaAtual();
  renderizarMenu(pagina);
  const telas = {
    painel: telaPainel,
    fichas: telaFichas,
    ficha: () => telaFicha(parametro),
    ajuste: telaAjuste,
    insumos: telaInsumos,
    custos: telaCustos,
    config: telaConfig
  };
  const render = telas[pagina] || telaPainel;
  document.getElementById('conteudo').innerHTML = render() + `
    <p class="rodape-proto">Protótipo funcional do módulo financeiro do Maluzices. Os cálculos de custo, CMV e preço sugerido são reais; os dados são de exemplo e ficam só na memória do navegador, então recarregar a página volta ao estado inicial.</p>`;
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
    case 'meta-categoria': {
      const categoria = estado.catalogo.categorias.find((c) => c.id === alvo.dataset.categoria);
      categoria.metaCmv = lerMoeda(alvo.value) / 100;
      renderizar();
      break;
    }
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

document.addEventListener('click', (evento) => {
  const alvo = evento.target.closest('[data-acao]');
  if (!alvo) return;
  const acao = alvo.dataset.acao;

  if (acao === 'aba') {
    estado.abaConfig = alvo.dataset.aba;
    renderizar();
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
    const custo = estado.catalogo.custos[Number(alvo.dataset.indice)];
    custo.pago = !custo.pago;
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
      data: document.getElementById('custo-data').value || '2026-10-05',
      categoria: document.getElementById('custo-categoria').value,
      descricao,
      valor,
      pago: document.getElementById('custo-pago').checked
    });
    renderizar();
  }

  const cadastros = {
    'nova-categoria': (nome) => estado.catalogo.categorias.push({ id: nome.toLowerCase().replace(/\s+/g, '-'), nome, metaCmv: estado.parametros.metaCmvPadrao, ativa: true }),
    'nova-categoria-custo': (nome) => estado.catalogo.categoriasDeCusto.push(nome),
    'novo-fornecedor': (nome) => estado.catalogo.fornecedores.push(nome),
    'nova-unidade': (nome) => estado.catalogo.unidades.push({ nome, conversao: 'conversão a definir' }),
    'nova-forma-pagamento': (nome) => estado.catalogo.formasDePagamento.push({ nome, taxa: 0 })
  };
  if (cadastros[acao]) {
    const campo = document.querySelector(`[data-campo-novo="${acao}"]`);
    const nome = campo.value.trim();
    if (!nome) return;
    cadastros[acao](nome);
    renderizar();
  }
});

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

window.addEventListener('hashchange', renderizar);
renderizar();
