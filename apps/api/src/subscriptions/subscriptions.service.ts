import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class SubscriptionsService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async getPlans() {
    return {
      plans: [
        {
          id: 'free',
          name: 'Free',
          price: 0,
          interval: null,
          features: [
            'Browse products & categories',
            '3 price comparisons per day (top 3 stores)',
            '1 shopping list (max 10 items)',
            'View store directory',
            '7-day price history',
            '1 state only',
          ],
        },
        {
          id: 'pro-monthly',
          name: 'Pro Monthly',
          price: 1000,
          currency: 'NGN',
          interval: 'MONTHLY',
          features: [
            'Everything in Free, plus:',
            'Unlimited price comparisons (all stores)',
            'Unlimited shopping lists & items',
            'AI basket optimizer',
            'Price alerts (up to 20)',
            'Full expense tracker & reports',
            'Receipt scanning',
            'Full price history & trends',
            'Analytics dashboard',
            'All 6 states access',
            'Ad-free experience',
            'Export data (CSV)',
          ],
        },
        {
          id: 'pro-annual',
          name: 'Pro Annual',
          price: 11500,
          currency: 'NGN',
          interval: 'ANNUAL',
          savings: '₦500 saved vs monthly',
          features: [
            'Everything in Pro Monthly',
            'Save ₦500 per year',
          ],
        },
      ],
    };
  }

  async getStatus(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      include: { payments: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });

    if (!subscription) {
      return { plan: 'FREE', status: 'ACTIVE', features: 'basic' };
    }

    return subscription;
  }

  async initializePayment(userId: string, interval: 'MONTHLY' | 'ANNUAL') {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.email) throw new BadRequestException('Email required for payment');

    const amount = interval === 'MONTHLY' ? 100000 : 1150000; // Amount in kobo
    const reference = `PL-${userId.slice(0, 8)}-${Date.now()}`;

    const secretKey = this.config.get('PAYSTACK_SECRET_KEY');
    
    // Fallback: If no real Paystack key exists or it's a test environment specifically,
    // simulate a payload generation so the user can test the UI flow securely.
    if (!secretKey || secretKey === 'sk_test_your_paystack_key') {
      return {
        message: 'Mock Payment initialized successfully',
        reference,
        amount: amount / 100,
        currency: 'NGN',
        interval,
        authorization_url: `${this.config.get('NEXTAUTH_URL') || 'http://localhost:3000'}/dashboard/billing?reference=${reference}`,
        note: 'Simulated mode: missing real PAYSTACK_SECRET_KEY',
      };
    }

    try {
      const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          amount,
          reference,
          callback_url: `${this.config.get('NEXTAUTH_URL') || 'http://localhost:3000'}/dashboard/billing`,
          metadata: { userId, interval, plan: 'PRO' },
        }),
      });

      const json = await paystackResponse.json();

      if (!paystackResponse.ok || !json.status) {
        throw new Error(json.message || 'Failed to communicate with Paystack API');
      }

      return {
        message: 'Payment initialization ready',
        reference,
        amount: amount / 100,
        currency: 'NGN',
        interval,
        authorization_url: json.data.authorization_url,
      };
    } catch (error: any) {
      throw new BadRequestException(`Paystack Initialization Error: ${error.message}`);
    }
  }

  async verifyPayment(reference: string, userId: string) {
    const secretKey = this.config.get('PAYSTACK_SECRET_KEY');
    
    // Prevent double verification abuse
    const existingPayment = await this.prisma.payment.findUnique({ where: { paystackRef: reference } });
    if (existingPayment && existingPayment.status === 'success') {
      return { success: true, message: 'Already verified' };
    }

    // Fallback mode for Simulated Checkouts
    if (!secretKey || secretKey === 'sk_test_your_paystack_key') {
      // Manually trigger the success hook simulation
      const mockData = {
        reference,
        amount: 100000, 
        metadata: { userId, interval: 'MONTHLY' }
      };
      await this.handleSuccessfulPayment(mockData);
      return { success: true, message: 'Mock payment completely verified & upgraded!' };
    }

    try {
      const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${secretKey}` },
      });

      const json = await paystackResponse.json();

      if (!paystackResponse.ok || !json.status) {
        throw new Error('Verification failed internally with Paystack');
      }

      const { data } = json;

      if (data.status === 'success') {
        const payloadData = {
          reference: data.reference,
          amount: data.amount,
          metadata: data.metadata,
        };
        // Securely process upgrade
        await this.handleSuccessfulPayment(payloadData);
        return { success: true, message: 'Pro Tier Actively Verified' };
      } else {
        throw new BadRequestException(`Payment was abandoned or failed: ${data.status}`);
      }
    } catch (error: any) {
      throw new BadRequestException(`Paystack Verification Error: ${error.message}`);
    }
  }

  async handleWebhook(payload: any, signature: string) {
    // Verify webhook signature
    const secret = this.config.get('PAYSTACK_SECRET_KEY');
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(payload)).digest('hex');

    if (hash !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = payload.event;
    const data = payload.data;

    switch (event) {
      case 'charge.success':
        await this.handleSuccessfulPayment(data);
        break;
      case 'subscription.disable':
        await this.handleSubscriptionCancelled(data);
        break;
    }

    return { received: true };
  }

  async cancel(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!subscription || subscription.plan === 'FREE') {
      throw new BadRequestException('No active Pro subscription to cancel');
    }

    // Set grace period (3 days after current period end)
    const gracePeriodEnd = subscription.currentPeriodEnd
      ? new Date(subscription.currentPeriodEnd.getTime() + 3 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    await this.prisma.subscription.update({
      where: { userId },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        gracePeriodEnd,
      },
    });

    return {
      message: 'Subscription cancelled. You will retain Pro access until the end of your billing period.',
      accessUntil: gracePeriodEnd,
    };
  }

  // ── Internal Handlers ──────────────────────────────────────────────────

  private async handleSuccessfulPayment(data: any) {
    const { reference, metadata, amount } = data;
    const userId = metadata?.userId;
    const interval = metadata?.interval;

    if (!userId) return;

    const periodStart = new Date();
    const periodEnd = new Date();
    if (interval === 'ANNUAL') {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    await this.prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: 'PRO',
        status: 'ACTIVE',
        interval,
        amount: amount / 100,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        cancelledAt: null,
        gracePeriodEnd: null,
      },
      create: {
        userId,
        plan: 'PRO',
        status: 'ACTIVE',
        interval,
        amount: amount / 100,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
      },
    });

    await this.prisma.payment.create({
      data: {
        subscriptionId: (await this.prisma.subscription.findUnique({ where: { userId } }))!.id,
        amount: amount / 100,
        status: 'success',
        paystackRef: reference,
        paystackResponse: data,
        paidAt: new Date(),
      },
    });
  }

  private async handleSubscriptionCancelled(data: any) {
    const userId = data.metadata?.userId;
    if (!userId) return;

    await this.prisma.subscription.update({
      where: { userId },
      data: { status: 'CANCELLED' },
    });
  }
}
