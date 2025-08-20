'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import MovieCard from './MovieCard';
import SearchAndFilters from './SearchAndFilters';
import Pagination from './Pagination';
import { getMoviesAction } from '@/app/actions';
import type { Movie, Genre } from '@prisma/client';

// O tipo de dados que o componente MovieList espera agora
interface MovieWithGenres extends Movie {
  genres: Genre[];
  id: number;
}

interface MovieListData {
  page: number;
  results: MovieWithGenres[];
  total_pages: number;
  total_results: number;
}

interface MovieListProps {
  initialMoviesData: MovieListData;
  genres: Genre[];
}

const MovieList = ({ initialMoviesData, genres }: MovieListProps) => {
  const [moviesData, setMoviesData] = useState(initialMoviesData);
  const [filters, setFilters] = useState<{ query?: string; genre?: string; start_year?: number; end_year?: number; }>({});
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const isInitialMount = useRef(true);

  const debouncedQuery = useDebounce(filters.query, 500);

  useEffect(() => {
    const loadMovies = () => {
      startTransition(async () => {
        const data = await getMoviesAction({ ...filters, query: debouncedQuery, page });
        setMoviesData(data as MovieListData);
      });
    };

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    loadMovies();
  }, [debouncedQuery, filters.genre, filters.start_year, filters.end_year, page]);

  const handleFilterChange = (newFilters: Partial<{ query?: string; genre?: string; start_year?: number; end_year?: number; }>) => {
    setPage(1);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className='sm:flex sm:flex-col sm:justify-center sm:items-center md:items-start'>
      <SearchAndFilters genres={genres} filters={filters} onFilterChange={handleFilterChange} />
      
      {isPending ? (
        <div className="flex sm:justify-center items-center h-96">
          <p className="text-xl animate-pulse">Carregando filmes...</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center md:justify-start gap-6">
          {moviesData.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      <div className='mt-8 flex flex-wrap justify-center w-full'>
        {!isPending && moviesData.results.length > 0 && (
          <Pagination 
            currentPage={page}
            totalPages= {moviesData.total_pages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
};

export default MovieList;