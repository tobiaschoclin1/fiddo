// Crear publicación de prueba
// Uso: node create-listing.js ACCESS_TOKEN

const ACCESS_TOKEN = process.argv[2] || 'APP_USR-2754056481994256-070212-7991aaf186cdb1dbb30678ae33a6f78b-576243586';

async function createListing() {
  try {
    const listing = {
      title: "Test item - Do not offer",
      category_id: "MLA3530",
      price: 1000,
      currency_id: "ARS",
      available_quantity: 1,
      buying_mode: "buy_it_now",
      listing_type_id: "free",
      condition: "new",
      description: { plain_text: "Test item for Fiddo messaging" },
      pictures: [{
        source: "https://placehold.co/600x400/png"
      }],
      attributes: [
        { id: "BRAND", value_name: "Test Brand" },
        { id: "MODEL", value_name: "Test Model" }
      ]
    };

    const response = await fetch('https://api.mercadolibre.com/items', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(listing),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error:', JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log('✅ Publicación creada:\n');
    console.log(`ID: ${data.id}`);
    console.log(`Title: ${data.title}`);
    console.log(`Permalink: ${data.permalink}`);

    const fs = require('fs');
    fs.writeFileSync('test-listing.json', JSON.stringify(data, null, 2));
    console.log('\n💾 Guardado en test-listing.json');
  } catch (error) {
    console.error('Error:', error);
  }
}

createListing();
