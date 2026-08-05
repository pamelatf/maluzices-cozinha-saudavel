import { NextFunction, Request, Response } from 'express';
import { AppError } from './AppError';

export function tratadorDeErros(erro: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (erro instanceof AppError) {
    res.status(erro.status).json({
      erro: {
        codigo: erro.codigo,
        mensagem: erro.message,
        detalhes: erro.detalhes,
      },
    });
    return;
  }

  if (erro instanceof SyntaxError && 'body' in erro) {
    res.status(400).json({
      erro: {
        codigo: 'VALIDACAO',
        mensagem: 'JSON inválido no corpo da requisição.',
        detalhes: [],
      },
    });
    return;
  }

  console.error(erro);
  res.status(500).json({
    erro: {
      codigo: 'ERRO_INTERNO',
      mensagem: 'Erro interno do servidor.',
      detalhes: [],
    },
  });
}

export function rotaNaoEncontrada(_req: Request, res: Response): void {
  res.status(404).json({
    erro: {
      codigo: 'ROTA_NAO_ENCONTRADA',
      mensagem: 'Rota não existe.',
      detalhes: [],
    },
  });
}
