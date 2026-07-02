import { NextResponse } from 'next/server';
import crypto from 'crypto';

function base64URLEncode(str: Buffer) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export async function GET() {
  // Generar code_verifier y code_challenge para PKCE
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(
    crypto.createHash('sha256').update(codeVerifier).digest()
  );

  const APP_ID = process.env.MERCADOLIBRE_APP_ID!;
  const REDIRECT_URI = 'https://fiddo-app.vercel.app/api/test-auth/callback';

  const authUrl = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  const response = NextResponse.redirect(authUrl);

  // Guardar code_verifier en cookie
  response.cookies.set('code_verifier', codeVerifier, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600, // 10 minutos
  });

  return response;
}
