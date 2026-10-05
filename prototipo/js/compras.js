/**
 * Compra de insumo: como um gasto lançado vira preço de ficha técnica.
 *
 * Há dois jeitos de lançar um custo. O simples é só o gasto: data,
 * categoria, valor. Serve para luz, aluguel, gás, e não mexe em preço
 * nenhum. O detalhado é a compra de ingrediente, item a item, e é dele que
 * sai o preço dos insumos.
 *
 * A conta é direta: o que ela pagou dividido pelo que levou. Comprou 2 kg
 * de castanha por R$ 144, o quilo está R$ 72.
 *
 * O preço novo substitui o antigo, mas não calado. Quando a variação passa
 * do limite, o sistema pergunta antes de aplicar. Compra de emergência, erro
 * de digitação e promoção de uma vez só mexeriam na margem de todos os
 * produtos que usam aquele insumo, e ela descobriria depois, pelo relatório,
 * sem saber de onde veio. Perguntar custa um clique e ela continua dona da
 * decisão.
 *
 * Abaixo do limite nada é perguntado, senão toda feira viraria uma fila de
 * confirmações.
 */

/** Acima disso, a mudança de preço precisa do aval dela. */
export const VARIACAO_LIMITE = 0.15;

export function precoUnitario(item) {
  const quantidade = Number(item.quantidade) || 0;
  const valor = Number(item.valor) || 0;
  if (quantidade <= 0) return 0;
  return valor / quantidade;
}

export function totalDaCompra(itens) {
  return (itens || []).reduce((total, item) => total + (Number(item.valor) || 0), 0);
}

/**
 * O que acontece com o preço de um insumo se esta linha for aplicada.
 * Devolve sempre o mesmo formato, mesmo quando não há nada a fazer, para a
 * tela não ter que adivinhar.
 */
export function avaliarItem(item, catalogo, limite = VARIACAO_LIMITE) {
  const insumo = catalogo.insumos.find((i) => i.id === item.insumoId);
  const precoNovo = precoUnitario(item);
  const base = {
    insumoId: item.insumoId,
    nome: insumo ? insumo.nome : '',
    precoAntigo: insumo ? insumo.preco || 0 : 0,
    precoNovo,
    variacao: 0,
    confirmar: false,
    motivo: ''
  };

  if (!insumo) return { ...base, motivo: 'insumo-inexistente' };

  // Sub-receita tem preço calculado pela própria ficha. Comprar pronta de
  // fora não deveria acontecer, e se acontecer o preço da ficha é que vale.
  if (insumo.fichaId) return { ...base, motivo: 'preco-vem-da-ficha' };

  if (precoNovo <= 0) return { ...base, motivo: 'sem-preco' };
  if (!base.precoAntigo) return { ...base, motivo: 'primeiro-preco' };

  const variacao = (precoNovo - base.precoAntigo) / base.precoAntigo;
  return {
    ...base,
    variacao,
    confirmar: Math.abs(variacao) > limite,
    motivo: Math.abs(variacao) > limite ? 'variacao-alta' : 'variacao-normal'
  };
}

export function avaliarCompra(itens, catalogo, limite = VARIACAO_LIMITE) {
  return (itens || []).map((item) => avaliarItem(item, catalogo, limite));
}

/**
 * Grava a compra: atualiza o preço e a data de cotação dos insumos.
 *
 * `recusados` traz os insumos cuja mudança ela decidiu não aplicar. O gasto
 * entra de qualquer jeito, porque ela gastou o dinheiro; só o preço de
 * referência é que fica como estava.
 */
export function aplicarCompra(itens, catalogo, data, recusados = []) {
  const fora = new Set(recusados);
  const aplicados = [];

  avaliarCompra(itens, catalogo).forEach((aval) => {
    const podeAplicar = aval.motivo === 'primeiro-preco'
      || aval.motivo === 'variacao-normal'
      || aval.motivo === 'variacao-alta';
    if (!podeAplicar || fora.has(aval.insumoId)) return;

    const insumo = catalogo.insumos.find((i) => i.id === aval.insumoId);
    insumo.preco = Math.round(aval.precoNovo * 10000) / 10000;
    insumo.cotacao = data;
    aplicados.push(aval);
  });

  return aplicados;
}

export function descricaoDaCompra(itens, catalogo, fornecedor) {
  const quantos = (itens || []).length;
  if (!quantos) return 'Compra';
  if (quantos === 1) {
    const insumo = catalogo.insumos.find((i) => i.id === itens[0].insumoId);
    const nome = insumo ? insumo.nome : 'insumo';
    return fornecedor ? `${nome} (${fornecedor})` : nome;
  }
  const corpo = `Compra de ${quantos} itens`;
  return fornecedor ? `${corpo} (${fornecedor})` : corpo;
}
