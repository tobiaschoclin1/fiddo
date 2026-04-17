# Guía de Deploy en Render

## 1. Configurar Base de Datos en Neon

1. Ir a [Neon](https://neon.tech/) y crear cuenta (gratis)
2. Crear un nuevo proyecto
3. Copiar la **DATABASE_URL** (Connection String)
   - Formato: `postgresql://user:password@host/database?sslmode=require`

## 2. Generar JWT Secret

**IMPORTANTE**: Genera una clave secreta para JWT:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado (ejemplo: `a3f8b9c2d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`). Lo necesitarás en el siguiente paso.

## 3. Deploy en Render

### Opción A: Usando render.yaml (Recomendado)
1. Ir a [Render Dashboard](https://dashboard.render.com/)
2. Clic en "New" → "Blueprint"
3. Conectar tu repositorio de GitHub
4. Render detectará automáticamente `render.yaml`
5. **⚠️ Agregar variables de entorno (CRÍTICO):**
   - `DATABASE_URL`: [tu URL de Neon del paso 1]
   - `JWT_SECRET`: [tu clave generada del paso 2]
6. Clic en "Apply"

### Opción B: Manual
1. Ir a [Render Dashboard](https://dashboard.render.com/)
2. Clic en "New" → "Web Service"
3. Conectar tu repositorio de GitHub
4. Configuración:
   - **Name**: fiddo-app
   - **Environment**: Node
   - **Region**: Oregon (o la más cercana)
   - **Branch**: main
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **⚠️ Agregar variables de entorno (CRÍTICO):**
   - `DATABASE_URL`: [tu URL de Neon del paso 1]
   - `JWT_SECRET`: [tu clave generada del paso 2]
6. Clic en "Create Web Service"

## 4. Configurar UptimeRobot

1. Ir a [UptimeRobot](https://uptimerobot.com/) y crear cuenta (gratis)
2. Clic en "+ Add New Monitor"
3. Configuración:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Fiddo App
   - **URL**: [tu URL de Render, ej: https://fiddo-app.onrender.com]
   - **Monitoring Interval**: 5 minutos (plan gratuito)
4. Clic en "Create Monitor"

Esto mantendrá tu app activa haciendo ping cada 5 minutos, evitando que Render la "duerma".

## 5. Verificar Deploy

1. Esperar a que el build termine (puede tardar 5-10 minutos)
2. Visitar la URL de tu app
3. Verificar que la base de datos esté conectada
4. Verificar logs en Render Dashboard si hay errores

## Variables de Entorno Necesarias

### ⚠️ CRÍTICO: Sin estas variables la app NO funcionará

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=tu-clave-secreta-de-minimo-32-caracteres
NODE_ENV=production
```

**Generar `JWT_SECRET`:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Troubleshooting

### ❌ Error 500 al hacer login/registro
**Causa**: Falta `JWT_SECRET` en las variables de entorno
**Solución**: 
1. Ir a Render Dashboard → Tu servicio → Environment
2. Agregar `JWT_SECRET` con una clave aleatoria (ver arriba cómo generarla)
3. Guardar y esperar a que se redeploy automáticamente

### Error de conexión a DB
- Verificar que `DATABASE_URL` incluya `?sslmode=require`
- Verificar que el proyecto de Neon esté activo

### Build falla
- Verificar logs en Render
- Asegurarse de que todas las dependencias estén en `package.json`

### App se duerme
- Verificar que UptimeRobot esté configurado y activo
- El plan gratuito de Render duerme después de 15 min de inactividad
