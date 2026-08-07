import { NextFunction, Request, Response } from 'express';
import { NaoAutenticadoError } from '../errors/AppError';
import { verificarToken } from '../services/authService';

const ROTAS_PUBLICAS: { method: string; path: string }[] = [
  { method: 'POST', path: '/auth/login' },
  { method: 'GET', path: '/health' },
];

function ehRotaPublica(req: Request): boolean {
  const metodo = req.method === 'HEAD' ? 'GET' : req.method;
  return ROTAS_PUBLICAS.some((rota) => rota.method === metodo && req.path === rota.path);
}

export function autenticar(req: Request, _res: Response, next: NextFunction): void {
  if (ehRotaPublica(req)) {
    next();
    return;
  }

  const cabecalho = req.header('authorization');
  const token = cabecalho?.startsWith('Bearer ') ? cabecalho.slice('Bearer '.length) : undefined;

  if (!token) {
    next(new NaoAutenticadoError());
    return;
  }

  try {
    verificarToken(token);
    next();
  } catch {
    next(new NaoAutenticadoError());
  }
}
