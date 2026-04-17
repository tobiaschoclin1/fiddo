// Utility functions for MercadoLibre OAuth PKCE flow

function generateRandomString(length: number): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const values = new Uint8Array(length);
  crypto.getRandomValues(values);
  return Array.from(values)
    .map((x) => charset[x % charset.length])
    .join('');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest('SHA-256', data);
}

function base64UrlEncode(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const hashed = await sha256(codeVerifier);
  return base64UrlEncode(hashed);
}

export async function initiateMLOAuth() {
  try {
    // 1. Generate code verifier and challenge
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // 2. Store code verifier in HTTP-only cookie
    await fetch('/api/auth/mercadolibre/store-verifier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codeVerifier }),
    });

    // 3. Build authorization URL
    const appId = process.env.NEXT_PUBLIC_MERCADOLIBRE_APP_ID;
    const redirectUri = process.env.NEXT_PUBLIC_MERCADOLIBRE_REDIRECT_URI;

    const authUrl = new URL('https://auth.mercadolibre.com.ar/authorization');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', appId || '');
    authUrl.searchParams.append('redirect_uri', redirectUri || '');
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');

    // 4. Redirect to MercadoLibre authorization page
    window.location.href = authUrl.toString();
  } catch (error) {
    console.error('Error initiating MercadoLibre OAuth:', error);
    throw error;
  }
}
