import { Inject, Injectable } from '@nestjs/common';
import {
  ProductFilters,
  ProductRepository,
} from '../../application/ports/product.repository.js';
import { Product } from '../../domain/entities/product.entity.js';
import { Collection, Db } from 'mongodb';
import { MONGO_DB } from '../../../shared/infra/database/mongo/mongo.provider.js';
import { ProductId } from '../../domain/value-objects/product-id.vo.js';
import { Sku } from '../../domain/value-objects/sku.vo.js';
import { Money } from '../../../shared/domain/value-objects/money.vo.js';

interface ProductDocument {
  _id: string;
  name: string;
  description: string;
  sku: string;
  priceAmount: number;
  priceCurrency: string;
  stockQuantity: number;
  isActive: boolean;
  lowStockThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class MongoProductRepository implements ProductRepository {
  private readonly collection: Collection<ProductDocument>;

  constructor(@Inject(MONGO_DB) private readonly db: Db) {
    this.collection = this.db.collection<ProductDocument>('products');
  }

  async save(product: Product): Promise<void> {
    const productDoc = MongoProductRepository.toPersistence(product);
    await this.collection.updateOne(
      { _id: productDoc._id },
      { $set: productDoc },
      { upsert: true },
    );
  }

  async findById(id: ProductId): Promise<Product | null> {
    const productDoc = await this.collection.findOne({ _id: id.getValue() });
    return productDoc ? MongoProductRepository.toDomain(productDoc) : null;
  }

  async findBySku(sku: Sku): Promise<Product | null> {
    const productDoc = await this.collection.findOne({ sku: sku.getValue() });
    return productDoc ? MongoProductRepository.toDomain(productDoc) : null;
  }

  async findByName(name: string): Promise<Product | null> {
    const productDoc = await this.collection.findOne({ name });
    return productDoc ? MongoProductRepository.toDomain(productDoc) : null;
  }

  async findAll(filters: ProductFilters): Promise<Product[]> {
    const query: any = {};

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      query.priceAmount = {};

      if (filters?.minPrice !== undefined) {
        query.priceAmount.$gte = Math.round(filters.minPrice * 100);
      }
      if (filters?.maxPrice !== undefined) {
        query.priceAmount.$lte = Math.round(filters.maxPrice * 100);
      }
    }

    const productDocs = await this.collection.find(query).toArray();
    return productDocs.map(MongoProductRepository.toDomain);
  }

  async delete(id: ProductId): Promise<void> {
    await this.collection.deleteOne({ _id: id.getValue() });
  }

  private static toPersistence(product: Product): ProductDocument {
    return {
      _id: product.id.getValue(),
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

  private static toDomain(raw: ProductDocument): Product {
    return Product.reconstitute({
      id: new ProductId(raw._id),
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
