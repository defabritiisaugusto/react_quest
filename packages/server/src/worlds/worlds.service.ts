import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorldsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string) {
    const worlds = await this.prisma.world.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { levels: true } },
        levels: {
          include: {
            challenges: {
              include: {
                progress: userId ? { where: { userId, completed: true } } : false,
              },
            },
          },
        },
      },
    });

    return worlds.map((world) => {
      const totalChallenges = world.levels.reduce((sum, l) => sum + l.challenges.length, 0);
      const completedChallenges = userId
        ? world.levels.reduce(
            (sum, l) =>
              sum + l.challenges.filter((c) => c.progress && c.progress.length > 0).length,
            0,
          )
        : 0;

      return {
        id: world.id,
        slug: world.slug,
        titleKey: world.titleKey,
        descKey: world.descKey,
        order: world.order,
        iconUrl: world.iconUrl,
        unlockXp: world.unlockXp,
        levelsCount: world._count.levels,
        totalChallenges,
        completedChallenges,
      };
    });
  }

  async findBySlug(slug: string) {
    const world = await this.prisma.world.findUnique({
      where: { slug },
      include: { levels: { orderBy: { order: 'asc' } } },
    });
    if (!world) throw new NotFoundException('World not found');
    return world;
  }
}
