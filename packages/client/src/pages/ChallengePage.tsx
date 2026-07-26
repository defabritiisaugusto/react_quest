import { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useActiveCode,
} from '@codesandbox/sandpack-react';
import { useChallenge, useSubmitSolution } from '../api/hooks';
import { useAuthStore } from '../stores/auth-store';
import { useGameStore } from '../stores/game-store';
import { runEvaluation } from '../lib/evaluation/evaluator';
import type { ChallengeTestDefinition } from '@react-quest/shared';

function fireSuccessConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.65 },
    colors: ['#c9a227', '#52b788', '#e8c547', '#e8e4d4', '#2d6a4f'],
  });
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 },
    colors: ['#c9a227', '#52b788', '#e8e4d4'],
  });
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.7 },
    colors: ['#c9a227', '#52b788', '#e8e4d4'],
  });
}

export function ChallengePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: challenge, isLoading } = useChallenge(id!);

  if (isLoading || !challenge) {
    return <div className="text-center py-20 text-parchment-dim">{t('common.loading')}</div>;
  }

  return (
    <SandpackProvider
      key={challenge.id}
      template="react"
      theme="dark"
      files={{ '/App.js': { code: challenge.initialCode, active: true } }}
      options={{ visibleFiles: ['/App.js'] }}
    >
      <ChallengeContent challenge={challenge} />
    </SandpackProvider>
  );
}

interface ChallengeData {
  id: string;
  titleKey: string;
  descriptionKey: string;
  initialCode: string;
  expectedConcept: string;
  tests: ChallengeTestDefinition[];
  hints: string[] | null;
  xpReward: number;
  completed: boolean;
  level?: { id: string; titleKey: string; world?: { id: string; slug: string; titleKey: string } };
}

function ChallengeContent({ challenge }: { challenge: ChallengeData }) {
  const { t } = useTranslation();
  const { code } = useActiveCode();
  const submitMutation = useSubmitSolution();
  const updateUser = useAuthStore((s) => s.updateUser);
  const addNotification = useGameStore((s) => s.addNotification);

  const [testResults, setTestResults] = useState<
    { description: string; passed: boolean; message?: string }[] | null
  >(null);
  const [submitted, setSubmitted] = useState(false);
  const [nextChallengeId, setNextChallengeId] = useState<string | null>(null);

  useEffect(() => {
    setTestResults(null);
    setSubmitted(false);
    setNextChallengeId(null);
  }, [challenge.id]);

  const handleRunTests = useCallback(() => {
    const results = runEvaluation(code, challenge.tests);
    setTestResults(results);
  }, [code, challenge.tests]);

  const handleSubmit = useCallback(async () => {
    if (!testResults) return;

    const passed = testResults.every((r) => r.passed);
    const score = Math.round(
      (testResults.filter((r) => r.passed).length / testResults.length) * 100,
    );

    try {
      const result = await submitMutation.mutateAsync({
        challengeId: challenge.id,
        code,
        passed,
        score,
        testResults,
      });

      setSubmitted(true);

      if (passed) {
        fireSuccessConfetti();
        setNextChallengeId(result.nextChallengeId ?? null);
      }

      if (result.xpEarned > 0) {
        addNotification({
          type: 'xp',
          message: t('challenge.xpEarned', { xp: result.xpEarned }),
          value: result.xpEarned,
        });
        updateUser({ xp: (useAuthStore.getState().user?.xp ?? 0) + result.xpEarned });
      }

      if (result.levelUp && result.newLevel) {
        addNotification({
          type: 'level-up',
          message: t('challenge.levelUp', { level: result.newLevel }),
        });
        updateUser({ level: result.newLevel });
      }
    } catch {
      // handled by mutation state
    }
  }, [challenge.id, testResults, code, submitMutation, addNotification, updateUser, t]);

  const allPassed = testResults?.every((r) => r.passed) ?? false;
  const showNextLevel = submitted && !!nextChallengeId;
  const worldSlug = challenge.level?.world?.slug;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          {challenge.level?.world && (
            <Link
              to={`/worlds/${challenge.level.world.slug}`}
              className="text-sm text-parchment-dim hover:text-primary-300 transition-colors"
            >
              &larr; {t(challenge.level.world.titleKey)}
            </Link>
          )}
          <h1 className="text-2xl font-bold mt-1 text-parchment">{t(challenge.titleKey)}</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xp-400 font-medium font-display">{challenge.xpReward} XP</span>
          {challenge.completed && !submitted && (
            <span className="text-success-500 text-sm">{t('challenge.alreadyCompleted')}</span>
          )}
          {showNextLevel && (
            <Link to={`/challenge/${nextChallengeId}`} className="fantasy-btn text-sm px-4 py-2">
              {t('challenge.nextLevel')}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
          {submitted && !nextChallengeId && worldSlug && (
            <Link to={`/worlds/${worldSlug}`} className="fantasy-btn text-sm px-4 py-2">
              {t('challenge.backToLevels')}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </div>

      <div className="fantasy-panel p-4">
        <h2 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-2 font-display">
          {t('challenge.objective')}
        </h2>
        <p className="text-parchment-dim">{t(challenge.descriptionKey)}</p>
      </div>

      <div className="rounded-lg overflow-hidden border border-primary-900/60 shadow-lg shadow-black/30">
        <SandpackLayout>
          <SandpackCodeEditor style={{ height: '450px' }} showLineNumbers showTabs={false} />
          <SandpackPreview
            style={{ height: '450px' }}
            showOpenInCodeSandbox={false}
            showRefreshButton
          />
        </SandpackLayout>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={handleRunTests} className="fantasy-btn-ghost">
          {t('challenge.runTests')}
        </button>

        {testResults && allPassed && !submitted && (
          <button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="fantasy-btn"
          >
            {submitMutation.isPending ? t('common.loading') : t('challenge.submitSolution')}
          </button>
        )}

        {submitted && (
          <span className="text-success-500 text-sm font-medium font-display">
            {t('challenge.allTestsPassed')}
          </span>
        )}
      </div>

      {testResults && (
        <div className="fantasy-panel p-4 space-y-2">
          <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider font-display">
            {t('challenge.testsPassed', {
              passed: testResults.filter((r) => r.passed).length,
              total: testResults.length,
            })}
          </h3>
          {testResults.map((result, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 text-sm ${result.passed ? 'text-success-500' : 'text-danger-500'}`}
            >
              <span>{result.passed ? '✓' : '✗'}</span>
              <span>{result.description}</span>
              {result.message && (
                <span className="text-parchment-dim/60 ml-2">&mdash; {result.message}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <CodexSection descriptionKey={challenge.descriptionKey} />

      {challenge.hints && challenge.hints.length > 0 && (
        <HintsSection hints={challenge.hints} />
      )}
    </div>
  );
}

type ChallengeDocs = {
  summary: string;
  concepts: { title: string; text: string }[];
  example?: string;
};

function CodexSection({ descriptionKey }: { descriptionKey: string }) {
  const { t, i18n } = useTranslation();
  const docsKey = descriptionKey.replace(/\.desc$/, '.docs');
  const docs = t(docsKey, { returnObjects: true }) as ChallengeDocs | string;

  if (!docs || typeof docs === 'string' || !docs.summary) {
    return null;
  }

  return (
    <div className="fantasy-panel p-4 space-y-4">
      <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider font-display">
        {t('challenge.codex')}
      </h3>
      <p className="text-sm text-parchment-dim leading-relaxed">{docs.summary}</p>

      {Array.isArray(docs.concepts) && docs.concepts.length > 0 && (
        <dl className="space-y-3">
          {docs.concepts.map((concept) => (
            <div key={concept.title}>
              <dt className="text-sm font-semibold text-parchment font-display mb-0.5">
                {concept.title}
              </dt>
              <dd className="text-sm text-parchment-dim leading-relaxed">{concept.text}</dd>
            </div>
          ))}
        </dl>
      )}

      {docs.example && (
        <div>
          <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2 font-display">
            {t('challenge.example')}
          </p>
          <pre
            key={i18n.language}
            className="text-xs leading-relaxed overflow-x-auto rounded-md bg-ink-900/80 border border-primary-900/50 p-3 text-accent-400 font-mono whitespace-pre"
          >
            <code>{docs.example}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

function HintsSection({ hints }: { hints: string[] }) {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(0);

  return (
    <div className="fantasy-panel p-4">
      <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-2 font-display">
        {t('challenge.hints')}
      </h3>
      {hints.slice(0, visibleCount).map((hint, i) => (
        <p key={i} className="text-sm text-parchment-dim mb-1">
          {hint}
        </p>
      ))}
      {visibleCount < hints.length && (
        <button
          onClick={() => setVisibleCount((c) => c + 1)}
          className="text-sm fantasy-link mt-1"
        >
          {t('challenge.showHint')}
        </button>
      )}
    </div>
  );
}
