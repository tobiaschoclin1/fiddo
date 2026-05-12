import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
  // Obtener la URL base desde las variables de entorno
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // Obtener sesión de NextAuth
  const session = await auth();

  // --- LOG DE DEBUGGING MEJORADO ---
  console.log('🔍 CALLBACK MERCADOLIBRE - URL completa:', request.url);
  console.log('🔍 CALLBACK MERCADOLIBRE - Variables de entorno:');
  console.log('  - MERCADOLIBRE_APP_ID:', process.env.MERCADOLIBRE_APP_ID);
  console.log('  - MERCADOLIBRE_REDIRECT_URI:', process.env.MERCADOLIBRE_REDIRECT_URI);
  console.log('  - NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

  console.log('📝 Verificando parámetros en el callback:', {
    hasCode: !!code,
    hasState: !!state,
    hasSession: !!session?.user?.email,
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

  if (!session?.user?.email) {
    console.error('❌ Falta sesión del usuario');
    return NextResponse.redirect(`${baseUrl}/dashboard?error=MissingSession`);
  }

  try {
    console.log('🔄 Verificando state y recuperando code verifier...');

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      console.error('❌ Usuario no encontrado');
      return NextResponse.redirect(`${baseUrl}/dashboard?error=UserNotFound`);
    }

    const userId = user.id;

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

    // Permitir múltiples usuarios de Fiddo conectados a la misma cuenta de MercadoLibre
    console.log('✅ Múltiples usuarios pueden conectarse a la misma cuenta de MercadoLibre');

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
  }
}

export async function POST(request: Request) {
  return GET(request);
}
