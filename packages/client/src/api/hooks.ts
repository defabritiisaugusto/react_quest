import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';
import type { AuthResponseDto, AvatarConfig } from '@react-quest/shared';

export function useWorlds() {
  return useQuery({
    queryKey: ['worlds'],
    queryFn: async () => {
      const { data } = await api.get('/worlds');
      return data;
    },
  });
}

export function useLevels(worldSlug: string) {
  return useQuery({
    queryKey: ['levels', worldSlug],
    queryFn: async () => {
      const { data } = await api.get(`/worlds/${worldSlug}/levels`);
      return data;
    },
    enabled: !!worldSlug,
  });
}

export function useChallenges(levelId: string) {
  return useQuery({
    queryKey: ['challenges', levelId],
    queryFn: async () => {
      const { data } = await api.get(`/levels/${levelId}/challenges`);
      return data;
    },
    enabled: !!levelId,
  });
}

export function useChallenge(id: string) {
  return useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      const { data } = await api.get(`/challenges/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUserStats() {
  return useQuery({
    queryKey: ['user', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/users/me/stats');
      return data;
    },
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const { data } = await api.get('/users/me');
      return data;
    },
  });
}

export function useSubmitSolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      challengeId,
      code,
      passed,
      score,
      testResults,
    }: {
      challengeId: string;
      code: string;
      passed: boolean;
      score: number;
      testResults: { description: string; passed: boolean; message?: string }[];
    }) => {
      const { data } = await api.post(`/challenges/${challengeId}/submit`, {
        code,
        passed,
        score,
        testResults,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['worlds'] });
      queryClient.invalidateQueries({ queryKey: ['levels'] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data } = await api.post<AuthResponseDto>('/auth/login', { email, password });
      return data;
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => {
      const { data } = await api.post<AuthResponseDto>('/auth/register', {
        username,
        email,
        password,
      });
      return data;
    },
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (avatarConfig: AvatarConfig) => {
      const { data } = await api.patch('/users/me/avatar', { avatarConfig });
      return data as {
        id: string;
        username: string;
        email: string;
        xp: number;
        level: number;
        avatarConfig: AvatarConfig;
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
