"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

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

export default function NewDashboardPage() {
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

        // Simular stats por ahora
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
          <p className="mt-4 text-slate-300">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              ¡Hola, {userProfile?.user.name?.split(' ')[0] || 'Usuario'}! 👋
            </h1>
            <p className="text-slate-400 mt-1">Aquí está tu resumen de hoy</p>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition">
              📅 Hoy
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Products */}
          <div className="bg-gradient-to-br from-fiddo-blue to-fiddo-blue-dark p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium">Productos</p>
                <h3 className="text-4xl font-bold text-white mt-2">{stats.totalProducts}</h3>
                <p className="text-blue-200 text-xs mt-2">📦 En catálogo</p>
              </div>
              <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-gradient-to-br from-fiddo-turquoise to-fiddo-turquoise-dark p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-200 text-sm font-medium">Clientes</p>
                <h3 className="text-4xl font-bold text-white mt-2">{stats.totalCustomers}</h3>
                <p className="text-teal-200 text-xs mt-2">👥 Total</p>
              </div>
              <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">👥</span>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-fiddo-orange to-fiddo-orange-dark p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm font-medium">Ventas</p>
                <h3 className="text-4xl font-bold text-white mt-2">{stats.totalOrders}</h3>
                <p className="text-orange-200 text-xs mt-2">🛒 Este mes</p>
              </div>
              <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">🛒</span>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium">Ingresos</p>
                <h3 className="text-4xl font-bold text-white mt-2">${stats.revenue.toLocaleString()}</h3>
                <p className="text-purple-200 text-xs mt-2">💰 Este mes</p>
              </div>
              <div className="h-16 w-16 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-3xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {/* MercadoLibre Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">🏪 Integraciones</h2>

          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="font-bold text-yellow-900">ML</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">MercadoLibre</h3>
                {userProfile?.mercadolibre.connected ? (
                  <p className="text-sm text-green-400">✓ Conectado como {userProfile.mercadolibre.profile?.nickname}</p>
                ) : (
                  <p className="text-sm text-slate-400">No conectado</p>
                )}
              </div>
            </div>

            {!userProfile?.mercadolibre.connected && (
              <button
                onClick={() => router.push('/dashboard/configuracion')}
                className="px-6 py-2 bg-gradient-to-r from-fiddo-orange to-fiddo-orange-light text-white rounded-lg hover:shadow-lg transition"
              >
                Conectar
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/dashboard/productos')}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition text-left group"
          >
            <div className="h-12 w-12 bg-fiddo-blue/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="font-bold text-white text-lg">Gestionar Productos</h3>
            <p className="text-slate-400 text-sm mt-2">Ver y editar tu catálogo</p>
          </button>

          <button
            onClick={() => router.push('/dashboard/clientes')}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition text-left group"
          >
            <div className="h-12 w-12 bg-fiddo-turquoise/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-bold text-white text-lg">Ver Clientes</h3>
            <p className="text-slate-400 text-sm mt-2">Gestiona tus compradores</p>
          </button>

          <button
            onClick={() => router.push('/dashboard/promociones')}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition text-left group"
          >
            <div className="h-12 w-12 bg-fiddo-orange/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-bold text-white text-lg">Crear Promoción</h3>
            <p className="text-slate-400 text-sm mt-2">Impulsa tus ventas</p>
          </button>
        </div>
      </div>
    </div>
  );
}
