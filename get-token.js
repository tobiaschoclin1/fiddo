// Script para intercambiar code por access token
// Uso: node get-token.js TG-XXXXX

const APP_ID = '2754056481994256';
const SECRET_KEY = 'oOFpkPM2jczuhbX283m0nVxjVopNfsHn';
const REDIRECT_URI = 'https://fiddo-app.vercel.app/api/auth/mercadolibre/callback';

const code = process.argv[2];

if (!code) {
  console.error('❌ Debes pasar el CODE como argumento');
  console.error('Uso: node get-token.js TG-XXXXX');
  process.exit(1);
}

async function getAccessToken() {
  try {
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: APP_ID,
        client_secret: SECRET_KEY,
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error, null, 2));
    }

    const data = await response.json();
    console.log('✅ Access Token obtenido:\n');
    console.log(JSON.stringify(data, null, 2));

    // Guardar
    const fs = require('fs');
    fs.writeFileSync('seller-token.json', JSON.stringify(data, null, 2));
    console.log('\n💾 Token guardado en seller-token.json');
  } catch (error) {
    console.error('Error:', error);
  }
}

getAccessToken();
