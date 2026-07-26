import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChallengesService {
  constructor(private prisma: PrismaService) {}

  async findByLevel(levelId: string, userId?: string) {
    const level = await this.prisma.level.findUnique({ where: { id: levelId } });
    if (!level) throw new NotFoundException('Level not found');

    const challenges = await this.prisma.challenge.findMany({
      where: { levelId },
      orderBy: { order: 'asc' },
      include: {
        progress: userId ? { where: { userId } } : false,
      },
    });

    return challenges.map((c) => ({
      id: c.id,
      levelId: c.levelId,
      titleKey: c.titleKey,
      descriptionKey: c.descriptionKey,
      initialCode: c.initialCode,
      expectedConcept: c.expectedConcept,
      tests: c.tests,
      hints: c.hints,
      xpReward: c.xpReward,
      order: c.order,
      completed: userId ? c.progress.some((p) => p.completed) : false,
    }));
  }

  async findById(id: string, userId?: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: {
        level: { include: { world: true } },
        progress: userId ? { where: { userId } } : false,
      },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');

    return {
      id: challenge.id,
      levelId: challenge.levelId,
      titleKey: challenge.titleKey,
      descriptionKey: challenge.descriptionKey,
      initialCode: challenge.initialCode,
      expectedConcept: challenge.expectedConcept,
      tests: challenge.tests,
      hints: challenge.hints,
      xpReward: challenge.xpReward,
      order: challenge.order,
      completed: userId ? challenge.progress.some((p) => p.completed) : false,
      level: {
        id: challenge.level.id,
        titleKey: challenge.level.titleKey,
        world: {
          id: challenge.level.world.id,
          slug: challenge.level.world.slug,
          titleKey: challenge.level.world.titleKey,
        },
      },
    };
  }
}
