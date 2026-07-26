import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/auth-store';
import { Navigate } from 'react-router-dom';

export function Landing() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(201,162,39,0.15), transparent 35%),
            radial-gradient(circle at 80% 20%, rgba(45,106,79,0.25), transparent 40%),
            linear-gradient(to top, #0c1210 0%, transparent 45%)
          `,
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 1200 800"
        aria-hidden="true"
      >
        <path d="M0 520 L180 380 L320 460 L480 280 L640 400 L820 240 L1000 360 L1200 220 L1200 800 L0 800 Z" fill="#1a2420" />
        <path d="M0 620 L220 500 L400 580 L560 420 L740 540 L960 380 L1200 480 L1200 800 L0 800 Z" fill="#121a17" />
        <circle cx="920" cy="120" r="48" fill="#e8c547" opacity="0.35" />
      </svg>

      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-sm tracking-[0.35em] uppercase text-primary-400 mb-4"
        >
          {t('landing.tagline')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl sm:text-7xl font-bold mb-5"
        >
          <span className="text-parchment">React</span>{' '}
          <span className="text-primary-400">Quest</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-parchment-dim max-w-xl mb-10"
        >
          {t('landing.subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link to="/register" className="fantasy-btn px-10 py-3 text-base">
            {t('landing.beginQuest')}
          </Link>
          <Link to="/login" className="fantasy-btn-ghost px-10 py-3 text-base">
            {t('auth.login')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
