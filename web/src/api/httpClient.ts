import { CorpoErroApi, ErroDetalhe } from '../tipos';

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

let tokenAtual: string | null = null;

type OuvinteSessaoExpirada = () => void;
let ouvinteSessaoExpirada: OuvinteSessaoExpirada | null = null;

export function definirToken(token: string | null): void {
  tokenAtual = token;
}

export function aoExpirarSessao(ouvinte: OuvinteSessaoExpirada): void {
  ouvinteSessaoExpirada = ouvinte;
}

async function tratarResposta<T>(resposta: Response, caminho: string): Promise<T> {
  if (!resposta.ok) {
    if (resposta.status === 401 && caminho !== '/auth/login') {
      tokenAtual = null;
      ouvinteSessaoExpirada?.();
    }

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

export async function requisitar<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const headers = new Headers(opcoes.headers);
  headers.set('Content-Type', 'application/json');
  if (tokenAtual) {
    headers.set('Authorization', `Bearer ${tokenAtual}`);
  }

  const resposta = await fetch(`${BASE_URL}${caminho}`, { ...opcoes, headers });
  return tratarResposta<T>(resposta, caminho);
}
