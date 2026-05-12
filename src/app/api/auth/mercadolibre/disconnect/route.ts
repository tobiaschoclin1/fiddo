import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Desconectar la cuenta de MercadoLibre limpiando los campos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        mercadolibreId: null,
        mercadolibreAccessToken: null,
        mercadolibreRefreshToken: null,
        mercadolibreTokenExpiresAt: null,
      },
    });

    console.log('✅ Cuenta de MercadoLibre desconectada para usuario:', user.id);

    return NextResponse.json({
      success: true,
      message: 'Cuenta de MercadoLibre desconectada exitosamente'
    });

  } catch (error) {
    console.error('Error al desconectar cuenta de MercadoLibre:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
