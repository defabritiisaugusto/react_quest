import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/auth-store';

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
    <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between h-16">
        <Link to="/dashboard" className="text-xl font-bold text-primary-400">
          React Quest
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition-colors">
            {t('nav.dashboard')}
          </Link>
          <Link to="/worlds" className="text-sm text-gray-400 hover:text-white transition-colors">
            {t('nav.worlds')}
          </Link>

          {user && (
            <span className="text-sm text-xp-400 font-medium">
              Lv.{user.level} — {user.xp} XP
            </span>
          )}

          <button
            onClick={toggleLang}
            className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            {i18n.language === 'en' ? 'IT' : 'EN'}
          </button>

          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-danger-500 transition-colors"
          >
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </nav>
  );
}
