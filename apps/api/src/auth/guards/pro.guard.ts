import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

/**
 * Guard that checks if the user has an active Pro subscription.
 * Used to gate premium features like basket optimizer, price alerts, etc.
 */
@Injectable()
export class ProGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.sub;

    if (!userId) return false;

    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || subscription.plan === 'FREE') {
      throw new ForbiddenException(
        'This feature requires a Pro subscription. Upgrade to Pro for ₦1,000/month or ₦11,500/year to unlock all features.',
      );
    }

    // Check if subscription is still active
    if (subscription.status !== 'ACTIVE') {
      // Check grace period
      if (subscription.gracePeriodEnd && subscription.gracePeriodEnd > new Date()) {
        return true; // Within grace period
      }
      throw new ForbiddenException(
        'Your Pro subscription has expired. Please renew to continue accessing premium features.',
      );
    }

    return true;
  }
}
