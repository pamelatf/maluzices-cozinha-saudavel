export const STATUS_PEDIDO = [
  'RECEBIDO',
  'EM_PREPARO',
  'PRONTO',
  'ENTREGUE',
  'CANCELADO',
] as const;

export type StatusPedido = (typeof STATUS_PEDIDO)[number];

export const ACAO_STATUS = ['AVANCAR', 'RETROCEDER'] as const;

export type AcaoStatus = (typeof ACAO_STATUS)[number];

export interface ItemPedidoEntrada {
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export interface ItemPedido extends ItemPedidoEntrada {
  id: number;
}

export interface Pedido {
  id: number;
  cliente: string;
  observacao: string | null;
  status: StatusPedido;
  valorTotal: number;
  criadoEm: Date;
  atualizadoEm: Date;
  itens: ItemPedido[];
}
