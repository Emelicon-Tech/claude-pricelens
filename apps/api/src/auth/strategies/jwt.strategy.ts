import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { Request } from 'express';

/**
 * Custom extractor: pulls the JWT from the httpOnly cookie first,
 * then falls back to the Authorization Bearer header (for Swagger/API testing).
 */
function cookieThenBearerExtractor(req: Request): string | null {
  // 1. Try httpOnly cookie
  if (req?.cookies?.access_token) {
    return req.cookies.access_token;
  }
  // 2. Fallback to Bearer header (useful for Swagger docs / Postman)
  return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: cookieThenBearerExtractor,
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; identifier: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return { sub: payload.sub, role: payload.role };
  }
}
