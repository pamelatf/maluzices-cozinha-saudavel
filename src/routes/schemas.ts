import { z } from 'zod';

export const itemPedidoSchema = z.object({
  nome: z.string().trim().min(1, 'Campo obrigatório.').max(120, 'Máximo de 120 caracteres.'),
  quantidade: z.number().int('Deve ser um número inteiro.').min(1, 'Deve ser maior ou igual a 1.'),
  precoUnitario: z.number().gt(0, 'Deve ser maior que zero.'),
});

export const criarPedidoSchema = z.object({
  cliente: z.string().trim().min(1, 'Campo obrigatório.').max(120, 'Máximo de 120 caracteres.'),
  observacao: z.string().max(280, 'Máximo de 280 caracteres.').nullable().optional(),
  itens: z.array(itemPedidoSchema).min(1, 'Informe ao menos um item.'),
});

export const acaoStatusSchema = z.object({
  acao: z.enum(['AVANCAR', 'RETROCEDER'], {
    errorMap: () => ({ message: "Deve ser 'AVANCAR' ou 'RETROCEDER'." }),
  }),
});

export const idParamSchema = z.coerce.number().int().positive();
