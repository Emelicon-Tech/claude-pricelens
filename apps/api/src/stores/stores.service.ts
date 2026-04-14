import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    cityId?: string; stateId?: string; type?: string;
    search?: string; page: number; limit: number;
  }) {
    const { cityId, stateId, type, search, page, limit } = params;
    const skip = (page - 1) * limit;
    const where: any = { isActive: true };

    if (cityId) where.cityId = cityId;
    if (stateId) where.city = { stateId };
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [stores, total] = await Promise.all([
      this.prisma.store.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          city: { include: { state: { select: { name: true, slug: true } } } },
          _count: { select: { prices: true } },
        },
      }),
      this.prisma.store.count({ where }),
    ]);

    return {
      data: stores,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug },
      include: {
        city: { include: { state: true } },
        prices: {
          include: { product: { include: { category: true } } },
          orderBy: { product: { name: 'asc' } },
          take: 100,
        },
      },
    });

    if (!store) throw new NotFoundException('Store not found');

    return store;
  }

  async create(data: any) {
    return this.prisma.store.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.store.update({ where: { id }, data });
  }
}
