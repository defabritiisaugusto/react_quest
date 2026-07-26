import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getLevelFromXp, getXpProgress } from '@react-quest/shared';

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
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
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
