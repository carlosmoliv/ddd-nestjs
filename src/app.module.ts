import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { DrizzleModule } from './shared/infra/database/postgres/drizzle.module.js';
import { MongoModule } from './shared/infra/database/mongo/mongo.module.js';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductModule } from './product/product.module.js';
import { CustomerModule } from './customer/customer.module.js';
import { OrderModule } from './order/order.module.js';
import { PaymentModule } from './payment/payment.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'clean-shop',
    // }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
    DrizzleModule,
    CqrsModule.forRoot(),
    ProductModule,
    CustomerModule,
    PaymentModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
