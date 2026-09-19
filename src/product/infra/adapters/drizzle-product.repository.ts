import { Inject } from '@nestjs/common';
import {
  ProductFilters,
  ProductRepository,
} from '../../application/ports/product.repository.js';
import { Product } from '../../domain/entities/product.entity.js';
import type { DrizzleDB } from '../../../shared/infra/database/postgres/drizzle.provider.js';
import { products } from '../../../shared/infra/database/postgres/schema/product.schema.js';
import { ProductId } from '../../domain/value-objects/product-id.vo.js';
import { Sku } from '../../domain/value-objects/sku.vo.js';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';
import { and, eq, gte, SQL } from 'drizzle-orm';

export class DrizzleProductRepository implements ProductRepository {
  constructor(@Inject('DRIZZLE_CLIENT') private readonly db: DrizzleDB) {}

  async save(product: Product): Promise<void> {
    const rawData = DrizzleProductRepository.toPersistence(product);

    await this.db
      .insert(products)
      .values(rawData)
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: rawData.name,
          description: rawData.description,
          sku: rawData.sku,
          priceAmount: rawData.priceAmount,
          priceCurrency: rawData.priceCurrency,
          stockQuantity: rawData.stockQuantity,
          isActive: rawData.isActive,
          lowStockThreshold: rawData.lowStockThreshold,
          updatedAt: new Date(),
        },
      });
  }

  async findById(id: ProductId): Promise<Product | null> {
    const rows = await this.db
      .select()
      .from(products)
      .where(eq(products.id, id.getValue()));

    if (rows.length === 0) return null;

    return DrizzleProductRepository.toDomain(rows[0]);
  }

  async findAll(filters: ProductFilters): Promise<Product[]> {
    const conditions: SQL[] = [];

    if (filters?.isActive !== undefined) {
      conditions.push(eq(products.isActive, filters.isActive));
    }

    if (filters?.minPrice !== undefined) {
      conditions.push(
        gte(products.priceAmount, Math.round(filters.minPrice * 100)),
      );
    }

    if (filters?.maxPrice !== undefined) {
      conditions.push(
        gte(products.priceAmount, Math.round(filters.maxPrice * 100)),
      );
    }

    const query = this.db.select().from(products);

    const productRows =
      conditions.length > 0
        ? await query.where(and(...conditions))
        : await query;

    return productRows.map(DrizzleProductRepository.toDomain);
  }

  private static toPersistence(product: Product): typeof products.$inferSelect {
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

  private static toDomain(raw: typeof products.$inferSelect): Product {
    return Product.reconstitute({
      id: new ProductId(raw.id),
      name: raw.name,
      description: raw.description,
      sku: Sku.create(raw.sku),
      price: Money.create(raw.priceAmount / 100, raw.priceCurrency),
      stock: raw.stockQuantity,
      isActive: raw.isActive,
      lowStockThreshold: raw.lowStockThreshold,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
