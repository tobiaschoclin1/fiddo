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
  insertTestDataDesc: { es: "Agregar productos, ventas y clientes de ejemplo", en: "Add sample products, sales and customers" },
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
