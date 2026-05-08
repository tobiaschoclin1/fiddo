# Configuración de Variables de Entorno en Railway

## Problema Actual
El error `https://fiddo-app-production.up.railway.app/api/auth/error` ocurre porque las variables de Google OAuth no están configuradas en Railway.

## Variables Requeridas en Railway

Ve a tu proyecto en Railway → Variables → Add Variable y agrega:

### 1. Google OAuth (OBLIGATORIO)
```bash
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
```

### 2. NextAuth (OBLIGATORIO)
```bash
NEXTAUTH_URL=https://fiddo-app-production.up.railway.app
NEXTAUTH_SECRET=<genera uno nuevo con el comando de abajo>
```

Genera NEXTAUTH_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database (Ya debería estar configurado)
```bash
DATABASE_URL=<tu connection string de PostgreSQL>
```

### 4. JWT Secret (OBLIGATORIO)
```bash
JWT_SECRET=<genera uno nuevo>
```

### 5. App URL (Opcional pero recomendado)
```bash
NEXT_PUBLIC_APP_URL=https://fiddo-app-production.up.railway.app
```

## Configuración de Google OAuth

### Paso 1: Google Cloud Console
1. Ve a https://console.cloud.google.com/apis/credentials
2. Selecciona tu proyecto o crea uno nuevo
3. Ve a "Credentials" → "OAuth 2.0 Client IDs"
4. Edita tu cliente OAuth existente o crea uno nuevo

### Paso 2: Configurar Redirect URIs
Agrega estas URIs autorizadas:
```
https://fiddo-app-production.up.railway.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google (para desarrollo)
```

### Paso 3: Copiar credenciales
- Copia el **Client ID** → Pégalo en Railway como `GOOGLE_CLIENT_ID`
- Copia el **Client Secret** → Pégalo en Railway como `GOOGLE_CLIENT_SECRET`

## Verificación

Después de configurar las variables:
1. Railway debería redesplegar automáticamente
2. Intenta hacer login con Google de nuevo
3. Si sigue fallando, revisa los logs en Railway:
   ```bash
   railway logs
   ```

## Checklist
- [ ] GOOGLE_CLIENT_ID configurado en Railway
- [ ] GOOGLE_CLIENT_SECRET configurado en Railway
- [ ] NEXTAUTH_URL = https://fiddo-app-production.up.railway.app
- [ ] NEXTAUTH_SECRET generado y configurado
- [ ] Redirect URI configurado en Google Cloud Console
- [ ] Redespliegue de Railway completado
