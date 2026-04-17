"use client";

export default function PromocionesPage() {
  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
        <h1 className="text-3xl font-bold text-white">🎯 Promociones</h1>
        <p className="text-slate-400 mt-1">Crea ofertas especiales</p>
      </header>
      <div className="p-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
          <p className="text-6xl mb-4">🎯</p>
          <h2 className="text-2xl font-bold text-white mb-2">Próximamente</h2>
          <p className="text-slate-400">Esta sección estará disponible pronto</p>
        </div>
      </div>
    </div>
  );
}
