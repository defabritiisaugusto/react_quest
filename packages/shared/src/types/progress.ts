export interface ProgressDto {
  id: string;
  userId: string;
  challengeId: string;
  completed: boolean;
  userCode: string | null;
  score: number;
  attempts: number;
  completedAt: string | null;
}
