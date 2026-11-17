# 🐕 Fiddo - Gestor de MercadoLibre

Aplicación web de gestión de ventas en MercadoLibre. Administra productos, clientes, órdenes y promociones de forma centralizada.

## 🚀 Deployment

**Plataforma:** Render  
**URL:** https://fiddo-app.onrender.com

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
- MongoDB Atlas - Base de datos (Prisma provider `mongodb`)
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

# Sincronizar el esquema con MongoDB (no usa migrate; MongoDB no lo soporta)
npx prisma db push

# Iniciar servidor de desarrollo
npm run dev
```

Servidor en: `http://localhost:3000`

## 🔧 Configuración

Ver `GOOGLE_OAUTH_SETUP.md` para configurar Google Sign-In y MercadoLibre OAuth.

### Variables de Entorno Requeridas

```env
DATABASE_URL=mongodb+srv://...
AUTH_SECRET=...            # obligatorio: NextAuth no funciona sin esto
AUTH_TRUST_HOST=true
NEXTAUTH_URL=https://tu-url.onrender.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MERCADOLIBRE_APP_ID=...
MERCADOLIBRE_SECRET_KEY=...
MERCADOLIBRE_REDIRECT_URI=https://tu-url.onrender.com/api/auth/mercadolibre/callback
NEXT_PUBLIC_APP_URL=https://tu-url.onrender.com
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
