"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { initiateMLOAuth } from "@/lib/mercadolibre-oauth";

interface Stats {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  revenue: number;
}

interface UserProfile {
  user: { id: string; name: string; email: string };
  mercadolibre: {
    connected: boolean;
    profile?: {
      nickname: string;
      first_name: string;
      last_name: string;
    };
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { notify } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error('Error cargando perfil');
        const data = await res.json();
        setUserProfile(data);

        // TODO: Cargar stats reales cuando estén disponibles
        setStats({
          totalProducts: 0,
          totalCustomers: 0,
          totalOrders: 0,
          revenue: 0,
        });
      } catch (error) {
        console.error('Error:', error);
        notify('Error cargando datos');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [notify]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fiddo-orange mx-auto"></div>
          <p className="mt-4 text-slate-300">Cargando...</p>
        </div>
      </div>
    );
  }

  const isConnected = userProfile?.mercadolibre.connected;

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Bienvenido, {userProfile?.user.name?.split(' ')[0] || 'Usuario'}
          </h1>
          <p className="text-slate-400 mt-1">Resumen de tu cuenta</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 space-y-6">
        {/* MercadoLibre Connection Status */}
        {!isConnected && (
          <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-yellow-200 mb-2">Conecta tu cuenta de MercadoLibre</h3>
                <p className="text-yellow-100/80">Para comenzar a gestionar tus productos y clientes, conecta tu cuenta de MercadoLibre</p>
              </div>
              <button
                onClick={initiateMLOAuth}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold rounded-lg transition shrink-0 ml-4"
              >
                Conectar ahora
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Products */}
          <div className="bg-gradient-to-br from-fiddo-blue to-fiddo-blue-dark p-6 rounded-2xl shadow-xl">
            <div>
              <p className="text-blue-200 text-sm font-medium">Productos</p>
              <h3 className="text-4xl font-bold text-white mt-2">{stats.totalProducts}</h3>
              <p className="text-blue-200/70 text-xs mt-2">En catálogo</p>
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-gradient-to-br from-fiddo-turquoise to-fiddo-turquoise-dark p-6 rounded-2xl shadow-xl">
            <div>
              <p className="text-teal-200 text-sm font-medium">Clientes</p>
              <h3 className="text-4xl font-bold text-white mt-2">{stats.totalCustomers}</h3>
              <p className="text-teal-200/70 text-xs mt-2">Total</p>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-fiddo-orange to-fiddo-orange-dark p-6 rounded-2xl shadow-xl">
            <div>
              <p className="text-orange-200 text-sm font-medium">Ventas</p>
              <h3 className="text-4xl font-bold text-white mt-2">{stats.totalOrders}</h3>
              <p className="text-orange-200/70 text-xs mt-2">Este mes</p>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-2xl shadow-xl">
            <div>
              <p className="text-purple-200 text-sm font-medium">Ingresos</p>
              <h3 className="text-4xl font-bold text-white mt-2">${stats.revenue.toLocaleString()}</h3>
              <p className="text-purple-200/70 text-xs mt-2">Este mes</p>
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Integraciones</h2>

          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="font-bold text-yellow-900 text-sm">ML</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">MercadoLibre</h3>
                {isConnected ? (
                  <p className="text-sm text-green-400">Conectado como {userProfile.mercadolibre.profile?.nickname}</p>
                ) : (
                  <p className="text-sm text-slate-400">No conectado</p>
                )}
              </div>
            </div>

            {!isConnected && (
              <button
                onClick={initiateMLOAuth}
                className="px-6 py-2 bg-gradient-to-r from-fiddo-orange to-fiddo-orange-light text-white rounded-lg hover:shadow-lg transition"
              >
                Conectar
              </button>
            )}
          </div>
        </div>

        {/* Test Data - only show if connected */}
        {isConnected && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Datos de prueba</h2>
                <p className="text-slate-400 text-sm">Inserta productos, ventas y clientes de ejemplo para probar el sistema</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('/api/test-data/insert', { method: 'POST' });
                    const data = await res.json();
                    if (res.ok) {
                      // Guardar en localStorage
                      localStorage.setItem('test_products', JSON.stringify(data.data.products));
                      localStorage.setItem('test_customers', JSON.stringify(data.data.customers));
                      localStorage.setItem('test_orders', JSON.stringify(data.data.orders));
                      notify('Datos de prueba insertados correctamente');
                      window.location.reload();
                    } else {
                      notify(data.error || 'Error insertando datos');
                    }
                  } catch (error) {
                    console.error('Error:', error);
                    notify('Error insertando datos de prueba');
                  }
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:shadow-lg transition shrink-0 ml-4"
              >
                Insertar datos
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions - only show if connected */}
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push('/dashboard/productos')}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition text-left group"
            >
              <div className="h-12 w-12 bg-fiddo-blue/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="h-6 w-6 text-fiddo-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-lg">Gestionar Productos</h3>
              <p className="text-slate-400 text-sm mt-2">Ver y editar tu catálogo</p>
            </button>

            <button
              onClick={() => router.push('/dashboard/clientes')}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition text-left group"
            >
              <div className="h-12 w-12 bg-fiddo-turquoise/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="h-6 w-6 text-fiddo-turquoise" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-lg">Ver Clientes</h3>
              <p className="text-slate-400 text-sm mt-2">Gestiona tus compradores</p>
            </button>

            <button
              onClick={() => router.push('/dashboard/promociones')}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition text-left group"
            >
              <div className="h-12 w-12 bg-fiddo-orange/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="h-6 w-6 text-fiddo-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="font-bold text-white text-lg">Crear Promoción</h3>
              <p className="text-slate-400 text-sm mt-2">Impulsa tus ventas</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
