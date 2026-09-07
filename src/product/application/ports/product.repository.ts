import { Product } from '../../domain/entities/product.entity.js';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductFilters {
  isActive?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(filters: ProductFilters): Promise<Product[]>;
}
