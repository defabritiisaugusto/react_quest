import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useWorlds } from '../api/hooks';
import { useAuthStore } from '../stores/auth-store';
import { DIFFICULTY_COLORS } from '@react-quest/shared';

const WORLD_EMOJIS: Record<string, string> = {
  'react-village': '🏘️',
  'state-forest': '🌲',
  'hook-dungeon': '🏰',
  'component-kingdom': '👑',
  'routing-realm': '🗺️',
  'state-empire': '🏛️',
  'performance-mountain': '⛰️',
  'testing-arena': '⚔️',
  'react-internals': '🔬',
  'final-boss': '🐉',
};

export function WorldMap() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { data: worlds, isLoading } = useWorlds();

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">{t('common.loading')}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{t('nav.worlds')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {worlds?.map((world: any) => {
          const isLocked = (user?.xp ?? 0) < world.unlockXp;
          const progress = world.totalChallenges > 0
            ? Math.round((world.completedChallenges / world.totalChallenges) * 100)
            : 0;

          return (
            <div key={world.id} className={`relative bg-gray-900 border rounded-xl p-6 transition-all ${isLocked ? 'border-gray-800 opacity-50' : 'border-gray-700 hover:border-primary-500'}`}>
              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950/60 rounded-xl z-10">
                  <span className="text-lg text-gray-400">🔒 {world.unlockXp} XP</span>
                </div>
              )}

              <div className="text-4xl mb-3">{WORLD_EMOJIS[world.slug] || '🌍'}</div>
              <h3 className="text-lg font-bold text-white mb-1">{t(world.titleKey)}</h3>
              <p className="text-sm text-gray-500 mb-4">{t(world.descKey)}</p>

              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">{world.completedChallenges}/{world.totalChallenges} challenges</span>
                <span className="text-primary-400">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {!isLocked && (
                <Link
                  to={`/worlds/${world.slug}`}
                  className="mt-4 inline-block text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Enter World →
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
