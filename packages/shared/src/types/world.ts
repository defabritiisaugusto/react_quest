export interface WorldDto {
  id: string;
  slug: string;
  titleKey: string;
  descKey: string;
  order: number;
  iconUrl: string | null;
  unlockXp: number;
  levelsCount: number;
  completedLevels: number;
}
