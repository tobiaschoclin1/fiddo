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

  return new NextResponse(
    `<html>
      <head>
        <style>
          body { font-family: monospace; padding: 40px; background: #1a1a1a; color: #fff; }
          pre { background: #2a2a2a; padding: 20px; border-radius: 8px; overflow-x: auto; font-size: 14px; }
          h1 { color: #4ade80; }
          .copy-btn { background: #4ade80; color: #000; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-family: monospace; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>✅ Code Capturado</h1>
        <h2>Authorization Code:</h2>
        <pre id="code">${code}</pre>
        <button class="copy-btn" onclick="navigator.clipboard.writeText('${code}'); alert('Code copiado!')">📋 Copiar Code</button>
        <h2>Siguiente paso:</h2>
        <p>En tu terminal, ejecuta:</p>
        <pre>node get-token.js "${code}"</pre>
      </body>
    </html>`,
    { headers: { 'Content-Type': 'text/html' } }
  );
}
