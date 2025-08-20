import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(genres);
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    return NextResponse.json({ message: 'Erro ao buscar gêneros.' }, { status: 500 });
  }
}
