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

export const custos = [
  { id: 'custo-1', data: '2026-10-03', categoria: 'Ingredientes', descricao: 'Feira da semana', valor: 280, pago: true },
  { id: 'custo-2', data: '2026-10-02', categoria: 'Embalagens', descricao: 'Potes de 400 ml', valor: 120, pago: true },
  { id: 'custo-3', data: '2026-10-01', categoria: 'Aluguel', descricao: 'Aluguel do espaço', valor: 300, pago: true },
  { id: 'custo-4', data: '2026-10-01', categoria: 'Energia', descricao: 'Conta de luz', valor: 50, pago: false },
  { id: 'custo-5', data: '2026-09-28', categoria: 'Ingredientes', descricao: 'Castanhas e sementes', valor: 150, pago: false },
  { id: 'custo-6', data: '2026-09-26', categoria: 'Marketing', descricao: 'Impulsionamento no Instagram', valor: 50, pago: true },
  { id: 'custo-7', data: '2026-09-20', categoria: 'Transporte', descricao: 'Entregas da semana', valor: 90, pago: false }
];

export const faturamentoMensal = [
  { mes: 'mai', faturamento: 3450, custo: 1650 },
  { mes: 'jun', faturamento: 3450, custo: 1600 },
  { mes: 'jul', faturamento: 3450, custo: 930 },
  { mes: 'ago', faturamento: 5200, custo: 950 },
  { mes: 'set', faturamento: 2600, custo: 400 },
  { mes: 'out', faturamento: 3200, custo: 900 }
];

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
