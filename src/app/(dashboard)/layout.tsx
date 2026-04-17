// src/app/(dashboard)/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Productos', path: '/dashboard/productos', icon: '📦' },
    { name: 'Clientes', path: '/dashboard/clientes', icon: '👥' },
    { name: 'Mensajes', path: '/dashboard/mensajes', icon: '💬' },
    { name: 'Analytics', path: '/dashboard/analytics', icon: '📈' },
    { name: 'Promociones', path: '/dashboard/promociones', icon: '🎯' },
  ];

  const bottomNavItems = [
    { name: 'Perfil', path: '/dashboard/perfil', icon: '👤' },
    { name: 'Configuración', path: '/dashboard/configuracion', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <img src="/brand/Fiddo.JPG" alt="Fiddo" className="h-10 w-10 rounded-lg" />
            {isSidebarOpen && (
              <div>
                <h1 className="font-bold text-xl">
                  <span className="text-fiddo-blue">F</span>
                  <span className="text-fiddo-orange">i</span>
                  <span className="text-fiddo-turquoise">ddo</span>
                </h1>
                <p className="text-xs text-slate-400">Tu gestión inteligente</p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mx-auto my-2 p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition"
        >
          {isSidebarOpen ? '◀' : '▶'}
        </button>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === item.path
                  ? 'bg-gradient-to-r from-fiddo-orange to-fiddo-turquoise text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 py-4 space-y-1 border-t border-slate-700/50">
          {bottomNavItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === item.path
                  ? 'bg-slate-700/70 text-white'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span className="font-medium">Salir</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
