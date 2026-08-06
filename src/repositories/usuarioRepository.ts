import { prisma } from './prismaClient';

export interface Usuario {
  id: number;
  usuario: string;
  senha: string;
}

export async function buscarPorUsuario(usuario: string): Promise<Usuario | null> {
  return prisma.usuario.findUnique({ where: { usuario } });
}
