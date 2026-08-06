import { TransicaoInvalidaError } from '../errors/AppError';
import { StatusPedido } from './tipos';

const STATUS_EDITAVEIS: StatusPedido[] = ['RECEBIDO', 'EM_PREPARO'];

export function garantirPedidoEditavel(pedidoId: number, status: StatusPedido): void {
  if (!STATUS_EDITAVEIS.includes(status)) {
    throw new TransicaoInvalidaError(`Pedido ${pedidoId} está ${status} e não pode ser editado.`);
  }
}
