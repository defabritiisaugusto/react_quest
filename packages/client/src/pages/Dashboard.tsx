import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/auth-store';
import { useUserStats } from '../api/hooks';
import { XPBar } from '../components/game/XPBar';
import { PlayerAvatar } from '../components/avatar/PlayerAvatar';

export function Dashboard() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: stats, isLoading } = useUserStats();

  if (isLoading || !stats) {
    return <div className="text-center py-20 text-parchment-dim">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-5">
        <Link to="/profile" className="shrink-0">
          <PlayerAvatar config={user?.avatarConfig} size={72} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-parchment">
            {t('dashboard.welcome', { username: user?.username })}
          </h1>
          <p className="text-parchment-dim mt-1">
            {t('dashboard.level', { level: stats.level })}
          </p>
        </div>
      </div>

      <XPBar current={stats.xpProgress.current} needed={stats.xpProgress.needed} level={stats.level} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label={t('dashboard.challengesCompleted')}
          value={`${stats.challengesCompleted} / ${stats.totalChallenges}`}
        />
        <StatCard label={t('dashboard.heroLevel')} value={String(stats.level)} />
        <StatCard label={t('dashboard.totalXp')} value={String(stats.totalXp)} />
      </div>

      <Link to="/worlds" className="fantasy-btn">
        {t('dashboard.continueQuest')}
      </Link>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="fantasy-panel p-6">
      <p className="text-sm text-parchment-dim mb-1">{label}</p>
      <p className="text-2xl font-bold font-display text-primary-300">{value}</p>
    </div>
  );
}
