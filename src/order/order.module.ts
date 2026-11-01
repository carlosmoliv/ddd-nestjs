import { Module } from '@nestjs/common';
import { DrizzleOrderRepository } from './domain/infrastructure/adapters/drizzle-order.repository.js';
import { CommandHandlers } from './application/use-cases/index.js';
import { OrderController } from './presentation/order.controller.js';
import { ORDER_REPOSITORY } from './application/ports/order.repository.js';
import { CUSTOMER } from './application/ports/customer.port.js';
import { CustomerAdapter } from './domain/infrastructure/adapters/customer.adapter.js';
import { PRODUCT } from './application/ports/product.port.js';
import { ProductAdapter } from './domain/infrastructure/adapters/product.adapter.js';
import { CustomerModule } from '../customer/customer.module.js';
import { ProductModule } from '../product/product.module.js';

@Module({
  imports: [CustomerModule, ProductModule],
  providers: [
    ...CommandHandlers,
    {
      provide: ORDER_REPOSITORY,
      useClass: DrizzleOrderRepository,
    },
    {
      provide: CUSTOMER,
      useClass: CustomerAdapter,
    },
    {
      provide: PRODUCT,
      useClass: ProductAdapter,
    },
  ],
  controllers: [OrderController],
})
export class OrderModule {}
