import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/auth-store';
import { Navigate } from 'react-router-dom';

export function Landing() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl font-extrabold mb-4">
          <span className="text-primary-400">React</span>{' '}
          <span className="text-accent-400">Quest</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Learn React by doing. Complete challenges, earn XP, level up.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-colors"
          >
            {t('auth.register')}
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold rounded-lg transition-colors"
          >
            {t('auth.login')}
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 text-left">
          {[
            { icon: '🎮', title: '10 Worlds', desc: 'From JSX basics to React internals' },
            { icon: '⚔️', title: 'Code Challenges', desc: 'Write real React code in your browser' },
            { icon: '🏆', title: 'Earn XP & Level Up', desc: 'Track your progress with RPG mechanics' },
          ].map((feature) => (
            <div key={feature.title} className="p-4">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
