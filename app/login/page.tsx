'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Tentando login com:', { email, password });

      // Método 1: Tentar NextAuth primeiro
      console.log('🔄 Método 1: signIn do NextAuth');
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('📦 Resultado do signIn:', result);

      if (result?.error) {
        console.log('❌ NextAuth falhou, tentando método 2...');

        // Método 2: API direta (fallback)
        console.log('🔄 Método 2: API direta');
        const response = await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('📦 Resposta da API:', data);

        if (data.user) {
          // Sucesso com API direta
          console.log('✅ Login via API direta');
          window.location.href = '/dashboard';
          return;
        } else {
          setError(data.error || 'Credenciais inválidas');
        }
      } else {
        // Sucesso com NextAuth
        console.log('✅ Login via NextAuth');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('🔥 Erro no login:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Acesso CRM</h1>
          <p className="text-gray-600">EasyProspect - Sistema de Gestão</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Entrando...</span>
              </div>
            ) : (
              'Acessar Dashboard'
            )}
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            Sistema exclusivo para administradores
          </p>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            <strong>Para teste:</strong> admin@easyprospect.com | senha: senha123
          </p>
        </div>
      </div>
    </div>
  );
}