/**
 * Dados do protótipo.
 *
 * O catálogo (insumos, fichas, categorias, fornecedores e unidades) vem da
 * planilha de ficha técnica da dona, convertida por
 * `ferramentas/converter-planilha.py`. Não é exemplo: são os produtos e os
 * custos dela.
 *
 * O que continua sendo de mentira é o movimento: as vendas e os custos
 * lançados, gerados aqui para o painel ter o que mostrar enquanto não
 * existe operação de verdade.
 */
import { categorias, fornecedores, unidades, insumos, fichas } from './base.js?v=8f5a2005';

export { categorias, fornecedores, unidades, insumos, fichas };

/**
 * Embalagem e perda começam em zero de propósito: a planilha dela não
 * considera nenhum dos dois, então com zero o sistema reproduz exatamente
 * os números que ela já conhece e dá para conferir a migração linha a
 * linha. Quando ela disser quanto gasta de pote e quanto perde na
 * produção, é só preencher aqui e o custo sobe para o valor real.
 *
 * O arredondamento também nasce desligado, porque ela não arredonda o
 * preço sugerido na planilha.
 */
export const parametrosIniciais = {
  metaCmvPadrao: 0.3,
  custoEmbalagem: 0,
  perdaProducao: 0,
  arredondamento: 'nenhum', // inteiro | meio | nenhum
  toleranciaCmv: 0.02,
  // marcadores trocados na hora de abrir a conversa: {cliente} {itens} {total} {situacao}
  mensagemWhatsapp: 'Oi {cliente}, aqui é do Maluzices. Seu pedido ({itens}), no valor de {total}, está {situacao}.'
};

// As mesmas categorias que a planilha de controle oferece a ela.
export const categoriasDeCusto = [
  { id: 'ingredientes', nome: 'Ingredientes', ativa: true },
  { id: 'embalagens', nome: 'Embalagens', ativa: true },
  { id: 'aluguel', nome: 'Aluguel', ativa: true },
  { id: 'energia', nome: 'Energia', ativa: true },
  { id: 'agua', nome: 'Água', ativa: true },
  { id: 'gas', nome: 'Gás', ativa: true },
  { id: 'marketing', nome: 'Marketing', ativa: true },
  { id: 'transporte', nome: 'Transporte', ativa: true },
  { id: 'equipamentos', nome: 'Equipamentos', ativa: true },
  { id: 'outros', nome: 'Outros', ativa: true }
];

export const formasDePagamento = [
  { id: 'pix', nome: 'Pix', taxa: 0, ativa: true },
  { id: 'dinheiro', nome: 'Dinheiro', taxa: 0, ativa: true },
  { id: 'cartao-debito', nome: 'Cartão de débito', taxa: 0.019, ativa: true },
  { id: 'cartao-credito', nome: 'Cartão de crédito', taxa: 0.035, ativa: true },
  { id: 'transferencia', nome: 'Transferência', taxa: 0, ativa: true }
];

/* ------------------------------------------------------------------
   Histórico de vendas de demonstração.

   É gerado, e não digitado, por dois motivos: o arquivo não vira uma
   parede de números, e tudo que o painel mostra sai da mesma fonte.
   Faturamento do mês, dia da semana mais forte, produto mais vendido e
   margem são todos derivados daqui, então as telas não se contradizem.

   O gerador é determinístico: a mesma semente devolve sempre a mesma
   série, senão cada recarga mudaria o painel inteiro.
------------------------------------------------------------------ */
export const HOJE = '2026-10-05';

// domingo a sábado. Sábado é o dia forte, domingo o fraco.
const PESO_DO_DIA = [0.55, 0.85, 0.9, 0.95, 1.05, 1.25, 1.45];

/**
 * Participação de cada produto nas vendas. Sai dos produtos que a planilha
 * dela marca como vendidos, e não de uma lista fixa aqui, para o dia em que
 * ela precificar um produto novo ele já entrar no movimento sozinho.
 * Os pesos caem do mais vendido para o menos, só para a série ter forma.
 */
const MIX_DE_PRODUTOS = (() => {
  const vendaveis = fichas.filter((f) => f.vendavel && f.ativo !== false);
  const pesos = vendaveis.map((_, i) => 1 / (i + 1.6));
  const soma = pesos.reduce((t, p) => t + p, 0);
  return vendaveis.map((f, i) => ({ fichaId: f.id, peso: pesos[i] / soma }));
})();

/** Gerador congruente simples, só para ter ruído estável entre recargas. */
function sorteador(semente) {
  let estado = semente;
  return () => {
    estado = (estado * 1664525 + 1013904223) % 4294967296;
    return estado / 4294967296;
  };
}

const diaEmMs = 86400000;
const paraIso = (data) => data.toISOString().slice(0, 10);

/**
 * Unidades vendidas por produto, por dia. O volume cresce devagar ao
 * longo dos meses e oscila por dia da semana.
 */
export function gerarVendas(ate = HOJE, dias = 182) {
  const sortear = sorteador(20261005);
  const fim = new Date(`${ate}T12:00:00Z`);
  const linhas = [];

  for (let recuo = dias - 1; recuo >= 0; recuo -= 1) {
    const data = new Date(fim.getTime() - recuo * diaEmMs);
    const diaDaSemana = data.getUTCDay();

    // crescimento de cerca de 18% ao longo do período, com uma queda no meio
    const avanco = (dias - 1 - recuo) / (dias - 1);
    const tendencia = 1 + avanco * 0.18 - (avanco > 0.45 && avanco < 0.62 ? 0.12 : 0);
    const unidadesDoDia = Math.max(
      4,
      Math.round(22 * PESO_DO_DIA[diaDaSemana] * tendencia * (0.82 + sortear() * 0.36))
    );

    MIX_DE_PRODUTOS.forEach(({ fichaId, peso }) => {
      const quantidade = Math.round(unidadesDoDia * peso * (0.7 + sortear() * 0.6));
      if (quantidade > 0) linhas.push({ data: paraIso(data), fichaId, quantidade });
    });
  }
  return linhas;
}

export const vendas = gerarVendas();

const precoDaFicha = (id) => {
  const f = fichas.find((x) => x.id === id);
  return f ? f.precoPraticado : 0;
};

export const faturamentoDaVenda = (v) => v.quantidade * precoDaFicha(v.fichaId);

/* ------------------------------------------------------------------
   Custos de demonstração, gerados em cima das vendas para os dois
   lados fecharem: compra de ingrediente acompanha o que foi vendido,
   e o resto são as contas fixas de todo mês.
------------------------------------------------------------------ */
function gerarCustos(linhasDeVenda) {
  const sortear = sorteador(77012026);
  const porMes = {};
  linhasDeVenda.forEach((v) => {
    const mes = v.data.slice(0, 7);
    porMes[mes] = porMes[mes] || { faturamento: 0, unidades: 0, ultimaData: v.data };
    porMes[mes].faturamento += faturamentoDaVenda(v);
    porMes[mes].unidades += v.quantidade;
    porMes[mes].ultimaData = v.data;
  });

  const lista = [];
  let sequencia = 1;
  const lancar = (data, categoria, descricao, valor, pago) => {
    if (!data) return;
    lista.push({ id: `custo-${sequencia++}`, data, categoria, descricao, valor: Math.round(valor * 100) / 100, pago });
  };

  Object.keys(porMes).sort().forEach((mes) => {
    const { faturamento, unidades, ultimaData } = porMes[mes];
    const diaFinal = Number(ultimaData.slice(8, 10));
    // no mês em andamento, conta com data que ainda não chegou não existe
    const dia = (n) => (n > diaFinal ? null : `${mes}-${String(n).padStart(2, '0')}`);
    const recente = mes >= '2026-10';

    /* Ingrediente é a maior conta e vem em compras semanais. A fatia sobe
       em julho e agosto: é a alta da castanha que aparece no histórico de
       preço do insumo, e é o que derruba a margem antes do reajuste. */
    const FATIA_INGREDIENTES = { '2026-07': 0.47, '2026-08': 0.5, '2026-09': 0.43 };
    const fatiaDoMes = FATIA_INGREDIENTES[mes] || 0.4;
    const totalIngredientes = faturamento * (fatiaDoMes + sortear() * 0.03);
    [3, 10, 17, 24].forEach((d, i) => {
      if (d > diaFinal) return;
      const fatia = totalIngredientes / Math.min(4, Math.ceil(diaFinal / 7));
      lancar(dia(d), 'Ingredientes', i === 0 ? 'Feira da semana' : `Compra de ingredientes (semana ${i + 1})`,
        fatia * (0.85 + sortear() * 0.3), !recente || d < 4);
    });

    // embalagem segue o parâmetro de custo por porção, para fechar com a ficha
    lancar(dia(2), 'Embalagens', 'Potes, sacolas e etiquetas', unidades * 0.85 * (0.95 + sortear() * 0.12), !recente);
    lancar(dia(1), 'Aluguel', 'Aluguel da cozinha', 750, true);
    lancar(dia(8), 'Energia', 'Conta de luz', 390 + sortear() * 110, !recente);
    lancar(dia(10), 'Gás', 'Botijões', 330 + sortear() * 110, !recente);
    lancar(dia(15), 'Transporte', 'Entregas do mês', faturamento * 0.065 * (0.9 + sortear() * 0.2), !recente);
    lancar(dia(20), 'Marketing', 'Impulsionamento no Instagram', 230 + sortear() * 160, !recente);
  });

  return lista.sort((a, b) => (a.data < b.data ? 1 : -1));
}

export const custos = gerarCustos(vendas);

const NOME_DO_MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

/**
 * Série mensal, derivada das vendas e dos custos. O primeiro mês do
 * período fica de fora porque entra pela metade e distorceria a margem.
 */
export const faturamentoMensal = (() => {
  const meses = {};
  vendas.forEach((v) => {
    const m = v.data.slice(0, 7);
    meses[m] = meses[m] || { faturamento: 0, custo: 0 };
    meses[m].faturamento += faturamentoDaVenda(v);
  });
  custos.forEach((c) => {
    const m = c.data.slice(0, 7);
    if (meses[m]) meses[m].custo += c.valor;
  });
  return Object.keys(meses).sort().slice(1).map((m) => ({
    chave: m,
    mes: NOME_DO_MES[Number(m.slice(5, 7)) - 1],
    faturamento: Math.round(meses[m].faturamento),
    custo: Math.round(meses[m].custo)
  }));
})();

/* Aqui havia um histórico de preço da castanha, que foi removido: o
   sistema guarda só a cotação atual, informada pela usuária, então
   qualquer série de preço antigo seria inventada. Gráfico dá ar de
   medição para número que ninguém mediu. */

export function catalogoInicial() {
  return {
    categorias: categorias.map((c) => ({ ...c })),
    insumos: insumos.map((i) => ({ ...i })),
    fichas: fichas.map((f) => ({
      ...f,
      ingredientes: f.ingredientes.map((l) => ({ ...l }))
    })),
    custos: custos.map((c) => ({ ...c })),
    categoriasDeCusto: categoriasDeCusto.map((c) => ({ ...c })),
    fornecedores: fornecedores.map((f) => ({ ...f })),
    unidades: unidades.map((u) => ({ ...u })),
    formasDePagamento: formasDePagamento.map((f) => ({ ...f }))
  };
}
