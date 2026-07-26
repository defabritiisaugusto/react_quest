import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/auth-store';
import { PlayerAvatar } from '../avatar/PlayerAvatar';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'it' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fantasy-nav">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
        <Link to="/dashboard" className="font-display text-xl font-bold tracking-wide">
          <span className="text-parchment">React</span>{' '}
          <span className="text-primary-400">Quest</span>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            to="/dashboard"
            className="text-sm text-parchment-dim hover:text-primary-300 transition-colors hidden sm:inline"
          >
            {t('nav.dashboard')}
          </Link>
          <Link
            to="/worlds"
            className="text-sm text-parchment-dim hover:text-primary-300 transition-colors hidden sm:inline"
          >
            {t('nav.worlds')}
          </Link>

          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-3 group rounded-full pr-3 pl-1 py-1 border border-primary-900/60 bg-ink-700/60 hover:border-primary-500/50 transition-colors"
              title={t('nav.profile')}
            >
              <PlayerAvatar config={user.avatarConfig} size={36} />
              <span className="text-sm text-xp-400 font-medium hidden md:inline">
                Lv.{user.level} · {user.xp} XP
              </span>
            </Link>
          )}

          <button
            onClick={toggleLang}
            className="text-xs px-2 py-1 rounded border border-primary-900/70 text-parchment-dim hover:text-parchment hover:border-primary-500 transition-colors"
          >
            {i18n.language === 'en' ? 'IT' : 'EN'}
          </button>

          <button
            onClick={handleLogout}
            className="text-sm text-parchment-dim hover:text-danger-500 transition-colors"
          >
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
}
