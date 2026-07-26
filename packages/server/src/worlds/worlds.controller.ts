import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { WorldsService } from './worlds.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('worlds')
@UseGuards(JwtAuthGuard)
export class WorldsController {
  constructor(private worlds: WorldsService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.worlds.findAll(user.id);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.worlds.findBySlug(slug);
  }
}
