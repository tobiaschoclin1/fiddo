// src/app/(dashboard)/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const navItems = [
    { name: t('dashboard'), path: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: t('productos'), path: '/dashboard/productos', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: t('clientes'), path: '/dashboard/clientes', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: t('mensajes'), path: '/dashboard/mensajes', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { name: t('analytics'), path: '/dashboard/analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  const bottomNavItems = [
    { name: t('perfil'), path: '/dashboard/perfil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: t('configuracion'), path: '/dashboard/configuracion', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ];

  const SvgIcon = ({ path, className = "h-5 w-5" }: { path: string; className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );

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
            <img src="/brand/fiddo_new_logo.png" alt="Fiddo" className="h-10 w-auto" />
            {isSidebarOpen && (
              <div>
                <h1 className="font-bold text-xl">
                  <span className="text-fiddo-blue">F</span>
                  <span className="text-fiddo-orange">i</span>
                  <span className="text-fiddo-turquoise">ddo</span>
                </h1>
                <p className="text-xs text-slate-400">Smart management</p>
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
              <SvgIcon path={item.icon} />
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
              <SvgIcon path={item.icon} />
              {isSidebarOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <SvgIcon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            {isSidebarOpen && <span className="font-medium">{t('salir')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {/* Language Toggle - Fixed Position */}
        <div className="fixed top-6 right-6 z-40">
          <button
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="bg-slate-800/70 backdrop-blur-md border border-slate-700/50 rounded-lg p-2 shadow-xl hover:bg-slate-700/70 transition-all group"
            title={language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
          >
            <svg className="h-5 w-5 text-slate-400 group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
              {language === 'es' ? 'ES' : 'EN'}
            </span>
          </button>
        </div>

        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
