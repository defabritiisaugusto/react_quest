import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class ChallengesController {
  constructor(private challenges: ChallengesService) {}

  @Get('levels/:levelId/challenges')
  findByLevel(@Param('levelId') levelId: string, @CurrentUser() user: { id: string }) {
    return this.challenges.findByLevel(levelId, user.id);
  }

  @Get('challenges/:id')
  findById(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.challenges.findById(id, user.id);
  }
}
