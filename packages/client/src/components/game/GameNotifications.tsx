import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../stores/game-store';

export function GameNotifications() {
  const notifications = useGameStore((s) => s.notifications);

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm pointer-events-auto font-medium ${
              n.type === 'xp'
                ? 'bg-xp-500/20 border border-xp-500/40 text-xp-400'
                : n.type === 'level-up'
                  ? 'bg-accent-500/20 border border-accent-500/40 text-accent-400'
                  : 'bg-primary-500/20 border border-primary-500/40 text-primary-400'
            }`}
          >
            {n.type === 'level-up' && '🎉 '}
            {n.type === 'xp' && '⭐ '}
            {n.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
