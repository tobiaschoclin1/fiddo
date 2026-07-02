// Guardar token del vendedor
const token = process.argv[2];

if (!token) {
  console.error('❌ Debes pasar el token como argumento');
  console.error('Uso: node save-seller-token.js "ACCESS_TOKEN"');
  process.exit(1);
}

const fs = require('fs');
const data = { access_token: token, saved_at: new Date().toISOString() };
fs.writeFileSync('seller-token.json', JSON.stringify(data, null, 2));
console.log('✅ Token guardado en seller-token.json');
console.log('\nAhora puedes crear una orden de prueba.');
