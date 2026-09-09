import {
  pgTable,
  uuid,
  integer,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  sku: varchar('sku', { length: 100 }).notNull(),
  priceAmount: integer('price_amount').notNull(),
  priceCurrency: varchar('price_currency', { length: 3 })
    .notNull()
    .default('USD'),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  lowStockThreshold: integer('low_stock_threshold').notNull().default(5),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
