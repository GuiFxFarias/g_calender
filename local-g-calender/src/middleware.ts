import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const publicRoutes = ['/', '/login', '/register', '/pagamento'];

  const pathname = req.nextUrl.pathname;

  // 🔓 Permitir rotas públicas sem token
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 🔐 Travar acesso à /redefinir-senha se não tiver token na query
  if (pathname === '/redefinir-senha') {
    const urlToken = req.nextUrl.searchParams.get('token');
    if (!urlToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  // 🔐 Bloquear demais rotas privadas se não tiver login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/calendar:path*',
    '/clientes:path*',
    '/dashboard:path*',
    '/redefinir-senha',
    '/mensagens-programadas',
  ],
};
