import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  // Obtener la URL base desde las variables de entorno
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get('pkce_code_verifier')?.value;
  const sessionToken = cookieStore.get('session_token')?.value;

  // --- LOG DE DEBUGGING MEJORADO ---
  console.log('🔍 CALLBACK MERCADOLIBRE - URL completa:', request.url);
  console.log('🔍 CALLBACK MERCADOLIBRE - Variables de entorno:');
  console.log('  - MERCADOLIBRE_APP_ID:', process.env.MERCADOLIBRE_APP_ID);
  console.log('  - MERCADOLIBRE_REDIRECT_URI:', process.env.MERCADOLIBRE_REDIRECT_URI);
  console.log('  - NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

  console.log('🍪 Todas las cookies disponibles:');
  cookieStore.getAll().forEach(cookie => {
    console.log(`  ${cookie.name}: ${cookie.value.substring(0, 20)}...`);
  });

  console.log('📝 Verificando parámetros en el callback:', {
    hasCode: !!code,
    hasCodeVerifier: !!codeVerifier,
    hasSessionToken: !!sessionToken,
    codeLength: code?.length,
    codeVerifierLength: codeVerifier?.length,
  });
  // --- FIN DEL LOG MEJORADO ---

  // Validaciones iniciales con error específico
  if (!code) {
    console.error('❌ Falta código de autorización');
    return NextResponse.redirect(`${baseUrl}/dashboard?error=MissingCode`);
  }

  if (!sessionToken) {
    console.error('❌ Falta sesión del usuario');
    return NextResponse.redirect(`${baseUrl}/dashboard?error=MissingSession`);
  }

  if (!codeVerifier) {
    console.error('❌ Falta code verifier PKCE');
    return NextResponse.redirect(`${baseUrl}/dashboard?error=MissingVerifier`);
  }

  try {
    console.log('🔄 Intentando obtener token de MercadoLibre...');

    const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.MERCADOLIBRE_APP_ID!,
        client_secret: process.env.MERCADOLIBRE_SECRET_KEY!,
        code: code,
        redirect_uri: process.env.MERCADOLIBRE_REDIRECT_URI!,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorDetails = await tokenResponse.json();
      console.error('❌ ERROR DE MERCADO LIBRE:', JSON.stringify(errorDetails, null, 2));
      console.error('Status:', tokenResponse.status);
      console.error('Parámetros enviados:', {
        grant_type: 'authorization_code',
        client_id: process.env.MERCADOLIBRE_APP_ID,
        redirect_uri: process.env.MERCADOLIBRE_REDIRECT_URI,
        code_length: code?.length,
        code_verifier_length: codeVerifier?.length,
      });
      return NextResponse.redirect(`${baseUrl}/dashboard?error=TokenError&details=${encodeURIComponent(errorDetails.message || 'Unknown')}`);
    }

    const tokens = await tokenResponse.json();
    console.log('TOKENS DE MERCADO LIBRE RECIBIDOS:', tokens);

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(sessionToken, secret);
    const userId = payload.userId as string;

    const existingMLUser = await prisma.user.findUnique({
      where: { mercadolibreId: tokens.user_id.toString() },
      select: { id: true, email: true }
    });

    if (existingMLUser && existingMLUser.id !== userId) {
      console.log('⚠️ Esta cuenta de MercadoLibre ya está conectada a otro usuario:', existingMLUser.email);
      return NextResponse.redirect(`${baseUrl}/dashboard?error=MLAccountAlreadyLinked`);
    }

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    await prisma.user.update({
      where: { id: userId },
      data: {
        mercadolibreId: tokens.user_id.toString(),
        mercadolibreAccessToken: tokens.access_token,
        mercadolibreRefreshToken: tokens.refresh_token,
        mercadolibreTokenExpiresAt: expiresAt,
      },
    });

    console.log('✅ Tokens de MercadoLibre guardados para el usuario:', userId);

    const response = NextResponse.redirect(`${baseUrl}/dashboard?success=true`);
    response.cookies.set('pkce_code_verifier', '', {
      maxAge: 0,
      path: '/'
    });
    return response;

  } catch (error) {
    console.error('Error en el callback de Mercado Libre:', error);
    return NextResponse.redirect(`${baseUrl}/dashboard?error=TokenError`);
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  return GET(request);
}
