import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;
  private readonly logger = new Logger(RedisService.name);
  private connected = false;

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          this.logger.warn('Redis connection failed after 3 retries. Running without cache.');
          return null; // Stop retrying
        }
        return Math.min(times * 200, 2000);
      },
      lazyConnect: true,
    });

    this.client.on('connect', () => {
      this.connected = true;
      this.logger.log('Redis connected successfully');
    });

    this.client.on('error', (err) => {
      this.connected = false;
      // Suppress noisy repeated error logs
    });

    // Attempt to connect (non-blocking)
    this.client.connect().catch(() => {
      this.logger.warn('Redis unavailable — running without cache (all queries hit DB directly)');
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    if (!this.connected) return null;
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.connected) return;
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch {
      // Silently fail — cache is not critical
    }
  }

  async del(key: string): Promise<void> {
    if (!this.connected) return;
    try {
      await this.client.del(key);
    } catch {}
  }

  async getJson<T>(key: string): Promise<T | null> {
    const data = await this.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  async onModuleDestroy() {
    if (this.connected) {
      await this.client.quit();
    }
  }
}
