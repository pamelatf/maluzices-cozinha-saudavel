import { garantirPedidoEditavel } from '../domain/edicaoPedido';
import { avancarStatus, retrocederStatus, statusParaCancelamento } from '../domain/statusPedido';
import { AcaoStatus, ItemPedidoEntrada, Pedido, STATUS_PEDIDO, StatusPedido } from '../domain/tipos';
import { calcularValorTotalEmCentavos, reaisParaCentavos } from '../domain/valorPedido';
import { PedidoNaoEncontradoError, StatusInvalidoError } from '../errors/AppError';
import * as pedidoRepository from '../repositories/pedidoRepository';

export interface CriarPedidoInput {
  cliente: string;
  observacao?: string | null;
  itens: ItemPedidoEntrada[];
}

export async function criarPedido(input: CriarPedidoInput): Promise<Pedido> {
  const valorTotalCentavos = calcularValorTotalEmCentavos(input.itens);

  return pedidoRepository.criar({
    cliente: input.cliente,
    observacao: input.observacao ?? null,
    valorTotalCentavos,
    itens: input.itens.map((item) => ({
      nome: item.nome,
      quantidade: item.quantidade,
      precoUnitarioCentavos: reaisParaCentavos(item.precoUnitario),
    })),
  });
}

export function validarStatusFiltro(status: unknown): StatusPedido | undefined {
  if (status === undefined) {
    return undefined;
  }
  if (typeof status !== 'string' || !STATUS_PEDIDO.includes(status as StatusPedido)) {
    throw new StatusInvalidoError(String(status));
  }
  return status as StatusPedido;
}

export async function listarPedidos(status?: StatusPedido): Promise<Pedido[]> {
  return pedidoRepository.listar(status);
}

export async function buscarPedido(id: number): Promise<Pedido> {
  const pedido = await pedidoRepository.buscarPorId(id);
  if (!pedido) {
    throw new PedidoNaoEncontradoError(id);
  }
  return pedido;
}

export async function atualizarStatusPedido(id: number, acao: AcaoStatus): Promise<Pedido> {
  const pedido = await buscarPedido(id);
  const novoStatus =
    acao === 'AVANCAR'
      ? avancarStatus(id, pedido.status)
      : retrocederStatus(id, pedido.status);
  return pedidoRepository.atualizarStatus(id, novoStatus);
}

export interface EditarPedidoInput {
  cliente?: string;
  observacao?: string | null;
  itens?: ItemPedidoEntrada[];
}

export async function editarPedido(id: number, input: EditarPedidoInput): Promise<Pedido> {
  const pedido = await buscarPedido(id);
  garantirPedidoEditavel(id, pedido.status);

  const dados: pedidoRepository.DadosAtualizacaoPedido = {};
  if (input.cliente !== undefined) {
    dados.cliente = input.cliente;
  }
  if (input.observacao !== undefined) {
    dados.observacao = input.observacao;
  }
  if (input.itens !== undefined) {
    dados.itens = input.itens.map((item) => ({
      nome: item.nome,
      quantidade: item.quantidade,
      precoUnitarioCentavos: reaisParaCentavos(item.precoUnitario),
    }));
    dados.valorTotalCentavos = calcularValorTotalEmCentavos(input.itens);
  }

  return pedidoRepository.atualizar(id, dados);
}

export async function cancelarPedido(id: number): Promise<Pedido> {
  const pedido = await buscarPedido(id);
  const novoStatus = statusParaCancelamento(id, pedido.status);
  return pedidoRepository.atualizarStatus(id, novoStatus);
}

export async function resumoPedidos(): Promise<Record<StatusPedido, number>> {
  return pedidoRepository.contarPorStatus();
}
