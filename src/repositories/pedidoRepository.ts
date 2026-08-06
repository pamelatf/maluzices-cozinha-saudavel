import { Prisma, StatusPedido as StatusPedidoPrisma } from '@prisma/client';
import { Pedido, STATUS_PEDIDO, StatusPedido } from '../domain/tipos';
import { prisma } from './prismaClient';

type PedidoComItens = Prisma.PedidoGetPayload<{ include: { itens: true } }>;

function paraDominio(pedido: PedidoComItens): Pedido {
  return {
    id: pedido.id,
    cliente: pedido.cliente,
    observacao: pedido.observacao,
    status: pedido.status as StatusPedido,
    valorTotal: Number(pedido.valorTotal),
    criadoEm: pedido.criadoEm,
    atualizadoEm: pedido.atualizadoEm,
    itens: pedido.itens.map((item) => ({
      id: item.id,
      nome: item.nome,
      quantidade: item.quantidade,
      precoUnitario: Number(item.precoUnitario),
    })),
  };
}

export interface ItemParaCriar {
  nome: string;
  quantidade: number;
  precoUnitarioCentavos: number;
}

export interface DadosCriacaoPedido {
  cliente: string;
  observacao: string | null;
  valorTotalCentavos: number;
  itens: ItemParaCriar[];
}

export async function criar(dados: DadosCriacaoPedido): Promise<Pedido> {
  const criado = await prisma.pedido.create({
    data: {
      cliente: dados.cliente,
      observacao: dados.observacao,
      status: 'RECEBIDO',
      valorTotal: (dados.valorTotalCentavos / 100).toFixed(2),
      itens: {
        create: dados.itens.map((item) => ({
          nome: item.nome,
          quantidade: item.quantidade,
          precoUnitario: (item.precoUnitarioCentavos / 100).toFixed(2),
        })),
      },
    },
    include: { itens: true },
  });
  return paraDominio(criado);
}

export async function listar(status?: StatusPedido): Promise<Pedido[]> {
  const pedidos = await prisma.pedido.findMany({
    where: status ? { status: status as StatusPedidoPrisma } : undefined,
    include: { itens: true },
    orderBy: { id: 'asc' },
  });
  return pedidos.map(paraDominio);
}

export async function buscarPorId(id: number): Promise<Pedido | null> {
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: { itens: true },
  });
  return pedido ? paraDominio(pedido) : null;
}

export async function atualizarStatus(id: number, status: StatusPedido): Promise<Pedido> {
  const atualizado = await prisma.pedido.update({
    where: { id },
    data: { status: status as StatusPedidoPrisma },
    include: { itens: true },
  });
  return paraDominio(atualizado);
}

export async function contarPorStatus(): Promise<Record<StatusPedido, number>> {
  const grupos = await prisma.pedido.groupBy({
    by: ['status'],
    _count: { _all: true },
  });

  const resumo = STATUS_PEDIDO.reduce(
    (acc, status) => ({ ...acc, [status]: 0 }),
    {} as Record<StatusPedido, number>,
  );

  for (const grupo of grupos) {
    resumo[grupo.status as StatusPedido] = grupo._count._all;
  }

  return resumo;
}
