// src/app/register/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
        </form>
      </div>
    </main>
  );
}
