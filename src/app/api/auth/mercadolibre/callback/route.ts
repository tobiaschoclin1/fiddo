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
  const state = searchParams.get('state');
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session_token')?.value;

  // --- LOG DE DEBUGGING MEJORADO ---
  console.log('🔍 CALLBACK MERCADOLIBRE - URL completa:', request.url);
  console.log('🔍 CALLBACK MERCADOLIBRE - Variables de entorno:');
  console.log('  - MERCADOLIBRE_APP_ID:', process.env.MERCADOLIBRE_APP_ID);
  console.log('  - MERCADOLIBRE_REDIRECT_URI:', process.env.MERCADOLIBRE_REDIRECT_URI);
  console.log('  - NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

  console.log('📝 Verificando parámetros en el callback:', {
    hasCode: !!code,
    hasState: !!state,
    hasSessionToken: !!sessionToken,
    codeLength: code?.length,
    stateLength: state?.length,
  });
  // --- FIN DEL LOG MEJORADO ---

  // Validaciones iniciales con error específico
  if (!code) {
    console.error('❌ Falta código de autorización');
    return NextResponse.redirect(`${baseUrl}/dashboard?error=MissingCode`);
  }

  if (!state) {
    console.error('❌ Falta state parameter');
    return NextResponse.redirect(`${baseUrl}/dashboard?error=MissingState`);
  }

  if (!sessionToken) {
    console.error('❌ Falta sesión del usuario');
    return NextResponse.redirect(`${baseUrl}/dashboard?error=MissingSession`);
  }

  try {
    console.log('🔄 Verificando state y recuperando code verifier...');

    // Verificar JWT y obtener userId
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(sessionToken, secret);
    const userId = payload.userId as string;

    // Recuperar el code verifier desde la base de datos usando el state
    const oauthState = await prisma.oAuthState.findUnique({
      where: { state },
    });

    if (!oauthState) {
      console.error('❌ State inválido o expirado');
      return NextResponse.redirect(`${baseUrl}/dashboard?error=InvalidState`);
    }

    if (oauthState.userId !== userId) {
      console.error('❌ State no coincide con el usuario actual');
      await prisma.oAuthState.delete({ where: { state } });
      return NextResponse.redirect(`${baseUrl}/dashboard?error=UserMismatch`);
    }

    if (oauthState.expiresAt < new Date()) {
      console.error('❌ State expirado');
      await prisma.oAuthState.delete({ where: { state } });
      return NextResponse.redirect(`${baseUrl}/dashboard?error=ExpiredState`);
    }

    const codeVerifier = oauthState.codeVerifier;

    // Eliminar el state usado (one-time use)
    await prisma.oAuthState.delete({ where: { state } });

    console.log('✅ State verificado, code verifier recuperado');
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
    console.log('✅ TOKENS DE MERCADO LIBRE RECIBIDOS:', {
      user_id: tokens.user_id,
      expires_in: tokens.expires_in,
    });

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

    return NextResponse.redirect(`${baseUrl}/dashboard?success=true`);

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
