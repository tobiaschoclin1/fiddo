# Configuración de Google OAuth en Fiddo

Este documento explica cómo configurar la autenticación con Google en la aplicación Fiddo.

## Requisitos

- Una cuenta de Google
- Acceso a Google Cloud Console

## Pasos para configurar Google OAuth

### 1. Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ (opcional pero recomendado)

### 2. Configurar la Pantalla de Consentimiento OAuth

1. En el menú lateral, ve a **APIs y servicios** > **Pantalla de consentimiento de OAuth**
2. Selecciona **Externo** (o **Interno** si es para una organización Google Workspace)
3. Completa la información requerida:
   - Nombre de la aplicación: `Fiddo`
   - Correo electrónico de asistencia
   - Dominios autorizados (si aplica)
4. Agrega los scopes necesarios:
   - `userinfo.email`
   - `userinfo.profile`
5. Guarda y continúa

### 3. Crear Credenciales OAuth 2.0

1. Ve a **APIs y servicios** > **Credenciales**
2. Haz clic en **Crear credenciales** > **ID de cliente de OAuth 2.0**
3. Selecciona **Aplicación web**
4. Configura:
   - **Nombre**: `Fiddo Web Client`
   - **Orígenes de JavaScript autorizados**:
     - `http://localhost:3000` (desarrollo)
     - `https://tu-dominio.com` (producción)
   - **URIs de redireccionamiento autorizados**:
     - `http://localhost:3000/api/auth/callback/google` (desarrollo)
     - `https://tu-dominio.com/api/auth/callback/google` (producción)
5. Haz clic en **Crear**
6. Copia el **Client ID** y **Client Secret**

### 4. Configurar Variables de Entorno

Crea o actualiza tu archivo `.env` local con las siguientes variables:

```env
# NextAuth
NEXTAUTH_SECRET="genera-un-secret-aleatorio-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="tu-client-id-de-google.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-client-secret-de-google"
```

Para generar `NEXTAUTH_SECRET`, ejecuta:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Ejecutar Migraciones de Base de Datos

La configuración de Google OAuth requiere nuevas tablas en la base de datos (Account, Session, VerificationToken):

```bash
npx prisma migrate deploy
```

O en desarrollo:
```bash
npx prisma migrate dev
```

### 6. Reiniciar el Servidor de Desarrollo

```bash
npm run dev
```

## Uso

Una vez configurado, los usuarios podrán:

1. Hacer clic en "Continuar con Google" en las páginas de login o registro
2. Autenticarse con su cuenta de Google
3. Ser redirigidos automáticamente al dashboard

## Producción

Para producción, asegúrate de:

1. Actualizar `NEXTAUTH_URL` con tu dominio de producción
2. Agregar los URIs de producción a las credenciales de Google OAuth
3. Usar variables de entorno seguras (no incluir archivos `.env` en el repositorio)
4. Considerar cambiar el tipo de audiencia de OAuth a "Interno" si es para una organización

## Solución de Problemas

### Error: "redirect_uri_mismatch"
- Verifica que el URI de redirección en Google Cloud Console coincida exactamente con `{NEXTAUTH_URL}/api/auth/callback/google`

### Error: "Invalid client_id"
- Verifica que `GOOGLE_CLIENT_ID` esté configurado correctamente
- Asegúrate de que las credenciales no estén vencidas o revocadas

### Error: "Database error"
- Asegúrate de haber ejecutado las migraciones de Prisma
- Verifica que la base de datos esté corriendo y accesible

## Más Información

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
