import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

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
