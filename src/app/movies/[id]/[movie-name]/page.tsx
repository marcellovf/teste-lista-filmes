
import { getMovieByIdAction } from '@/app/actions';
import Link from 'next/link';
import Image from 'next/image';
import { Film, Calendar, Clock, Pencil } from 'lucide-react';

interface PageProps {
  params: Promise<{
    id: string;
    'movie-name': string;
  }>;
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id, 'movie-name': movieName } = await params;
  const movieId = Number(id);
  
  const movie = await getMovieByIdAction(movieId);

  if (!movie) {
    return <div className="text-center">Filme não encontrado.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className='flex justify-between items-center pb-4'>
        <Link href="/movies" className="hover:text-cyan-300 mb-4 ">
          &larr; Voltar para a lista
        </Link>
        <Link href={`/movies/${id}/${movieName}/edit`} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
          <Pencil className="w-5 h-5" />
          Editar
        </Link>
      </div>
      

      <div className="bg-slate-800 p-4 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row items-center md:items-start text-white">
        <div className="relative w-[229px] h-[332px]">
          {movie.poster_path ? (
            <Image
              src={movie.poster_path}
              alt={`Pôster de ${movie.title}`}
              width={229}
              height={332}
              objectFit="contain"
              priority
            />
          ) : (
            <div className="w-full h-full bg-slate-700 flex items-center justify-center">
              <Film className="w-24 h-24 text-slate-500" />
            </div>
          )}
        </div>

        <div className="p-6 md:pt-0 md:w-2/3 flex flex-col w-full">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <h2 className="text-2xl text-slate-300 mb-4">{movie.original_title}</h2>
          
          <div className="flex items-center text-slate-400 mb-4">
            <div className="flex items-center mr-6">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' }).format(new Date(movie.release_date))}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{movie.durationInMinutes} min</span>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Orçamento</h2>
            <p className="text-slate-300">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(movie.budget)}</p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Descrição</h2>
            <p className="text-slate-300">{movie.overview}</p>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Gêneros</h2>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map(genre => (
                <span key={genre.id} className="bg-slate-700 text-white px-3 py-1 rounded-full text-sm">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
