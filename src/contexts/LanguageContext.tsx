"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "es" | "en";

interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

const translations: Translations = {
  // Navigation
  dashboard: { es: "Dashboard", en: "Dashboard" },
  productos: { es: "Productos", en: "Products" },
  clientes: { es: "Clientes", en: "Customers" },
  mensajes: { es: "Mensajes", en: "Messages" },
  analytics: { es: "Analytics", en: "Analytics" },
  promociones: { es: "Promociones", en: "Promotions" },
  perfil: { es: "Perfil", en: "Profile" },
  configuracion: { es: "Configuración", en: "Settings" },
  salir: { es: "Salir", en: "Logout" },

  // Dashboard
  welcome: { es: "Bienvenido", en: "Welcome" },
  accountSummary: { es: "Resumen de tu cuenta", en: "Account summary" },
  connectML: { es: "Conecta tu cuenta de MercadoLibre", en: "Connect your MercadoLibre account" },
  connectMLDesc: { es: "Para comenzar a gestionar tus productos y clientes, conecta tu cuenta de MercadoLibre", en: "To manage your products and customers, connect your MercadoLibre account" },
  connectNow: { es: "Conectar ahora", en: "Connect now" },
  products: { es: "Productos", en: "Products" },
  customers: { es: "Clientes", en: "Customers" },
  sales: { es: "Ventas", en: "Sales" },
  revenue: { es: "Ingresos", en: "Revenue" },
  inCatalog: { es: "En catálogo", en: "In catalog" },
  total: { es: "Total", en: "Total" },
  thisMonth: { es: "Este mes", en: "This month" },

  // Actions
  connect: { es: "Conectar", en: "Connect" },
  disconnect: { es: "Desconectar", en: "Disconnect" },
  edit: { es: "Editar", en: "Edit" },
  cancel: { es: "Cancelar", en: "Cancel" },
  save: { es: "Guardar", en: "Save" },
  delete: { es: "Eliminar", en: "Delete" },

  // Messages
  loading: { es: "Cargando...", en: "Loading..." },
  comingSoon: { es: "Próximamente", en: "Coming soon" },
  noProducts: { es: "Aún no tienes productos", en: "You don't have products yet" },
  noCustomers: { es: "Aún no tienes clientes", en: "You don't have customers yet" },
  connectToView: { es: "Para ver tus", en: "To view your" },
  connectMLFirst: { es: "primero debes conectar tu cuenta de MercadoLibre", en: "you must first connect your MercadoLibre account" },

  // Profile
  myProfile: { es: "Mi Perfil", en: "My Profile" },
  manageInfo: { es: "Gestiona tu información personal", en: "Manage your personal information" },
  fullName: { es: "Nombre completo", en: "Full name" },
  email: { es: "Email", en: "Email" },
  memberSince: { es: "Miembro desde", en: "Member since" },
  integrations: { es: "Integraciones", en: "Integrations" },
  connected: { es: "Conectado", en: "Connected" },
  notConnected: { es: "No conectado", en: "Not connected" },
  user: { es: "Usuario", en: "User" },

  // Test data
  insertTestData: { es: "Insertar datos de prueba", en: "Insert test data" },
  insertTestDataDesc: { es: "Inserta o elimina productos, ventas y clientes de ejemplo para probar el sistema", en: "Insert or remove sample products, sales and customers to test the system" },
  insertData: { es: "Insertar datos", en: "Insert data" },
  clearData: { es: "Eliminar datos", en: "Clear data" },
  testData: { es: "Datos de prueba", en: "Test data" },

  // Filters and sorting
  filter: { es: "Filtrar", en: "Filter" },
  sort: { es: "Ordenar", en: "Sort" },
  search: { es: "Buscar", en: "Search" },
  all: { es: "Todos", en: "All" },
  byName: { es: "Por nombre", en: "By name" },
  byPurchases: { es: "Por compras", en: "By purchases" },
  bySpent: { es: "Por gastado", en: "By spent" },

  // Customer filters
  filterByLocation: { es: "Por ubicación", en: "By location" },
  filterByPurchases: { es: "Por cantidad de compras", en: "By number of purchases" },
  moreThan5: { es: "Más de 5 compras", en: "More than 5 purchases" },
  lessThan5: { es: "Menos de 5 compras", en: "Less than 5 purchases" },

  // Messages
  sendMessage: { es: "Enviar mensaje", en: "Send message" },
  selectCustomers: { es: "Seleccionar clientes", en: "Select customers" },
  messageText: { es: "Escribe tu mensaje", en: "Write your message" },
  send: { es: "Enviar", en: "Send" },
  messageSent: { es: "Mensaje enviado", en: "Message sent" },

  // Analytics
  salesOverTime: { es: "Ventas en el tiempo", en: "Sales over time" },
  topProducts: { es: "Productos más vendidos", en: "Top products" },
  customerGrowth: { es: "Crecimiento de clientes", en: "Customer growth" },
  revenueByProduct: { es: "Ingresos por producto", en: "Revenue by product" },
  viewAnalytics: { es: "Visualiza tus análisis", en: "View your analytics" },
  salesAndPerformance: { es: "Ventas y rendimiento", en: "Sales and performance" },
  totalOrders: { es: "Total de pedidos", en: "Total orders" },
  avgOrderValue: { es: "Valor promedio de orden", en: "Average order value" },
  perOrder: { es: "Por orden", en: "Per order" },
  productPerformance: { es: "Rendimiento de productos", en: "Product performance" },
  productDistribution: { es: "Distribución de productos", en: "Product distribution" },
  sold: { es: "Vendidos", en: "Sold" },
  stock: { es: "Stock", en: "Stock" },

  // Error messages
  errorLoadingProfile: { es: "Error cargando perfil", en: "Error loading profile" },
  errorLoadingData: { es: "Error cargando datos", en: "Error loading data" },
  errorInsertingData: { es: "Error insertando datos de prueba", en: "Error inserting test data" },
  errorDeletingData: { es: "Error eliminando datos de prueba", en: "Error deleting test data" },
  errorGeneral: { es: "Error insertando datos", en: "Error inserting data" },
  errorDeletingGeneral: { es: "Error eliminando datos", en: "Error deleting data" },

  // Success messages
  testDataInserted: { es: "Datos de prueba insertados correctamente", en: "Test data inserted successfully" },
  testDataDeleted: { es: "Datos de prueba eliminados correctamente", en: "Test data deleted successfully" },

  // Quick actions
  manageProducts: { es: "Gestionar Productos", en: "Manage Products" },
  manageProductsDesc: { es: "Ver y editar tu catálogo", en: "View and edit your catalog" },
  viewCustomers: { es: "Ver Clientes", en: "View Customers" },
  viewCustomersDesc: { es: "Gestiona tus compradores", en: "Manage your buyers" },
  createPromotion: { es: "Crear Promoción", en: "Create Promotion" },
  createPromotionDesc: { es: "Impulsa tus ventas", en: "Boost your sales" },

  // Messages page
  manageConversations: { es: "Gestiona tus conversaciones", en: "Manage your conversations" },
  sendMessagesToCustomers: { es: "Envía mensajes a tus clientes de MercadoLibre", en: "Send messages to your MercadoLibre customers" },
  toManageMessages: { es: "Para gestionar tus mensajes, primero debes conectar tu cuenta de MercadoLibre", en: "To manage your messages, you must first connect your MercadoLibre account" },
  noCustomersAvailable: { es: "No hay clientes disponibles", en: "No customers available" },
  noName: { es: "Sin nombre", en: "No name" },
  selectedCustomers: { es: "seleccionados", en: "selected" },
  customer: { es: "cliente", en: "customer" },
  customers_: { es: "clientes", en: "customers" },
  writeMessageHere: { es: "Escribe tu mensaje aquí...", en: "Write your message here..." },
  characters: { es: "caracteres", en: "characters" },
  sending: { es: "Enviando...", en: "Sending..." },
  writeMessage: { es: "Escribe un mensaje", en: "Write a message" },
  selectAtLeastOne: { es: "Selecciona al menos un cliente", en: "Select at least one customer" },
  errorSendingMessages: { es: "Error enviando mensajes", en: "Error sending messages" },

  // Products page
  manageCatalog: { es: "Gestiona tu catálogo", en: "Manage your catalog" },
  toViewProducts: { es: "Para ver y gestionar tus productos, primero debes conectar tu cuenta de MercadoLibre", en: "To view and manage your products, you must first connect your MercadoLibre account" },
  connectMercadoLibre: { es: "Conectar MercadoLibre", en: "Connect MercadoLibre" },
  noProductsYet: { es: "Aún no tienes productos", en: "You don't have products yet" },
  publishFirstProduct: { es: "Publica tu primer producto en MercadoLibre para verlo aquí", en: "Publish your first product on MercadoLibre to see it here" },
  productsInCatalog: { es: "productos en catálogo", en: "products in catalog" },
  available: { es: "disponibles", en: "available" },
  active: { es: "Activo", en: "Active" },
  inactive: { es: "Inactivo", en: "Inactive" },

  // Customers page
  manageBuyers: { es: "Gestiona tus compradores", en: "Manage your buyers" },
  whenFirstSale: { es: "Cuando realices tu primera venta, tus clientes aparecerán aquí", en: "When you make your first sale, your customers will appear here" },
  customer_: { es: "Cliente", en: "Customer" },
  email_: { es: "Email", en: "Email" },
  purchases: { es: "Compras", en: "Purchases" },
  totalSpent: { es: "Total gastado", en: "Total spent" },

  // Analytics page
  analyzePerformance: { es: "Analiza tu rendimiento", en: "Analyze your performance" },
  toViewAnalytics: { es: "Para ver tus análisis de ventas, primero debes conectar tu cuenta de MercadoLibre", en: "To view your sales analytics, you must first connect your MercadoLibre account" },
  analyzeSalesPerformance: { es: "Analiza tu rendimiento de ventas", en: "Analyze your sales performance" },
  totalRevenue: { es: "Ingresos totales", en: "Total revenue" },
  totalSales_: { es: "Total de ventas", en: "Total sales" },
  averageValue: { es: "Valor promedio", en: "Average value" },
  vsPreviousMonth: { es: "vs mes anterior", en: "vs previous month" },
  sales_: { es: "Ventas", en: "Sales" },
  revenue_: { es: "Ingresos", en: "Revenue" },
  unitsSold: { es: "Unidades vendidas", en: "Units sold" },
  noDataAvailable: { es: "No hay datos disponibles", en: "No data available" },
  customerDistribution: { es: "Distribución de clientes", en: "Customer distribution" },
  purchasesCount: { es: "compras", en: "purchases" },

  // Month names
  jan: { es: "Ene", en: "Jan" },
  feb: { es: "Feb", en: "Feb" },
  mar: { es: "Mar", en: "Mar" },
  apr: { es: "Abr", en: "Apr" },
  may: { es: "May", en: "May" },
  jun: { es: "Jun", en: "Jun" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved === "es" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
