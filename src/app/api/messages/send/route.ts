import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        mercadolibreAccessToken: true,
        mercadolibreId: true,
      },
    });

    if (!user?.mercadolibreAccessToken) {
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

    // Enviar mensaje a cada cliente a través de la API de MercadoLibre
    const results = [];

    for (const customerId of customerIds) {
      try {
        // Documentación: https://developers.mercadolibre.com.ar/es_ar/mensajes
        const response = await fetch(`https://api.mercadolibre.com/messages/packs/${customerId}/sellers/${user.mercadolibreId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.mercadolibreAccessToken}`,
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
          const error = await response.json();
          results.push({ customerId, success: false, error: error.message });
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
  } finally {
    await prisma.$disconnect();
  }
}
