import { useState, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

export function ChallengePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: challenge, isLoading } = useChallenge(id!);

  if (isLoading || !challenge) {
    return <div className="text-center py-20 text-gray-500">{t('common.loading')}</div>;
  }

  return (
    <SandpackProvider
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          {challenge.level?.world && (
            <Link
              to={`/worlds/${challenge.level.world.slug}`}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              &larr; {t(challenge.level.world.titleKey)}
            </Link>
          )}
          <h1 className="text-2xl font-bold mt-1">{t(challenge.titleKey)}</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xp-400 font-medium">{challenge.xpReward} XP</span>
          {challenge.completed && (
            <span className="text-success-500 text-sm">{t('challenge.alreadyCompleted')}</span>
          )}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-gray-400 uppercase mb-2">
          {t('challenge.objective')}
        </h2>
        <p className="text-gray-300">{t(challenge.descriptionKey)}</p>
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-800">
        <SandpackLayout>
          <SandpackCodeEditor style={{ height: '450px' }} showLineNumbers showTabs={false} />
          <SandpackPreview
            style={{ height: '450px' }}
            showOpenInCodeSandbox={false}
            showRefreshButton
          />
        </SandpackLayout>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleRunTests}
          className="px-6 py-2.5 bg-accent-600 hover:bg-accent-500 text-white font-medium rounded-lg transition-colors"
        >
          {t('challenge.runTests')}
        </button>

        {testResults && allPassed && !submitted && (
          <button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="px-6 py-2.5 bg-success-500 hover:bg-green-400 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {submitMutation.isPending ? t('common.loading') : t('challenge.submitSolution')}
          </button>
        )}
      </div>

      {testResults && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 uppercase">
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
                <span className="text-gray-500 ml-2">&mdash; {result.message}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {challenge.hints && challenge.hints.length > 0 && (
        <HintsSection hints={challenge.hints} />
      )}
    </div>
  );
}

function HintsSection({ hints }: { hints: string[] }) {
  const { t } = useTranslation();
  const [visibleCount, setVisibleCount] = useState(0);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase mb-2">
        {t('challenge.hints')}
      </h3>
      {hints.slice(0, visibleCount).map((hint, i) => (
        <p key={i} className="text-sm text-gray-400 mb-1">
          {hint}
        </p>
      ))}
      {visibleCount < hints.length && (
        <button
          onClick={() => setVisibleCount((c) => c + 1)}
          className="text-sm text-accent-400 hover:text-accent-300 transition-colors mt-1"
        >
          {t('challenge.showHint')}
        </button>
      )}
    </div>
  );
}
