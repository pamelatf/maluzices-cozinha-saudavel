import { ZodError } from 'zod';
import { ErroDetalhe } from '../errors/AppError';

export function zodParaDetalhes(erro: ZodError): ErroDetalhe[] {
  return erro.issues.map((issue) => ({
    campo: issue.path.join('.') || '(raiz)',
    problema: issue.message,
  }));
}
