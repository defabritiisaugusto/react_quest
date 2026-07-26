import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LevelsService {
  constructor(private prisma: PrismaService) {}

  async findByWorld(worldSlug: string, userId?: string) {
    const world = await this.prisma.world.findUnique({ where: { slug: worldSlug } });
    if (!world) throw new NotFoundException('World not found');

    const levels = await this.prisma.level.findMany({
      where: { worldId: world.id },
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { challenges: true } },
        challenges: {
          select: {
            id: true,
            progress: userId ? { where: { userId, completed: true }, select: { id: true } } : false,
          },
        },
      },
    });

    return levels.map((level) => ({
      id: level.id,
      worldId: level.worldId,
      titleKey: level.titleKey,
      descKey: level.descKey,
      order: level.order,
      difficulty: level.difficulty,
      challengesCount: level._count.challenges,
      completedChallenges: userId
        ? level.challenges.filter((c) => c.progress && c.progress.length > 0).length
        : 0,
    }));
  }

  async findById(id: string) {
    const level = await this.prisma.level.findUnique({
      where: { id },
      include: {
        world: true,
        challenges: { orderBy: { order: 'asc' } },
      },
    });
    if (!level) throw new NotFoundException('Level not found');
    return level;
  }
}
