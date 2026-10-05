/**
 * Dados de demonstração do protótipo.
 *
 * Os valores vieram da planilha de ficha técnica do Maluzices e são
 * fictícios, usados apenas para o protótipo funcionar sem back-end.
 * Tudo fica em memória: recarregar a página volta ao estado inicial.
 */

export const parametrosIniciais = {
  metaCmvPadrao: 0.3,
  custoEmbalagem: 0.85,
  perdaProducao: 0.03,
  arredondamento: 'inteiro', // inteiro | meio | nenhum
  toleranciaCmv: 0.02,
  // marcadores trocados na hora de abrir a conversa: {cliente} {itens} {total} {situacao}
  mensagemWhatsapp: 'Oi {cliente}, aqui é do Maluzices. Seu pedido ({itens}), no valor de {total}, está {situacao}.'
};

export const categorias = [
  { id: 'caldos', nome: 'Caldos', metaCmv: 0.3, ativa: true },
  { id: 'assados', nome: 'Salgados assados', metaCmv: 0.24, ativa: true },
  { id: 'fritos', nome: 'Salgados fritos', metaCmv: 0.17, ativa: true },
  { id: 'paes', nome: 'Pães', metaCmv: 0.17, ativa: true },
  { id: 'sanduiches', nome: 'Sanduíches', metaCmv: 0.2, ativa: true },
  { id: 'base', nome: 'Sub-receitas', metaCmv: 0.3, ativa: true }
];

export const categoriasDeCusto = [
  { id: 'ingredientes', nome: 'Ingredientes', ativa: true },
  { id: 'embalagens', nome: 'Embalagens', ativa: true },
  { id: 'aluguel', nome: 'Aluguel', ativa: true },
  { id: 'energia', nome: 'Energia', ativa: true },
  { id: 'gas', nome: 'Gás', ativa: true },
  { id: 'marketing', nome: 'Marketing', ativa: true },
  { id: 'transporte', nome: 'Transporte', ativa: true }
];

// nome é a chave usada pelos insumos para referenciar o fornecedor.
export const fornecedores = [
  { id: 'ares', nome: 'Ares', telefone: '', email: '', ativa: true },
  { id: 'equilibrium', nome: 'Equilibrium', telefone: '', email: '', ativa: true },
  { id: 'feirinha', nome: 'Feirinha', telefone: '', email: '', ativa: true },
  { id: 'mercado', nome: 'Mercado', telefone: '', email: '', ativa: true },
  { id: 'cantina-da-fruta', nome: 'Cantina da Fruta', telefone: '', email: '', ativa: true },
  { id: 'producao-propria', nome: 'Produção própria', telefone: '', email: '', ativa: true }
];

// sigla é a chave usada pelos insumos no campo unidade.
export const unidades = [
  { id: 'quilo', nome: 'Quilo', sigla: 'kg', conversao: 'base do cálculo', ativa: true },
  { id: 'grama', nome: 'Grama', sigla: 'g', conversao: '1 kg = 1.000 g', ativa: true },
  { id: 'litro', nome: 'Litro', sigla: 'L', conversao: '1 L = 1 kg', ativa: true },
  { id: 'mililitro', nome: 'Mililitro', sigla: 'ml', conversao: '1 kg = 1.000 ml', ativa: true },
  { id: 'unidade', nome: 'Unidade', sigla: 'un', conversao: 'peso informado por insumo', ativa: true }
];

export const formasDePagamento = [
  { id: 'pix', nome: 'Pix', taxa: 0, ativa: true },
  { id: 'dinheiro', nome: 'Dinheiro', taxa: 0, ativa: true },
  { id: 'cartao-debito', nome: 'Cartão de débito', taxa: 0.019, ativa: true },
  { id: 'cartao-credito', nome: 'Cartão de crédito', taxa: 0.035, ativa: true },
  { id: 'transferencia', nome: 'Transferência', taxa: 0, ativa: true }
];

// pesoBruto e pesoLiquido dão o fator de correção; preco é por quilo.
// fichaId presente significa sub-receita: o preço vem do custo da ficha.
export const insumos = [
  { id: 'abobora', nome: 'Abóbora cabotiá', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.97, preco: 6.0, fornecedor: 'Feirinha', cotacao: '2026-09-28' },
  { id: 'alho-poro', nome: 'Alho-poró', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.9, preco: 50.0, fornecedor: 'Feirinha', cotacao: '2026-09-12' },
  { id: 'batata-doce', nome: 'Batata doce', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.85, preco: 7.5, fornecedor: 'Feirinha', cotacao: '2026-09-28' },
  { id: 'brocolis', nome: 'Brócolis', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.95, preco: 30.0, fornecedor: 'Feirinha', cotacao: '2026-09-20' },
  { id: 'carne-moida', nome: 'Carne moída', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.95, preco: 60.0, fornecedor: 'Mercado', cotacao: '2026-04-20' },
  { id: 'castanha-caju', nome: 'Castanha de caju inteira', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.95, preco: 94.9, fornecedor: 'Equilibrium', cotacao: '2026-10-02' },
  { id: 'cebola', nome: 'Cebola sem casca', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.84, preco: 6.0, fornecedor: 'Feirinha', cotacao: '2026-09-28' },
  { id: 'curry', nome: 'Curry', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.98, preco: 9.54, fornecedor: 'Ares', cotacao: '2026-08-14' },
  { id: 'frango-cru', nome: 'Peito de frango', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.9, preco: 19.9, fornecedor: 'Mercado', cotacao: '2026-09-30' },
  { id: 'mandioquinha', nome: 'Mandioquinha', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.8, preco: 9.0, fornecedor: 'Feirinha', cotacao: '2026-09-28' },
  { id: 'mix-sem-gluten', nome: 'Mix sem glúten', unidade: 'kg', pesoBruto: 1, pesoLiquido: 1, preco: 16.07, fornecedor: 'Ares', cotacao: '2026-09-10' },
  { id: 'noz-moscada', nome: 'Noz-moscada', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.98, preco: 105.0, fornecedor: 'Ares', cotacao: '2026-03-14' },
  { id: 'ovo', nome: 'Ovo', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.88, preco: 18.0, fornecedor: 'Mercado', cotacao: '2026-09-28' },
  { id: 'pimenta', nome: 'Pimenta-do-reino', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.95, preco: 25.16, fornecedor: 'Ares', cotacao: '2026-08-14' },
  { id: 'sal', nome: 'Sal integral', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.98, preco: 5.0, fornecedor: 'Mercado', cotacao: '2026-09-28' },
  { id: 'azeite', nome: 'Azeite de oliva', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.95, preco: 20.0, fornecedor: 'Mercado', cotacao: '2026-09-05' },
  { id: 'leite-arroz', nome: 'Leite de arroz', unidade: 'kg', pesoBruto: 1, pesoLiquido: 1, preco: 1.53, fornecedor: 'Produção própria', cotacao: '2026-09-30' },
  { id: 'agua', nome: 'Água filtrada', unidade: 'kg', pesoBruto: 1, pesoLiquido: 1, preco: 0.02, fornecedor: 'Mercado', cotacao: '2026-09-01' },
  // sub-receitas: preço calculado a partir da própria ficha
  { id: 'frango-desfiado', nome: 'Frango desfiado', unidade: 'kg', pesoBruto: 1, pesoLiquido: 0.5, fornecedor: 'Produção própria', cotacao: '2026-10-05', fichaId: 'frango-desfiado' },
  { id: 'massa-quiche', nome: 'Massa para quiche', unidade: 'kg', pesoBruto: 1, pesoLiquido: 1, fornecedor: 'Produção própria', cotacao: '2026-10-05', fichaId: 'massa-quiche' }
];

export const fichas = [
  {
    id: 'frango-desfiado',
    nome: 'Frango desfiado',
    categoriaId: 'base',
    rendimento: 1,
    tamanhoPorcao: '1 kg',
    subReceita: true,
    precoPraticado: 0,
    ingredientes: [
      { insumoId: 'frango-cru', quantidade: 1.0 },
      { insumoId: 'sal', quantidade: 0.015 },
      { insumoId: 'pimenta', quantidade: 0.004 }
    ]
  },
  {
    id: 'massa-quiche',
    nome: 'Massa para quiche',
    categoriaId: 'base',
    rendimento: 1,
    tamanhoPorcao: '1 kg',
    subReceita: true,
    precoPraticado: 0,
    ingredientes: [
      { insumoId: 'mix-sem-gluten', quantidade: 0.6 },
      { insumoId: 'ovo', quantidade: 0.2 },
      { insumoId: 'azeite', quantidade: 0.15 },
      { insumoId: 'sal', quantidade: 0.01 }
    ]
  },
  {
    id: 'caldo-cabotia',
    nome: 'Caldo de cabotiá e frango',
    categoriaId: 'caldos',
    rendimento: 9,
    tamanhoPorcao: '400 g',
    precoPraticado: 18.0,
    ingredientes: [
      { insumoId: 'abobora', quantidade: 1.2 },
      { insumoId: 'agua', quantidade: 1.6 },
      { insumoId: 'frango-desfiado', quantidade: 0.45 },
      { insumoId: 'cebola', quantidade: 0.2 },
      { insumoId: 'sal', quantidade: 0.02 },
      { insumoId: 'curry', quantidade: 0.01 },
      { insumoId: 'noz-moscada', quantidade: 0.005 }
    ]
  },
  {
    id: 'quiche-frango',
    nome: 'Quiche de frango',
    categoriaId: 'assados',
    rendimento: 8,
    tamanhoPorcao: '160 g',
    precoPraticado: 23.0,
    ingredientes: [
      { insumoId: 'massa-quiche', quantidade: 0.7 },
      { insumoId: 'frango-desfiado', quantidade: 0.4 },
      { insumoId: 'ovo', quantidade: 0.2 },
      { insumoId: 'cebola', quantidade: 0.1 },
      { insumoId: 'sal', quantidade: 0.01 }
    ]
  },
  {
    id: 'quiche-brocolis',
    nome: 'Quiche de brócolis e alho-poró',
    categoriaId: 'assados',
    rendimento: 8,
    tamanhoPorcao: '160 g',
    precoPraticado: 22.0,
    ingredientes: [
      { insumoId: 'massa-quiche', quantidade: 0.7 },
      { insumoId: 'brocolis', quantidade: 0.35 },
      { insumoId: 'alho-poro', quantidade: 0.12 },
      { insumoId: 'ovo', quantidade: 0.2 },
      { insumoId: 'sal', quantidade: 0.01 }
    ]
  },
  {
    id: 'coxinha-batata-doce',
    nome: 'Coxinha de batata doce',
    categoriaId: 'fritos',
    rendimento: 10,
    tamanhoPorcao: '180 g',
    precoPraticado: 20.0,
    ingredientes: [
      { insumoId: 'batata-doce', quantidade: 1.2 },
      { insumoId: 'frango-desfiado', quantidade: 0.5 },
      { insumoId: 'cebola', quantidade: 0.15 },
      { insumoId: 'sal', quantidade: 0.02 }
    ]
  },
  {
    id: 'pao-mandioquinha',
    nome: 'Pão de mandioquinha',
    categoriaId: 'paes',
    rendimento: 12,
    tamanhoPorcao: '150 g',
    precoPraticado: 16.0,
    ingredientes: [
      { insumoId: 'mandioquinha', quantidade: 0.8 },
      { insumoId: 'mix-sem-gluten', quantidade: 0.5 },
      { insumoId: 'ovo', quantidade: 0.15 },
      { insumoId: 'azeite', quantidade: 0.08 },
      { insumoId: 'sal', quantidade: 0.012 }
    ]
  },
  {
    id: 'creme-castanha',
    nome: 'Creme de castanha',
    categoriaId: 'caldos',
    rendimento: 10,
    tamanhoPorcao: '400 g',
    precoPraticado: 16.0,
    ingredientes: [
      { insumoId: 'castanha-caju', quantidade: 0.4 },
      { insumoId: 'leite-arroz', quantidade: 3.4 },
      { insumoId: 'cebola', quantidade: 0.15 },
      { insumoId: 'sal', quantidade: 0.02 },
      { insumoId: 'noz-moscada', quantidade: 0.004 }
    ]
  }
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

// participação de cada produto no total de unidades vendidas
const MIX_DE_PRODUTOS = [
  { fichaId: 'caldo-cabotia', peso: 0.22 },
  { fichaId: 'quiche-frango', peso: 0.2 },
  { fichaId: 'coxinha-batata-doce', peso: 0.18 },
  { fichaId: 'pao-mandioquinha', peso: 0.15 },
  { fichaId: 'creme-castanha', peso: 0.13 },
  { fichaId: 'quiche-brocolis', peso: 0.12 }
];

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

export const historicoCastanha = [
  { mes: 'mai', preco: 80.2 },
  { mes: 'jun', preco: 81.5 },
  { mes: 'jul', preco: 84.0 },
  { mes: 'ago', preco: 87.3 },
  { mes: 'set', preco: 90.1 },
  { mes: 'out', preco: 94.9 }
];

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
