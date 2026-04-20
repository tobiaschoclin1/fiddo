"use client";

import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/ui/Toast";
import { initiateMLOAuth } from "@/lib/mercadolibre-oauth";
import { useLanguage } from "@/contexts/LanguageContext";

interface UserProfile {
  mercadolibre: {
    connected: boolean;
  };
}

interface Customer {
  id: string;
  name?: string;
  email?: string;
  orders_count?: number;
  total_spent?: number;
  location?: string;
}

type SortOption = 'name' | 'purchases' | 'spent';
type FilterOption = 'all' | 'high-purchases' | 'low-purchases';

export default function ClientesPage() {
  const { notify } = useToast();
  const { t } = useLanguage();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error('Error cargando perfil');
        const data = await res.json();
        setUserProfile(data);

        if (data.mercadolibre.connected) {
          const testCustomers = localStorage.getItem('test_customers');
          if (testCustomers) {
            setCustomers(JSON.parse(testCustomers));
          } else {
            try {
              const customersRes = await fetch('/api/customers');
              if (customersRes.ok) {
                const customersData = await customersRes.json();
                setCustomers(customersData.customers || []);
              }
            } catch (error) {
              console.error('Error cargando clientes:', error);
            }
          }
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

  const filteredAndSortedCustomers = useMemo(() => {
    let result = [...customers];

    // Filtro por búsqueda
    if (searchTerm) {
      result = result.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por cantidad de compras
    if (filterBy === 'high-purchases') {
      result = result.filter(c => (c.orders_count || 0) > 5);
    } else if (filterBy === 'low-purchases') {
      result = result.filter(c => (c.orders_count || 0) <= 5);
    }

    // Ordenamiento
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (sortBy === 'purchases') {
        return (b.orders_count || 0) - (a.orders_count || 0);
      } else if (sortBy === 'spent') {
        return (b.total_spent || 0) - (a.total_spent || 0);
      }
      return 0;
    });

    return result;
  }, [customers, searchTerm, filterBy, sortBy]);

  const toggleCustomer = (id: string) => {
    setSelectedCustomers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedCustomers.size === filteredAndSortedCustomers.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(filteredAndSortedCustomers.map(c => c.id)));
    }
  };

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
          <h1 className="text-3xl font-bold text-white">{t('clientes')}</h1>
          <p className="text-slate-400 mt-1">{t('manageBuyers')}</p>
        </header>
        <div className="p-8 flex items-center justify-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-2xl">
            <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{t('connectML')}</h2>
            <p className="text-slate-400 mb-6">{t('connectToView')} {t('clientes').toLowerCase()}, {t('connectMLFirst')}</p>
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

  if (customers.length === 0) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">{t('clientes')}</h1>
          <p className="text-slate-400 mt-1">{t('manageBuyers')}</p>
        </header>
        <div className="p-8 flex items-center justify-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-2xl">
            <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">{t('noCustomers')}</h2>
            <p className="text-slate-400">{t('whenFirstSale')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
        <h1 className="text-3xl font-bold text-white">{t('clientes')}</h1>
        <p className="text-slate-400 mt-1">{filteredAndSortedCustomers.length} {t('customers_')} {selectedCustomers.size > 0 && `(${selectedCustomers.size} ${t('selectedCustomers')})`}</p>
      </header>

      <div className="p-8 space-y-6">
        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fiddo-turquoise"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fiddo-turquoise"
          >
            <option value="name">{t('byName')}</option>
            <option value="purchases">{t('byPurchases')}</option>
            <option value="spent">{t('bySpent')}</option>
          </select>

          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fiddo-turquoise"
          >
            <option value="all">{t('all')}</option>
            <option value="high-purchases">{t('moreThan5')}</option>
            <option value="low-purchases">{t('lessThan5')}</option>
          </select>

          {selectedCustomers.size > 0 && (
            <button
              onClick={() => window.location.href = `/dashboard/mensajes?customers=${Array.from(selectedCustomers).join(',')}`}
              className="px-6 py-2 bg-gradient-to-r from-fiddo-orange to-fiddo-turquoise text-white rounded-lg hover:shadow-lg transition"
            >
              {t('sendMessage')} ({selectedCustomers.size})
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-slate-700/30">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.size === filteredAndSortedCustomers.length && filteredAndSortedCustomers.length > 0}
                    onChange={selectAll}
                    className="rounded border-slate-500 text-fiddo-orange focus:ring-fiddo-orange"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">{t('customer_')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">{t('email_')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">{t('purchases')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">{t('totalSpent')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredAndSortedCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-700/20 transition">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.has(customer.id)}
                      onChange={() => toggleCustomer(customer.id)}
                      className="rounded border-slate-500 text-fiddo-orange focus:ring-fiddo-orange"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-fiddo-orange to-fiddo-turquoise rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="font-medium text-white">{customer.name || t('noName')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 max-w-[200px] truncate">{customer.email || 'N/A'}</td>
                  <td className="px-6 py-4 text-slate-300">{customer.orders_count || 0}</td>
                  <td className="px-6 py-4 text-fiddo-orange font-semibold">
                    ${(customer.total_spent || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
