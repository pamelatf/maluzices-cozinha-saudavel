/**
 * Indicadores da visão geral.
 *
 * Tudo aqui é cálculo puro sobre a base: nenhuma função toca no DOM, para
 * dar para testar sem navegador. Os números saem das vendas, dos custos
 * lançados e das fichas técnicas, que são as mesmas fontes das outras
 * telas. É isso que impede o painel de contar uma história diferente do
 * quadro de pedidos e da tela de custos.
 *
 * Ao integrar com a API: trocar `vendas` e `custos` por GET /relatorios,
 * mantendo o formato de saída de cada função.
 */
import { resumoDaFicha } from './calculo.js';

export const PERIODOS = [
  { valor: 'hoje', rotulo: 'Hoje', dias: 1 },
  { valor: '7dias', rotulo: 'Últimos 7 dias', dias: 7 },
  { valor: '30dias', rotulo: 'Últimos 30 dias', dias: 30 },
  { valor: 'mes', rotulo: 'Este mês' },
  { valor: 'mesAnterior', rotulo: 'Mês anterior' }
];

const diaEmMs = 86400000;
const paraIso = (d) => d.toISOString().slice(0, 10);
const comoData = (iso) => new Date(`${iso}T12:00:00Z`);

/**
 * Intervalo do período escolhido e o intervalo imediatamente anterior,
 * de mesmo tamanho, que é com quem a comparação é feita.
 */
export function intervaloDoPeriodo(periodo, hoje) {
  const fim = comoData(hoje);

  if (periodo === 'mes' || periodo === 'mesAnterior') {
    const base = new Date(Date.UTC(fim.getUTCFullYear(), fim.getUTCMonth() - (periodo === 'mesAnterior' ? 1 : 0), 1, 12));
    const inicio = paraIso(base);
    const ultimoDia = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0, 12));
    const termino = periodo === 'mes' ? hoje : paraIso(ultimoDia);

    const anteriorBase = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() - 1, 1, 12));
    const anteriorFim = new Date(Date.UTC(anteriorBase.getUTCFullYear(), anteriorBase.getUTCMonth() + 1, 0, 12));
    return {
      inicio,
      fim: termino,
      anterior: { inicio: paraIso(anteriorBase), fim: paraIso(anteriorFim) }
    };
  }

  const dias = (PERIODOS.find((p) => p.valor === periodo) || { dias: 30 }).dias;
  const inicio = new Date(fim.getTime() - (dias - 1) * diaEmMs);
  const anteriorFim = new Date(inicio.getTime() - diaEmMs);
  const anteriorInicio = new Date(anteriorFim.getTime() - (dias - 1) * diaEmMs);
  return {
    inicio: paraIso(inicio),
    fim: hoje,
    anterior: { inicio: paraIso(anteriorInicio), fim: paraIso(anteriorFim) }
  };
}

const dentro = (data, inicio, fim) => data >= inicio && data <= fim;

export const vendasDoIntervalo = (vendas, inicio, fim) => vendas.filter((v) => dentro(v.data, inicio, fim));
export const custosDoIntervalo = (custos, inicio, fim) => custos.filter((c) => dentro(c.data, inicio, fim));

const precoDaFicha = (catalogo, id) => {
  const f = catalogo.fichas.find((x) => x.id === id);
  return f ? f.precoPraticado : 0;
};

export const faturamentoDe = (vendas, catalogo) =>
  vendas.reduce((t, v) => t + v.quantidade * precoDaFicha(catalogo, v.fichaId), 0);

export const gastosDe = (custos) => custos.reduce((t, c) => t + c.valor, 0);

/** Variação proporcional; devolve null quando não há base de comparação. */
export function variacao(atual, anterior) {
  if (!anterior) return null;
  return (atual - anterior) / anterior;
}

/**
 * Os quatro números do topo, cada um com a variação contra o período
 * anterior de mesmo tamanho.
 */
export function indicadoresDoPeriodo({ vendas, custos, catalogo, periodo, hoje }) {
  const { inicio, fim, anterior } = intervaloDoPeriodo(periodo, hoje);

  const faturamento = faturamentoDe(vendasDoIntervalo(vendas, inicio, fim), catalogo);
  const gastos = gastosDe(custosDoIntervalo(custos, inicio, fim));
  const faturamentoAntes = faturamentoDe(vendasDoIntervalo(vendas, anterior.inicio, anterior.fim), catalogo);
  const gastosAntes = gastosDe(custosDoIntervalo(custos, anterior.inicio, anterior.fim));

  const lucro = faturamento - gastos;
  const lucroAntes = faturamentoAntes - gastosAntes;
  const margem = faturamento ? lucro / faturamento : 0;
  const margemAntes = faturamentoAntes ? lucroAntes / faturamentoAntes : 0;

  return {
    intervalo: { inicio, fim, anterior },
    faturamento: { valor: faturamento, variacao: variacao(faturamento, faturamentoAntes) },
    gastos: { valor: gastos, variacao: variacao(gastos, gastosAntes) },
    lucro: { valor: lucro, variacao: variacao(lucro, lucroAntes) },
    // margem é percentual, então a comparação é em pontos percentuais
    margem: { valor: margem, diferenca: margemAntes ? margem - margemAntes : null }
  };
}

/**
 * Série por mês. O mês corrente fica de fora por padrão: ele tem poucos
 * dias de venda e o mês inteiro de contas fixas, então apareceria como um
 * despenhadeiro no fim do gráfico e passaria a impressão errada.
 */
export function serieMensal({ vendas, custos, catalogo, hoje, meses = 6, incluirEmAndamento = false }) {
  const porMes = {};
  vendas.forEach((v) => {
    const m = v.data.slice(0, 7);
    porMes[m] = porMes[m] || { faturamento: 0, gastos: 0 };
    porMes[m].faturamento += v.quantidade * precoDaFicha(catalogo, v.fichaId);
  });
  custos.forEach((c) => {
    const m = c.data.slice(0, 7);
    if (porMes[m]) porMes[m].gastos += c.valor;
  });

  const NOMES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const mesCorrente = hoje.slice(0, 7);

  /* Fora o mês corrente, o primeiro mês da base também sai: a janela de
     dados começa no meio dele, então ele teria venda pela metade e conta
     fixa inteira, e apareceria como um tombo no começo do gráfico. */
  const todas = Object.keys(porMes).sort();
  const chaves = todas
    .slice(1)
    .filter((m) => incluirEmAndamento || m !== mesCorrente);

  return chaves.slice(-meses).map((m) => {
    const { faturamento, gastos } = porMes[m];
    const lucro = faturamento - gastos;
    return {
      chave: m,
      rotulo: NOMES[Number(m.slice(5, 7)) - 1],
      faturamento,
      gastos,
      lucro,
      margem: faturamento ? lucro / faturamento : 0,
      emAndamento: m === mesCorrente
    };
  });
}

export function gastosPorCategoria(custos) {
  const total = gastosDe(custos);
  const porCategoria = {};
  custos.forEach((c) => { porCategoria[c.categoria] = (porCategoria[c.categoria] || 0) + c.valor; });
  return Object.entries(porCategoria)
    .map(([nome, valor]) => ({ nome, valor, fatia: total ? valor / total : 0 }))
    .sort((a, b) => b.valor - a.valor);
}

const NOME_DO_DIA = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

/** Faturamento médio por dia da semana, para não premiar o dia que teve mais ocorrências. */
export function faturamentoPorDiaDaSemana(vendas, catalogo) {
  const soma = Array(7).fill(0);
  const diasContados = [new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set()];

  vendas.forEach((v) => {
    const dia = comoData(v.data).getUTCDay();
    soma[dia] += v.quantidade * precoDaFicha(catalogo, v.fichaId);
    diasContados[dia].add(v.data);
  });

  const ordem = [1, 2, 3, 4, 5, 6, 0]; // começa na segunda
  return ordem.map((dia) => ({
    dia: NOME_DO_DIA[dia],
    total: soma[dia],
    media: diasContados[dia].size ? soma[dia] / diasContados[dia].size : 0
  }));
}

/**
 * Produtos vendidos no período, com quantidade e também o lucro que cada
 * um gerou. O mais vendido nem sempre é o que mais paga as contas, e é
 * justamente essa diferença que o painel precisa mostrar.
 */
export function produtosVendidos({ vendas, catalogo, parametros, limite = 5 }) {
  const porFicha = {};
  vendas.forEach((v) => { porFicha[v.fichaId] = (porFicha[v.fichaId] || 0) + v.quantidade; });

  const lista = Object.entries(porFicha).map(([fichaId, unidades]) => {
    const ficha = catalogo.fichas.find((f) => f.id === fichaId);
    if (!ficha) return null;
    const r = resumoDaFicha(ficha, catalogo, parametros);
    const margemUnitaria = ficha.precoPraticado ? (ficha.precoPraticado - r.custoPorcao) / ficha.precoPraticado : 0;
    return {
      fichaId,
      nome: ficha.nome,
      unidades,
      faturamento: unidades * ficha.precoPraticado,
      lucro: unidades * (ficha.precoPraticado - r.custoPorcao),
      margem: margemUnitaria,
      acimaDaMeta: r.acimaDaMeta
    };
  }).filter(Boolean);

  return {
    porQuantidade: [...lista].sort((a, b) => b.unidades - a.unidades).slice(0, limite),
    porLucro: [...lista].sort((a, b) => b.lucro - a.lucro).slice(0, limite)
  };
}

/**
 * Uma frase sobre o período, escolhida pelo achado mais forte.
 * A ordem das regras é a ordem de importância: problema antes de elogio.
 */
export function destaqueDoPeriodo({ indicadores, serie, categorias, produtos, dias }) {
  const margem = indicadores.margem.valor;
  const topQuantidade = produtos.porQuantidade[0];
  const topLucro = produtos.porLucro[0];

  if (topQuantidade && topLucro && topQuantidade.fichaId !== topLucro.fichaId) {
    return {
      tom: 'atencao',
      titulo: 'O mais vendido não é o que mais dá lucro',
      texto: `${topQuantidade.nome} lidera em quantidade, mas quem mais gerou lucro no período foi ${topLucro.nome}. Vale olhar o preço e o custo do primeiro na ficha técnica.`
    };
  }

  if (indicadores.gastos.variacao !== null && indicadores.faturamento.variacao !== null
      && indicadores.gastos.variacao > indicadores.faturamento.variacao + 0.02) {
    return {
      tom: 'atencao',
      titulo: 'Os gastos subiram mais que o faturamento',
      texto: `No período, o faturamento variou ${(indicadores.faturamento.variacao * 100).toFixed(1).replace('.', ',')}% e os gastos ${(indicadores.gastos.variacao * 100).toFixed(1).replace('.', ',')}%. A margem fechou em ${(margem * 100).toFixed(1).replace('.', ',')}%.`
    };
  }

  const melhorDia = dias && dias.length ? [...dias].sort((a, b) => b.media - a.media)[0] : null;
  const totalDias = dias ? dias.reduce((t, d) => t + d.total, 0) : 0;
  if (melhorDia && totalDias) {
    return {
      tom: 'bom',
      titulo: `${melhorDia.dia} é o melhor dia de faturamento`,
      texto: `Ele responde por ${((melhorDia.total / totalDias) * 100).toFixed(1).replace('.', ',')}% do faturamento do período, o maior entre todos os dias da semana.`
    };
  }

  const maiorCategoria = categorias && categorias[0];
  if (maiorCategoria) {
    return {
      tom: 'neutro',
      titulo: `${maiorCategoria.nome} é a maior parte dos gastos`,
      texto: `Representa ${(maiorCategoria.fatia * 100).toFixed(1).replace('.', ',')}% do que saiu no período.`
    };
  }

  return { tom: 'neutro', titulo: 'Sem dados suficientes no período', texto: 'Escolha um período maior para ver o resumo.' };
}
