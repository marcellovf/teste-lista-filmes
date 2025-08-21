'use client';

import { getMovieByIdAction, updateMovieAction, getGenresAction } from '@/app/actions';
import { Genre, Movie } from '@prisma/client';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { default as NextImage } from 'next/image';
import { slugify } from '@/lib/slugify';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      aria-disabled={pending}
      className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait"
    >
      {pending ? 'Salvando...' : 'Salvar Alterações'}
    </button>
  );
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditMoviePage({ params }: PageProps) {
  const [movie, setMovie] = useState<Movie & { genres: Genre[] } | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  const [state, formAction] = useActionState(updateMovieAction, undefined);


  useEffect(() => {
    async function fetchData() {
      const { id } = await params;
      const movieId = Number(id);
      const movieData = await getMovieByIdAction(movieId);
      const genresData = await getGenresAction();
      setMovie(movieData);
      setGenres(genresData);
      if (movieData?.poster_path) {
        setImagePreviewUrl(movieData.poster_path);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [params]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }
  };

  useEffect(() => {
    if (state?.message === 'Filme atualizado com sucesso!') {
      alert(state.message);
      if (movie) {
        router.push(`/movies/${movie.id}/${slugify(movie.title)}`);
      }
    }
  }, [state, router, movie]);

  if (isLoading) {
    return <div className="text-center text-white">Carregando...</div>;
  }

  if (!movie) {
    return <div className="text-center text-white">Filme não encontrado.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen mt-4 mb-4">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white">Editar Filme</h1>
        <form action={formAction} className="space-y-6" encType="multipart/form-data">
          <input type="hidden" name="id" value={movie.id} />
          <div>
            <label htmlFor="title" className="text-sm font-medium text-slate-300 block mb-2">Título</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={movie.title}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="poster_path" className="text-sm font-medium text-slate-300 block mb-2">Imagem do Pôster</label>
            <input
              id="poster_path"
              name="poster_path"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {imagePreviewUrl && (
              <div className="mt-4 flex justify-center">
                <NextImage 
                  src={imagePreviewUrl}
                  alt="Pré-visualização do Pôster"
                  className="max-w-full h-auto rounded-md"
                  width={229} height={288}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="original_title" className="text-sm font-medium text-slate-300 block mb-2">Título Original</label>
            <input
              id="original_title"
              name="original_title"
              type="text"
              required
              defaultValue={movie.original_title || ''}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="release_date" className="text-sm font-medium text-slate-300 block mb-2">Data de Lançamento</label>
            <input
              id="release_date"
              name="release_date"
              type="date"
              required
              defaultValue={movie.release_date ? new Date(movie.release_date).toISOString().split('T')[0] : ''}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="budget" className="text-sm font-medium text-slate-300 block mb-2">Orçamento</label>
            <input
              id="budget"
              name="budget"
              type="number"
              min="0"
              required
              defaultValue={movie.budget || 0}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="overview" className="text-sm font-medium text-slate-300 block mb-2">Descrição</label>
            <textarea
              id="overview"
              name="overview"
              rows={4}
              required
              defaultValue={movie.overview || ''}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label htmlFor="durationInMinutes" className="text-sm font-medium text-slate-300 block mb-2">Duração (minutos)</label>
            <input
              id="durationInMinutes"
              name="durationInMinutes"
              type="number"
              min="1"
              required
              defaultValue={movie.durationInMinutes}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Gêneros</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {genres.map((genre) => (
                <div key={genre.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`genre-${genre.id}`}
                    name="genres"
                    value={genre.id}
                    defaultChecked={movie.genres.some(g => g.id === genre.id)}
                    className="h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <label htmlFor={`genre-${genre.id}`} className="ml-2 block text-sm text-gray-300">
                    {genre.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {state?.message && state.message !== 'Filme atualizado com sucesso!' && (
            <p className="text-sm text-red-400 text-center">{state.message}</p>
          )}
          
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
