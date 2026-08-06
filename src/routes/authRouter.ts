import { Router } from 'express';
import { z } from 'zod';
import { ErroValidacao } from '../errors/AppError';
import * as authService from '../services/authService';
import { zodParaDetalhes } from './zodParaDetalhes';

export const authRouter = Router();

const loginSchema = z.object({
  usuario: z.string().min(1, 'Campo obrigatório.'),
  senha: z.string().min(1, 'Campo obrigatório.'),
});

authRouter.post('/auth/login', async (req, res, next) => {
  try {
    const resultado = loginSchema.safeParse(req.body);
    if (!resultado.success) {
      throw new ErroValidacao(zodParaDetalhes(resultado.error));
    }
    const { token, expiraEm } = await authService.login(resultado.data.usuario, resultado.data.senha);
    res.status(200).json({ token, expiraEm });
  } catch (erro) {
    next(erro);
  }
});
