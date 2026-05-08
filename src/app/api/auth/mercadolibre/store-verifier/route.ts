import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { codeVerifier, state } = await request.json();

    if (!codeVerifier || !state) {
      return NextResponse.json({ error: 'Code verifier and state are required' }, { status: 400 });
    }

    // Obtener sesión de NextAuth
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Guardar el code verifier con el state como clave y el userId
    // Expira en 10 minutos
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.oAuthState.create({
      data: {
        state,
        codeVerifier,
        userId: user.id,
        expiresAt,
      },
    });

    console.log('✅ Code verifier guardado para state:', state);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error storing code verifier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
