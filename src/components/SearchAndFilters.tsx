'use client';

import { Search, Calendar, Tag, Filter } from 'lucide-react';
import { Genre } from '@prisma/client';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import { getGenresAction } from '@/app/actions';
import ActiveFilters from './ActiveFilters';

interface SearchAndFiltersProps {
  filters: { query?: string; genre?: string[]; start_date?: string; end_date?: string; min_duration?: number; max_duration?: number; };
  onFilterChange: (newFilters: Partial<{ query?: string; genre?: string[]; start_date?: string; end_date?: string; min_duration?: number; max_duration?: number; }>) => void;
}

const SearchAndFilters = ({ filters, onFilterChange }: SearchAndFiltersProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    async function fetchGenres() {
      const genresData = await getGenresAction();
      setGenres(genresData);
    }
    fetchGenres();
  }, []);

  const handleGenreChange = (genreId: string) => {
    const currentGenres = filters.genre || [];
    const newGenres = currentGenres.includes(genreId)
      ? currentGenres.filter(id => id !== genreId)
      : [...currentGenres, genreId];
    onFilterChange({ genre: newGenres });
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg mb-8 sm:w-full">
      <div className="flex justify-between items-center">
        <div className="flex-grow">
          <label htmlFor="search" className="sr-only">Buscar por título</label>
          <div className="relative">
            <input
              type="text"
              id="search"
              placeholder="Buscar por título..."
              value={filters.query || ''}
              onChange={(e) => onFilterChange({ query: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="ml-4 px-4 py-2 bg-cyan-500 text-white rounded-md flex items-center hover:bg-cyan-600 transition-colors"
        >
          <Filter size={20} className="mr-2" />
          Filtros
        </button>
      </div>

      <ActiveFilters filters={filters} onFilterChange={onFilterChange} genres={genres} />

      <Modal title="Filtros Avançados" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="grid grid-cols-1 gap-4">
          {/* Filtro de Gênero */}
          <div>
            <label className="text-sm text-slate-400 block mb-2">Gênero</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {genres.map(genre => (
                <div key={genre.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`genre-filter-${genre.id}`}
                    checked={(filters.genre || []).includes(String(genre.id))}
                    onChange={() => handleGenreChange(String(genre.id))}
                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <label htmlFor={`genre-filter-${genre.id}`} className="ml-2 block text-sm text-gray-300">
                    {genre.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filtro de Data */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="text-sm text-slate-400 block mb-2">Data Inicial(Antiga)</label>
              <div className="relative">
                <input
                  type="date"
                  id="start_date"
                  value={filters.start_date || ''}
                  onChange={(e) => onFilterChange({ start_date: e.target.value || undefined })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label htmlFor="end_date" className="text-sm text-slate-400 block mb-2">Data Final(Recente)</label>
              <div className="relative">
                <input
                  type="date"
                  id="end_date"
                  value={filters.end_date || ''}
                  onChange={(e) => onFilterChange({ end_date: e.target.value || undefined })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filtro de Duração */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="min_duration" className="text-sm text-slate-400 block mb-2">Duração Mínima (min)</label>
              <input
                type="number"
                id="min_duration"
                placeholder="Ex: 60"
                value={filters.min_duration || ''}
                onChange={(e) => onFilterChange({ min_duration: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label htmlFor="max_duration" className="text-sm text-slate-400 block mb-2">Duração Máxima (min)</label>
              <input
                type="number"
                id="max_duration"
                placeholder="Ex: 180"
                value={filters.max_duration || ''}
                onChange={(e) => onFilterChange({ max_duration: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SearchAndFilters;
