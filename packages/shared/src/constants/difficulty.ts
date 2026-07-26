export enum Difficulty {
  BEGINNER = 'BEGINNER',
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT',
}

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  [Difficulty.BEGINNER]: 'Beginner',
  [Difficulty.EASY]: 'Easy',
  [Difficulty.MEDIUM]: 'Medium',
  [Difficulty.HARD]: 'Hard',
  [Difficulty.EXPERT]: 'Expert',
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  [Difficulty.BEGINNER]: '#22c55e',
  [Difficulty.EASY]: '#3b82f6',
  [Difficulty.MEDIUM]: '#f59e0b',
  [Difficulty.HARD]: '#ef4444',
  [Difficulty.EXPERT]: '#a855f7',
};
