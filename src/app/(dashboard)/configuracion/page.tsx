"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export default function ConfiguracionPage() {
  const { notify } = useToast();
  const [config, setConfig] = useState({
    notifications: true,
    emailAlerts: false,
    darkMode: true,
    language: 'es',
  });

  const handleSave = () => {
    notify('✅ Configuración guardada');
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
        <h1 className="text-3xl font-bold text-white">⚙️ Configuración</h1>
        <p className="text-slate-400 mt-1">Personaliza tu experiencia</p>
      </header>

      <div className="p-8 max-w-4xl space-y-6">
        {/* Notificaciones */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">🔔 Notificaciones</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div>
                <h3 className="font-semibold text-white">Notificaciones push</h3>
                <p className="text-sm text-slate-400">Recibe alertas en tiempo real</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.notifications}
                  onChange={(e) => setConfig({ ...config, notifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fiddo-orange/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fiddo-orange"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div>
                <h3 className="font-semibold text-white">Alertas por email</h3>
                <p className="text-sm text-slate-400">Notificaciones importantes por correo</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.emailAlerts}
                  onChange={(e) => setConfig({ ...config, emailAlerts: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fiddo-orange/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fiddo-orange"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Apariencia */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">🎨 Apariencia</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl">
              <div>
                <h3 className="font-semibold text-white">Modo oscuro</h3>
                <p className="text-sm text-slate-400">Tema oscuro activado</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.darkMode}
                  onChange={(e) => setConfig({ ...config, darkMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fiddo-turquoise/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fiddo-turquoise"></div>
              </label>
            </div>

            <div className="p-4 bg-slate-700/30 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Idioma</h3>
              <select
                value={config.language}
                onChange={(e) => setConfig({ ...config, language: e.target.value })}
                className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fiddo-turquoise"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-4 bg-gradient-to-r from-fiddo-orange to-fiddo-turquoise text-white font-bold rounded-xl hover:shadow-2xl transition"
        >
          Guardar configuración
        </button>
      </div>
    </div>
  );
}
