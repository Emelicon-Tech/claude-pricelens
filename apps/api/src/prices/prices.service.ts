import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';
import { PriceSource } from '@prisma/client';

@Injectable()
export class PricesService {
  private readonly FREE_DAILY_LIMIT = 3;
  private readonly FREE_STORES_SHOWN = 3;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  // ── Price Comparison (Core Feature) ─────────────────────────────────────

  async comparePrices(
    productId: string,
    filters: { cityId?: string; stateId?: string },
    userId?: string,
  ) {
    // Check free tier limits
    if (userId) {
      const subscription = await this.prisma.subscription.findUnique({ where: { userId } });
      const isFree = !subscription || subscription.plan === 'FREE';

      if (isFree) {
        // Check daily comparison count
        const today = new Date().toISOString().split('T')[0];
        const countKey = `comparisons:${userId}:${today}`;
        const count = parseInt(await this.redis.get(countKey) || '0');

        if (count >= this.FREE_DAILY_LIMIT) {
          throw new ForbiddenException({
            message: `You've used all ${this.FREE_DAILY_LIMIT} free comparisons today. Upgrade to Pro for unlimited comparisons.`,
            code: 'COMPARISON_LIMIT_REACHED',
            upgradeUrl: '/pricing',
          });
        }

        // Increment counter
        await this.redis.set(countKey, (count + 1).toString(), 86400); // 24h TTL
      }
    }

    // Build price query
    const priceWhere: any = { productId };
    if (filters.cityId) {
      priceWhere.store = { cityId: filters.cityId, isActive: true };
    } else if (filters.stateId) {
      priceWhere.store = { city: { stateId: filters.stateId }, isActive: true };
    }

    let prices = await this.prisma.price.findMany({
      where: priceWhere,
      include: {
        store: {
          include: {
            city: { include: { state: { select: { name: true, slug: true } } } },
          },
        },
        reporter: { select: { displayName: true } },
      },
      orderBy: { amount: 'asc' },
    });

    // Free tier: show only top 3 stores
    const subscription = userId
      ? await this.prisma.subscription.findUnique({ where: { userId } })
      : null;
    const isFree = !subscription || subscription.plan === 'FREE';

    const totalStores = prices.length;
    if (isFree && prices.length > this.FREE_STORES_SHOWN) {
      prices = prices.slice(0, this.FREE_STORES_SHOWN);
    }

    // Product info
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    // Stats
    const allAmounts = prices.map(p => Number(p.amount));
    const stats = allAmounts.length > 0
      ? {
          cheapest: Math.min(...allAmounts),
          mostExpensive: Math.max(...allAmounts),
          average: Math.round(allAmounts.reduce((a, b) => a + b, 0) / allAmounts.length),
          savings: Math.max(...allAmounts) - Math.min(...allAmounts),
        }
      : null;

    return {
      product,
      prices,
      stats,
      meta: {
        totalStores,
        shownStores: prices.length,
        isLimited: isFree && totalStores > this.FREE_STORES_SHOWN,
        upgradeMessage: isFree && totalStores > this.FREE_STORES_SHOWN
          ? `${totalStores - this.FREE_STORES_SHOWN} more stores available with Pro.`
          : null,
      },
    };
  }

  // ── Price History ───────────────────────────────────────────────────────

  async getPriceHistory(productId: string, storeId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const price = await this.prisma.price.findUnique({
      where: { productId_storeId: { productId, storeId } },
    });

    if (!price) return { history: [], currentPrice: null };

    const history = await this.prisma.priceHistory.findMany({
      where: {
        priceId: price.id,
        recordedAt: { gte: since },
      },
      orderBy: { recordedAt: 'asc' },
    });

    return {
      currentPrice: price.amount,
      history,
      trend: this.calculateTrend(history),
    };
  }

  // ── Cheapest Products ───────────────────────────────────────────────────

  async getCheapestProducts(cityId: string, categoryId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where: any = {
      store: { cityId },
    };

    if (categoryId) {
      where.product = { categoryId };
    }

    const prices = await this.prisma.price.findMany({
      where,
      include: {
        product: { include: { category: true } },
        store: true,
      },
      orderBy: { amount: 'asc' },
      skip,
      take: limit,
    });

    return {
      data: prices,
      pagination: { page, limit },
    };
  }

  // ── Create or Update Price ──────────────────────────────────────────────

  async createOrUpdate(data: { productId: string; storeId: string; amount: number; source?: PriceSource }, userId: string) {
    const existing = await this.prisma.price.findUnique({
      where: { productId_storeId: { productId: data.productId, storeId: data.storeId } },
    });

    if (existing) {
      // Save old price to history
      await this.prisma.priceHistory.create({
        data: {
          priceId: existing.id,
          amount: existing.amount,
          source: existing.source,
        },
      });

      // Update current price
      return this.prisma.price.update({
        where: { id: existing.id },
        data: {
          amount: data.amount,
          source: data.source || PriceSource.MANUAL,
          reportedBy: userId,
          updatedAt: new Date(),
        },
      });
    }

    return this.prisma.price.create({
      data: {
        productId: data.productId,
        storeId: data.storeId,
        amount: data.amount,
        source: data.source || PriceSource.MANUAL,
        reportedBy: userId,
      },
    });
  }

  // ── Bulk Import ─────────────────────────────────────────────────────────

  async bulkImport(prices: { productId: string; storeId: string; amount: number }[]) {
    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const price of prices) {
      try {
        const existing = await this.prisma.price.findUnique({
          where: { productId_storeId: { productId: price.productId, storeId: price.storeId } },
        });

        if (existing) {
          await this.prisma.priceHistory.create({
            data: { priceId: existing.id, amount: existing.amount, source: existing.source },
          });
          await this.prisma.price.update({
            where: { id: existing.id },
            data: { amount: price.amount, source: PriceSource.MANUAL },
          });
          updated++;
        } else {
          await this.prisma.price.create({
            data: {
              productId: price.productId,
              storeId: price.storeId,
              amount: price.amount,
              source: PriceSource.MANUAL,
            },
          });
          created++;
        }
      } catch {
        errors++;
      }
    }

    return { created, updated, errors, total: prices.length };
  }

  // ── Helpers ─────────────────────────────────────────────────────────────

  private calculateTrend(history: any[]) {
    if (history.length < 2) return 'stable';
    const recent = Number(history[history.length - 1].amount);
    const older = Number(history[0].amount);
    const change = ((recent - older) / older) * 100;

    if (change > 5) return 'rising';
    if (change < -5) return 'falling';
    return 'stable';
  }
}
