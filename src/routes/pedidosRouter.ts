import { Router } from 'express';
import { AcaoStatus, Pedido } from '../domain/tipos';
import { ErroValidacao } from '../errors/AppError';
import { DescritorRota } from '../routing/tipos';
import * as pedidoService from '../services/pedidoService';
import { acaoStatusSchema, criarPedidoSchema, editarPedidoSchema, idParamSchema } from './schemas';
import { zodParaDetalhes } from './zodParaDetalhes';

export const pedidosRouter = Router();

export const rotasPedidos: DescritorRota[] = [
  { caminho: '/pedidos', metodos: ['GET', 'POST'] },
  { caminho: '/pedidos/resumo', metodos: ['GET'] },
  { caminho: '/pedidos/:id', metodos: ['GET', 'PATCH', 'DELETE'] },
  { caminho: '/pedidos/:id/status', metodos: ['PATCH'] },
];

function paraId(valorParam: string): number {
  const resultado = idParamSchema.safeParse(valorParam);
  if (!resultado.success) {
    throw new ErroValidacao([{ campo: 'id', problema: 'Deve ser um número inteiro positivo.' }]);
  }
  return resultado.data;
}

function serializarPedido(pedido: Pedido) {
  return {
    ...pedido,
    criadoEm: pedido.criadoEm.toISOString(),
    atualizadoEm: pedido.atualizadoEm.toISOString(),
  };
}

pedidosRouter.post('/pedidos', async (req, res, next) => {
  try {
    const resultado = criarPedidoSchema.safeParse(req.body);
    if (!resultado.success) {
      throw new ErroValidacao(zodParaDetalhes(resultado.error));
    }
    const pedido = await pedidoService.criarPedido(resultado.data);
    res.status(201).json(serializarPedido(pedido));
  } catch (erro) {
    next(erro);
  }
});

pedidosRouter.get('/pedidos/resumo', async (_req, res, next) => {
  try {
    const resumo = await pedidoService.resumoPedidos();
    res.status(200).json(resumo);
  } catch (erro) {
    next(erro);
  }
});

pedidosRouter.get('/pedidos/:id', async (req, res, next) => {
  try {
    const id = paraId(req.params.id);
    const pedido = await pedidoService.buscarPedido(id);
    res.status(200).json(serializarPedido(pedido));
  } catch (erro) {
    next(erro);
  }
});

pedidosRouter.get('/pedidos', async (req, res, next) => {
  try {
    const status = pedidoService.validarStatusFiltro(req.query.status);
    const pedidos = await pedidoService.listarPedidos(status);
    res.status(200).json(pedidos.map(serializarPedido));
  } catch (erro) {
    next(erro);
  }
});

pedidosRouter.patch('/pedidos/:id', async (req, res, next) => {
  try {
    const id = paraId(req.params.id);
    const resultado = editarPedidoSchema.safeParse(req.body);
    if (!resultado.success) {
      throw new ErroValidacao(zodParaDetalhes(resultado.error));
    }
    const pedido = await pedidoService.editarPedido(id, resultado.data);
    res.status(200).json(serializarPedido(pedido));
  } catch (erro) {
    next(erro);
  }
});

pedidosRouter.patch('/pedidos/:id/status', async (req, res, next) => {
  try {
    const id = paraId(req.params.id);
    const resultado = acaoStatusSchema.safeParse(req.body);
    if (!resultado.success) {
      throw new ErroValidacao(zodParaDetalhes(resultado.error));
    }
    const pedido = await pedidoService.atualizarStatusPedido(id, resultado.data.acao as AcaoStatus);
    res.status(200).json(serializarPedido(pedido));
  } catch (erro) {
    next(erro);
  }
});

pedidosRouter.delete('/pedidos/:id', async (req, res, next) => {
  try {
    const id = paraId(req.params.id);
    const pedido = await pedidoService.cancelarPedido(id);
    res.status(200).json(serializarPedido(pedido));
  } catch (erro) {
    next(erro);
  }
});
