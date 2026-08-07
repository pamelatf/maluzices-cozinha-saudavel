import { Router } from 'express';
import { prisma } from '../repositories/prismaClient';
import { DescritorRota } from '../routing/tipos';

export const healthRouter = Router();

export const rotasHealth: DescritorRota[] = [{ caminho: '/health', metodos: ['GET'] }];

const TEMPO_LIMITE_MS = 2000;
const EXPOR_DETALHE = process.env.NODE_ENV !== 'production';

interface Dependencia {
  nome: string;
  ok: boolean;
  detalhe?: string;
}

async function checarPersistencia(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
}

async function comTempoLimite<T>(promessa: Promise<T>, ms: number): Promise<T> {
  let temporizador: NodeJS.Timeout;

  const limite = new Promise<never>((_, rejeitar) => {
    temporizador = setTimeout(() => rejeitar(new Error(`Tempo limite de ${ms}ms excedido.`)), ms);
  });

  try {
    return await Promise.race([promessa, limite]);
  } finally {
    clearTimeout(temporizador!);
  }
}

async function verificar(nome: string, checagem: () => Promise<unknown>): Promise<Dependencia> {
  try {
    await comTempoLimite(checagem(), TEMPO_LIMITE_MS);
    return { nome, ok: true };
  } catch (erro) {
    return {
      nome,
      ok: false,
      detalhe: EXPOR_DETALHE ? (erro as Error).message : 'Indisponível.',
    };
  }
}

healthRouter.get('/health', async (_req, res) => {
  const dependencias = await Promise.all([verificar('persistencia', checarPersistencia)]);

  const saudavel = dependencias.every((dependencia) => dependencia.ok);

  res.status(saudavel ? 200 : 503).json({
    status: saudavel ? 'ok' : 'indisponivel',
    dependencias,
  });
});
