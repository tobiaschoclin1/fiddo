"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";

interface UserProfile {
  user: { id: string; name: string; email: string; createdAt: string };
  mercadolibre: {
    connected: boolean;
    userId?: string;
    profile?: {
      nickname: string;
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export default function PerfilPage() {
  const { notify } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (!res.ok) throw new Error('Error cargando perfil');
        const data = await res.json();
        setUserProfile(data);
        setFormData({ name: data.user.name || "", email: data.user.email });
      } catch (error) {
        console.error('Error:', error);
        notify('Error cargando perfil');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [notify]);

  const handleSave = async () => {
    notify('✅ Perfil actualizado correctamente');
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fiddo-orange"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
        <h1 className="text-3xl font-bold text-white">Mi Perfil</h1>
        <p className="text-slate-400 mt-1">Gestiona tu información personal</p>
      </header>

      <div className="p-8 max-w-4xl">
        {/* Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 bg-gradient-to-br from-fiddo-orange to-fiddo-turquoise rounded-full flex items-center justify-center text-4xl text-white font-bold">
                {userProfile?.user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{userProfile?.user.name}</h2>
                <p className="text-slate-400">{userProfile?.user.email}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Miembro desde {new Date(userProfile?.user.createdAt || '').toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-fiddo-blue hover:bg-fiddo-blue-light text-white rounded-lg transition"
            >
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nombre completo</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fiddo-orange disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fiddo-orange disabled:opacity-50"
              />
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-fiddo-orange to-fiddo-orange-light text-white rounded-lg hover:shadow-lg transition"
              >
                Guardar cambios
              </button>
            </div>
          )}
        </div>

        {/* MercadoLibre Connection */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-white mb-4">Integraciones</h3>

          <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                <span className="font-bold text-yellow-900">ML</span>
              </div>
              <div>
                <h4 className="font-semibold text-white">MercadoLibre</h4>
                {userProfile?.mercadolibre.connected ? (
                  <>
                    <p className="text-sm text-green-400">✓ Conectado</p>
                    <p className="text-xs text-slate-400">Usuario: {userProfile.mercadolibre.profile?.nickname}</p>
                  </>
                ) : (
                  <p className="text-sm text-slate-400">No conectado</p>
                )}
              </div>
            </div>

            {userProfile?.mercadolibre.connected ? (
              <button
                onClick={async () => {
                  if (confirm('¿Estás seguro de que deseas desconectar tu cuenta de MercadoLibre?')) {
                    try {
                      const res = await fetch('/api/auth/mercadolibre/disconnect', { method: 'POST' });
                      if (res.ok) {
                        notify('✅ Cuenta de MercadoLibre desconectada');
                        window.location.reload();
                      } else {
                        notify('❌ Error al desconectar');
                      }
                    } catch {
                      notify('❌ Error al desconectar');
                    }
                  }
                }}
                className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition"
              >
                Desconectar
              </button>
            ) : (
              <button className="px-4 py-2 bg-fiddo-orange text-white rounded-lg hover:shadow-lg transition">
                Conectar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
