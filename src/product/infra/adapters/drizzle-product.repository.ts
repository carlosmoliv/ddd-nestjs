import { Inject } from '@nestjs/common';
import { ProductRepository } from '../../application/ports/product.repository.js';
import { Product } from '../../domain/entities/product.entity.js';
import type { DrizzleDB } from '../../../shared/infra/database/postgres/drizzle.provider.js';
import { products } from '../../../shared/infra/database/postgres/schema/product.schema.js';

export class DrizzleProductRepository {
  constructor(
    @Inject('DRIZZLE_CLIENT') private readonly drizzleClient: DrizzleDB,
  ) {}

  toPersistence(product: Product): typeof products.$inferSelect {
    return {
      id: product.id.getValue(),
      name: product.name,
      description: product.description,
      sku: product.sku.getValue(),
      priceAmount: product.price.toCents(),
      priceCurrency: product.price.getCurrency(),
      stockQuantity: product.stock,
      isActive: product.isActive,
      lowStockThreshold: product.lowStockThreshold,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
