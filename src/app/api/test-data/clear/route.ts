import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Los datos de prueba están en localStorage del cliente
    // Este endpoint solo confirma que el usuario está autenticado
    return NextResponse.json({
      success: true,
      message: 'Datos de prueba eliminados correctamente',
    });
  } catch (error) {
    console.error('Error eliminando datos de prueba:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
