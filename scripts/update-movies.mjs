import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allMovies = await prisma.movie.findMany();

  for (const movie of allMovies) {
    await prisma.movie.update({
      where: { id: movie.id },
      data: {
        overview: movie.overview ?? 'No overview available.',
        release_date: movie.release_date ?? new Date(),
        original_title: movie.original_title ?? movie.title,
        budget: movie.budget ?? 0,
      },
    });
  }

  console.log(`Updated ${allMovies.length} movies.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
