// src/app/login/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import SplashScreen from '@/components/SplashScreen';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { notify } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Algo salió mal');
      }

      router.push('/dashboard');

    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error);
      notify(error instanceof Error ? error.message : 'Algo salió mal');
    } finally {
      setIsLoading(false);
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 shadow-2xl">
        <div className="text-center flex flex-col items-center">
          <img src="/brand/fiddo_new_logo.png" alt="Fiddo" className="h-20 w-auto mb-4" />
          <h1 className="font-bold text-3xl mb-2">
            <span className="text-fiddo-blue">F</span>
            <span className="text-fiddo-orange">i</span>
            <span className="text-fiddo-turquoise">ddo</span>
          </h1>
          <h2 className="text-2xl font-bold text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-medium text-fiddo-orange hover:text-fiddo-orange-light transition">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full appearance-none rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-400 focus:border-fiddo-turquoise focus:outline-none focus:ring-2 focus:ring-fiddo-turquoise/50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full appearance-none rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-400 focus:border-fiddo-turquoise focus:outline-none focus:ring-2 focus:ring-fiddo-turquoise/50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-fiddo-orange to-fiddo-turquoise text-white font-semibold hover:shadow-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  );
}