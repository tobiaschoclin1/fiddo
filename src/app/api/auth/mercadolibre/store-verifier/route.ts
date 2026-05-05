import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { codeVerifier, state } = await request.json();

    if (!codeVerifier || !state) {
      return NextResponse.json({ error: 'Code verifier and state are required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(sessionToken, secret);
    const userId = payload.userId as string;

    // Guardar el code verifier con el state como clave y el userId
    // Expira en 10 minutos
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.oAuthState.create({
      data: {
        state,
        codeVerifier,
        userId,
        expiresAt,
      },
    });

    console.log('✅ Code verifier guardado para state:', state);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error storing code verifier:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
