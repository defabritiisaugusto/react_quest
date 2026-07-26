import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LevelsService } from './levels.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller()
@UseGuards(JwtAuthGuard)
export class LevelsController {
  constructor(private levels: LevelsService) {}

  @Get('worlds/:slug/levels')
  findByWorld(@Param('slug') slug: string, @CurrentUser() user: { id: string }) {
    return this.levels.findByWorld(slug, user.id);
  }

  @Get('levels/:id')
  findById(@Param('id') id: string) {
    return this.levels.findById(id);
  }
}
