// scripts/fix-movies.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Atualiza todos os filmes existentes
  const updated = await prisma.movie.updateMany({
    where: { addedById: null },
    data: {
      sent: true,
      addedById: 4, // atribui ao usuário com id 4
    },
  });

  console.log(`Filmes atualizados: ${updated.count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
