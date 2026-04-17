# 🐕 Fiddo - Gestor de Mercado Libre

Fiddo es una aplicación web de gestión de ventas en Mercado Libre. Te permite administrar productos, clientes, órdenes y promociones de forma centralizada.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js 18+** - [Descargar](https://nodejs.org)
- **Docker Desktop** - [Descargar](https://www.docker.com/products/docker-desktop)
- **Git** - Para clonar el repositorio

## 🚀 Instalación Rápida

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tobiaschoclin1/mercadoLibre.git
cd mercadoLibre/tobias-app
```

### 2️⃣ Instalar Dependencias

```bash
npm install
```

### 3️⃣ Configurar Variables de Entorno

Crea dos archivos en la raíz del proyecto:

**`.env`** (para Prisma):
```
DATABASE_URL="postgresql://user_tobias:password_segura@localhost:5432/tobias_app_db"
```

**`.env.local`** (para Next.js):
```
DATABASE_URL="postgresql://user_tobias:password_segura@localhost:5432/tobias_app_db"
JWT_SECRET="tu_secret_key_super_segura_aqui"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_MERCADOLIBRE_APP_ID="tu_app_id_aqui"
NEXT_PUBLIC_MERCADOLIBRE_REDIRECT_URI="http://localhost:3000/api/auth/mercadolibre/callback"
```

### 4️⃣ Iniciar la Base de Datos

```bash
# Abre Docker Desktop (desde Applications en macOS)
# Espera a que esté completamente iniciado

# Luego levanta la base de datos
docker-compose up -d

# Verifica que está corriendo
docker-compose ps
```

### 5️⃣ Ejecutar Migraciones

```bash
npx prisma migrate deploy
```

### 6️⃣ Iniciar la Aplicación

```bash
npm run dev
```

¡Listo! 🎉 La app está corriendo en **http://localhost:3000**

---

## 📱 Cómo Usar

### Registrarse
1. Ve a http://localhost:3000
2. Haz clic en "Crear una Cuenta"
3. Completa el formulario con tu email y contraseña

### Conectar Mercado Libre
1. Ve al Dashboard
2. Haz clic en "Conectar con MercadoLibre"
3. Autoriza el acceso a tu cuenta

### Gestionar Productos
- Ve a la sección **Productos**
- Aplica promociones con descuentos personalizados
- Copia y comparte los links de promoción

### Enviar Mensajes a Clientes
- Ve a la sección **Compradores**
- Filtra por cantidad de compras o provincia
- Envía mensajes individuales o masivos

---

## 🛠️ Comandos Útiles

```bash
# Iniciar en desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Correr la versión producción
npm start

# Linting
npm run lint

# Ver Prisma Studio (interfaz visual de la BD)
npx prisma studio

# Resetear la BD (borra todos los datos - solo en desarrollo)
npx prisma migrate reset

# Ver logs de la BD en Docker
docker-compose logs db

# Detener la BD
docker-compose down
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/                 # Rutas de API
│   │   ├── auth/           # Autenticación
│   │   ├── customers/      # Gestión de clientes
│   │   ├── products/       # Gestión de productos
│   │   └── promotions/     # Gestión de promociones
│   ├── login/              # Página de login
│   ├── register/           # Página de registro
│   └── (dashboard)/        # Dashboard principal
├── components/             # Componentes React reutilizables
└── middleware.ts           # Middleware de autenticación
prisma/
├── schema.prisma           # Definición de base de datos
└── migrations/             # Historial de cambios en la BD
```

---

## 🔧 Tecnologías Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **Prisma** - ORM para base de datos
- **PostgreSQL** - Base de datos
- **Tailwind CSS** - Estilos
- **Docker** - Containerización

---

## 🐛 Solución de Problemas

### Error: "docker: command not found"
→ Asegúrate de que Docker Desktop esté abierto e inicializado

### Error: "postgres connection refused"
→ Ejecuta `docker-compose up -d` para levantar la BD

### Error: "tiendanubeStoreId does not exist"
→ Ejecuta `npx prisma migrate reset --force`

### Puerto 3000 ya en uso
→ Cambia el puerto en `package.json` en el script `dev` a otro puerto, ej: `next dev -p 3001`

---

## 📧 Soporte

Si tienes problemas, abre un issue en el repositorio de GitHub.

---

## 📄 Licencia

Este proyecto es privado.
