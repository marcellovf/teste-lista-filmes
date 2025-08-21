import prisma from '@/lib/prisma';
import MovieList from '@/components/MovieList';
import { moviesPerPage } from '@/lib/consts';

export default async function MoviesPage() {
  // Busca os dados iniciais do banco de dados Prisma
  const initialMovies = await prisma.movie.findMany({
    include: { genres: true },
    orderBy: { release_year: 'desc' },
    take: moviesPerPage, // Pega os 10 primeiros para a carga inicial
  });

  const moviesCount = await prisma.movie.count();
  const initialMoviesData = {
    page: 1,
    results: initialMovies,
    total_pages: Math.max(1, Math.ceil(moviesCount / moviesPerPage)),
    total_results: moviesCount,
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Catálogo de Filmes</h1>
      <MovieList initialMoviesData={initialMoviesData} />
    </main>
  );
}
