"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { initiateMLOAuth } from "@/lib/mercadolibre-oauth";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface UserProfile {
  mercadolibre: {
    connected: boolean;
  };
}

interface Product {
  id: string;
  title: string;
  price: number;
  sold_quantity: number;
}

interface Customer {
  id: string;
  name?: string;
  orders_count?: number;
  total_spent?: number;
}

export default function AnalyticsPage() {
  const { notify } = useToast();
  const { t } = useLanguage();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error('Error cargando perfil');
        const data = await res.json();
        setUserProfile(data);

        if (data.mercadolibre.connected) {
          const testProducts = localStorage.getItem('test_products');
          const testCustomers = localStorage.getItem('test_customers');

          if (testProducts) setProducts(JSON.parse(testProducts));
          if (testCustomers) setCustomers(JSON.parse(testCustomers));
        }
      } catch (error) {
        console.error('Error:', error);
        notify('Error cargando datos', 'error');
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

  if (!userProfile?.mercadolibre.connected) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">Analiza tu rendimiento</p>
        </header>
        <div className="p-8 flex items-center justify-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-2xl">
            <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{t('connectML')}</h2>
            <p className="text-slate-400 mb-6">Para ver tus análisis de ventas, primero debes conectar tu cuenta de MercadoLibre</p>
            <button
              onClick={initiateMLOAuth}
              className="px-8 py-3 bg-gradient-to-r from-fiddo-orange to-fiddo-turquoise text-white font-semibold rounded-xl hover:shadow-2xl transition"
            >
              {t('connect')} MercadoLibre
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const salesData = [
    { mes: 'Ene', ventas: 12, ingresos: 15599988 },
    { mes: 'Feb', ventas: 19, ingresos: 24699981 },
    { mes: 'Mar', ventas: 15, ingresos: 19499985 },
    { mes: 'Abr', ventas: 25, ingresos: 32499975 },
    { mes: 'May', ventas: 22, ingresos: 28599978 },
    { mes: 'Jun', ventas: 30, ingresos: 38999970 },
  ];

  const topProducts = products
    .sort((a, b) => (b.sold_quantity || 0) - (a.sold_quantity || 0))
    .slice(0, 5)
    .map(p => ({
      nombre: p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title,
      vendidos: p.sold_quantity || 0,
      ingresos: p.price * (p.sold_quantity || 0),
    }));

  const customerDistribution = [
    { nombre: '1-2 compras', valor: customers.filter(c => (c.orders_count || 0) <= 2).length },
    { nombre: '3-5 compras', valor: customers.filter(c => (c.orders_count || 0) > 2 && (c.orders_count || 0) <= 5).length },
    { nombre: '5+ compras', valor: customers.filter(c => (c.orders_count || 0) > 5).length },
  ];

  const COLORS = ['#FF6B35', '#1FB3B3', '#004E89', '#FFD700', '#9333EA'];

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * (p.sold_quantity || 0)), 0);
  const totalSales = products.reduce((sum, p) => sum + (p.sold_quantity || 0), 0);
  const avgOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-y-auto">
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6 sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Analiza tu rendimiento de ventas</p>
      </header>

      <div className="p-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <p className="text-slate-400 text-sm font-medium mb-2">Ingresos totales</p>
            <h3 className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</h3>
            <p className="text-green-400 text-sm mt-2">↑ +12% vs mes anterior</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <p className="text-slate-400 text-sm font-medium mb-2">Total de ventas</p>
            <h3 className="text-3xl font-bold text-white">{totalSales}</h3>
            <p className="text-green-400 text-sm mt-2">↑ +8% vs mes anterior</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <p className="text-slate-400 text-sm font-medium mb-2">Valor promedio</p>
            <h3 className="text-3xl font-bold text-white">${Math.round(avgOrderValue).toLocaleString()}</h3>
            <p className="text-yellow-400 text-sm mt-2">→ 0% vs mes anterior</p>
          </div>
        </div>

        {/* Sales Over Time */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">{t('salesOverTime')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="mes" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Legend />
              <Line type="monotone" dataKey="ventas" stroke="#FF6B35" strokeWidth={2} name="Ventas" />
              <Line type="monotone" dataKey="ingresos" stroke="#1FB3B3" strokeWidth={2} name="Ingresos ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">{t('topProducts')}</h2>
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="nombre" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="vendidos" fill="#FF6B35" name="Unidades vendidas" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-center py-8">No hay datos disponibles</p>
            )}
          </div>

          {/* Customer Distribution */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Distribución de clientes</h2>
            {customerDistribution.some(d => d.valor > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: {nombre: string, percent: number}) => `${entry.nombre} (${(entry.percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {customerDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-center py-8">No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Revenue by Product */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">{t('revenueByProduct')}</h2>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="nombre" type="category" stroke="#94a3b8" width={150} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="ingresos" fill="#1FB3B3" name="Ingresos ($)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-center py-8">No hay datos disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
}
