# 🐕 Fiddo - Gestor de MercadoLibre

Aplicación web de gestión de ventas en MercadoLibre. Administra productos, clientes, órdenes y promociones de forma centralizada.

## 🚀 Deployment

**Plataforma:** Railway  
**URL:** https://fiddo-app-production.up.railway.app

## ✨ Características

- Dashboard de ventas y estadísticas
- Gestión de productos y inventario
- Administración de órdenes
- Sistema de clientes
- Integración con MercadoLibre OAuth
- Autenticación con Google Sign-In

## 🛠️ Tecnologías

- Next.js 15 - Framework React
- TypeScript - Lenguaje tipado
- Prisma - ORM
- PostgreSQL (Neon) - Base de datos
- NextAuth.js - Autenticación
- Tailwind CSS - Estilos

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev
```

Servidor en: `http://localhost:3000`

## 🔧 Configuración

Ver `GOOGLE_OAUTH_SETUP.md` para configurar Google Sign-In y MercadoLibre OAuth.

### Variables de Entorno Requeridas

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://tu-url.up.railway.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MERCADOLIBRE_APP_ID=...
MERCADOLIBRE_SECRET_KEY=...
NEXT_PUBLIC_APP_URL=https://tu-url.up.railway.app
```

## 📋 Comandos Útiles

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm start            # Iniciar producción
npx prisma studio    # Ver base de datos
npx prisma migrate dev  # Crear migración
```

---

**Built with Next.js ⚡**
