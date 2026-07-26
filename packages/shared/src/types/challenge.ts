export interface ChallengeTestDefinition {
  type: 'ast' | 'output' | 'structure';
  description: string;
  check: string;
  args: Record<string, unknown>;
}

export interface ChallengeDto {
  id: string;
  levelId: string;
  titleKey: string;
  descriptionKey: string;
  initialCode: string;
  expectedConcept: string;
  tests: ChallengeTestDefinition[];
  hints: string[] | null;
  xpReward: number;
  order: number;
  completed: boolean;
}

export interface SubmitSolutionDto {
  code: string;
}

export interface SubmitResultDto {
  passed: boolean;
  score: number;
  xpEarned: number;
  testResults: TestResultDto[];
  levelUp: boolean;
  newLevel: number | null;
  nextChallengeId: string | null;
}

export interface TestResultDto {
  description: string;
  passed: boolean;
  message?: string;
}
