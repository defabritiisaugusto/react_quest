export const XP_PER_LEVEL = 500;

export function getXpForLevel(level: number): number {
  return level * XP_PER_LEVEL;
}

export function getLevelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getXpProgress(xp: number): { current: number; needed: number; percentage: number } {
  const level = getLevelFromXp(xp);
  const xpForCurrentLevel = (level - 1) * XP_PER_LEVEL;
  const current = xp - xpForCurrentLevel;
  const needed = XP_PER_LEVEL;
  return { current, needed, percentage: Math.round((current / needed) * 100) };
}
