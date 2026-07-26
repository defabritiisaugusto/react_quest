import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorldsModule } from './worlds/worlds.module';
import { LevelsModule } from './levels/levels.module';
import { ChallengesModule } from './challenges/challenges.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    WorldsModule,
    LevelsModule,
    ChallengesModule,
    ProgressModule,
  ],
})
export class AppModule {}
