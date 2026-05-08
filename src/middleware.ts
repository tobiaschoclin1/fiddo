// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('[Middleware] Checking auth for:', request.nextUrl.pathname);

  // Verificar si existe alguna cookie de NextAuth
  const nextAuthSessionToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  // También aceptar el token personalizado para login manual
  const customToken = request.cookies.get('session_token')?.value;

  console.log('[Middleware] Cookies found:', {
    nextAuth: !!nextAuthSessionToken,
    custom: !!customToken,
    allCookies: request.cookies.getAll().map(c => c.name),
  });

  // Si no hay ninguna sesión, redirigir al login
  if (!nextAuthSessionToken && !customToken) {
    console.log('[Middleware] No session found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si hay sesión de NextAuth, permitir acceso
  if (nextAuthSessionToken) {
    return NextResponse.next();
  }

  // Si solo hay token personalizado, verificarlo
  if (customToken) {
    try {
      const { jwtVerify } = await import('jose');
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(customToken, secret);
      return NextResponse.next();
    } catch (error) {
      console.error('Token personalizado inválido:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session_token');
      return response;
    }
  }

  return NextResponse.redirect(new URL('/login', request.url));
}

// El "matcher" especifica qué rutas debe proteger este middleware
export const config = {
  matcher: '/dashboard/:path*',
};