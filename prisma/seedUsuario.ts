import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await prisma.usuario.upsert({
    where: { usuario: 'pamela' },
    update: {},
    create: { usuario: 'pamela', senha: '1234' },
  });

  console.log('Usuário "pamela" pronto.');
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
