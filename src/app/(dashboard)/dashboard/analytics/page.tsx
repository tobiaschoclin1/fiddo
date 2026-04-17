"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { initiateMLOAuth } from "@/lib/mercadolibre-oauth";

interface UserProfile {
  mercadolibre: {
    connected: boolean;
  };
}

export default function AnalyticsPage() {
  const { notify } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error('Error cargando perfil');
        const data = await res.json();
        setUserProfile(data);
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
            <h2 className="text-2xl font-bold text-white mb-3">Conecta tu cuenta de MercadoLibre</h2>
            <p className="text-slate-400 mb-6">Para ver tus análisis de ventas, primero debes conectar tu cuenta de MercadoLibre</p>
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

  // Usuario conectado - funcionalidad de analytics próximamente
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
          <h2 className="text-2xl font-bold text-white mb-3">Próximamente</h2>
          <p className="text-slate-400">Los análisis de ventas estarán disponibles pronto</p>
        </div>
      </div>
    </div>
  );
}
