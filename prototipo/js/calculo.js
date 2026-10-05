/**
 * Motor de cálculo de custo e preço do Maluzices.
 *
 * A lógica reproduz a ficha técnica usada hoje na planilha:
 *   fator de correção = peso líquido / peso bruto do insumo
 *   peso bruto necessário = quantidade da receita / fator de correção
 *   custo do ingrediente = peso bruto necessário * preço por quilo
 *   custo da receita = soma dos ingredientes
 *   custo por porção = custo da receita / rendimento + embalagem
 *   preço sugerido = custo por porção / meta de CMV
 *   CMV real = custo por porção / preço praticado
 *
 * Um insumo pode ser uma sub-receita, e nesse caso o preço por quilo dele
 * vem do custo da própria ficha, calculado recursivamente.
 */

const LIMITE_RECURSAO = 10;

export function fatorDeCorrecao(insumo) {
  if (!insumo || !insumo.pesoBruto) return 1;
  const fator = insumo.pesoLiquido / insumo.pesoBruto;
  return fator > 0 ? fator : 1;
}

/**
 * Quanto sai da receita, em quilos.
 *
 * Não é a soma dos ingredientes. O frango desfiado leva 2 kg de frango e
 * 2,5 kg de água, mas a água do cozimento é descartada e o que sobra são
 * 2 kg. Dividir o custo pela soma do que entrou faria o quilo do frango
 * sair pela metade do preço, e todo produto que o usa ficaria barato
 * demais.
 *
 * Quando a ficha informa `rendimentoKg`, é ele que vale. Sem ele, assume-se
 * que nada se perde e a soma dos ingredientes é o que sai, que é o caso de
 * mistura seca, por exemplo.
 */
export function rendimentoEmQuilos(ficha) {
  if (ficha.rendimentoKg && ficha.rendimentoKg > 0) return ficha.rendimentoKg;
  return pesoTotalDaReceita(ficha);
}

/**
 * Preço por quilo de um insumo. Sub-receita tem o preço calculado a partir
 * da ficha de origem; insumo comprado usa o preço informado pela usuária.
 */
export function precoPorQuilo(insumo, catalogo, profundidade = 0) {
  if (!insumo) return 0;
  if (!insumo.fichaId) return insumo.preco || 0;

  if (profundidade >= LIMITE_RECURSAO) {
    throw new Error(
      `Ciclo de sub-receitas detectado a partir de "${insumo.nome}"`
    );
  }

  const ficha = catalogo.fichas.find((f) => f.id === insumo.fichaId);
  if (!ficha) return insumo.preco || 0;

  const custo = custoDaReceita(ficha, catalogo, profundidade + 1);
  const saida = rendimentoEmQuilos(ficha);
  return saida > 0 ? custo / saida : 0;
}

export function custoDoIngrediente(linha, catalogo, profundidade = 0) {
  const insumo = catalogo.insumos.find((i) => i.id === linha.insumoId);
  if (!insumo) return 0;
  const fator = fatorDeCorrecao(insumo);
  const pesoBrutoNecessario = linha.quantidade / fator;
  return pesoBrutoNecessario * precoPorQuilo(insumo, catalogo, profundidade);
}

export function custoDaReceita(ficha, catalogo, profundidade = 0) {
  return ficha.ingredientes.reduce(
    (total, linha) => total + custoDoIngrediente(linha, catalogo, profundidade),
    0
  );
}

export function pesoTotalDaReceita(ficha) {
  return ficha.ingredientes.reduce((total, linha) => total + linha.quantidade, 0);
}

export function custoPorPorcao(ficha, catalogo, parametros) {
  if (!ficha.rendimento) return 0;
  const perda = parametros && parametros.perdaProducao ? parametros.perdaProducao : 0;
  const embalagem = parametros && parametros.custoEmbalagem ? parametros.custoEmbalagem : 0;
  const custoIngredientes = (custoDaReceita(ficha, catalogo) / ficha.rendimento) * (1 + perda);
  return custoIngredientes + embalagem;
}

export function metaDeCmv(ficha, catalogo, parametros) {
  if (ficha.metaCmv) return ficha.metaCmv;
  const categoria = catalogo.categorias.find((c) => c.id === ficha.categoriaId);
  if (categoria && categoria.metaCmv) return categoria.metaCmv;
  return parametros.metaCmvPadrao;
}

export function arredondarPreco(valor, regra) {
  if (regra === 'nenhum') return valor;
  const passo = regra === 'meio' ? 0.5 : 1;
  return Math.ceil(valor / passo) * passo;
}

export function precoSugerido(ficha, catalogo, parametros) {
  const meta = metaDeCmv(ficha, catalogo, parametros);
  if (!meta) return 0;
  const bruto = custoPorPorcao(ficha, catalogo, parametros) / meta;
  return arredondarPreco(bruto, parametros.arredondamento);
}

export function cmvReal(ficha, catalogo, parametros, preco) {
  const praticado = preco !== undefined ? preco : ficha.precoPraticado;
  if (!praticado) return 0;
  return custoPorPorcao(ficha, catalogo, parametros) / praticado;
}

/**
 * Resumo de uma ficha, com tudo que as telas precisam mostrar.
 */
export function resumoDaFicha(ficha, catalogo, parametros) {
  const custoPorcao = custoPorPorcao(ficha, catalogo, parametros);
  const sugerido = precoSugerido(ficha, catalogo, parametros);
  const meta = metaDeCmv(ficha, catalogo, parametros);
  const real = cmvReal(ficha, catalogo, parametros);
  return {
    custoReceita: custoDaReceita(ficha, catalogo),
    pesoTotal: pesoTotalDaReceita(ficha),
    custoPorcao,
    metaCmv: meta,
    precoSugerido: sugerido,
    precoPraticado: ficha.precoPraticado,
    cmvReal: real,
    acimaDaMeta: real > meta + (parametros.toleranciaCmv || 0),
    diferenca: sugerido - ficha.precoPraticado
  };
}

export function formatarMoeda(valor) {
  return (valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export function formatarPercentual(valor, casas = 1) {
  return `${((valor || 0) * 100).toFixed(casas).replace('.', ',')}%`;
}

export function formatarPeso(valor) {
  return `${(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  })} kg`;
}

export function lerMoeda(texto) {
  if (typeof texto === 'number') return texto;
  const limpo = String(texto)
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const numero = Number.parseFloat(limpo);
  return Number.isNaN(numero) ? 0 : numero;
}
