"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { initiateMLOAuth } from "@/lib/mercadolibre-oauth";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
        if (!res.ok) throw new Error(t('errorLoadingProfile'));
        const data = await res.json();
        setUserProfile(data);

        // Load test data from localStorage
        const testProducts = JSON.parse(localStorage.getItem('test_products') || '[]');
        const testCustomers = JSON.parse(localStorage.getItem('test_customers') || '[]');
        const testOrders = JSON.parse(localStorage.getItem('test_orders') || '[]');

        // Limpiar datos antiguos si usan el formato viejo (amount en vez de total_amount)
        if (testOrders.length > 0 && testOrders[0].amount !== undefined && testOrders[0].total_amount === undefined) {
          console.log('Limpiando datos antiguos...');
          localStorage.removeItem('test_products');
          localStorage.removeItem('test_customers');
          localStorage.removeItem('test_orders');
          setStats({
            totalProducts: 0,
            totalCustomers: 0,
            totalOrders: 0,
            revenue: 0,
          });
          setLoading(false);
          return;
        }

        const totalRevenue = testOrders.reduce((sum: number, order: any) => {
          const amount = order.total_amount || 0;
          return sum + amount;
        }, 0);

        setStats({
          totalProducts: testProducts.length,
          totalCustomers: testCustomers.length,
          totalOrders: testOrders.length,
          revenue: totalRevenue || 0,
        });
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

  const isConnected = userProfile?.mercadolibre.connected;

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-4 lg:px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {t('welcome')}, {userProfile?.user.name?.split(' ')[0] || 'Usuario'}
          </h1>
          <p className="text-slate-400 mt-1">{t('accountSummary')}</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 lg:p-8 space-y-6 pb-20">
        {/* MercadoLibre Connection Status */}
        {!isConnected && (
          <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-yellow-200 mb-2">{t('connectML')}</h3>
                <p className="text-yellow-100/80">{t('connectMLDesc')}</p>
              </div>
              <button
                onClick={initiateMLOAuth}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold rounded-lg transition shrink-0 ml-4"
              >
                {t('connectNow')}
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Products */}
          <div className="bg-gradient-to-br from-fiddo-blue to-fiddo-blue-dark p-6 rounded-2xl shadow-xl">
            <div>
              <p className="text-blue-200 text-sm font-medium">{t('products')}</p>
              <h3 className="text-4xl font-bold text-white mt-2">{stats.totalProducts}</h3>
              <p className="text-blue-200/70 text-xs mt-2">{t('inCatalog')}</p>
            </div>
          </div>

          {/* Total Customers */}
          <div className="bg-gradient-to-br from-fiddo-turquoise to-fiddo-turquoise-dark p-6 rounded-2xl shadow-xl">
            <div>
              <p className="text-teal-200 text-sm font-medium">{t('customers')}</p>
              <h3 className="text-4xl font-bold text-white mt-2">{stats.totalCustomers}</h3>
              <p className="text-teal-200/70 text-xs mt-2">{t('total')}</p>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-fiddo-orange to-fiddo-orange-dark p-6 rounded-2xl shadow-xl">
            <div>
              <p className="text-orange-200 text-sm font-medium">{t('sales')}</p>
              <h3 className="text-4xl font-bold text-white mt-2">{stats.totalOrders}</h3>
              <p className="text-orange-200/70 text-xs mt-2">{t('thisMonth')}</p>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-2xl shadow-xl">
            <div>
              <p className="text-purple-200 text-sm font-medium">{t('revenue')}</p>
              <h3 className="text-4xl font-bold text-white mt-2">${(stats.revenue || 0).toLocaleString()}</h3>
              <p className="text-purple-200/70 text-xs mt-2">{t('thisMonth')}</p>
            </div>
          </div>
        </div>

        {/* Integration Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">{t('integrations')}</h2>

          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="font-bold text-yellow-900 text-sm">ML</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">MercadoLibre</h3>
                {isConnected ? (
                  <p className="text-sm text-green-400">{t('connected')} {userProfile.mercadolibre.profile?.nickname}</p>
                ) : (
                  <p className="text-sm text-slate-400">{t('notConnected')}</p>
                )}
              </div>
            </div>

            {!isConnected && (
              <button
                onClick={initiateMLOAuth}
                className="px-6 py-2 bg-gradient-to-r from-fiddo-orange to-fiddo-orange-light text-white rounded-lg hover:shadow-lg transition"
              >
                {t('connect')}
              </button>
            )}
          </div>
        </div>

        {/* Test Data - only show if connected */}
        {isConnected && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">{t('testData')}</h2>
                <p className="text-slate-400 text-sm">{t('insertTestDataDesc')}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/test-data/insert', { method: 'POST' });
                      const data = await res.json();
                      if (res.ok) {
                        localStorage.setItem('test_products', JSON.stringify(data.data.products));
                        localStorage.setItem('test_customers', JSON.stringify(data.data.customers));
                        localStorage.setItem('test_orders', JSON.stringify(data.data.orders));
                        notify(t('testDataInserted'), 'success');
                        window.location.reload();
                      } else {
                        notify(data.error || t('errorGeneral'), 'error');
                      }
                    } catch (error) {
                      console.error('Error:', error);
                      notify(t('errorInsertingData'), 'error');
                    }
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:shadow-lg transition"
                >
                  {t('insertData')}
                </button>
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/test-data/clear', { method: 'POST' });
                      const data = await res.json();
                      if (res.ok) {
                        localStorage.removeItem('test_products');
                        localStorage.removeItem('test_customers');
                        localStorage.removeItem('test_orders');
                        notify(t('testDataDeleted'), 'success');
                        window.location.reload();
                      } else {
                        notify(data.error || t('errorDeletingGeneral'), 'error');
                      }
                    } catch (error) {
                      console.error('Error:', error);
                      notify(t('errorDeletingData'), 'error');
                    }
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:shadow-lg transition"
                >
                  {t('clearData')}
                </button>
              </div>
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
              <h3 className="font-bold text-white text-lg">{t('manageProducts')}</h3>
              <p className="text-slate-400 text-sm mt-2">{t('manageProductsDesc')}</p>
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
              <h3 className="font-bold text-white text-lg">{t('viewCustomers')}</h3>
              <p className="text-slate-400 text-sm mt-2">{t('viewCustomersDesc')}</p>
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
              <h3 className="font-bold text-white text-lg">{t('createPromotion')}</h3>
              <p className="text-slate-400 text-sm mt-2">{t('createPromotionDesc')}</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
