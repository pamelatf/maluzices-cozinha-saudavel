export type StatusPedido = 'RECEBIDO' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';

export interface ItemPedido {
  id: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export interface Pedido {
  id: number;
  cliente: string;
  observacao: string | null;
  status: StatusPedido;
  valorTotal: number;
  criadoEm: string;
  atualizadoEm: string;
  itens: ItemPedido[];
}

export interface ErroDetalhe {
  campo: string;
  problema: string;
}

export interface CorpoErroApi {
  erro: {
    codigo: string;
    mensagem: string;
    detalhes: ErroDetalhe[];
  };
}

export interface ItemNovoPedido {
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export interface NovoPedidoInput {
  cliente: string;
  observacao?: string;
  itens: ItemNovoPedido[];
}
