"use client";

export default function TestEnvPage() {
  const appId = process.env.NEXT_PUBLIC_MERCADOLIBRE_APP_ID;
  const redirectUri = process.env.NEXT_PUBLIC_MERCADOLIBRE_REDIRECT_URI;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#1a1a1a', color: '#fff', minHeight: '100vh' }}>
      <h1>Environment Variables Test</h1>
      <div style={{ marginTop: '20px', backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
        <h2>MercadoLibre Config:</h2>
        <p><strong>NEXT_PUBLIC_MERCADOLIBRE_APP_ID:</strong> {appId || '❌ NOT DEFINED'}</p>
        <p><strong>NEXT_PUBLIC_MERCADOLIBRE_REDIRECT_URI:</strong> {redirectUri || '❌ NOT DEFINED'}</p>
        <p><strong>NEXT_PUBLIC_APP_URL:</strong> {appUrl || '❌ NOT DEFINED'}</p>
      </div>

      {appId && redirectUri && (
        <div style={{ marginTop: '20px', backgroundColor: '#2a2a2a', padding: '20px', borderRadius: '8px' }}>
          <h2>Generated OAuth URL:</h2>
          <p style={{ wordBreak: 'break-all', fontSize: '12px' }}>
            {`https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}`}
          </p>
        </div>
      )}
    </div>
  );
}
