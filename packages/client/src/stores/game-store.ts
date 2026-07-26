import { create } from 'zustand';

interface GameNotification {
  id: string;
  type: 'xp' | 'level-up' | 'achievement';
  message: string;
  value?: number;
}

interface GameState {
  notifications: GameNotification[];
  addNotification: (notification: Omit<GameNotification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = crypto.randomUUID();
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 4000);
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
