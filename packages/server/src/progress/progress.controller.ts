import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SubmitSolutionBodyDto } from './dto/submit-solution.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progress: ProgressService) {}

  @Post('challenges/:id/submit')
  submit(
    @Param('id') challengeId: string,
    @Body() dto: SubmitSolutionBodyDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.progress.submitSolution(user.id, challengeId, dto.code, dto.passed, dto.score);
  }

  @Get('progress')
  getUserProgress(@CurrentUser() user: { id: string }) {
    return this.progress.getUserProgress(user.id);
  }
}
