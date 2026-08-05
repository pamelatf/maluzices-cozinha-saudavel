import { PrismaClient } from '@prisma/client';
import { calcularValorTotalEmCentavos, reaisParaCentavos } from '../src/domain/valorPedido';

const prisma = new PrismaClient();

interface ItemSeed {
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

interface PedidoSeed {
  cliente: string;
  observacao?: string;
  status: 'RECEBIDO' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO';
  itens: ItemSeed[];
}

const pedidos: PedidoSeed[] = [
  {
    cliente: 'Ana Paula Ribeiro',
    status: 'RECEBIDO',
    itens: [
      { nome: 'Bowl de quinoa com legumes', quantidade: 1, precoUnitario: 28.9 },
      { nome: 'Suco verde detox', quantidade: 1, precoUnitario: 12.5 },
    ],
  },
  {
    cliente: 'Carlos Eduardo Lima',
    observacao: 'Sem glúten',
    status: 'RECEBIDO',
    itens: [{ nome: 'Wrap de frango grelhado', quantidade: 2, precoUnitario: 24.0 }],
  },
  {
    cliente: 'Beatriz Fernandes',
    status: 'EM_PREPARO',
    itens: [
      { nome: 'Salada caesar fit', quantidade: 1, precoUnitario: 26.5 },
      { nome: 'Água de coco', quantidade: 1, precoUnitario: 7.0 },
    ],
  },
  {
    cliente: 'Diego Almeida',
    status: 'PRONTO',
    itens: [{ nome: 'Marmita fitness de frango', quantidade: 1, precoUnitario: 32.9 }],
  },
  {
    cliente: 'Fernanda Costa',
    observacao: 'Entregar até 12h',
    status: 'ENTREGUE',
    itens: [
      { nome: 'Bowl havaiano de salmão', quantidade: 1, precoUnitario: 36.0 },
      { nome: 'Chá gelado natural', quantidade: 1, precoUnitario: 9.0 },
    ],
  },
  {
    cliente: 'Gustavo Martins',
    status: 'CANCELADO',
    itens: [{ nome: 'Sopa de legumes', quantidade: 1, precoUnitario: 18.0 }],
  },
];

async function main(): Promise<void> {
  await prisma.itemPedido.deleteMany();
  await prisma.pedido.deleteMany();

  for (const pedido of pedidos) {
    const valorTotalCentavos = calcularValorTotalEmCentavos(pedido.itens);
    await prisma.pedido.create({
      data: {
        cliente: pedido.cliente,
        observacao: pedido.observacao ?? null,
        status: pedido.status,
        valorTotal: (valorTotalCentavos / 100).toFixed(2),
        itens: {
          create: pedido.itens.map((item) => ({
            nome: item.nome,
            quantidade: item.quantidade,
            precoUnitario: (reaisParaCentavos(item.precoUnitario) / 100).toFixed(2),
          })),
        },
      },
    });
  }

  console.log(`${pedidos.length} pedidos criados.`);
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
