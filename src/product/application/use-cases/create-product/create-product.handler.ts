import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command.js';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../ports/product.repository.js';
import { Product } from '../../../domain/entities/product.entity.js';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const product = Product.create(
      command.name,
      command.description,
      command.sku,
      command.price,
      command.stock,
      command.currency ?? 'USD',
    );
    await this.productRepository.save(product);
  }
}
