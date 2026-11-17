// src/lib/session.ts
// Helper único para obtener el usuario autenticado (NextAuth) en route handlers.
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;
  return prisma.user.findUnique({ where: { email } });
}
