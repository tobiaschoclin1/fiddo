// src/app/register/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import SplashScreen from '@/components/SplashScreen';
import { signIn } from 'next-auth/react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { notify } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!registerResponse.ok) {
        const data = await registerResponse.json();
        throw new Error(data.message || 'Error al registrarse');
      }

      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        throw new Error('Usuario registrado pero error al iniciar sesión.');
      }

      router.push('/dashboard');

    } catch (error: unknown) {
      console.error('Error en el registro:', error);
      notify(error instanceof Error ? error.message : 'Algo salió mal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Error al registrarse con Google:', error);
      notify('Error al registrarse con Google');
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
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-medium text-fiddo-orange hover:text-fiddo-orange-light transition">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Nombre Completo
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full appearance-none rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-white placeholder-slate-400 focus:border-fiddo-turquoise focus:outline-none focus:ring-2 focus:ring-fiddo-turquoise/50"
            />
          </div>

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
              autoComplete="new-password"
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
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-800/50 px-2 text-slate-400">O continúa con</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-gray-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </button>
        </form>
      </div>
    </main>
  );
}
