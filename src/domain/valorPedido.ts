import { ItemPedidoEntrada } from './tipos';

function reaisParaCentavos(valor: number): number {
  return Math.round(valor * 100);
}

export function centavosParaReais(centavos: number): number {
  return centavos / 100;
}

export function calcularValorTotalEmCentavos(itens: ItemPedidoEntrada[]): number {
  return itens.reduce(
    (total, item) => total + item.quantidade * reaisParaCentavos(item.precoUnitario),
    0,
  );
}
