// Script para crear usuarios de prueba en Mercado Libre
// Uso: node create-test-users.js YOUR_ACCESS_TOKEN

const ACCESS_TOKEN = process.argv[2];

if (!ACCESS_TOKEN) {
  console.error('❌ Debes pasar el ACCESS_TOKEN como argumento');
  console.error('Uso: node create-test-users.js YOUR_ACCESS_TOKEN');
  process.exit(1);
}

async function createTestUser(siteId = 'MLA') {
  try {
    const response = await fetch('https://api.mercadolibre.com/users/test_user', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ site_id: siteId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error, null, 2));
    }

    return await response.json();
  } catch (error) {
    console.error('Error creando test user:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Creando usuarios de prueba en Mercado Libre...\n');

  // Crear vendedor
  console.log('📝 Creando test user VENDEDOR...');
  const seller = await createTestUser('MLA');
  console.log('✅ VENDEDOR creado:');
  console.log(JSON.stringify(seller, null, 2));
  console.log('\n---\n');

  // Crear comprador
  console.log('📝 Creando test user COMPRADOR...');
  const buyer = await createTestUser('MLA');
  console.log('✅ COMPRADOR creado:');
  console.log(JSON.stringify(buyer, null, 2));
  console.log('\n---\n');

  // Guardar en archivo
  const fs = require('fs');
  const testUsers = {
    seller,
    buyer,
    createdAt: new Date().toISOString(),
  };

  fs.writeFileSync('test-users.json', JSON.stringify(testUsers, null, 2));
  console.log('💾 Credenciales guardadas en test-users.json');
  console.log('\n⚠️  IMPORTANTE: Guarda estas credenciales, no se pueden recuperar después');
}

main().catch(console.error);
