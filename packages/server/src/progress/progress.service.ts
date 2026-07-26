import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getLevelFromXp } from '@react-quest/shared';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async submitSolution(
    userId: string,
    challengeId: string,
    code: string,
    passed: boolean,
    score: number,
  ) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('Challenge not found');

    const existing = await this.prisma.progress.findUnique({
      where: { userId_challengeId: { userId, challengeId } },
    });

    const alreadyCompleted = existing?.completed ?? false;
    const xpEarned = passed && !alreadyCompleted ? challenge.xpReward : 0;

    await this.prisma.progress.upsert({
      where: { userId_challengeId: { userId, challengeId } },
      create: {
        userId,
        challengeId,
        completed: passed,
        userCode: code,
        score,
        attempts: 1,
        completedAt: passed ? new Date() : null,
      },
      update: {
        completed: passed || alreadyCompleted,
        userCode: code,
        score: Math.max(existing?.score ?? 0, score),
        attempts: { increment: 1 },
        completedAt: passed && !alreadyCompleted ? new Date() : existing?.completedAt,
      },
    });

    let levelUp = false;
    let newLevel: number | null = null;

    if (xpEarned > 0) {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xpEarned } },
      });

      const calculatedLevel = getLevelFromXp(user.xp);
      if (calculatedLevel > user.level) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { level: calculatedLevel },
        });
        levelUp = true;
        newLevel = calculatedLevel;
      }
    }

    return { passed, score, xpEarned, levelUp, newLevel };
  }

  async getUserProgress(userId: string) {
    return this.prisma.progress.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });
  }
}
