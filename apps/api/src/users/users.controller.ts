import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile with subscription details' })
  getProfile(@CurrentUser('sub') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update profile (name, phone, avatar)' })
  updateProfile(@CurrentUser('sub') userId: string, @Body() data: any) {
    return this.usersService.updateProfile(userId, data);
  }

  @Patch('me/location')
  @ApiOperation({ summary: 'Update user location (state & city)' })
  updateLocation(
    @CurrentUser('sub') userId: string,
    @Body() data: { stateId: string; cityId: string },
  ) {
    return this.usersService.updateLocation(userId, data);
  }
}
