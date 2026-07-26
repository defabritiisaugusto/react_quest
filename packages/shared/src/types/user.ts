export interface UserDto {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  createdAt: string;
}

export interface UserStatsDto {
  totalXp: number;
  level: number;
  challengesCompleted: number;
  totalChallenges: number;
  worldsUnlocked: number;
  achievementsUnlocked: number;
  currentStreak: number;
}
