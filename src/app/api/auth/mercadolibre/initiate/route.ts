import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = crypto.randomBytes(length);
  return Array.from(values)
    .map((x) => charset[x % charset.length])
    .join('');
}

function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generateCodeChallenge(codeVerifier: string): string {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  return base64UrlEncode(hash);
}

export async function GET() {
  try {
    console.log('🎯 [Server] Iniciando flujo OAuth de MercadoLibre...');

    // Verificar autenticación
    const session = await auth();
    if (!session?.user?.email) {
      console.error('❌ [Server] Usuario no autenticado');
      return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      console.error('❌ [Server] Usuario no encontrado');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('✅ [Server] Usuario encontrado:', user.id);

    // Generar code verifier y challenge
    const codeVerifier = generateRandomString(128);
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateRandomString(32);

    console.log('✅ [Server] Code verifier y state generados');

    // Guardar en base de datos
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await prisma.oAuthState.create({
      data: {
        state,
        codeVerifier,
        userId: user.id,
        expiresAt,
      },
    });

    console.log('✅ [Server] Code verifier guardado en BD');

    // Construir URL de autorización
    const appId = process.env.MERCADOLIBRE_APP_ID;
    const redirectUri = process.env.MERCADOLIBRE_REDIRECT_URI;

    if (!appId || !redirectUri) {
      console.error('❌ [Server] Faltan variables de entorno de MercadoLibre');
      return NextResponse.json({ error: 'MercadoLibre configuration missing' }, { status: 500 });
    }

    const authUrl = new URL('https://auth.mercadolibre.com.ar/authorization');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', appId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('state', state);

    console.log('🔗 [Server] Redirigiendo a:', authUrl.toString());

    // Redirección desde el servidor
    return NextResponse.redirect(authUrl.toString());

  } catch (error) {
    console.error('❌ [Server] Error en initiate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
