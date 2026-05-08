#!/usr/bin/env node

/**
 * Script para verificar variables de entorno requeridas
 * Uso: node check-env.js
 */

console.log('\n🔍 Verificando variables de entorno...\n');

const requiredVars = {
  'GOOGLE_CLIENT_ID': '❌ FALTA - Necesario para login con Google',
  'GOOGLE_CLIENT_SECRET': '❌ FALTA - Necesario para login con Google',
  'NEXTAUTH_URL': '❌ FALTA - Debe ser la URL de Railway en producción',
  'NEXTAUTH_SECRET': '❌ FALTA - Necesario para NextAuth',
  'DATABASE_URL': '❌ FALTA - Connection string de la base de datos',
  'JWT_SECRET': '❌ FALTA - Necesario para JWT tokens',
};

const warnings = {
  'NEXT_PUBLIC_APP_URL': '⚠️  OPCIONAL - URL pública de la app',
};

let allGood = true;
let hasWarnings = false;

console.log('📋 Variables REQUERIDAS:\n');

for (const [key, message] of Object.entries(requiredVars)) {
  const value = process.env[key];
  if (!value || value === 'your-client-id.apps.googleusercontent.com' ||
      value === 'your-client-secret' || value.includes('your-')) {
    console.log(`  ${message}`);
    console.log(`     Variable: ${key}\n`);
    allGood = false;
  } else {
    console.log(`  ✅ ${key} está configurado`);
    // Mostrar valor parcial para verificar
    const preview = value.length > 20 ? value.substring(0, 20) + '...' : value;
    console.log(`     Valor: ${preview}\n`);
  }
}

console.log('\n📋 Variables OPCIONALES:\n');

for (const [key, message] of Object.entries(warnings)) {
  const value = process.env[key];
  if (!value) {
    console.log(`  ${message}`);
    console.log(`     Variable: ${key}\n`);
    hasWarnings = true;
  } else {
    console.log(`  ✅ ${key} está configurado`);
    console.log(`     Valor: ${value}\n`);
  }
}

console.log('\n' + '='.repeat(60) + '\n');

if (allGood && !hasWarnings) {
  console.log('✅ ¡Todas las variables están configuradas correctamente!\n');
} else if (allGood) {
  console.log('✅ Variables requeridas OK (hay algunas opcionales sin configurar)\n');
} else {
  console.log('❌ Faltan variables requeridas. La app no funcionará correctamente.\n');
  console.log('📝 Instrucciones:');
  console.log('   1. Copia .env.example a .env.local');
  console.log('   2. Rellena las variables que faltan');
  console.log('   3. Para NEXTAUTH_SECRET y JWT_SECRET, genera uno aleatorio:');
  console.log('      node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"\n');
  console.log('   4. Para producción en Railway, configura las variables en:');
  console.log('      Railway Dashboard → Tu Proyecto → Variables\n');
}

console.log('📖 Más info: lee RAILWAY_SETUP.md\n');
