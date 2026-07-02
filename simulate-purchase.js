// Simular compra de test user
// Para testing, necesitamos que el comprador test user haga una pregunta primero

const testUsers = require('./test-users.json');
const listing = require('./test-listing.json');

console.log('📋 Para simular mensajes de prueba:\n');
console.log('OPCIÓN 1: Hacer pregunta desde test user comprador');
console.log('---');
console.log('1. Abre en modo incógnito:', listing.permalink);
console.log('2. Login como COMPRADOR:');
console.log(`   Email: ${testUsers.buyer.email}`);
console.log(`   Password: ${testUsers.buyer.password}`);
console.log('3. Haz una pregunta al vendedor');
console.log('\nOPCIÓN 2: Enviar mensaje directo (requiere order_id)');
console.log('---');
console.log('Para enviar mensajes post-venta necesitas un order_id real.');
console.log('Los test users pueden crear órdenes de prueba con tarjetas de prueba.\n');
console.log('💡 TIP: Como tu usuario real ya tiene access token,');
console.log('puedes probar enviando mensajes a clientes reales desde Fiddo.\n');
