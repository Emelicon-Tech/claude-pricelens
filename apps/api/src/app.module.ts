import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LocationsModule } from './locations/locations.module';
import { ProductsModule } from './products/products.module';
import { StoresModule } from './stores/stores.module';
import { PricesModule } from './prices/prices.module';
import { ShoppingListsModule } from './shopping-lists/shopping-lists.module';
import { ExpensesModule } from './expenses/expenses.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AdminModule } from './admin/admin.module';
import { HealthController } from './health.controller';
import { ReceiptsModule } from './receipts/receipts.module';

@Module({
  imports: [
    // Config — loads .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting — 100 requests per minute per IP
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Shared modules
    PrismaModule,
    RedisModule,

    // Feature modules
    AuthModule,
    UsersModule,
    LocationsModule,
    ProductsModule,
    StoresModule,
    PricesModule,
    ShoppingListsModule,
    ExpensesModule,
    SubscriptionsModule,
    AdminModule,
    ReceiptsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
