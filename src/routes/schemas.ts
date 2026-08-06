import { z } from 'zod';

export const itemPedidoSchema = z.object({
  nome: z.string().trim().min(1, 'Campo obrigatório.').max(120, 'Máximo de 120 caracteres.'),
  quantidade: z.number().int('Deve ser um número inteiro.').min(1, 'Deve ser maior ou igual a 1.'),
  precoUnitario: z.number().gt(0, 'Deve ser maior que zero.'),
});

const clienteSchema = z.string().trim().min(1, 'Campo obrigatório.').max(120, 'Máximo de 120 caracteres.');
const observacaoSchema = z.string().max(280, 'Máximo de 280 caracteres.').nullable().optional();
const itensSchema = z.array(itemPedidoSchema).min(1, 'Informe ao menos um item.');

export const criarPedidoSchema = z.object({
  cliente: clienteSchema,
  observacao: observacaoSchema,
  itens: itensSchema,
});

export const editarPedidoSchema = z
  .object({
    cliente: clienteSchema.optional(),
    observacao: observacaoSchema,
    itens: itensSchema.optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0, {
    message: 'Corpo não pode ser vazio.',
  });

export const acaoStatusSchema = z.object({
  acao: z.enum(['AVANCAR', 'RETROCEDER'], {
    errorMap: () => ({ message: "Deve ser 'AVANCAR' ou 'RETROCEDER'." }),
  }),
});

export const idParamSchema = z.coerce.number().int().positive();
