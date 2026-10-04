import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListProductQuery } from '../list-product.query.js';
import { Product } from '../../../domain/entities/product.entity.js';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../ports/product.repository.js';
import { GetProductQuery } from '../get-product.query.js';
import { ProductId } from '../../../domain/value-objects/product-id.vo.js';
import {
  ApplicationException,
  ApplicationExceptionCode,
} from '../../../../shared/domain/exceptions/application.exception.js';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<
  GetProductQuery,
  Product
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductQuery): Promise<Product> {
    const product = await this.productRepository.findById(
      new ProductId(query.id),
    );
    if (!product) {
      throw new ApplicationException(
        `Product with ID ${query.id} not found`,
        ApplicationExceptionCode.NotFoundError,
      );
    }
    return product;
  }
}
