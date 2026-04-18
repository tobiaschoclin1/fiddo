"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { initiateMLOAuth } from "@/lib/mercadolibre-oauth";

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
}

export default function ClientesPage() {
  const { notify } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error('Error cargando perfil');
        const data = await res.json();
        setUserProfile(data);

        // Si está conectado, intentar cargar clientes
        if (data.mercadolibre.connected) {
          // Primero intentar cargar datos de prueba del localStorage
          const testCustomers = localStorage.getItem('test_customers');
          if (testCustomers) {
            setCustomers(JSON.parse(testCustomers));
          } else {
            // Si no hay datos de prueba, intentar cargar de la API real
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
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fiddo-orange"></div>
      </div>
    );
  }

  // Usuario no conectado a MercadoLibre
  if (!userProfile?.mercadolibre.connected) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="text-slate-400 mt-1">Gestiona tus compradores</p>
        </header>
        <div className="p-8 flex items-center justify-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-2xl">
            <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Conecta tu cuenta de MercadoLibre</h2>
            <p className="text-slate-400 mb-6">Para ver tus clientes, primero debes conectar tu cuenta de MercadoLibre</p>
            <button
              onClick={initiateMLOAuth}
              className="px-8 py-3 bg-gradient-to-r from-fiddo-orange to-fiddo-turquoise text-white font-semibold rounded-xl hover:shadow-2xl transition"
            >
              Conectar MercadoLibre
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Usuario conectado pero sin clientes
  if (customers.length === 0) {
    return (
      <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="text-slate-400 mt-1">Gestiona tus compradores</p>
        </header>
        <div className="p-8 flex items-center justify-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center max-w-2xl">
            <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Aún no tienes clientes</h2>
            <p className="text-slate-400">Cuando realices tu primera venta, tus clientes aparecerán aquí</p>
          </div>
        </div>
      </div>
    );
  }

  // Usuario conectado con clientes
  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
        <h1 className="text-3xl font-bold text-white">Clientes</h1>
        <p className="text-slate-400 mt-1">{customers.length} clientes registrados</p>
      </header>
      <div className="p-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/30">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Compras</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Total gastado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-700/20 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-fiddo-orange to-fiddo-turquoise rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="font-medium text-white">{customer.name || 'Sin nombre'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{customer.email || 'N/A'}</td>
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
