import { create } from 'zustand';
import {
  DEFAULT_AVATAR_CONFIG,
  normalizeAvatarConfig,
  type AvatarConfig,
} from '@react-quest/shared';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  avatarConfig: AvatarConfig;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => void;
}

function parseStoredUser(raw: string | null): AuthUser | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      avatarConfig: normalizeAvatarConfig(parsed.avatarConfig ?? DEFAULT_AVATAR_CONFIG),
    };
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: parseStoredUser(localStorage.getItem('user')),
  isAuthenticated: !!localStorage.getItem('accessToken'),

  login: (user, accessToken, refreshToken) => {
    const normalized = {
      ...user,
      avatarConfig: normalizeAvatarConfig(user.avatarConfig),
    };
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(normalized));
    set({ user: normalized, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (updates) =>
    set((state) => {
      if (!state.user) return { user: null };
      const user = {
        ...state.user,
        ...updates,
        avatarConfig: normalizeAvatarConfig(
          updates.avatarConfig ?? state.user.avatarConfig,
        ),
      };
      localStorage.setItem('user', JSON.stringify(user));
      return { user };
    }),
}));
