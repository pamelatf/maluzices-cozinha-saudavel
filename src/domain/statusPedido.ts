import { TransicaoInvalidaError } from '../errors/AppError';
import { StatusPedido } from './tipos';

const ORDEM_PREPARO: StatusPedido[] = ['RECEBIDO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE'];

export function avancarStatus(pedidoId: number, atual: StatusPedido): StatusPedido {
  const indice = ORDEM_PREPARO.indexOf(atual);
  if (indice === -1 || indice === ORDEM_PREPARO.length - 1) {
    throw new TransicaoInvalidaError(`Pedido ${pedidoId} está ${atual} e não pode avançar.`);
  }
  return ORDEM_PREPARO[indice + 1];
}

export function retrocederStatus(pedidoId: number, atual: StatusPedido): StatusPedido {
  const indice = ORDEM_PREPARO.indexOf(atual);
  if (indice <= 0) {
    throw new TransicaoInvalidaError(`Pedido ${pedidoId} está ${atual} e não pode retroceder.`);
  }
  return ORDEM_PREPARO[indice - 1];
}

export function statusParaCancelamento(pedidoId: number, atual: StatusPedido): StatusPedido {
  if (atual === 'ENTREGUE') {
    throw new TransicaoInvalidaError(`Pedido ${pedidoId} já está ENTREGUE e não pode ser cancelado.`);
  }
  if (atual === 'CANCELADO') {
    throw new TransicaoInvalidaError(`Pedido ${pedidoId} já está CANCELADO.`);
  }
  return 'CANCELADO';
}
