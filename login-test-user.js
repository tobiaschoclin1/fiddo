// Script para obtener Access Token de test user
// Uso: node login-test-user.js

const APP_ID = '2754056481994256';
const SECRET_KEY = 'oOFpkPM2jczuhbX283m0nVxjVopNfsHn';
const REDIRECT_URI = 'https://fiddo-app.vercel.app/api/auth/mercadolibre/callback';

const testUsers = require('./test-users.json');

console.log('🔐 Para obtener el Access Token del VENDEDOR:\n');
console.log('1. Abre esta URL en tu navegador (modo incógnito):');
console.log(`https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`);
console.log('\n2. Login con estas credenciales:');
console.log(`   Email: ${testUsers.seller.email}`);
console.log(`   Password: ${testUsers.seller.password}`);
console.log('\n3. Después de autorizar, copia el "code" de la URL');
console.log('   (la URL será: ...callback?code=TG-XXXXX...)');
console.log('\n4. Ejecuta: node get-token.js CODE_COPIADO');
