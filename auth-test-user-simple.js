// Autenticar test user con PKCE
const testUsers = require('./test-users.json');

console.log('🔐 AUTENTICAR TEST USER VENDEDOR\n');
console.log('1. Abre esta URL en modo incógnito:\n');
console.log('   https://fiddo-app.vercel.app/api/test-auth/start\n');
console.log('2. Login con estas credenciales:\n');
console.log(`   Email: ${testUsers.seller.email}`);
console.log(`   Password: ${testUsers.seller.password}\n`);
console.log('3. Copia el Access Token que aparece en la página\n');
