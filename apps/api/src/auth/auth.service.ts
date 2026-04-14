import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto/auth.dto';
import { AuthProvider, Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private redis: RedisService,
  ) {}

  // ── Register ────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    // Check if email already exists
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    // Validate state and city exist
    const state = await this.prisma.state.findUnique({ where: { id: dto.stateId } });
    if (!state) throw new BadRequestException('Invalid state selected');

    const city = await this.prisma.city.findUnique({ where: { id: dto.cityId } });
    if (!city || city.stateId !== dto.stateId) {
      throw new BadRequestException('Invalid city selected for this state');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        displayName: `${dto.firstName} ${dto.lastName}`,
        phone: dto.phone || null,
        authProvider: AuthProvider.EMAIL,
        stateId: dto.stateId,
        cityId: dto.cityId,
        role: Role.USER,
      },
    });

    // Create free subscription
    await this.prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'FREE',
        status: 'ACTIVE',
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email || '', user.role);

    // TODO: Send verification email

    return {
      user: this.sanitizeUser(user),
      ...tokens,
      message: 'Registration successful. Please verify your email.',
    };
  }

  // ── Login ───────────────────────────────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { subscription: true, state: true, city: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Your account has been deactivated');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email || '', user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  // ── Refresh Token ───────────────────────────────────────────────────────

  async refreshToken(dto: RefreshTokenDto) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
    });

    if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Revoke old token
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { isRevoked: true },
    });

    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user) throw new UnauthorizedException('User not found');

    return this.generateTokens(user.id, user.email || '', user.role);
  }

  // ── Logout ──────────────────────────────────────────────────────────────

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { isRevoked: true },
      });
    }

    // Blacklist the access token in Redis (TTL = token expiry)
    await this.redis.set(`blacklist:${userId}`, 'true', 900); // 15 min

    return { message: 'Logged out successfully' };
  }

  // ── Google OAuth ────────────────────────────────────────────────────────

  async googleLogin(profile: { email: string; firstName: string; lastName: string; avatar?: string; googleId: string }) {
    let user = await this.prisma.user.findUnique({ where: { email: profile.email } });

    if (!user) {
      // Create new user from Google profile
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          displayName: `${profile.firstName} ${profile.lastName}`,
          avatar: profile.avatar,
          authProvider: AuthProvider.GOOGLE,
          isVerified: true, // Google emails are already verified
          accounts: {
            create: {
              provider: AuthProvider.GOOGLE,
              providerAccountId: profile.googleId,
            },
          },
        },
      });

      // Create free subscription
      await this.prisma.subscription.create({
        data: { userId: user.id, plan: 'FREE', status: 'ACTIVE' },
      });
    } else {
      // Link Google account if not already linked
      const existingAccount = await this.prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: AuthProvider.GOOGLE,
            providerAccountId: profile.googleId,
          },
        },
      });

      if (!existingAccount) {
        await this.prisma.account.create({
          data: {
            userId: user.id,
            provider: AuthProvider.GOOGLE,
            providerAccountId: profile.googleId,
          },
        });
      }
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email || '', user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  // ── Phone OTP ───────────────────────────────────────────────────────────

  async sendOtp(phone: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate previous OTPs for this phone
    await this.prisma.otpCode.updateMany({
      where: { phone, isUsed: false },
      data: { isUsed: true },
    });

    await this.prisma.otpCode.create({
      data: {
        phone,
        code,
        purpose: 'login',
        expiresAt,
      },
    });

    // TODO: Send SMS via Termii API
    // For development, log the code
    console.log(`[OTP] Code for ${phone}: ${code}`);

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(phone: string, code: string) {
    const otp = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        purpose: 'login',
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    if (otp.attempts >= 5) {
      throw new UnauthorizedException('Too many attempts. Please request a new OTP.');
    }

    // Mark OTP as used
    await this.prisma.otpCode.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          authProvider: AuthProvider.PHONE,
          isVerified: true,
        },
      });

      await this.prisma.subscription.create({
        data: { userId: user.id, plan: 'FREE', status: 'ACTIVE' },
      });
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email || user.phone || '', user.role);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  // ── Forgot Password ────────────────────────────────────────────────────

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal whether email exists
      return { message: 'If this email exists, a reset link has been sent.' };
    }

    const resetToken = uuidv4();
    await this.redis.set(`reset:${resetToken}`, user.id, 3600); // 1 hour

    // TODO: Send reset email via Resend
    console.log(`[RESET] Token for ${email}: ${resetToken}`);

    return { message: 'If this email exists, a reset link has been sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await this.redis.get(`reset:${token}`);
    if (!userId) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await this.redis.del(`reset:${token}`);

    // Revoke all refresh tokens for this user
    await this.prisma.refreshToken.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });

    return { message: 'Password reset successfully. Please login with your new password.' };
  }

  // ── Token Generation ────────────────────────────────────────────────────

  private async generateTokens(userId: string, identifier: string, role: Role) {
    const payload = { sub: userId, identifier, role };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRY') || '15m',
    });

    const refreshTokenValue = uuidv4();
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId,
        expiresAt: refreshExpiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private sanitizeUser(user: any) {
    const { passwordHash, ...safe } = user;
    return safe;
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true, state: true, city: true },
    });
  }
}
