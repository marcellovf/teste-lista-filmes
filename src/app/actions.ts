'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { encrypt, getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { moviesPerPage } from '@/lib/consts';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

async function uploadFileToS3(file: File) {
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  // Process image with sharp
  const processedImageBuffer = await sharp(fileBuffer)
    .resize(229, 336, {
      fit: 'cover', // Cover ensures the dimensions are filled, cropping if necessary
      position: 'center', // Focus on the most "interesting" part of the image
    })
    .jpeg({ quality: 90 }) // Convert to JPEG with 90% quality
    .toBuffer();

  const fileName = `${uuidv4()}-${file.name.split('.').slice(0, -1).join('.')}.jpeg`; // Ensure .jpeg extension

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: processedImageBuffer,
    ContentType: 'image/jpeg', // Content type will always be jpeg after processing
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
}


// Schemas de validação
const AuthFormSchema = z.object({
  email: z.email({ message: 'Por favor, insira um email válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
});

const RegisterFormSchema = AuthFormSchema.extend({
  name: z.string().min(2, { message: 'O nome deve ter no mínimo 2 caracteres.' }),
});

const AddMovieFormSchema = z.object({
  title: z.string().min(1, { message: 'O título é obrigatório.' }),
  poster_path: z.instanceof(File).optional(),
  release_year: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1800).max(2100, { message: 'Ano de lançamento inválido.' }),
  ),
  durationInMinutes: z.preprocess(
    (val) => Number(val),
    z.number().int().min(1, { message: 'Duração inválida.' }),
  ),
  genres: z.array(z.string()).min(1, { message: 'Selecione pelo menos um gênero.' }),
});

export type FormState = | {
    errors?: {
      email?: string[];
      password?: string[];
      name?: string[];
      title?: string[];
      poster_path?: string[];
      release_year?: string[];
      durationInMinutes?: string[];
      genres?: string[];
    };
    message?: string;
  }
  | undefined;

export async function loginAction(prevState: FormState, formData: FormData) {
  const validatedFields = AuthFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error,
      message: 'Campos inválidos.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { message: 'Credenciais inválidas.' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return { message: 'Credenciais inválidas.' };
    }

    // Cria a sessão
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    const session = await encrypt({ user: { id: user.id, email: user.email }, expires });

    // Salva a sessão no cookie
    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires });
    return {user: user.name}
  } catch (error) {
    console.error('Erro no login:', error)
    return { message: 'Ocorreu um erro no servidor.' };
  }
}

export async function registerAction(prevState: FormState, formData: FormData) {
  const validatedFields = RegisterFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error,
      message: 'Campos inválidos.',
    };
  }

  const { email, password, name } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { message: 'Este email já está em uso.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    return { message: 'Ocorreu um erro no servidor ao criar o usuário.' };
  }

  redirect('/'); // Redireciona para a página de login após o registro
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set('session', '', { expires: new Date(0) });
  redirect('/');
}

// Ação para buscar e filtrar filmes do banco de dados
export async function getMoviesAction(filters: {
  query?: string;
  genre?: string;
  start_year?: string;
  end_year?: string;
  page?: number;
}) {
  const { query, genre, start_year, end_year, page = 1 } = filters;

  const whereClause: any = {
    AND: [],
  };

  if (query) {
    whereClause.AND.push({ title: { contains: query, mode: 'insensitive' } });
  }

  if (genre) {
    whereClause.AND.push({ genres: { some: { id: parseInt(genre) } } });
  }

  if (start_year || end_year) {
    const yearFilter: { gte?: number; lte?: number } = {};
    if (start_year) {
      yearFilter.gte = parseInt(start_year);
    }
    if (end_year) {
      yearFilter.lte = parseInt(end_year);
    }
    whereClause.AND.push({ release_year: yearFilter });
  }

  try {
    const movies = await prisma.movie.findMany({
      where: whereClause,
      include: { genres: true },
      orderBy: { release_year: 'desc' },
      take: moviesPerPage,
      skip: (page - 1) * moviesPerPage,
    });

    const totalMovies = await prisma.movie.count({ where: whereClause });

    return {
      page: page,
      results: movies,
      total_pages: Math.max(1, Math.ceil(totalMovies / moviesPerPage)),
      total_results: totalMovies,
    };

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Falha ao buscar filmes.');
  }
}

export async function addMovieAction(prevState: FormState, formData: FormData) {
  const validatedFields = AddMovieFormSchema.safeParse({
    title: formData.get('title'),
    poster_path: formData.get('poster_path') || undefined,
    release_year: formData.get('release_year'),
    durationInMinutes: formData.get('durationInMinutes'),
    genres: formData.getAll('genres'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error,
      message: 'Campos inválidos.',
    };
  }

  const { title, poster_path, release_year, durationInMinutes, genres } = validatedFields.data;

  // Verifica se o usuário está autenticado
  const session = await getSession();
  if (!session || !session.user) {
    return { message: 'Você precisa estar logado para adicionar filmes.' };
  }

  let s3PosterPath: string | undefined = undefined;

  try {
    if (poster_path instanceof File && poster_path.size > 0) {
      s3PosterPath = await uploadFileToS3(poster_path);
    }

    await prisma.movie.create({
      data: {
        title,
        poster_path: s3PosterPath,
        release_year: parseInt(release_year as string),
        durationInMinutes: parseInt(durationInMinutes as string),
        genres: {
          connect: genres.map(genreId => ({ id: parseInt(genreId) })),
        },
      },
    });

    return { message: 'Filme adicionado com sucesso!' };
  } catch {
    return { message: 'Ocorreu um erro ao adicionar o filme.' };
  }
}

export async function getLoginStatus() {
  const session = await getSession();
  return !!session; // Retorna true se houver sessão, false caso contrário
}
