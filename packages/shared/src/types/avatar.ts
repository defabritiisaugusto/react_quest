export interface AvatarConfig {
  skin: number;
  hair: number;
  hairColor: number;
  eyes: number;
  accessory: number;
  outfit: number;
  background: number;
}

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  skin: 1,
  hair: 1,
  hairColor: 2,
  eyes: 0,
  accessory: 0,
  outfit: 1,
  background: 0,
};

export const AVATAR_SKINS = ['#f5d0b0', '#e0ac69', '#c68642', '#8d5524', '#5c3a21'] as const;
export const AVATAR_HAIR_COLORS = ['#1a1a1a', '#4a3728', '#8b4513', '#c9a227', '#2d6a4f', '#6b2d5c'] as const;
export const AVATAR_EYE_COLORS = ['#2c3e2d', '#3b5998', '#5c4033', '#1a1a1a', '#2d6a4f'] as const;
export const AVATAR_OUTFITS = ['#3d5a40', '#8b4513', '#1e3a5f', '#6b2d5c', '#4a3728', '#c9a227'] as const;
export const AVATAR_BACKGROUNDS = ['#1a2e24', '#2a1f14', '#1a2430', '#2d1a2e', '#1f2a1a', '#3a2a12'] as const;

export const AVATAR_HAIR_COUNT = 5;
export const AVATAR_ACCESSORY_COUNT = 6;

export function normalizeAvatarConfig(raw: unknown): AvatarConfig {
  const base = { ...DEFAULT_AVATAR_CONFIG };
  if (!raw || typeof raw !== 'object') return base;
  const data = raw as Record<string, unknown>;
  const clamp = (value: unknown, max: number, fallback: number) => {
    const n = typeof value === 'number' ? value : fallback;
    return Math.max(0, Math.min(max, Math.floor(n)));
  };
  return {
    skin: clamp(data.skin, AVATAR_SKINS.length - 1, base.skin),
    hair: clamp(data.hair, AVATAR_HAIR_COUNT - 1, base.hair),
    hairColor: clamp(data.hairColor, AVATAR_HAIR_COLORS.length - 1, base.hairColor),
    eyes: clamp(data.eyes, AVATAR_EYE_COLORS.length - 1, base.eyes),
    accessory: clamp(data.accessory, AVATAR_ACCESSORY_COUNT - 1, base.accessory),
    outfit: clamp(data.outfit, AVATAR_OUTFITS.length - 1, base.outfit),
    background: clamp(data.background, AVATAR_BACKGROUNDS.length - 1, base.background),
  };
}
