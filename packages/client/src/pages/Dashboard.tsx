import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth-store';
import { useUserStats } from '../api/hooks';
import { XPBar } from '../components/game/XPBar';

export function Dashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: stats, isLoading } = useUserStats();

  if (isLoading || !stats) {
    return <div className="text-center py-20 text-gray-500">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.welcome', { username: user?.username })}</h1>
        <p className="text-gray-500 mt-1">{t('dashboard.level', { level: stats.level })}</p>
      </div>

      <XPBar current={stats.xpProgress.current} needed={stats.xpProgress.needed} level={stats.level} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label={t('dashboard.challengesCompleted')} value={`${stats.challengesCompleted} / ${stats.totalChallenges}`} />
        <StatCard label="Level" value={String(stats.level)} />
        <StatCard label="Total XP" value={String(stats.totalXp)} />
      </div>

      <Link
        to="/worlds"
        className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-colors"
      >
        {t('dashboard.continueQuest')}
      </Link>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
