import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './authService';
import { User } from './user.entity';
import { CurrentUser } from './current-user.decorator';
import { AuthGurdLocal } from './auth-gurd.local';
import { AuthGurdJwt } from './auth-guard.jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGurdLocal)
  async login(@CurrentUser() user: User) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('profile')
  @UseGuards(AuthGurdJwt)
  async getProfile(@CurrentUser() user: User) {
    return user;
  }
}
