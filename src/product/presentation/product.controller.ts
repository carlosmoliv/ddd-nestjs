import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto.js';
import { ProductResponseDto } from './dtos/product-response.dto.js';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProductCommand } from '../application/use-cases/create-product/create-product.command.js';
import { ListProductQuery } from '../application/queries/list-product.query.js';
import { Product } from '../domain/entities/product.entity.js';

@Controller('products')
export class ProductController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateProductDto): Promise<void> {
    await this.commandBus.execute(
      new CreateProductCommand(
        dto.name,
        dto.description,
        dto.sku,
        dto.price,
        dto.currency,
        dto.stock,
      ),
    );
  }

  @Get()
  async findAll(
    @Query('isActive') isActive?: boolean,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ): Promise<ProductResponseDto[]> {
    const products = await this.queryBus.execute<ListProductQuery, Product[]>(
      new ListProductQuery(
        isActive !== undefined ? isActive : undefined,
        minPrice !== undefined ? parseFloat(minPrice) : undefined,
        maxPrice !== undefined ? parseFloat(maxPrice) : undefined,
      ),
    );
    return products.map(ProductResponseDto.fromDomain);
  }
}
