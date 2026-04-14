import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [users, products, stores, prices, subscriptions] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.store.count({ where: { isActive: true } }),
      this.prisma.price.count(),
      this.prisma.subscription.groupBy({
        by: ['plan'],
        _count: true,
      }),
    ]);

    const proUsers = subscriptions.find(s => s.plan === 'PRO')?._count || 0;
    const freeUsers = subscriptions.find(s => s.plan === 'FREE')?._count || 0;

    // Recent signups (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentSignups = await this.prisma.user.count({
      where: { createdAt: { gte: weekAgo } },
    });

    return {
      totalUsers: users,
      proUsers,
      freeUsers,
      recentSignups,
      totalProducts: products,
      totalStores: stores,
      totalPrices: prices,
      revenue: {
        monthlyRecurring: proUsers * 1000, // Simplified MRR
        currency: 'NGN',
      },
    };
  }

  async getDataCoverage() {
    const states = await this.prisma.state.findMany({
      include: {
        cities: {
          include: {
            stores: {
              include: {
                _count: { select: { prices: true } },
              },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return states.map(state => {
      const totalStores = state.cities.reduce((sum, city) => sum + city.stores.length, 0);
      const totalPrices = state.cities.reduce(
        (sum, city) => sum + city.stores.reduce((s, store) => s + store._count.prices, 0),
        0,
      );

      return {
        state: state.name,
        slug: state.slug,
        cities: state.cities.length,
        stores: totalStores,
        prices: totalPrices,
        coverage: totalPrices > 0 ? Math.min(100, Math.round((totalPrices / 1000) * 100)) : 0,
      };
    });
  }
}
