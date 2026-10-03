import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductController } from './presentation/product.controller.js';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.js';
import { DrizzleProductRepository } from './infra/adapters/drizzle-product.repository.js';
import { CommandHandlers } from './application/index.js';
import { DrizzleModule } from '../shared/infra/database/postgres/drizzle.module.js';

@Module({
  imports: [CqrsModule, DrizzleModule],
  controllers: [ProductController],
  providers: [
    ...CommandHandlers,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: DrizzleProductRepository,
    },
  ],
})
export class ProductModule {}
