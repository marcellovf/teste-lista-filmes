'use server';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse('Token não fornecido', { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
    const user = await prisma.user.findUnique({ where: { email: decoded.email } });

    if (!user) {
      return new NextResponse('Usuário não encontrado', { status: 404 });
    }

    if (user.isVerified) {
      return new NextResponse('Email já verificado', { status: 400 });
    }

    if (user.verificationExpires && new Date() > new Date(user.verificationExpires)) {
      // Token expirado, apagar usuário
      await prisma.user.delete({ where: { id: user.id } });
      return new NextResponse('Token de verificação expirado. Por favor, registre-se novamente.', { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verificationToken: null, verificationExpires: null },
    });

    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return new NextResponse('Token inválido', { status: 400 });
    }
    console.error('Erro na verificação do token:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}
