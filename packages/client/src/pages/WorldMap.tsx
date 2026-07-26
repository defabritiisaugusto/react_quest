import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useWorlds } from '../api/hooks';
import { useAuthStore } from '../stores/auth-store';

const WORLD_GLYPHS: Record<string, string> = {
  'react-village': 'M12 20 L4 12 L12 4 L20 12 Z',
  'state-forest': 'M12 22 V12 M12 12 L6 18 M12 12 L18 18 M12 8 L8 14 M12 8 L16 14 M12 4 L10 10 M12 4 L14 10',
  'hook-dungeon': 'M4 20 V8 H20 V20 M8 8 V4 H16 V8 M9 12 H15 M9 16 H15',
  'component-kingdom': 'M12 3 L14 9 H20 L15 13 L17 19 L12 15 L7 19 L9 13 L4 9 H10 Z',
};

export function WorldMap() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: worlds, isLoading } = useWorlds();

  if (isLoading) {
    return <div className="text-center py-20 text-parchment-dim">{t('common.loading')}</div>;
  }

  return (
    <div>
      <p className="text-primary-400 text-sm tracking-[0.2em] uppercase font-display mb-2">
        {t('worldsMap.atlas')}
      </p>
      <h1 className="text-3xl font-bold mb-8 text-parchment">{t('nav.worlds')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {worlds?.map((world: {
          id: string;
          slug: string;
          titleKey: string;
          descKey: string;
          unlockXp: number;
          completedChallenges: number;
          totalChallenges: number;
        }) => {
          const isLocked = (user?.xp ?? 0) < world.unlockXp;
          const progress =
            world.totalChallenges > 0
              ? Math.round((world.completedChallenges / world.totalChallenges) * 100)
              : 0;

          return (
            <div
              key={world.id}
              className={`relative fantasy-panel p-6 transition-all ${
                isLocked ? 'opacity-50' : 'hover:border-primary-500/70'
              }`}
            >
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink-900/70 rounded-lg z-10">
                  <span className="text-sm text-parchment-dim font-display tracking-wide">
                    {t('worldsMap.locked', { xp: world.unlockXp })}
                  </span>
                </div>
              )}

              <div className="w-12 h-12 mb-4 rounded-full border border-primary-700/50 bg-ink-800 flex items-center justify-center text-primary-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d={WORLD_GLYPHS[world.slug] || WORLD_GLYPHS['react-village']} />
                </svg>
              </div>
              <h3 className="text-lg font-bold font-display text-parchment mb-1">
                {t(world.titleKey)}
              </h3>
              <p className="text-sm text-parchment-dim mb-4">{t(world.descKey)}</p>

              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-parchment-dim">
                  {world.completedChallenges}/{world.totalChallenges} {t('worldsMap.challenges')}
                </span>
                <span className="text-primary-400">{progress}%</span>
              </div>
              <div className="h-2 bg-ink-800 rounded-full overflow-hidden border border-primary-900/40">
                <div
                  className="h-full bg-gradient-to-r from-accent-600 to-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {!isLocked && (
                <Link
                  to={`/worlds/${world.slug}`}
                  className="mt-4 inline-block text-sm fantasy-link font-display"
                >
                  {t('worldsMap.enter')} →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
