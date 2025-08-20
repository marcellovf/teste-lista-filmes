'use client';

import { Search, Calendar, Tag } from 'lucide-react';
import { Genre } from '@prisma/client';

interface SearchAndFiltersProps {
  genres: Genre[];
  filters: { query?: string; genre?: string; start_year?: number; end_year?: number; };
  onFilterChange: (newFilters: Partial<{ query?: string; genre?: string; start_year?: number; end_year?: number; }>) => void;
}

const SearchAndFilters = ({ genres, filters, onFilterChange }: SearchAndFiltersProps) => {
  return (
    <div className="bg-slate-800 p-4 rounded-lg mb-8 sm:w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Barra de Busca */}
        <div className="lg:col-span-1">
          <label htmlFor="search" className="text-sm text-slate-400 block mb-2">Buscar por título</label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Vingadores: Ultimato..."
              value={filters.query || ''}
              onChange={(e) => onFilterChange({ query: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          </div>
        </div>

        {/* Filtro de Gênero */}
        <div>
          <label htmlFor="genre" className="text-sm text-slate-400 block mb-2">Gênero</label>
          <div className="relative">
            <select
              id="genre"
              value={filters.genre || ''}
              onChange={(e) => onFilterChange({ genre: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none pr-10"
            >
              <option value="">Todos</option>
              {genres.map(genre => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>
            <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        
        {/* Filtro de Ano */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_year" className="text-sm text-slate-400 block mb-2">Ano Inicial</label>
            <div className="relative">
              <input
                type="number"
                id="start_year"
                placeholder="Ex: 2000"
                value={filters.start_year || ''}
                onChange={(e) => onFilterChange({ start_year: parseInt(e.target.value) || undefined })}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
            </div>
          </div>
          <div>
            <label htmlFor="end_year" className="text-sm text-slate-400 block mb-2">Ano Final</label>
            <div className="relative">
              <input
                type="number"
                id="end_year"
                placeholder="Ex: 2023"
                value={filters.end_year || ''}
                onChange={(e) => onFilterChange({ end_year: parseInt(e.target.value) || undefined })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SearchAndFilters;
