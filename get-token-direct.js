const APP_ID = '2754056481994256';
const SECRET_KEY = 'oOFpkPM2jczuhbX283m0nVxjVopNfsHn';
const REDIRECT_URI = 'http://localhost:8080/callback';

async function getToken(code) {
  try {
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: APP_ID,
        client_secret: SECRET_KEY,
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error:', data);
      process.exit(1);
    }

    console.log('✅ Access Token obtenido:\n');
    console.log(`Access Token: ${data.access_token}`);
    console.log(`User ID: ${data.user_id}`);
    console.log(`Expires in: ${data.expires_in} seconds\n`);

    const fs = require('fs');
    fs.writeFileSync('seller-token.json', JSON.stringify(data, null, 2));
    console.log('💾 Token guardado en seller-token.json');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

module.exports = { getToken };
