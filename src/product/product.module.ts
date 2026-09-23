import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductController } from './presentation/product.controller.js';
import { PRODUCT_REPOSITORY } from './application/ports/product.repository.js';
import { DrizzleProductRepository } from './infra/adapters/drizzle-product.repository.js';

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: DrizzleProductRepository,
    },
  ],
})
export class ProductModule {}
