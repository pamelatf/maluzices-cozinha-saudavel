import { NextFunction, Request, Response } from 'express';
import { DescritorRota } from '../routing/tipos';

function caminhoCorresponde(padrao: string, caminhoReal: string): boolean {
  const segmentosPadrao = padrao.split('/').filter(Boolean);
  const segmentosReal = caminhoReal.split('/').filter(Boolean);

  if (segmentosPadrao.length !== segmentosReal.length) {
    return false;
  }

  return segmentosPadrao.every(
    (segmento, indice) => segmento.startsWith(':') || segmento === segmentosReal[indice],
  );
}

/**
 * Middleware compartilhado que decide, a partir do catálogo de rotas
 * declarado por cada roteador, se o caminho existe e se o método é aceito
 * — antes de qualquer verificação de autenticação. Rota inexistente vira
 * 404, método não aceito vira 405 com o header Allow, e OPTIONS numa rota
 * existente vira 204 com o mesmo header. Só segue adiante (next) quando o
 * par caminho+método está de fato registrado.
 */
export function criarVerbosPermitidos(rotas: DescritorRota[]) {
  return function verbosPermitidos(req: Request, res: Response, next: NextFunction): void {
    const correspondentes = rotas.filter((rota) => caminhoCorresponde(rota.caminho, req.path));

    if (correspondentes.length === 0) {
      res.status(404).json({
        erro: {
          codigo: 'ROTA_NAO_ENCONTRADA',
          mensagem: 'Rota não existe.',
          detalhes: [],
        },
      });
      return;
    }

    const metodosPermitidos = new Set<string>(['OPTIONS']);
    for (const rota of correspondentes) {
      for (const metodo of rota.metodos) {
        metodosPermitidos.add(metodo);
        if (metodo === 'GET') {
          metodosPermitidos.add('HEAD');
        }
      }
    }

    const allow = Array.from(metodosPermitidos).join(', ');

    if (req.method === 'OPTIONS') {
      res.status(204).set('Allow', allow).end();
      return;
    }

    if (!metodosPermitidos.has(req.method)) {
      res.status(405).set('Allow', allow).json({
        erro: {
          codigo: 'METODO_NAO_PERMITIDO',
          mensagem: `Método ${req.method} não é permitido em ${req.path}.`,
          detalhes: [],
        },
      });
      return;
    }

    next();
  };
}
