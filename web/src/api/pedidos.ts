import { NovoPedidoInput, Pedido } from '../tipos';
import { requisitar } from './httpClient';

export { ErroRequisicao } from './httpClient';

export async function listarPedidos(): Promise<Pedido[]> {
  return requisitar<Pedido[]>('/pedidos');
}

export async function criarPedido(dados: NovoPedidoInput): Promise<Pedido> {
  return requisitar<Pedido>('/pedidos', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

export interface EditarPedidoInput {
  cliente?: string;
  observacao?: string | null;
  itens?: { nome: string; quantidade: number; precoUnitario: number }[];
}

export async function editarPedido(id: number, dados: EditarPedidoInput): Promise<Pedido> {
  return requisitar<Pedido>(`/pedidos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  });
}

async function alterarStatus(id: number, acao: 'AVANCAR' | 'RETROCEDER'): Promise<Pedido> {
  return requisitar<Pedido>(`/pedidos/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ acao }),
  });
}

export function avancarPedido(id: number): Promise<Pedido> {
  return alterarStatus(id, 'AVANCAR');
}

export function retrocederPedido(id: number): Promise<Pedido> {
  return alterarStatus(id, 'RETROCEDER');
}

export async function cancelarPedido(id: number): Promise<Pedido> {
  return requisitar<Pedido>(`/pedidos/${id}`, { method: 'DELETE' });
}
