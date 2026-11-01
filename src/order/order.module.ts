import { Module } from '@nestjs/common';
import { ORDER_REPOSITORY } from './domain/ports/order.repository.js';
import { DrizzleOrderRepository } from './domain/infrastructure/adapters/drizzle-order.repository.js';

@Module({
  providers: [
    {
      provide: ORDER_REPOSITORY,
      useClass: DrizzleOrderRepository,
    },
  ],
})
export class OrderModule {}
