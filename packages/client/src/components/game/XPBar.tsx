import { motion } from 'framer-motion';

interface XPBarProps {
  current: number;
  needed: number;
  level: number;
}

export function XPBar({ current, needed, level }: XPBarProps) {
  const percentage = Math.min((current / needed) * 100, 100);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-white">Level {level}</span>
        <span className="text-sm text-gray-400">{current} / {needed} XP</span>
      </div>
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-xp-500 to-xp-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-600">Level {level}</span>
        <span className="text-xs text-gray-600">Level {level + 1}</span>
      </div>
    </div>
  );
}
