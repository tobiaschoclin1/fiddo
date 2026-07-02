// Servidor local para capturar el código OAuth
const http = require('http');

const APP_ID = '2754056481994256';
const REDIRECT_URI = 'http://localhost:8080/callback';

console.log('🔐 PASO 1: Abre esta URL en modo incógnito:\n');
console.log(`https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`);

const testUsers = require('./test-users.json');
console.log('\n📧 Login con (VENDEDOR):');
console.log(`Email: ${testUsers.seller.email}`);
console.log(`Password: ${testUsers.seller.password}\n`);
console.log('⏳ Esperando autorización en http://localhost:8080...\n');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:8080`);

  if (url.pathname === '/callback') {
    const code = url.searchParams.get('code');

    if (code) {
      console.log('✅ Code capturado:', code);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>✅ Autorización exitosa!</h1><p>Puedes cerrar esta ventana.</p>');

      setTimeout(() => {
        server.close();
        console.log('\n🔄 Obteniendo Access Token...');
        require('./get-token-direct.js').getToken(code);
      }, 1000);
    } else {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<h1>❌ Error: No code received</h1>');
      server.close();
    }
  }
});

server.listen(8080);
