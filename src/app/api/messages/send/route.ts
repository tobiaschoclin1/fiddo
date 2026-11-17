import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { getValidAccessToken } from '@/lib/mercadolibre-tokens';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    if (!user.mercadolibreId || !user.mercadolibreRefreshToken) {
      return NextResponse.json(
        { error: 'No estás conectado a MercadoLibre' },
        { status: 400 }
      );
    }

    const { customerIds, message } = await request.json();

    if (!customerIds || !message) {
      return NextResponse.json(
        { error: 'Faltan parámetros: customerIds y message son requeridos' },
        { status: 400 }
      );
    }

    const accessToken = await getValidAccessToken(user.id);

    // Enviar mensaje a cada cliente a través de la API de MercadoLibre
    const results = [];

    for (const customerId of customerIds) {
      try {
        // Documentación: https://developers.mercadolibre.com.ar/es_ar/mensajes
        const response = await fetch(`https://api.mercadolibre.com/messages/packs/${customerId}/sellers/${user.mercadolibreId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: {
              user_id: user.mercadolibreId,
            },
            to: [{
              user_id: customerId,
              resource: 'orders',
            }],
            text: message,
          }),
        });

        if (response.ok) {
          results.push({ customerId, success: true });
        } else {
          const error = await response.json().catch(() => ({}));
          results.push({ customerId, success: false, error: error.message ?? `HTTP ${response.status}` });
        }
      } catch (error) {
        console.error(`Error enviando mensaje a ${customerId}:`, error);
        results.push({ customerId, success: false, error: 'Error de red' });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    return NextResponse.json({
      success: true,
      message: `Mensajes enviados: ${successCount} exitosos, ${failCount} fallidos`,
      results,
    });
  } catch (error) {
    console.error('Error enviando mensajes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
