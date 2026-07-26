import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  getLevelFromXp,
  getXpProgress,
  normalizeAvatarConfig,
  type AvatarConfig,
} from '@react-quest/shared';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        xp: true,
        level: true,
        avatarConfig: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return {
      ...user,
      avatarConfig: normalizeAvatarConfig(user.avatarConfig),
    };
  }

  async updateAvatar(userId: string, avatarConfig: AvatarConfig) {
    const normalized = normalizeAvatarConfig(avatarConfig);
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatarConfig: normalized as unknown as Prisma.InputJsonValue },
      select: {
        id: true,
        username: true,
        email: true,
        xp: true,
        level: true,
        avatarConfig: true,
      },
    });
    return {
      ...user,
      avatarConfig: normalizeAvatarConfig(user.avatarConfig),
    };
  }

  async getStats(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const [completedCount, totalCount, achievementCount] = await Promise.all([
      this.prisma.progress.count({ where: { userId, completed: true } }),
      this.prisma.challenge.count(),
      this.prisma.userAchievement.count({ where: { userId } }),
    ]);

    const xpProgress = getXpProgress(user.xp);

    return {
      totalXp: user.xp,
      level: getLevelFromXp(user.xp),
      xpProgress,
      challengesCompleted: completedCount,
      totalChallenges: totalCount,
      achievementsUnlocked: achievementCount,
    };
  }
}
