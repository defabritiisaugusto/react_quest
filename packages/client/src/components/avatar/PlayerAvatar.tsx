import { useId } from 'react';
import {
  AVATAR_ACCESSORY_COUNT,
  AVATAR_BACKGROUNDS,
  AVATAR_EYE_COLORS,
  AVATAR_HAIR_COLORS,
  AVATAR_HAIR_COUNT,
  AVATAR_OUTFITS,
  AVATAR_SKINS,
  normalizeAvatarConfig,
  type AvatarConfig,
} from '@react-quest/shared';

interface PlayerAvatarProps {
  config?: Partial<AvatarConfig> | null;
  size?: number;
  className?: string;
}

export function PlayerAvatar({ config, size = 40, className = '' }: PlayerAvatarProps) {
  const uid = useId().replace(/:/g, '');
  const avatar = normalizeAvatarConfig(config);
  const skin = AVATAR_SKINS[avatar.skin];
  const hairColor = AVATAR_HAIR_COLORS[avatar.hairColor];
  const eyeColor = AVATAR_EYE_COLORS[avatar.eyes];
  const outfit = AVATAR_OUTFITS[avatar.outfit];
  const bg = AVATAR_BACKGROUNDS[avatar.background];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={`rounded-full shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={`avatar-clip-${uid}`}>
          <circle cx="40" cy="40" r="40" />
        </clipPath>
        <linearGradient id={`frame-glow-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8c547" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7a5a0a" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#avatar-clip-${uid})`}>
        <rect width="80" height="80" fill={bg} />
        <circle cx="40" cy="68" r="28" fill={outfit} />
        <ellipse cx="40" cy="42" rx="18" ry="20" fill={skin} />
        <HairStyle style={avatar.hair} color={hairColor} />
        <circle cx="33" cy="42" r="2.2" fill={eyeColor} />
        <circle cx="47" cy="42" r="2.2" fill={eyeColor} />
        <path d="M34 50 Q40 54 46 50" fill="none" stroke="#5c3a21" strokeWidth="1.4" strokeLinecap="round" />
        <Accessory type={avatar.accessory} hairColor={hairColor} outfit={outfit} />
      </g>

      <circle cx="40" cy="40" r="38.5" fill="none" stroke={`url(#frame-glow-${uid})`} strokeWidth="3" />
    </svg>
  );
}

function HairStyle({ style, color }: { style: number; color: string }) {
  switch (style % AVATAR_HAIR_COUNT) {
    case 1:
      return (
        <>
          <ellipse cx="40" cy="28" rx="20" ry="12" fill={color} />
          <path d="M20 34 Q18 22 40 18 Q62 22 60 34 Q52 26 40 26 Q28 26 20 34" fill={color} />
        </>
      );
    case 2:
      return (
        <>
          <path d="M22 36 Q20 16 40 14 Q60 16 58 36 L55 30 Q40 22 25 30 Z" fill={color} />
          <path d="M24 34 L18 48 L26 40 Z" fill={color} />
          <path d="M56 34 L62 48 L54 40 Z" fill={color} />
        </>
      );
    case 3:
      return <path d="M24 38 Q22 20 40 16 Q58 20 56 38 Q48 28 40 28 Q32 28 24 38" fill={color} />;
    case 4:
      return (
        <>
          <ellipse cx="40" cy="26" rx="18" ry="10" fill={color} />
          <rect x="28" y="24" width="24" height="8" fill={color} />
        </>
      );
    default:
      return <ellipse cx="40" cy="30" rx="16" ry="8" fill={color} opacity={0.85} />;
  }
}

function Accessory({
  type,
  hairColor,
  outfit,
}: {
  type: number;
  hairColor: string;
  outfit: string;
}) {
  switch (type % AVATAR_ACCESSORY_COUNT) {
    case 1:
      return (
        <path
          d="M18 34 Q40 10 62 34 L58 36 Q40 18 22 36 Z"
          fill="#2d6a4f"
          stroke="#1b4332"
          strokeWidth="1"
        />
      );
    case 2:
      return (
        <>
          <path d="M22 30 L40 18 L58 30 L54 36 L26 36 Z" fill="#8a8f98" stroke="#4a4e56" strokeWidth="1" />
          <rect x="34" y="28" width="12" height="6" fill="#c9a227" />
        </>
      );
    case 3:
      return (
        <>
          <path d="M28 22 L40 8 L52 22 L48 24 L40 14 L32 24 Z" fill="#6b2d5c" />
          <ellipse cx="40" cy="24" rx="18" ry="6" fill="#6b2d5c" />
          <circle cx="40" cy="10" r="3" fill="#c9a227" />
        </>
      );
    case 4:
      return (
        <>
          <path d="M26 20 L40 8 L54 20 L50 22 L40 12 L30 22 Z" fill="#c9a227" />
          <circle cx="40" cy="10" r="2.5" fill="#e8c547" />
        </>
      );
    case 5:
      return (
        <path
          d="M20 38 Q40 28 60 38 Q40 34 20 38"
          fill={outfit}
          stroke={hairColor}
          strokeWidth="1.5"
        />
      );
    default:
      return null;
  }
}

