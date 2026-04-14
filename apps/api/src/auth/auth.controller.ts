import { Controller, Post, Body, UseGuards, Req, Res, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto, PhoneLoginDto, VerifyOtpDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto);

    // Set httpOnly cookies
    res.cookie('access_token', result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: result.expiresIn * 1000, // 15 minutes
    });
    res.cookie('refresh_token', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user data but NOT the raw tokens (they're in cookies now)
    return {
      user: result.user,
      message: result.message,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);

    res.cookie('access_token', result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: result.expiresIn * 1000,
    });
    res.cookie('refresh_token', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { user: result.user };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token from cookie' })
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token found' });
    }

    const result = await this.authService.refreshToken({ refreshToken });

    res.cookie('access_token', result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: result.expiresIn * 1000,
    });
    res.cookie('refresh_token', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Token refreshed' };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and revoke tokens' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    await this.authService.logout(req.user.sub, refreshToken);

    // Clear cookies
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });

    return { message: 'Logged out successfully' };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset email' })
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using reset token' })
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Post('phone/send-otp')
  @ApiOperation({ summary: 'Send OTP to phone number for login' })
  @HttpCode(HttpStatus.OK)
  sendOtp(@Body() dto: PhoneLoginDto) {
    return this.authService.sendOtp(dto.phone);
  }

  @Post('phone/verify-otp')
  @ApiOperation({ summary: 'Verify phone OTP and login' })
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyOtp(dto.phone, dto.code);

    res.cookie('access_token', result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: result.expiresIn * 1000,
    });
    res.cookie('refresh_token', result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { user: result.user };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    const user = await this.authService.validateUser(req.user.sub);
    if (!user) return { error: 'User not found' };
    const { passwordHash, ...safe } = user;
    return safe;
  }
}
