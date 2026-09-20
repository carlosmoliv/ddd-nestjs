import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProductController } from './presentation/product.controller.js';

@Module({
  imports: [CqrsModule],
  controllers: [ProductController],
})
export class ProductModule {}
