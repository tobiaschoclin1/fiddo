import { NextRequest, NextResponse } from 'next/server';

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
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/test-auth/callback`,
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
          </style>
        </head>
        <body>
          <h1>✅ Test User Autenticado</h1>
          <h2>Access Token:</h2>
          <pre>${tokenData.access_token}</pre>
          <h2>User ID:</h2>
          <pre>${tokenData.user_id}</pre>
          <h2>Expires in:</h2>
          <pre>${tokenData.expires_in} seconds</pre>
          <h2>Full Response:</h2>
          <pre>${JSON.stringify(tokenData, null, 2)}</pre>
          <p>✅ Puedes cerrar esta ventana y copiar el access token.</p>
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
