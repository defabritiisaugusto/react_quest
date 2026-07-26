import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../api/hooks';
import { useAuthStore } from '../stores/auth-store';

export function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginMutation.mutateAsync({ email, password });
      login(data.user, data.accessToken, data.refreshToken);
      navigate('/dashboard');
    } catch {
      setError(t('auth.loginError'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">{t('auth.loginTitle')}</h1>
        <p className="text-center text-gray-500 mb-8">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-primary-400 hover:underline">
            {t('auth.register')}
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-danger-500/10 border border-danger-500/30 rounded-lg text-danger-500 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-1">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
          >
            {loginMutation.isPending ? t('common.loading') : t('auth.login')}
          </button>
        </form>
      </div>
    </div>
  );
}
