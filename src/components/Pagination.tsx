'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={handlePrev}
        disabled={currentPage <= 1}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <span className="font-bold">
        Página {currentPage} de {totalPages > 500 ? 500 : totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages || currentPage >= 500}
        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
