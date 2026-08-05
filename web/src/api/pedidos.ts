import { CorpoErroApi, ErroDetalhe, NovoPedidoInput, Pedido } from '../tipos';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ErroRequisicao extends Error {
  constructor(
    public readonly status: number,
    public readonly codigo: string,
    mensagem: string,
    public readonly detalhes: ErroDetalhe[],
  ) {
    super(mensagem);
    this.name = 'ErroRequisicao';
  }
}

async function tratarResposta<T>(resposta: Response): Promise<T> {
  if (!resposta.ok) {
    const corpo = (await resposta.json().catch(() => null)) as CorpoErroApi | null;
    const erro = corpo?.erro;
    throw new ErroRequisicao(
      resposta.status,
      erro?.codigo ?? 'ERRO_DESCONHECIDO',
      erro?.mensagem ?? 'Não foi possível completar a ação.',
      erro?.detalhes ?? [],
    );
  }
  return resposta.json() as Promise<T>;
}

export async function listarPedidos(): Promise<Pedido[]> {
  const resposta = await fetch(`${BASE_URL}/pedidos`);
  return tratarResposta<Pedido[]>(resposta);
}

export async function criarPedido(dados: NovoPedidoInput): Promise<Pedido> {
  const resposta = await fetch(`${BASE_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  return tratarResposta<Pedido>(resposta);
}

async function alterarStatus(id: number, acao: 'AVANCAR' | 'RETROCEDER'): Promise<Pedido> {
  const resposta = await fetch(`${BASE_URL}/pedidos/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ acao }),
  });
  return tratarResposta<Pedido>(resposta);
}

export function avancarPedido(id: number): Promise<Pedido> {
  return alterarStatus(id, 'AVANCAR');
}

export function retrocederPedido(id: number): Promise<Pedido> {
  return alterarStatus(id, 'RETROCEDER');
}

export async function cancelarPedido(id: number): Promise<Pedido> {
  const resposta = await fetch(`${BASE_URL}/pedidos/${id}`, { method: 'DELETE' });
  return tratarResposta<Pedido>(resposta);
}
