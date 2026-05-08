# 🚀 Configuración URGENTE para Railway - Fiddo App

## ❌ Problema Actual
Error: `https://fiddo-app-production.up.railway.app/api/auth/error`  
**Causa**: Variables de Google OAuth no configuradas en Railway

---

## ✅ SOLUCIÓN - Pasos a seguir

### 1️⃣ Obtener Credenciales de Google OAuth

Ve a: https://console.cloud.google.com/apis/credentials

#### Si NO tienes un proyecto de Google Cloud:
1. Click en "Crear Proyecto"
2. Nombre: "Fiddo App"
3. Click "Crear"
4. Espera a que se cree el proyecto

#### Si YA tienes un proyecto:
1. Selecciona tu proyecto en el dropdown superior
2. Ve a "APIs y servicios" → "Credenciales"
3. Click "Crear credenciales" → "ID de cliente de OAuth 2.0"
4. Si te pide configurar pantalla de consentimiento:
   - Tipo: Externo
   - Nombre de la app: "Fiddo"
   - Email de asistencia: tu email
   - Ámbitos: email, profile, openid
   - Guardar

#### Configurar OAuth Client:
1. Tipo de aplicación: **Aplicación web**
2. Nombre: "Fiddo Railway"
3. **Orígenes autorizados de JavaScript**:
   ```
   https://fiddo-app-production.up.railway.app
   http://localhost:3000
   ```
4. **URIs de redireccionamiento autorizados** (IMPORTANTE):
   ```
   https://fiddo-app-production.up.railway.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
5. Click "Crear"
6. **COPIA** el Client ID y Client Secret que aparecen

---

### 2️⃣ Configurar Variables en Railway

Ve a: https://railway.app/

1. Abre tu proyecto "Fiddo App"
2. Click en tu servicio/deployment
3. Ve a la pestaña "Variables"
4. Click "New Variable" y agrega cada una de estas:

```bash
# Google OAuth (USA LAS QUE COPIASTE DEL PASO 1)
GOOGLE_CLIENT_ID=<tu-client-id-de-google>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<tu-client-secret-de-google>

# NextAuth Configuration
NEXTAUTH_URL=https://fiddo-app-production.up.railway.app
NEXTAUTH_SECRET=d7fccad9672f31903cf2824a5d8dc9db454c4b77c1f09897d613085c7b25d6cf

# JWT Secret (ya existe probablemente)
JWT_SECRET=9187608e034dcf0383e06fff620f0a2e832e302f5dfb41174413aab1da9f7ae5096f20fc9d6f9848fae8b2227b51b9c83b9aceaeb9026de22e62a2c039709486

# Database (verifica que esté configurado)
DATABASE_URL=<tu-postgresql-url>

# App URL (opcional pero recomendado)
NEXT_PUBLIC_APP_URL=https://fiddo-app-production.up.railway.app
```

5. Click "Deploy" o espera a que Railway redespliegue automáticamente

---

### 3️⃣ Verificar el Despliegue

1. Espera 2-3 minutos a que Railway termine el redespliegue
2. Ve a: https://fiddo-app-production.up.railway.app/login
3. Click en "Ingresar con Google"
4. **Debería funcionar** ✅

---

## 🔧 Troubleshooting

### Si sigue fallando:

#### Error: "redirect_uri_mismatch"
- Verifica que en Google Cloud Console tengas **exactamente**:
  ```
  https://fiddo-app-production.up.railway.app/api/auth/callback/google
  ```
- NO debe tener espacios, NO debe tener `/` al final

#### Error: "Server error"
1. En Railway, ve a "Deployments" → Click en el último deployment
2. Ve a "Logs" y busca errores como:
   - "GOOGLE_CLIENT_ID is undefined"
   - "NEXTAUTH_SECRET is required"
3. Verifica que copiaste bien las variables

#### Ver logs en tiempo real:
```bash
# Si tienes Railway CLI instalado
railway logs

# O usa la interfaz web
Railway → Tu Proyecto → Deployments → Ver Logs
```

---

## 📋 Checklist Final

Marca cada item cuando lo completes:

- [ ] Proyecto de Google Cloud creado
- [ ] OAuth Client ID creado en Google Cloud
- [ ] URIs de redireccionamiento configurados en Google
- [ ] GOOGLE_CLIENT_ID copiado a Railway
- [ ] GOOGLE_CLIENT_SECRET copiado a Railway
- [ ] NEXTAUTH_URL configurado en Railway
- [ ] NEXTAUTH_SECRET configurado en Railway
- [ ] Railway redespliegue completado
- [ ] Login con Google funciona ✅

---

## 🆘 ¿Necesitas ayuda?

Si después de seguir todos estos pasos sigue sin funcionar:
1. Copia los logs de Railway
2. Verifica las variables en Railway (están ocultas pero puedes editarlas)
3. Revisa que la URI de callback sea exactamente la correcta
