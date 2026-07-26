export interface AchievementDto {
  id: string;
  slug: string;
  nameKey: string;
  descKey: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
}
