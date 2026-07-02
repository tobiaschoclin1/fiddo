// Enviar mensaje de prueba
const ACCESS_TOKEN = 'APP_USR-2754056481994256-070212-7991aaf186cdb1dbb30678ae33a6f78b-576243586';
const ORDER_ID = '2000012694313576';

async function sendMessage() {
  try {
    const response = await fetch(`https://api.mercadolibre.com/messages/packs/${ORDER_ID}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: "Hola! Este es un mensaje de prueba desde Fiddo 🐶"
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error:', JSON.stringify(data, null, 2));
      return;
    }

    console.log('✅ Mensaje enviado:\n', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

sendMessage();
