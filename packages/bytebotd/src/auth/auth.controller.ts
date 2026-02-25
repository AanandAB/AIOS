import { Controller, Post, Body, Logger, Get, UseGuards } from '@nestjs/common';
import { AuthService, LoginDto, RegisterDto } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Login attempt for user: ${loginDto.username}`);
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Registration attempt for user: ${registerDto.username}`);
    return await this.authService.register(registerDto);
  }

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async getUsers() {
    this.logger.log('Fetching all users');
    return await this.authService.getUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile() {
    this.logger.log('Fetching user profile');
    return { message: 'Protected route accessed successfully' };
  }
}