import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command.js';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../ports/product.repository.js';
import { Product } from '../../../domain/entities/product.entity.js';
import { Sku } from '../../../domain/value-objects/sku.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const existingBySku = await this.productRepository.findBySku(
      Sku.create(command.sku),
    );
    if (existingBySku) {
      throw new ApplicationException(
        `Product with this SKU ${command.sku} already exists`,
        ApplicationExceptionCode.ConflictError,
      );
    }

    const existingByName = await this.productRepository.findByName(
      command.name,
    );
    if (existingByName) {
      throw new ApplicationException(
        `Product with this name ${command.name} already exists`,
        ApplicationExceptionCode.ConflictError,
      );
    }

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
