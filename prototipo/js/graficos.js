/**
 * Gráficos da visão geral, desenhados em SVG na mão.
 *
 * Sem biblioteca de propósito: o protótipo não tem build nem dependência,
 * e qualquer biblioteca traria um visual próprio que teria de ser desfeito
 * para parecer Maluzices. Cada função devolve marcação pronta, sem tocar
 * no DOM, então dá para montar a tela inteira como string.
 *
 * As cores saem das variáveis da folha de estilo, para o gráfico seguir a
 * identidade sem repetir código hexadecimal por aqui.
 */
import { formatarMoeda, formatarPercentual } from './calculo.js?v=9da65f59';

const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const moedaCurta = (v) => {
  if (Math.abs(v) >= 1000) return `R$ ${(v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mil`;
  return formatarMoeda(v);
};

/** Topo "redondo" da escala, para a linha de grade cair num número legível. */
function tetoDaEscala(valor) {
  if (valor <= 0) return 1;
  const ordem = 10 ** Math.floor(Math.log10(valor));
  return Math.ceil(valor / (ordem / 2)) * (ordem / 2);
}

/** Legenda em HTML, acima do gráfico, com a bolinha da cor da série. */
export function legenda(series) {
  return `<div class="g-legenda">
    ${series.map((s) => `<span class="g-legenda-item"><i class="g-ponto-cor" style="background:${s.cor}"></i>${esc(s.nome)}</span>`).join('')}
  </div>`;
}

/**
 * Faturamento, gastos e lucro ao longo dos meses.
 *
 * Três linhas, cada uma com o valor escrito em cima do ponto. Antes isso
 * eram faixas preenchidas: bonito, mas para saber quanto foi o mês era
 * preciso passar o mouse. Com o número impresso, a leitura é imediata, que
 * é o que importa em quem abre o painel de manhã e fecha em dez segundos.
 *
 * Os rótulos saem alternados acima e abaixo da linha para não colidirem
 * quando as séries se aproximam.
 */
export function graficoFaturamentoLucro(serie) {
  if (!serie.length) return '<p class="cartao-nota">Sem dados no período.</p>';

  const L = 62, R = 26, T = 30, B = 32, W = 860, H = 300;
  const n = serie.length;
  const max = tetoDaEscala(Math.max(...serie.map((m) => m.faturamento)));
  const x = (i) => (n === 1 ? (W - L - R) / 2 + L : L + (i * (W - L - R)) / (n - 1));
  const y = (v) => T + (1 - v / max) * (H - T - B);

  const LINHAS_DE_GRADE = 5;
  const grade = Array.from({ length: LINHAS_DE_GRADE + 1 }, (_, k) => (max * k) / LINHAS_DE_GRADE)
    .map((v) => `
      <line class="g-grade" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/>
      <text class="g-eixo" x="${L - 12}" y="${y(v) + 4}" text-anchor="end">${moedaCurta(v)}</text>`).join('');

  const SERIES = [
    { campo: 'faturamento', nome: 'Faturamento', classe: 'faturamento', acima: true },
    { campo: 'gastos', nome: 'Gastos', classe: 'gastos', acima: false },
    { campo: 'lucro', nome: 'Lucro', classe: 'lucro', acima: false }
  ];

  const desenhar = (s) => {
    const caminho = serie.map((m, i) => `${i ? 'L' : 'M'}${x(i)},${y(valorDe(m, s.campo))}`).join('');
    const pontos = serie.map((m, i) => `
      <circle class="g-ponto g-${s.classe}" cx="${x(i)}" cy="${y(valorDe(m, s.campo))}" r="4"/>`).join('');
    const valores = serie.map((m, i) => `
      <text class="g-rotulo g-texto-${s.classe}" x="${x(i)}" y="${y(valorDe(m, s.campo)) + (s.acima ? -13 : 20)}"
            text-anchor="${i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}">${moedaCurta(valorDe(m, s.campo))}</text>`).join('');
    return `<path class="g-linha g-${s.classe}" d="${caminho}"/>${pontos}${valores}`;
  };

  const fim = n - 1;
  const emAndamento = serie[fim].emAndamento
    ? `<line class="g-tracejado" x1="${x(fim)}" x2="${x(fim)}" y1="${T}" y2="${H - B}"/>
       <text class="g-nota" x="${x(fim) - 7}" y="${T + 2}" text-anchor="end">mês em andamento</text>`
    : '';

  const rotulos = serie.map((m, i) => `<text class="g-eixo" x="${x(i)}" y="${H - 9}" text-anchor="middle">${esc(m.rotulo)}</text>`).join('');

  const alvos = serie.map((m, i) => `<rect class="g-alvo" x="${x(i) - (W - L - R) / (2 * Math.max(n - 1, 1))}" y="${T}"
      width="${(W - L - R) / Math.max(n - 1, 1)}" height="${H - T - B}"
      data-grafico="mes" data-indice="${i}"></rect>`).join('');

  // a legenda mora no cabeçalho do cartão, para o gráfico começar na mesma
  // altura do conteúdo do cartão vizinho
  return `
    <svg class="grafico" viewBox="0 0 ${W} ${H}" role="img"
         aria-label="Faturamento, gastos e lucro por mês, com o valor de cada mês escrito no gráfico.">
      ${grade}
      ${SERIES.map(desenhar).join('')}
      ${emAndamento}
      ${rotulos}
      <line class="g-guia" id="guiaMes" x1="0" x2="0" y1="${T}" y2="${H - B}"/>
      ${alvos}
    </svg>`;
}

/* O lucro não vem na série: é o que sobra do faturamento depois do gasto. */
function valorDe(mes, campo) {
  if (campo === 'lucro') return mes.faturamento - mes.gastos;
  return mes[campo];
}

/** Barras verticais do faturamento médio por dia da semana. */
export function graficoDiaDaSemana(dias) {
  const L = 58, R = 16, T = 26, B = 32, W = 750, H = 300;
  const max = tetoDaEscala(Math.max(...dias.map((d) => d.media), 1));
  const y = (v) => T + (1 - v / max) * (H - T - B);
  const faixa = (W - L - R) / dias.length;
  const largura = Math.min(58, faixa * 0.55);
  const melhor = dias.reduce((p, d, i) => (d.media > dias[p].media ? i : p), 0);

  const grade = Array.from({ length: 6 }, (_, k) => (max * k) / 5).map((v) => `
    <line class="g-grade" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/>
    <text class="g-eixo" x="${L - 12}" y="${y(v) + 4}" text-anchor="end">${moedaCurta(v)}</text>`).join('');

  const barras = dias.map((d, i) => {
    const centro = L + faixa * i + faixa / 2;
    const altura = Math.max(0, y(0) - y(d.media));
    return `
      <rect class="g-barra ${i === melhor ? "g-barra-forte" : ""}" x="${centro - largura / 2}" y="${y(d.media)}"
            width="${largura}" height="${altura}" rx="5">
        <title>${esc(d.dia)}: ${formatarMoeda(d.media)} em média por ${esc(d.dia.toLowerCase())}</title>
      </rect>
      <text class="g-valor" x="${centro}" y="${y(d.media) - 7}" text-anchor="middle">${moedaCurta(d.media)}</text>
      <text class="g-eixo" x="${centro}" y="${H - 9}" text-anchor="middle">${esc(d.dia)}</text>`;
  }).join('');

  return `
    <svg class="grafico" viewBox="0 0 ${W} ${H}" role="img" aria-label="Faturamento médio por dia da semana">
      ${grade}${barras}
    </svg>`;
}

/**
 * Barras horizontais. Em HTML, e não em SVG, porque o nome da categoria
 * precisa quebrar linha no celular e a tabela já resolve isso sozinha.
 */
export function barrasHorizontais(itens, { formatar = formatarMoeda, apoio } = {}) {
  if (!itens.length) return '<p class="cartao-nota">Sem dados no período.</p>';
  const maior = Math.max(...itens.map((i) => i.valor), 1);

  return `<div class="barras-h">
    ${itens.map((i) => `
      <div class="barra-h ${i.alerta ? 'alerta' : ''}">
        <div class="barra-h-nome">${esc(i.nome)}</div>
        <div class="barra-h-trilho"><div style="width:${Math.max((i.valor / maior) * 100, 1.5)}%"></div></div>
        <div class="barra-h-valor">
          <strong>${formatar(i.valor)}</strong>
          ${apoio && apoio(i) ? `<span>${apoio(i)}</span>` : ''}
        </div>
      </div>`).join('')}
  </div>`;
}

export { formatarPercentual };
