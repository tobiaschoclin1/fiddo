"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { initiateMLOAuth } from "@/lib/mercadolibre-oauth";
import { useLanguage } from "@/contexts/LanguageContext";

interface UserProfile {
  mercadolibre: {
    connected: boolean;
  };
}

interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail?: string;
  available_quantity: number;
  status: string;
}

export default function ProductosPage() {
  const { notify } = useToast();
  const { t } = useLanguage();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error(t('errorLoadingProfile'));
        const data = await res.json();
        setUserProfile(data);

        // Si está conectado, intentar cargar productos
        if (data.mercadolibre.connected) {
          // Primero intentar cargar datos de prueba del localStorage
          const testProducts = localStorage.getItem('test_products');
          if (testProducts) {
            setProducts(JSON.parse(testProducts));
          } else {
            // Si no hay datos de prueba, intentar cargar de la API real
            try {
              const productsRes = await fetch('/api/products');
              if (productsRes.ok) {
                const productsData = await productsRes.json();
                setProducts(productsData.products || []);
              }
            } catch (error) {
              console.error('Error cargando productos:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error:', error);
        notify(t('errorLoadingData'));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [notify]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fiddo-orange"></div>
      </div>
    );
  }

  // Usuario no conectado a MercadoLibre
  if (!userProfile?.mercadolibre.connected) {
    return (
      <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">{t('productos')}</h1>
          <p className="text-slate-400 mt-1">{t('manageCatalog')}</p>
        </header>
        <div className="p-8 flex items-center justify-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-2xl">
            <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{t('connectML')}</h2>
            <p className="text-slate-400 mb-6">{t('toViewProducts')}</p>
            <button
              onClick={initiateMLOAuth}
              className="px-8 py-3 bg-gradient-to-r from-fiddo-orange to-fiddo-turquoise text-white font-semibold rounded-xl hover:shadow-2xl transition"
            >
              {t('connectMercadoLibre')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Usuario conectado pero sin productos
  if (products.length === 0) {
    return (
      <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">{t('productos')}</h1>
          <p className="text-slate-400 mt-1">{t('manageCatalog')}</p>
        </header>
        <div className="p-8 flex items-center justify-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-2xl">
            <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{t('noProducts')}</h2>
            <p className="text-slate-400">{t('publishFirstProduct')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Usuario conectado con productos
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-4 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-white">{t('productos')}</h1>
        <p className="text-slate-400 mt-1">{products.length} {t('productsInCatalog')}</p>
      </header>
      <div className="p-4 lg:p-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition"
            >
              {product.thumbnail && (
                <div className="relative w-full h-48 bg-slate-700/30 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Error cargando imagen:', product.thumbnail);
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23334155" width="200" height="200"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo image%3C/text%3E%3C/svg%3E';
                    }}
                    onLoad={() => {
                      console.log('Imagen cargada:', product.thumbnail);
                    }}
                  />
                </div>
              )}
              <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">{product.title}</h3>
              <p className="text-2xl font-bold text-fiddo-orange mb-2">${product.price?.toLocaleString()}</p>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>{product.available_quantity} {t('available')}</span>
                <span className={product.status === 'active' ? 'text-green-400' : 'text-slate-400'}>
                  {product.status === 'active' ? t('active') : t('inactive')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
