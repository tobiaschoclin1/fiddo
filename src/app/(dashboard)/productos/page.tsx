"use client";

export default function ProductosPage() {
  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
        <h1 className="text-3xl font-bold text-white">Productos</h1>
        <p className="text-slate-400 mt-1">Gestiona tu catálogo de MercadoLibre</p>
      </header>
      <div className="p-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Próximamente</h2>
          <p className="text-slate-400">Esta sección estará disponible pronto</p>
        </div>
      </div>
    </div>
  );
}
