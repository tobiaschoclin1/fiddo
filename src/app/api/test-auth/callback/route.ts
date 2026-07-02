import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return new NextResponse(
      `<html><body><h1>❌ Error: ${error}</h1></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  if (!code) {
    return new NextResponse(
      `<html><body><h1>❌ No code received</h1></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Obtener code_verifier de la cookie
  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get('code_verifier')?.value;

  if (!codeVerifier) {
    return new NextResponse(
      `<html><body><h1>❌ Code verifier not found. Start the flow again.</h1></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  // Intercambiar code por access token
  try {
    const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.MERCADOLIBRE_APP_ID!,
        client_secret: process.env.MERCADOLIBRE_SECRET_KEY!,
        code: code,
        code_verifier: codeVerifier,
        redirect_uri: 'https://fiddo-app.vercel.app/api/test-auth/callback',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return new NextResponse(
        `<html><body><h1>❌ Error obteniendo token</h1><pre>${JSON.stringify(tokenData, null, 2)}</pre></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    return new NextResponse(
      `<html>
        <head>
          <style>
            body { font-family: monospace; padding: 40px; background: #1a1a1a; color: #fff; }
            pre { background: #2a2a2a; padding: 20px; border-radius: 8px; overflow-x: auto; }
            h1 { color: #4ade80; }
            .copy-btn { background: #4ade80; color: #000; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-family: monospace; margin: 10px 5px; }
          </style>
        </head>
        <body>
          <h1>✅ Test User Autenticado</h1>
          <h2>Access Token:</h2>
          <pre id="token">${tokenData.access_token}</pre>
          <button class="copy-btn" onclick="navigator.clipboard.writeText('${tokenData.access_token}'); alert('Token copiado!')">📋 Copiar Access Token</button>
          <h2>User ID:</h2>
          <pre>${tokenData.user_id}</pre>
          <h2>Expires in:</h2>
          <pre>${tokenData.expires_in} seconds</pre>
        </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    return new NextResponse(
      `<html><body><h1>❌ Error: ${error}</h1></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}
