import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async findAll(params: { search?: string; categoryId?: string; page: number; limit: number }) {
    const { search, categoryId, page, limit } = params;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { name: 'asc' },
        include: {
          category: { select: { id: true, name: true, slug: true, icon: true } },
          _count: { select: { prices: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async getCategories() {
    const cached = await this.redis.getJson<any[]>('products:categories');
    if (cached) return cached;

    const categories = await this.prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { products: true } },
      },
    });

    await this.redis.setJson('products:categories', categories, 3600); // 1 hour
    return categories;
  }

  async findBySlug(slug: string, filters: { cityId?: string; stateId?: string }) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    // Build price filter based on location
    const priceWhere: any = { productId: product.id };
    if (filters.cityId) {
      priceWhere.store = { cityId: filters.cityId };
    } else if (filters.stateId) {
      priceWhere.store = { city: { stateId: filters.stateId } };
    }

    const prices = await this.prisma.price.findMany({
      where: priceWhere,
      include: {
        store: {
          include: {
            city: { include: { state: true } },
          },
        },
      },
      orderBy: { amount: 'asc' },
    });

    // Get price history for chart
    const priceHistory = await this.prisma.priceHistory.findMany({
      where: {
        price: { productId: product.id },
      },
      orderBy: { recordedAt: 'desc' },
      take: 90, // Last 90 data points
    });

    // Calculate stats
    const amounts = prices.map(p => Number(p.amount));
    const stats = amounts.length > 0
      ? {
          lowestPrice: Math.min(...amounts),
          highestPrice: Math.max(...amounts),
          averagePrice: Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length),
          storeCount: prices.length,
        }
      : null;

    return {
      product,
      prices,
      priceHistory,
      stats,
    };
  }

  async create(data: any) {
    return this.prisma.product.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
