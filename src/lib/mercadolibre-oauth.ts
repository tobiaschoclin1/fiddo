// MercadoLibre OAuth helper - Server-side redirect
export function initiateMLOAuth(): void {
  console.log('🎯 Redirigiendo al endpoint de OAuth...');
  // El servidor maneja todo el flujo de OAuth y redirecciona a MercadoLibre
  window.location.href = '/api/auth/mercadolibre/initiate';
}
