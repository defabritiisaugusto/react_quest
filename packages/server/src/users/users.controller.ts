import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { normalizeAvatarConfig } from '@react-quest/shared';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  getProfile(@CurrentUser() user: { id: string }) {
    return this.users.getProfile(user.id);
  }

  @Get('me/stats')
  getStats(@CurrentUser() user: { id: string }) {
    return this.users.getStats(user.id);
  }

  @Patch('me/avatar')
  updateAvatar(@CurrentUser() user: { id: string }, @Body() dto: UpdateAvatarDto) {
    return this.users.updateAvatar(user.id, normalizeAvatarConfig(dto.avatarConfig));
  }
}
