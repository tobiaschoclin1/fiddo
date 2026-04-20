"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { initiateMLOAuth } from "@/lib/mercadolibre-oauth";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface UserProfile {
  mercadolibre: {
    connected: boolean;
  };
}

export default function AnalyticsPage() {
  const { notify } = useToast();
  const { t } = useLanguage();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error(t('errorLoadingProfile'));
        const data = await res.json();
        setUserProfile(data);

        if (data.mercadolibre.connected) {
          const testOrders = JSON.parse(localStorage.getItem('test_orders') || '[]');
          const testProducts = JSON.parse(localStorage.getItem('test_products') || '[]');

          // Limpiar datos antiguos si usan el formato viejo
          if (testOrders.length > 0 && testOrders[0].amount !== undefined && testOrders[0].total_amount === undefined) {
            console.log('Limpiando datos antiguos en analytics...');
            localStorage.removeItem('test_products');
            localStorage.removeItem('test_customers');
            localStorage.removeItem('test_orders');
            setLoading(false);
            return;
          }

          // Datos de ventas por día
          const salesByDay = testOrders.reduce((acc: any, order: any) => {
            const date = new Date(order.date).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' });
            const existing = acc.find((item: any) => item.date === date);
            if (existing) {
              existing.sales += order.total_amount || 0;
              existing.orders += 1;
            } else {
              acc.push({ date, sales: order.total_amount || 0, orders: 1 });
            }
            return acc;
          }, []);

          // Datos de productos vendidos
          const productSales = testProducts.map((product: any) => ({
            name: product.title.substring(0, 20) + '...',
            sold: product.sold_quantity || 0,
            stock: product.available_quantity || 0,
          }));

          const totalRevenue = testOrders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
          const totalOrders = testOrders.length;

          setSalesData(salesByDay);
          setProductData(productSales);
          setStats({
            totalRevenue,
            totalOrders,
            avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
          });
        }
      } catch (error) {
        console.error('Error:', error);
        notify(t('errorLoadingData'));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [notify, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fiddo-orange mx-auto"></div>
          <p className="mt-4 text-slate-300">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!userProfile?.mercadolibre.connected) {
    return (
      <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">{t('analytics')}</h1>
          <p className="text-slate-400 mt-1">{t('viewAnalytics')}</p>
        </header>
        <div className="p-8 flex items-center justify-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-2xl">
            <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{t('connectML')}</h2>
            <p className="text-slate-400 mb-6">{t('toViewAnalytics')}</p>
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

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-4 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-white">{t('analytics')}</h1>
        <p className="text-slate-400 mt-1">{t('salesAndPerformance')}</p>
      </header>

      <div className="p-4 lg:p-8 space-y-6 pb-20">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-fiddo-blue to-fiddo-blue-dark p-6 rounded-2xl shadow-xl">
            <p className="text-blue-200 text-sm font-medium">{t('totalRevenue')}</p>
            <h3 className="text-4xl font-bold text-white mt-2">${stats.totalRevenue.toLocaleString()}</h3>
            <p className="text-blue-200/70 text-xs mt-2">{t('thisMonth')}</p>
          </div>

          <div className="bg-gradient-to-br from-fiddo-orange to-fiddo-orange-dark p-6 rounded-2xl shadow-xl">
            <p className="text-orange-200 text-sm font-medium">{t('totalOrders')}</p>
            <h3 className="text-4xl font-bold text-white mt-2">{stats.totalOrders}</h3>
            <p className="text-orange-200/70 text-xs mt-2">{t('thisMonth')}</p>
          </div>

          <div className="bg-gradient-to-br from-fiddo-turquoise to-fiddo-turquoise-dark p-6 rounded-2xl shadow-xl">
            <p className="text-teal-200 text-sm font-medium">{t('avgOrderValue')}</p>
            <h3 className="text-4xl font-bold text-white mt-2">${Math.round(stats.avgOrderValue).toLocaleString()}</h3>
            <p className="text-teal-200/70 text-xs mt-2">{t('perOrder')}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Over Time */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">{t('salesOverTime')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2} name={t('sales')} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Product Performance */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">{t('productPerformance')}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Bar dataKey="sold" fill="#3b82f6" name={t('sold')} />
                <Bar dataKey="stock" fill="#14b8a6" name={t('stock')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Distribution */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">{t('productDistribution')}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="sold"
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
