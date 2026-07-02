// Listar órdenes del usuario para probar mensajes
const ACCESS_TOKEN = 'APP_USR-2754056481994256-070212-7991aaf186cdb1dbb30678ae33a6f78b-576243586';
const USER_ID = '576243586';

async function listOrders() {
  try {
    const response = await fetch(`https://api.mercadolibre.com/orders/search/seller?seller=${USER_ID}&sort=date_desc&limit=10`, {
      headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error:', data);
      return;
    }

    if (data.results?.length > 0) {
      console.log(`✅ Encontradas ${data.results.length} órdenes:\n`);
      data.results.forEach((order, i) => {
        console.log(`${i + 1}. Order ID: ${order.id}`);
        console.log(`   Buyer: ${order.buyer.id}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Date: ${order.date_created}\n`);
      });

      const fs = require('fs');
      fs.writeFileSync('orders.json', JSON.stringify(data.results, null, 2));
      console.log('💾 Guardado en orders.json');
    } else {
      console.log('❌ No tienes órdenes aún. Necesitas una venta para probar mensajes.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listOrders();
