import { AST_CHECKS } from './ast-checker';
import type { ChallengeTestDefinition } from '@react-quest/shared';

interface TestResult {
  description: string;
  passed: boolean;
  message?: string;
}

export function runEvaluation(code: string, tests: ChallengeTestDefinition[]): TestResult[] {
  return tests.map((test) => {
    if (test.type === 'ast') {
      const checkFn = AST_CHECKS[test.check];
      if (!checkFn) {
        return { description: test.description, passed: false, message: `Unknown check: ${test.check}` };
      }
      const result = checkFn(code, test.args);
      return { description: test.description, ...result };
    }

    if (test.type === 'structure') {
      const checkFn = AST_CHECKS[test.check];
      if (!checkFn) {
        return { description: test.description, passed: false, message: `Unknown check: ${test.check}` };
      }
      const result = checkFn(code, test.args);
      return { description: test.description, ...result };
    }

    return { description: test.description, passed: true, message: 'Output checks run in preview' };
  });
}
