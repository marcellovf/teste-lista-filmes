import Image from 'next/image';
import { Film } from 'lucide-react';
import type { Movie, Genre } from '@prisma/client';

interface MovieCardProps {
  movie: Movie & { genres: Genre[] };
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const posterUrl = movie.poster_path || null;

  return (
    <div className="bg-slate-800 max-w-[229px] rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300 flex flex-col">
      <div className="relative h-auto">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`Pôster de ${movie.title}`}
            width={229}
            height={288}
            style={{ objectFit: 'cover' }}
            priority
          />
        ) : (
          <div className="w-full h-full bg-slate-700 flex items-center justify-center">
            <Film className="w-16 h-16 text-slate-500" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white flex-grow" title={movie.title}>
          {movie.title}
        </h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-slate-400">
            {movie.release_year}
          </p>
          <p className="text-sm text-slate-400">
            {movie.durationInMinutes} min
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
