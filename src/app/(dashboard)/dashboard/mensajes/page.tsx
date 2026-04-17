"use client";

export default function MensajesPage() {
  return (
    <div className="h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50 px-8 py-6">
        <h1 className="text-3xl font-bold text-white">Mensajes</h1>
        <p className="text-slate-400 mt-1">Comunícate con tus clientes</p>
      </header>
      <div className="p-8">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="h-20 w-20 bg-slate-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Próximamente</h2>
          <p className="text-slate-400">Esta sección estará disponible pronto</p>
        </div>
      </div>
    </div>
  );
}
