"use client";

export default function PromocionesPage() {
  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
        <h1 className="text-3xl font-bold text-white">Promociones</h1>
        <p className="text-slate-400 mt-1">Crea ofertas especiales</p>
      </header>
      <div className="p-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Próximamente</h2>
          <p className="text-slate-400">Esta sección estará disponible pronto</p>
        </div>
      </div>
    </div>
  );
}
