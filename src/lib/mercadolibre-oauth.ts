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

export async function initiateMLOAuth(): Promise<void> {
  try {
    console.log('🎯 Iniciando flujo OAuth de MercadoLibre...');
    // 1. Generate code verifier and challenge
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // 2. Store code verifier in sessionStorage (más confiable que cookies para OAuth)
    sessionStorage.setItem('ml_pkce_verifier', codeVerifier);

    // 3. Generate state parameter for CSRF protection
    const state = generateRandomString(32);
    sessionStorage.setItem('ml_oauth_state', state);

    // 4. Store code verifier on server with state as key
    console.log('📤 Guardando code verifier en el servidor...');
    const storeResponse = await fetch('/api/auth/mercadolibre/store-verifier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codeVerifier, state }),
    });

    if (!storeResponse.ok) {
      const errorData = await storeResponse.json();
      console.error('❌ Error guardando code verifier:', errorData);
      throw new Error(errorData.error || 'Error storing code verifier');
    }

    console.log('✅ Code verifier guardado exitosamente');

    // 5. Build authorization URL
    const appId = process.env.NEXT_PUBLIC_MERCADOLIBRE_APP_ID;
    const redirectUri = process.env.NEXT_PUBLIC_MERCADOLIBRE_REDIRECT_URI;

    console.log('🔧 Variables de entorno:', {
      appId: appId ? '✅ Definida' : '❌ No definida',
      redirectUri: redirectUri ? '✅ Definida' : '❌ No definida',
    });

    if (!appId || !redirectUri) {
      throw new Error('Faltan variables de entorno de MercadoLibre');
    }

    const authUrl = new URL('https://auth.mercadolibre.com.ar/authorization');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', appId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('state', state);

    console.log('🔗 Redirigiendo a MercadoLibre:', authUrl.toString());

    // 6. Redirect to MercadoLibre authorization page
    console.log('🚀 Ejecutando redirección...');

    // Usar setTimeout para asegurar que el fetch se complete
    // antes de que el navegador cancele requests pendientes
    setTimeout(() => {
      window.location.assign(authUrl.toString());
    }, 100);

    console.log('⏳ Redirección programada');
  } catch (error) {
    console.error('❌ Error initiating MercadoLibre OAuth:', error);
    alert(`Error conectando a MercadoLibre: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    throw error;
  }
}
