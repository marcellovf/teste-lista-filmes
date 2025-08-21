'use client';

import { X } from 'lucide-react';
import { Genre } from '@prisma/client';

interface ActiveFiltersProps {
  filters: { query?: string; genre?: string[]; start_date?: string; end_date?: string; };
  onFilterChange: (newFilters: Partial<{ query?: string; genre?: string[]; start_date?: string; end_date?: string; }>) => void;
  genres: Genre[];
}

const ActiveFilters = ({ filters, onFilterChange, genres }: ActiveFiltersProps) => {
  const { genre, start_date, end_date } = filters;

  const handleRemoveGenre = (genreId: string) => {
    const newGenres = (genre || []).filter(id => id !== genreId);
    onFilterChange({ genre: newGenres });
  };

  const handleRemoveDate = (dateType: 'start_date' | 'end_date') => {
    onFilterChange({ [dateType]: undefined });
  };

  const getGenreName = (genreId: string) => {
    const genre = genres.find(g => String(g.id) === genreId);
    return genre ? genre.name : '';
  };

  if (!genre?.length && !start_date && !end_date) {
    return null;
  }

  return (
    <div className="flex items-center flex-wrap gap-2 mt-4">
      <span className="text-sm text-slate-400">Filtros Ativos:</span>
      {genre?.map(genreId => (
        <div key={genreId} className="flex items-center bg-slate-700 text-white rounded-full px-3 py-1 text-sm">
          <span>{getGenreName(genreId)}</span>
          <button onClick={() => handleRemoveGenre(genreId)} className="ml-2 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      ))}
      {start_date && (
        <div className="flex items-center bg-slate-700 text-white rounded-full px-3 py-1 text-sm">
          <span>Início: {start_date}</span>
          <button onClick={() => handleRemoveDate('start_date')} className="ml-2">
            <X size={16} />
          </button>
        </div>
      )}
      {end_date && (
        <div className="flex items-center bg-slate-700 text-white rounded-full px-3 py-1 text-sm">
          <span>Fim: {end_date}</span>
          <button onClick={() => handleRemoveDate('end_date')} className="ml-2">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActiveFilters;
