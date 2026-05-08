// src/middleware.ts
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const { pathname } = req.nextUrl;

  console.log('[Middleware] Path:', pathname, 'Authenticated:', isAuthenticated);
  console.log('[Middleware] Auth object:', req.auth);

  // Proteger rutas del dashboard
  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    console.log('[Middleware] Redirecting to login - no auth');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  console.log('[Middleware] Allowing access');
  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*'],
};