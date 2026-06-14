import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { InventoryModule } from './inventory/inventory.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { MembershipsModule } from './memberships/memberships.module';
import { RewardsModule } from './rewards/rewards.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReferralsModule } from './referrals/referrals.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SearchModule } from './search/search.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { RedisModule } from './redis/redis.module';
import { FeedbackModule } from './feedback/feedback.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    InventoryModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    SubscriptionsModule,
    MembershipsModule,
    RewardsModule,
    PromotionsModule,
    ReferralsModule,
    WishlistsModule,
    ReviewsModule,
    SearchModule,
    NotificationsModule,
    AdminModule,
    FeedbackModule,
    HealthModule,
  ],
})
export class AppModule {}
