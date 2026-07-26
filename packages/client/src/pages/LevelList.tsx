import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLevels, useChallenges } from '../api/hooks';

export function LevelList() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: levels, isLoading } = useLevels(slug!);

  if (isLoading) {
    return <div className="text-center py-20 text-parchment-dim">{t('common.loading')}</div>;
  }

  return (
    <div>
      <Link to="/worlds" className="text-sm text-parchment-dim hover:text-primary-300 transition-colors mb-4 inline-block">
        ← {t('common.back')}
      </Link>
      <h1 className="font-display text-3xl font-bold mb-8 text-parchment">
        {t(`worlds.${toCamelCase(slug!)}.title`)}
      </h1>

      <div className="space-y-4">
        {levels?.map((level: {
          id: string;
          titleKey: string;
          descKey: string;
          difficulty: string;
          completedChallenges: number;
          challengesCount: number;
        }) => {
          const isComplete =
            level.completedChallenges === level.challengesCount && level.challengesCount > 0;

          return <LevelCard key={level.id} level={level} isComplete={isComplete} />;
        })}
      </div>
    </div>
  );
}

function LevelCard({
  level,
  isComplete,
}: {
  level: {
    id: string;
    titleKey: string;
    descKey: string;
    difficulty: string;
    completedChallenges: number;
    challengesCount: number;
  };
  isComplete: boolean;
}) {
  const { t } = useTranslation();
  const { data: challenges } = useChallenges(level.id);

  const firstIncomplete = challenges?.find((c: { completed: boolean }) => !c.completed);

  return (
    <div
      className={`fantasy-panel p-6 ${
        isComplete ? 'border-success-500/40' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold font-display text-parchment">
              {t(level.titleKey)}
            </h3>
            {isComplete && <span className="text-success-500 text-sm">✓</span>}
          </div>
          <p className="text-sm text-parchment-dim">{t(level.descKey)}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className={`fantasy-badge ${difficultyStyle(level.difficulty)}`}>
              {t(`difficulty.${level.difficulty}`)}
            </span>
            <span className="text-xs text-parchment-dim">
              {level.completedChallenges}/{level.challengesCount} {t('worldsMap.challenges')}
            </span>
          </div>
        </div>

        {firstIncomplete && (
          <Link to={`/challenge/${firstIncomplete.id}`} className="fantasy-btn text-sm px-4 py-2 shrink-0">
            {isComplete ? t('levels.replay') : t('levels.start')}
          </Link>
        )}
      </div>
    </div>
  );
}

function difficultyStyle(difficulty: string) {
  const styles: Record<string, string> = {
    BEGINNER: 'text-success-500 border-success-500/30',
    EASY: 'text-accent-400 border-accent-400/30',
    MEDIUM: 'text-xp-400 border-xp-400/30',
    HARD: 'text-danger-500 border-danger-500/30',
    EXPERT: 'text-primary-300 border-primary-500/30',
  };
  return styles[difficulty] || styles.BEGINNER;
}

function toCamelCase(slug: string) {
  return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
