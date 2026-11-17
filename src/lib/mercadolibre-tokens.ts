// src/lib/mercadolibre-tokens.ts
// Devuelve un access token de Mercado Libre vigente, renovándolo con el refresh token si hace falta.
// Los tokens de ML duran ~6 horas, así que cualquier llamada a la API debe pasar por acá.
import { prisma } from '@/lib/prisma';

const REFRESH_MARGIN_MS = 5 * 60 * 1000;

export async function getValidAccessToken(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || !user.mercadolibreRefreshToken || !user.mercadolibreAccessToken) {
    throw new Error('Usuario no conectado a Mercado Libre.');
  }

  const expiresAt = user.mercadolibreTokenExpiresAt?.getTime() ?? 0;
  if (Date.now() < expiresAt - REFRESH_MARGIN_MS) {
    return user.mercadolibreAccessToken;
  }

  const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.MERCADOLIBRE_APP_ID!,
      client_secret: process.env.MERCADOLIBRE_SECRET_KEY!,
      refresh_token: user.mercadolibreRefreshToken,
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error('No se pudo refrescar el token de Mercado Libre.');
  }

  const newTokens = await tokenResponse.json();

  // ML rota el refresh token en cada renovación: hay que guardar el nuevo.
  await prisma.user.update({
    where: { id: userId },
    data: {
      mercadolibreAccessToken: newTokens.access_token,
      mercadolibreRefreshToken: newTokens.refresh_token,
      mercadolibreTokenExpiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
    },
  });

  return newTokens.access_token as string;
}
