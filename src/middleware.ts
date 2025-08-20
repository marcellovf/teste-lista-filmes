import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateSession } from './lib/auth';

// Rotas que não exigem autenticação
const publicRoutes = ['/register', '/api/verify'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica se a rota é pública
  const isPublicRoute = pathname === '/' || publicRoutes.some(route => pathname.startsWith(route));

  // Obtém a sessão do usuário
  const cookieStore = await cookies();
  const session = cookieStore.get('session')
  if (isPublicRoute) {
    // Se o usuário está logado e tenta acessar uma rota pública (ex: login), redireciona para /movies
    if (session && (pathname === '/' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/movies', request.url));
    }
  } else {
    // Se a rota não é pública e o usuário não está logado, redireciona para o login
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Atualiza a sessão para estender a validade do cookie
    await updateSession(request);
  }

  return NextResponse.next();
}

// Configuração do matcher para definir quais rotas o middleware deve observar
export const config = {
  matcher: [
    /*
     * Corresponde a todas as rotas, exceto as que começam com:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagem)
     * - favicon.ico (ícone)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
