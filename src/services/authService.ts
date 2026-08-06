import jwt from 'jsonwebtoken';
import { CredenciaisInvalidasError } from '../errors/AppError';
import * as usuarioRepository from '../repositories/usuarioRepository';

const EXPIRACAO_SEGUNDOS = 60 * 60;

export interface ResultadoLogin {
  token: string;
  expiraEm: string;
}

function segredo(): string {
  const valor = process.env.JWT_SECRET;
  if (!valor) {
    throw new Error('JWT_SECRET não configurado.');
  }
  return valor;
}

export async function login(usuario: string, senha: string): Promise<ResultadoLogin> {
  const encontrado = await usuarioRepository.buscarPorUsuario(usuario);
  if (!encontrado || encontrado.senha !== senha) {
    throw new CredenciaisInvalidasError();
  }

  const token = jwt.sign({ sub: encontrado.usuario }, segredo(), { expiresIn: EXPIRACAO_SEGUNDOS });
  const expiraEm = new Date(Date.now() + EXPIRACAO_SEGUNDOS * 1000).toISOString();

  return { token, expiraEm };
}

export function verificarToken(token: string): void {
  jwt.verify(token, segredo());
}
