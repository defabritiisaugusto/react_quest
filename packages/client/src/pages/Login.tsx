import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../api/hooks';
import { PasswordInput } from '../components/ui/PasswordInput';
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md fantasy-panel-ornate p-8">
        <h1 className="font-display text-3xl font-bold text-center mb-2 text-parchment">
          {t('auth.loginTitle')}
        </h1>
        <p className="text-center text-parchment-dim mb-8">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="fantasy-link">
            {t('auth.register')}
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {error && (
            <div className="p-3 bg-danger-500/10 border border-danger-500/30 rounded-md text-danger-500 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-parchment-dim mb-1">{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="fantasy-input"
            />
          </div>

          <div>
            <label className="block text-sm text-parchment-dim mb-1">{t('auth.password')}</label>
            <PasswordInput
              value={password}
              onChange={setPassword}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loginMutation.isPending} className="fantasy-btn w-full py-3">
            {loginMutation.isPending ? t('common.loading') : t('auth.login')}
          </button>
        </form>
      </div>
    </div>
  );
}
