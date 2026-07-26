import { motion } from 'framer-motion';

interface XPBarProps {
  current: number;
  needed: number;
  level: number;
}

export function XPBar({ current, needed, level }: XPBarProps) {
  const percentage = Math.min((current / needed) * 100, 100);

  return (
    <div className="fantasy-panel p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold font-display text-parchment">
          Level {level}
        </span>
        <span className="text-sm text-parchment-dim">
          {current} / {needed} XP
        </span>
      </div>
      <div className="h-3 bg-ink-800 rounded-full overflow-hidden border border-primary-900/50">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-700 via-xp-500 to-xp-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-parchment-dim/60">Level {level}</span>
        <span className="text-xs text-parchment-dim/60">Level {level + 1}</span>
      </div>
    </div>
  );
}
