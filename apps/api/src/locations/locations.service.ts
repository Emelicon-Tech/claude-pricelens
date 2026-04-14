import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class LocationsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getStates() {
    // Cache states for 24 hours (rarely changes)
    const cached = await this.redis.getJson<any[]>('locations:states');
    if (cached) return cached;

    const states = await this.prisma.state.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { cities: true } } },
    });

    await this.redis.setJson('locations:states', states, 86400);
    return states;
  }

  async getCitiesByState(stateId: string) {
    const cached = await this.redis.getJson<any[]>(`locations:cities:${stateId}`);
    if (cached) return cached;

    const cities = await this.prisma.city.findMany({
      where: { stateId, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { stores: true } } },
    });

    await this.redis.setJson(`locations:cities:${stateId}`, cities, 86400);
    return cities;
  }

  async getStoresByCity(cityId: string, type?: string) {
    const where: any = { cityId, isActive: true };
    if (type) where.type = type;

    return this.prisma.store.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        city: { include: { state: true } },
        _count: { select: { prices: true } },
      },
    });
  }

  async getStoresByState(stateId: string, type?: string) {
    const where: any = { city: { stateId }, isActive: true };
    if (type) where.type = type;

    return this.prisma.store.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        city: true,
        _count: { select: { prices: true } },
      },
    });
  }
}
