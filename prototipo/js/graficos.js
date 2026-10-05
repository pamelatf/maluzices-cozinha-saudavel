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
import { formatarMoeda, formatarPercentual } from './calculo.js';

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

/**
 * Faturamento e lucro ao longo dos meses.
 *
 * As duas séries pedidas são as duas linhas, e o espaço entre elas é o
 * gasto. Preenchendo esse espaço, a mesma figura mostra as três coisas:
 * faixa de baixo é gasto, faixa de cima é lucro, e o topo é o faturamento.
 */
export function graficoFaturamentoLucro(serie) {
  if (!serie.length) return '<p class="cartao-nota">Sem dados no período.</p>';

  const L = 58, R = 92, T = 22, B = 30, W = 820, H = 250;
  const n = serie.length;
  const max = tetoDaEscala(Math.max(...serie.map((m) => m.faturamento)));
  const x = (i) => (n === 1 ? (W - L - R) / 2 + L : L + (i * (W - L - R)) / (n - 1));
  const y = (v) => T + (1 - v / max) * (H - T - B);

  const grade = [0, max / 2, max].map((v) => `
    <line class="g-grade" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/>
    <text class="g-eixo" x="${L - 10}" y="${y(v) + 4}" text-anchor="end">${moedaCurta(v)}</text>`).join('');

  const areaGastos = `M${x(0)},${y(0)}` + serie.map((m, i) => `L${x(i)},${y(m.gastos)}`).join('') + `L${x(n - 1)},${y(0)}Z`;
  const areaLucro = serie.map((m, i) => `${i ? 'L' : 'M'}${x(i)},${y(m.faturamento)}`).join('')
    + serie.slice().reverse().map((m, i) => `L${x(n - 1 - i)},${y(m.gastos)}`).join('') + 'Z';

  const linha = (campo, classe) => `<path class="${classe}" d="${serie.map((m, i) => `${i ? 'L' : 'M'}${x(i)},${y(m[campo])}`).join('')}"/>`;
  const pontos = (campo, classe) => serie.map((m, i) => `<circle class="${classe}" cx="${x(i)}" cy="${y(m[campo])}" r="2.8"/>`).join('');

  const fim = n - 1;
  const emAndamento = serie[fim].emAndamento
    ? `<line class="g-tracejado" x1="${x(fim)}" x2="${x(fim)}" y1="${T}" y2="${H - B}"/>
       <text class="g-nota" x="${x(fim) - 7}" y="${T + 2}" text-anchor="end">mês em andamento</text>`
    : '';

  const rotulos = serie.map((m, i) => `<text class="g-eixo" x="${x(i)}" y="${H - 9}" text-anchor="middle">${esc(m.rotulo)}</text>`).join('');

  const alvos = serie.map((m, i) => `<rect class="g-alvo" x="${x(i) - (W - L - R) / (2 * Math.max(n - 1, 1))}" y="${T}"
      width="${(W - L - R) / Math.max(n - 1, 1)}" height="${H - T - B}"
      data-grafico="mes" data-indice="${i}"></rect>`).join('');

  return `
    <svg class="grafico" viewBox="0 0 ${W} ${H}" role="img"
         aria-label="Faturamento e lucro por mês. A faixa de baixo é o gasto e a de cima é o lucro.">
      ${grade}
      <path class="g-area-gastos" d="${areaGastos}"/>
      <path class="g-area-lucro" d="${areaLucro}"/>
      ${linha('gastos', 'g-linha-gastos')}
      ${linha('faturamento', 'g-linha-faturamento')}
      ${pontos('gastos', 'g-ponto-gastos')}
      ${pontos('faturamento', 'g-ponto-faturamento')}
      ${emAndamento}
      <text class="g-serie" x="${x(fim) + 11}" y="${y(serie[fim].faturamento) + 4}" fill="var(--oliva)">Faturamento</text>
      <text class="g-serie" x="${x(fim) + 11}" y="${(y(serie[fim].faturamento) + y(serie[fim].gastos)) / 2 + 4}" fill="#4F5A2F">Lucro</text>
      <text class="g-serie" x="${x(fim) + 11}" y="${(y(serie[fim].gastos) + y(0)) / 2 + 4}" fill="var(--terracota)">Gastos</text>
      ${rotulos}
      <line class="g-guia" id="guiaMes" x1="0" x2="0" y1="${T}" y2="${H - B}"/>
      ${alvos}
    </svg>`;
}

/** Barras verticais do faturamento médio por dia da semana. */
export function graficoDiaDaSemana(dias) {
  const L = 58, R = 16, T = 26, B = 30, W = 820, H = 220;
  const max = tetoDaEscala(Math.max(...dias.map((d) => d.media), 1));
  const y = (v) => T + (1 - v / max) * (H - T - B);
  const faixa = (W - L - R) / dias.length;
  const largura = Math.min(58, faixa * 0.55);
  const melhor = dias.reduce((p, d, i) => (d.media > dias[p].media ? i : p), 0);

  const grade = [0, max / 2, max].map((v) => `
    <line class="g-grade" x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}"/>
    <text class="g-eixo" x="${L - 10}" y="${y(v) + 4}" text-anchor="end">${moedaCurta(v)}</text>`).join('');

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
