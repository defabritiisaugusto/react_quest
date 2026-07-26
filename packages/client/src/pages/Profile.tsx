import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AVATAR_ACCESSORY_COUNT,
  AVATAR_BACKGROUNDS,
  AVATAR_EYE_COLORS,
  AVATAR_HAIR_COLORS,
  AVATAR_HAIR_COUNT,
  AVATAR_OUTFITS,
  AVATAR_SKINS,
  DEFAULT_AVATAR_CONFIG,
  normalizeAvatarConfig,
  type AvatarConfig,
} from '@react-quest/shared';
import { useAuthStore } from '../stores/auth-store';
import { useUpdateAvatar } from '../api/hooks';
import { PlayerAvatar } from '../components/avatar/PlayerAvatar';

type AvatarKey = keyof AvatarConfig;

const OPTION_LIMITS: Record<AvatarKey, number> = {
  skin: AVATAR_SKINS.length,
  hair: AVATAR_HAIR_COUNT,
  hairColor: AVATAR_HAIR_COLORS.length,
  eyes: AVATAR_EYE_COLORS.length,
  accessory: AVATAR_ACCESSORY_COUNT,
  outfit: AVATAR_OUTFITS.length,
  background: AVATAR_BACKGROUNDS.length,
};

const OPTION_KEYS: AvatarKey[] = [
  'skin',
  'hair',
  'hairColor',
  'eyes',
  'accessory',
  'outfit',
  'background',
];

export function Profile() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const updateAvatar = useUpdateAvatar();

  const [draft, setDraft] = useState<AvatarConfig>(() =>
    normalizeAvatarConfig(user?.avatarConfig ?? DEFAULT_AVATAR_CONFIG),
  );
  const [saved, setSaved] = useState(false);

  const cycle = (key: AvatarKey, delta: number) => {
    setDraft((prev) => {
      const max = OPTION_LIMITS[key];
      const next = (prev[key] + delta + max) % max;
      return { ...prev, [key]: next };
    });
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      const result = await updateAvatar.mutateAsync(draft);
      updateUser({ avatarConfig: result.avatarConfig });
      setSaved(true);
    } catch {
      /* mutation state */
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <p className="text-primary-400 text-sm tracking-[0.2em] uppercase font-display mb-2">
          {t('profile.heraldry')}
        </p>
        <h1 className="text-3xl font-bold text-parchment">{t('profile.title')}</h1>
        <p className="text-parchment-dim mt-2">{t('profile.subtitle')}</p>
      </div>

      <div className="fantasy-panel-ornate p-8 flex flex-col md:flex-row items-center gap-10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary-500/20 blur-xl scale-110" />
            <PlayerAvatar config={draft} size={160} className="relative shadow-2xl" />
          </div>
          <p className="font-display text-xl text-primary-300">{user?.username}</p>
          <p className="text-sm text-parchment-dim">
            {t('dashboard.level', { level: user?.level ?? 1 })} · {user?.xp ?? 0} XP
          </p>
        </div>

        <div className="flex-1 w-full space-y-3">
          {OPTION_KEYS.map((key) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 py-2 border-b border-primary-900/40 last:border-0"
            >
              <span className="text-sm text-parchment-dim font-medium min-w-28">
                {t(`profile.options.${key}`)}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => cycle(key, -1)}
                  className="w-9 h-9 rounded border border-primary-800 text-primary-400 hover:bg-ink-600 transition-colors font-display"
                  aria-label="previous"
                >
                  ‹
                </button>
                <span className="w-10 text-center text-sm text-parchment tabular-nums">
                  {draft[key] + 1}/{OPTION_LIMITS[key]}
                </span>
                <button
                  type="button"
                  onClick={() => cycle(key, 1)}
                  className="w-9 h-9 rounded border border-primary-800 text-primary-400 hover:bg-ink-600 transition-colors font-display"
                  aria-label="next"
                >
                  ›
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={updateAvatar.isPending}
              className="fantasy-btn"
            >
              {updateAvatar.isPending ? t('common.loading') : t('profile.save')}
            </button>
            {saved && (
              <span className="text-success-500 text-sm">{t('profile.saved')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
