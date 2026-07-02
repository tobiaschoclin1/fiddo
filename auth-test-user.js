// Autenticar test user usando Vercel
const APP_ID = '2754056481994256';
const REDIRECT_URI = 'https://fiddo-app.vercel.app/api/test-auth/callback';
const testUsers = require('./test-users.json');

console.log('🔐 AUTENTICAR TEST USER VENDEDOR\n');
console.log('1. Abre esta URL en modo incógnito:\n');
console.log(`https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}\n`);
console.log('2. Login con estas credenciales:\n');
console.log(`   Email: ${testUsers.seller.email}`);
console.log(`   Password: ${testUsers.seller.password}\n`);
console.log('3. Copia el Access Token que aparece en la página\n');
console.log('4. Ejecuta: node save-seller-token.js "ACCESS_TOKEN_COPIADO"\n');
