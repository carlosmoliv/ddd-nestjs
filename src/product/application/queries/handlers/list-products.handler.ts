import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListProductQuery } from '../list-product.query.js';
import { Product } from '../../../domain/entities/product.entity.js';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../ports/product.repository.js';

@QueryHandler(ListProductQuery)
export class ListProductHandler implements IQueryHandler<
  ListProductQuery,
  Product[]
> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: ListProductQuery): Promise<Product[]> {
    const { isActive, minPrice, maxPrice } = query;
    return this.productRepository.findAll({ isActive, minPrice, maxPrice });
  }
}
