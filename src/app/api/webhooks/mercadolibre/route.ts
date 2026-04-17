// src/app/api/webhooks/mercadolibre/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('📩 Webhook recibido de MercadoLibre:', JSON.stringify(body, null, 2));

    // MercadoLibre envía diferentes tipos de notificaciones
    const { topic, resource } = body;

    // Responder rápidamente a ML (importante)
    // El procesamiento real se haría de forma asíncrona

    switch (topic) {
      case 'orders_v2':
        console.log('🛒 Nueva orden recibida:', resource);
        // TODO: Procesar nueva orden
        break;

      case 'messages':
        console.log('💬 Nuevo mensaje recibido:', resource);
        // TODO: Procesar nuevo mensaje
        break;

      case 'items':
        console.log('📦 Cambio en producto:', resource);
        // TODO: Actualizar producto
        break;

      default:
        console.log('ℹ️ Tipo de notificación no manejada:', topic);
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('❌ Error procesando webhook de MercadoLibre:', error);
    // Aún así devolver 200 para que ML no reintente
    return NextResponse.json({ success: false }, { status: 200 });
  } finally {
    await prisma.$disconnect();
  }
}

// MercadoLibre también hace GET para validar la URL
export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
