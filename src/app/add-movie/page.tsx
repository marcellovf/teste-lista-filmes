'use client';

import { useActionState } from 'react';    
import { useFormStatus } from 'react-dom';
import { addMovieAction } from '@/app/actions';
import { useEffect, useState } from 'react';
import { Genre } from '@prisma/client';
import { useRouter } from 'next/navigation';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      aria-disabled={pending}
      className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-wait"
    >
      {pending ? 'Adicionando...' : 'Adicionar Filme'}
    </button>
  );
}

export default function AddMoviePage() {
  const initialState = { message: null, errors: {} };
  const [state, formAction] = useActionState(addMovieAction, initialState);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const targetWidth = 229;
          const targetHeight = 336;

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Calculate aspect ratios
          const imgAspectRatio = img.width / img.height;
          const canvasAspectRatio = targetWidth / targetHeight;

          let sx, sy, sWidth, sHeight; // Source rectangle
          let dx, dy, dWidth, dHeight; // Destination rectangle

          if (imgAspectRatio > canvasAspectRatio) {
            // Image is wider than canvas, crop horizontally
            sHeight = img.height;
            sWidth = img.height * canvasAspectRatio;
            sx = (img.width - sWidth) / 2;
            sy = 0;
          } else {
            // Image is taller than canvas, crop vertically
            sWidth = img.width;
            sHeight = img.width / canvasAspectRatio;
            sx = 0;
            sy = (img.height - sHeight) / 2;
          }

          ctx?.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);
          setImagePreviewUrl(canvas.toDataURL('image/jpeg', 0.9)); // Use JPEG for consistency with backend
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }
  };

  useEffect(() => {
    // Fetch genres from the server
    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/genres'); //API Route
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (state.message === 'Filme adicionado com sucesso!') {
      alert(state.message);
      router.push('/movies'); // Redireciona para a lista de filmes
    }
  }, [state.message, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-slate-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white">Adicionar Novo Filme</h1>
        <form action={formAction} className="space-y-6" encType="multipart/form-data">
          <div>
            <label htmlFor="title" className="text-sm font-medium text-slate-300 block mb-2">Título</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {state.errors?.title && <p className="text-sm text-red-400 mt-1">{state.errors.title}</p>}
          </div>

          <div>
            <label htmlFor="poster_path" className="text-sm font-medium text-slate-300 block mb-2">Imagem do Pôster</label>
            <input
              id="poster_path"
              name="poster_path"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {state.errors?.poster_path && <p className="text-sm text-red-400 mt-1">{state.errors.poster_path}</p>}
            {imagePreviewUrl && (
              <div className="mt-4 flex justify-center">
                <img src={imagePreviewUrl} alt="Pré-visualização do Pôster" className="max-w-full h-auto rounded-md" style={{ maxWidth: '229px', maxHeight: '288px' }} />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="release_year" className="text-sm font-medium text-slate-300 block mb-2">Ano de Lançamento</label>
            <input
              id="release_year"
              name="release_year"
              type="number"
              min="1800"
              max="2100"
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {state.errors?.release_year && <p className="text-sm text-red-400 mt-1">{state.errors.release_year}</p>}
          </div>

          <div>
            <label htmlFor="durationInMinutes" className="text-sm font-medium text-slate-300 block mb-2">Duração (minutos)</label>
            <input
              id="durationInMinutes"
              name="durationInMinutes"
              type="number"
              min="1"
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {state.errors?.durationInMinutes && <p className="text-sm text-red-400 mt-1">{state.errors.durationInMinutes}</p>}
          </div>

          <div>
            <label htmlFor="genres" className="text-sm font-medium text-slate-300 block mb-2">Gêneros</label>
            <select
              id="genres"
              name="genres"
              multiple
              required
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 h-32"
            >
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
            {state.errors?.genres && <p className="text-sm text-red-400 mt-1">{state.errors.genres}</p>}
          </div>

          {state.message && state.message !== 'Filme adicionado com sucesso!' && (
            <p className="text-sm text-red-400 text-center">{state.message}</p>
          )}
          
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}